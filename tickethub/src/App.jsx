import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useState } from 'react'
import LoginForm from './components/LoginForm'
import RegisterForm from './components/RegisterForm'
import Dashboard from './pages/Dashboard'
import SellTicket from './pages/SellTicket'
import TicketShop from './pages/TicketShop'
import './App.css'

function App() {
  const [mode, setMode] = useState('login')

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <div className="auth-page">
              <img src="/logo.png" alt="TicketHub Logo" className="auth-logo" />
              <div className="auth-box">
                <h2>{mode === 'login' ? 'LOG IN' : 'SIGN UP'}</h2>
                {mode === 'login' ? <LoginForm /> : <RegisterForm />}
                <p className="switch">
                  {mode === 'login' ? 'No profile yet?' : 'Already registered?'}{' '}
                  <button
                    className="link-button"
                    onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
                  >
                    {mode === 'login' ? 'Sign Up' : 'Log In'}
                  </button>
                </p>
              </div>
            </div>
          }
        />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="*" element={<Navigate to="/" />} />
        <Route path="/sellticket" element={<SellTicket />} />
        <Route path="/ticketshop" element={<TicketShop />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App