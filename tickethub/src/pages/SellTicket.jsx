import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import Navbar from '../components/Navbar';
import SellTicketForm from '../components/SellTicketForm';
import './SellTicket.css';

export default function SellTickets() {
  const [openTickets, setOpenTickets] = useState([]);
  const [soldTickets, setSoldTickets] = useState([]);
  const [earned, setEarned] = useState(0);
  const [soldCount, setSoldCount] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const [currentUsername, setCurrentUsername] = useState('User');

  useEffect(() => {
    fetchTickets();
    fetchStats();
    fetchUsername();
  }, []);

  const fetchUsername = async () => {
    const { data, error } = await supabase.auth.getUser();
    if (!error && data?.user?.id) {
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('username')
        .eq('id', data.user.id)
        .single();

      if (!userError && userData) {
        setCurrentUsername(userData.username);
      }
    }
  };

  const fetchTickets = async () => {
    const user = await supabase.auth.getUser();
    const userId = user?.data?.user?.id;

    const { data, error } = await supabase
      .from('tickets')
      .select('id, event_name, date, location, price, expires_at, users(username)')
      .eq('status', 'open')
      .eq('user_id', userId);

    if (!error) setOpenTickets(data);
  };

  const fetchStats = async () => {
    const user = await supabase.auth.getUser();
    const userId = user?.data?.user?.id;

    const { data, error } = await supabase
      .from('purchases')
      .select('price, ticket_id, tickets(event_name, date, location)')
      .eq('seller_id', userId);

    if (!error && data) {
      const total = data.reduce((acc, cur) => acc + (cur.price || 0), 0);
      setEarned(total);
      setSoldCount(data.length);

      const formatted = data.map(p => ({
        ...p.tickets,
        price: p.price,
      }));
      setSoldTickets(formatted);
    }
  };

  const formatTimeRemaining = (expires_at) => {
    const now = new Date();
    const expiry = new Date(expires_at);
    const diff = expiry - now;

    if (diff <= 0) return 'Expired';
    const hours = Math.floor(diff / 1000 / 60 / 60);
    const minutes = Math.floor((diff / 1000 / 60) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    return `${hours.toString().padStart(2, '0')}H ${minutes
      .toString()
      .padStart(2, '0')}M ${seconds.toString().padStart(2, '0')}S`;
  };

  return (
    <div className="sell-layout">
      <Navbar />
      <main className="sell-content">
        <div className="sell-header">
          <h1>SELL TICKETS</h1>
          <button className="sell-button" onClick={() => setShowForm(true)}>
            SELL A TICKET
          </button>
        </div>

        <div className="sell-search">
          <input className="search-input" placeholder="SEARCH" />
          <select className="filter-select">
            <option>Läuft als nächstes ab</option>
            <option>Läuft am längsten</option>
          </select>
        </div>

        <section className="ticket-section">
          <h2>MY OPEN TICKETS FOR SALE</h2>
          <div className="ticket-box">
            <div className="ticket-header">
              <div></div> {/* Icon Column */}
              <div>Event</div>
              <div>Date</div>
              <div>Location</div>
              <div>Price</div>
              <div>Time Left</div>
            </div>

            {openTickets.map(ticket => (
              <div key={ticket.id} className="ticket-row">
                <div className="circle">
                  {ticket.users?.username?.charAt(0).toUpperCase() || 'J'}
                </div>
                <div>{ticket.event_name}</div>
                <div>{new Date(ticket.date).toLocaleDateString()}</div>
                <div>{ticket.location}</div>
                <div>CHF {ticket.price}</div>
                <div>{formatTimeRemaining(ticket.expires_at)}</div>
              </div>
            ))}
          </div>
        </section>

        <section className="ticket-section">
          <h2>MY RECENTLY SOLD TICKETS</h2>
          <div className="ticket-box">
            {soldTickets.length === 0 ? (
              <div className="ticket-card" style={{ justifyContent: 'center' }}>
                No tickets sold yet.
              </div>
            ) : (
              soldTickets.map((ticket, index) => (
                <div key={index} className="ticket-card">
                  <div className="circle">J</div>
                  <div>{ticket.event_name}</div>
                  <div>{new Date(ticket.date).toLocaleDateString()}</div>
                  <div>{ticket.location}</div>
                  <div>CHF {ticket.price}</div>
                  <div className="circle buyer">B</div>
                </div>
              ))
            )}
          </div>
        </section>

        <div className="summary-boxes">
          <div className="summary-box">
            <h3>TOTAL EARNED MONEY</h3>
            <div className="summary-content">
              <div className="circle">J</div>
              <div>{currentUsername}</div>
              <div>CHF {earned}</div>
            </div>
          </div>
          <div className="summary-box">
            <h3>TOTAL TICKETS SOLD</h3>
            <div className="summary-content">
              <div className="circle">J</div>
              <div>{currentUsername}</div>
              <div>{soldCount}</div>
            </div>
          </div>
        </div>
      </main>

      {showForm && <SellTicketForm onClose={() => setShowForm(false)} />}
    </div>
  );
}
