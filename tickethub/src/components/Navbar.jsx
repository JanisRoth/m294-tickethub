import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './Navbar.css'
import logo from '/logo.png'

export default function Navbar() {
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)

  const handleSignOut = async () => {
    localStorage.clear()
    navigate('/')
  }

  const toggleMenu = () => setMenuOpen(!menuOpen)

  return (
    <div className="navbar">
      <div className="navbar-top">
        <img src={logo} alt="TicketHub Logo" className="navbar-logo" />
        <button className="burger-menu" onClick={toggleMenu}>☰</button>
      </div>

      <nav className={`navbar-links ${menuOpen ? 'mobile-active' : ''}`}>
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/ticketshop">Ticket Shop</Link>
        <Link to="/sellticket">Sell Tickets</Link>
        <button onClick={handleSignOut}>Sign Out</button>
      </nav>
    </div>
  )
}
