import { useEffect, useState, useCallback } from 'react';
import { supabase } from '../supabaseClient';
import Navbar from '../components/Navbar';
import './TicketShop.css';

export default function TicketShop() {
  const [tickets, setTickets] = useState([]);
  const [sortOrder, setSortOrder] = useState('asc');

  const fetchTickets = useCallback(async () => {
    const { data, error } = await supabase
      .from('tickets')
      .select('id, event_name, date, location, price, expires_at, users(username)')
      .eq('status', 'open')
      .gt('expires_at', new Date().toISOString())
      .order('expires_at', { ascending: sortOrder === 'asc' });

    if (error) console.error(error);
    else setTickets(data);
  }, [sortOrder]);

  useEffect(() => {
    fetchTickets();
  }, [fetchTickets]);

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
    <div style={{ display: 'flex' }}>
      <Navbar />
      <div className="ticket-shop-wrapper">
        <div className="ticket-shop-container">
          <h1 className="ticket-shop-title">TICKET SHOP</h1>
          <div className="ticket-shop-search">
            <input className="search-input" placeholder="SEARCH" />
            <select
              className="filter-select"
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
            >
              <option value="asc">Läuft als nächstes ab</option>
              <option value="desc">Läuft am längsten</option>
            </select>
          </div>

          <div className="ticket-shop-table">
            <div className="ticket-shop-header">
              <div>SELLER</div>
              <div>EVENT</div>
              <div>DATE</div>
              <div>LOCATION</div>
              <div>PRICE</div>
              <div>TIME REMAINING</div>
            </div>

            {tickets.length === 0 ? (
              <p className="no-tickets">Keine Tickets verfügbar.</p>
            ) : (
              tickets.map(ticket => (
                <div key={ticket.id} className="ticket-shop-row">
                  <div className="circle">{ticket.users?.username?.charAt(0).toUpperCase() ?? '?'}</div>
                  <div>{ticket.event_name}</div>
                  <div>{new Date(ticket.date).toLocaleDateString()}</div>
                  <div>{ticket.location}</div>
                  <div>CHF {ticket.price}</div>
                  <div>{formatTimeRemaining(ticket.expires_at)}</div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}