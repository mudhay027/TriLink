import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, User, Search, ChevronDown } from 'lucide-react';
import '../../index.css';

const AvailableJobs = () => {
    const navigate = useNavigate();

    const jobs = [
        {
            origin: 'Chennai',
            destination: 'Delhi',
            type: 'Urgent',
            weight: '2.5 tons',
            quantity: '15 pallets',
            eta: 'Jan 25, 2025',
            id: 'JB-101'
        },
        {
            origin: 'Lucknow',
            destination: 'Pune',
            type: 'Standard',
            weight: '1.8 tons',
            quantity: '8 pallets',
            eta: 'Jan 28, 2025',
            id: 'JB-102'
        },
        {
            origin: 'Bengalore',
            destination: 'Kochi',
            type: 'Urgent',
            weight: '2.5 tons',
            quantity: '15 pallets',
            eta: 'Jan 25, 2025',
            id: 'JB-103'
        },
        {
            origin: 'Patna',
            destination: 'Thiruvandram',
            type: 'Standard',
            weight: '1.8 tons',
            quantity: '8 pallets',
            eta: 'Jan 28, 2025',
            id: 'JB-104'
        }
    ];

    return (
        <div className="fade-in" style={{ minHeight: '100vh', background: '#f8fafc' }}>
            {/* Header */}
            <header style={{ background: 'white', borderBottom: '1px solid var(--border)', padding: '1rem 3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '3rem' }}>
                    <div style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--text-main)', cursor: 'pointer' }} onClick={() => navigate('/logistics/dashboard')}>TriLink</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                    <Bell size={20} color="var(--text-muted)" />
                    <div
                        style={{ width: '32px', height: '32px', background: '#e2e8f0', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                        onClick={() => navigate('/logistics/profile')}
                    >
                        <User size={18} color="var(--text-muted)" />
                    </div>
                </div>
            </header>

            <main className="container" style={{ padding: '3rem 1rem', maxWidth: '1200px' }}>
                <div style={{ marginBottom: '2rem' }}>
                    <h1 style={{ fontSize: '2rem', fontWeight: '600', marginBottom: '1.5rem', color: 'var(--text-main)' }}>Available Jobs</h1>

                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <div style={{ position: 'relative', width: '300px' }}>
                            <input
                                type="text"
                                placeholder="Search jobs..."
                                className="input-field"
                                style={{ paddingLeft: '1rem' }}
                            />
                        </div>
                        <button className="btn btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'space-between', width: '150px' }}>
                            All Locations <ChevronDown size={16} />
                        </button>
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                    {jobs.map((job, index) => (
                        <div key={index} className="card" style={{ padding: '1.5rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                    <h3 style={{ fontSize: '1.1rem', fontWeight: '600' }}>{job.origin} <span style={{ color: 'var(--text-muted)', margin: '0 0.5rem' }}>→</span> {job.destination}</h3>
                                    <span style={{
                                        fontSize: '0.75rem', padding: '0.2rem 0.6rem', borderRadius: '4px', fontWeight: '500',
                                        background: job.type === 'Urgent' ? '#fef2f2' : '#f1f5f9',
                                        color: job.type === 'Urgent' ? '#ef4444' : 'var(--text-muted)'
                                    }}>
                                        {job.type}
                                    </span>
                                </div>
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                                <span style={{ color: 'var(--text-muted)' }}>Weight:</span>
                                <span style={{ fontWeight: '500' }}>{job.weight}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                                <span style={{ color: 'var(--text-muted)' }}>Quantity:</span>
                                <span style={{ fontWeight: '500' }}>{job.quantity}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
                                <span style={{ color: 'var(--text-muted)' }}>ETA:</span>
                                <span style={{ fontWeight: '500' }}>{job.eta}</span>
                            </div>

                            <button
                                onClick={() => navigate(`/logistics/route-suggestion/${job.id}`)}
                                className="btn btn-primary"
                                style={{ width: '100%' }}
                            >
                                View Job Details
                            </button>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
};

export default AvailableJobs;
