import React, { useEffect } from 'react';
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react';

const Toast = ({ message, type = 'info', onClose, duration = 3000 }) => {
    useEffect(() => {
        if (duration > 0) {
            const timer = setTimeout(() => {
                onClose();
            }, duration);
            return () => clearTimeout(timer);
        }
    }, [duration, onClose]);

    const styles = {
        success: {
            bg: '#10b981',
            icon: CheckCircle,
            text: 'white'
        },
        error: {
            bg: '#ef4444',
            icon: XCircle,
            text: 'white'
        },
        warning: {
            bg: '#f59e0b',
            icon: AlertCircle,
            text: 'white'
        },
        info: {
            bg: '#3b82f6',
            icon: Info,
            text: 'white'
        }
    };

    const config = styles[type] || styles.info;
    const Icon = config.icon;

    return (
        <div style={{
            position: 'fixed',
            top: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 9999,
            minWidth: '320px',
            maxWidth: '500px',
            animation: 'slideDown 0.3s ease-out'
        }}>
            <div style={{
                background: config.bg,
                color: config.text,
                padding: '1rem 1.25rem',
                borderRadius: '8px',
                boxShadow: '0 10px 40px rgba(0,0,0,0.3)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem'
            }}>
                <Icon size={20} />
                <div style={{ flex: 1, fontSize: '0.95rem', fontWeight: '500' }}>
                    {message}
                </div>
                <button
                    onClick={onClose}
                    style={{
                        background: 'transparent',
                        border: 'none',
                        color: config.text,
                        cursor: 'pointer',
                        padding: '0.25rem',
                        display: 'flex',
                        alignItems: 'center',
                        opacity: 0.8
                    }}
                    onMouseEnter={(e) => e.target.style.opacity = '1'}
                    onMouseLeave={(e) => e.target.style.opacity = '0.8'}
                >
                    <X size={18} />
                </button>
            </div>
        </div>
    );
};

export default Toast;
