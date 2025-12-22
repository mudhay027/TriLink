import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Polyline, Marker, Popup, useMap } from 'react-leaflet';
import polyline from '@mapbox/polyline';
import { X, MapPin, Truck, Clock, User as UserIcon, IndianRupee } from 'lucide-react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Error Boundary for Map
class MapErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        console.error("Map Error:", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '400px', background: '#f8fafc', borderRadius: '8px', color: '#ef4444' }}>
                    <p>Unable to load map visualization.</p>
                </div>
            );
        }
        return this.props.children;
    }
}

const RouteViewModal = ({ jobId, onClose }) => {
    const [routeData, setRouteData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Fix for default marker icons
        delete L.Icon.Default.prototype._getIconUrl;
        L.Icon.Default.mergeOptions({
            iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
            iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
            shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
        });

        fetchRouteData();
    }, [jobId]);

    const fetchRouteData = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:5081/api/JobHistory/${jobId}/route`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.ok) {
                const data = await response.json();
                setRouteData(data);
            } else {
                setError('Failed to load route data');
            }
        } catch (err) {
            console.error('Error fetching route:', err);
            setError('Error loading route data');
        } finally {
            setLoading(false);
        }
    };

    if (!jobId) return null;

    const renderMap = () => {
        if (loading) {
            return (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '400px', color: 'var(--text-muted)' }}>
                    Loading route...
                </div>
            );
        }

        if (error || !routeData) {
            return (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '400px', color: 'var(--text-muted)' }}>
                    {error || 'No route data available'}
                </div>
            );
        }

        try {
            let positions = [];
            let center = [20.5937, 78.9629]; // Default center (India)
            let zoom = 5;

            // Safe parsing helper
            const safeParseCoords = (jsonStr) => {
                if (!jsonStr) return null;
                try {
                    const parsed = JSON.parse(jsonStr);
                    if (parsed && typeof parsed.lat === 'number' && typeof parsed.lng === 'number') {
                        return [parsed.lat, parsed.lng];
                    }
                } catch (e) {
                    console.warn('Failed to parse coords:', e);
                }
                return null;
            };

            const originCoords = safeParseCoords(routeData.originCoords);
            const destCoords = safeParseCoords(routeData.destinationCoords);

            // Decode polyline if available
            if (routeData.routePolyline) {
                try {
                    const decoded = polyline.decode(routeData.routePolyline);
                    if (decoded && decoded.length > 0) {
                        positions = decoded;
                        // Calculate center
                        const lats = positions.map(p => p[0]);
                        const lngs = positions.map(p => p[1]);
                        const centerLat = (Math.min(...lats) + Math.max(...lats)) / 2;
                        const centerLng = (Math.min(...lngs) + Math.max(...lngs)) / 2;

                        if (!isNaN(centerLat) && !isNaN(centerLng)) {
                            center = [centerLat, centerLng];
                            zoom = 7;
                        }
                    }
                } catch (e) {
                    console.error("Polyline decode error:", e);
                }
            }

            // Fallback to straight line if polyline failed but coords exist
            if (positions.length === 0 && originCoords && destCoords) {
                positions = [originCoords, destCoords];
                const centerLat = (originCoords[0] + destCoords[0]) / 2;
                const centerLng = (originCoords[1] + destCoords[1]) / 2;
                center = [centerLat, centerLng];
                zoom = 6;
            }

            // Custom icons
            const greenIcon = new L.Icon({
                iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
                shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
                iconSize: [25, 41],
                iconAnchor: [12, 41],
                popupAnchor: [1, -34],
                shadowSize: [41, 41]
            });

            const redIcon = new L.Icon({
                iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
                shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
                iconSize: [25, 41],
                iconAnchor: [12, 41],
                popupAnchor: [1, -34],
                shadowSize: [41, 41]
            });

            // Fit bounds component
            const MapUpdater = ({ positions, origin, destination }) => {
                const map = useMap();
                useEffect(() => {
                    try {
                        let bounds = null;
                        if (positions && positions.length > 0) {
                            bounds = L.latLngBounds(positions);
                        } else if (origin && destination) {
                            bounds = L.latLngBounds([origin, destination]);
                        }

                        if (bounds) {
                            map.fitBounds(bounds, { padding: [50, 50] });
                        }
                    } catch (e) {
                        console.warn('Failed to fit bounds:', e);
                    }
                }, [positions, origin, destination, map]);
                return null;
            };

            return (
                <MapErrorBoundary>
                    <MapContainer center={center} zoom={zoom} style={{ height: '400px', width: '100%', borderRadius: '8px' }}>
                        <MapUpdater positions={positions} origin={originCoords} destination={destCoords} />
                        <TileLayer
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        />
                        {positions.length > 0 && <Polyline positions={positions} color="#3b82f6" weight={4} opacity={0.7} />}
                        {originCoords && (
                            <Marker position={originCoords} icon={greenIcon}>
                                <Popup><strong>Pickup</strong><br />{routeData.pickupCity || 'Origin'}</Popup>
                            </Marker>
                        )}
                        {destCoords && (
                            <Marker position={destCoords} icon={redIcon}>
                                <Popup><strong>Drop</strong><br />{routeData.dropCity || 'Destination'}</Popup>
                            </Marker>
                        )}
                    </MapContainer>
                </MapErrorBoundary>
            );
        } catch (err) {
            console.error('Error in renderMap preparation:', err);
            return <div>Error loading map details.</div>;
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose} style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000,
            backdropFilter: 'blur(4px)'
        }}>
            <div className="modal-content fade-in" onClick={e => e.stopPropagation()} style={{
                background: 'white', borderRadius: '16px', padding: '2rem', width: '90%', maxWidth: '1000px',
                maxHeight: '90vh', overflowY: 'auto', position: 'relative', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)'
            }}>
                <button onClick={onClose} style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'none', border: 'none', cursor: 'pointer' }}>
                    <X size={24} color="#64748b" />
                </button>

                <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#1e293b', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <MapPin size={28} color="#3b82f6" />
                    Route Details
                </h2>
                {routeData && (
                    <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '2rem' }}>
                        Job #{routeData.jobReferenceId}
                    </div>
                )}

                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
                    {/* Map */}
                    <div>
                        {renderMap()}
                    </div>

                    {/* Route Details Sidebar */}
                    {routeData && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            <div style={{ background: '#f8fafc', padding: '1.25rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                                <h3 style={{ fontSize: '0.9rem', fontWeight: '600', marginBottom: '1rem', color: '#334155', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                    Route Information
                                </h3>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                    <div>
                                        <div style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '0.25rem' }}>Distance</div>
                                        <div style={{ fontWeight: '600', color: '#1e293b' }}>{routeData.plannedDistance || 'N/A'}</div>
                                    </div>
                                    <div>
                                        <div style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '0.25rem' }}>Duration</div>
                                        <div style={{ fontWeight: '600', color: '#1e293b' }}>{routeData.plannedDuration || 'N/A'}</div>
                                    </div>
                                    <div>
                                        <div style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '0.25rem' }}>Vehicle Type</div>
                                        <div style={{ fontWeight: '600', color: '#1e293b', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            <Truck size={16} color="#3b82f6" />
                                            {routeData.vehicleType || 'N/A'}
                                        </div>
                                    </div>
                                    <div>
                                        <div style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '0.25rem' }}>Total Price</div>
                                        <div style={{ fontWeight: '600', color: '#16a34a', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                            <IndianRupee size={16} />
                                            {routeData.totalPrice !== 'N/A' ? routeData.totalPrice : 'N/A'}
                                        </div>
                                    </div>
                                    <div>
                                        <div style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '0.25rem' }}>Driver Experience</div>
                                        <div style={{ fontWeight: '600', color: '#1e293b', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            <UserIcon size={16} color="#3b82f6" />
                                            {routeData.driverExperience || 'N/A'}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div style={{ background: '#f0f9ff', padding: '1.25rem', borderRadius: '12px', border: '1px solid #bae6fd' }}>
                                <h3 style={{ fontSize: '0.9rem', fontWeight: '600', marginBottom: '1rem', color: '#334155', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                    Route
                                </h3>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                                        <MapPin size={18} color="#22c55e" style={{ flexShrink: 0, marginTop: '2px' }} />
                                        <div>
                                            <div style={{ fontSize: '0.75rem', color: '#64748b' }}>PICKUP</div>
                                            <div style={{ fontWeight: '600', fontSize: '0.9rem' }}>{routeData.pickupCity}, {routeData.pickupState}</div>
                                        </div>
                                    </div>
                                    <div style={{ borderLeft: '2px dashed #cbd5e1', height: '20px', marginLeft: '8px' }}></div>
                                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                                        <MapPin size={18} color="#ef4444" style={{ flexShrink: 0, marginTop: '2px' }} />
                                        <div>
                                            <div style={{ fontSize: '0.75rem', color: '#64748b' }}>DROP</div>
                                            <div style={{ fontWeight: '600', fontSize: '0.9rem' }}>{routeData.dropCity}, {routeData.dropState}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'flex-end' }}>
                    <button onClick={onClose} className="btn btn-primary" style={{ padding: '0.75rem 2rem' }}>Close</button>
                </div>
            </div>
        </div>
    );
};

export default RouteViewModal;
