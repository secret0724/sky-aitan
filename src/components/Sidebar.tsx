import { useEffect, useRef, useState } from 'react'
import {
  FiMessageCircle,
  FiMoreVertical,
  FiEdit2,
  FiTrash2,
  FiSearch,
  FiStar
} from 'react-icons/fi'
import './Sidebar.css'
import { TbMessagePlus } from 'react-icons/tb'


interface SidebarProps {
  isOpen: boolean
  onClose: () => void
  onNewChat: () => void
  onSelectHistory: (id: string) => void
  onRename: (id: string, newTitle: string) => void
  onDelete: (id: string) => void
  onTogglePin: (id: string) => void
  history: { id: string; title: string; pinned?: boolean }[]
}

const Sidebar = ({
  isOpen,
  onClose,
  onNewChat,
  onSelectHistory,
  onRename,
  onDelete,
  onTogglePin,
  history
}: SidebarProps) => {
  const [showHistory, setShowHistory] = useState(true)
  const [menuOpenId, setMenuOpenId] = useState<string | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editedTitle, setEditedTitle] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const sidebarRef = useRef<HTMLDivElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      const target = e.target as Node
      if (sidebarRef.current && !sidebarRef.current.contains(target)) {
        onClose()
      }
      if (menuRef.current && !menuRef.current.contains(target)) {
        setMenuOpenId(null)
      }
    }
    document.addEventListener('mousedown', handleOutsideClick)
    return () => document.removeEventListener('mousedown', handleOutsideClick)
  }, [onClose])

  useEffect(() => {
    if (editingId && inputRef.current) {
      inputRef.current.focus()
    }
  }, [editingId])

  const filteredHistory = history
    .filter(h => h.title.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0))

  const handleSaveEdit = (id: string) => {
    const newTitle = editedTitle.trim()
    if (newTitle) {
      onRename(id, newTitle)
    }
    setEditingId(null)
    setEditedTitle('')
  }

  return (
    <aside ref={sidebarRef} className={`sidebar ${isOpen ? 'open' : ''}`}>
      <div className="sidebar-header">
        <img
          src="/logo/Skyra-N1.png"
          alt="Skyra Logo"
          style={{ height: '30px' }}
        />
      </div>

      <div className="search-box">
        <FiSearch className="search-icon" />
        <input
          type="text"
          placeholder="Search chat history..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <button onClick={onNewChat}><TbMessagePlus /> New Chat</button>

      <div className="history-section">
        <button onClick={() => setShowHistory(!showHistory)}>
          <FiMessageCircle /> History {showHistory ? '▾' : '▸'}
        </button>

        {showHistory && (
          <ul className="history-list">
            {filteredHistory.map(item => (
              <li key={item.id} className="history-item">
                <div className="history-title">
                  {editingId === item.id ? (
                    <input
                      ref={inputRef}
                      className="edit-input"
                      value={editedTitle}
                      onChange={e => setEditedTitle(e.target.value)}
                      onBlur={() => handleSaveEdit(item.id)}
                      onKeyDown={e => {
                        if (e.key === 'Enter') handleSaveEdit(item.id)
                        if (e.key === 'Escape') {
                          setEditingId(null)
                          setEditedTitle('')
                        }
                      }}
                    />
                  ) : (
                    <div
                      className="title-wrapper"
                      onClick={() => onSelectHistory(item.id)}
                      title={item.title}
                    >
                      <div className="title-scroll">
                        <span>{item.title}</span>
                      </div>
                    </div>
                  )}
                  <div className="action-icons">
                    <FiStar
                      className={`pin-icon ${item.pinned ? 'pinned' : ''}`}
                      title="Pin Chat"
                      onClick={() => onTogglePin(item.id)}
                    />
                    <button
                      className="menu-icon"
                      onClick={() => {
                        setMenuOpenId(menuOpenId === item.id ? null : item.id)
                        setEditedTitle(item.title)
                      }}
                    >
                      <FiMoreVertical />
                    </button>
                  </div>
                </div>
                {menuOpenId === item.id && (
                  <div className="floating-menu" ref={menuRef}>
                    <button onClick={() => {
                      setEditingId(item.id)
                      setMenuOpenId(null)
                    }}>
                      <FiEdit2 /> Rename
                    </button>
                    <hr />
                    <button className="delete-btn" onClick={() => { onDelete(item.id); setMenuOpenId(null) }}>
                      <FiTrash2 /> Delete
                    </button>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </aside>
  )
}

export default Sidebar
