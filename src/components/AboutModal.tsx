import './AboutModal.css';
import { FiX, FiZap, FiCpu, FiLayout, FiBookOpen, FiMessageCircle, FiCode, FiHelpCircle, FiMic, FiFileText } from "react-icons/fi";
import { HiOutlineUserGroup, HiOutlineGlobeAlt } from "react-icons/hi";

interface Props {
  isOpen: boolean
  onClose: () => void
}

const AboutModal = ({ isOpen, onClose }: Props) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          <FiX />
        </button>

        <h2>About Skyra</h2>
        <p>
          <strong>Skyra</strong> adalah asisten AI multifungsi yang dirancang untuk membantu Anda dalam berbagai aktivitas digital. Dari pemrosesan teks, pemrograman, percakapan emosional, hingga bantuan sehari-hari, semua dilakukan secara cerdas dan intuitif.
        </p>

        <h3 style={{ marginTop: '24px' }}>Fitur Utama</h3>
        <ul className="feature-list">
          <li><FiZap style={{ marginRight: '8px' }} /> Cepat dan responsif</li>
          <li><FiCpu style={{ marginRight: '8px' }} /> Didukung teknologi AI generatif terbaru</li>
          <li><FiLayout style={{ marginRight: '8px' }} /> Antarmuka intuitif dan ramah pengguna</li>
        </ul>

        <h3 style={{ marginTop: '24px' }}>Kemampuan Skyra</h3>
        <ul className="feature-list">
          <li><FiBookOpen style={{ marginRight: '8px' }} /> Menjawab pertanyaan dari berbagai topik pengetahuan</li>
          <li><FiCode style={{ marginRight: '8px' }} /> Membantu menulis, memperbaiki, dan menjelaskan kode</li>
          <li><FiMessageCircle style={{ marginRight: '8px' }} /> Percakapan alami dan empatik, siap menemani kapan saja</li>
          <li><FiHelpCircle style={{ marginRight: '8px' }} /> Memberi saran dalam menyelesaikan tugas dan masalah harian</li>
          <li><HiOutlineUserGroup style={{ marginRight: '8px' }} /> Pendamping produktivitas belajar maupun kerja</li>
        </ul>

        <h3 style={{ marginTop: '24px' }}>Fitur Tambahan (Seperti ChatGPT)</h3>
        <ul className="feature-list">
          <li><FiMic style={{ marginRight: '8px' }} /> Input suara (Voice-to-text) (dalam pengembangan)</li>
          <li><HiOutlineGlobeAlt style={{ marginRight: '8px' }} /> Multibahasa: Bisa berinteraksi dalam berbagai bahasa</li>
          <li><FiFileText style={{ marginRight: '8px' }} /> Membaca dan menganalisis dokumen (text, artikel, kode)</li>
          <li><FiHelpCircle style={{ marginRight: '8px' }} /> Riwayat obrolan yang bisa disimpan dan dikelola</li>
        </ul>

        <p style={{ fontSize: '13px', marginTop: '24px', color: '#777' }}>
          Skyra dikembangkan dengan misi menjadi AI yang tidak hanya pintar, tapi juga manusiawi dan dapat dipercaya.
        </p>
      </div>
    </div>
  )
}

export default AboutModal;
