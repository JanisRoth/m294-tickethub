import { useEffect, useState, useCallback } from 'react';
import { supabase } from '../supabaseClient';
import Navbar from '../components/Navbar';
import SellTicketForm from '../components/SellTicketForm';
import './SellTicket.css';

export default function SellTickets() {
  const [openTickets, setOpenTickets] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');

  const fetchTickets = useCallback(async () => {
    const userResponse = await supabase.auth.getUser();
    const userId = userResponse?.data?.user?.id;
    if (!userId) return;

    const { data, error } = await supabase
      .from('tickets')
      .select('id, event_name, date, location, price, expires_at, users(username)')
      .eq('status', 'open')
      .eq('user_id', userId)
      .order('expires_at', { ascending: sortOrder === 'asc' });

    if (!error && data) {
      setOpenTickets(data);
    }
  }, [sortOrder]);

  useEffect(() => {
    fetchTickets();
  }, [fetchTickets]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSortChange = (e) => {
    setSortOrder(e.target.value);
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

  const filteredTickets = openTickets.filter((ticket) => {
    const query = searchQuery.toLowerCase();
    return (
      ticket.event_name.toLowerCase().includes(query) ||
      ticket.location.toLowerCase().includes(query) ||
      ticket.users?.username?.toLowerCase().includes(query)
    );
  });

  return (
    <div className="sell-layout">
      <Navbar />

      <main className="sell-content">
        <h1 className="sell-title">SELL TICKETS</h1>

        <div className="sell-header">
          <button className="sell-button" onClick={() => setShowForm(true)}>
            SELL A TICKET
          </button>
        </div>

        {}
        <div className="sell-search">
          <input
            className="search-input"
            placeholder="SEARCH"
            value={searchQuery}
            onChange={handleSearchChange}
          />
          <select
            className="filter-select"
            value={sortOrder}
            onChange={handleSortChange}
          >
            <option value="asc">Expires next</option>
            <option value="desc">Expires last</option>
          </select>
        </div>

        <section className="ticket-section">
          <h2>MY OPEN TICKETS FOR SALE</h2>
          <div className="ticket-box">
            <div className="ticket-header">
              <div></div>
              <div>Event</div>
              <div>Date</div>
              <div>Location</div>
              <div>Price</div>
              <div>Time Left</div>
            </div>

            {filteredTickets.length > 0 ? (
              filteredTickets.map((ticket) => (
                <div key={ticket.id} className="ticket-row">
                  <div className="circle">
                    {ticket.users?.username?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <div>{ticket.event_name}</div>
                  <div>{new Date(ticket.date).toLocaleDateString()}</div>
                  <div>{ticket.location}</div>
                  <div>CHF {ticket.price}</div>
                  <div>{formatTimeRemaining(ticket.expires_at)}</div>
                </div>
              ))
            ) : (
              <div className="ticket-row" style={{ justifyContent: 'center' }}>
                No open tickets found.
              </div>
            )}
          </div>
        </section>
      </main>

      {showForm && <SellTicketForm onClose={() => setShowForm(false)} />}
    </div>
  );
}