// LoginPage.tsx
import './Auth.css'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { loginUser } from '../lib/auth'
import { GoogleLogin, CredentialResponse } from '@react-oauth/google'
import { jwtDecode } from 'jwt-decode'
import { FiMail, FiLock } from 'react-icons/fi'

interface GoogleJwt {
  email: string
  name: string
  picture: string
}

const LoginPage = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const user = await loginUser(email, password)
      localStorage.setItem('user', JSON.stringify(user))
      alert('Login berhasil!')
      navigate('/chat')
    } catch (error: any) {
      alert('Login gagal: ' + error.message)
    }
  }

  const handleGoogleSuccess = (credentialResponse: CredentialResponse) => {
    if (!credentialResponse.credential) return alert('Token Google tidak ditemukan')
    const decoded: GoogleJwt = jwtDecode(credentialResponse.credential)
    const user = {
      email: decoded.email,
      name: decoded.name,
      avatar: decoded.picture,
      google: true,
    }
    localStorage.setItem('user', JSON.stringify(user))
    alert('Login dengan Google berhasil!')
    navigate('/chat')
  }

  return (
    <div className="auth-container">
      <form className="auth-card" onSubmit={handleLogin}>
        <div className="auth-header">
          <img src="/logo/Skyra-L1.png" alt="Logo Skyra" className="auth-logo" />
          <h2>Selamat Datang</h2>
          <p>Masuk untuk mulai ngobrol dengan <strong>Skyra</strong></p>
        </div>

        <div className="input-group">
          <FiMail className="input-icon" />
          <input
            type="email"
            placeholder="Alamat Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="input-group">
          <FiLock className="input-icon" />
          <input
            type="password"
            placeholder="Kata Sandi"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit">Masuk</button>

        <div className="divider"><span>atau</span></div>

        <GoogleLogin
          onSuccess={handleGoogleSuccess}
          onError={() => alert('Login Google gagal')}
        />

        <p className="register-link">
          Belum punya akun? <Link to="/register">Daftar</Link>
        </p>
      </form>
    </div>
  )
}

export default LoginPage
