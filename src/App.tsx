// src/App.tsx
import { Routes, Route, useLocation } from 'react-router-dom'
import ChatPage from './pages/ChatPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'

function App() {
  const location = useLocation()

  return (
    <Routes key={location.pathname}>
      {/* Root langsung ke ChatPage, login atau nggak */}
      <Route path="/" element={<ChatPage />} />
      
      {/* Bisa tetep akses login & register manual */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* /chat juga tetep boleh, alias alias dari / */}
      <Route path="/chat" element={<ChatPage />} />

      {/* Fallback kalau URL ngawur */}
      <Route path="*" element={<ChatPage />} />
    </Routes>
  )
}

export default App
