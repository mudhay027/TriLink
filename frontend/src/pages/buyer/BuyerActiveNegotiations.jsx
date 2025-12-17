import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Bell, User } from 'lucide-react';
import '../../index.css';

const BuyerActiveNegotiations = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [activeTab, setActiveTab] = useState('requests');
    const [negotiationRequests, setNegotiationRequests] = useState([]);
    const [activeNegotiations, setActiveNegotiations] = useState([]);
    const [rejectedNegotiations, setRejectedNegotiations] = useState([]);

    // Supplier Details Modal State
    const [showSupplierModal, setShowSupplierModal] = useState(false);
    const [supplierDetails, setSupplierDetails] = useState(null);
    const [loadingSupplierDetails, setLoadingSupplierDetails] = useState(false);
    const [modalPosition, setModalPosition] = useState({ top: 0, left: 0 });

    useEffect(() => {
        const fetchNegotiations = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) return;

                const response = await fetch('http://localhost:5081/api/Negotiation', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                if (response.ok) {
                    const negData = await response.json();

                    // Filter for 'Negotiation' status (pending requests - buyer sent counter offer)
                    const requests = negData.filter(n => n.status === 'Negotiation').map(n => {
                        // Use quantity directly from negotiation data
                        const quantity = n.quantity ? `${n.quantity} ${n.productUnit || n.unit || 'units'}` : 'N/A';

                        return {
                            id: n.id,
                            seller: n.sellerCompanyName || n.sellerName || 'Unknown Seller',
                            sellerId: n.sellerId,
                            sellerEmail: n.sellerName,
                            product: n.productName || 'Unknown Product',
                            productImage: n.productImageUrl || '/placeholder-product.png',
                            originalOffer: `₹${n.productBasePrice || 0}/${n.productUnit || 'unit'}`,
                            counterOffer: `₹${n.currentOfferAmount || 0}`,
                            quantity: quantity,
                            expectedDelivery: n.desiredDeliveryDate ? new Date(n.desiredDeliveryDate).toLocaleDateString() : 'N/A',
                            status: n.status
                        };
                    });
                    setNegotiationRequests(requests);

                    // Filter for 'InNegotiation' status (active negotiations - supplier accepted to negotiate)
                    const activeNegs = negData.filter(n => n.status === 'InNegotiation').map(n => {
                        // Use quantity directly from negotiation data
                        const quantity = n.quantity ? `${n.quantity} ${n.productUnit || n.unit || 'units'}` : 'N/A';

                        return {
                            id: n.id,
                            seller: n.sellerCompanyName || n.sellerName || 'Unknown Seller',
                            sellerId: n.sellerId,
                            sellerEmail: n.sellerName,
                            product: n.productName || 'Unknown Product',
                            productImage: n.productImageUrl || '/placeholder-product.png',
                            originalOffer: `₹${n.productBasePrice || 0}/${n.productUnit || 'unit'}`,
                            counterOffer: `₹${n.currentOfferAmount || 0}`,
                            quantity: quantity,
                            expectedDelivery: n.desiredDeliveryDate ? new Date(n.desiredDeliveryDate).toLocaleDateString() : 'N/A',
                            status: n.status
                        };
                    });
                    setActiveNegotiations(activeNegs);

                    // Filter for 'Rejected' status (cancelled negotiations for Order History)
                    const rejected = negData.filter(n => n.status === 'Rejected').map(n => {
                        // Use quantity directly from negotiation data
                        const quantity = n.quantity ? `${n.quantity} ${n.productUnit || n.unit || 'units'}` : 'N/A';

                        return {
                            id: n.id,
                            seller: n.sellerCompanyName || n.sellerName || 'Unknown Seller',
                            sellerId: n.sellerId,
                            sellerEmail: n.sellerName,
                            product: n.productName || 'Unknown Product',
                            productImage: n.productImageUrl || '/placeholder-product.png',
                            originalOffer: `₹${n.productBasePrice || 0}/${n.productUnit || 'unit'}`,
                            counterOffer: `₹${n.currentOfferAmount || 0}`,
                            quantity: quantity,
                            expectedDelivery: n.desiredDeliveryDate ? new Date(n.desiredDeliveryDate).toLocaleDateString() : 'N/A',
                            status: 'Cancelled by Supplier'
                        };
                    });
                    setRejectedNegotiations(rejected);
                }
            } catch (error) {
                console.error("Failed to fetch negotiations:", error);
            }
        };

        fetchNegotiations();
    }, [location.key]);

    const fetchSupplierDetails = async (sellerId, event) => {
        setLoadingSupplierDetails(true);

        // Calculate position near the button
        const buttonRect = event.target.getBoundingClientRect();
        setModalPosition({
            top: buttonRect.bottom + window.scrollY + 5,
            left: buttonRect.left + window.scrollX
        });

        setShowSupplierModal(true);

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:5081/api/User/${sellerId}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                const data = await response.json();
                setSupplierDetails(data);
            } else {
                alert('Failed to fetch supplier details');
                setShowSupplierModal(false);
            }
        } catch (error) {
            console.error('Error fetching supplier details:', error);
            alert('Error fetching supplier details');
            setShowSupplierModal(false);
        } finally {
            setLoadingSupplierDetails(false);
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
                        <a href="#" onClick={() => { const userId = localStorage.getItem('userId'); navigate(`/buyer/search/${userId}`); }} style={{ color: 'var(--text-muted)', cursor: 'pointer' }}>Search Products</a>
                        <a href="#" style={{ color: 'var(--text-main)' }}>Negotiation</a>
                        <a href="#" onClick={() => { const userId = localStorage.getItem('userId'); navigate(`/buyer/orders/${userId}`); }} style={{ color: 'var(--text-muted)', cursor: 'pointer' }}>Orders</a>
                        <a href="#" onClick={() => { const userId = localStorage.getItem('userId'); navigate(`/buyer/logistics-jobs/${userId}`); }} style={{ color: 'var(--text-muted)', cursor: 'pointer' }}>Logistics Jobs</a>
                    </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                    <Bell size={20} color="var(--text-muted)" />
                    <div style={{ width: '32px', height: '32px', background: '#e2e8f0', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                        onClick={() => { const userId = localStorage.getItem('userId'); navigate(`/buyer/profile/${userId}`); }}
                    >
                        <User size={18} color="var(--text-muted)" />
                    </div>
                </div>
            </nav>

            <main className="container" style={{ padding: '3rem 1rem', maxWidth: '1200px', margin: '0 auto' }}>
                <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <h1 style={{ fontSize: '2rem', fontWeight: '600', marginBottom: '0.5rem' }}>Active Negotiation</h1>
                        <p style={{ color: 'var(--text-muted)' }}>Track your counter offers and ongoing negotiations</p>
                    </div>
                </div>

                {/* Tabs */}
                <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', borderBottom: '1px solid var(--border)' }}>
                    {['requests', 'active', 'history'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            style={{
                                padding: '0.75rem 1.5rem',
                                background: 'transparent',
                                border: 'none',
                                borderBottom: activeTab === tab ? '2px solid black' : '2px solid transparent',
                                color: activeTab === tab ? 'var(--text-main)' : 'var(--text-muted)',
                                fontWeight: activeTab === tab ? '600' : '500',
                                cursor: 'pointer',
                                transition: 'all 0.2s',
                                textTransform: 'capitalize'
                            }}
                        >
                            {tab === 'requests' ? 'Negotiation Requests' : tab === 'active' ? 'Active Negotiation' : 'Order History'}
                        </button>
                    ))}
                </div>

                {/* Negotiation Requests Tab */}
                {activeTab === 'requests' && (
                    <div className="fade-in">
                        {negotiationRequests.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>No negotiation requests. Send a counter offer to start!</div>
                        ) : (
                            negotiationRequests.map((req) => (
                                <div key={req.id} className="card" style={{ padding: '1.5rem', marginBottom: '1rem', borderLeft: '4px solid #f97316' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                                        <div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                                <h3 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '0' }}>{req.seller}</h3>
                                                <button
                                                    onClick={(e) => fetchSupplierDetails(req.sellerId, e)}
                                                    style={{
                                                        padding: '0.25rem 0.75rem',
                                                        background: '#3b82f6',
                                                        color: 'white',
                                                        borderRadius: '6px',
                                                        fontWeight: '500',
                                                        fontSize: '0.75rem',
                                                        border: 'none',
                                                        cursor: 'pointer'
                                                    }}
                                                >
                                                    Supplier Details
                                                </button>
                                            </div>
                                            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.25rem' }}>Counter offer sent for {req.product}</p>
                                        </div>
                                        <span style={{ color: '#f97316', fontWeight: '500', fontSize: '0.9rem', background: '#fff7ed', padding: '0.3rem 0.8rem', borderRadius: '6px', height: 'fit-content' }}>
                                            Awaiting Response
                                        </span>
                                    </div>

                                    <div style={{ display: 'flex', gap: '1.5rem', background: '#f8fafc', padding: '1.5rem', borderRadius: '8px' }}>
                                        {/* Product Image */}
                                        <div style={{ flexShrink: 0 }}>
                                            <img
                                                src={`http://localhost:5081${req.productImage}`}
                                                alt={req.product}
                                                style={{
                                                    width: '120px',
                                                    height: '120px',
                                                    objectFit: 'cover',
                                                    borderRadius: '8px',
                                                    border: '2px solid #e2e8f0'
                                                }}
                                                onError={(e) => {
                                                    e.target.src = 'https://via.placeholder.com/120?text=No+Image';
                                                }}
                                            />
                                        </div>

                                        {/* Details Grid */}
                                        <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '1.5rem' }}>
                                            <div>
                                                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.5rem', fontWeight: '500' }}>Original Price</div>
                                                <div style={{ fontWeight: '500', textDecoration: 'line-through', color: '#94a3b8', fontSize: '0.95rem' }}>{req.originalOffer}</div>
                                            </div>
                                            <div>
                                                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.5rem', fontWeight: '500' }}>Your Counter Offer</div>
                                                <div style={{ fontWeight: '600', color: '#f97316', fontSize: '1.1rem' }}>{req.counterOffer}</div>
                                            </div>
                                            <div>
                                                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.5rem', fontWeight: '500' }}>Quantity</div>
                                                <div style={{ fontWeight: '500', fontSize: '0.95rem' }}>{req.quantity}</div>
                                            </div>
                                            <div>
                                                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.5rem', fontWeight: '500' }}>Expected Delivery</div>
                                                <div style={{ fontWeight: '500', fontSize: '0.95rem', color: '#3b82f6' }}>{req.expectedDelivery}</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}

                {/* Active Negotiation Tab */}
                {activeTab === 'active' && (
                    <div className="fade-in">
                        {activeNegotiations.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>No active negotiations.</div>
                        ) : (
                            activeNegotiations.map((req) => (
                                <div key={req.id} className="card" style={{ padding: '1.5rem', marginBottom: '1rem', borderLeft: '4px solid #10b981' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                                        <div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                                <h3 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '0' }}>{req.seller}</h3>
                                                <button
                                                    onClick={(e) => fetchSupplierDetails(req.sellerId, e)}
                                                    style={{
                                                        padding: '0.25rem 0.75rem',
                                                        background: '#3b82f6',
                                                        color: 'white',
                                                        borderRadius: '6px',
                                                        fontWeight: '500',
                                                        fontSize: '0.75rem',
                                                        border: 'none',
                                                        cursor: 'pointer'
                                                    }}
                                                >
                                                    Supplier Details
                                                </button>
                                            </div>
                                            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.25rem' }}>Negotiating for {req.product}</p>
                                        </div>
                                        <span style={{ color: '#10b981', fontWeight: '500', fontSize: '0.9rem', background: '#d1fae5', padding: '0.3rem 0.8rem', borderRadius: '6px', height: 'fit-content' }}>
                                            In Progress
                                        </span>
                                    </div>

                                    <div style={{ display: 'flex', gap: '1.5rem', background: '#f8fafc', padding: '1.5rem', borderRadius: '8px', marginBottom: '1.5rem' }}>
                                        {/* Product Image */}
                                        <div style={{ flexShrink: 0 }}>
                                            <img
                                                src={`http://localhost:5081${req.productImage}`}
                                                alt={req.product}
                                                style={{
                                                    width: '120px',
                                                    height: '120px',
                                                    objectFit: 'cover',
                                                    borderRadius: '8px',
                                                    border: '2px solid #e2e8f0'
                                                }}
                                                onError={(e) => {
                                                    e.target.src = 'https://via.placeholder.com/120?text=No+Image';
                                                }}
                                            />
                                        </div>

                                        {/* Details Grid */}
                                        <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '1.5rem' }}>
                                            <div>
                                                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.5rem', fontWeight: '500' }}>Original Price</div>
                                                <div style={{ fontWeight: '500', textDecoration: 'line-through', color: '#94a3b8', fontSize: '0.95rem' }}>{req.originalOffer}</div>
                                            </div>
                                            <div>
                                                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.5rem', fontWeight: '500' }}>Your Counter Offer</div>
                                                <div style={{ fontWeight: '600', color: '#10b981', fontSize: '1.1rem' }}>{req.counterOffer}</div>
                                            </div>
                                            <div>
                                                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.5rem', fontWeight: '500' }}>Quantity</div>
                                                <div style={{ fontWeight: '500', fontSize: '0.95rem' }}>{req.quantity}</div>
                                            </div>
                                            <div>
                                                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.5rem', fontWeight: '500' }}>Expected Delivery</div>
                                                <div style={{ fontWeight: '500', fontSize: '0.95rem', color: '#3b82f6' }}>{req.expectedDelivery}</div>
                                            </div>
                                        </div>
                                    </div>

                                    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                                        <button
                                            onClick={() => {
                                                const userId = localStorage.getItem('userId');
                                                navigate(`/buyer/chat/${userId}?threadId=${req.id}`);
                                            }}
                                            style={{ padding: '0.5rem 1.5rem', background: '#10b981', color: 'white', borderRadius: '6px', fontWeight: '500', border: 'none', cursor: 'pointer' }}
                                        >
                                            Continue Negotiation
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}

                {/* Order History Tab */}
                {activeTab === 'history' && (
                    <div className="fade-in">
                        {rejectedNegotiations.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>No cancelled negotiations in history.</div>
                        ) : (
                            rejectedNegotiations.map((req) => (
                                <div key={req.id} className="card" style={{ padding: '1.5rem', marginBottom: '1rem', borderLeft: '4px solid #94a3b8' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                                        <div>
                                            <h3 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '0.25rem' }}>{req.seller}</h3>
                                            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{req.product}</p>
                                        </div>
                                        <span style={{ color: '#64748b', fontWeight: '500', fontSize: '0.9rem', background: '#f1f5f9', padding: '0.3rem 0.8rem', borderRadius: '6px', height: 'fit-content' }}>
                                            {req.status}
                                        </span>
                                    </div>

                                    <div style={{ display: 'flex', gap: '1.5rem', background: '#f8fafc', padding: '1.5rem', borderRadius: '8px' }}>
                                        {/* Product Image */}
                                        <div style={{ flexShrink: 0 }}>
                                            <img
                                                src={`http://localhost:5081${req.productImage}`}
                                                alt={req.product}
                                                style={{
                                                    width: '120px',
                                                    height: '120px',
                                                    objectFit: 'cover',
                                                    borderRadius: '8px',
                                                    border: '2px solid #e2e8f0'
                                                }}
                                                onError={(e) => {
                                                    e.target.src = 'https://via.placeholder.com/120?text=No+Image';
                                                }}
                                            />
                                        </div>

                                        {/* Details Grid */}
                                        <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '1.5rem' }}>
                                            <div>
                                                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.5rem', fontWeight: '500' }}>Original Price</div>
                                                <div style={{ fontWeight: '500', textDecoration: 'line-through', color: '#94a3b8', fontSize: '0.95rem' }}>{req.originalOffer}</div>
                                            </div>
                                            <div>
                                                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.5rem', fontWeight: '500' }}>Your Counter Offer</div>
                                                <div style={{ fontWeight: '600', color: '#94a3b8', fontSize: '1.1rem' }}>{req.counterOffer}</div>
                                            </div>
                                            <div>
                                                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.5rem', fontWeight: '500' }}>Quantity</div>
                                                <div style={{ fontWeight: '500', fontSize: '0.95rem' }}>{req.quantity}</div>
                                            </div>
                                            <div>
                                                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.5rem', fontWeight: '500' }}>Expected Delivery</div>
                                                <div style={{ fontWeight: '500', fontSize: '0.95rem', color: '#3b82f6' }}>{req.expectedDelivery}</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}
            </main>

            {/* Supplier Details Modal */}
            {showSupplierModal && (
                <div
                    onClick={() => {
                        setShowSupplierModal(false);
                        setSupplierDetails(null);
                    }}
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: 'transparent',
                        zIndex: 999
                    }}
                >
                    <div
                        onClick={(e) => e.stopPropagation()}
                        style={{
                            position: 'absolute',
                            top: `${modalPosition.top}px`,
                            left: `${modalPosition.left}px`,
                            background: 'white',
                            padding: '1.5rem',
                            borderRadius: '8px',
                            width: '350px',
                            boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
                            border: '1px solid #e2e8f0',
                            zIndex: 1000
                        }}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                            <h3 style={{ fontSize: '1.1rem', fontWeight: '600', margin: 0 }}>Supplier Details</h3>
                            <button
                                onClick={() => {
                                    setShowSupplierModal(false);
                                    setSupplierDetails(null);
                                }}
                                style={{ background: 'none', border: 'none', fontSize: '1.25rem', cursor: 'pointer', color: '#94a3b8' }}
                            >
                                ×
                            </button>
                        </div>

                        {loadingSupplierDetails ? (
                            <div style={{ textAlign: 'center', padding: '1.5rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                                Loading...
                            </div>
                        ) : supplierDetails ? (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                <div style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: '0.75rem' }}>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.25rem', fontWeight: '500', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Company Name</div>
                                    <div style={{ fontSize: '1rem', fontWeight: '600' }}>{supplierDetails.companyName || 'N/A'}</div>
                                </div>

                                <div style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: '0.75rem' }}>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.25rem', fontWeight: '500', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Contact Person</div>
                                    <div style={{ fontSize: '0.9rem' }}>{supplierDetails.contactPerson || 'N/A'}</div>
                                </div>

                                <div style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: '0.75rem' }}>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.25rem', fontWeight: '500', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Email</div>
                                    <div style={{ fontSize: '0.9rem', color: '#3b82f6' }}>{supplierDetails.email || 'N/A'}</div>
                                </div>

                                <div style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: '0.75rem' }}>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.25rem', fontWeight: '500', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Phone</div>
                                    <div style={{ fontSize: '0.9rem' }}>{supplierDetails.contactNumber || 'N/A'}</div>
                                </div>

                                <div>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.25rem', fontWeight: '500', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Location</div>
                                    <div style={{ fontSize: '0.9rem' }}>{supplierDetails.addressLine1 || 'N/A'}</div>
                                </div>
                            </div>
                        ) : null}
                    </div>
                </div>
            )}
        </div>
    );
};

export default BuyerActiveNegotiations;
