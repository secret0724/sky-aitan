// ChatPage.tsx
import { useState, useEffect, useRef } from 'react'
import { FiX, FiMenu } from 'react-icons/fi'
import { IoIosMic } from 'react-icons/io'
import { IoSend } from 'react-icons/io5'
import { FaUpload } from 'react-icons/fa'
import MessageBubble from '../MessageBubble'
import Sidebar from '../components/Sidebar'
import UserPanel from '../components/UserPanel'
import AboutModal from '../components/AboutModal'
import HelpModal from '../components/HelpModal'
import SettingsModal from '../components/SettingsModal'
import ProfileModal from '../components/ProfileModal'
import './ChatPage.css'
import { chatWithAI, generateTitle } from "../lib/chatWithAI"

interface Message {
  sender: "user" | "ai"
  text: string
  image?: string
  timestamp: string
}

interface HistoryItem {
  id: string
  title: string
  messages: Message[]
  userEmail: string
  pinned?: boolean
}

const ChatPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)

  const [aboutOpen, setAboutOpen] = useState(false)
  const [helpOpen, setHelpOpen] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)

  const [input, setInput] = useState("")
  const [messages, setMessages] = useState<Message[]>([])
  const [history, setHistory] = useState<HistoryItem[]>([])
  const [activeId, setActiveId] = useState<string | null>(null)

  const [isAITyping, setIsAITyping] = useState(false)

  const [previewImage, setPreviewImage] = useState<string | null>(null)
  const [imageCaption, setImageCaption] = useState("")

  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const messagesEndRef = useRef<HTMLDivElement | null>(null)
  const textareaRef = useRef<HTMLTextAreaElement | null>(null)

  const user = JSON.parse(localStorage.getItem("user") || "{}")
  const email = user.email || "unknown@skyra.com"

  // ==========================
  // LOAD HISTORY
  // ==========================
  useEffect(() => {
    const saved = localStorage.getItem("skyaitan-all-history")
    if (saved) {
      const parsed: HistoryItem[] = JSON.parse(saved)
      const filtered = parsed.filter(h => h.userEmail === email)
      setHistory(filtered)

      if (filtered.length > 0) {
        setMessages(filtered[0].messages)
        setActiveId(filtered[0].id)
      } else {
        handleNewChat()
      }
    } else {
      handleNewChat()
    }
  }, [email])

  // ==========================
  // SAVE HISTORY
  // ==========================
  const saveHistory = (newHistory: HistoryItem[]) => {
    const saved = localStorage.getItem("skyaitan-all-history")
    const parsed: HistoryItem[] = saved ? JSON.parse(saved) : []

    const updated = [
      ...parsed.filter(h => h.userEmail !== email),
      ...newHistory
    ]

    localStorage.setItem("skyaitan-all-history", JSON.stringify(updated))
    setHistory(newHistory)
  }

  // ==========================
  // NEW CHAT
  // ==========================
  const handleNewChat = () => {
    const newId = Date.now().toString()

    const welcomeMsg: Message = {
      sender: "ai",
      text: "Halo, aku Skyra! Ada yang bisa aku bantu?",
      timestamp: new Date().toISOString()
    }

    const newChat: HistoryItem = {
      id: newId,
      title: "Chat Baru",
      messages: [welcomeMsg],
      userEmail: email
    }

    const newHistory = [newChat, ...history]
    saveHistory(newHistory)

    setMessages(newChat.messages)
    setActiveId(newId)
  }

  // ==========================
  // SEND TEXT
  // ==========================
  const handleSend = async () => {
    if (!input.trim()) return

    const userMsg: Message = {
      sender: "user",
      text: input,
      timestamp: new Date().toISOString()
    }

    const updated = [...messages, userMsg]
    setMessages(updated)
    setInput("")
    setIsAITyping(true)

    const aiText = await chatWithAI(input)

    const aiMsg: Message = {
      sender: "ai",
      text: aiText,
      timestamp: new Date().toISOString()
    }

    const final = [...updated, aiMsg]
    setMessages(final)
    setIsAITyping(false)

    updateHistoryMessages(final)
  }

  // ==========================
  // SEND IMAGE
  // ==========================
  const handleSendImage = async () => {
    if (!previewImage) return

    const userMsg: Message = {
      sender: "user",
      text: imageCaption,
      image: previewImage,
      timestamp: new Date().toISOString()
    }

    const updated = [...messages, userMsg]
    setMessages(updated)

    const aiReply = await chatWithAI(imageCaption || "Analisis gambar ini", previewImage)

    const aiMsg: Message = {
      sender: "ai",
      text: aiReply,
      timestamp: new Date().toISOString()
    }

    const final = [...updated, aiMsg]
    setMessages(final)

    setPreviewImage(null)
    setImageCaption("")
    updateHistoryMessages(final)
  }

  const updateHistoryMessages = async (finalMessages: Message[]) => {
    const newHistory = history.map(item =>
      item.id === activeId ? { ...item, messages: finalMessages } : item
    )

    saveHistory(newHistory)

    // update title if still default
    const current = newHistory.find(h => h.id === activeId)
    if (current && current.title === "Chat Baru" && finalMessages.length > 1) {
      const firstUserMsg = finalMessages.find(m => m.sender === "user")
      if (firstUserMsg) {
        const title = await generateTitle(firstUserMsg.text)
        handleRename(activeId!, title)
      }
    }
  }

  // ==========================
  // SIDEBAR ACTIONS
  // ==========================
  const handleDelete = (id: string) => {
    const filtered = history.filter(h => h.id !== id)
    saveHistory(filtered)

    if (id === activeId) {
      if (filtered.length > 0) {
        setActiveId(filtered[0].id)
        setMessages(filtered[0].messages)
      } else {
        handleNewChat()
      }
    }
  }

  const handleRename = (id: string, title: string) => {
    const updated = history.map(h =>
      h.id === id ? { ...h, title } : h
    )
    saveHistory(updated)
  }

  const handleTogglePin = (id: string) => {
    const updated = history.map(h =>
      h.id === id ? { ...h, pinned: !h.pinned } : h
    )
    saveHistory(updated)
  }

  const handleSelectHistory = (id: string) => {
    const item = history.find(h => h.id === id)
    if (item) {
      setActiveId(id)
      setMessages(item.messages)
    }
    setSidebarOpen(false)
  }

  // ==========================
  // IMAGE HANDLER
  // ==========================
  const handleFileChange = (e: any) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onloadend = () => setPreviewImage(reader.result as string)
    reader.readAsDataURL(file)
  }

  // ==========================
  // SCROLL BOTTOM
  // ==========================
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  return (
    <div className={`chat-layout ${sidebarOpen ? "sidebar-open" : ""}`}>
      {/* SIDEBAR */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onNewChat={handleNewChat}
        history={history}
        onSelectHistory={handleSelectHistory}
        onRename={handleRename}
        onDelete={handleDelete}
        onTogglePin={handleTogglePin}
      />

      {/* USER PANEL */}
      <UserPanel
        isOpen={userMenuOpen}
        onClose={() => setUserMenuOpen(false)}
        email={email}
        onLogout={() => {
          localStorage.removeItem("user")
          window.location.href = "/login"
        }}
        onOpenAbout={() => setAboutOpen(true)}
        onOpenHelp={() => setHelpOpen(true)}
        onOpenSettings={() => setSettingsOpen(true)}
      />

      {/* MODALS */}
      <AboutModal isOpen={aboutOpen} onClose={() => setAboutOpen(false)} />
      <HelpModal isOpen={helpOpen} onClose={() => setHelpOpen(false)} />
      <SettingsModal
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        onOpenProfile={() => {
          setSettingsOpen(false)
          setProfileOpen(true)
        }}
      />
      <ProfileModal
  isOpen={profileOpen}
  onClose={() => setProfileOpen(false)}
  onBack={() => {
    setProfileOpen(false)
    setSettingsOpen(true) // balik ke settings lagi kalau mau
  }}
  email={email}
/>


      {/* MAIN CHAT */}
      <main className="chat-main">
        <header className="chat-header">
          <button className="menu-btn" onClick={() => setSidebarOpen(true)}>
            <FiMenu />
          </button>

          <img src="/logo/Skyra-N1.png" style={{ height: 30 }} />

          <button className="user-btn" onClick={() => setUserMenuOpen(true)}>
            <img src="/logo/Skyra-L1.png" style={{ height: 35 }} />
          </button>
        </header>

        <div className="chat-messages">
          {messages.map((m, i) => (
            <MessageBubble key={i} sender={m.sender} text={m.text} image={m.image} />
          ))}

          {isAITyping && (
            <div className="typing-indicator">
              <span></span><span></span><span></span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* INPUT */}
        <div className="chat-input-container">
          <div className="chat-input-inner">
            {previewImage && (
              <div className="image-preview-wrapper">
                <img src={previewImage} className="image-preview" />
                <button className="close-btn" onClick={() => setPreviewImage(null)}>
                  <FiX />
                </button>
              </div>
            )}

            <textarea
              ref={textareaRef}
              placeholder={previewImage ? "Tulis caption gambar..." : "Message Skyra..."}
              value={previewImage ? imageCaption : input}
              onChange={(e) =>
                previewImage ? setImageCaption(e.target.value) : setInput(e.target.value)
              }
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault()
                  previewImage ? handleSendImage() : handleSend()
                }
              }}
              rows={1}
              className="floating-input"
            />

            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              style={{ display: "none" }}
              onChange={handleFileChange}
            />

            <div className="button-row">
              <button className="icon-btn" onClick={() => fileInputRef.current?.click()}>
                <FaUpload />
              </button>

              <button className="icon-btn">
                <IoIosMic />
              </button>

              <button className="send-btn" onClick={previewImage ? handleSendImage : handleSend}>
                <IoSend />
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default ChatPage
