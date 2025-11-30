// ChatPage.tsx
import { useState, useEffect, useRef } from 'react'
import { FiX, FiMenu } from 'react-icons/fi'
import { IoIosMic } from 'react-icons/io'
import { IoSend } from 'react-icons/io5'
import { FaUpload } from 'react-icons/fa'
import axios from 'axios'
import MessageBubble from '../MessageBubble'
import Sidebar from '../components/Sidebar'
import UserPanel from '../components/UserPanel'
import AboutModal from '../components/AboutModal'
import HelpModal from '../components/HelpModal'
import SettingsModal from '../components/SettingsModal'
import ProfileModal from '../components/ProfileModal'
import ImageWarningModal from '../components/ImageWarningModal'
import { sendImageToVisionAI } from '../lib/chatWithAI'
import './ChatPage.css'

interface Message {
  sender: 'user' | 'ai'
  text: string
  image?: string
  timestamp?: string
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
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState<Message[]>([])
  const [history, setHistory] = useState<HistoryItem[]>([])
  const [activeId, setActiveId] = useState<string | null>(null)
  const [isAITyping, setIsAITyping] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [uploadWarningOpen, setUploadWarningOpen] = useState(false)
  const [modeAI, setModeAI] = useState<'chat' | 'vision'>(() => localStorage.getItem('skyra-mode') === 'vision' ? 'vision' : 'chat')
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const [previewImage, setPreviewImage] = useState<string | null>(null)
  const [imageCaption, setImageCaption] = useState('')
  const [isSendingImage, setIsSendingImage] = useState(false)
  const recognitionRef = useRef<any>(null)
  const messagesEndRef = useRef<HTMLDivElement | null>(null)
  const textareaRef = useRef<HTMLTextAreaElement | null>(null)

  const user = JSON.parse(localStorage.getItem('user') || '{}')
  const email = user.email || null

  useEffect(() => {
    const saved = localStorage.getItem('skyaitan-all-history')
    if (saved) {
      const parsed: HistoryItem[] = JSON.parse(saved).filter(
        (item: HistoryItem) => item.userEmail === email
      )
      setHistory(parsed)
      if (parsed.length > 0) {
        setMessages(parsed[0].messages)
        setActiveId(parsed[0].id)
      } else {
        handleNewChat()
      }
    } else {
      handleNewChat()
    }
  }, [email])

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
    }
  }, [input])

  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition
      const recognition = new SpeechRecognition()
      recognition.lang = 'id-ID'
      recognition.continuous = false
      recognition.interimResults = false

      recognition.onstart = () => setIsRecording(true)
      recognition.onend = () => setIsRecording(false)
      recognition.onerror = () => setIsRecording(false)

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript
        setInput(prev => prev + (prev ? ' ' : '') + transcript)
      }

      recognitionRef.current = recognition
    }
  }, [])

  const handleMicClick = () => {
    if (!recognitionRef.current) return
    if (isRecording) {
      recognitionRef.current.stop()
    } else {
      recognitionRef.current.start()
    }
  }

  const handleUploadClick = () => {
  if (modeAI === 'chat') {
    setUploadWarningOpen(true)
  } else {
    fileInputRef.current?.click()
  }
}

  const handleModeChange = (newMode: 'chat' | 'vision') => {
    setModeAI(newMode)
    localStorage.setItem('skyra-mode', newMode)
  }

  const saveHistory = (newHistory: HistoryItem[]) => {
    const allSaved = localStorage.getItem('skyaitan-all-history')
    const parsed: HistoryItem[] = allSaved ? JSON.parse(allSaved) : []
    const updated = [
      ...parsed.filter((item: HistoryItem) => item.userEmail !== email),
      ...newHistory
    ]
    localStorage.setItem('skyaitan-all-history', JSON.stringify(updated))
    setHistory(newHistory)
  }

  const generateTitle = async (messages: Message[]) => {
    const prompt = `Ringkas percakapan ini dalam 3-5 kata untuk dijadikan judul:\n${messages.map(m => `${m.sender === 'user' ? 'User' : 'AI'}: ${m.text}`).join('\n')}`

    try {
      const res = await axios.post('/api/chat', {
        messages: [
          { role: 'system', content: 'Buat ringkasan singkat dalam 3-5 kata untuk dijadikan judul chat.' },
          { role: 'user', content: prompt }
        ]
      })

      const title = res.data.choices?.[0]?.message?.content?.trim()
      return title || 'Chat Baru'
    } catch (err) {
      console.error('Gagal buat judul:', err)
      return 'Chat Baru'
    }
  }

  const handleNewChat = () => {
    const newId = Date.now().toString()
    const welcomeMsg: Message = {
      sender: 'ai',
      text: 'Halo, aku Skyra! Ada yang bisa aku bantu?',
      timestamp: new Date().toISOString()
    }
    const newItem: HistoryItem = {
      id: newId,
      title: 'Chat Baru',
      messages: [welcomeMsg],
      userEmail: email || 'unknown@skyra.com'
    }
    const updated = [newItem, ...history]
    saveHistory(updated)
    setMessages(newItem.messages)
    setActiveId(newId)
  }

  const handleSelectHistory = (id: string) => {
    const selected = history.find(h => h.id === id)
    if (selected) {
      setMessages(selected.messages)
      setActiveId(id)
    }
    setSidebarOpen(false)
  }

  const handleSend = async () => {
    if (!input.trim()) return
    const newMsg: Message = {
      sender: 'user',
      text: input,
      timestamp: new Date().toISOString()
    }

    const updatedMessages = [...messages, newMsg]
    setMessages(updatedMessages)
    setInput('')
    setIsAITyping(true)

    const tempHistory = history.map(item =>
      item.id === activeId ? { ...item, messages: updatedMessages } : item
    )
    saveHistory(tempHistory)

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [
            { role: 'system', content: 'Kamu adalah asisten virtual bernama Skyra.' },
            ...updatedMessages.map(msg => ({
              role: msg.sender === 'user' ? 'user' : 'assistant',
              content: msg.text
            }))
          ]
        })
      })

      if (!res.ok) throw new Error(`Server error: ${res.status}`)

      const data = await res.json()
      if (data.error) throw new Error(data.error.message || 'Gagal respon dari OpenRouter')

      const aiText = data.choices?.[0]?.message?.content || 'Maaf, AI tidak memberikan balasan.'
      const aiMsg: Message = {
        sender: 'ai',
        text: aiText,
        timestamp: new Date().toISOString()
      }

      const finalMessages = [...updatedMessages, aiMsg]
      setMessages(finalMessages)
      setIsAITyping(false)

      let updatedHistory = history.map(item =>
        item.id === activeId ? { ...item, messages: finalMessages } : item
      )

      const activeItem = history.find(h => h.id === activeId)
      if (activeItem && activeItem.title === 'Chat Baru') {
        const newTitle = await generateTitle(finalMessages)
        updatedHistory = updatedHistory.map(item =>
          item.id === activeId ? { ...item, title: newTitle } : item
        )
      }

      saveHistory(updatedHistory)
    } catch (err: any) {
      console.error('CATCH ERROR:', err)
      const errMsg: Message = {
        sender: 'ai',
        text: 'Maaf, tidak dapat terhubung ke AI (server offline?).',
        timestamp: new Date().toISOString()
      }
      const finalMessages = [...updatedMessages, errMsg]
      setMessages(finalMessages)
      setIsAITyping(false)
    }
  }

  const handleRename = (id: string, newTitle: string) => {
    if (!newTitle.trim()) return
    const updated = history.map(item =>
      item.id === id ? { ...item, title: newTitle.trim() } : item
    )
    saveHistory(updated)
  }

  const handleDelete = (id: string) => {
    if (!confirm('Yakin ingin menghapus chat ini?')) return
    const updated = history.filter(item => item.id !== id)
    saveHistory(updated)
    if (activeId === id && updated.length > 0) {
      setMessages(updated[0].messages)
      setActiveId(updated[0].id)
    } else if (updated.length === 0) {
      handleNewChat()
    }
  }

  const handleTogglePin = (id: string) => {
    const updated = history.map(item =>
      item.id === id ? { ...item, pinned: !item.pinned } : item
    )
    const sorted = [...updated].sort((a, b) => {
      if (a.pinned && !b.pinned) return -1
      if (!a.pinned && b.pinned) return 1
      return 0
    })
    saveHistory(sorted)
  }

  const handleLogout = () => {
    localStorage.removeItem('user')
    window.location.href = '/login'
  }

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault()

    // Kirim pesan
    if (previewImage) {
      handleSendImage()
    } else {
      handleSend()
    }
  }
}

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0]
  if (!file) return

  const reader = new FileReader()
  reader.onloadend = () => {
    setPreviewImage(reader.result as string)
  }
  reader.readAsDataURL(file)
}

const handleSendImage = async () => {
  if (!previewImage) return

  const newMsg: Message = {
    sender: 'user',
    text: imageCaption,
    image: previewImage,
    timestamp: new Date().toISOString()
  }

  const updatedMessages = [...messages, newMsg]
  setMessages(updatedMessages)
  setPreviewImage(null)
  setImageCaption('')
  setIsSendingImage(true)

  try {
    const result = await sendImageToVisionAI(previewImage, imageCaption)

    const aiMsg: Message = {
      sender: 'ai',
      text: result || 'Maaf, tidak ada hasil analisis.',
      timestamp: new Date().toISOString()
    }

    const finalMessages = [...updatedMessages, aiMsg]
    setMessages(finalMessages)
    setIsSendingImage(false)

    const updatedHistory = history.map(item =>
      item.id === activeId ? { ...item, messages: finalMessages } : item
    )
    saveHistory(updatedHistory)
  } catch (err: any) {
    console.error('Vision error:', err)
    const errorMsg: Message = {
      sender: 'ai',
      text: err?.message || 'Gagal menganalisis gambar.',
      timestamp: new Date().toISOString()
    }
    setMessages([...updatedMessages, errorMsg])
    setIsSendingImage(false)
  }
}



  return (
    <div className={`chat-layout ${sidebarOpen ? 'sidebar-open' : ''} ${userMenuOpen ? 'user-open' : ''}`}>
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} onNewChat={handleNewChat} onSelectHistory={handleSelectHistory} history={history} onRename={handleRename} onDelete={handleDelete} onTogglePin={handleTogglePin} />
      <UserPanel isOpen={userMenuOpen} onClose={() => setUserMenuOpen(false)} email={email || ''} onLogout={handleLogout} onOpenAbout={() => setAboutOpen(true)} onOpenHelp={() => setHelpOpen(true)} onOpenSettings={() => setSettingsOpen(true)} />
      <AboutModal isOpen={aboutOpen} onClose={() => setAboutOpen(false)} />
      <HelpModal isOpen={helpOpen} onClose={() => setHelpOpen(false)} />
      <SettingsModal isOpen={settingsOpen} onClose={() => setSettingsOpen(false)} onOpenProfile={() => { setSettingsOpen(false); setProfileOpen(true) }} modeAI={modeAI} onChangeMode={handleModeChange} />
      <ProfileModal isOpen={profileOpen} onClose={() => setProfileOpen(false)} onBack={() => { setProfileOpen(false); setSettingsOpen(true) }} email={email} />
      <ImageWarningModal isOpen={uploadWarningOpen} onClose={() => setUploadWarningOpen(false)} onOpenSettings={() => { setUploadWarningOpen(false); setSettingsOpen(true) }} />

      <main className="chat-main">
        <header className="chat-header">
          <button className="menu-btn" onClick={() => setSidebarOpen(true)}><FiMenu /></button>
          <div className="sidebar-header">
            <img src="/logo/Skyra-N1.png" alt="Skyra Logo" style={{ height: '30px' }} />
          </div>
          <button className="user-btn" onClick={() => setUserMenuOpen(true)}>
            <img src="/logo/Skyra-L1.png" alt="Skyra Logo" style={{ height: '35px' }} />
          </button>
        </header>

        <div className="chat-messages">
  {messages.length === 1 && messages[0].sender === 'ai' && messages[0].text.includes('Skyra') ? (
    <div className="welcome-screen">
      <img src="/logo/Skyra-L1.png" alt="Skyra Logo" style={{ height: '80px' }} />
      <h1>Hi, I'm Skyra.</h1>
      <p>How can I help you today?</p>
    </div>
  ) : (
    <>
      {messages.map((msg, idx) => (
  <MessageBubble key={idx} sender={msg.sender} text={msg.text} image={msg.image} />
))}


      {isAITyping && (
        <div className="typing-indicator"><span></span><span></span><span></span></div>
      )}
    </>
  )}
  <div ref={messagesEndRef} />
</div>


{/* CHAT INPUT AREA */}
<div className="chat-input-container">
  <div className="chat-input-inner">
    {previewImage && (
      <div className="image-preview-wrapper">
        <img src={previewImage} alt="Preview" className="image-preview" />
        
        <button onClick={() => {
            setPreviewImage(null)
            setImageCaption('')
          }} className="close-btn"><FiX /></button>
      </div>
    )}

    <textarea
      ref={textareaRef}
      placeholder={previewImage ? "Tulis penjelasan gambar..." : "Message Skyra"}
      value={previewImage ? imageCaption : input}
      onChange={e => previewImage ? setImageCaption(e.target.value) : setInput(e.target.value)}
      onKeyDown={handleKeyDown}
      className="floating-input"
      rows={1}
    />

    <input
      type="file"
      accept="image/*"
      ref={fileInputRef}
      style={{ display: 'none' }}
      onChange={handleFileChange}
    />

    <div className="button-row">
      <button className="icon-btn" onClick={handleUploadClick}><FaUpload /></button>
      <button className={`icon-btn ${isRecording ? 'recording' : ''}`} onClick={handleMicClick}><IoIosMic /></button>
      <button
  className="send-btn"
  onClick={previewImage ? handleSendImage : handleSend}
  disabled={isSendingImage} // Disable pas loading kirim gambar
>
  {isSendingImage ? <IoSend /> : <IoSend />}
</button>

    </div>
  </div>
</div>
</main>
    </div>
  )
}

export default ChatPage
