import { useEffect, useState } from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import ChatPage from './pages/ChatPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkLocalAuth = () => {
      const user = localStorage.getItem('user')
      setIsAuthenticated(!!user)
      setLoading(false)
    }

    checkLocalAuth()
  }, [])

  if (loading) return <p>Loading...</p>

  return (
    <Routes>
      <Route
        path="/"
        element={<Navigate to={isAuthenticated ? '/chat' : '/login'} />}
      />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route
        path="/chat"
        element={isAuthenticated ? <ChatPage /> : <Navigate to="/login" />}
      />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  )
}

export default App
