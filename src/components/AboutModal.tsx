import './AboutModal.css'
import { FiX, FiZap, FiCpu, FiLayout } from "react-icons/fi";

interface Props {
  isOpen: boolean
  onClose: () => void
}

const AboutModal = ({ isOpen, onClose }: Props) => {
  if (!isOpen) return null

  return (
    <div className="modal-overlay" onClick={onClose}>
  <div className="modal-content" onClick={e => e.stopPropagation()}>
    <button className="modal-close" onClick={onClose}>
      <FiX />
    </button>
    <h2>Tentang Skyra</h2>
    <p>
      <strong>Skyra</strong> adalah asisten kecerdasan buatan yang dirancang untuk menjadi mitra digital Anda. Mulai dari menjawab pertanyaan, membantu menyelesaikan tugas, hingga menemani percakapan bermakna semua dilakukan dengan presisi dan kehangatan.
    </p>
    <p>
      Dengan teknologi AI terkini, Skyra hadir sebagai asisten yang cerdas, profesional, dan mudah diakses kapan saja.
    </p><br></br>
    <ul className="feature-list">
      <li><FiZap style={{ marginRight: '8px' }} /> Cepat dan responsif</li>
      <li><FiCpu style={{ marginRight: '8px' }} /> Didukung oleh teknologi AI modern</li>
      <li><FiLayout style={{ marginRight: '8px' }} /> Antarmuka minimalis dan bersih</li>
    </ul>
    <p style={{ fontSize: '13px', marginTop: '16px', color: '#777' }}>
      Dikembangkan dengan dedikasi oleh tim Skyra.
    </p>
  </div>
</div>
  )
}

export default AboutModal
