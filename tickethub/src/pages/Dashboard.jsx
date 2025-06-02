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
        <div style={{
          flex: 1,
          padding: '2rem 3rem',
          marginLeft: '220px',
          boxSizing: 'border-box',
          display: 'flex',
          gap: '2rem',
        }}>
          {/* Box: Open Tickets */}
          <div style={{
            flex: 2,
            backgroundColor: '#1f2023',
            padding: '1.5rem',
            borderRadius: '12px',
            height: 'fit-content',
            boxShadow: '0 3px 10px rgba(0,0,0,0.5)'
          }}>
            <h2 style={{ color: 'white', marginBottom: '1.5rem' }}>My Open Tickets for Sale</h2>

            {tickets.map((ticket) => (
              <div key={ticket.id} style={{
                backgroundColor: '#2b2e32',
                padding: '1rem 1.3rem',
                borderRadius: '10px',
                marginBottom: '1rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                boxShadow: '0 2px 8px rgba(0,0,0,0.25)',
                color: '#fff'
              }}>
                <div style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '50%',
                  backgroundColor: '#f15a29',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 'bold',
                  fontSize: '1.1rem',
                  marginRight: '1rem',
                  flexShrink: 0
                }}>
                  {ticket.users?.username?.charAt(0).toUpperCase() ?? 'U'}
                </div>

                <div style={{ flexGrow: 1 }}>{ticket.event_name}</div>
                <div style={{ fontWeight: 'bold' }}>CHF {ticket.price}</div>
              </div>
            ))}
          </div>

          { }
          <div style={{
            flex: 1,
            backgroundColor: '#1f2023',
            padding: '1.5rem',
            borderRadius: '12px',
            height: 'fit-content',
            boxShadow: '0 3px 10px rgba(0,0,0,0.5)'
          }}>
            <RecentlyBought />
          </div>
        </div>
      </div>
    </div>
  )
}
