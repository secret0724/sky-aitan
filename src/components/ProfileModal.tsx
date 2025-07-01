// components/ProfileModal.tsx
import './ProfileModal.css'
import { FiArrowLeft, FiXCircle, FiUser } from 'react-icons/fi'

interface ProfileModalProps {
  isOpen: boolean
  onClose: () => void
  onBack: () => void
  email: string
}

const ProfileModal = ({ isOpen, onClose, onBack, email }: ProfileModalProps) => {
  if (!isOpen) return null

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <button className="back-btn" onClick={onBack}><FiArrowLeft /></button>
          <button className="close-btn" onClick={onClose}><FiXCircle /></button>
        </div>
        <h2><FiUser style={{ marginRight: 8 }} /> Profil Saya</h2>

        <div className="profile-section">
          <label>Email:</label>
          <input type="text" value={email} />
        </div>

        <div className="profile-section">
          <label>Nama Tampilan:</label>
          <input type="text" value="Skyra User" disabled />
        </div>

        <p style={{ fontSize: '13px', marginTop: '12px', color: '#888' }}>
          Pengelolaan akun akan tersedia di versi mendatang.
        </p>
      </div>
    </div>
  )
}

export default ProfileModal
