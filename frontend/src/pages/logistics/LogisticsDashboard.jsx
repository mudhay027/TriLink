import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Truck, FileText, CheckCircle, Clock, Bell, User, Eye } from 'lucide-react';
import RouteViewModal from '../../components/RouteViewModal';
import '../../index.css';

const LogisticsDashboard = () => {
    const navigate = useNavigate();
    const [selectedJob, setSelectedJob] = useState('JOB-001');
    const [jobHistory, setJobHistory] = useState([]);
    const [viewRouteJobId, setViewRouteJobId] = useState(null);
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
                const userId = localStorage.getItem('userId');
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

                // Fetch Quotes Submitted (all quotes regardless of status)
                const quotesRes = await fetch('http://localhost:5081/api/BuyerLogisticsJob/my-quotes', { headers });
                if (quotesRes.ok) {
                    const quotedJobs = await quotesRes.json();
                    // Count all submitted quotes (Pending, Accepted, Rejected)
                    setQuotesSubmittedCount(quotedJobs.length);

                    // Map API jobs to match display format
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

                    setAllJobs(mappedQuotedJobs);
                }

                // Fetch Job History from API
                const historyRes = await fetch(`http://localhost:5081/api/JobHistory/my-history?userId=${userId}`, { headers });
                if (historyRes.ok) {
                    const historyData = await historyRes.json();
                    const formattedHistory = historyData.map(job => ({
                        id: job.jobId,
                        origin: job.origin,
                        destination: job.destination,
                        status: job.status,
                        date: new Date(job.completedDate).toLocaleDateString(),
                        driverExp: job.driverExperience || 'N/A',
                        vehicleType: job.vehicleType || 'N/A',
                        distance: job.plannedDistance || 'N/A',
                        duration: job.plannedDuration || 'N/A'
                    }));
                    setJobHistory(formattedHistory);
                }

            } catch (error) {
                console.error("Error fetching dashboard stats:", error);
            }
        };

        fetchStats();
    }, []);

    const stats = [
        { label: 'Available Jobs', value: availableJobsCount, icon: <Truck size={24} />, route: `/logistics/available-jobs/${localStorage.getItem('userId')}` },
        { label: 'Assigned Jobs', value: assignedJobsCount, icon: <CheckCircle size={24} />, route: `/logistics/assigned-jobs/${localStorage.getItem('userId')}` },
        { label: 'Quotes Submitted', value: quotesSubmittedCount, icon: <FileText size={24} />, route: `/logistics/quoted-jobs/${localStorage.getItem('userId')}` },
    ];

    return (
        <div className="fade-in" style={{ minHeight: '100vh', background: '#f8fafc' }}>
            {/* Header */}
            <header style={{ background: 'white', borderBottom: '1px solid var(--border)', padding: '1rem 3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '3rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }} onClick={() => { const userId = localStorage.getItem('userId'); navigate(`/logistics/dashboard/${userId}`); }}>
                        <img src="/TriLinkIcon.png" alt="TriLink" style={{ height: '36px' }} />
                        <span style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--text-main)' }}>TriLink</span>
                    </div>
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

                {/* Active Jobs */}
                <div style={{ marginBottom: '3rem' }}>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1.5rem', color: 'var(--text-main)' }}>Active Jobs</h3>
                    <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                        {(() => {
                            // Filter for all non-delivered statuses
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

                {/* Job History */}
                <div>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1.5rem', color: 'var(--text-main)' }}>Job History</h3>
                    <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                        {(() => {
                            const historyJobs = jobHistory;

                            if (historyJobs.length === 0) {
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
                                            <th style={{ padding: '0.75rem 1rem', textAlign: 'left', fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '600' }}>Driver Experience</th>
                                            <th style={{ padding: '0.75rem 1rem', textAlign: 'left', fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '600' }}>Vehicle Recommended</th>
                                            <th style={{ padding: '0.75rem 1rem', textAlign: 'left', fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '600' }}>Distance</th>
                                            <th style={{ padding: '0.75rem 1rem', textAlign: 'right', fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '600' }}>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {historyJobs.map((job, index) => (
                                            <tr
                                                key={index}
                                                style={{ borderBottom: index < historyJobs.length - 1 ? '1px solid var(--border)' : 'none' }}
                                            >
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
                                                <td style={{ padding: '0.75rem 1rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>{job.driverExp}</td>
                                                <td style={{ padding: '0.75rem 1rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>{job.vehicleType}</td>
                                                <td style={{ padding: '0.75rem 1rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>{job.distance}</td>
                                                <td style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>
                                                    <button
                                                        className="btn btn-primary"
                                                        style={{
                                                            padding: '0.4rem 0.8rem',
                                                            fontSize: '0.75rem',
                                                            display: 'inline-flex',
                                                            alignItems: 'center',
                                                            gap: '0.25rem',
                                                            background: '#2563eb',
                                                            color: 'white',
                                                            border: 'none',
                                                            borderRadius: '6px',
                                                            cursor: 'pointer'
                                                        }}
                                                        onClick={() => setViewRouteJobId(job.id)}
                                                    >
                                                        <Eye size={12} /> View Route
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            );
                        })()}
                    </div>
                </div>
            </main>

            {/* Route View Modal */}
            {viewRouteJobId && (
                <RouteViewModal
                    jobId={viewRouteJobId}
                    onClose={() => setViewRouteJobId(null)}
                />
            )}
        </div>
    );
};


export default LogisticsDashboard;
