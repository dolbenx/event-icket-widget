import React, { useState } from 'react';
import { QRCodeCanvas } from 'qrcode.react';

const dummyTicket = {
  event: 'Bitcoin Meetup Lusaka',
  date: 'August 3, 2025',
  seat: 'A12',
  price: '0.0005 BTC',
};

const App = () => {
  const [invoice, setInvoice] = useState(null);
  const [paid, setPaid] = useState(false);

  const handlePayment = async () => {
    const response = await fetch('http://localhost:3000/invoice', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        amount: 5000,
        memo: 'Ticket A12 – Bitcoin Meetup Lusaka',
      }),
    });

    const data = await response.json();
    setInvoice(data.invoice);

    // Poll for payment status
    const interval = setInterval(async () => {
      const res = await fetch(`http://localhost:3000/invoice/${data.payment_hash}/status`);
      const result = await res.json();
      if (result.paid) {
        clearInterval(interval);
        setPaid(true);
      }
    }, 1000);
  };

  return (
    <div style={{ padding: 20, textAlign: 'center', fontFamily: 'Arial' }}>
      <h2>{dummyTicket.event}</h2>
      <p><strong>Date:</strong> {dummyTicket.date}</p>
      <p><strong>Seat:</strong> {dummyTicket.seat}</p>
      <p><strong>Price:</strong> {dummyTicket.price}</p>

      {!invoice && !paid && (
        <button onClick={handlePayment}>Pay with Lightning ⚡</button>
      )}

      {invoice && !paid && (
        <div>
          <p>Scan QR to Pay:</p>
          <QRCodeCanvas value={invoice} size={200} />
          <p><small>{invoice}</small></p>
        </div>
      )}

      {paid && (
        <div>
          <h3>✅ Ticket Confirmed!</h3>
          <p>Thank you for your payment.</p>
        </div>
      )}
    </div>
  );
};

export default App;
