import { useState } from 'react'
import { supabase } from '../supabaseClient'

export default function RegisterForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState(null)

  const handleRegister = async (e) => {
    e.preventDefault()
    const { error } = await supabase.auth.signUp({
      email,
      password
    })

    if (error) {
      setMessage('Registrierung fehlgeschlagen: ' + error.message)
    } else {
      setMessage('Registrierung erfolgreich, Bitte E-Mail bestätigen.')
    }
  }

  return (
    <form onSubmit={handleRegister}>
      <input
        type="email"
        placeholder="E-Mail"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      /><br />
      <input
        type="password"
        placeholder="Passwort"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      /><br />
      <button type="submit">Registrieren</button>
      {message && <p>{message}</p>}
    </form>
  )
}
