// components/HelpModal.tsx
import './HelpModal.css'
import { FiXCircle, FiMessageSquare, FiRefreshCw, FiUser, FiWifiOff } from "react-icons/fi";

interface HelpModalProps {
  isOpen: boolean
  onClose: () => void
}

const HelpModal = ({ isOpen, onClose }: HelpModalProps) => {
  if (!isOpen) return null

  return (
    <div className="modal-overlay" onClick={onClose}>
  <div className="modal-content" onClick={e => e.stopPropagation()}>
    <button className="close-btn" onClick={onClose}>
      <FiXCircle />
    </button>
    <h2>Bantuan</h2>
    <p>Berikut beberapa panduan penggunaan Skyra:</p>
    <ul className="help-list">
      <li>
        <FiMessageSquare style={{ marginRight: '8px' }} />
        Klik <strong>"New Chat"</strong> untuk memulai percakapan baru.
      </li>
      <li>
        <FiRefreshCw style={{ marginRight: '8px' }} />
        Riwayat percakapan dapat diubah nama, dihapus, atau disematkan.
      </li>
      <li>
        <FiUser style={{ marginRight: '8px' }} />
        Klik ikon pengguna untuk mengakses profil, pengaturan, dan pusat bantuan.
      </li>
      <li>
        <FiWifiOff style={{ marginRight: '8px' }} />
        Jika AI tidak merespons, periksa koneksi internet atau tunggu beberapa saat.
      </li>
    </ul>
    <p>
      Masih memerlukan bantuan lebih lanjut? Silakan hubungi kami melalui email di <strong>skyra.support@gmail.com</strong>.
    </p>
  </div>
</div>
  )
}

export default HelpModal
