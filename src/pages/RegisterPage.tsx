// RegisterPage.tsx
import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import './Auth.css'
import { registerUser } from '../lib/auth'
import { FiMail, FiLock } from 'react-icons/fi'

const RegisterPage = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const navigate = useNavigate()

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    if (password !== confirmPassword) {
      alert('Password dan konfirmasi tidak cocok!')
      return
    }

    try {
      await registerUser(email, password)
      alert('Registrasi berhasil!')
      navigate('/login')
    } catch (error: any) {
      alert('Gagal daftar: ' + error.message)
    }
  }

  return (
    <div className="auth-container">
      <form className="auth-card" onSubmit={handleRegister}>
        <div className="auth-header">
          <img src="/logo/Skyra-L1.png" alt="Logo SkyAiTan" className="auth-logo" />
          <h2>Buat Akun Baru</h2>
          <p>Daftar untuk mulai ngobrol dengan <strong>Skyra</strong></p>
        </div>

        <div className="input-group">
          <FiMail className="input-icon" />
          <input
            type="email"
            placeholder="Alamat Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="input-group">
          <FiLock className="input-icon" />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <div className="input-group">
          <FiLock className="input-icon" />
          <input
            type="password"
            placeholder="Konfirmasi Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit">Daftar</button>

        <p className="register-link">
          Sudah punya akun? <Link to="/login">Masuk</Link>
        </p>
      </form>
    </div>
  )
}

export default RegisterPage
