import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Bell, User, Plus, Search, Filter, Edit2, Trash2, ChevronDown } from 'lucide-react';
import '../../index.css';

const MyProducts = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [searchTerm, setSearchTerm] = useState('');
    const [filterCategory, setFilterCategory] = useState('All');
    const [filterStatus, setFilterStatus] = useState('All');

    const [products, setProducts] = useState([
        { id: 1, name: 'Steel Rebar 12mm', category: 'Steel', price: '₹42,000/ton', quantity: '500 tons', leadTime: '7 days', status: 'Active' },
        { id: 2, name: 'Cement Grade 53', category: 'Cement', price: '₹270/bag', quantity: '2000 bags', leadTime: '5 days', status: 'Active' },
        { id: 3, name: 'River Sand', category: 'Aggregates', price: '₹2,650/m³', quantity: '1000 m³', leadTime: '3 days', status: 'Draft' },
    ]);

    // Modal States
    const [deleteModal, setDeleteModal] = useState({ show: false, id: null });
    const [editModal, setEditModal] = useState({ show: false, product: null });

    useEffect(() => {
        if (location.state?.newProduct) {
            setProducts(prev => [location.state.newProduct, ...prev]);
            window.history.replaceState({}, document.title);
        }
    }, [location.state]);

    // Delete Handlers
    const confirmDelete = (id) => {
        setDeleteModal({ show: true, id });
    };

    const handleDelete = () => {
        if (deleteModal.id) {
            setProducts(products.filter(p => p.id !== deleteModal.id));
            setDeleteModal({ show: false, id: null });
        }
    };

    // Edit Handlers
    const openEditModal = (product) => {
        setEditModal({ show: true, product: { ...product } });
    };

    const handleEditChange = (e) => {
        setEditModal({
            ...editModal,
            product: { ...editModal.product, [e.target.name]: e.target.value }
        });
    };

    const handleSaveEdit = () => {
        if (editModal.product) {
            setProducts(products.map(p => p.id === editModal.product.id ? editModal.product : p));
            setEditModal({ show: false, product: null });
        }
    };

    const filteredProducts = products.filter(p => {
        const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.category.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = filterCategory === 'All' || p.category === filterCategory;
        const matchesStatus = filterStatus === 'All' || p.status === filterStatus;
        return matchesSearch && matchesCategory && matchesStatus;
    });

    const getStatusColor = (status) => {
        switch (status) {
            case 'Active': return { bg: '#ecfdf5', text: '#10b981' };
            case 'Draft': return { bg: '#f1f5f9', text: '#64748b' };
            case 'Out of Stock': return { bg: '#fee2e2', text: '#ef4444' };
            default: return { bg: '#f1f5f9', text: '#64748b' };
        }
    };

    return (
        <div className="fade-in" style={{ minHeight: '100vh', background: '#f8fafc', position: 'relative' }}>
            {/* Navigation Bar */}
            <nav style={{ background: 'white', borderBottom: '1px solid var(--border)', padding: '1rem 3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '3rem' }}>
                    <div style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--text-main)' }}>TriLink</div>
                    <div style={{ display: 'flex', gap: '2rem', fontSize: '0.95rem', fontWeight: '500' }}>
                        <a href="#" onClick={() => navigate('/supplier/dashboard')} style={{ color: 'var(--text-muted)', cursor: 'pointer' }}>Dashboard</a>
                        <a href="#" style={{ color: 'var(--text-main)' }}>Products</a>
                        <a href="#" onClick={() => navigate('/supplier/orders')} style={{ color: 'var(--text-muted)', cursor: 'pointer' }}>Orders</a>
                        <a href="#" onClick={() => navigate('/supplier/logistics-job-creation')} style={{ color: 'var(--text-muted)', cursor: 'pointer' }}>Logistics Jobs</a>
                    </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                    <Bell size={20} color="var(--text-muted)" />
                    <div
                        style={{ width: '32px', height: '32px', background: '#e2e8f0', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                        onClick={() => navigate('/supplier/profile')}
                    >
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
                        <div style={{ position: 'relative' }}>
                            <select
                                value={filterCategory}
                                onChange={(e) => setFilterCategory(e.target.value)}
                                className="btn btn-outline"
                                style={{ padding: '0.6rem 2rem 0.6rem 1rem', fontSize: '0.9rem', appearance: 'none', cursor: 'pointer', height: '100%' }}
                            >
                                <option value="All">All Categories</option>
                                <option value="Steel">Steel</option>
                                <option value="Cement">Cement</option>
                                <option value="Aggregates">Aggregates</option>
                            </select>
                            <ChevronDown size={16} style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: 'var(--text-muted)' }} />
                        </div>
                        <div style={{ position: 'relative' }}>
                            <select
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value)}
                                className="btn btn-outline"
                                style={{ padding: '0.6rem 2rem 0.6rem 1rem', fontSize: '0.9rem', appearance: 'none', cursor: 'pointer', height: '100%' }}
                            >
                                <option value="All">All Status</option>
                                <option value="Active">Active</option>
                                <option value="Draft">Draft</option>
                                <option value="Out of Stock">Out of Stock</option>
                            </select>
                            <ChevronDown size={16} style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: 'var(--text-muted)' }} />
                        </div>
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
                                {filteredProducts.map((product) => {
                                    const { bg, text } = getStatusColor(product.status);
                                    return (
                                        <tr key={product.id} style={{ borderBottom: '1px solid var(--border)' }}>
                                            <td style={{ padding: '1.25rem 1.5rem' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                                    <div style={{ width: '40px', height: '40px', background: '#f1f5f9', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: '600' }}>
                                                        {product.image ? <img src={product.image} alt="prod" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '6px' }} /> : 'IMG'}
                                                    </div>
                                                    <span style={{ fontWeight: '500' }}>{product.name}</span>
                                                </div>
                                            </td>
                                            <td style={{ padding: '1.25rem 1.5rem' }}>{product.category}</td>
                                            <td style={{ padding: '1.25rem 1.5rem', fontWeight: '500' }}>{product.price}</td>
                                            <td style={{ padding: '1.25rem 1.5rem' }}>{product.quantity}</td>
                                            <td style={{ padding: '1.25rem 1.5rem' }}>{product.leadTime}</td>
                                            <td style={{ padding: '1.25rem 1.5rem' }}>
                                                <span style={{
                                                    background: bg,
                                                    color: text,
                                                    padding: '0.25rem 0.75rem', borderRadius: '20px', fontSize: '0.85rem', fontWeight: '500'
                                                }}>
                                                    {product.status}
                                                </span>
                                            </td>
                                            <td style={{ padding: '1.25rem 1.5rem', textAlign: 'right' }}>
                                                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                                                    <button onClick={() => openEditModal(product)} style={{ color: 'var(--text-muted)', padding: '0.25rem', cursor: 'pointer' }}><Edit2 size={18} /></button>
                                                    <button onClick={() => confirmDelete(product.id)} style={{ color: '#ef4444', padding: '0.25rem', cursor: 'pointer' }}><Trash2 size={18} /></button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>

            {/* Delete Confirmation Modal */}
            {deleteModal.show && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
                    <div style={{ background: 'white', borderRadius: '12px', padding: '2rem', width: '400px', textAlign: 'center', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)' }}>
                        <div style={{ width: '48px', height: '48px', background: '#fee2e2', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem auto', color: '#ef4444' }}>
                            <Trash2 size={24} />
                        </div>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.5rem' }}>Delete Product?</h3>
                        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Are you sure you want to delete this product? This action cannot be undone.</p>
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <button onClick={() => setDeleteModal({ show: false, id: null })} className="btn btn-outline" style={{ flex: 1, padding: '0.75rem' }}>Cancel</button>
                            <button onClick={handleDelete} className="btn btn-primary" style={{ flex: 1, padding: '0.75rem', background: '#ef4444', borderColor: '#ef4444' }}>Delete</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Product Modal */}
            {editModal.show && editModal.product && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
                    <div style={{ background: 'white', borderRadius: '16px', padding: '2rem', width: '500px', maxHeight: '90vh', overflowY: 'auto' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                            <h2 style={{ fontSize: '1.5rem', fontWeight: '600' }}>Edit Product</h2>
                            <button onClick={() => setEditModal({ show: false, product: null })} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><ChevronDown size={24} style={{ transform: 'rotate(180deg)' }} /></button>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            <div className="input-group">
                                <label className="input-label">Product Name</label>
                                <input type="text" name="name" className="input-field" value={editModal.product.name} onChange={handleEditChange} />
                            </div>
                            <div className="input-group">
                                <label className="input-label">Category</label>
                                <input type="text" name="category" className="input-field" value={editModal.product.category} onChange={handleEditChange} />
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <div className="input-group">
                                    <label className="input-label">Price</label>
                                    <input type="text" name="price" className="input-field" value={editModal.product.price} onChange={handleEditChange} />
                                </div>
                                <div className="input-group">
                                    <label className="input-label">Quantity</label>
                                    <input type="text" name="quantity" className="input-field" value={editModal.product.quantity} onChange={handleEditChange} />
                                </div>
                            </div>

                            <div className="input-group">
                                <label className="input-label">Status</label>
                                <div style={{ position: 'relative' }}>
                                    <select
                                        name="status"
                                        className="input-field"
                                        style={{ appearance: 'none', cursor: 'pointer' }}
                                        value={editModal.product.status}
                                        onChange={handleEditChange}
                                    >
                                        <option value="Active">Active</option>
                                        <option value="Draft">Draft</option>
                                        <option value="Out of Stock">Out of Stock</option>
                                    </select>
                                    <ChevronDown size={18} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: 'var(--text-muted)' }} />
                                </div>
                            </div>

                            <div className="input-group">
                                <label className="input-label">Lead Time</label>
                                <input type="text" name="leadTime" className="input-field" value={editModal.product.leadTime} onChange={handleEditChange} />
                            </div>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '2rem' }}>
                            <button onClick={() => setEditModal({ show: false, product: null })} className="btn btn-outline" style={{ padding: '0.75rem 1.5rem' }}>Cancel</button>
                            <button onClick={handleSaveEdit} className="btn btn-primary" style={{ padding: '0.75rem 2rem' }}>Save Changes</button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
};

export default MyProducts;
