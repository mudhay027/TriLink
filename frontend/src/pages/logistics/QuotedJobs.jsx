import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, User, ChevronLeft, Truck, Package, Calendar, MapPin, X, Eye } from 'lucide-react';
import '../../index.css';

const QuotedJobs = () => {
    const navigate = useNavigate();
    const [quotedJobs, setQuotedJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedJob, setSelectedJob] = useState(null);

    useEffect(() => {
        fetchQuotedJobs();
    }, []);

    const fetchQuotedJobs = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:5081/api/BuyerLogisticsJob/my-quotes', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                const data = await response.json();
                setQuotedJobs(data);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const JobDetailsModal = ({ job, onClose }) => {
        if (!job) return null;

        return (
            <div className="modal-overlay" onClick={onClose} style={{
                position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000,
                backdropFilter: 'blur(4px)'
            }}>
                <div className="modal-content fade-in" onClick={e => e.stopPropagation()} style={{
                    background: 'white', borderRadius: '16px', padding: '2rem', width: '90%', maxWidth: '800px',
                    maxHeight: '90vh', overflowY: 'auto', position: 'relative', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)'
                }}>
                    <button onClick={onClose} style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'none', border: 'none', cursor: 'pointer' }}>
                        <X size={24} color="#64748b" />
                    </button>

                    <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#1e293b', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <Truck size={28} color="#3b82f6" />
                        Job Details #{job.jobId?.substring(0, 8).toUpperCase()}
                    </h2>
                    <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '2rem', paddingLeft: '2.5rem' }}>
                        Posted on {new Date(job.createdAt).toLocaleDateString()}
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>

                        {/* Route Section */}
                        <div style={{ gridColumn: '1 / -1', background: '#f8fafc', padding: '1.5rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                            <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '1rem', color: '#334155', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Route Information</h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                <div style={{ display: 'flex', gap: '1rem' }}>
                                    <div style={{ marginTop: '0.25rem' }}><MapPin size={20} color="#3b82f6" /></div>
                                    <div>
                                        <div style={{ fontSize: '0.75rem', fontWeight: '700', color: '#64748b', marginBottom: '0.25rem' }}>PICKUP</div>
                                        <div style={{ fontWeight: '600', color: '#1e293b' }}>{job.jobPickupAddressLine1}</div>
                                        {job.jobPickupAddressLine2 && <div style={{ color: '#475569', fontSize: '0.9rem' }}>{job.jobPickupAddressLine2}</div>}
                                        <div style={{ color: '#475569' }}>{job.jobPickupCity}, {job.jobPickupState} - {job.jobPickupPincode}</div>
                                        <div style={{ fontSize: '0.85rem', color: '#3b82f6', marginTop: '0.25rem', fontWeight: '500' }}>
                                            SCHEDULED: {new Date(job.jobPickupDate).toLocaleDateString()}
                                        </div>
                                    </div>
                                </div>

                                <div style={{ height: '1px', background: '#e2e8f0', marginLeft: '2.5rem' }}></div>

                                <div style={{ display: 'flex', gap: '1rem' }}>
                                    <div style={{ marginTop: '0.25rem' }}><MapPin size={20} color="#22c55e" /></div>
                                    <div>
                                        <div style={{ fontSize: '0.75rem', fontWeight: '700', color: '#64748b', marginBottom: '0.25rem' }}>DROP</div>
                                        <div style={{ fontWeight: '600', color: '#1e293b' }}>{job.jobDropAddressLine1}</div>
                                        {job.jobDropAddressLine2 && <div style={{ color: '#475569', fontSize: '0.9rem' }}>{job.jobDropAddressLine2}</div>}
                                        <div style={{ color: '#475569' }}>{job.jobDropCity}, {job.jobDropState} - {job.jobDropPincode}</div>
                                        <div style={{ fontSize: '0.85rem', color: '#ea580c', marginTop: '0.25rem', fontWeight: '500' }}>
                                            EXPECTED: {new Date(job.jobDeliveryExpectedDate).toLocaleDateString()}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Cargo Details */}
                        <div>
                            <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '1rem', color: '#334155', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <Package size={18} /> Cargo Details
                            </h3>
                            <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '1.25rem' }}>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                    <div>
                                        <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Total Weight</div>
                                        <div style={{ fontWeight: '600', fontSize: '1.1rem', color: '#1e293b' }}>{job.jobTotalWeight} kg</div>
                                    </div>
                                    <div>
                                        <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Pallet Count</div>
                                        <div style={{ fontWeight: '600', fontSize: '1.1rem', color: '#1e293b' }}>{job.jobPalletCount}</div>
                                    </div>
                                    <div style={{ gridColumn: '1 / -1' }}>
                                        <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Material Type</div>
                                        <div style={{ fontWeight: '600', color: '#1e293b' }}>{job.jobMaterialType || 'General'}</div>
                                    </div>
                                    {(job.jobLength && job.jobWidth && job.jobHeight) && (
                                        <div style={{ gridColumn: '1 / -1' }}>
                                            <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Dimensions (L x W x H)</div>
                                            <div style={{ fontWeight: '600', color: '#1e293b' }}>{job.jobLength} x {job.jobWidth} x {job.jobHeight} cm</div>
                                        </div>
                                    )}
                                    <div style={{ gridColumn: '1 / -1', display: 'flex', gap: '0.5rem' }}>
                                        {job.jobIsFragile && <span style={{ fontSize: '0.75rem', background: '#fef3c7', color: '#92400e', padding: '0.25rem 0.5rem', borderRadius: '4px', fontWeight: '600' }}>Fragile</span>}
                                        {job.jobIsHighValue && <span style={{ fontSize: '0.75rem', background: '#fce7f3', color: '#831843', padding: '0.25rem 0.5rem', borderRadius: '4px', fontWeight: '600' }}>High Value</span>}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Quote Status */}
                        <div>
                            <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '1rem', color: '#334155', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                Quote Status
                            </h3>
                            <div style={{ background: job.status === 'Accepted' ? '#f0fdf4' : '#fff', border: `1px solid ${job.status === 'Accepted' ? '#bbf7d0' : '#e2e8f0'}`, borderRadius: '12px', padding: '1.25rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                                    <div style={{ fontSize: '0.85rem', color: '#64748b' }}>Quote Amount</div>
                                    <div style={{ fontSize: '1.25rem', fontWeight: '700', color: '#16a34a' }}>₹{job.quoteAmount}</div>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                                    <div style={{ fontSize: '0.85rem', color: '#64748b' }}>Status</div>
                                    <span style={{
                                        padding: '0.25rem 0.75rem', borderRadius: '20px', fontSize: '0.85rem', fontWeight: '600',
                                        background: job.status === 'Accepted' ? '#dcfce7' : (job.status === 'Rejected' ? '#fee2e2' : '#f1f5f9'),
                                        color: job.status === 'Accepted' ? '#16a34a' : (job.status === 'Rejected' ? '#991b1b' : '#64748b')
                                    }}>
                                        {job.status}
                                    </span>
                                </div>
                                <div style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid #e2e8f0' }}>
                                    Target Delivery: <span style={{ fontWeight: '600', color: '#1e293b' }}>{new Date(job.estimatedDeliveryDate).toLocaleDateString()}</span>
                                </div>
                            </div>
                        </div>

                    </div>

                    <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'flex-end' }}>
                        <button onClick={onClose} className="btn btn-primary" style={{ padding: '0.75rem 2rem' }}>Close</button>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="fade-in" style={{ minHeight: '100vh', background: '#f8fafc' }}>
            {/* Header */}
            <header style={{ background: 'white', borderBottom: '1px solid var(--border)', padding: '1rem 3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '3rem' }}>
                    <div style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--text-main)', cursor: 'pointer' }} onClick={() => { const userId = localStorage.getItem('userId'); navigate(`/logistics/dashboard/${userId}`); }}>TriLink</div>
                    <div style={{ display: 'flex', gap: '2rem', fontSize: '0.95rem', fontWeight: '500' }}>
                        <span onClick={() => { const userId = localStorage.getItem('userId'); navigate(`/logistics/dashboard/${userId}`); }} style={{ color: 'var(--text-muted)', cursor: 'pointer' }}>Dashboard</span>
                        <span onClick={() => { const userId = localStorage.getItem('userId'); navigate(`/logistics/available-jobs/${userId}`); }} style={{ color: 'var(--text-muted)', cursor: 'pointer' }}>Search Jobs</span>
                        <span onClick={() => { const userId = localStorage.getItem('userId'); navigate(`/logistics/quoted-jobs/${userId}`); }} style={{ color: 'var(--text-main)', cursor: 'pointer' }}>Quoted Jobs</span>
                        <span onClick={() => { const userId = localStorage.getItem('userId'); navigate(`/logistics/assigned-jobs/${userId}`); }} style={{ color: 'var(--text-muted)', cursor: 'pointer' }}>Assigned Jobs</span>
                    </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                    <Bell size={20} color="var(--text-muted)" />
                    <div
                        style={{ width: '32px', height: '32px', background: '#e2e8f0', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                        onClick={() => { const userId = localStorage.getItem('userId'); navigate(`/logistics/profile/${userId}`); }}
                    >
                        <User size={18} color="var(--text-muted)" />
                    </div>
                </div>
            </header>

            <main className="container" style={{ padding: '3rem 1rem', maxWidth: '1200px' }}>
                <div style={{ marginBottom: '2rem' }}>
                    <button
                        onClick={() => navigate(-1)}
                        style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', marginBottom: '1rem' }}
                    >
                        <ChevronLeft size={20} /> Back
                    </button>
                    <h1 style={{ fontSize: '2rem', fontWeight: '600', color: 'var(--text-main)' }}>My Quoted Jobs</h1>
                </div>

                {loading ? (
                    <div>Loading...</div>
                ) : quotedJobs.length === 0 ? (
                    <div className="card" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                        You haven't submitted any quotes yet.
                    </div>
                ) : (
                    <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead style={{ background: '#f8fafc', borderBottom: '1px solid var(--border)' }}>
                                <tr>
                                    <th style={{ padding: '1rem 1.5rem', textAlign: 'left', fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: '600' }}>Job ID</th>
                                    <th style={{ padding: '1rem 1.5rem', textAlign: 'left', fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: '600' }}>Route</th>

                                    <th style={{ padding: '1rem 1.5rem', textAlign: 'left', fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: '600' }}>My Quote</th>
                                    <th style={{ padding: '1rem 1.5rem', textAlign: 'left', fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: '600' }}>Job Status</th>
                                    <th style={{ padding: '1rem 1.5rem', textAlign: 'left', fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: '600' }}>Quote Status</th>
                                    <th style={{ padding: '1rem 1.5rem', textAlign: 'left', fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: '600' }}>Est. Delivery</th>
                                    <th style={{ padding: '1rem 1.5rem', textAlign: 'center', fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: '600' }}>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {quotedJobs.map((quote) => (
                                    <tr key={quote.id} style={{ borderBottom: '1px solid var(--border)', transition: 'background-color 0.2s', cursor: 'pointer' }} onClick={() => setSelectedJob(quote)} className="hover:bg-slate-50">
                                        <td style={{ padding: '1rem 1.5rem', fontWeight: '500' }}>#{quote.jobId.substring(0, 8).toUpperCase()}</td>
                                        <td style={{ padding: '1rem 1.5rem' }}>
                                            {quote.jobPickupCity} → {quote.jobDropCity}
                                        </td>

                                        <td style={{ padding: '1rem 1.5rem', fontWeight: '600', color: '#16a34a' }}>
                                            ₹{quote.quoteAmount}
                                        </td>
                                        <td style={{ padding: '1rem 1.5rem' }}>
                                            <span style={{
                                                padding: '0.25rem 0.75rem', borderRadius: '20px', fontSize: '0.85rem', fontWeight: '500',
                                                background: '#f1f5f9', color: 'var(--text-main)'
                                            }}>
                                                {quote.jobStatus}
                                            </span>
                                        </td>
                                        <td style={{ padding: '1rem 1.5rem' }}>
                                            <span style={{
                                                padding: '0.25rem 0.75rem', borderRadius: '20px', fontSize: '0.85rem', fontWeight: '500',
                                                background: quote.status === 'Accepted' ? '#dcfce7' : (quote.status === 'Rejected' ? '#fee2e2' : '#f1f5f9'),
                                                color: quote.status === 'Accepted' ? '#16a34a' : (quote.status === 'Rejected' ? '#991b1b' : '#64748b')
                                            }}>
                                                {quote.status}
                                            </span>
                                        </td>
                                        <td style={{ padding: '1rem 1.5rem', color: 'var(--text-muted)' }}>{new Date(quote.estimatedDeliveryDate).toLocaleDateString()}</td>
                                        <td style={{ padding: '1rem 1.5rem', textAlign: 'center' }}>
                                            <button
                                                onClick={(e) => { e.stopPropagation(); setSelectedJob(quote); }}
                                                style={{ background: '#3b82f6', color: 'white', border: 'none', padding: '0.4rem 0.8rem', borderRadius: '6px', fontSize: '0.8rem', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
                                            >
                                                <Eye size={14} /> View
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </main>

            {/* Modal */}
            {selectedJob && <JobDetailsModal job={selectedJob} onClose={() => setSelectedJob(null)} />}
        </div>
    );
};

export default QuotedJobs;
