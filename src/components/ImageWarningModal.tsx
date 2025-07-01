// ImageWarningModal.tsx
import './ImageWarningModal.css'
import { FiX } from 'react-icons/fi'
import { MdWarningAmber } from 'react-icons/md'

interface ImageWarningModalProps {
  isOpen: boolean
  onClose: () => void
  onOpenSettings: () => void
}

const ImageWarningModal = ({ isOpen, onClose, onOpenSettings }: ImageWarningModalProps) => {
  if (!isOpen) return null

  return (
    <div className="warning-overlay" onClick={onClose}>
      <div className="warning-modal" onClick={e => e.stopPropagation()}>
        <button className="warning-close" onClick={onClose}><FiX /></button>
        <div className="warning-icon">
          <MdWarningAmber size={64} color="#f39c12" />
        </div>
        <p className="warning-text">
          Anda sedang dalam <strong>mode Skyra Chat</strong>, silakan ubah mode menjadi <strong>Skyra Analisis Gambar</strong> di pengaturan.
        </p>
        <button className="warning-ok-btn" onClick={() => {
          onClose()
          onOpenSettings()
        }}>
          OK
        </button>
      </div>
    </div>
  )
}

export default ImageWarningModal
