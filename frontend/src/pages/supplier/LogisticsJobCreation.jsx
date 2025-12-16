import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, User, Truck, Plus, MapPin, X, Package, Calendar, FileText, Shield } from 'lucide-react';
import '../../index.css';

const SupplierLogisticsJobCreation = () => {
    const navigate = useNavigate();
    const [showCreateForm, setShowCreateForm] = useState(false);

    // Comprehensive Form Data
    const [formData, setFormData] = useState({
        // Pickup Details
        pickupAddressLine1: '',
        pickupAddressLine2: '',
        pickupLandmark: '',
        pickupCity: '',
        pickupState: '',
        pickupPincode: '',

        // Drop Details
        dropAddressLine1: '',
        dropAddressLine2: '',
        dropLandmark: '',
        dropCity: '',
        dropState: '',
        dropPincode: '',

        // Timing & Schedule
        pickupDate: '',
        pickupTimeSlot: '9am-12pm',
        deliveryExpectedDate: '',
        deliveryTimeWindow: '9am-6pm',
        shipmentPriority: 'Normal',

        // Pallet & Load Details
        palletCount: '1',
        totalWeight: '',
        length: '',
        width: '',
        height: '',
        materialType: 'General',
        isFragile: false,
        isHighValue: false,
        specialHandling: '',

        // Documentation & Compliance
        ewayBillNumber: '',
        invoiceNumber: '',
        gstNumber: '',
        materialCategory: 'Non-Hazardous',

        // Sender Contact
        senderName: '',
        senderCompanyName: '',
        senderMobile: '',
        senderEmail: '',

        status: 'Active'
    });

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    const calculateVolumetricWeight = () => {
        const { length, width, height } = formData;
        if (length && width && height) {
            return ((parseFloat(length) * parseFloat(width) * parseFloat(height)) / 5000).toFixed(2);
        }
        return '0';
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');

            // Prepare the data
            const jobData = {
                ...formData,
                totalWeight: parseFloat(formData.totalWeight),
                palletCount: parseInt(formData.palletCount),
                length: formData.length ? parseFloat(formData.length) : null,
                width: formData.width ? parseFloat(formData.width) : null,
                height: formData.height ? parseFloat(formData.height) : null,
                pickupDate: formData.pickupDate ? new Date(formData.pickupDate).toISOString() : new Date().toISOString(),
                deliveryExpectedDate: formData.deliveryExpectedDate ? new Date(formData.deliveryExpectedDate).toISOString() : new Date().toISOString()
            };

            const response = await fetch('http://localhost:5081/api/BuyerLogisticsJob', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(jobData)
            });

            if (response.ok) {
                setShowCreateForm(false);
                // Reset form
                setFormData({
                    pickupAddressLine1: '', pickupAddressLine2: '', pickupLandmark: '', pickupCity: '', pickupState: '', pickupPincode: '',
                    dropAddressLine1: '', dropAddressLine2: '', dropLandmark: '', dropCity: '', dropState: '', dropPincode: '',
                    pickupDate: '', pickupTimeSlot: '9am-12pm', deliveryExpectedDate: '', deliveryTimeWindow: '9am-6pm', shipmentPriority: 'Normal',
                    palletCount: '1', totalWeight: '', length: '', width: '', height: '', materialType: 'General', isFragile: false, isHighValue: false, specialHandling: '',
                    ewayBillNumber: '', invoiceNumber: '', gstNumber: '', materialCategory: 'Non-Hazardous',
                    senderName: '', senderCompanyName: '', senderMobile: '', senderEmail: '', status: 'Active'
                });
                alert('Logistics Job Created Successfully!');
                // Optionally redirect to view created jobs
                const userId = localStorage.getItem('userId');
                navigate(`/supplier/logistics-job-management/${userId}`);
            } else {
                alert(`Note: Backend might not support all fields yet. Response: ${response.status}`);
            }
        } catch (error) {
            console.error("Error creating job", error);
        }
    };

    return (
        <div className="fade-in" style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)' }}>
            {/* Navigation Bar */}
            <nav style={{ background: 'white', borderBottom: '1px solid var(--border)', padding: '1rem 3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '3rem' }}>
                    <div style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--text-main)' }}>TriLink</div>
                    <div style={{ display: 'flex', gap: '2rem', fontSize: '0.95rem', fontWeight: '500' }}>
                        <a href="#" onClick={() => { const userId = localStorage.getItem('userId'); navigate(`/supplier/dashboard/${userId}`); }} style={{ color: 'var(--text-muted)', cursor: 'pointer' }}>Dashboard</a>
                        <a href="#" onClick={() => { const userId = localStorage.getItem('userId'); navigate(`/supplier/products/${userId}`); }} style={{ color: 'var(--text-muted)', cursor: 'pointer' }}>Products</a>
                        <a href="#" onClick={() => { const userId = localStorage.getItem('userId'); navigate(`/supplier/orders/${userId}`); }} style={{ color: 'var(--text-muted)', cursor: 'pointer' }}>Orders</a>
                        <a href="#" style={{ color: 'var(--text-main)', cursor: 'default' }}>Logistics Jobs</a>
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

            <main className="container" style={{ padding: '3rem 1rem', maxWidth: '1400px', margin: '0 auto' }}>
                <div style={{ marginBottom: '2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <h1 style={{ fontSize: '2.25rem', fontWeight: '700', marginBottom: '0.5rem', color: '#1e293b' }}>Logistics Job Management</h1>
                        <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem' }}>Create and track your shipment requests</p>
                    </div>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <button
                            onClick={() => {
                                const userId = localStorage.getItem('userId');
                                navigate(`/supplier/logistics-job-management/${userId}`);
                            }}
                            className="btn btn-outline"
                            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.5rem', fontSize: '1rem' }}
                        >
                            View Created Jobs
                        </button>
                        <button
                            onClick={() => setShowCreateForm(true)}
                            className="btn btn-primary"
                            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.5rem', fontSize: '1rem', boxShadow: '0 4px 6px rgba(59, 130, 246, 0.3)' }}
                        >
                            <Plus size={20} /> Create New Job
                        </button>
                    </div>
                </div>


                {/* Create Job Section */}
                {!showCreateForm ? (
                    <div className="fade-in">
                        <div style={{ textAlign: 'center', padding: '5rem 2rem', background: 'white', borderRadius: '16px', border: '2px dashed #cbd5e1', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
                            <Truck size={64} color="#94a3b8" style={{ marginBottom: '1.5rem' }} />
                            <h3 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '0.75rem', color: '#1e293b' }}>Create a New Logistics Job</h3>
                            <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', marginBottom: '2rem' }}>
                                Fill in the shipment details to create a logistics job request
                            </p>
                            <button
                                onClick={() => setShowCreateForm(true)}
                                className="btn btn-primary"
                                style={{ padding: '0.75rem 2rem', fontSize: '1rem', marginRight: '1rem', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
                            >
                                <Plus size={20} /> Create New Job
                            </button>
                            <button
                                onClick={() => {
                                    const userId = localStorage.getItem('userId');
                                    navigate(`/supplier/logistics-job-management/${userId}`);
                                }}
                                className="btn btn-outline"
                                style={{ padding: '0.75rem 2rem', fontSize: '1rem' }}
                            >
                                View All Jobs
                            </button>
                        </div>
                    </div>
                ) : (
                    // Enhanced Create Form
                    <div className="fade-in card" style={{ padding: '3rem', maxWidth: '1100px', margin: '0 auto', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', borderRadius: '16px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem', paddingBottom: '1.5rem', borderBottom: '2px solid #e2e8f0' }}>
                            <h2 style={{ fontSize: '2rem', fontWeight: '700', color: '#1e293b' }}>Create New Logistics Job</h2>
                            <button onClick={() => setShowCreateForm(false)} className="btn btn-outline" style={{ padding: '0.5rem', borderRadius: '50%' }}><X size={22} /></button>
                        </div>

                        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '2.5rem' }}>
                            {/* Section 1: Pickup Details */}
                            <div style={{ background: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)', padding: '2rem', borderRadius: '12px', border: '1px solid #bfdbfe', boxShadow: '0 2px 4px rgba(59, 130, 246, 0.1)' }}>
                                <h3 style={{ fontSize: '1.3rem', fontWeight: '700', marginBottom: '1.75rem', display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#1e40af' }}>
                                    <div style={{ width: '36px', height: '36px', background: '#3b82f6', borderRadius: '50%', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem', fontWeight: '700', boxShadow: '0 4px 6px rgba(59, 130, 246, 0.3)' }}>1</div>
                                    <MapPin size={22} />
                                    Pickup Details
                                </h3>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                                    <div className="input-group" style={{ gridColumn: '1 / -1' }}>
                                        <label className="input-label">Pickup Address Line 1 *</label>
                                        <input type="text" name="pickupAddressLine1" className="input-field" required value={formData.pickupAddressLine1} onChange={handleInputChange} placeholder="Building/House No, Street Name" />
                                    </div>
                                    <div className="input-group" style={{ gridColumn: '1 / -1' }}>
                                        <label className="input-label">Pickup Address Line 2</label>
                                        <input type="text" name="pickupAddressLine2" className="input-field" value={formData.pickupAddressLine2} onChange={handleInputChange} placeholder="Area, Locality" />
                                    </div>
                                    <div className="input-group">
                                        <label className="input-label">Landmark *</label>
                                        <input type="text" name="pickupLandmark" className="input-field" required value={formData.pickupLandmark} onChange={handleInputChange} placeholder="Near..." />
                                    </div>
                                    <div className="input-group">
                                        <label className="input-label">Pincode *</label>
                                        <input type="text" name="pickupPincode" className="input-field" required value={formData.pickupPincode} onChange={handleInputChange} pattern="[0-9]{6}" placeholder="6-digit pincode" />
                                    </div>
                                    <div className="input-group">
                                        <label className="input-label">City *</label>
                                        <input type="text" name="pickupCity" className="input-field" required value={formData.pickupCity} onChange={handleInputChange} />
                                    </div>
                                    <div className="input-group">
                                        <label className="input-label">State *</label>
                                        <input type="text" name="pickupState" className="input-field" required value={formData.pickupState} onChange={handleInputChange} />
                                    </div>
                                </div>
                            </div>

                            {/* Section 2: Drop Details */}
                            <div style={{ background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)', padding: '2rem', borderRadius: '12px', border: '1px solid #bbf7d0', boxShadow: '0 2px 4px rgba(34, 197, 94, 0.1)' }}>
                                <h3 style={{ fontSize: '1.3rem', fontWeight: '700', marginBottom: '1.75rem', display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#166534' }}>
                                    <div style={{ width: '36px', height: '36px', background: '#22c55e', borderRadius: '50%', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem', fontWeight: '700', boxShadow: '0 4px 6px rgba(34, 197, 94, 0.3)' }}>2</div>
                                    <MapPin size={22} />
                                    Drop Details
                                </h3>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                                    <div className="input-group" style={{ gridColumn: '1 / -1' }}>
                                        <label className="input-label">Drop Address Line 1 *</label>
                                        <input type="text" name="dropAddressLine1" className="input-field" required value={formData.dropAddressLine1} onChange={handleInputChange} placeholder="Building/House No, Street Name" />
                                    </div>
                                    <div className="input-group" style={{ gridColumn: '1 / -1' }}>
                                        <label className="input-label">Drop Address Line 2</label>
                                        <input type="text" name="dropAddressLine2" className="input-field" value={formData.dropAddressLine2} onChange={handleInputChange} placeholder="Area, Locality" />
                                    </div>
                                    <div className="input-group">
                                        <label className="input-label">Landmark *</label>
                                        <input type="text" name="dropLandmark" className="input-field" required value={formData.dropLandmark} onChange={handleInputChange} placeholder="Near..." />
                                    </div>
                                    <div className="input-group">
                                        <label className="input-label">Pincode *</label>
                                        <input type="text" name="dropPincode" className="input-field" required value={formData.dropPincode} onChange={handleInputChange} pattern="[0-9]{6}" placeholder="6-digit pincode" />
                                    </div>
                                    <div className="input-group">
                                        <label className="input-label">City *</label>
                                        <input type="text" name="dropCity" className="input-field" required value={formData.dropCity} onChange={handleInputChange} />
                                    </div>
                                    <div className="input-group">
                                        <label className="input-label">State *</label>
                                        <input type="text" name="dropState" className="input-field" required value={formData.dropState} onChange={handleInputChange} />
                                    </div>
                                </div>
                            </div>

                            {/* Section 3: Timing & Schedule */}
                            <div style={{ background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)', padding: '2rem', borderRadius: '12px', border: '1px solid #fcd34d', boxShadow: '0 2px 4px rgba(245, 158, 11, 0.1)' }}>
                                <h3 style={{ fontSize: '1.3rem', fontWeight: '700', marginBottom: '1.75rem', display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#92400e' }}>
                                    <div style={{ width: '36px', height: '36px', background: '#f59e0b', borderRadius: '50%', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem', fontWeight: '700', boxShadow: '0 4px 6px rgba(245, 158, 11, 0.3)' }}>3</div>
                                    <Calendar size={22} />
                                    Timing & Schedule
                                </h3>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1.25rem' }}>
                                    <div className="input-group">
                                        <label className="input-label">Pickup Date *</label>
                                        <input type="date" name="pickupDate" className="input-field" required value={formData.pickupDate} onChange={handleInputChange} />
                                    </div>
                                    <div className="input-group">
                                        <label className="input-label">Pickup Time Slot *</label>
                                        <select name="pickupTimeSlot" className="input-field" value={formData.pickupTimeSlot} onChange={handleInputChange}>
                                            <option value="9am-12pm">9 AM - 12 PM</option>
                                            <option value="12pm-3pm">12 PM - 3 PM</option>
                                            <option value="3pm-6pm">3 PM - 6 PM</option>
                                            <option value="6pm-9pm">6 PM - 9 PM</option>
                                        </select>
                                    </div>
                                    <div className="input-group">
                                        <label className="input-label">Shipment Priority *</label>
                                        <select name="shipmentPriority" className="input-field" value={formData.shipmentPriority} onChange={handleInputChange}>
                                            <option value="Normal">Normal</option>
                                            <option value="Express">Express</option>
                                            <option value="Same-day">Same-day</option>
                                            <option value="Overnight">Overnight</option>
                                        </select>
                                    </div>
                                    <div className="input-group">
                                        <label className="input-label">Expected Delivery Date *</label>
                                        <input type="date" name="deliveryExpectedDate" className="input-field" required value={formData.deliveryExpectedDate} onChange={handleInputChange} />
                                    </div>
                                    <div className="input-group">
                                        <label className="input-label">Delivery Time Window *</label>
                                        <select name="deliveryTimeWindow" className="input-field" value={formData.deliveryTimeWindow} onChange={handleInputChange}>
                                            <option value="9am-6pm">9 AM - 6 PM</option>
                                            <option value="9am-12pm">9 AM - 12 PM</option>
                                            <option value="12pm-6pm">12 PM - 6 PM</option>
                                            <option value="Anytime">Anytime</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            {/* Section 4: Pallet & Load Details */}
                            <div style={{ background: 'linear-gradient(135deg, #fce7f3 0%, #fbcfe8 100%)', padding: '2rem', borderRadius: '12px', border: '1px solid #f9a8d4', boxShadow: '0 2px 4px rgba(236, 72, 153, 0.1)' }}>
                                <h3 style={{ fontSize: '1.3rem', fontWeight: '700', marginBottom: '1.75rem', display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#831843' }}>
                                    <div style={{ width: '36px', height: '36px', background: '#ec4899', borderRadius: '50%', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem', fontWeight: '700', boxShadow: '0 4px 6px rgba(236, 72, 153, 0.3)' }}>4</div>
                                    <Package size={22} />
                                    Pallet & Load Details
                                </h3>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1.25rem' }}>
                                    <div className="input-group">
                                        <label className="input-label">Pallet Count *</label>
                                        <input type="number" name="palletCount" className="input-field" required value={formData.palletCount} onChange={handleInputChange} min="1" />
                                    </div>
                                    <div className="input-group">
                                        <label className="input-label">Total Weight (kg) *</label>
                                        <input type="number" step="0.01" name="totalWeight" className="input-field" required value={formData.totalWeight} onChange={handleInputChange} />
                                    </div>
                                    <div className="input-group">
                                        <label className="input-label">Material Type *</label>
                                        <select name="materialType" className="input-field" value={formData.materialType} onChange={handleInputChange}>
                                            <option value="General">General</option>
                                            <option value="Electronics">Electronics</option>
                                            <option value="Furniture">Furniture</option>
                                            <option value="Textile">Textile</option>
                                            <option value="Chemicals">Chemicals</option>
                                            <option value="Food">Food</option>
                                            <option value="Documents">Documents</option>
                                        </select>
                                    </div>
                                    <div className="input-group">
                                        <label className="input-label">Length (cm)</label>
                                        <input type="number" step="0.1" name="length" className="input-field" value={formData.length} onChange={handleInputChange} placeholder="For volumetric weight" />
                                    </div>
                                    <div className="input-group">
                                        <label className="input-label">Width (cm)</label>
                                        <input type="number" step="0.1" name="width" className="input-field" value={formData.width} onChange={handleInputChange} placeholder="For volumetric weight" />
                                    </div>
                                    <div className="input-group">
                                        <label className="input-label">Height (cm)</label>
                                        <input type="number" step="0.1" name="height" className="input-field" value={formData.height} onChange={handleInputChange} placeholder="For volumetric weight" />
                                    </div>
                                    {formData.length && formData.width && formData.height && (
                                        <div className="input-group" style={{ gridColumn: '1 / -1' }}>
                                            <div style={{ padding: '0.75rem', background: 'white', borderRadius: '6px', fontSize: '0.9rem' }}>
                                                <strong>Volumetric Weight:</strong> {calculateVolumetricWeight()} kg (L×W×H / 5000)
                                            </div>
                                        </div>
                                    )}
                                    <div className="input-group" style={{ gridColumn: '1 / -1' }}>
                                        <label className="input-label">Special Handling Requirements</label>
                                        <input type="text" name="specialHandling" className="input-field" value={formData.specialHandling} onChange={handleInputChange} placeholder="e.g., Ice box, Shockproof, Tilt-prohibited" />
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                        <input type="checkbox" name="isFragile" id="isFragile" checked={formData.isFragile} onChange={handleInputChange} style={{ width: '18px', height: '18px' }} />
                                        <label htmlFor="isFragile" style={{ fontSize: '0.9rem', fontWeight: '500', cursor: 'pointer' }}>Fragile Item</label>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                        <input type="checkbox" name="isHighValue" id="isHighValue" checked={formData.isHighValue} onChange={handleInputChange} style={{ width: '18px', height: '18px' }} />
                                        <label htmlFor="isHighValue" style={{ fontSize: '0.9rem', fontWeight: '500', cursor: 'pointer' }}>High Value Item</label>
                                    </div>
                                </div>
                            </div>

                            {/* Section 5: Documentation & Compliance */}
                            <div style={{ background: 'linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%)', padding: '2rem', borderRadius: '12px', border: '1px solid #a5b4fc', boxShadow: '0 2px 4px rgba(99, 102, 241, 0.1)' }}>
                                <h3 style={{ fontSize: '1.3rem', fontWeight: '700', marginBottom: '1.75rem', display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#3730a3' }}>
                                    <div style={{ width: '36px', height: '36px', background: '#6366f1', borderRadius: '50%', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem', fontWeight: '700', boxShadow: '0 4px 6px rgba(99, 102, 241, 0.3)' }}>5</div>
                                    <FileText size={22} />
                                    Documentation & Compliance
                                </h3>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                                    <div className="input-group">
                                        <label className="input-label">E-Way Bill Number</label>
                                        <input type="text" name="ewayBillNumber" className="input-field" value={formData.ewayBillNumber} onChange={handleInputChange} placeholder="For goods > ₹50,000" />
                                    </div>
                                    <div className="input-group">
                                        <label className="input-label">Invoice Number</label>
                                        <input type="text" name="invoiceNumber" className="input-field" value={formData.invoiceNumber} onChange={handleInputChange} />
                                    </div>
                                    <div className="input-group">
                                        <label className="input-label">GST Number</label>
                                        <input type="text" name="gstNumber" className="input-field" value={formData.gstNumber} onChange={handleInputChange} placeholder="Sender's GST Number" />
                                    </div>
                                    <div className="input-group">
                                        <label className="input-label">Material Category *</label>
                                        <select name="materialCategory" className="input-field" value={formData.materialCategory} onChange={handleInputChange}>
                                            <option value="Non-Hazardous">Non-Hazardous</option>
                                            <option value="Hazardous">Hazardous</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            {/* Section 6: Sender Contact */}
                            <div style={{ background: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)', padding: '2rem', borderRadius: '12px', border: '1px solid #93c5fd', boxShadow: '0 2px 4px rgba(59, 130, 246, 0.1)' }}>
                                <h3 style={{ fontSize: '1.3rem', fontWeight: '700', marginBottom: '1.75rem', display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#1e40af' }}>
                                    <div style={{ width: '36px', height: '36px', background: '#3b82f6', borderRadius: '50%', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem', fontWeight: '700', boxShadow: '0 4px 6px rgba(59, 130, 246, 0.3)' }}>6</div>
                                    <User size={22} />
                                    Sender Contact Details
                                </h3>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                                    <div className="input-group">
                                        <label className="input-label">Sender Name *</label>
                                        <input type="text" name="senderName" className="input-field" required value={formData.senderName} onChange={handleInputChange} />
                                    </div>
                                    <div className="input-group">
                                        <label className="input-label">Company Name</label>
                                        <input type="text" name="senderCompanyName" className="input-field" value={formData.senderCompanyName} onChange={handleInputChange} placeholder="Optional" />
                                    </div>
                                    <div className="input-group">
                                        <label className="input-label">Sender Mobile *</label>
                                        <input type="tel" name="senderMobile" className="input-field" required value={formData.senderMobile} onChange={handleInputChange} pattern="[0-9]{10}" placeholder="10-digit mobile" />
                                    </div>
                                    <div className="input-group">
                                        <label className="input-label">Sender Email *</label>
                                        <input type="email" name="senderEmail" className="input-field" required value={formData.senderEmail} onChange={handleInputChange} />
                                    </div>
                                </div>
                            </div>

                            {/* Submit Buttons */}
                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem', paddingTop: '1.5rem', borderTop: '2px solid var(--border)' }}>
                                <button type="button" onClick={() => setShowCreateForm(false)} className="btn btn-outline" style={{ padding: '0.75rem 2rem' }}>Cancel</button>
                                <button type="submit" className="btn btn-primary" style={{ padding: '0.75rem 2rem' }}>Create Logistics Job</button>
                            </div>
                        </form>
                    </div>
                )}
            </main>
        </div>
    );
};

export default SupplierLogisticsJobCreation;
