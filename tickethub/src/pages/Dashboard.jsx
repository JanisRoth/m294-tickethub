import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import Navbar from '../components/Navbar';
import './Dashboard.css';
import RecentlyBought from '../components/RecentlyBought';

export default function Dashboard() {
  const [tickets, setTickets] = useState([]);
  const [soldTickets, setSoldTickets] = useState([]);
  const [earned, setEarned] = useState(0);
  const [soldCount, setSoldCount] = useState(0);
  const [spent, setSpent] = useState(0);
  const [boughtCount, setBoughtCount] = useState(0);
  const [username, setUsername] = useState('U');
  const [revenue, setRevenue] = useState(0);

  useEffect(() => {
    fetchTickets();
    fetchStats();
  }, []);

  const fetchTickets = async () => {
    const { data, error } = await supabase
      .from('tickets')
      .select('id, event_name, price, users(username)')
      .eq('status', 'open')
      .order('created_at', { ascending: false })
      .limit(3);

    if (!error) setTickets(data);
    else console.error('Fehler beim Laden der Tickets:', error);
  };

  const fetchStats = async () => {
    const user = await supabase.auth.getUser();
    const userId = user?.data?.user?.id;
  
    if (!userId) return;
  
    let earnedTotal = 0;
    let spentTotal = 0;
  
    const { data: soldTicketsRaw, error: soldTicketsError } = await supabase
      .from('tickets')
      .select('price')
      .eq('status', 'sold')
      .eq('user_id', userId);
  
    if (!soldTicketsError && soldTicketsRaw) {
      earnedTotal = soldTicketsRaw.reduce((acc, cur) => acc + (cur.price || 0), 0);
      setEarned(earnedTotal);
      setSoldCount(soldTicketsRaw.length);
    }
  
    const { data: bought, error: boughtError } = await supabase
      .from('purchases')
      .select('price')
      .eq('buyer_id', userId);
  
    if (!boughtError && bought) {
      spentTotal = bought.reduce((acc, cur) => acc + (cur.price || 0), 0);
      setSpent(spentTotal);
      setBoughtCount(bought.length);
    }
  
    setRevenue(earnedTotal - spentTotal);
  
    const { data: soldTicketsData, error: soldTicketsErr } = await supabase
    .from('tickets')
    .select('id, event_name, date, location, price')
    .eq('user_id', userId)
    .eq('status', 'sold')
    .order('date', { ascending: false })
    .limit(3);  
  
    if (!soldTicketsErr) {
      setSoldTickets(soldTicketsData || []);
    }
  
    const userData = await supabase
      .from('users')
      .select('username')
      .eq('id', userId)
      .single();
  
    if (userData?.data?.username) {
      setUsername(userData.data.username);
    }
  };

  return (
    <div className="dashboard-container">
      <Navbar />
      <div className="dashboard-content">
      <div className="dashboard-header">
        <p className="dashboard-title">Dashboard</p>
      </div>
        <div className="dashboard-tickets">
          <div className="dashboard-ticket-box" style={{ flex: 2 }}>
            <h2 style={{ color: 'white', marginBottom: '1.5rem' }}>Newest open Tickets</h2>
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

        <div className="dashboard-summary">
          <div className="summary-box">
            <h3>Total Money Earned</h3>
            <p>CHF {earned.toFixed(2)}</p>
          </div>
          <div className="summary-box">
            <h3>Total Tickets Sold</h3>
            <p>{soldCount}</p>
          </div>
          <div className="summary-box">
            <h3>Total Money Spent</h3>
            <p>CHF {spent.toFixed(2)}</p>
          </div>
          <div className="summary-box">
            <h3>Total Tickets Bought</h3>
            <p>{boughtCount}</p>
          </div>
          <div className="summary-box">
            <h3>Total Revenue</h3>
            <p>CHF {revenue.toFixed(2)}</p>
          </div>
        </div>

        <div className="dashboard-ticket-box" style={{ marginTop: '2rem' }}>
          <h2 style={{ color: 'white', marginBottom: '1rem' }}>My Recently Sold Tickets</h2>
          {soldTickets.length === 0 ? (
            <p style={{ color: 'white' }}>No tickets sold yet.</p>
          ) : (
            soldTickets.map((ticket) => (
              <div key={ticket.id} className="dashboard-ticket-card">
                <div className="ticket-user-icon">{username.charAt(0).toUpperCase()}</div>
                <div>{ticket.event_name}</div>
                <div>{ticket.location}</div>
                <div>{new Date(ticket.date).toLocaleDateString()}</div>
                <div>CHF {ticket.price}</div>
              </div>
            ))            
          )}
        </div>
      </div>
    </div>
  );
}