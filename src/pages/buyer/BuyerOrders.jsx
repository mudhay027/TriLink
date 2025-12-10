import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, User, Search, Filter, ChevronDown, FileText, CheckCircle, Clock, AlertCircle, DollarSign, Package } from 'lucide-react';
import '../../index.css';

const BuyerOrders = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('active');

    // Mock Data reflecting the scenarios
    // Mock Data reflecting the scenarios
    const activeOrders = [
        {
            id: 'ORD-2025-007',
            supplier: 'MetaWorks Co.',
            product: 'Stainless Steel 304',
            amount: '₹48,000',
            quantity: '100 MT',
            date: '2025-01-21',
            status: 'Waiting for Supplier Approval',
            actionRequired: false
        },
        {
            id: 'ORD-2025-008',
            supplier: 'Global Metals',
            product: 'Aluminum 6061',
            amount: '₹2,60,000',
            quantity: '50 MT',
            date: '2025-01-20',
            status: 'Request Accepted – Negotiation Available',
            actionRequired: true,
            actionLabel: 'Negotiate'
        },
        {
            id: 'ORD-2025-005',
            supplier: 'Global Metals',
            product: 'Aluminum 6061',
            amount: '₹2,66,000',
            quantity: '50 MT',
            date: '2025-01-19',
            status: 'Make Payment',
            actionRequired: true,
            actionLabel: 'Pay Now'
        }
    ];

    const orderHistory = [
        {
            id: 'ORD-2025-002',
            supplier: 'Plastics Inc.',
            product: 'HDPE Granules',
            amount: '₹60,000',
            quantity: '200 MT',
            date: '2025-01-15',
            status: 'Payment Completed',
            invoiceAvailable: false
        },
        {
            id: 'ORD-2025-001',
            supplier: 'BuildRight',
            product: 'Cement Grade 53',
            amount: '₹2,70,000',
            quantity: '1000 Bags',
            date: '2025-01-10',
            status: 'Invoice Generated',
            invoiceAvailable: true
        }
    ];

    const getStatusColor = (status) => {
        if (status.includes('Waiting')) return '#f59e0b'; // Amber
        if (status.includes('Payment') && !status.includes('Completed')) return '#ef4444'; // Red (Action needed)
        if (status.includes('Negotiation')) return '#f97316'; // Orange
        if (status.includes('Completed')) return '#3b82f6'; // Blue
        if (status.includes('Invoice')) return '#10b981'; // Green
        if (status.includes('Request Accepted')) return '#10b981'; // Green
        return '#64748b';
    };

    return (
        <div className="fade-in" style={{ minHeight: '100vh', background: '#f8fafc' }}>
            {/* Navigation Bar */}
            <nav style={{ background: 'white', borderBottom: '1px solid var(--border)', padding: '1rem 3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '3rem' }}>
                    <div style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--text-main)' }}>TriLink</div>
                    <div style={{ display: 'flex', gap: '2rem', fontSize: '0.95rem', fontWeight: '500' }}>
                        <a href="#" onClick={() => navigate('/buyer/dashboard')} style={{ color: 'var(--text-muted)', cursor: 'pointer' }}>Dashboard</a>
                        <a href="#" onClick={() => navigate('/buyer/search')} style={{ color: 'var(--text-muted)', cursor: 'pointer' }}>Search Products</a>
                        <a href="#" style={{ color: 'var(--text-muted)' }}>My Offers</a>
                        <a href="#" style={{ color: 'var(--text-main)' }}>Orders</a>
                    </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                    <Bell size={20} color="var(--text-muted)" />
                    <div
                        style={{ width: '32px', height: '32px', background: '#e2e8f0', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                        onClick={() => navigate('/buyer/profile')}
                    >
                        <User size={18} color="var(--text-muted)" />
                    </div>
                </div>
            </nav>

            <main className="container" style={{ padding: '3rem 1rem', maxWidth: '1200px' }}>
                <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <h1 style={{ fontSize: '1.75rem', fontWeight: '600', marginBottom: '0.5rem' }}>My Orders</h1>
                        <p style={{ color: 'var(--text-muted)' }}>Manage your ongoing and past orders</p>
                    </div>
                </div>

                {/* Tabs */}
                <div style={{ display: 'flex', gap: '2rem', borderBottom: '1px solid var(--border)', marginBottom: '2rem' }}>
                    <button
                        onClick={() => setActiveTab('active')}
                        style={{
                            padding: '0.75rem 0',
                            background: 'none',
                            border: 'none',
                            borderBottom: activeTab === 'active' ? '2px solid black' : '2px solid transparent',
                            fontWeight: activeTab === 'active' ? '600' : '400',
                            color: activeTab === 'active' ? 'black' : 'var(--text-muted)',
                            cursor: 'pointer'
                        }}
                    >
                        Active Orders
                    </button>
                    <button
                        onClick={() => setActiveTab('history')}
                        style={{
                            padding: '0.75rem 0',
                            background: 'none',
                            border: 'none',
                            borderBottom: activeTab === 'history' ? '2px solid black' : '2px solid transparent',
                            fontWeight: activeTab === 'history' ? '600' : '400',
                            color: activeTab === 'history' ? 'black' : 'var(--text-muted)',
                            cursor: 'pointer'
                        }}
                    >
                        Order History
                    </button>
                </div>

                {/* Orders List */}
                <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.95rem' }}>
                        <thead style={{ background: '#f8fafc', color: 'var(--text-muted)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                            <tr>
                                <th style={{ padding: '1rem 1.5rem', textAlign: 'left', fontWeight: '600' }}>Order ID</th>
                                <th style={{ padding: '1rem 1.5rem', textAlign: 'left', fontWeight: '600' }}>Supplier</th>
                                <th style={{ padding: '1rem 1.5rem', textAlign: 'left', fontWeight: '600' }}>Product</th>
                                <th style={{ padding: '1rem 1.5rem', textAlign: 'left', fontWeight: '600' }}>Amount</th>
                                <th style={{ padding: '1rem 1.5rem', textAlign: 'left', fontWeight: '600' }}>Status</th>
                                <th style={{ padding: '1rem 1.5rem', textAlign: 'right', fontWeight: '600' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {(activeTab === 'active' ? activeOrders : orderHistory).map((order) => (
                                <tr key={order.id} style={{ borderBottom: '1px solid var(--border)' }}>
                                    <td style={{ padding: '1rem 1.5rem', fontWeight: '500' }}>{order.id}</td>
                                    <td style={{ padding: '1rem 1.5rem' }}>{order.supplier}</td>
                                    <td style={{ padding: '1rem 1.5rem', color: 'var(--text-muted)' }}>
                                        <div>{order.product}</div>
                                        <div style={{ fontSize: '0.8rem' }}>Qty: {order.quantity}</div>
                                    </td>
                                    <td style={{ padding: '1rem 1.5rem', fontWeight: '500' }}>{order.amount}</td>
                                    <td style={{ padding: '1rem 1.5rem' }}>
                                        <span style={{
                                            background: `${getStatusColor(order.status)}15`,
                                            color: getStatusColor(order.status),
                                            padding: '0.25rem 0.75rem', borderRadius: '20px', fontSize: '0.85rem', fontWeight: '500',
                                            display: 'inline-flex', alignItems: 'center', gap: '0.4rem'
                                        }}>
                                            {order.status === 'Invoice Generated' && <CheckCircle size={14} />}
                                            {order.status}
                                        </span>
                                    </td>
                                    <td style={{ padding: '1rem 1.5rem', textAlign: 'right' }}>
                                        {order.actionRequired ? (
                                            <button
                                                onClick={() => {
                                                    if (order.status.includes('Negotiation')) navigate('/buyer/negotiation');
                                                    else alert('Redirecting to Payment Gateway...');
                                                }}
                                                className="btn btn-primary"
                                                style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}
                                            >
                                                {order.actionLabel}
                                            </button>
                                        ) : (
                                            <button
                                                onClick={() => {
                                                    if (order.invoiceAvailable) navigate('/buyer/invoice-preview');
                                                    else alert('Viewing Order Details...');
                                                }}
                                                style={{ background: 'white', border: '1px solid var(--border)', padding: '0.5rem 1rem', borderRadius: '6px', fontSize: '0.85rem', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
                                            >
                                                {order.invoiceAvailable ? <><FileText size={14} /> View Invoice</> : 'View Details'}
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </main>
        </div>
    );
};

export default BuyerOrders;
