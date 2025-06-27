import { useState } from 'react'
import { FiX, FiPlus, FiMessageCircle, FiMoreVertical, FiEdit2, FiTrash2 } from 'react-icons/fi'
import './Sidebar.css'

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
  onNewChat: () => void
  onSelectHistory: (id: string) => void
  onRename: (id: string) => void
  onDelete: (id: string) => void
  history: { id: string; title: string }[]
}

const Sidebar = ({
  isOpen,
  onClose,
  onNewChat,
  onSelectHistory,
  onRename,
  onDelete,
  history
}: SidebarProps) => {
  const [showHistory, setShowHistory] = useState(true)
  const [menuOpenId, setMenuOpenId] = useState<string | null>(null)

  return (
    <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
      <div className="sidebar-header">
        <h2>SkyAiTan</h2>
        <button onClick={onClose} className="close-btn"><FiX /></button>
      </div>

      <button onClick={onNewChat}><FiPlus /> New Chat</button>

      <div className="history-section">
        <button onClick={() => setShowHistory(!showHistory)}>
          <FiMessageCircle /> History {showHistory ? '▾' : '▸'}
        </button>

        {showHistory && (
          <ul className="history-list">
            {history.map(item => (
              <li key={item.id} className="history-item">
                <div className="history-title">
                  <span onClick={() => onSelectHistory(item.id)}>{item.title}</span>
                  <button
                    className="menu-icon"
                    onClick={() => setMenuOpenId(menuOpenId === item.id ? null : item.id)}
                  >
                    <FiMoreVertical />
                  </button>
                </div>
                {menuOpenId === item.id && (
                  <div className="floating-menu">
                    <button onClick={() => { onRename(item.id); setMenuOpenId(null) }}>
                      <FiEdit2 /> Ganti Nama
                    </button>
                    <button className="delete-btn" onClick={() => { onDelete(item.id); setMenuOpenId(null) }}>
                      <FiTrash2 /> Hapus
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
