import { useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'
import Navbar from '../components/Navbar'
import './Dashboard.css'
import RecentlyBought from '../components/RecentlyBought'

export default function Dashboard() {
  const [tickets, setTickets] = useState([])

  useEffect(() => {
    fetchTickets()
  }, [])

  const fetchTickets = async () => {
    const { data, error } = await supabase
      .from('tickets')
      .select('id, event_name, price, users(username)')
      .eq('status', 'open')
      .order('created_at', { ascending: false })
      .limit(3)

    if (error) {
      console.error('Fehler beim Laden der Tickets:', error)
    } else {
      setTickets(data)
    }
  }

  return (
    <div className="dashboard-container">
      <Navbar />
      <div className="dashboard-content">
        <div className="dashboard-tickets">
          <div className="dashboard-ticket-box" style={{ flex: 2 }}>
            <h2 style={{ color: 'white', marginBottom: '1.5rem' }}>My Open Tickets for Sale</h2>

            {tickets.map((ticket) => (
              <div key={ticket.id} className="dashboard-ticket-card">
                <div className="ticket-user-icon">
                  {ticket.users?.username?.charAt(0).toUpperCase() ?? 'U'}
                </div>
                <div style={{ flexGrow: 1 }}>{ticket.event_name}</div>
                <div style={{ fontWeight: 'bold' }}>CHF {ticket.price}</div>
              </div>
            ))}
          </div>

          <div className="dashboard-ticket-box" style={{ flex: 1 }}>
            <RecentlyBought />
          </div>
        </div>
      </div>
    </div>
  )
}
