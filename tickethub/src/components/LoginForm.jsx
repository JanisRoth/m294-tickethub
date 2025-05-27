import { useState } from 'react'
import { supabase } from '../supabaseClient'

export default function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState(null)

  const handleLogin = async (e) => {
    e.preventDefault()
    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setMessage('Login fehlgeschlagen: ' + error.message)
    } else {
      setMessage('Login erfolgreich')
    }
  }

  return (
    <form onSubmit={handleLogin}>
      <input
        type="email"
        placeholder="E-Mail"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      /><br />
      <input
        type="password"
        placeholder="Passwort"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      /><br />
      <button type="submit">Einloggen</button>
      {message && <p>{message}</p>}
    </form>
  )
}
