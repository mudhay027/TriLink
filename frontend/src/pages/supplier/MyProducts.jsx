import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { api } from '../../api/api';
import { Bell, User, Plus, Search, Filter, Edit2, Trash2, ChevronDown, Upload, Image as ImageIcon, Check, FileText, ExternalLink } from 'lucide-react';
import Toast from '../../components/Toast';
import { useToast } from '../../hooks/useNotification';
import '../../index.css';

const MyProducts = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [searchTerm, setSearchTerm] = useState('');
    const [showEditModal, setShowEditModal] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [formErrors, setFormErrors] = useState({});
    const [filterCategory, setFilterCategory] = useState('All');
    const [filterStatus, setFilterStatus] = useState('All');

    const [products, setProducts] = useState([]);

    // Custom notifications
    const { toast, showError, hideToast } = useToast();

    // Modal States
    const [deleteModal, setDeleteModal] = useState({ show: false, id: null });
    const [editModal, setEditModal] = useState({ show: false, product: null });
    const [newImage, setNewImage] = useState(null);
    const [newCertificate, setNewCertificate] = useState(null);
    const [validationErrors, setValidationErrors] = useState([]);

    const fetchProducts = async () => {
        try {
            const data = await api.get('/Product'); // API to get all products
            // Map backend DTO to frontend structure
            const mapped = data.map(p => ({
                id: p.id,
                name: p.name,
                category: p.category || 'Uncategorized',
                price: `₹${p.basePrice}/${p.unit}`,
                quantity: `${p.quantity} ${p.unit}`,
                leadTime: `${p.leadTime || 0} days`,
                status: p.status || 'Active',
                image: p.imageUrl,
                // store raw values for editing and re-submission
                rawBasePrice: p.basePrice,
                rawUnit: p.unit,
                rawQuantity: p.quantity,
                rawLeadTime: p.leadTime,
                description: p.description,
                location: p.location,
                minOrderQty: p.minOrderQty,
                supplierId: p.supplierId,
                imageUrl: p.imageUrl,
                certificateUrl: p.certificateUrl
            }));
            setProducts(mapped);
        } catch (error) {
            console.error("Failed to fetch products:", error);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    useEffect(() => {
        if (location.state?.newProduct) {
            fetchProducts();
            window.history.replaceState({}, document.title);
        }
    }, [location.state]);

    // Delete Handlers
    const confirmDelete = (id) => {
        setDeleteModal({ show: true, id });
    };

    const handleDelete = async () => {
        if (deleteModal.id) {
            try {
                await api.delete(`/Product/${deleteModal.id}`);
                setProducts(products.filter(p => p.id !== deleteModal.id));
                setDeleteModal({ show: false, id: null });
            } catch (error) {
                console.error('Error deleting product:', error);
                showError("Failed to delete product: " + error.message);
            }
        }
    };

    // Edit Handlers
    const openEditModal = (product) => {
        // Reset file states and validation errors
        setNewImage(null);
        setNewCertificate(null);
        setValidationErrors([]);

        // Prepare editable state
        setEditModal({
            show: true,
            product: {
                id: product.id,
                name: product.name,
                category: product.category,
                price: product.rawBasePrice, // Bind to raw number
                quantity: product.rawQuantity, // Bind to raw number
                status: product.status,
                leadTime: product.rawLeadTime, // Bind to raw number
                // Hidden fields needed for update
                description: product.description,
                location: product.location,
                imageUrl: product.imageUrl,
                certificateUrl: product.certificateUrl,
                unit: product.rawUnit,
                minOrderQty: product.minOrderQty,
                supplierId: product.supplierId
            }
        });
    };

    const handleEditChange = (e) => {
        const { name, value } = e.target;

        // Clear validation errors when user starts editing
        if (validationErrors.length > 0) {
            setValidationErrors([]);
        }

        setEditModal({
            ...editModal,
            product: { ...editModal.product, [name]: value }
        });
    };

    const handleSaveEdit = async () => {
        if (editModal.product) {
            // Validate inputs
            const errors = [];
            const price = parseFloat(editModal.product.price);
            const quantity = parseInt(editModal.product.quantity);
            const minOrderQty = parseInt(editModal.product.minOrderQty);

            if (isNaN(quantity) || quantity < 1) {
                errors.push('Quantity must be at least 1');
            }
            if (isNaN(price) || price <= 0) {
                errors.push('BasePrice: Price must be greater than zero');
            }
            if (isNaN(minOrderQty) || minOrderQty < 1) {
                errors.push('Minimum Order Quantity must be at least 1');
            }

            if (errors.length > 0) {
                setValidationErrors(errors);
                return;
            }

            try {
                // Create FormData to send files
                const formData = new FormData();
                formData.append('name', editModal.product.name);
                formData.append('description', editModal.product.description || '');
                formData.append('basePrice', price.toString());
                formData.append('quantity', quantity.toString());
                formData.append('location', editModal.product.location || 'Not Specified');
                formData.append('category', editModal.product.category);
                formData.append('unit', editModal.product.unit || 'Ton');
                formData.append('minOrderQty', minOrderQty.toString());
                formData.append('leadTime', editModal.product.leadTime?.toString() || '7');
                formData.append('status', editModal.product.status);

                // Add files if new ones are selected
                if (newImage) {
                    formData.append('ImageFile', newImage);
                }
                if (newCertificate) {
                    formData.append('CertificateFile', newCertificate);
                }

                // Use FormData with PUT request
                await api.put(`/Product/${editModal.product.id}`, formData);

                await fetchProducts();
                setEditModal({ show: false, product: null });
                setNewImage(null);
                setNewCertificate(null);
                setValidationErrors([]);
            } catch (error) {
                console.error("Failed to update product:", error);
                const errorMsg = error.response?.data?.message || error.message || "Failed to update product";
                setValidationErrors([errorMsg]);
            }
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
                        <a href="#" onClick={() => { const userId = localStorage.getItem('userId'); navigate(`/supplier/dashboard/${userId}`); }} style={{ color: 'var(--text-muted)', cursor: 'pointer' }}>Dashboard</a>
                        <a href="#" style={{ color: 'var(--text-main)' }}>Products</a>
                        <a href="#" onClick={() => { const userId = localStorage.getItem('userId'); navigate(`/supplier/orders/${userId}`); }} style={{ color: 'var(--text-muted)', cursor: 'pointer' }}>Orders</a>
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

            <main className="container" style={{ padding: '3rem 1rem', maxWidth: '1200px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem' }}>
                    <div>
                        <h1 style={{ fontSize: '2rem', fontWeight: '600', marginBottom: '0.5rem' }}>My Products</h1>
                        <p style={{ color: 'var(--text-muted)' }}>Manage your product listings</p>
                    </div>
                    <button
                        onClick={() => { const userId = localStorage.getItem('userId'); navigate(`/supplier/add-product/${userId}`); }}
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
                                <option value="Metals">Metals</option>
                                <option value="Plastics & Polymers">Plastics & Polymers</option>
                                <option value="Chemicals & Petrochemicals">Chemicals & Petrochemicals</option>
                                <option value="Construction Materials">Construction Materials</option>
                                <option value="Electrical Components">Electrical Components</option>
                                <option value="Electronic Components">Electronic Components</option>
                                <option value="Industrial Machinery">Industrial Machinery</option>
                                <option value="Industrial Tools & Equipment">Industrial Tools & Equipment</option>
                                <option value="Automotive Parts & Components">Automotive Parts & Components</option>
                                <option value="Agriculture & Agro Products">Agriculture & Agro Products</option>
                                <option value="Fertilizers & Pesticides">Fertilizers & Pesticides</option>
                                <option value="Food Processing Raw Materials">Food Processing Raw Materials</option>
                                <option value="Textiles Fabrics & Yarns">Textiles Fabrics & Yarns</option>
                                <option value="Packaging Materials">Packaging Materials</option>
                                <option value="Healthcare Medical Supplies">Healthcare Medical Supplies</option>
                                <option value="Pharma Raw Materials">Pharma Raw Materials</option>
                                <option value="Office Consumables & Supplies">Office Consumables & Supplies</option>
                                <option value="Safety PPE Products">Safety PPE Products</option>
                                <option value="Renewable Energy Equipment">Renewable Energy Equipment</option>
                                <option value="Handicrafts & Export Goods">Handicrafts & Export Goods</option>
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
                                    <th style={{ padding: '1rem 1.5rem', textAlign: 'left', fontWeight: '600' }}>Min Order Qty</th>
                                    <th style={{ padding: '1rem 1.5rem', textAlign: 'left', fontWeight: '600' }}>Certificate</th>
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
                                                    <div style={{ width: '40px', height: '40px', background: '#f1f5f9', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: '600', overflow: 'hidden' }}>
                                                        {product.image ? <img src={product.image} alt="prod" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : 'IMG'}
                                                    </div>
                                                    <span style={{ fontWeight: '500' }}>{product.name}</span>
                                                </div>
                                            </td>
                                            <td style={{ padding: '1.25rem 1.5rem' }}>{product.category}</td>
                                            <td style={{ padding: '1.25rem 1.5rem', fontWeight: '500' }}>{product.price}</td>
                                            <td style={{ padding: '1.25rem 1.5rem' }}>{product.quantity}</td>
                                            <td style={{ padding: '1.25rem 1.5rem' }}>{product.minOrderQty}</td>
                                            <td style={{ padding: '1.25rem 1.5rem' }}>
                                                {product.certificateUrl ? (
                                                    <a href={product.certificateUrl} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent)', textDecoration: 'underline', fontSize: '0.85rem' }}>View</a>
                                                ) : <span style={{ color: 'var(--text-muted)' }}>-</span>}
                                            </td>
                                            <td style={{ padding: '1.25rem 1.5rem' }}>{product.leadTime}</td>
                                            <td style={{ padding: '1.25rem 1.5rem' }}>
                                                <span style={{
                                                    display: 'inline-block',
                                                    background: bg,
                                                    color: text,
                                                    padding: '0.35rem 0.85rem',
                                                    borderRadius: '20px',
                                                    fontSize: '0.85rem',
                                                    fontWeight: '500',
                                                    whiteSpace: 'nowrap'
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
                            {/* Validation Errors */}
                            {validationErrors.length > 0 && (
                                <div style={{ background: '#fee2e2', border: '1px solid #ef4444', borderRadius: '8px', padding: '1rem' }}>
                                    <div style={{ color: '#b91c1c', fontSize: '0.9rem', fontWeight: '600', marginBottom: '0.5rem' }}>Failed to update product. One or more validation errors occurred.</div>
                                    <div style={{ color: '#dc2626', fontSize: '0.85rem' }}>
                                        <div style={{ fontWeight: '600', marginBottom: '0.25rem' }}>Details:</div>
                                        {validationErrors.map((error, index) => (
                                            <div key={index} style={{ marginLeft: '1rem' }}>• {error}</div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', gap: '1.5rem' }}>
                                <div className="input-group">
                                    <label className="input-label">Product Name</label>
                                    <input type="text" name="name" className="input-field" value={editModal.product.name} onChange={handleEditChange} />
                                </div>
                                <div className="input-group">
                                    <label className="input-label">Category</label>
                                    <div style={{ position: 'relative' }}>
                                        <select name="category" className="input-field" style={{ appearance: 'none', cursor: 'pointer' }} value={editModal.product.category} onChange={handleEditChange}>
                                            <option value="Metals">Metals</option>
                                            <option value="Plastics & Polymers">Plastics & Polymers</option>
                                            <option value="Chemicals & Petrochemicals">Chemicals & Petrochemicals</option>
                                            <option value="Construction Materials">Construction Materials</option>
                                            <option value="Electrical Components">Electrical Components</option>
                                            <option value="Electronic Components">Electronic Components</option>
                                            <option value="Industrial Machinery">Industrial Machinery</option>
                                            <option value="Industrial Tools & Equipment">Industrial Tools & Equipment</option>
                                            <option value="Automotive Parts & Components">Automotive Parts & Components</option>
                                            <option value="Agriculture & Agro Products">Agriculture & Agro Products</option>
                                            <option value="Fertilizers & Pesticides">Fertilizers & Pesticides</option>
                                            <option value="Food Processing Raw Materials">Food Processing Raw Materials</option>
                                            <option value="Textiles Fabrics & Yarns">Textiles Fabrics & Yarns</option>
                                            <option value="Packaging Materials">Packaging Materials</option>
                                            <option value="Healthcare Medical Supplies">Healthcare Medical Supplies</option>
                                            <option value="Pharma Raw Materials">Pharma Raw Materials</option>
                                            <option value="Office Consumables & Supplies">Office Consumables & Supplies</option>
                                            <option value="Safety PPE Products">Safety PPE Products</option>
                                            <option value="Renewable Energy Equipment">Renewable Energy Equipment</option>
                                            <option value="Handicrafts & Export Goods">Handicrafts & Export Goods</option>
                                        </select>
                                        <ChevronDown size={18} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: 'var(--text-muted)' }} />
                                    </div>
                                </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                                <div className="input-group">
                                    <label className="input-label">Price</label>
                                    <input
                                        type="number"
                                        name="price"
                                        className="input-field"
                                        value={editModal.product.price}
                                        onChange={handleEditChange}
                                        min="0.01"
                                        step="0.01"
                                    />
                                </div>
                                <div className="input-group">
                                    <label className="input-label">Quantity</label>
                                    <input
                                        type="number"
                                        name="quantity"
                                        className="input-field"
                                        value={editModal.product.quantity}
                                        onChange={handleEditChange}
                                        min="1"
                                        step="1"
                                    />
                                </div>
                                <div className="input-group">
                                    <label className="input-label">Unit</label>
                                    <div style={{ position: 'relative' }}>
                                        <select name="unit" className="input-field" style={{ appearance: 'none', cursor: 'pointer' }} value={editModal.product.unit} onChange={handleEditChange}>
                                            <option value="Ton">Ton</option>
                                            <option value="Kg">Kg</option>
                                            <option value="Liter">Liter</option>
                                            <option value="Meter">Meter</option>
                                            <option value="Unit">Unit</option>
                                            <option value="Box">Box</option>
                                            <option value="Piece">Piece</option>
                                        </select>
                                        <ChevronDown size={18} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: 'var(--text-muted)' }} />
                                    </div>
                                </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
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
                                    <label className="input-label">Lead Time (Days)</label>
                                    <input type="number" name="leadTime" className="input-field" value={editModal.product.leadTime} onChange={handleEditChange} />
                                </div>
                            </div>

                            <div className="input-group">
                                <label className="input-label">Min Order Qty</label>
                                <input type="number" name="minOrderQty" className="input-field" value={editModal.product.minOrderQty} onChange={handleEditChange} />
                            </div>

                            <div className="input-group">
                                <label className="input-label">Location</label>
                                <input type="text" name="location" className="input-field" placeholder="e.g. Chennai Warehouse" value={editModal.product.location || ''} onChange={handleEditChange} />
                            </div>

                            <div className="input-group">
                                <label className="input-label">Description</label>
                                <textarea name="description" className="input-field" rows="4" value={editModal.product.description} onChange={handleEditChange} style={{ resize: 'vertical' }} />
                            </div>

                            {/* File Upload Section */}
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                                <div className="input-group">
                                    <label className="input-label" style={{ marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <Upload size={16} />
                                        Product Image
                                    </label>
                                    <div style={{
                                        border: '2px solid var(--border)',
                                        borderRadius: '12px',
                                        padding: '1.25rem',
                                        background: '#fafafa',
                                        transition: 'all 0.2s ease'
                                    }}>
                                        {editModal.product.imageUrl && !newImage && (
                                            <div style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '0.75rem',
                                                padding: '0.75rem',
                                                background: 'white',
                                                borderRadius: '8px',
                                                marginBottom: '0.75rem',
                                                border: '1px solid #e2e8f0'
                                            }}>
                                                <div style={{
                                                    width: '36px',
                                                    height: '36px',
                                                    borderRadius: '6px',
                                                    background: '#f1f5f9',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center'
                                                }}>
                                                    <ImageIcon size={18} color="#64748b" />
                                                </div>
                                                <div style={{ flex: 1, minWidth: 0 }}>
                                                    <div style={{ fontSize: '0.85rem', fontWeight: '500', color: 'var(--text-main)' }}>Current Image</div>
                                                    <a
                                                        href={editModal.product.imageUrl}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        style={{
                                                            fontSize: '0.8rem',
                                                            color: 'var(--accent)',
                                                            textDecoration: 'none',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            gap: '0.25rem'
                                                        }}
                                                    >
                                                        <ExternalLink size={12} />
                                                        View Image
                                                    </a>
                                                </div>
                                            </div>
                                        )}
                                        {newImage && (
                                            <div style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '0.75rem',
                                                padding: '0.75rem',
                                                background: '#f0fdf4',
                                                borderRadius: '8px',
                                                marginBottom: '0.75rem',
                                                border: '1px solid #86efac'
                                            }}>
                                                <div style={{
                                                    width: '36px',
                                                    height: '36px',
                                                    borderRadius: '6px',
                                                    background: '#dcfce7',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center'
                                                }}>
                                                    <Check size={18} color="#16a34a" />
                                                </div>
                                                <div style={{ flex: 1, minWidth: 0 }}>
                                                    <div style={{ fontSize: '0.85rem', fontWeight: '500', color: '#16a34a' }}>New Image Selected</div>
                                                    <div style={{ fontSize: '0.8rem', color: '#15803d', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{newImage.name}</div>
                                                </div>
                                            </div>
                                        )}
                                        <label style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            gap: '0.5rem',
                                            padding: '0.75rem 1.25rem',
                                            background: 'white',
                                            border: '1.5px solid var(--border)',
                                            borderRadius: '8px',
                                            cursor: 'pointer',
                                            fontSize: '0.9rem',
                                            fontWeight: '500',
                                            transition: 'all 0.2s ease',
                                            color: 'var(--text-main)'
                                        }}
                                            onMouseEnter={(e) => {
                                                e.currentTarget.style.borderColor = 'var(--accent)';
                                                e.currentTarget.style.background = '#f8fafc';
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.borderColor = 'var(--border)';
                                                e.currentTarget.style.background = 'white';
                                            }}>
                                            <Upload size={16} />
                                            {newImage ? 'Change Image' : 'Choose Image'}
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={(e) => setNewImage(e.target.files[0])}
                                                style={{ display: 'none' }}
                                            />
                                        </label>
                                    </div>
                                </div>
                                <div className="input-group">
                                    <label className="input-label" style={{ marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <FileText size={16} />
                                        Certificate
                                    </label>
                                    <div style={{
                                        border: '2px solid var(--border)',
                                        borderRadius: '12px',
                                        padding: '1.25rem',
                                        background: '#fafafa',
                                        transition: 'all 0.2s ease'
                                    }}>
                                        {editModal.product.certificateUrl && !newCertificate && (
                                            <div style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '0.75rem',
                                                padding: '0.75rem',
                                                background: 'white',
                                                borderRadius: '8px',
                                                marginBottom: '0.75rem',
                                                border: '1px solid #e2e8f0'
                                            }}>
                                                <div style={{
                                                    width: '36px',
                                                    height: '36px',
                                                    borderRadius: '6px',
                                                    background: '#f1f5f9',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center'
                                                }}>
                                                    <FileText size={18} color="#64748b" />
                                                </div>
                                                <div style={{ flex: 1, minWidth: 0 }}>
                                                    <div style={{ fontSize: '0.85rem', fontWeight: '500', color: 'var(--text-main)' }}>Current Certificate</div>
                                                    <a
                                                        href={editModal.product.certificateUrl}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        style={{
                                                            fontSize: '0.8rem',
                                                            color: 'var(--accent)',
                                                            textDecoration: 'none',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            gap: '0.25rem'
                                                        }}
                                                    >
                                                        <ExternalLink size={12} />
                                                        View Certificate
                                                    </a>
                                                </div>
                                            </div>
                                        )}
                                        {newCertificate && (
                                            <div style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '0.75rem',
                                                padding: '0.75rem',
                                                background: '#f0fdf4',
                                                borderRadius: '8px',
                                                marginBottom: '0.75rem',
                                                border: '1px solid #86efac'
                                            }}>
                                                <div style={{
                                                    width: '36px',
                                                    height: '36px',
                                                    borderRadius: '6px',
                                                    background: '#dcfce7',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center'
                                                }}>
                                                    <Check size={18} color="#16a34a" />
                                                </div>
                                                <div style={{ flex: 1, minWidth: 0 }}>
                                                    <div style={{ fontSize: '0.85rem', fontWeight: '500', color: '#16a34a' }}>New Certificate Selected</div>
                                                    <div style={{ fontSize: '0.8rem', color: '#15803d', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{newCertificate.name}</div>
                                                </div>
                                            </div>
                                        )}
                                        <label style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            gap: '0.5rem',
                                            padding: '0.75rem 1.25rem',
                                            background: 'white',
                                            border: '1.5px solid var(--border)',
                                            borderRadius: '8px',
                                            cursor: 'pointer',
                                            fontSize: '0.9rem',
                                            fontWeight: '500',
                                            transition: 'all 0.2s ease',
                                            color: 'var(--text-main)'
                                        }}
                                            onMouseEnter={(e) => {
                                                e.currentTarget.style.borderColor = 'var(--accent)';
                                                e.currentTarget.style.background = '#f8fafc';
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.borderColor = 'var(--border)';
                                                e.currentTarget.style.background = 'white';
                                            }}>
                                            <Upload size={16} />
                                            {newCertificate ? 'Change Certificate' : 'Choose Certificate'}
                                            <input
                                                type="file"
                                                accept=".pdf,.jpg,.jpeg,.png"
                                                onChange={(e) => setNewCertificate(e.target.files[0])}
                                                style={{ display: 'none' }}
                                            />
                                        </label>
                                    </div>
                                </div>
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
