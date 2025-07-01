import './SettingsModal.css'
import { FiXCircle, FiUser, FiSun } from "react-icons/fi"
import { FiMessageSquare, FiImage } from 'react-icons/fi'

interface SettingsModalProps {
  isOpen: boolean
  onClose: () => void
  onOpenProfile: () => void
  modeAI: 'chat' | 'vision'
  onChangeMode: (mode: 'chat' | 'vision') => void
}

const SettingsModal = ({
  isOpen,
  onClose,
  onOpenProfile,
  modeAI,
  onChangeMode
}: SettingsModalProps) => {
  if (!isOpen) return null

  const user = JSON.parse(localStorage.getItem('user') || '{}')
  const isLoggedIn = !!user.email

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>
          <FiXCircle />
        </button>
        <h2>Setting</h2>

        {isLoggedIn && (
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
        )}

        <div className="settings-section">
          <label>Nama (masih tahap pengembangan):</label>
          <input type="text" placeholder="Skyra" disabled />
        </div>

        <div className="settings-section">
          <label><FiSun style={{ marginRight: '6px' }} /> Mode Tema:</label>
          <select disabled>
            <option>Terang (default)</option>
            <option>Gelap</option>
          </select>
        </div>

{/* Mode AI */}
<div className="settings-section ai-mode-section">
  <label>Skyra Mode:</label>
  <div className="mode-select-wrapper">
    <div className="mode-select-item">
      {modeAI === 'chat' ? (
        <FiMessageSquare className="mode-icon" />
      ) : (
        <FiImage className="mode-icon" />
      )}
      <select
        value={modeAI}
        onChange={e => onChangeMode(e.target.value as 'chat' | 'vision')}
      >
        <option value="chat">Skyra Mode Chat</option>
        <option value="vision">Skyra Mode Analisis Gambar</option>
      </select>
    </div>
    <span className="mode-desc">
      {modeAI === 'chat'
        ? 'Mode untuk percakapan teks interaktif dengan AI.'
        : 'Mode untuk mengirim gambar dan menerima analisis dari Skyra.'}
    </span>
  </div>
</div>

        <p style={{ fontSize: '13px', marginTop: '12px', color: '#888' }}>
          Mohon maaf atas ketidak nyamanannya. Beberapa fitur saat ini masih dalam tahap pengembangan.
        </p>
      </div>
    </div>
  )
}

export default SettingsModal
