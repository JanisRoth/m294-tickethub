import { useState } from 'react'
import LoginForm from './components/LoginForm.jsx'
import RegisterForm from './components/RegisterForm.jsx'
import './App.css'

function App() {
  const [mode, setMode] = useState('login')

  return (
    <div className="card">
      <h2>{mode === 'login' ? 'Login' : 'Registrierung'}</h2>
      
      {mode === 'login' ? <LoginForm /> : <RegisterForm />}

      <p>
        {mode === 'login' ? 'Noch kein Konto?' : 'Schon registriert?'}{' '}
        <button onClick={() => setMode(mode === 'login' ? 'register' : 'login')}>
          {mode === 'login' ? 'Registrieren' : 'Login'}
        </button>
      </p>
    </div>
  )
}

export default App