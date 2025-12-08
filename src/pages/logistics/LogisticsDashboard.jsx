import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Truck, FileText, CheckCircle, Clock } from 'lucide-react';
import '../../index.css';

const LogisticsDashboard = () => {
    const navigate = useNavigate();
    const [selectedJob, setSelectedJob] = useState('JOB-001');

    const stats = [
        { label: 'Available Jobs', value: '24', icon: <Truck size={24} />, route: '/logistics/available-jobs' },
        { label: 'Assigned Jobs', value: '12', icon: <CheckCircle size={24} />, route: null },
        { label: 'Quotes Submitted', value: '8', icon: <FileText size={24} />, route: null },
    ];

    const assignedJobs = [
        { id: 'JOB-001', origin: 'Chennai', destination: 'Delhi', status: 'Pending', date: 'Jan 25, 2025' },
        { id: 'JOB-002', origin: 'Delhi', destination: 'Hossur', status: 'In Transit', date: 'Jan 22, 2025' },
    ];

    const steps = ['Pending', 'Picked', 'In Transit', 'Delivered'];
    const currentStep = 0; // For demo JOB-001

    return (
        <div className="fade-in" style={{ minHeight: '100vh', background: '#f8fafc' }}>
            {/* Header */}
            <header style={{ background: 'white', borderBottom: '1px solid var(--border)', padding: '1rem 3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '3rem' }}>
                    <div style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--text-main)' }}>TriLink</div>
                    <div style={{ display: 'flex', gap: '2rem', fontSize: '0.95rem', fontWeight: '500' }}>
                        <a href="#" style={{ color: 'var(--text-main)' }}>Dashboard</a>
                        <span onClick={() => navigate('/logistics/available-jobs')} style={{ color: 'var(--text-muted)', cursor: 'pointer' }}>Search Products</span>
                        <a href="#" style={{ color: 'var(--text-muted)' }}>My Offers</a>
                        <a href="#" style={{ color: 'var(--text-muted)' }}>Orders</a>
                    </div>
                </div>
            </header>

            <main className="container" style={{ padding: '3rem 1rem', maxWidth: '1200px' }}>
                <div style={{ marginBottom: '3rem' }}>
                    <h1 style={{ fontSize: '2rem', fontWeight: '600', marginBottom: '0.5rem', color: 'var(--text-main)' }}>Logistics Dashboard</h1>
                    <p style={{ color: 'var(--text-muted)' }}>Manage your logistics operations and job assignments</p>
                </div>

                {/* Stats */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', marginBottom: '3rem' }}>
                    {stats.map((stat, index) => (
                        <div
                            key={index}
                            className="card"
                            onClick={() => stat.route && navigate(stat.route)}
                            style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: stat.route ? 'pointer' : 'default' }}
                        >
                            <div>
                                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>{stat.label}</p>
                                <h3 style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--text-main)' }}>{stat.value}</h3>
                            </div>
                            <div style={{ width: '50px', height: '50px', background: '#f1f5f9', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-main)' }}>
                                {stat.icon}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Assigned Jobs */}
                <div style={{ marginBottom: '3rem' }}>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1.5rem', color: 'var(--text-main)' }}>Assigned Jobs</h3>
                    <p style={{ color: 'var(--text-muted)', marginBottom: '1rem', marginTop: '-1rem', fontSize: '0.9rem' }}>Jobs you've been assigned to complete</p>

                    <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead style={{ background: '#f8fafc', borderBottom: '1px solid var(--border)' }}>
                                <tr>
                                    <th style={{ padding: '1rem 1.5rem', textAlign: 'left', fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: '600' }}>Job ID</th>
                                    <th style={{ padding: '1rem 1.5rem', textAlign: 'left', fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: '600' }}>Route</th>
                                    <th style={{ padding: '1rem 1.5rem', textAlign: 'left', fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: '600' }}>Status</th>
                                    <th style={{ padding: '1rem 1.5rem', textAlign: 'left', fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: '600' }}>Pickup Date</th>
                                    <th style={{ padding: '1rem 1.5rem', textAlign: 'right', fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: '600' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {assignedJobs.map((job) => (
                                    <tr key={job.id} style={{ borderBottom: '1px solid var(--border)' }}>
                                        <td style={{ padding: '1rem 1.5rem', fontWeight: '500' }}>#{job.id}</td>
                                        <td style={{ padding: '1rem 1.5rem' }}>
                                            {job.origin} → {job.destination}
                                        </td>
                                        <td style={{ padding: '1rem 1.5rem' }}>
                                            <span style={{
                                                padding: '0.25rem 0.75rem', borderRadius: '20px', fontSize: '0.85rem', fontWeight: '500',
                                                background: '#f1f5f9', color: 'var(--text-main)'
                                            }}>
                                                {job.status}
                                            </span>
                                        </td>
                                        <td style={{ padding: '1rem 1.5rem', color: 'var(--text-muted)' }}>{job.date}</td>
                                        <td style={{ padding: '1rem 1.5rem', textAlign: 'right' }}>
                                            <button className="btn" style={{ padding: '0.4rem 1rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>Update Status</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Delivery Status Controls */}
                <div>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.5rem', color: 'var(--text-main)' }}>Delivery Status Controls</h3>
                    <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>Update job status as you progress</p>

                    <div className="card" style={{ padding: '2rem' }}>
                        <h4 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '2rem' }}>Job #{selectedJob} Status</h4>

                        {/* Stepper */}
                        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '3rem' }}>
                            {steps.map((step, index) => (
                                <React.Fragment key={index}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <div style={{
                                            width: '32px', height: '32px', borderRadius: '50%',
                                            background: index <= currentStep ? 'var(--text-main)' : 'white',
                                            border: index <= currentStep ? 'none' : '2px solid var(--border)',
                                            color: index <= currentStep ? 'white' : 'var(--text-muted)',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '600'
                                        }}>
                                            {index <= currentStep ? <CheckCircle size={16} /> : index + 1}
                                        </div>
                                        <span style={{ fontWeight: index <= currentStep ? '600' : '400', color: index <= currentStep ? 'var(--text-main)' : 'var(--text-muted)' }}>{step}</span>
                                    </div>
                                    {index < steps.length - 1 && (
                                        <div style={{ height: '2px', flex: 1, background: index < currentStep ? 'var(--text-main)' : 'var(--border)', margin: '0 1rem' }}></div>
                                    )}
                                </React.Fragment>
                            ))}
                        </div>

                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <button className="btn btn-primary">Mark as Picked</button>
                            <button className="btn btn-outline">Mark In Transit</button>
                            <button className="btn btn-outline">Mark Delivered</button>
                        </div>
                    </div>
                </div>

            </main>
        </div>
    );
};

export default LogisticsDashboard;
