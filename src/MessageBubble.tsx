import { useState } from 'react'
import { motion } from 'framer-motion'
import { FiCopy, FiCheck } from 'react-icons/fi'
import './MessageBubble.css'

interface Props {
  sender: 'user' | 'ai'
  text: string
  image?: string // ⬅️ tambah image opsional
}

const MessageBubble = ({ sender, text, image }: Props) => {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <motion.div
  initial={{ opacity: 0, y: 10 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.2 }}
  className={`bubble-wrapper ${sender}`}
>
  <div className="bubble-content">
    {image && (
      <img src={image} alt="Uploaded" className="bubble-image-outside" />
    )}

    <div className={`bubble ${sender}`}>
      <div className="bubble-actions">
        <button onClick={handleCopy} className="action-btn" title="Copy">
          {copied ? <FiCheck /> : <FiCopy />}
        </button>
      </div>
      <span>{text}</span>
    </div>
  </div>
</motion.div>

  )
}

export default MessageBubble
