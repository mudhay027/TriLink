import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, User, Search, Filter, ChevronDown, SlidersHorizontal } from 'lucide-react';
import '../../index.css';

const SearchProducts = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');

    const products = [
        { id: 1, name: 'Stainless Steel 304', supplier: 'MetaWorks Co.', price: '₹50,000/MT', moq: '10 MT', lead: '14 days' },
        { id: 2, name: 'Aluminum 6061', supplier: 'Global Metals', price: '₹266,000/MT', moq: '5 MT', lead: '10 days' },
        { id: 3, name: 'Copper Wire C11000', supplier: 'Copper Solutions', price: '₹3,50,000/MT', moq: '2 MT', lead: '7 days' },
        { id: 4, name: 'HDPE Granules', supplier: 'Plastics Inc.', price: '₹60,000/MT', moq: '20 MT', lead: '21 days' },
        { id: 5, name: 'Carbon Steel A36', supplier: 'MetalWorks Co.', price: '₹50,000/MT', moq: '50 MT', lead: '14 days' },
        { id: 6, name: 'Brass Sheets C26000', supplier: 'Copper Solutions', price: '₹550,000/MT', moq: '3 MT', lead: '12 days' },
    ];

    return (
        <div className="fade-in" style={{ minHeight: '100vh', background: '#f8fafc' }}>
            {/* Navigation Bar */}
            <nav style={{ background: 'white', borderBottom: '1px solid var(--border)', padding: '1rem 3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '3rem' }}>
                    <div style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--text-main)' }}>TriLink</div>
                    <div style={{ display: 'flex', gap: '2rem', fontSize: '0.95rem', fontWeight: '500' }}>
                        <a href="#" onClick={() => navigate('/buyer/dashboard')} style={{ color: 'var(--text-muted)', cursor: 'pointer' }}>Dashboard</a>
                        <a href="#" style={{ color: 'var(--text-main)' }}>Search Products</a>
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

            {/* Search Header */}
            <div style={{ background: 'white', borderBottom: '1px solid var(--border)', padding: '1.5rem 3rem' }}>
                <div className="container" style={{ maxWidth: '1200px', display: 'flex', gap: '1rem' }}>
                    <div style={{ flex: 1, position: 'relative' }}>
                        <Search size={20} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                        <input
                            type="text"
                            placeholder="Search materials, suppliers, specifications..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{ width: '100%', padding: '0.8rem 1rem 0.8rem 3rem', borderRadius: '8px', border: '1px solid var(--border)', fontSize: '1rem' }}
                        />
                    </div>
                </div>
            </div>

            <main className="container" style={{ padding: '2rem 1rem', maxWidth: '1200px', display: 'grid', gridTemplateColumns: '260px 1fr', gap: '2rem' }}>

                {/* Sidebar Filters */}
                <aside>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                        <h3 style={{ fontSize: '1.1rem', fontWeight: '600' }}>Filters</h3>
                        <button style={{ fontSize: '0.85rem', color: 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer' }}>Clear</button>
                    </div>

                    <div style={{ marginBottom: '2rem' }}>
                        <h4 style={{ fontSize: '0.9rem', fontWeight: '600', marginBottom: '0.75rem' }}>Category</h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            {['Steel (234)', 'Aluminum (189)', 'Copper (156)', 'Plastic (298)'].map((cat, i) => (
                                <label key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', color: 'var(--text-muted)', cursor: 'pointer' }}>
                                    <input type="checkbox" /> {cat}
                                </label>
                            ))}
                        </div>
                    </div>

                    <div style={{ marginBottom: '2rem' }}>
                        <h4 style={{ fontSize: '0.9rem', fontWeight: '600', marginBottom: '0.75rem' }}>Location</h4>
                        <div style={{ position: 'relative' }}>
                            <select style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid var(--border)', appearance: 'none', fontSize: '0.9rem', cursor: 'pointer' }}>
                                <option>All Locations</option>
                                <option>Mumbai</option>
                                <option>Delhi</option>
                                <option>Chennai</option>
                            </select>
                            <ChevronDown size={16} style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: 'var(--text-muted)' }} />
                        </div>
                    </div>

                    <div style={{ marginBottom: '2rem' }}>
                        <h4 style={{ fontSize: '0.9rem', fontWeight: '600', marginBottom: '0.75rem' }}>Price Range</h4>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <input type="text" placeholder="Min" style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid var(--border)', fontSize: '0.85rem' }} />
                            <input type="text" placeholder="Max" style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid var(--border)', fontSize: '0.85rem' }} />
                        </div>
                    </div>

                    <div style={{ marginBottom: '2rem' }}>
                        <h4 style={{ fontSize: '0.9rem', fontWeight: '600', marginBottom: '0.75rem' }}>Quantity (MT)</h4>
                        <input type="range" style={{ width: '100%' }} />
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                            <span>0</span>
                            <span>1000+</span>
                        </div>
                    </div>

                </aside>

                {/* Results Grid */}
                <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                        <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Showing 1,247 results</div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem' }}>
                            Sort by:
                            <select style={{ border: 'none', background: 'none', fontWeight: '600', cursor: 'pointer' }}>
                                <option>Relevance</option>
                                <option>Price: Low to High</option>
                                <option>Price: High to Low</option>
                            </select>
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', marginBottom: '3rem' }}>
                        {products.map((product) => (
                            <div key={product.id} className="card" style={{ padding: '0', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                                <div style={{ height: '160px', background: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                                    Material Image
                                </div>
                                <div style={{ padding: '1.25rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                                    <h4 style={{ fontWeight: '600', marginBottom: '0.25rem' }}>{product.name}</h4>
                                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>{product.supplier}</p>

                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                                        <span style={{ fontWeight: '600' }}>{product.price}</span>
                                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>MOQ: {product.moq}</span>
                                    </div>

                                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                        <SlidersHorizontal size={14} /> Lead: {product.lead}
                                    </div>

                                    <button
                                        onClick={() => navigate('/buyer/negotiation')}
                                        style={{ marginTop: 'auto', width: '100%', background: 'black', color: 'white', padding: '0.75rem', borderRadius: '6px', fontSize: '0.9rem', fontWeight: '500' }}
                                    >
                                        Quick Offer
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem' }}>
                        <button className="btn btn-outline" style={{ padding: '0.5rem 1rem' }}>Previous</button>
                        <button className="btn btn-primary" style={{ padding: '0.5rem 1rem', width: '40px' }}>1</button>
                        <button className="btn btn-outline" style={{ padding: '0.5rem 1rem', width: '40px' }}>2</button>
                    </div>
                </div>

            </main>
        </div>
    );
};

export default SearchProducts;
