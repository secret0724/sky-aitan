import { useState, useEffect, useRef } from 'react'
import { FiMenu, FiUser } from 'react-icons/fi'
import MessageBubble from '../MessageBubble'
import Sidebar from '../components/Sidebar'
import UserPanel from '../components/UserPanel'
import './ChatPage.css'

interface Message {
  sender: 'user' | 'ai'
  text: string
  timestamp?: string
}

interface HistoryItem {
  id: string
  title: string
  messages: Message[]
  userEmail: string
}

const ChatPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState<Message[]>([])
  const [history, setHistory] = useState<HistoryItem[]>([])
  const [activeId, setActiveId] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement | null>(null)

  const user = JSON.parse(localStorage.getItem('user') || '{}')
  const email = user.email || 'user@skyaitan.com'
  const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY

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

  const handleNewChat = () => {
    const newId = Date.now().toString()
    const welcomeMsg: Message = {
      sender: 'ai',
      text: 'Halo, aku SkyAiTan! Ada yang bisa aku bantu?',
      timestamp: new Date().toISOString()
    }
    const newItem: HistoryItem = {
      id: newId,
      title: 'Chat Baru',
      messages: [welcomeMsg],
      userEmail: email
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

    const tempHistory = history.map(item =>
      item.id === activeId ? { ...item, messages: updatedMessages } : item
    )
    saveHistory(tempHistory)

    try {
      const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'openai/gpt-3.5-turbo',
          messages: [
            { role: 'system', content: 'Kamu adalah asisten virtual bernama SkyAiTan.' },
            ...updatedMessages.map(msg => ({
              role: msg.sender === 'user' ? 'user' : 'assistant',
              content: msg.text
            }))
          ]
        })
      })

      const data = await res.json()
      console.log('RESPON AI:', data)

      if (data.error) {
        console.error('ERROR AI:', data.error)
        throw new Error(data.error.message || 'Gagal respon dari OpenRouter')
      }

      const aiText = data.choices?.[0]?.message?.content || 'Maaf, AI tidak memberikan balasan.'

      const aiMsg: Message = {
        sender: 'ai',
        text: aiText,
        timestamp: new Date().toISOString()
      }

      const finalMessages = [...updatedMessages, aiMsg]
      setMessages(finalMessages)

      const updatedHistory = history.map(item =>
        item.id === activeId ? { ...item, messages: finalMessages } : item
      )
      saveHistory(updatedHistory)
    } catch (err: any) {
      console.error('CATCH ERROR:', err)
      const errMsg: Message = {
        sender: 'ai',
        text: 'Maaf, tidak dapat terhubung ke AI.',
        timestamp: new Date().toISOString()
      }
      const finalMessages = [...updatedMessages, errMsg]
      setMessages(finalMessages)
    }
  }

  const handleRename = (id: string) => {
    const newTitle = prompt('Ganti nama chat:')
    if (!newTitle) return
    const updated = history.map(item =>
      item.id === id ? { ...item, title: newTitle } : item
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

  const handleLogout = () => {
    localStorage.removeItem('user')
    window.location.href = '/login'
  }

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  return (
    <div className={`chat-layout ${sidebarOpen ? 'sidebar-open' : ''} ${userMenuOpen ? 'user-open' : ''}`}>
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onNewChat={handleNewChat}
        onSelectHistory={handleSelectHistory}
        history={history}
        onRename={handleRename}
        onDelete={handleDelete}
      />

      <UserPanel
        isOpen={userMenuOpen}
        onClose={() => setUserMenuOpen(false)}
        email={email}
        onLogout={handleLogout}
      />

      <main className="chat-main">
        <header className="chat-header">
          <button className="menu-btn" onClick={() => setSidebarOpen(true)}><FiMenu /></button>
          <div className="header-title">SkyAiTan</div>
          <button className="user-btn" onClick={() => setUserMenuOpen(true)}><FiUser /></button>
        </header>

        <div className="chat-messages">
          {messages.map((msg, idx) => (
            <MessageBubble key={idx} sender={msg.sender} text={msg.text} />
          ))}
          <div ref={messagesEndRef} />
        </div>

        <div className="chat-input">
          <input
            type="text"
            placeholder="Tulis pesan..."
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSend()}
          />
          <button onClick={handleSend}>Kirim</button>
        </div>
      </main>
    </div>
  )
}

export default ChatPage
