import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { MapPin, Clock, Truck, Zap, Map } from 'lucide-react';
import '../../index.css';

const RouteSuggestion = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [showComparison, setShowComparison] = useState(false);
    const [selectedRoute, setSelectedRoute] = useState(null);

    const handleSuggest = () => {
        // Simulate API call delay
        setTimeout(() => {
            setShowComparison(true);
        }, 500);
    };

    const handleConfirm = () => {
        if (selectedRoute) {
            navigate('/logistics/route-summary');
        }
    };

    return (
        <div className="fade-in" style={{ minHeight: '100vh', background: '#f8fafc' }}>
            {/* Header */}
            <header style={{ background: 'white', borderBottom: '1px solid var(--border)', padding: '1rem 3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '3rem' }}>
                    <div style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--text-main)', cursor: 'pointer' }} onClick={() => navigate('/logistics/dashboard')}>TriLink</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                    <Bell size={20} color="var(--text-muted)" />
                    <div style={{ width: '32px', height: '32px', background: '#e2e8f0', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <User size={18} color="var(--text-muted)" />
                    </div>
                </div>
            </header>

            <main className="container" style={{ padding: '2rem 1rem', maxWidth: '1200px' }}>
                <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                    Jobs &gt; {id} &gt; Route Suggestion
                </div>
                <h1 style={{ fontSize: '2rem', fontWeight: '600', marginBottom: '2rem', color: 'var(--text-main)' }}>Route Suggestion</h1>

                {/* Job Details Card */}
                <div className="card" style={{ padding: '1.5rem', marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                            <h2 style={{ fontSize: '1.25rem', fontWeight: '600' }}>Delivery to Delhi Warehouse</h2>
                            <span style={{ fontSize: '0.75rem', padding: '0.2rem 0.6rem', background: '#f1f5f9', borderRadius: '4px', fontWeight: '500' }}>In Progress</span>
                        </div>
                        <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>JOB-2025-0342</div>

                        <div style={{ display: 'flex', gap: '3rem', marginTop: '1.5rem' }}>
                            <div>
                                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Pickup Location</div>
                                <div style={{ fontWeight: '500' }}>123 Industrial Park, Zone A, Coimbatore</div>
                            </div>
                            <div>
                                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Delivery Location</div>
                                <div style={{ fontWeight: '500' }}>456 Central Delhi, Maharastra</div>
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '3rem', marginTop: '1rem' }}>
                            <div>
                                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Scheduled Time</div>
                                <div style={{ fontWeight: '500' }}>Jan 15, 2025 - 2:00 PM</div>
                            </div>
                            <div>
                                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Driver Assigned</div>
                                <div style={{ fontWeight: '500' }}>Parthiban</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Route Planning / Comparison Section */}
                <div className="card" style={{ padding: '1.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                        <h3 style={{ fontSize: '1.1rem', fontWeight: '600' }}>
                            {showComparison ? 'Compare Routes' : 'Route Planning'}
                        </h3>
                        {!showComparison && (
                            <button onClick={handleSuggest} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <Zap size={16} /> Suggest Route
                            </button>
                        )}
                        {showComparison && (
                            <button onClick={() => setShowComparison(false)} className="btn btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem' }}>
                                Generate New Routes
                            </button>
                        )}
                    </div>

                    {!showComparison ? (
                        <>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
                                <StatPlaceholder label="Distance" icon={<MapPin size={16} />} />
                                <StatPlaceholder label="Est. Time" icon={<Clock size={16} />} />
                                <StatPlaceholder label="Fuel Cost" icon={<Truck size={16} />} />
                            </div>
                            <div style={{ background: '#f8fafc', border: '2px dashed var(--border)', borderRadius: '12px', height: '300px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
                                <Map size={48} style={{ opacity: 0.2, marginBottom: '1rem' }} />
                                <p>Click "Suggest Route" to generate route options</p>
                            </div>
                        </>
                    ) : (
                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                            {/* Route Options */}
                            <div style={{ maxWidth: '600px', width: '100%' }}>
                                <RouteCard
                                    title="Optimal Route"
                                    tag="Recommended"
                                    tagColor="#10b981"
                                    selected={selectedRoute === 'optimal'}
                                    onClick={() => setSelectedRoute('optimal')}
                                    stats={{ distance: '2122 km', time: '32 hr', cost: '₹50432' }}
                                    details="Via Highway 101 & Main Street"
                                />
                            </div>
                        </div>
                    )}
                </div>

                {/* Route Confirmation */}
                {selectedRoute && (
                    <div className="card" style={{ marginTop: '2rem', padding: '1.5rem', border: '1px solid var(--border)', background: 'var(--surface)' }}>
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', marginBottom: '1.5rem' }}>
                            <div style={{ width: '32px', height: '32px', background: 'var(--text-main)', borderRadius: '50%', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <CheckCircle size={18} />
                            </div>
                            <div>
                                <h3 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '0.25rem' }}>Route Confirmation</h3>
                                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                                    You have selected the for this job. This route will be assigned to the driver. <span style={{ fontWeight: '600', color: 'var(--text-main)' }}>{selectedRoute === 'optimal' ? 'Optimal Route' : 'Alternative Route'}</span>
                                </p>
                            </div>
                        </div>

                        <div style={{ background: '#f8fafc', borderRadius: '8px', padding: '1.5rem', marginBottom: '1.5rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                                <h4 style={{ fontSize: '0.95rem', fontWeight: '600' }}>Selected Route Details</h4>
                                <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem', cursor: 'pointer' }}>Edit</span>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', fontSize: '0.9rem' }}>
                                <div>
                                    <div style={{ color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Route Type</div>
                                    <div style={{ fontWeight: '500' }}>{selectedRoute === 'optimal' ? 'Optimal Route' : 'Alternative Route'}</div>
                                </div>
                                <div>
                                    <div style={{ color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Total Distance</div>
                                    <div style={{ fontWeight: '500' }}>{selectedRoute === 'optimal' ? '2122 km' : '2428 km'}</div>
                                </div>
                                <div>
                                    <div style={{ color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Estimated Duration</div>
                                    <div style={{ fontWeight: '500' }}>{selectedRoute === 'optimal' ? '32 hours' : '38 hours'}</div>
                                </div>
                                <div>
                                    <div style={{ color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Expected Arrival</div>
                                    <div style={{ fontWeight: '500' }}>2:32 PM</div>
                                </div>
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <button onClick={handleConfirm} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <CheckCircle size={16} /> Confirm & Assign Route
                            </button>
                            <button onClick={() => setSelectedRoute(null)} className="btn btn-outline">Cancel</button>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

// Sub-components
import { Bell, User, CheckCircle } from 'lucide-react';

const StatPlaceholder = ({ label, icon }) => (
    <div style={{ background: '#f9fafb', padding: '1rem', borderRadius: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '0.5rem' }}>
            {icon} {label}
        </div>
        <div style={{ fontSize: '1.25rem', fontWeight: '600', color: 'var(--text-muted)' }}>--</div>
    </div>
);

const RouteCard = ({ title, tag, tagColor, selected, onClick, stats, details }) => (
    <div
        onClick={onClick}
        style={{
            border: selected ? '2px solid var(--text-main)' : '1px solid var(--border)',
            borderRadius: '12px',
            padding: '1.5rem',
            cursor: 'pointer',
            transition: 'all 0.2s',
            position: 'relative'
        }}
    >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Zap size={18} fill={selected ? "var(--text-main)" : "none"} />
                <h3 style={{ fontWeight: '600' }}>{title}</h3>
            </div>
            {tag && (
                <span style={{
                    background: 'var(--text-main)', color: 'white',
                    fontSize: '0.75rem', padding: '0.2rem 0.6rem', borderRadius: '4px', fontWeight: '500'
                }}>
                    {tag}
                </span>
            )}
        </div>

        {/* Map Preview Placeholder */}
        <div style={{ height: '120px', background: '#f1f5f9', borderRadius: '8px', marginBottom: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
            <Map size={32} color="#cbd5e1" />
            <span style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '0.5rem' }}>Route Preview</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', fontSize: '0.9rem' }}>
            <div style={{ display: 'flex', justifySelf: 'start', flexDirection: 'column' }}>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Distance</span>
                <span style={{ fontWeight: '500' }}>{stats.distance}</span>
            </div>
            <div style={{ display: 'flex', justifySelf: 'end', flexDirection: 'column', alignItems: 'flex-end' }}>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Distance</span>
                <span style={{ fontWeight: '500' }}>{stats.distance}</span> {/* Typo in wireframe? Keeping consistent */}
            </div>
            <div style={{ display: 'flex', justifySelf: 'start', flexDirection: 'column' }}>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Est. Time</span>
                <span style={{ fontWeight: '500' }}>{stats.time}</span>
            </div>
            <div style={{ display: 'flex', justifySelf: 'end', flexDirection: 'column', alignItems: 'flex-end' }}>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Est. Time</span>
                <span style={{ fontWeight: '500' }}>{stats.time}</span>
            </div>
            <div style={{ display: 'flex', justifySelf: 'start', flexDirection: 'column' }}>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Fuel Cost</span>
                <span style={{ fontWeight: '500' }}>{stats.cost}</span>
            </div>
            <div style={{ display: 'flex', justifySelf: 'end', flexDirection: 'column', alignItems: 'flex-end' }}>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Fuel Cost</span>
                <span style={{ fontWeight: '500' }}>{stats.cost}</span>
            </div>

        </div>

        <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--border)', fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{ width: '14px', height: '14px', background: '#94a3b8', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '10px' }}>i</div>
            {details}
        </div>
    </div>
);

export default RouteSuggestion;
