// MessageBubble.tsx
import './MessageBubble.css'

interface Props {
  sender: 'user' | 'ai'
  text: string
}

const MessageBubble = ({ sender, text }: Props) => {
  return (
    <div className={`bubble-wrapper ${sender}`}>
      <div className={`bubble ${sender}`}>
        {text}
      </div>
    </div>
  )
}

export default MessageBubble
