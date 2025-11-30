import { FiX } from "react-icons/fi";
import "./SettingsModal.css";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenProfile: () => void;
}

const SettingsModal = ({ isOpen, onClose, onOpenProfile }: SettingsModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="settings-modal-overlay">
      <div className="settings-modal">

        {/* Header */}
        <div className="settings-header">
          <h2>Settings</h2>
          <button className="close-btn" onClick={onClose}>
            <FiX size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="settings-content">

          {/* MODE AI */}
          <div className="setting-section">
            <h3 className="section-title">AI Mode</h3>

            <div className="mode-buttons">
              <button
                className="mode-btn active"
                onClick={() => localStorage.setItem("skyra-mode", "chat")}
              >
                Skyra Chat
              </button>

              <button
                className="mode-btn"
                onClick={() => localStorage.setItem("skyra-mode", "vision")}
              >
                Skyra Analisis Gambar
              </button>
            </div>
          </div>

          {/* PROFILE */}
          <div className="setting-section">
            <h3 className="section-title">Account</h3>
            <button className="profile-btn" onClick={onOpenProfile}>
              Edit Profile
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
