import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, User, Plus, Search, Filter, Edit2, Trash2, ChevronDown } from 'lucide-react';
import '../../index.css';

const MyProducts = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');

    const [products, setProducts] = useState([
        { id: 1, name: 'Steel Rebar 12mm', category: 'Steel', price: '₹42,000/ton', quantity: '500 tons', leadTime: '7 days', status: 'Active' },
        { id: 2, name: 'Cement Grade 53', category: 'Cement', price: '₹270/bag', quantity: '2000 bags', leadTime: '5 days', status: 'Active' },
        { id: 3, name: 'River Sand', category: 'Aggregates', price: '₹2,650/m³', quantity: '1000 m³', leadTime: '3 days', status: 'Draft' },
    ]);

    const handleEdit = (id) => {
        // Placeholder for edit functionality
        const newPrice = prompt("Enter new price for " + products.find(p => p.id === id).name);
        if (newPrice) {
            setProducts(products.map(p => p.id === id ? { ...p, price: newPrice } : p));
        }
    };

    const handleDelete = (id) => {
        if (confirm('Are you sure you want to delete this product?')) {
            setProducts(products.filter(p => p.id !== id));
        }
    };

    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="fade-in" style={{ minHeight: '100vh', background: '#f8fafc' }}>
            {/* Navigation Bar */}
            <nav style={{ background: 'white', borderBottom: '1px solid var(--border)', padding: '1rem 3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '3rem' }}>
                    <div style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--text-main)' }}>TriLink</div>
                    <div style={{ display: 'flex', gap: '2rem', fontSize: '0.95rem', fontWeight: '500' }}>
                        <a href="#" onClick={() => navigate('/supplier/dashboard')} style={{ color: 'var(--text-muted)', cursor: 'pointer' }}>Dashboard</a>
                        <a href="#" style={{ color: 'var(--text-main)' }}>Products</a>
                        <a href="#" onClick={() => navigate('/supplier/orders')} style={{ color: 'var(--text-muted)', cursor: 'pointer' }}>Orders</a>
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
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem' }}>
                    <div>
                        <h1 style={{ fontSize: '2rem', fontWeight: '600', marginBottom: '0.5rem' }}>My Products</h1>
                        <p style={{ color: 'var(--text-muted)' }}>Manage your product listings</p>
                    </div>
                    <button
                        onClick={() => navigate('/supplier/add-product')}
                        style={{ background: 'black', color: 'white', padding: '0.75rem 1.5rem', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '500' }}
                    >
                        <Plus size={18} /> Add Product
                    </button>
                </div>

                {/* Filters Bar */}
                <div style={{ background: 'white', padding: '1rem', borderRadius: '12px', border: '1px solid var(--border)', display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
                    <div style={{ flex: 1, position: 'relative' }}>
                        <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                        <input
                            type="text"
                            placeholder="Search products..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{ width: '100%', padding: '0.6rem 1rem 0.6rem 2.5rem', borderRadius: '8px', border: '1px solid var(--border)', fontSize: '0.95rem' }}
                        />
                    </div>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <button className="btn btn-outline" style={{ padding: '0.6rem 1rem', gap: '0.5rem', fontSize: '0.9rem' }}>
                            All Categories <ChevronDown size={16} />
                        </button>
                        <button className="btn btn-outline" style={{ padding: '0.6rem 1rem', gap: '0.5rem', fontSize: '0.9rem' }}>
                            All Status <ChevronDown size={16} />
                        </button>
                    </div>
                </div>

                {/* Products Table */}
                <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.95rem' }}>
                            <thead style={{ background: '#f8fafc', color: 'var(--text-muted)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                <tr>
                                    <th style={{ padding: '1rem 1.5rem', textAlign: 'left', fontWeight: '600' }}>Product</th>
                                    <th style={{ padding: '1rem 1.5rem', textAlign: 'left', fontWeight: '600' }}>Category</th>
                                    <th style={{ padding: '1rem 1.5rem', textAlign: 'left', fontWeight: '600' }}>Price</th>
                                    <th style={{ padding: '1rem 1.5rem', textAlign: 'left', fontWeight: '600' }}>Quantity</th>
                                    <th style={{ padding: '1rem 1.5rem', textAlign: 'left', fontWeight: '600' }}>Lead Time</th>
                                    <th style={{ padding: '1rem 1.5rem', textAlign: 'left', fontWeight: '600' }}>Status</th>
                                    <th style={{ padding: '1rem 1.5rem', textAlign: 'right', fontWeight: '600' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredProducts.map((product) => (
                                    <tr key={product.id} style={{ borderBottom: '1px solid var(--border)' }}>
                                        <td style={{ padding: '1.25rem 1.5rem' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                                <div style={{ width: '40px', height: '40px', background: '#f1f5f9', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: '600' }}>IMG</div>
                                                <span style={{ fontWeight: '500' }}>{product.name}</span>
                                            </div>
                                        </td>
                                        <td style={{ padding: '1.25rem 1.5rem' }}>{product.category}</td>
                                        <td style={{ padding: '1.25rem 1.5rem', fontWeight: '500' }}>{product.price}</td>
                                        <td style={{ padding: '1.25rem 1.5rem' }}>{product.quantity}</td>
                                        <td style={{ padding: '1.25rem 1.5rem' }}>{product.leadTime}</td>
                                        <td style={{ padding: '1.25rem 1.5rem' }}>
                                            <span style={{
                                                background: product.status === 'Active' ? '#ecfdf5' : '#f1f5f9',
                                                color: product.status === 'Active' ? '#10b981' : 'var(--text-muted)',
                                                padding: '0.25rem 0.75rem', borderRadius: '20px', fontSize: '0.85rem', fontWeight: '500'
                                            }}>
                                                {product.status}
                                            </span>
                                        </td>
                                        <td style={{ padding: '1.25rem 1.5rem', textAlign: 'right' }}>
                                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                                                <button onClick={() => handleEdit(product.id)} style={{ color: 'var(--text-muted)', padding: '0.25rem' }}><Edit2 size={18} /></button>
                                                <button onClick={() => handleDelete(product.id)} style={{ color: 'var(--text-muted)', padding: '0.25rem' }}><Trash2 size={18} /></button>
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

export default MyProducts;
