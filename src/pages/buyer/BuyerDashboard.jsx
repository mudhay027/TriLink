import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, User, Handshake, Package, Star, Search } from 'lucide-react';
import '../../index.css';

const BuyerDashboard = () => {
    const navigate = useNavigate();

    const stats = [
        { label: 'My Offers', value: '24', change: '+12%', icon: <Handshake size={24} />, color: 'var(--text-main)' },
        { label: 'My Orders', value: '15', change: '+8%', icon: <Package size={24} />, color: 'var(--text-main)' },
        { label: 'Recommended Suppliers', value: '8', change: 'New', icon: <Star size={24} />, color: 'var(--text-main)' },
    ];

    const suppliers = [
        { id: 1, name: 'MetalWorks Co.', category: 'Steel & Aluminum', rating: 4.2 },
        { id: 2, name: 'Copper Solutions', category: 'Copper & Brass', rating: 4.8 },
        { id: 3, name: 'Plastics Inc.', category: 'Polymers & Resins', rating: 4.5 },
        { id: 4, name: 'Global Metals', category: 'Multi-Material', rating: 4.3 },
    ];

    return (
        <div className="fade-in" style={{ minHeight: '100vh', background: '#f8fafc' }}>
            {/* Navigation Bar */}
            <nav style={{ background: 'white', borderBottom: '1px solid var(--border)', padding: '1rem 3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '3rem' }}>
                    <div style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--text-main)' }}>TriLink</div>
                    <div style={{ display: 'flex', gap: '2rem', fontSize: '0.95rem', fontWeight: '500' }}>
                        <a href="#" style={{ color: 'var(--text-main)' }}>Dashboard</a>
                        <a href="#" onClick={() => navigate('/buyer/search')} style={{ color: 'var(--text-muted)', cursor: 'pointer' }}>Search Products</a>
                        <a href="#" style={{ color: 'var(--text-muted)' }}>My Offers</a>
                        <a href="#" style={{ color: 'var(--text-muted)' }}>Orders</a>
                    </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                    <Bell size={20} color="var(--text-muted)" />
                    <div style={{ width: '32px', height: '32px', background: '#e2e8f0', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
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
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', marginBottom: '3rem' }}>
                    {stats.map((stat, index) => (
                        <div key={index} className="card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '160px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <div style={{ width: '40px', height: '40px', background: '#f1f5f9', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    {stat.icon}
                                </div>
                                <span style={{ fontSize: '0.85rem', color: '#10b981', fontWeight: '500' }}>{stat.change}</span>
                            </div>
                            <div>
                                <div style={{ fontSize: '2rem', fontWeight: '700', lineHeight: '1' }}>{stat.value}</div>
                                <div style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>{stat.label}</div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Quick Filters */}
                <div style={{ marginBottom: '3rem' }}>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '1rem' }}>Quick Filters</h3>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <button style={{ background: 'black', color: 'white', padding: '0.5rem 1.25rem', borderRadius: '8px', fontSize: '0.9rem', fontWeight: '500' }}>All Materials</button>
                        {['Steel', 'Aluminum', 'Copper', 'Plastic'].map((filter) => (
                            <button key={filter} style={{ background: 'white', border: '1px solid var(--border)', padding: '0.5rem 1.25rem', borderRadius: '8px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                                {filter}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Recommended Suppliers */}
                <div>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '1.5rem' }}>Recommended Suppliers</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem' }}>
                        {suppliers.map((supplier) => (
                            <div key={supplier.id} className="card" style={{ padding: '1.5rem' }}>
                                <div style={{ height: '120px', background: '#e2e8f0', borderRadius: '8px', marginBottom: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                                    Supplier Logo
                                </div>
                                <h4 style={{ fontWeight: '600', marginBottom: '0.25rem' }}>{supplier.name}</h4>
                                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>{supplier.category}</p>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', marginBottom: '1rem' }}>
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} size={14} fill={i < Math.floor(supplier.rating) ? "black" : "none"} color="black" />
                                    ))}
                                    <span style={{ fontSize: '0.85rem', fontWeight: '500', marginLeft: '0.25rem' }}>{supplier.rating}</span>
                                </div>
                                <button
                                    onClick={() => navigate('/buyer/search')}
                                    style={{ width: '100%', background: 'black', color: 'white', padding: '0.6rem', borderRadius: '6px', fontSize: '0.9rem' }}
                                >
                                    View Profile
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default BuyerDashboard;
