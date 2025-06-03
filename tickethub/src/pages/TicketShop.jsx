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
      .select('id, event_name, date, location, price, expires_at, user_id, users(username)')
      .eq('status', 'open')
      .gt('expires_at', new Date().toISOString())
      .order('expires_at', { ascending: sortOrder === 'asc' });

    if (error) {
      console.error(error);
    } else {
      setTickets(data);
    }
  }, [sortOrder]);

  useEffect(() => {
    fetchTickets();
  }, [fetchTickets]);

  const handlePurchase = async (ticket) => {
    const user = await supabase.auth.getUser();
    const buyerId = user?.data?.user?.id;
  
    if (!buyerId) {
      alert('Benutzer nicht eingeloggt');
      return;
    }
  
    const { error: insertError } = await supabase.from('purchases').insert([
      {
        ticket_id: ticket.id,
        buyer_id: buyerId,
        price: ticket.price,
        purchase_date: new Date().toISOString(),
      },
    ]);
  
    if (insertError) {
      console.error('Fehler beim Erstellen des Kauf-Eintrags:', insertError);
      alert('Fehler beim Kauf.');
      return;
    }

    const { error: updateError } = await supabase
      .from('tickets')
      .update({ status: 'sold' })
      .eq('id', ticket.id);
  
    if (updateError) {
      console.error('Fehler beim Aktualisieren des Ticketstatus:', updateError);
      alert('Kauf wurde gespeichert, aber Ticket konnte nicht als verkauft markiert werden.');
      return;
    }
  
    alert('Ticket erfolgreich gekauft!');
    fetchTickets();
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
    <div className="ticketshop-nav-container">
      <Navbar />
      <div className="ticket-shop-container">
        <div className="ticket-shop-wrapper">
          <h1 className="ticket-shop-title">TICKET SHOP</h1>
          <div className="ticket-shop-search">
            <input className="search-input" placeholder="SEARCH" />
            <select
              className="filter-select"
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
            >
              <option value="asc">Expires next</option>
              <option value="desc">Expires last</option>
            </select>
          </div>

          <div className="ticket-shop-table">
            <div className="ticket-shop-header">
              <div>SELLER</div>
              <div>EVENT</div>
              <div>DATE</div>
              <div>LOCATION</div>
              <div>PRICE</div>
              <div>TIME</div>
              <div></div>
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
                  <div className="buy-cell">
                    <button className="buy-button" onClick={() => handlePurchase(ticket)}>Kaufen</button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}