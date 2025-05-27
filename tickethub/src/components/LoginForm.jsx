import { useState } from 'react'
import { supabase } from '../supabaseClient'

export default function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState(null)

  const handleLogin = async (e) => {
    e.preventDefault()
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    setMessage(error ? 'Login fehlgeschlagen' : 'Login erfolgreich')
  }

  return (
    <form onSubmit={handleLogin} className="form-fields">
      <input
        type="email"
        placeholder="E-Mail"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Passwort"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <button type="submit">SIGN IN</button>
      {message && <p>{message}</p>}
    </form>
  )
}