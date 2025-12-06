import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, User, Package, Handshake, ShoppingBag, Plus, Check, X } from 'lucide-react';
import '../../index.css';

const SupplierDashboard = () => {
    const navigate = useNavigate();

    const stats = [
        { label: 'Active Listings', value: '48', icon: <Package size={24} />, color: 'var(--text-main)' },
        { label: 'Offers Received', value: '23', icon: <Handshake size={24} />, color: 'var(--text-main)' },
        { label: 'Orders', value: '15', icon: <ShoppingBag size={24} />, color: 'var(--text-main)' },
    ];

    const offers = [
        { id: 1, buyer: 'ABC Construction', product: 'Steel Rebar 12mm', price: '₹42,000/ton', quantity: '50 tons', status: 'Pending' },
        { id: 2, buyer: 'BuildRight Ltd', product: 'Cement Grade 53', price: '₹270/bag', quantity: '1000 bags', status: 'Pending' },
    ];

    return (
        <div className="fade-in" style={{ minHeight: '100vh', background: '#f8fafc' }}>
            {/* Navigation Bar */}
            <nav style={{ background: 'white', borderBottom: '1px solid var(--border)', padding: '1rem 3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '3rem' }}>
                    <div style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--text-main)' }}>TriLink</div>
                    <div style={{ display: 'flex', gap: '2rem', fontSize: '0.95rem', fontWeight: '500' }}>
                        <a href="#" style={{ color: 'var(--text-main)' }}>Dashboard</a>
                        <a href="#" onClick={() => navigate('/supplier/products')} style={{ color: 'var(--text-muted)', cursor: 'pointer' }}>Products</a>
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
                    <h1 style={{ fontSize: '2rem', fontWeight: '600', marginBottom: '0.5rem' }}>Supplier Dashboard</h1>
                    <p style={{ color: 'var(--text-muted)' }}>Manage your products and track offers</p>
                </div>

                {/* Stats Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem', marginBottom: '3rem' }}>
                    {stats.map((stat, index) => (
                        <div key={index} className="card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '160px' }}>
                            <div style={{ width: '40px', height: '40px', background: '#f1f5f9', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                                {stat.icon}
                            </div>
                            <div>
                                <div style={{ fontSize: '2rem', fontWeight: '700', lineHeight: '1' }}>{stat.value}</div>
                                <div style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>{stat.label}</div>
                            </div>
                        </div>
                    ))}

                    {/* Add Product Card */}
                    <div className="card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <button
                            onClick={() => navigate('/supplier/add-product')}
                            style={{ background: 'black', color: 'white', padding: '0.75rem 1.5rem', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '500' }}
                        >
                            <Plus size={18} /> Add Product
                        </button>
                    </div>
                </div>

                {/* Recent Offers Section */}
                <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
                    <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h3 style={{ fontSize: '1.1rem', fontWeight: '600' }}>Recent Offers</h3>
                        <a href="#" style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>View All</a>
                    </div>

                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.95rem' }}>
                            <thead style={{ background: '#f8fafc', color: 'var(--text-muted)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                <tr>
                                    <th style={{ padding: '1rem 1.5rem', textAlign: 'left', fontWeight: '600' }}>Buyer</th>
                                    <th style={{ padding: '1rem 1.5rem', textAlign: 'left', fontWeight: '600' }}>Product</th>
                                    <th style={{ padding: '1rem 1.5rem', textAlign: 'left', fontWeight: '600' }}>Offered Price</th>
                                    <th style={{ padding: '1rem 1.5rem', textAlign: 'left', fontWeight: '600' }}>Quantity</th>
                                    <th style={{ padding: '1rem 1.5rem', textAlign: 'left', fontWeight: '600' }}>Status</th>
                                    <th style={{ padding: '1rem 1.5rem', textAlign: 'right', fontWeight: '600' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {offers.map((offer) => (
                                    <tr key={offer.id} style={{ borderBottom: '1px solid var(--border)' }}>
                                        <td style={{ padding: '1.25rem 1.5rem', fontWeight: '500' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                                <div style={{ width: '32px', height: '32px', background: '#f1f5f9', borderRadius: '50%' }}></div>
                                                {offer.buyer}
                                            </div>
                                        </td>
                                        <td style={{ padding: '1.25rem 1.5rem' }}>{offer.product}</td>
                                        <td style={{ padding: '1.25rem 1.5rem', fontWeight: '500' }}>{offer.price}</td>
                                        <td style={{ padding: '1.25rem 1.5rem' }}>{offer.quantity}</td>
                                        <td style={{ padding: '1.25rem 1.5rem' }}>
                                            <span style={{ background: '#f1f5f9', padding: '0.25rem 0.75rem', borderRadius: '20px', fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: '500' }}>
                                                {offer.status}
                                            </span>
                                        </td>
                                        <td style={{ padding: '1.25rem 1.5rem', textAlign: 'right' }}>
                                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                                                <button style={{ background: 'black', color: 'white', padding: '0.4rem 1rem', borderRadius: '6px', fontSize: '0.85rem' }}>Accept</button>
                                                <button style={{ background: 'white', border: '1px solid var(--border)', padding: '0.4rem 1rem', borderRadius: '6px', fontSize: '0.85rem' }}>Counter</button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default SupplierDashboard;
