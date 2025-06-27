import './UserPanel.css'
import { FiX, FiLogOut, FiHelpCircle, FiUser } from 'react-icons/fi'

interface Props {
  isOpen: boolean
  onClose: () => void
  email: string
  onLogout: () => void
}

const UserPanel = ({ isOpen, onClose, email, onLogout }: Props) => {
  return (
    <div className={`user-panel ${isOpen ? 'open' : ''}`}>
      <div className="user-panel-header">
        <button onClick={onClose} className="close-btn"><FiX /></button>
      </div>
      <div className="user-panel-content">
        <div className="user-email"><FiUser /> {email}</div>
        <button><FiHelpCircle /> Bantuan</button>
        <button onClick={onLogout}><FiLogOut /> Logout</button>
      </div>
    </div>
  )
}

export default UserPanel
