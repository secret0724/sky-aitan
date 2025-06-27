import './Auth.css'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { loginUser } from '../lib/auth'

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
        <p>
          Belum punya akun? <Link to="/register">Daftar</Link>
        </p>
      </form>
    </div>
  )
}

export default LoginPage
