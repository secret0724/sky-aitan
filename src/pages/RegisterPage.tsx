import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './Auth.css'
import { registerUser } from '../lib/auth'

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
        <h2>Daftar</h2>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Konfirmasi Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
        <button type="submit">Daftar</button>
        <p>
          Sudah punya akun? <a href="/login">Masuk</a>
        </p>
      </form>
    </div>
  )
}

export default RegisterPage
