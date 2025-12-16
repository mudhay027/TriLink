import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Bell, User, Send } from 'lucide-react';
import '../../index.css';

const Negotiation = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const negotiationId = searchParams.get('negotiationId');

    const [negotiation, setNegotiation] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');

    useEffect(() => {
        const fetchNegotiation = async () => {
            if (!negotiationId) return;

            try {
                const token = localStorage.getItem('token');
                const response = await fetch(`http://localhost:5081/api/Negotiation/${negotiationId}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                if (response.ok) {
                    const data = await response.json();
                    setNegotiation(data);

                    // Build message list starting with initial supplier offer
                    const allMessages = [];

                    // Add initial supplier offer (from negotiation creation)
                    const initialQty = parseFloat(data.quantity || data.productQuantity) || 0;
                    const initialPrice = parseFloat(data.productBasePrice) || 0;
                    const initialTotal = initialQty * initialPrice;

                    allMessages.push({
                        id: 'initial-' + data.id,
                        sender: data.sellerCompanyName || data.sellerName || 'Supplier',
                        message: `Initial Offer: ₹${initialPrice}/${data.unit || data.productUnit || 'unit'}`,
                        quantity: `${data.quantity || data.productQuantity || 'N/A'} ${data.unit || data.productUnit || 'units'}`,
                        price: `₹${initialTotal.toFixed(2)}`,
                        date: new Date(data.createdAt).toLocaleString()
                    });

                    // Add all counter offers from buyers/suppliers
                    if (data.offers && data.offers.length > 0) {
                        const counterOffers = data.offers.map(offer => {
                            // Parse quantity from message if not in database
                            // Message format: "Counter Offer: 200 units at ₹2000 by 2030-07-02"
                            let offerQty = parseFloat(offer.quantity) || 0;
                            if (offerQty === 0 && offer.message) {
                                const qtyMatch = offer.message.match(/(\d+)\s*units/i);
                                if (qtyMatch) offerQty = parseFloat(qtyMatch[1]);
                            }
                            // Fallback to negotiation quantity
                            if (offerQty === 0) offerQty = parseFloat(data.quantity) || 0;

                            const offerPrice = parseFloat(offer.amount) || 0;
                            const offerTotal = offerQty * offerPrice;
                            const displayUnit = data.unit || data.productUnit || 'units';

                            return {
                                id: offer.id,
                                sender: offer.senderId === data.buyerId
                                    ? (data.buyerCompanyName || data.buyerName || 'You')
                                    : (data.sellerCompanyName || data.sellerName || 'Supplier'),
                                message: `Counter Offer: ₹${offerPrice}/${displayUnit}`,
                                quantity: `${offerQty || 'N/A'} ${displayUnit}`,
                                price: `₹${offerTotal.toFixed(2)}`,
                                date: new Date(offer.createdAt).toLocaleString()
                            };
                        });
                        allMessages.push(...counterOffers);
                    }

                    setMessages(allMessages);
                }
            } catch (error) {
                console.error('Failed to fetch negotiation:', error);
            }
        };

        fetchNegotiation();
    }, [negotiationId]);

    const handleSendMessage = async () => {
        if (!newMessage.trim()) {
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:5081/api/Negotiation/${negotiationId}/offers`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    message: newMessage,
                    amount: 0,
                    quantity: 0
                })
            });

            if (response.ok) {
                setNewMessage('');
                window.location.reload();
            } else {
                alert('Failed to send message');
            }
        } catch (error) {
            console.error('Failed to send message:', error);
            alert('Error sending message');
        }
    };

    return (
        <div className="fade-in" style={{ minHeight: '100vh', background: '#f8fafc' }}>
            {/* Navigation Bar */}
            <nav style={{ background: 'white', borderBottom: '1px solid var(--border)', padding: '1rem 3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '3rem' }}>
                    <div style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--text-main)' }}>TriLink</div>
                    <div style={{ display: 'flex', gap: '2rem', fontSize: '0.95rem', fontWeight: '500' }}>
                        <a href="#" onClick={() => { const userId = localStorage.getItem('userId'); navigate(`/buyer/dashboard/${userId}`); }} style={{ color: 'var(--text-muted)', cursor: 'pointer' }}>Dashboard</a>
                        <a href="#" onClick={() => { const userId = localStorage.getItem('userId'); navigate(`/buyer/search/${userId}`); }} style={{ color: 'var(--text-main)', cursor: 'pointer' }}>Search Products</a>
                        <a href="#" onClick={() => { const userId = localStorage.getItem('userId'); navigate(`/buyer/active-negotiations/${userId}`); }} style={{ color: 'var(--text-muted)', cursor: 'pointer' }}>Negotiation</a>
                        <a href="#" onClick={() => { const userId = localStorage.getItem('userId'); navigate(`/buyer/orders/${userId}`); }} style={{ color: 'var(--text-muted)', cursor: 'pointer' }}>Orders</a>
                        <a href="#" onClick={() => { const userId = localStorage.getItem('userId'); navigate(`/buyer/logistics-jobs/${userId}`); }} style={{ color: 'var(--text-muted)', cursor: 'pointer' }}>Logistics Jobs</a>
                    </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                    <Bell size={20} color="var(--text-muted)" />
                    <div
                        style={{ width: '32px', height: '32px', background: '#e2e8f0', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                        onClick={() => { const userId = localStorage.getItem('userId'); navigate(`/buyer/profile/${userId}`); }}
                    >
                        <User size={18} color="var(--text-muted)" />
                    </div>
                </div>
            </nav>

            <main className="container" style={{ padding: '2rem 1rem', maxWidth: '1000px', margin: '0 auto' }}>
                <div style={{ background: 'white', borderRadius: '12px', padding: '2rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                    {/* Header */}
                    <div style={{ marginBottom: '2rem', borderBottom: '1px solid var(--border)', paddingBottom: '1rem' }}>
                        <h1 style={{ fontSize: '1.75rem', fontWeight: '600', marginBottom: '0.5rem' }}>Negotiation Thread</h1>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
                            {negotiation ? `Product: ${negotiation.productName} (SKU: ${negotiation.productSku || 'TCT-2025-001'})` : 'Loading...'}
                        </p>
                    </div>

                    {/* Message Thread */}
                    <div style={{ marginBottom: '2rem', maxHeight: '500px', overflowY: 'auto', padding: '1rem', background: '#f8fafc', borderRadius: '8px' }}>
                        {messages.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                                No messages yet. Start the negotiation!
                            </div>
                        ) : (
                            messages.map((msg) => (
                                <div key={msg.id} style={{ marginBottom: '1.5rem' }}>
                                    {/* Sender Info */}
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                                        <div style={{ width: '32px', height: '32px', background: msg.sender === 'You' ? '#1e40af' : '#e2e8f0', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <User size={16} color={msg.sender === 'You' ? 'white' : 'var(--text-muted)'} />
                                        </div>
                                        <div>
                                            <div style={{ fontWeight: '600', fontSize: '0.95rem' }}>{msg.sender}</div>
                                        </div>
                                    </div>

                                    {/* Message Content */}
                                    <div style={{
                                        background: msg.sender === 'You' ? '#1e40af' : 'white',
                                        color: msg.sender === 'You' ? 'white' : 'var(--text-main)',
                                        padding: '1rem',
                                        borderRadius: '8px',
                                        marginLeft: '2.5rem',
                                        border: msg.sender === 'You' ? 'none' : '1px solid var(--border)'
                                    }}>
                                        <p style={{ marginBottom: '0.75rem', whiteSpace: 'pre-line' }}>{msg.message}</p>
                                        <div style={{ display: 'flex', gap: '2rem', fontSize: '0.85rem', borderTop: msg.sender === 'You' ? '1px solid rgba(255,255,255,0.2)' : '1px solid var(--border)', paddingTop: '0.75rem' }}>
                                            <div><strong>Qty:</strong> {msg.quantity}</div>
                                            <div><strong>Price:</strong> {msg.price}</div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Message Input */}
                    <div style={{ display: 'flex', gap: '0.75rem', padding: '1rem', background: '#f8fafc', borderRadius: '8px', alignItems: 'center' }}>
                        <input
                            type="text"
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                            style={{
                                flex: 1,
                                padding: '0.75rem 1rem',
                                border: '1px solid var(--border)',
                                borderRadius: '24px',
                                fontSize: '0.95rem',
                                outline: 'none'
                            }}
                            placeholder="Type a message..."
                        />
                        <button
                            onClick={handleSendMessage}
                            style={{
                                padding: '0.75rem',
                                background: 'black',
                                color: 'white',
                                borderRadius: '50%',
                                border: 'none',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: '44px',
                                height: '44px'
                            }}
                        >
                            <Send size={18} />
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Negotiation;
