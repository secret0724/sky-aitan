import './MessageBubble.css'

interface Props {
  sender: 'user' | 'ai'
  text: string
}

const MessageBubble = ({ sender, text }: Props) => {
  return (
    <div className={`bubble ${sender === 'user' ? 'user' : 'ai'}`}>
      {text}
    </div>
  )
}

export default MessageBubble
