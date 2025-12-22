import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../api/api';
import { Bell, User, UploadCloud, Image as ImageIcon, FileText, ChevronDown } from 'lucide-react';
import '../../index.css';

const AddProduct = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        productName: '',
        category: '',
        unit: 'Ton',
        price: '',
        availableQty: '',
        minOrderQty: '',
        leadTime: '',
        location: '',
        description: '',
        images: null,
        documents: null
    });

    const [validationErrors, setValidationErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        if (validationErrors[name]) {
            setValidationErrors({ ...validationErrors, [name]: '' });
        }
    };

    const handleFileChange = (e, type) => {
        if (e.target.files && e.target.files[0]) {
            setFormData({ ...formData, [type]: e.target.files[0] });
            if (validationErrors[type]) {
                setValidationErrors({ ...validationErrors, [type]: '' });
            }
        }
    };

    const validate = () => {
        const errors = {};
        if (!formData.productName.trim()) errors.productName = 'Product name is required';
        if (!formData.category) errors.category = 'Category is required';
        if (!formData.price || formData.price <= 0) errors.price = 'Price must be greater than zero';
        if (!formData.availableQty || formData.availableQty < 1) errors.availableQty = 'Available quantity must be at least 1';
        if (!formData.minOrderQty || formData.minOrderQty < 1) errors.minOrderQty = 'Min order quantity must be at least 1';
        if (!formData.leadTime || formData.leadTime < 1) errors.leadTime = 'Lead time must be at least 1 day';
        if (!formData.location.trim()) errors.location = 'Location is required';

        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (status) => {
        if (!validate()) {
            return;
        }

        const payload = new FormData();
        payload.append('Name', formData.productName);
        payload.append('Category', formData.category);
        payload.append('Unit', formData.unit);
        payload.append('BasePrice', formData.price);
        payload.append('Quantity', formData.availableQty);
        payload.append('MinOrderQty', formData.minOrderQty);
        payload.append('LeadTime', formData.leadTime);
        payload.append('Description', formData.description || "");
        payload.append('Status', status);
        payload.append('Location', formData.location);

        // Append Files
        if (formData.images) {
            payload.append('ImageFile', formData.images);
        }
        if (formData.documents) {
            payload.append('CertificateFile', formData.documents);
        }

        try {
            const result = await api.post('/Product', payload, true);
            const userId = localStorage.getItem('userId');
            navigate(`/supplier/products/${userId}`, { state: { newProduct: true } });
        } catch (error) {
            console.error("Error submitting form:", error);
            if (error.errors) {
                const backendErrors = {};
                Object.keys(error.errors).forEach(key => {
                    backendErrors[key.toLowerCase()] = error.errors[key][0];
                });
                setValidationErrors(prev => ({ ...prev, ...backendErrors }));
            }
            alert('An error occurred while saving the product: ' + error.message);
        }
    };

    return (
        <div className="fade-in" style={{ minHeight: '100vh', background: '#f8fafc' }}>
            {/* Navigation Bar */}
            <nav style={{ background: 'white', borderBottom: '1px solid var(--border)', padding: '1rem 3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '3rem' }}>
                    <div style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--text-main)' }}>TriLink</div>
                    <div style={{ display: 'flex', gap: '2rem', fontSize: '0.95rem', fontWeight: '500' }}>
                        <a href="#" onClick={() => { const userId = localStorage.getItem('userId'); navigate(`/supplier/dashboard/${userId}`); }} style={{ color: 'var(--text-muted)', cursor: 'pointer' }}>Dashboard</a>
                        <a href="#" onClick={() => { const userId = localStorage.getItem('userId'); navigate(`/supplier/products/${userId}`); }} style={{ color: 'var(--text-main)', cursor: 'pointer' }}>Products</a>
                        <a href="#" onClick={() => { const userId = localStorage.getItem('userId'); navigate(`/supplier/orders/${userId}`); }} style={{ color: 'var(--text-muted)', cursor: 'pointer' }}>Orders</a>
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
                <div style={{ marginBottom: '2rem' }}>
                    <h1 style={{ fontSize: '2rem', fontWeight: '600', marginBottom: '0.5rem' }}>Add New Product</h1>
                    <p style={{ color: 'var(--text-muted)' }}>Fill in the details to list your product</p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '2rem' }}>

                    {/* Left Column: Form Details */}
                    <div className="card" style={{ padding: '2rem' }}>
                        <div className="input-group">
                            <label className="input-label">Product Name</label>
                            <input
                                type="text"
                                name="productName"
                                placeholder="e.g. Steel Rebar 12mm"
                                className={`input-field ${validationErrors.productName ? 'error' : ''}`}
                                value={formData.productName}
                                onChange={handleChange}
                            />
                            {validationErrors.productName && <p style={{ color: 'red', fontSize: '0.8rem', marginTop: '0.25rem' }}>{validationErrors.productName}</p>}
                        </div>

                        <div className="input-group">
                            <label className="input-label">Category</label>
                            <div style={{ position: 'relative' }}>
                                <select
                                    name="category"
                                    className={`input-field ${validationErrors.category ? 'error' : ''}`}
                                    style={{ appearance: 'none', cursor: 'pointer' }}
                                    value={formData.category}
                                    onChange={handleChange}
                                >
                                    <option value="">Select category</option>
                                    <option value="steel">Steel</option>
                                    <option value="cement">Cement</option>
                                    <option value="aggregates">Aggregates</option>
                                </select>
                                <ChevronDown size={18} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: 'var(--text-muted)' }} />
                            </div>
                            {validationErrors.category && <p style={{ color: 'red', fontSize: '0.8rem', marginTop: '0.25rem' }}>{validationErrors.category}</p>}
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                            <div className="input-group">
                                <label className="input-label">Unit</label>
                                <div style={{ position: 'relative' }}>
                                    <select
                                        name="unit"
                                        className="input-field"
                                        style={{ appearance: 'none', cursor: 'pointer' }}
                                        value={formData.unit}
                                        onChange={handleChange}
                                    >
                                        <option value="Ton">Ton</option>
                                        <option value="Bag">Bag</option>
                                        <option value="Kg">Kg</option>
                                        <option value="M3">m³</option>
                                    </select>
                                    <ChevronDown size={18} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: 'var(--text-muted)' }} />
                                </div>
                            </div>
                            <div className="input-group">
                                <label className="input-label">Price per Unit</label>
                                <input
                                    type="number"
                                    name="price"
                                    placeholder="₹0.00"
                                    className={`input-field ${validationErrors.price ? 'error' : ''}`}
                                    value={formData.price}
                                    onChange={handleChange}
                                />
                                {validationErrors.price && <p style={{ color: 'red', fontSize: '0.8rem', marginTop: '0.25rem' }}>{validationErrors.price}</p>}
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                            <div className="input-group">
                                <label className="input-label">Available Quantity</label>
                                <input
                                    type="number"
                                    name="availableQty"
                                    placeholder="0"
                                    className={`input-field ${validationErrors.availableQty ? 'error' : ''}`}
                                    value={formData.availableQty}
                                    onChange={handleChange}
                                />
                                {validationErrors.availableQty && <p style={{ color: 'red', fontSize: '0.8rem', marginTop: '0.25rem' }}>{validationErrors.availableQty}</p>}
                            </div>
                            <div className="input-group">
                                <label className="input-label">Min Order Quantity</label>
                                <input
                                    type="number"
                                    name="minOrderQty"
                                    placeholder="0"
                                    className={`input-field ${validationErrors.minOrderQty ? 'error' : ''}`}
                                    value={formData.minOrderQty}
                                    onChange={handleChange}
                                />
                                {validationErrors.minOrderQty && <p style={{ color: 'red', fontSize: '0.8rem', marginTop: '0.25rem' }}>{validationErrors.minOrderQty}</p>}
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                            <div className="input-group">
                                <label className="input-label">Lead Time (days)</label>
                                <input
                                    type="number"
                                    name="leadTime"
                                    placeholder="7"
                                    className={`input-field ${validationErrors.leadTime ? 'error' : ''}`}
                                    value={formData.leadTime}
                                    onChange={handleChange}
                                />
                                {validationErrors.leadTime && <p style={{ color: 'red', fontSize: '0.8rem', marginTop: '0.25rem' }}>{validationErrors.leadTime}</p>}
                            </div>
                            <div className="input-group">
                                <label className="input-label">Location</label>
                                <input
                                    type="text"
                                    name="location"
                                    placeholder="e.g. Chennai Warehouse, Mumbai Depot"
                                    className={`input-field ${validationErrors.location ? 'error' : ''}`}
                                    value={formData.location}
                                    onChange={handleChange}
                                />
                                {validationErrors.location && <p style={{ color: 'red', fontSize: '0.8rem', marginTop: '0.25rem' }}>{validationErrors.location}</p>}
                            </div>
                        </div>

                        <div className="input-group" style={{ marginBottom: 0 }}>
                            <label className="input-label">Description</label>
                            <textarea
                                name="description"
                                placeholder="Product description..."
                                className="input-field"
                                rows="5"
                                style={{ resize: 'none' }}
                                value={formData.description}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    {/* Right Column: Uploads & Actions */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

                        {/* Image Upload */}
                        <div className="card" style={{ padding: '2rem' }}>
                            <h3 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '1.5rem' }}>Product Images</h3>
                            <div style={{
                                border: '2px dashed var(--border)', borderRadius: '12px', padding: '3rem 1rem',
                                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                                textAlign: 'center', cursor: 'pointer', transition: 'all 0.2s'
                            }}>
                                <div style={{ width: '48px', height: '48px', background: '#f1f5f9', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                                    <ImageIcon size={24} color="var(--text-main)" />
                                </div>
                                <p style={{ fontWeight: '500', marginBottom: '0.25rem' }}>Upload product images</p>
                                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>PNG, JPG up to 5MB</p>
                                <div style={{ position: 'relative', overflow: 'hidden', display: 'inline-block' }}>
                                    <button className="btn btn-outline" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem', pointerEvents: 'none' }}>Browse Files</button>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => handleFileChange(e, 'images')}
                                        style={{ position: 'absolute', top: 0, left: 0, opacity: 0, width: '100%', height: '100%', cursor: 'pointer' }}
                                    />
                                </div>
                                {formData.images && <p style={{ marginTop: '0.5rem', fontSize: '0.8rem', color: 'var(--accent)' }}>Selected: {formData.images.name}</p>}
                            </div>
                        </div>

                        {/* Document Upload */}
                        <div className="card" style={{ padding: '2rem' }}>
                            <h3 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '1.5rem' }}>Documents</h3>
                            <div style={{
                                border: '2px dashed var(--border)', borderRadius: '12px', padding: '3rem 1rem',
                                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                                textAlign: 'center', cursor: 'pointer', transition: 'all 0.2s'
                            }}>
                                <div style={{ width: '48px', height: '48px', background: '#f1f5f9', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                                    <FileText size={24} color="var(--text-main)" />
                                </div>
                                <p style={{ fontWeight: '500', marginBottom: '0.25rem' }}>Upload certificates</p>
                                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>PDF up to 10MB</p>
                                <div style={{ position: 'relative', overflow: 'hidden', display: 'inline-block' }}>
                                    <button className="btn btn-outline" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem', pointerEvents: 'none' }}>Browse Files</button>
                                    <input
                                        type="file"
                                        accept=".pdf"
                                        onChange={(e) => handleFileChange(e, 'documents')}
                                        style={{ position: 'absolute', top: 0, left: 0, opacity: 0, width: '100%', height: '100%', cursor: 'pointer' }}
                                    />
                                </div>
                                {formData.documents && <p style={{ marginTop: '0.5rem', fontSize: '0.8rem', color: 'var(--accent)' }}>Selected: {formData.documents.name}</p>}
                            </div>
                        </div>

                        {/* Actions */}
                        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem' }}>
                            <button
                                className="btn btn-primary"
                                style={{ padding: '1rem', fontSize: '1rem' }}
                                onClick={() => handleSubmit('Active')}
                            >
                                Save & Publish
                            </button>
                            <button
                                className="btn btn-outline"
                                style={{ padding: '1rem', fontSize: '1rem', background: 'white' }}
                                onClick={() => handleSubmit('Draft')}
                            >
                                Save Draft
                            </button>
                        </div>

                    </div>
                </div>
            </main>
        </div>
    );
};

export default AddProduct;
