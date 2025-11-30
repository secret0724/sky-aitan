// Sidebar.tsx
import { useEffect, useRef, useState } from 'react'
import {
  FiMessageCircle,
  FiMoreVertical,
  FiEdit2,
  FiTrash2,
  FiSearch,
  FiStar
} from 'react-icons/fi'
import { TbMessagePlus } from 'react-icons/tb'
import './Sidebar.css'

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
  onNewChat: () => void
  onSelectHistory: (id: string) => void
  onRename: (id: string, title: string) => void
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
  const [editedTitle, setEditedTitle] = useState("")
  const [searchTerm] = useState("")

  const sidebarRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (editingId && inputRef.current) inputRef.current.focus()
  }, [editingId])

  const filtered = history.sort((a, b) =>
    (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0)
  )

  return (
    <aside ref={sidebarRef} className={`sidebar ${isOpen ? "open" : ""}`}>
      <div className="sidebar-header">
        <img src="/logo/Skyra-N1.png" style={{ height: 30 }} />
      </div>

      <button className="newchat-btn" onClick={onNewChat}>
        <TbMessagePlus /> New Chat
      </button>

      <button className="history-toggle" onClick={() => setShowHistory(!showHistory)}>
        <FiMessageCircle /> History {showHistory ? "▾" : "▸"}
      </button>

      {showHistory && (
        <ul className="history-list">
          {filtered.map(item => (
            <li key={item.id} className="history-item">
              {editingId === item.id ? (
                <input
                  ref={inputRef}
                  className="edit-input"
                  value={editedTitle}
                  onChange={(e) => setEditedTitle(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      onRename(item.id, editedTitle)
                      setEditingId(null)
                    }
                  }}
                  onBlur={() => {
                    onRename(item.id, editedTitle)
                    setEditingId(null)
                  }}
                />
              ) : (
                <div className="title" onClick={() => onSelectHistory(item.id)}>
                  {item.title}
                </div>
              )}

              <div className="actions">
                <FiStar
                  className={`pin-icon ${item.pinned ? "pinned" : ""}`}
                  onClick={() => onTogglePin(item.id)}
                />

                <FiMoreVertical onClick={() =>
                  setMenuOpenId(menuOpenId === item.id ? null : item.id)
                } />

                {menuOpenId === item.id && (
                  <div className="dropdown">
                    <div onClick={() => {
                      setEditingId(item.id)
                      setEditedTitle(item.title)
                      setMenuOpenId(null)
                    }}>
                      <FiEdit2 /> Rename
                    </div>
                    <div onClick={() => {
                      onDelete(item.id)
                      setMenuOpenId(null)
                    }}>
                      <FiTrash2 /> Delete
                    </div>
                  </div>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </aside>
  )
}

export default Sidebar
