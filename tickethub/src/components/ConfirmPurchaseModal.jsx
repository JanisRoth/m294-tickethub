import React from 'react';
import './ConfirmPurchaseModal.css';

export default function ConfirmPurchaseModal({ ticket, onConfirm, onCancel }) {
  if (!ticket) return null;

  return (
    <div className="confirm-modal-overlay">
      <div className="confirm-modal">
        <h2>Confirm Purchase</h2>
        <p>
          Are you sure you want to buy “
          <strong>{ticket.event_name}</strong>” for{' '}
          <strong>CHF {ticket.price}</strong>?
        </p>
        <div className="confirm-modal-buttons">
          <button className="cancel-button" onClick={onCancel}>
            Cancel
          </button>
          <button className="confirm-button" onClick={() => onConfirm(ticket)}>
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}