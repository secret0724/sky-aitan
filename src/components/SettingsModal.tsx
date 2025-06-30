// components/SettingsModal.tsx
import './SettingsModal.css'
import { FiXCircle, FiUser, FiSun } from "react-icons/fi";

interface SettingsModalProps {
  isOpen: boolean
  onClose: () => void
  onOpenProfile: () => void
}

const SettingsModal = ({ isOpen, onClose, onOpenProfile }: SettingsModalProps) => {
  if (!isOpen) return null

  return (
    <div className="modal-overlay" onClick={onClose}>
  <div className="modal-content" onClick={e => e.stopPropagation()}>
    <button className="close-btn" onClick={onClose}>
      <FiXCircle />
    </button>
    <h2>Setting</h2>

    {/* Info Akun */}
    <div className="settings-section">
        <button
        className="profile-access-btn"
        onClick={onOpenProfile}
        style={{ marginBottom: '16px' }}
        >
        <FiUser style={{ marginRight: 8 }} />
        Lihat Profil
        </button>
    </div>

    {/* Nama Tampilan */}
    <div className="settings-section">
      <label>Nama Tampilan (sementara):</label>
      <input type="text" placeholder="Belum bisa diganti" disabled />
    </div>

    {/* Mode Tema */}
    <div className="settings-section">
      <label><FiSun style={{ marginRight: '6px' }} /> Mode Tema:</label>
      <select disabled>
        <option>Terang (default)</option>
        <option>Gelap</option>
      </select>
    </div>

    <p style={{ fontSize: '13px', marginTop: '12px', color: '#888' }}>
      Mohon maaf atas ketidak nyamanannya. Beberapa fitur saat ini masih dalam tahap pengembangan.
    </p>
  </div>
</div>
  )
}

export default SettingsModal
