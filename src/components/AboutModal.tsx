import './AboutModal.css';
import {
  FiX,
  FiZap,
  FiCpu,
  FiLayout,
  FiBookOpen,
  FiMessageCircle,
  FiCode,
  FiHelpCircle,
  FiMic,
  FiFileText,
  FiUpload,
  FiMessageSquare,
  FiImage
} from "react-icons/fi";
import { HiOutlineUserGroup, HiOutlineGlobeAlt } from "react-icons/hi";

interface Props {
  isOpen: boolean;
  onClose: () => void;
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

        <h3 style={{ marginTop: '24px' }}>Fitur Tambahan</h3>
        <ul className="feature-list">
          <li><FiMic style={{ marginRight: '8px' }} /> Input suara & voice note</li>
          <li><FiUpload style={{ marginRight: '8px' }} /> Upload chat (unggah file obrolan)</li>
          <li><HiOutlineGlobeAlt style={{ marginRight: '8px' }} /> Multibahasa: Bisa berinteraksi dalam berbagai bahasa</li>
          <li><FiFileText style={{ marginRight: '8px' }} /> Membaca dan menganalisis dokumen (text, artikel, kode)</li>
          <li><FiHelpCircle style={{ marginRight: '8px' }} /> Riwayat obrolan yang bisa disimpan dan dikelola</li>
        </ul>

        <h3 style={{ marginTop: '24px' }}>Mode Skyra</h3>
        <p>Berikut adalah ringkasan fitur dan perbandingan dua mode Skyra:</p>

        <div style={{ marginTop: '16px', color: '#777' }}>
          <strong>Mode Skyra Chat <FiMessageSquare /> </strong>
          <p style={{ marginTop: '8px' }}>
            Mode ini dioptimalkan untuk percakapan dan tugas berbasis teks. Cocok digunakan saat Anda ingin berkomunikasi atau menyelesaikan pekerjaan yang melibatkan teks panjang, penulisan kode, atau brainstorming ide.
          </p>
          <ul style={{ paddingLeft: '20px', marginBottom: '8px' }}>
            <li>✔ Teks lebih panjang dan mendalam bisa ditangani dengan baik.</li>
            <li>✔ Kecepatan respons lebih tinggi dan lebih responsif untuk percakapan.</li>
            <li>✔ Kemampuan coding dan logika sangat kuat.</li>
            <li>✖ Tidak mendukung input gambar atau pengolahan gambar.</li>
          </ul>
          <p><em>Saran Penggunaan:</em> Jika Anda lebih banyak berinteraksi dalam bentuk teks, seperti menulis, berdiskusi, atau bekerja dengan kode, Mode Skyra Chat adalah pilihan yang tepat untuk Anda.</p>
        </div>

        <div style={{ marginTop: '24px', color: '#777' }}>
          <strong>Mode Skyra Menganalisis Gambar <FiImage /></strong>
          <p style={{ marginTop: '8px' }}>
            Mode ini dirancang untuk memproses dan menganalisis gambar. Ideal bagi Anda yang membutuhkan analisis visual seperti deteksi objek, OCR, atau caption gambar.
          </p>
          <ul style={{ paddingLeft: '20px', marginBottom: '8px' }}>
            <li>✔ Mendukung upload gambar untuk analisis visual.</li>
            <li>✔ Kemampuan analisis gambar yang lebih kuat (deteksi objek, OCR, captioning).</li>
            <li>✔ Bisa menangani gambar dan teks secara bersamaan.</li>
            <li>✖ Kecepatan respons lebih lambat dibandingkan Mode Chat.</li>
            <li>✖ Kurang optimal untuk percakapan berbasis teks panjang.</li>
          </ul>
          <p><em>Saran Penggunaan:</em> Jika Anda lebih sering bekerja dengan gambar atau memerlukan analisis visual, gunakan Mode Menganalisis Gambar untuk mendapatkan hasil yang optimal.</p>
        </div>

        <div style={{ marginTop: '24px', fontSize: '13px', color: '#555' }}>
          <strong>Kesimpulan:</strong><br />
          Pilih <strong>Mode Skyra Chat</strong> jika Anda fokus pada percakapan atau pekerjaan berbasis teks dan membutuhkan respons cepat.<br />
          Pilih <strong>Mode Skyra Menganalisis Gambar</strong> jika tugas Anda melibatkan gambar dan Anda perlu mengolah atau menganalisisnya.<br />
          <br />
          Dengan memilih mode yang sesuai, Anda dapat memaksimalkan efisiensi dan hasil yang diinginkan.
        </div>

        <p style={{ fontSize: '13px', marginTop: '24px', color: '#777' }}>
          Skyra dikembangkan dengan misi menjadi AI yang tidak hanya pintar, tapi juga manusiawi dan dapat dipercaya.
        </p>
      </div>
    </div>
  );
};

export default AboutModal;
