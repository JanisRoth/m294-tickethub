import { useState } from 'react';
import { supabase } from '../supabaseClient';
import './SellTicketForm.css';

export default function SellTicketForm({ onClose, onCreated }) {
  const [eventName, setEventName] = useState('');
  const [location, setLocation] = useState('');
  const [date, setDate] = useState('');
  const [price, setPrice] = useState('');
  const [expiresAt, setExpiresAt] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const user = (await supabase.auth.getUser()).data.user;
    if (!user) {
      setMessage('Not logged in');
      return;
    }

    const { error } = await supabase.from('tickets').insert({
      event_name: eventName,
      location,
      date,
      price: parseFloat(price),
      expires_at: expiresAt,
      status: 'open',
      user_id: user.id
    });

    if (error) {
      console.error(error);
      setMessage('Fehler beim Erstellen des Tickets');
    } else {
      setMessage('Ticket erfolgreich erstellt!');
      setEventName('');
      setLocation('');
      setDate('');
      setPrice('');
      setExpiresAt('');
      if (onCreated) onCreated(); // optional callback
    }
  };

  return (
    <div className="overlay">
      <div className="form-modal">
        <button className="close-button" onClick={onClose}>✖</button>
        <h2>Sell ticket</h2>
        <form onSubmit={handleSubmit}>
          <label>Event Name</label>
          <input
            type="text"
            value={eventName}
            onChange={(e) => setEventName(e.target.value)}
            required
          />
          <label>Place</label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
          />
          <label>Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
          <label>Price (CHF)</label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
          <label>Valid until</label>
          <input
            type="datetime-local"
            value={expiresAt}
            onChange={(e) => setExpiresAt(e.target.value)}
            required
          />
          <button type="submit">Erstellen</button>
        </form>
        {message && <p className="message">{message}</p>}
      </div>
    </div>
  );
}