import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Bell, User, Map, Truck, Clock, Maximize2, X } from 'lucide-react';
import { MapContainer, TileLayer, Polyline, Marker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import polyline from '@mapbox/polyline';
import L from 'leaflet';
import Toast from '../../components/Toast';
import { useToast } from '../../hooks/useNotification';
import '../../index.css';

// Fix for default marker icon
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const RouteSummary = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { jobData, suggestedRouteData } = location.state || {};
    const [showMapFullscreen, setShowMapFullscreen] = useState(false);
    const [routes, setRoutes] = useState([]);
    const [loading, setLoading] = useState(true);

    // Custom notifications
    const { toast, showError, hideToast } = useToast();

    // Validate required data on mount
    React.useEffect(() => {
        if (!jobData || !suggestedRouteData) {
            console.error('Missing required data for RouteSummary');
            const userId = localStorage.getItem('userId');
            if (userId) {
                navigate(`/logistics/dashboard/${userId}`, { replace: true });
            } else {
                navigate('/login', { replace: true });
            }
        }
    }, [jobData, suggestedRouteData, navigate]);

    // Debug: Log received data
    console.log('RouteSummary received suggestedRouteData:', suggestedRouteData);
    console.log('Cost breakdown in RouteSummary:', suggestedRouteData?.costBreakdown);

    const handleAccept = async () => {
        try {
            // Validate userId first
            const userId = localStorage.getItem('userId');
            if (!userId) {
                showError('User ID not found. Please log in again.');
                navigate('/login');
                return;
            }

            // Navigate to dashboard
            // Note: The job status will be updated when the logistics provider
            // actually starts working on the job from the Assigned Jobs page
            navigate(`/logistics/dashboard/${userId}`);
        } catch (error) {
            console.error('Error accepting route:', error);
            showError('Failed to accept route. Please try again.');
        }
    };

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
                        <span onClick={() => { const userId = localStorage.getItem('userId'); navigate(`/logistics/assigned-jobs/${userId}`); }} style={{ color: 'var(--text-muted)', cursor: 'pointer' }}>Assigned Jobs</span>
                    </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                    <Bell size={20} color="var(--text-muted)" />
                    <div style={{ width: '32px', height: '32px', background: '#e2e8f0', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <User size={18} color="var(--text-muted)" />
                    </div>
                </div>
            </header>

            <main className="container" style={{ padding: '3rem 1rem', maxWidth: '800px' }}>
                <h1 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>Route Summary</h1>

                <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
                    {/* Map Preview */}
                    {/* Map Preview */}
                    <div style={{ height: '300px', background: '#f1f5f9', display: 'block', position: 'relative' }}>
                        {/* Maximize Button */}
                        <button
                            onClick={() => setShowMapFullscreen(true)}
                            style={{
                                position: 'absolute',
                                top: '10px',
                                right: '10px',
                                zIndex: 1000,
                                background: 'white',
                                border: 'none',
                                borderRadius: '6px',
                                padding: '0.5rem',
                                cursor: 'pointer',
                                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}
                            title="View fullscreen map"
                        >
                            <Maximize2 size={18} color="#374151" />
                        </button>

                        {(() => {
                            let positions = [];
                            let isFallback = false;
                            const routeGeometry = suggestedRouteData?.routeGeometry;
                            const originCoords = suggestedRouteData?.originCoords;
                            const destinationCoords = suggestedRouteData?.destinationCoords;

                            if (routeGeometry) {
                                try {
                                    positions = polyline.decode(routeGeometry);
                                } catch (e) {
                                    console.error("Error decoding polyline", e);
                                }
                            } else if (originCoords && destinationCoords) {
                                positions = [originCoords, destinationCoords];
                                isFallback = true;
                            }

                            if (positions.length > 0) {
                                return (
                                    <MapContainer center={positions[0]} zoom={6} scrollWheelZoom={false} style={{ height: '100%', width: '100%' }}>
                                        <TileLayer
                                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                        />
                                        <Polyline positions={positions} color={isFallback ? "#94a3b8" : "#2563eb"} dashArray={isFallback ? "5, 10" : null} />
                                        {isFallback && originCoords && <Marker position={originCoords}></Marker>}
                                        {isFallback && destinationCoords && <Marker position={destinationCoords}></Marker>}
                                    </MapContainer>
                                );
                            } else {
                                return (
                                    <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
                                        <Map size={64} color="#cbd5e1" />
                                        <span style={{ marginTop: '1rem', color: '#94a3b8', fontWeight: '500' }}>No map data available</span>
                                    </div>
                                );
                            }
                        })()}
                    </div>

                    <div style={{ padding: '2rem' }}>

                        {/* Fullscreen Map Modal */}
                        {showMapFullscreen && suggestedRouteData && (
                            <div style={{
                                position: 'fixed',
                                top: 0,
                                left: 0,
                                right: 0,
                                bottom: 0,
                                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                                zIndex: 9999,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                padding: '2rem'
                            }}>
                                <div style={{
                                    width: '100%',
                                    height: '100%',
                                    maxWidth: '1400px',
                                    maxHeight: '900px',
                                    background: 'white',
                                    borderRadius: '12px',
                                    overflow: 'hidden',
                                    position: 'relative'
                                }}>
                                    {/* Close Button */}
                                    <button
                                        onClick={() => setShowMapFullscreen(false)}
                                        style={{
                                            position: 'absolute',
                                            top: '15px',
                                            right: '15px',
                                            zIndex: 10000,
                                            background: 'white',
                                            border: 'none',
                                            borderRadius: '50%',
                                            width: '40px',
                                            height: '40px',
                                            cursor: 'pointer',
                                            boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center'
                                        }}
                                        title="Close"
                                    >
                                        <X size={24} color="#374151" />
                                    </button>

                                    {/* Fullscreen Map */}
                                    {(() => {
                                        let positions = [];
                                        const routeGeometry = suggestedRouteData?.routeGeometry;
                                        const originCoords = suggestedRouteData?.originCoords;
                                        const destinationCoords = suggestedRouteData?.destinationCoords;

                                        if (routeGeometry) {
                                            try {
                                                positions = polyline.decode(routeGeometry);
                                            } catch (e) {
                                                console.error("Error decoding polyline", e);
                                            }
                                        } else if (originCoords && destinationCoords) {
                                            positions = [originCoords, destinationCoords];
                                        }

                                        return positions.length > 0 ? (
                                            <MapContainer center={positions[0]} zoom={7} scrollWheelZoom={true} style={{ height: '100%', width: '100%' }}>
                                                <TileLayer
                                                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                                />
                                                <Polyline positions={positions} color="#2563eb" weight={4} />
                                                {originCoords && <Marker position={originCoords}></Marker>}
                                                {destinationCoords && <Marker position={destinationCoords}></Marker>}
                                            </MapContainer>
                                        ) : (
                                            <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                <Map size={64} color="#cbd5e1" />
                                                <span style={{ marginLeft: '1rem', color: '#94a3b8' }}>No map data available</span>
                                            </div>
                                        );
                                    })()}
                                </div>
                            </div>
                        )}
                        {/* Tabs */}
                        <div style={{ display: 'flex', background: '#f8fafc', borderRadius: '8px', padding: '0.25rem', marginBottom: '2rem' }}>
                            <button style={{ flex: 1, padding: '0.5rem', borderRadius: '6px', background: 'white', boxShadow: '0 1px 2px rgba(0,0,0,0.05)', fontWeight: '600', fontSize: '0.9rem' }}>Optimal Route</button>
                        </div>

                        {/* Stats List */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
                            <StatBar icon={<Map size={20} />} label="Distance" value={suggestedRouteData?.distance || "2122 km"} />
                            <StatBar icon={<Clock size={20} />} label="ETA" value={suggestedRouteData?.duration || "32 hours"} />
                            <StatBar icon={<Truck size={20} />} label="Total Cost" value={
                                suggestedRouteData?.fuelCost ||
                                (suggestedRouteData?.costBreakdown?.totalCost || suggestedRouteData?.costBreakdown?.TotalCost
                                    ? `₹${(suggestedRouteData.costBreakdown.totalCost || suggestedRouteData.costBreakdown.TotalCost).toLocaleString()}`
                                    : "₹50432")
                            } />
                            <StatBar icon={<User size={20} />} label="Driver Exp." value={suggestedRouteData?.driverExperience || "Mountain Terrain Specialist"} />
                            <StatBar icon={<Truck size={20} />} label="Vehicle Type" value={suggestedRouteData?.vehicleType || "Heavy Duty Truck"} />
                        </div>

                        {/* Cost Breakdown */}
                        {suggestedRouteData?.costBreakdown && (
                            <div style={{
                                padding: '1.5rem',
                                background: '#f8fafc',
                                borderRadius: '12px',
                                marginBottom: '2rem',
                                border: '1px solid var(--border)'
                            }}>
                                <h3 style={{ fontSize: '0.9rem', fontWeight: '600', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <Truck size={18} /> Cost Breakdown
                                </h3>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '0.6rem', fontSize: '0.9rem' }}>
                                    <div style={{ color: 'var(--text-muted)' }}>Fuel ({suggestedRouteData.costBreakdown.fuelLiters || suggestedRouteData.costBreakdown.FuelLiters || 0}L)</div>
                                    <div style={{ textAlign: 'right', fontWeight: '500' }}>₹{(suggestedRouteData.costBreakdown.fuelCost || suggestedRouteData.costBreakdown.FuelCost || 0).toLocaleString()}</div>

                                    <div style={{ color: 'var(--text-muted)' }}>Driver Wages</div>
                                    <div style={{ textAlign: 'right', fontWeight: '500' }}>₹{(suggestedRouteData.costBreakdown.driverCost || suggestedRouteData.costBreakdown.DriverCost || 0).toLocaleString()}</div>

                                    <div style={{ color: 'var(--text-muted)' }}>Toll Charges</div>
                                    <div style={{ textAlign: 'right', fontWeight: '500' }}>₹{(suggestedRouteData.costBreakdown.tollCost || suggestedRouteData.costBreakdown.TollCost || 0).toLocaleString()}</div>

                                    <div style={{ color: 'var(--text-muted)' }}>Maintenance</div>
                                    <div style={{ textAlign: 'right', fontWeight: '500' }}>₹{(suggestedRouteData.costBreakdown.maintenanceCost || suggestedRouteData.costBreakdown.MaintenanceCost || 0).toLocaleString()}</div>

                                    <div style={{ color: 'var(--text-muted)' }}>Insurance</div>
                                    <div style={{ textAlign: 'right', fontWeight: '500' }}>₹{(suggestedRouteData.costBreakdown.insuranceCost || suggestedRouteData.costBreakdown.InsuranceCost || 0).toLocaleString()}</div>

                                    <div style={{ color: 'var(--text-muted)' }}>Overhead</div>
                                    <div style={{ textAlign: 'right', fontWeight: '500' }}>₹{(suggestedRouteData.costBreakdown.overheadCost || suggestedRouteData.costBreakdown.OverheadCost || 0).toLocaleString()}</div>
                                </div>
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    marginTop: '1rem',
                                    paddingTop: '1rem',
                                    borderTop: '1px solid #e2e8f0',
                                    fontWeight: '600',
                                    fontSize: '1rem'
                                }}>
                                    <span>Total</span>
                                    <span style={{ color: '#10b981' }}>₹{(suggestedRouteData.costBreakdown.totalCost || suggestedRouteData.costBreakdown.TotalCost || 0).toLocaleString()}</span>
                                </div>
                                {(suggestedRouteData.costBreakdown.chargeableWeightKg || suggestedRouteData.costBreakdown.ChargeableWeightKg) > 0 && (
                                    <div style={{ marginTop: '0.75rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                                        Chargeable Weight: {(suggestedRouteData.costBreakdown.chargeableWeightKg || suggestedRouteData.costBreakdown.ChargeableWeightKg || 0).toLocaleString()} kg | Terrain: {suggestedRouteData.costBreakdown.terrainType || suggestedRouteData.costBreakdown.TerrainType || 'N/A'}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Waypoints */}
                        <div style={{ marginBottom: '2rem', borderTop: '1px solid var(--border)', paddingTop: '1.5rem' }}>
                            <h3 style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1rem' }}>Route Waypoints</h3>

                            <div style={{ position: 'relative', paddingLeft: '2rem' }}>
                                {/* Line */}
                                <div style={{ position: 'absolute', top: '10px', bottom: '10px', left: '9px', width: '2px', borderLeft: '2px dashed #cbd5e1' }}></div>

                                <div style={{ marginBottom: '1.5rem', position: 'relative' }}>
                                    <div style={{ width: '20px', height: '20px', background: 'var(--text-main)', borderRadius: '50%', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', position: 'absolute', left: '-32px', top: '0' }}>A</div>
                                    <h4 style={{ fontSize: '0.9rem', fontWeight: '600' }}>Pickup Point</h4>
                                    <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>{jobData?.pickupLocation || 'Not specified'}</p>
                                </div>

                                <div style={{ position: 'relative' }}>
                                    <div style={{ width: '20px', height: '20px', background: '#94a3b8', borderRadius: '50%', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', position: 'absolute', left: '-32px', top: '0' }}>B</div>
                                    <h4 style={{ fontSize: '0.9rem', fontWeight: '600' }}>Delivery Point</h4>
                                    <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>{jobData?.deliveryLocation || 'Not specified'}</p>
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={handleAccept}
                            className="btn btn-primary"
                            style={{ width: '100%', padding: '1rem' }}
                        >
                            Accept
                        </button>
                    </div>

                </div>

                {/* Fullscreen Map Modal */}
                {showMapFullscreen && suggestedRouteData && (
                    <div style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        zIndex: 9999,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '2rem'
                    }}>
                        <div style={{
                            width: '100%',
                            height: '100%',
                            maxWidth: '1400px',
                            maxHeight: '900px',
                            background: 'white',
                            borderRadius: '12px',
                            overflow: 'hidden',
                            position: 'relative'
                        }}>
                            {/* Close Button */}
                            <button
                                onClick={() => setShowMapFullscreen(false)}
                                style={{
                                    position: 'absolute',
                                    top: '15px',
                                    right: '15px',
                                    zIndex: 10000,
                                    background: 'white',
                                    border: 'none',
                                    borderRadius: '50%',
                                    width: '40px',
                                    height: '40px',
                                    cursor: 'pointer',
                                    boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}
                                title="Close"
                            >
                                <X size={24} color="#374151" />
                            </button>

                            {/* Fullscreen Map */}
                            {(() => {
                                let positions = [];
                                const routeGeometry = suggestedRouteData?.routeGeometry;
                                const originCoords = suggestedRouteData?.originCoords;
                                const destinationCoords = suggestedRouteData?.destinationCoords;

                                if (routeGeometry) {
                                    try {
                                        positions = polyline.decode(routeGeometry);
                                    } catch (e) {
                                        console.error("Error decoding polyline", e);
                                    }
                                } else if (originCoords && destinationCoords) {
                                    positions = [originCoords, destinationCoords];
                                }

                                return positions.length > 0 ? (
                                    <MapContainer center={positions[0]} zoom={7} scrollWheelZoom={true} style={{ height: '100%', width: '100%' }}>
                                        <TileLayer
                                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                        />
                                        <Polyline positions={positions} color="#2563eb" weight={4} />
                                        {originCoords && <Marker position={originCoords}></Marker>}
                                        {destinationCoords && <Marker position={destinationCoords}></Marker>}
                                    </MapContainer>
                                ) : (
                                    <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <Map size={64} color="#cbd5e1" />
                                        <span style={{ marginLeft: '1rem', color: '#94a3b8' }}>No map data available</span>
                                    </div>
                                );
                            })()}
                        </div>
                    </div>
                )}
            </main>

            {/* Toast Notification */}
            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={hideToast}
                />
            )}
        </div>
    );
};

const StatBar = ({ icon, label, value }) => (
    <div style={{ display: 'flex', alignItems: 'center', padding: '1rem', background: '#f8fafc', borderRadius: '8px' }}>
        <div style={{ margin: '0 1rem', color: 'var(--text-muted)' }}>{icon}</div>
        <div style={{ flex: 1 }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>{label}</div>
            <div style={{ fontWeight: '600' }}>{value}</div>
        </div>
    </div>
);

export default RouteSummary;
