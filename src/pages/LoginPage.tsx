// LoginPage.tsx
import './Auth.css'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { loginUser } from '../lib/auth'
import { useGoogleLogin } from '@react-oauth/google'
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

  const loginWithGoogle = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
    try {
      const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
        headers: {
          Authorization: `Bearer ${tokenResponse.access_token}`,
        },
      })
      const data = await res.json()
      const user = {
        email: data.email,
        name: data.name,
        avatar: data.picture,
        google: true,
      }
      localStorage.setItem('user', JSON.stringify(user))
      alert('Login dengan Google berhasil!')
      navigate('/chat')
    } catch (err) {
      alert('Gagal mengambil data akun Google')
    }
  },
    onError: () => alert('Login Google gagal'),
    flow: 'implicit',
  })

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

        <button type="button" className="google-btn" onClick={() => loginWithGoogle()}>
          <img src="https://developers.google.com/identity/images/g-logo.png" alt="Google" />
          <span>Lanjut dengan Google</span>
        </button>

        <p className="register-link">
          Belum punya akun? <Link to="/register">Daftar</Link>
        </p>
      </form>
    </div>
  )
}

export default LoginPage
