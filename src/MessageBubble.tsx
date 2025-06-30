// MessageBubble.tsx
import { useState } from 'react'
import { motion } from 'framer-motion'
import { FiEdit2, FiCopy, FiCheck } from 'react-icons/fi'
import './MessageBubble.css'

interface Props {
  sender: 'user' | 'ai'
  text: string
}

const MessageBubble = ({ sender, text }: Props) => {
  const [isEditing, setIsEditing] = useState(false)
  const [editedText, setEditedText] = useState(text)
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  const handleEditToggle = () => {
    if (isEditing) {
      setEditedText(editedText.trim() || text)
    }
    setIsEditing(!isEditing)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className={`bubble-wrapper ${sender}`}
    >
      <div className={`bubble ${sender}`}>
        {isEditing ? (
          <textarea
            className="edit-input"
            value={editedText}
            onChange={(e) => setEditedText(e.target.value)}
          />
        ) : (
          <span>{editedText}</span>
        )}

        <div className="bubble-actions">
          <button onClick={handleEditToggle} className="action-btn" title="Edit">
            <FiEdit2 />
          </button>
          <button onClick={handleCopy} className="action-btn" title="Copy">
            {copied ? <FiCheck /> : <FiCopy />}
          </button>
        </div>
      </div>
    </motion.div>
  )
}

export default MessageBubble
