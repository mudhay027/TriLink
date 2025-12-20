import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Truck, FileText, CheckCircle, Clock, Bell, User } from 'lucide-react';
import '../../index.css';

const LogisticsDashboard = () => {
    const navigate = useNavigate();
    const [selectedJob, setSelectedJob] = useState('JOB-001');
    const [jobHistory, setJobHistory] = useState([]);
    // const [jobHistory, setJobHistory] = useState([]); // This state is no longer needed

    // Stats
    // Hardcoded for now as per design, should not change when quoting
    const [availableJobsCount, setAvailableJobsCount] = useState(0);
    const [assignedJobsCount, setAssignedJobsCount] = useState(0);
    const [quotesSubmittedCount, setQuotesSubmittedCount] = useState(0);
    const [allJobs, setAllJobs] = useState([]);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const token = localStorage.getItem('token');
                const headers = { 'Authorization': `Bearer ${token}` };

                // Fetch Available Jobs
                const availableRes = await fetch('http://localhost:5081/api/BuyerLogisticsJob/available', { headers });
                if (availableRes.ok) {
                    const data = await availableRes.json();
                    setAvailableJobsCount(data.length);
                }

                // Fetch Assigned Jobs
                const assignedRes = await fetch('http://localhost:5081/api/BuyerLogisticsJob/assigned', { headers });
                if (assignedRes.ok) {
                    const data = await assignedRes.json();
                    setAssignedJobsCount(data.length);
                }

                // Fetch Quotes Submitted (only Pending quotes, not Accepted/Rejected)
                const quotesRes = await fetch('http://localhost:5081/api/BuyerLogisticsJob/my-quotes', { headers });
                if (quotesRes.ok) {
                    const quotedJobs = await quotesRes.json();
                    console.log('Dashboard API Response:', quotedJobs);
                    console.log('First job sample:', quotedJobs[0]);
                    // Only count quotes that are still "Pending" (actually quoted, not accepted/rejected)
                    const pendingQuotes = quotedJobs.filter(quote => quote.status === 'Pending');
                    setQuotesSubmittedCount(pendingQuotes.length);

                    // Combine quoted jobs with localStorage jobs for dashboard display
                    const localHistory = JSON.parse(localStorage.getItem('jobHistory') || '[]');

                    // Map API jobs to match localStorage format
                    const mappedQuotedJobs = quotedJobs.map(job => ({
                        id: job.id,
                        origin: job.jobPickupCity || job.jobPickupAddressLine1 || 'Unknown',
                        destination: job.jobDropCity || job.jobDropAddressLine1 || 'Unknown',
                        status: job.jobStatus || job.status || 'Unknown',
                        date: new Date(job.pickupDate || job.createdAt || Date.now()).toLocaleDateString(),
                        driverExp: job.driverExperience || '-',
                        vehicleType: job.vehicleType || '-',
                        distance: job.plannedDistance || job.distance || 'N/A'
                    }));

                    // Combine and deduplicate
                    const combinedJobs = [...mappedQuotedJobs, ...localHistory];
                    const uniqueJobs = combinedJobs.filter((job, index, self) =>
                        index === self.findIndex((j) => j.id === job.id)
                    );

                    setAllJobs(uniqueJobs);
                } else {
                    // If API fails, fallback to localStorage only
                    const localHistory = JSON.parse(localStorage.getItem('jobHistory') || '[]');
                    setAllJobs(localHistory);
                }

            } catch (error) {
                console.error("Error fetching dashboard stats:", error);
                // Fallback to localStorage if API fails
                const localHistory = JSON.parse(localStorage.getItem('jobHistory') || '[]');
                setAllJobs(localHistory);
            }
        };

        fetchStats();
    }, []);

    const stats = [
        { label: 'Available Jobs', value: availableJobsCount, icon: <Truck size={24} />, route: `/logistics/available-jobs/${localStorage.getItem('userId')}` },
        { label: 'Assigned Jobs', value: assignedJobsCount, icon: <CheckCircle size={24} />, route: `/logistics/assigned-jobs/${localStorage.getItem('userId')}` },
        { label: 'Quotes Submitted', value: quotesSubmittedCount, icon: <FileText size={24} />, route: `/logistics/available-jobs/${localStorage.getItem('userId')}`, state: { filter: 'Quoted' } },
    ];

    return (
        <div className="fade-in" style={{ minHeight: '100vh', background: '#f8fafc' }}>
            {/* Header */}
            <header style={{ background: 'white', borderBottom: '1px solid var(--border)', padding: '1rem 3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '3rem' }}>
                    <div style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--text-main)' }}>TriLink</div>
                    <div style={{ display: 'flex', gap: '2rem', fontSize: '0.95rem', fontWeight: '500' }}>
                        <a href="#" onClick={() => { const userId = localStorage.getItem('userId'); navigate(`/logistics/dashboard/${userId}`); }} style={{ color: 'var(--text-main)', cursor: 'pointer' }}>Dashboard</a>
                        <span onClick={() => { const userId = localStorage.getItem('userId'); navigate(`/logistics/available-jobs/${userId}`); }} style={{ color: 'var(--text-muted)', cursor: 'pointer' }}>Search Jobs</span>
                        <span onClick={() => { const userId = localStorage.getItem('userId'); navigate(`/logistics/quoted-jobs/${userId}`); }} style={{ color: 'var(--text-muted)', cursor: 'pointer' }}>Quoted Jobs</span>
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
                            onClick={() => stat.route && navigate(stat.route, { state: stat.state })}
                            style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: stat.route ? 'pointer' : 'default' }}
                        >
                            <div>
                                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>{stat.label}</p>
                                <h3 style={{ fontSize: '2.5rem', fontWeight: '700', color: 'var(--text-main)', margin: 0 }}>{stat.value}</h3>
                            </div>
                            <div style={{ width: '50px', height: '50px', background: '#f1f5f9', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-main)' }}>
                                {stat.icon}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Active and Delivered Jobs */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '3rem' }}>
                    {/* Active Jobs */}
                    <div>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1.5rem', color: 'var(--text-main)' }}>Active Jobs</h3>
                        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                            {(() => {
                                // Filter for all non-delivered statuses (In Progress, Picked, In Transit, etc.)
                                const activeJobs = allJobs.filter(job =>
                                    job.status !== 'Delivered' && job.status !== 'Completed'
                                ).slice(0, 5);

                                if (activeJobs.length === 0) {
                                    return (
                                        <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                                            <Clock size={48} style={{ opacity: 0.3, marginBottom: '1rem' }} />
                                            <p>No active jobs</p>
                                        </div>
                                    );
                                }

                                return (
                                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                        <thead style={{ background: '#f8fafc', borderBottom: '1px solid var(--border)' }}>
                                            <tr>
                                                <th style={{ padding: '0.75rem 1rem', textAlign: 'left', fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '600' }}>Job ID</th>
                                                <th style={{ padding: '0.75rem 1rem', textAlign: 'left', fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '600' }}>Route</th>
                                                <th style={{ padding: '0.75rem 1rem', textAlign: 'left', fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '600' }}>Status</th>
                                                <th style={{ padding: '0.75rem 1rem', textAlign: 'left', fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '600' }}>Date</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {activeJobs.map((job, index) => (
                                                <tr key={index} style={{ borderBottom: index < activeJobs.length - 1 ? '1px solid var(--border)' : 'none' }}>
                                                    <td style={{ padding: '0.75rem 1rem', fontWeight: '500', fontSize: '0.85rem' }}>
                                                        {job.id && job.id.length > 8 ? `JOB-${job.id.substring(0, 6)}` : job.id}
                                                    </td>
                                                    <td style={{ padding: '0.75rem 1rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                                                        {job.origin} → {job.destination}
                                                    </td>
                                                    <td style={{ padding: '0.75rem 1rem', fontSize: '0.85rem' }}>
                                                        <span style={{
                                                            padding: '0.25rem 0.75rem',
                                                            borderRadius: '12px',
                                                            fontSize: '0.75rem',
                                                            fontWeight: '500',
                                                            background: job.status === 'In Transit' ? '#dbeafe' : job.status === 'Picked' ? '#fef3c7' : '#e0e7ff',
                                                            color: job.status === 'In Transit' ? '#1e40af' : job.status === 'Picked' ? '#92400e' : '#4338ca'
                                                        }}>
                                                            {job.status}
                                                        </span>
                                                    </td>
                                                    <td style={{ padding: '0.75rem 1rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>{job.date}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                );
                            })()}
                        </div>
                    </div>

                    {/* Delivered Jobs */}
                    <div>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1.5rem', color: 'var(--text-main)' }}>Delivered Jobs</h3>
                        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                            {(() => {
                                const deliveredJobs = allJobs.filter(job => job.status === 'Delivered' || job.status === 'Completed').slice(0, 5);

                                if (deliveredJobs.length === 0) {
                                    return (
                                        <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                                            <CheckCircle size={48} style={{ opacity: 0.3, marginBottom: '1rem' }} />
                                            <p>No delivered jobs</p>
                                        </div>
                                    );
                                }

                                return (
                                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                        <thead style={{ background: '#f8fafc', borderBottom: '1px solid var(--border)' }}>
                                            <tr>
                                                <th style={{ padding: '0.75rem 1rem', textAlign: 'left', fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '600' }}>Job ID</th>
                                                <th style={{ padding: '0.75rem 1rem', textAlign: 'left', fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '600' }}>Route</th>
                                                <th style={{ padding: '0.75rem 1rem', textAlign: 'left', fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '600' }}>Status</th>
                                                <th style={{ padding: '0.75rem 1rem', textAlign: 'left', fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '600' }}>Date</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {deliveredJobs.map((job, index) => (
                                                <tr key={index} style={{ borderBottom: index < deliveredJobs.length - 1 ? '1px solid var(--border)' : 'none' }}>
                                                    <td style={{ padding: '0.75rem 1rem', fontWeight: '500', fontSize: '0.85rem' }}>
                                                        {job.id && job.id.length > 8 ? `JOB-${job.id.substring(0, 6)}` : job.id}
                                                    </td>
                                                    <td style={{ padding: '0.75rem 1rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                                                        {job.origin} → {job.destination}
                                                    </td>
                                                    <td style={{ padding: '0.75rem 1rem', fontSize: '0.85rem' }}>
                                                        <span style={{
                                                            padding: '0.25rem 0.75rem',
                                                            borderRadius: '12px',
                                                            fontSize: '0.75rem',
                                                            fontWeight: '500',
                                                            background: '#ecfdf5',
                                                            color: '#059669'
                                                        }}>
                                                            {job.status}
                                                        </span>
                                                    </td>
                                                    <td style={{ padding: '0.75rem 1rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>{job.date}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                );
                            })()}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};


export default LogisticsDashboard;
