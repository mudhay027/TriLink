import React from 'react';
import { AlertCircle } from 'lucide-react';

const ConfirmModal = ({
    isOpen,
    onClose,
    onConfirm,
    title = 'Confirm Action',
    message = 'Are you sure you want to proceed?',
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    confirmColor = '#ef4444'
}) => {
    if (!isOpen) return null;

    return (
        <div
            onClick={onClose}
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'rgba(0,0,0,0.4)',
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'center',
                paddingTop: '15vh',
                zIndex: 9999
            }}
        >
            <div
                onClick={(e) => e.stopPropagation()}
                style={{
                    background: 'white',
                    padding: '1.75rem',
                    borderRadius: '12px',
                    width: '420px',
                    maxWidth: '90%',
                    boxShadow: '0 10px 40px rgba(0,0,0,0.25)',
                    animation: 'slideDown 0.2s ease-out'
                }}
            >
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', marginBottom: '1rem' }}>
                    <div style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        background: '#fee2e2',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                    }}>
                        <AlertCircle size={22} color="#ef4444" />
                    </div>
                    <div style={{ flex: 1 }}>
                        <h3 style={{
                            fontSize: '1.15rem',
                            fontWeight: '600',
                            marginBottom: '0.5rem',
                            color: '#1f2937'
                        }}>
                            {title}
                        </h3>
                        <p style={{
                            color: '#6b7280',
                            fontSize: '0.95rem',
                            lineHeight: '1.5',
                            margin: 0
                        }}>
                            {message}
                        </p>
                    </div>
                </div>

                <div style={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                    gap: '0.75rem',
                    marginTop: '1.5rem'
                }}>
                    <button
                        onClick={onClose}
                        style={{
                            padding: '0.65rem 1.5rem',
                            fontSize: '0.9rem',
                            fontWeight: '500',
                            border: '1px solid #d1d5db',
                            background: 'white',
                            color: '#374151',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            transition: 'all 0.15s'
                        }}
                        onMouseEnter={(e) => {
                            e.target.style.background = '#f3f4f6';
                            e.target.style.borderColor = '#9ca3af';
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.background = 'white';
                            e.target.style.borderColor = '#d1d5db';
                        }}
                    >
                        {cancelText}
                    </button>
                    <button
                        onClick={() => {
                            onConfirm();
                            onClose();
                        }}
                        style={{
                            padding: '0.65rem 1.5rem',
                            fontSize: '0.9rem',
                            fontWeight: '500',
                            border: 'none',
                            background: confirmColor,
                            color: 'white',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            transition: 'all 0.15s'
                        }}
                        onMouseEnter={(e) => {
                            e.target.style.opacity = '0.9';
                            e.target.style.transform = 'translateY(-1px)';
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.opacity = '1';
                            e.target.style.transform = 'translateY(0)';
                        }}
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmModal;
