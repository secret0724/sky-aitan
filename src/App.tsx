// src/App.tsx
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import ChatPage from './pages/ChatPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'

function App() {
  const location = useLocation()
  const isAuthenticated = !!localStorage.getItem('user')

  return (
    <Routes key={location.pathname}>
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
