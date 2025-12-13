import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../api/api';
import { Bell, User, Handshake, Package, Star, Search } from 'lucide-react';
import '../../index.css';

const BuyerDashboard = () => {
    const navigate = useNavigate();

    const [statsData, setStatsData] = useState({
        ongoingOrders: 0,
        completedOrders: 0
    });

    const [recentOrders, setRecentOrders] = useState([]);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) return;

                // Fetch Stats
                const statsResponse = await fetch('http://localhost:5081/api/DashboardStats/buyer', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (statsResponse.ok) {
                    const data = await statsResponse.json();
                    setStatsData(data);
                }

                // Fetch Recent Orders (active orders only, limit to 5)
                const ordersData = await api.get('/Order');
                if (ordersData) {
                    const activeOrders = ordersData
                        .filter(o => o.status !== 'Completed' && o.status !== 'Cancelled')
                        .slice(0, 5) // Show only 5 most recent
                        .map(order => ({
                            id: order.id,
                            supplier: order.sellerName || 'Unknown Supplier',
                            product: order.productName || 'Unknown Product',
                            amount: `₹${order.finalPrice}`,
                            status: order.status
                        }));
                    setRecentOrders(activeOrders);
                }

            } catch (error) {
                console.error("Error fetching dashboard data:", error);
            }
        };

        fetchDashboardData();
    }, []);

    const stats = [
        { label: 'Ongoing Orders', value: statsData.ongoingOrders, icon: <Handshake size={24} />, color: 'var(--text-main)' },
        { label: 'Completed Orders', value: statsData.completedOrders, icon: <Package size={24} />, color: 'var(--text-main)' },
    ];

    const getStatusColor = (status) => {
        if (status === 'Confirmed') return '#f59e0b';
        if (status.includes('Waiting')) return '#f59e0b';
        if (status.includes('Payment') && !status.includes('Completed')) return '#ef4444';
        if (status.includes('Negotiation')) return '#f97316';
        if (status.includes('Completed')) return '#3b82f6';
        if (status.includes('Dispatched')) return '#06b6d4';
        if (status.includes('Delivered')) return '#10b981';
        return '#64748b';
    };

    return (
        <div className="fade-in" style={{ minHeight: '100vh', background: '#f8fafc' }}>
            {/* Navigation Bar */}
            <nav style={{ background: 'white', borderBottom: '1px solid var(--border)', padding: '1rem 3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '3rem' }}>
                    <div style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--text-main)' }}>TriLink</div>
                    <div style={{ display: 'flex', gap: '2rem', fontSize: '0.95rem', fontWeight: '500' }}>
                        <a href="#" onClick={() => { const userId = localStorage.getItem('userId'); navigate(`/buyer/dashboard/${userId}`); }} style={{ color: 'var(--text-main)', cursor: 'pointer' }}>Dashboard</a>
                        <a href="#" onClick={() => { const userId = localStorage.getItem('userId'); navigate(`/buyer/search/${userId}`); }} style={{ color: 'var(--text-muted)', cursor: 'pointer' }}>Search Products</a>
                        <a href="#" onClick={() => { const userId = localStorage.getItem('userId'); navigate(`/buyer/negotiation/${userId}`); }} style={{ color: 'var(--text-muted)', cursor: 'pointer' }}>My Offers</a>
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

            <main className="container" style={{ padding: '3rem 1rem', maxWidth: '1200px' }}>
                <div style={{ marginBottom: '3rem' }}>
                    <h1 style={{ fontSize: '2rem', fontWeight: '600', marginBottom: '0.5rem' }}>Buyer Dashboard</h1>
                    <p style={{ color: 'var(--text-muted)' }}>Welcome back! Here's your overview</p>
                </div>

                {/* Stats Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.5rem', marginBottom: '3rem' }}>
                    {stats.map((stat, index) => (
                        <div key={index} className="card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '160px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <div style={{ width: '40px', height: '40px', background: '#f1f5f9', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    {stat.icon}
                                </div>
                            </div>
                            <div>
                                <div style={{ fontSize: '2rem', fontWeight: '700', lineHeight: '1' }}>{stat.value}</div>
                                <div style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>{stat.label}</div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Recent Orders */}
                <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                        <h3 style={{ fontSize: '1.1rem', fontWeight: '600' }}>Recent Orders</h3>
                        <a href="#" onClick={() => { const userId = localStorage.getItem('userId'); navigate(`/buyer/orders/${userId}`); }} style={{ fontSize: '0.9rem', color: 'var(--text-muted)', cursor: 'pointer' }}>View All</a>
                    </div>
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
                                {recentOrders.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>No active orders</td>
                                    </tr>
                                ) : (
                                    recentOrders.map((order) => (
                                        <tr key={order.id} style={{ borderBottom: '1px solid var(--border)' }}>
                                            <td style={{ padding: '1rem 1.5rem', fontWeight: '500', fontFamily: 'monospace', color: 'var(--text-muted)' }}>#{order.id.substring(0, 8)}</td>
                                            <td style={{ padding: '1rem 1.5rem' }}>{order.supplier}</td>
                                            <td style={{ padding: '1rem 1.5rem', color: 'var(--text-muted)' }}>{order.product}</td>
                                            <td style={{ padding: '1rem 1.5rem', fontWeight: '500' }}>{order.amount}</td>
                                            <td style={{ padding: '1rem 1.5rem' }}>
                                                <span style={{
                                                    background: `${getStatusColor(order.status)}15`,
                                                    color: getStatusColor(order.status),
                                                    padding: '0.25rem 0.75rem', borderRadius: '20px', fontSize: '0.85rem', fontWeight: '500'
                                                }}>
                                                    {order.status}
                                                </span>
                                            </td>
                                            <td style={{ padding: '1rem 1.5rem', textAlign: 'right' }}>
                                                <button
                                                    onClick={() => { const userId = localStorage.getItem('userId'); navigate(`/buyer/orders/${userId}`); }}
                                                    style={{ background: 'white', border: '1px solid var(--border)', padding: '0.4rem 1rem', borderRadius: '6px', fontSize: '0.85rem', cursor: 'pointer' }}
                                                >
                                                    View Details
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default BuyerDashboard;
