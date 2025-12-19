import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Bell, User, Search, Filter, ChevronRight, Clock, CheckCircle, XCircle, AlertCircle, Truck, ArrowRight } from 'lucide-react';
import '../../index.css';

const SupplierOrders = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [activeTab, setActiveTab] = useState('active');

    // Mock Data for Orders
    const [activeOrders, setActiveOrders] = useState([]);
    const [orderHistory, setOrderHistory] = useState([]);

    const [negotiationRequests, setNegotiationRequests] = useState([]);
    const [activeNegotiations, setActiveNegotiations] = useState([]);
    const [rejectedNegotiations, setRejectedNegotiations] = useState([]);
    const [completedNegotiations, setCompletedNegotiations] = useState([]);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) return;

                // Fetch Orders
                const response = await fetch('http://localhost:5081/api/Order', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                if (response.ok) {
                    const data = await response.json();

                    const mappedOrders = data.map(order => ({
                        id: order.id, // Display full ID or slice
                        buyer: order.buyerName || 'Unknown Buyer',
                        product: order.productName || 'Unknown Product',
                        quantity: `${order.quantity} ${order.unit}`,
                        date: new Date(order.createdAt).toLocaleDateString(),
                        status: order.status,
                        amount: `₹${order.totalPrice || order.finalPrice}`
                    }));

                    setActiveOrders(mappedOrders.filter(o => o.status !== 'Completed' && o.status !== 'Cancelled'));
                    setOrderHistory(mappedOrders.filter(o => o.status === 'Completed' || o.status === 'Cancelled'));
                }

                // Fetch Negotiation Requests
                const negResponse = await fetch('http://localhost:5081/api/Negotiation', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                if (negResponse.ok) {
                    const negData = await negResponse.json();

                    // Filter for 'Negotiation' status (pending requests)
                    const negotiations = negData.filter(n => n.status === 'Negotiation').map(n => {
                        // Use quantity directly from negotiation data
                        const quantity = n.quantity ? `${n.quantity} ${n.productUnit || n.unit || 'units'}` : 'N/A';

                        return {
                            id: n.id,
                            buyer: n.buyerCompanyName || n.buyerName || 'Unknown Buyer',
                            buyerId: n.buyerId,
                            buyerEmail: n.buyerEmail || n.buyerName,
                            buyerPhone: n.buyerPhone,
                            buyerLocation: n.buyerLocation,
                            product: n.productName || 'Unknown Product',
                            productImage: n.productImageUrl || '/placeholder-product.png',
                            originalOffer: `₹${n.productBasePrice || 0}/${n.productUnit || 'unit'}`,
                            counterOffer: (n.pricePerUnit > 0 && n.totalPrice > 0) ? `₹${n.pricePerUnit}/${n.unit || n.productUnit || 'unit'} (Total: ₹${n.totalPrice})` : `₹${n.currentOfferAmount || 0}`,
                            quantity: quantity,
                            expectedDelivery: n.desiredDeliveryDate ? new Date(n.desiredDeliveryDate).toLocaleDateString() : 'N/A',
                            status: n.status
                        };
                    });
                    setNegotiationRequests(negotiations);

                    // Filter for 'InNegotiation' status (active negotiations)
                    const activeNegs = negData.filter(n => n.status === 'InNegotiation').map(n => {
                        // Use quantity directly from negotiation data
                        const quantity = n.quantity ? `${n.quantity} ${n.productUnit || n.unit || 'units'}` : 'N/A';

                        return {
                            id: n.id,
                            buyer: n.buyerCompanyName || n.buyerName || 'Unknown Buyer',
                            buyerId: n.buyerId,
                            buyerEmail: n.buyerEmail || n.buyerName,
                            buyerPhone: n.buyerPhone,
                            buyerLocation: n.buyerLocation,
                            product: n.productName || 'Unknown Product',
                            productImage: n.productImageUrl || '/placeholder-product.png',
                            originalOffer: `₹${n.productBasePrice || 0}/${n.productUnit || 'unit'}`,
                            counterOffer: (n.pricePerUnit > 0 && n.totalPrice > 0) ? `₹${n.pricePerUnit}/${n.unit || n.productUnit || 'unit'} (Total: ₹${n.totalPrice})` : `₹${n.currentOfferAmount || 0}`,
                            quantity: quantity,
                            expectedDelivery: n.desiredDeliveryDate ? new Date(n.desiredDeliveryDate).toLocaleDateString() : 'N/A',
                            status: n.status
                        };
                    });
                    setActiveNegotiations(activeNegs);

                    // Filter for 'Rejected' status (rejected negotiations for Order History)
                    const rejected = negData.filter(n => n.status === 'Rejected').map(n => {
                        const latestOffer = n.offers && n.offers.length > 0 ? n.offers[n.offers.length - 1] : null;
                        const message = latestOffer?.message || '';
                        let quantity = 'N/A';
                        if (message.includes('units')) {
                            const qtyPart = message.split('units')[0].replace('Counter Offer:', '').trim();
                            quantity = qtyPart + ' ' + (n.productUnit || 'units');
                        }
                        return {
                            id: n.id,
                            buyer: n.buyerCompanyName || n.buyerName || 'Unknown Buyer',
                            buyerId: n.buyerId,
                            product: n.productName || 'Unknown Product',
                            productImage: n.productImageUrl || '/placeholder-product.png',
                            originalOffer: `₹${n.productBasePrice || 0}/${n.productUnit || 'unit'}`,
                            counterOffer: (n.pricePerUnit > 0 && n.totalPrice > 0) ? `₹${n.pricePerUnit}/${n.unit || n.productUnit || 'unit'} (Total: ₹${n.totalPrice})` : `₹${n.currentOfferAmount || 0}`,
                            quantity: n.quantity ? `${n.quantity} ${n.productUnit || n.unit || 'units'}` : 'N/A',
                            status: 'Negotiation Rejected'
                        };
                    });
                    setRejectedNegotiations(rejected);

                    // Filter for 'Accepted' status (completed negotiations)
                    const completed = negData.filter(n => n.status === 'Accepted').map(n => {
                        const quantity = n.quantity ? `${n.quantity} ${n.productUnit || n.unit || 'units'}` : 'N/A';

                        return {
                            id: n.id,
                            buyer: n.buyerCompanyName || n.buyerName || 'Unknown Buyer',
                            buyerId: n.buyerId,
                            buyerEmail: n.buyerEmail || n.buyerName,
                            product: n.productName || 'Unknown Product',
                            productImage: n.productImageUrl || '/placeholder-product.png',
                            originalOffer: `₹${n.productBasePrice || 0}/${n.productUnit || 'unit'}`,
                            counterOffer: (n.pricePerUnit > 0 && n.totalPrice > 0) ? `₹${n.pricePerUnit}/${n.unit || n.productUnit || 'unit'} (Total: ₹${n.totalPrice})` : `₹${n.currentOfferAmount || 0}`,
                            quantity: quantity,
                            expectedDelivery: n.desiredDeliveryDate ? new Date(n.desiredDeliveryDate).toLocaleDateString() : 'N/A',
                            status: 'Accepted'
                        };
                    });
                    setCompletedNegotiations(completed);
                }

            } catch (error) {
                console.error("Failed to fetch data:", error);
            }
        };

        fetchOrders();
    }, [location.key]); // Re-fetch on navigation/mount



    const handlePaymentReceived = async (orderId) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:5081/api/Order/${orderId}/status`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ status: 'Completed' })
            });

            if (response.ok) {
                // Update local state after successful API call
                const orderToMove = activeOrders.find(o => o.id === orderId);
                if (orderToMove) {
                    setActiveOrders(prev => prev.filter(o => o.id !== orderId));
                    setOrderHistory(prev => [{ ...orderToMove, status: 'Completed' }, ...prev]);
                }
            } else {
                console.error("Failed to update order status");
                alert("Failed to mark payment as received. Please try again.");
            }
        } catch (err) {
            console.error("Error updating order status:", err);
            alert("Error updating order status.");
        }
    };


    const handleCancelOrder = (orderId) => {
        if (confirm('Are you sure you want to cancel this order?')) {
            const orderToMove = activeOrders.find(o => o.id === orderId);
            if (orderToMove) {
                // Remove from active
                setActiveOrders(prev => prev.filter(o => o.id !== orderId));
                // Add to history with new status
                setOrderHistory(prev => [{ ...orderToMove, status: 'Cancelled' }, ...prev]);
            }
        }
    };

    // Modal State
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [selectedOrderId, setSelectedOrderId] = useState(null);

    // Buyer Details Modal State
    const [showBuyerModal, setShowBuyerModal] = useState(false);
    const [buyerDetails, setBuyerDetails] = useState(null);
    const [loadingBuyerDetails, setLoadingBuyerDetails] = useState(false);
    const [modalPosition, setModalPosition] = useState({ top: 0, left: 0 });

    const fetchBuyerDetails = async (buyerId, event) => {
        setLoadingBuyerDetails(true);

        // Calculate position near the button
        const buttonRect = event.target.getBoundingClientRect();
        setModalPosition({
            top: buttonRect.bottom + window.scrollY + 5,
            left: buttonRect.left + window.scrollX
        });

        setShowBuyerModal(true);

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:5081/api/User/${buyerId}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                const data = await response.json();
                setBuyerDetails(data);
            } else {
                alert('Failed to fetch buyer details');
                setShowBuyerModal(false);
            }
        } catch (error) {
            console.error('Error fetching buyer details:', error);
            alert('Error fetching buyer details');
            setShowBuyerModal(false);
        } finally {
            setLoadingBuyerDetails(false);
        }
    };

    const handleCancelOrderClick = (orderId) => {
        setSelectedOrderId(orderId);
        setShowCancelModal(true);
    };

    const confirmCancelOrder = async () => {
        if (!selectedOrderId) return;

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:5081/api/Order/${selectedOrderId}/status`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ status: 'Cancelled' })
            });

            if (response.ok) {
                // Update UI
                const orderToMove = activeOrders.find(o => o.id === selectedOrderId);
                if (orderToMove) {
                    setActiveOrders(prev => prev.filter(o => o.id !== selectedOrderId));
                    setOrderHistory(prev => [{ ...orderToMove, status: 'Cancelled' }, ...prev]);
                }
                setShowCancelModal(false);
                setSelectedOrderId(null);
            } else {
                alert("Failed to cancel order.");
            }
        } catch (error) {
            console.error("Error cancelling order:", error);
            alert("Error cancelling order.");
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Pending Approval': return '#f59e0b'; // Amber
            case 'Supplier Accepted': return '#3b82f6'; // Blue
            case 'Payment Pending': return '#f59e0b'; // Amber/Orange
            case 'Awaiting Logistics': return '#8b5cf6'; // Purple
            case 'Scheduled for Dispatch': return '#06b6d4'; // Cyan
            case 'Delivered': return '#10b981'; // Green
            case 'Order Completed': return '#10b981'; // Green
            case 'Cancelled': return '#ef4444'; // Red
            case 'Negotiation In Progress': return '#f97316'; // Orange
            case 'Declined': return '#ef4444'; // Red
            case 'Waiting for Approval': return '#f59e0b'; // Amber
            case 'Confirmed': return '#10b981'; // Green (Confirmed Order)
            default: return '#64748b'; // Slate
        }
    };

    return (
        <div className="fade-in" style={{ minHeight: '100vh', background: '#f8fafc' }}>
            {/* Modal Overlay */}
            {showCancelModal && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
                }}>
                    <div style={{ background: 'white', padding: '2rem', borderRadius: '8px', width: '400px', maxWidth: '90%' }}>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem' }}>Cancel Order</h3>
                        <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
                            Are you sure you want to cancel this order? This action cannot be undone.
                        </p>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                            <button
                                onClick={() => setShowCancelModal(false)}
                                style={{ padding: '0.5rem 1rem', border: '1px solid #e2e8f0', background: 'white', borderRadius: '6px' }}
                            >
                                No, Keep Order
                            </button>
                            <button
                                onClick={confirmCancelOrder}
                                style={{ padding: '0.5rem 1rem', background: '#ef4444', color: 'white', borderRadius: '6px', border: 'none' }}
                            >
                                Yes, Cancel Order
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Buyer Details Modal */}
            {showBuyerModal && (
                <div
                    onClick={() => {
                        setShowBuyerModal(false);
                        setBuyerDetails(null);
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
                            <h3 style={{ fontSize: '1.1rem', fontWeight: '600', margin: 0 }}>Buyer Details</h3>
                            <button
                                onClick={() => {
                                    setShowBuyerModal(false);
                                    setBuyerDetails(null);
                                }}
                                style={{ background: 'none', border: 'none', fontSize: '1.25rem', cursor: 'pointer', color: '#94a3b8' }}
                            >
                                ×
                            </button>
                        </div>

                        {loadingBuyerDetails ? (
                            <div style={{ textAlign: 'center', padding: '1.5rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                                Loading...
                            </div>
                        ) : buyerDetails ? (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                <div style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: '0.75rem' }}>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.25rem', fontWeight: '500', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Company Name</div>
                                    <div style={{ fontSize: '1rem', fontWeight: '600' }}>{buyerDetails.companyName || 'N/A'}</div>
                                </div>

                                <div style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: '0.75rem' }}>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.25rem', fontWeight: '500', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Contact Person</div>
                                    <div style={{ fontSize: '0.9rem' }}>{buyerDetails.contactPerson || 'N/A'}</div>
                                </div>

                                <div style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: '0.75rem' }}>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.25rem', fontWeight: '500', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Email</div>
                                    <div style={{ fontSize: '0.9rem', color: '#3b82f6' }}>{buyerDetails.email || 'N/A'}</div>
                                </div>

                                <div style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: '0.75rem' }}>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.25rem', fontWeight: '500', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Phone</div>
                                    <div style={{ fontSize: '0.9rem' }}>{buyerDetails.contactNumber || 'N/A'}</div>
                                </div>

                                <div>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.25rem', fontWeight: '500', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Location</div>
                                    <div style={{ fontSize: '0.9rem' }}>{buyerDetails.addressLine1 || 'N/A'}</div>
                                </div>
                            </div>
                        ) : null}
                    </div>
                </div>
            )}

            {/* Navigation Bar */}
            <nav style={{ background: 'white', borderBottom: '1px solid var(--border)', padding: '1rem 3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '3rem' }}>
                    <div style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--text-main)' }}>TriLink</div>
                    <div style={{ display: 'flex', gap: '2rem', fontSize: '0.95rem', fontWeight: '500' }}>
                        <a href="#" onClick={() => { const userId = localStorage.getItem('userId'); navigate(`/supplier/dashboard/${userId}`); }} style={{ color: 'var(--text-muted)', cursor: 'pointer' }}>Dashboard</a>
                        <a href="#" onClick={() => { const userId = localStorage.getItem('userId'); navigate(`/supplier/products/${userId}`); }} style={{ color: 'var(--text-muted)', cursor: 'pointer' }}>Products</a>
                        <a href="#" style={{ color: 'var(--text-main)', cursor: 'default' }}>Orders</a>
                        <a href="#" onClick={() => { const userId = localStorage.getItem('userId'); navigate(`/supplier/logistics-job-creation/${userId}`); }} style={{ color: 'var(--text-muted)', cursor: 'pointer' }}>Logistics Jobs</a>
                    </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                    <Bell size={20} color="var(--text-muted)" />
                    <div
                        style={{ width: '32px', height: '32px', background: '#e2e8f0', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                        onClick={() => { const userId = localStorage.getItem('userId'); navigate(`/supplier/profile/${userId}`); }}
                    >
                        <User size={18} color="var(--text-muted)" />
                    </div>
                </div>
            </nav>

            <main className="container" style={{ padding: '3rem 1rem', maxWidth: '1200px', margin: '0 auto' }}>
                <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <h1 style={{ fontSize: '2rem', fontWeight: '600', marginBottom: '0.5rem' }}>Order Management</h1>
                        <p style={{ color: 'var(--text-muted)' }}>Track and manage your orders and negotiations</p>
                    </div>
                </div>

                {/* Tabs */}
                <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', borderBottom: '1px solid var(--border)' }}>
                    {['active', 'activeNegotiations', 'completedNegotiations', 'negotiations', 'history'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            style={{
                                padding: '0.75rem 1.5rem',
                                background: 'transparent',
                                border: 'none',
                                borderBottom: activeTab === tab ? '2px solid black' : '2px solid transparent',
                                color: activeTab === tab ? 'black' : 'var(--text-muted)',
                                fontWeight: '500',
                                cursor: 'pointer',
                                textTransform: 'capitalize'
                            }}
                        >
                            {tab === 'active' ? 'Active Orders' : tab === 'activeNegotiations' ? 'Active Negotiation' : tab === 'completedNegotiations' ? 'Completed Negotiation' : tab === 'negotiations' ? 'Negotiation Requests' : 'Order History'}
                        </button>
                    ))}
                </div>

                {/* Content */}
                {activeTab === 'active' && (
                    <div className="fade-in">
                        {activeOrders.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>No active orders.</div>
                        ) : (
                            activeOrders.map((order) => (
                                <div key={order.id} className="card" style={{ padding: '1.5rem', marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                                            <span style={{ fontWeight: '600', fontSize: '1.1rem' }}>{order.buyer}</span>
                                            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', background: '#f1f5f9', padding: '0.2rem 0.6rem', borderRadius: '4px' }}>{order.id}</span>
                                        </div>
                                        <div style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '0.25rem' }}>
                                            {order.product} • {order.quantity}
                                        </div>
                                        <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                                            Amount: <span style={{ color: 'black', fontWeight: '500' }}>{order.amount}</span>
                                        </div>
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                        <div style={{ marginBottom: '0.5rem' }}>
                                            <span style={{
                                                background: `${getStatusColor(order.status)}15`,
                                                color: getStatusColor(order.status),
                                                padding: '0.3rem 0.8rem',
                                                borderRadius: '20px',
                                                fontSize: '0.85rem',
                                                fontWeight: '600',
                                                display: 'inline-flex',
                                                alignItems: 'center',
                                                gap: '0.4rem'
                                            }}>
                                                <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: getStatusColor(order.status) }}></div>
                                                {order.status}
                                            </span>
                                        </div>
                                        <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>Expected: {order.date}</div>

                                        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                                            <button
                                                onClick={() => handleCancelOrderClick(order.id)}
                                                className="btn"
                                                style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem', color: '#ef4444', border: '1px solid #fee2e2', background: '#fef2f2' }}
                                            >
                                                Cancel Order
                                            </button>
                                            <button
                                                onClick={() => handlePaymentReceived(order.id)}
                                                className="btn btn-primary"
                                                style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}
                                            >
                                                Payment Received
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}

                {activeTab === 'activeNegotiations' && (
                    <div className="fade-in">
                        {activeNegotiations.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>No active negotiations.</div>
                        ) : (
                            activeNegotiations.map((req) => (
                                <div key={req.id} className="card" style={{ padding: '1.5rem', marginBottom: '1rem', borderLeft: '4px solid #10b981' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                                        <div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                                <h3 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '0' }}>{req.buyer}</h3>
                                                <button
                                                    onClick={(e) => fetchBuyerDetails(req.buyerId, e)}
                                                    style={{
                                                        padding: '0.25rem 0.75rem',
                                                        background: '#3b82f6',
                                                        color: 'white',
                                                        border: 'none',
                                                        borderRadius: '4px',
                                                        fontSize: '0.75rem',
                                                        fontWeight: '500',
                                                        cursor: 'pointer'
                                                    }}
                                                >
                                                    Buyer Details
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
                                                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.5rem', fontWeight: '500' }}>Buyer's Counter</div>
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
                                                navigate(`/supplier/chat/${userId}?threadId=${req.id}`);
                                            }}
                                            style={{ padding: '0.5rem 1.5rem', background: '#10b981', color: 'white', borderRadius: '6px', fontWeight: '500' }}
                                        >
                                            Continue Negotiation
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}

                {activeTab === 'completedNegotiations' && (
                    <div className="fade-in">
                        {completedNegotiations.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>No completed negotiations.</div>
                        ) : (
                            completedNegotiations.map((req) => (
                                <div key={req.id} className="card" style={{ padding: '1.5rem', marginBottom: '1rem', borderLeft: '4px solid #3b82f6' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                                        <div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                                <h3 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '0' }}>{req.buyer}</h3>
                                                <button
                                                    onClick={(e) => fetchBuyerDetails(req.buyerId, e)}
                                                    style={{
                                                        padding: '0.25rem 0.75rem',
                                                        background: '#3b82f6',
                                                        color: 'white',
                                                        border: 'none',
                                                        borderRadius: '4px',
                                                        fontSize: '0.75rem',
                                                        fontWeight: '500',
                                                        cursor: 'pointer'
                                                    }}
                                                >
                                                    Buyer Details
                                                </button>
                                            </div>
                                            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.25rem' }}>Negotiation completed for {req.product}</p>
                                        </div>
                                        <span style={{ color: '#3b82f6', fontWeight: '500', fontSize: '0.9rem', background: '#dbeafe', padding: '0.3rem 0.8rem', borderRadius: '6px', height: 'fit-content' }}>
                                            Accepted
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
                                                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.5rem', fontWeight: '500' }}>Accepted Offer</div>
                                                <div style={{ fontWeight: '600', color: '#3b82f6', fontSize: '1.1rem' }}>{req.counterOffer}</div>
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
                                                navigate(`/supplier/chat/${userId}?threadId=${req.id}`);
                                            }}
                                            style={{ padding: '0.5rem 1.5rem', background: '#3b82f6', color: 'white', borderRadius: '6px', fontWeight: '500', border: 'none', cursor: 'pointer' }}
                                        >
                                            View Chat
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}

                {activeTab === 'negotiations' && (
                    <div className="fade-in">
                        {negotiationRequests.map((req) => (
                            <div key={req.id} className="card" style={{ padding: '1.5rem', marginBottom: '1rem', borderLeft: '4px solid #f97316' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                                    <div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                            <h3 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '0' }}>{req.buyer}</h3>
                                            <button
                                                onClick={(e) => fetchBuyerDetails(req.buyerId, e)}
                                                style={{
                                                    padding: '0.25rem 0.75rem',
                                                    background: '#3b82f6',
                                                    color: 'white',
                                                    border: 'none',
                                                    borderRadius: '4px',
                                                    fontSize: '0.75rem',
                                                    fontWeight: '500',
                                                    cursor: 'pointer'
                                                }}
                                            >
                                                Buyer Details
                                            </button>
                                        </div>
                                        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.25rem' }}>Requested a counter-offer for {req.product}</p>
                                    </div>
                                    <span style={{ color: '#f97316', fontWeight: '500', fontSize: '0.9rem', background: '#fff7ed', padding: '0.3rem 0.8rem', borderRadius: '6px', height: 'fit-content' }}>
                                        Action Required
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
                                            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.5rem', fontWeight: '500' }}>Buyer's Counter</div>
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

                                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                                    <button
                                        onClick={async () => {
                                            if (!confirm('Are you sure you want to reject this offer?')) return;
                                            try {
                                                const token = localStorage.getItem('token');
                                                const response = await fetch(`http://localhost:5081/api/Negotiation/${req.id}/status`, {
                                                    method: 'PUT',
                                                    headers: {
                                                        'Authorization': `Bearer ${token}`,
                                                        'Content-Type': 'application/json'
                                                    },
                                                    body: JSON.stringify({ status: 'Rejected' })
                                                });
                                                if (response.ok) {
                                                    setNegotiationRequests(prev => prev.filter(r => r.id !== req.id));
                                                    alert('Negotiation request rejected and moved to Order History');
                                                } else {
                                                    alert("Failed to reject offer. Please try again.");
                                                }
                                            } catch (err) {
                                                console.error("Error rejecting offer:", err);
                                                alert("Error rejecting offer.");
                                            }
                                        }}
                                        style={{ padding: '0.5rem 1rem', border: '1px solid #e2e8f0', background: 'white', borderRadius: '6px', fontWeight: '500', color: '#ef4444' }}
                                    >
                                        Reject
                                    </button>
                                    {req.status === 'Waiting for Approval' ? (
                                        <button
                                            onClick={async () => {
                                                try {
                                                    const token = localStorage.getItem('token');
                                                    const response = await fetch(`http://localhost:5081/api/Negotiation/${req.id}/status`, {
                                                        method: 'PUT',
                                                        headers: {
                                                            'Authorization': `Bearer ${token}`,
                                                            'Content-Type': 'application/json'
                                                        },
                                                        body: JSON.stringify({ status: 'Accepted' })
                                                    });
                                                    if (response.ok) {
                                                        setNegotiationRequests(prev => prev.filter(r => r.id !== req.id));
                                                        // Optionally move to active orders or navigate
                                                        alert("Counter Offer Accepted!");
                                                    } else {
                                                        alert("Failed to accept offer.");
                                                    }
                                                } catch (err) {
                                                    console.error("Error accepting offer:", err);
                                                }
                                            }}
                                            style={{ padding: '0.5rem 1.5rem', background: 'black', color: 'white', borderRadius: '6px', fontWeight: '500' }}
                                        >
                                            Accept Counter Offer
                                        </button>
                                    ) : (
                                        <button
                                            onClick={async () => {
                                                try {
                                                    const token = localStorage.getItem('token');
                                                    const response = await fetch(`http://localhost:5081/api/Negotiation/${req.id}/status`, {
                                                        method: 'PUT',
                                                        headers: {
                                                            'Authorization': `Bearer ${token}`,
                                                            'Content-Type': 'application/json'
                                                        },
                                                        body: JSON.stringify({ status: 'InNegotiation' })
                                                    });
                                                    if (response.ok) {
                                                        // Move from negotiationRequests to activeNegotiations
                                                        setNegotiationRequests(prev => prev.filter(r => r.id !== req.id));
                                                        setActiveNegotiations(prev => [...prev, req]);
                                                        setActiveTab('activeNegotiations');
                                                        alert('Moved to Active Negotiation!');
                                                    } else {
                                                        alert('Failed to start negotiation.');
                                                    }
                                                } catch (err) {
                                                    console.error('Error starting negotiation:', err);
                                                }
                                            }}
                                            style={{ padding: '0.5rem 1.5rem', background: 'black', color: 'white', borderRadius: '6px', fontWeight: '500' }}
                                        >
                                            Negotiate
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                        {negotiationRequests.length === 0 && (
                            <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                                <p>No pending negotiation requests.</p>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'history' && (
                    <div className="fade-in">
                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.95rem', background: 'white', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                            <thead style={{ background: '#f8fafc', color: 'var(--text-muted)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                <tr>
                                    <th style={{ padding: '1rem 1.5rem', textAlign: 'left', fontWeight: '600' }}>Order ID</th>
                                    <th style={{ padding: '1rem 1.5rem', textAlign: 'left', fontWeight: '600' }}>Buyer</th>
                                    <th style={{ padding: '1rem 1.5rem', textAlign: 'left', fontWeight: '600' }}>Product</th>
                                    <th style={{ padding: '1rem 1.5rem', textAlign: 'left', fontWeight: '600' }}>Date</th>
                                    <th style={{ padding: '1rem 1.5rem', textAlign: 'left', fontWeight: '600' }}>Status</th>
                                    <th style={{ padding: '1rem 1.5rem', textAlign: 'right', fontWeight: '600' }}>Amount</th>
                                </tr>
                            </thead>
                            <tbody>
                                {/* Rejected Negotiations */}
                                {rejectedNegotiations.map((neg) => (
                                    <tr key={neg.id} style={{ borderBottom: '1px solid var(--border)' }}>
                                        <td style={{ padding: '1rem 1.5rem', color: 'var(--text-muted)' }}>{neg.id}</td>
                                        <td style={{ padding: '1rem 1.5rem', fontWeight: '500' }}>{neg.buyer}</td>
                                        <td style={{ padding: '1rem 1.5rem' }}>{neg.product}</td>
                                        <td style={{ padding: '1rem 1.5rem', color: 'var(--text-muted)' }}></td>
                                        <td style={{ padding: '1rem 1.5rem' }}>
                                            <span style={{
                                                color: '#ef4444',
                                                fontWeight: '500',
                                                fontSize: '0.9rem',
                                                background: '#fee2e2',
                                                padding: '0.3rem 0.8rem',
                                                borderRadius: '6px'
                                            }}>
                                                {neg.status}
                                            </span>
                                        </td>
                                        <td style={{ padding: '1rem 1.5rem', textAlign: 'right', fontWeight: '500' }}>{neg.counterOffer}</td>
                                    </tr>
                                ))}

                                {/* Completed Orders */}
                                {orderHistory.map((order) => (
                                    <tr key={order.id} style={{ borderBottom: '1px solid var(--border)' }}>
                                        <td style={{ padding: '1rem 1.5rem', color: 'var(--text-muted)' }}>{order.id}</td>
                                        <td style={{ padding: '1rem 1.5rem', fontWeight: '500' }}>{order.buyer}</td>
                                        <td style={{ padding: '1rem 1.5rem' }}>{order.product}</td>
                                        <td style={{ padding: '1rem 1.5rem', color: 'var(--text-muted)' }}>{order.date}</td>
                                        <td style={{ padding: '1rem 1.5rem' }}>
                                            <span style={{
                                                color: getStatusColor(order.status),
                                                fontWeight: '500',
                                                fontSize: '0.9rem'
                                            }}>
                                                {order.status}
                                            </span>
                                        </td>
                                        <td style={{ padding: '1rem 1.5rem', textAlign: 'right', fontWeight: '500' }}>{order.amount}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {(orderHistory.length === 0 && rejectedNegotiations.length === 0) && (
                            <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                                <p>No order history.</p>
                            </div>
                        )}
                    </div>
                )}
            </main>
        </div>
    );
};

export default SupplierOrders;
