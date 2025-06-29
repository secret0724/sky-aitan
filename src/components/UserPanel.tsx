import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  FiXCircle,
  FiLogOut,
  FiHelpCircle,
  FiUser,
  FiSettings,
  FiInfo,
  FiLogIn
} from 'react-icons/fi'
import './UserPanel.css'

interface Props {
  isOpen: boolean
  onClose: () => void
  email: string
  onLogout: () => void
  onOpenAbout: () => void
  onOpenHelp: () => void
  onOpenSettings: () => void
}

const UserPanel = ({ isOpen, onClose, email, onLogout, onOpenAbout, onOpenHelp, onOpenSettings }: Props) => {
  const panelRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()
  const isLoggedIn = !!email && email !== 'user@skyaitan.com'

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        onClose()
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleOutsideClick)
    } else {
      document.removeEventListener('mousedown', handleOutsideClick)
    }
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick)
    }
  }, [isOpen, onClose])

  return (
    <div ref={panelRef} className={`user-panel ${isOpen ? 'open' : ''}`}>
      <div className="user-panel-header">
        <button onClick={onClose} className="close-btn"><FiXCircle /></button>
      </div>
      <div className="user-panel-content">
        <div
          className="user-email"
          style={{ cursor: !isLoggedIn ? 'pointer' : 'default' }}
          onClick={() => !isLoggedIn && navigate('/login')}
        >
          {isLoggedIn ? <><FiUser /> {email}</> : <><FiLogIn /> Login</>}
        </div>

        <hr />
        <button onClick={onOpenSettings}><FiSettings /> Pengaturan</button>
        <button onClick={onOpenAbout}><FiInfo /> Tentang Skyra</button>
        <button onClick={onOpenHelp}><FiHelpCircle /> Bantuan</button>
        {isLoggedIn && (
          <button onClick={onLogout}><FiLogOut /> Logout</button>
        )}
      </div>
    </div>
  )
}

export default UserPanel
