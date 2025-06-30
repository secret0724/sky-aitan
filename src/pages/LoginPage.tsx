// LoginPage.tsx
import './Auth.css'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { loginUser } from '../lib/auth'
import { GoogleLogin, CredentialResponse } from '@react-oauth/google'
import { jwtDecode } from 'jwt-decode'

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
    if (!credentialResponse.credential) {
      alert('Token Google tidak ditemukan')
      return
    }

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
        <h2>Login</h2>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
        <button type="submit">Masuk</button>

        <div style={{ margin: '12px 0' }}>
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => alert('Login Google gagal')}
          />
        </div>

        <p>
          Belum punya akun? <Link to="/register">Daftar</Link>
        </p>
      </form>
    </div>
  )
}

export default LoginPage
