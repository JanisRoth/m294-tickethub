import { Link, useNavigate } from 'react-router-dom'
import './Navbar.css'
import logo from '/logo.png'

export default function Navbar() {
  const navigate = useNavigate()

  const handleSignOut = async () => {
    localStorage.clear()
    navigate('/')
  }

  return (
    <div className="navbar">
      <img src={logo} alt="TicketHub Logo" className="navbar-logo" />
      <nav className="navbar-links">
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/ticketshop">Ticket Shop</Link>
        <Link to="/sellticket">Sell Tickets</Link>
        <button onClick={handleSignOut}>Sign Out</button>
      </nav>
    </div>
  )
}