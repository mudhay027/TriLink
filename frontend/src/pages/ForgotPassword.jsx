import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../index.css';

const ForgotPassword = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: New Password, 4: Success
    const [formData, setFormData] = useState({
        email: '',
        otp: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [otpSent, setOtpSent] = useState(false);
    const [otpVerified, setOtpVerified] = useState(false);
    const [countdown, setCountdown] = useState(0);
    const [canResendOtp, setCanResendOtp] = useState(false);
    const [validationErrors, setValidationErrors] = useState({});

    // Countdown timer
    useEffect(() => {
        let timer;
        if (countdown > 0) {
            timer = setTimeout(() => setCountdown(countdown - 1), 1000);
        } else if (countdown === 0 && otpSent && !otpVerified) {
            setCanResendOtp(true);
        }
        return () => clearTimeout(timer);
    }, [countdown, otpSent, otpVerified]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        if (validationErrors[name]) {
            setValidationErrors({ ...validationErrors, [name]: '' });
        }
        setError('');
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const handleSendOtp = async () => {
        if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email)) {
            setValidationErrors({ email: 'Please enter a valid email address' });
            return;
        }

        setLoading(true);
        setError('');

        try {
            const response = await fetch('/api/auth/forgot-password-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: formData.email })
            });

            const data = await response.json();

            if (response.ok && data.success) {
                setOtpSent(true);
                setCountdown(600); // 10 minutes
                setCanResendOtp(false);
                setStep(2);
            } else {
                setError(data.message || 'Failed to send OTP');
            }
        } catch (err) {
            setError('Failed to send OTP. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOtp = async () => {
        if (!formData.otp || formData.otp.length !== 6) {
            setValidationErrors({ otp: 'Please enter a valid 6-digit OTP' });
            return;
        }

        setLoading(true);
        setError('');

        try {
            const response = await fetch('/api/auth/verify-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: formData.email, otp: formData.otp })
            });

            const data = await response.json();

            if (response.ok && data.success) {
                setOtpVerified(true);
                setStep(3);
            } else {
                setError(data.message || 'Invalid OTP. Please try again.');
            }
        } catch (err) {
            setError('Failed to verify OTP. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const validatePassword = () => {
        const errors = {};

        if (!formData.newPassword) {
            errors.newPassword = 'Password is required';
        } else if (formData.newPassword.length < 6) {
            errors.newPassword = 'Password must be at least 6 characters';
        } else if (!/(?=.*[a-z])/.test(formData.newPassword)) {
            errors.newPassword = 'Password must contain lowercase letter';
        } else if (!/(?=.*[A-Z])/.test(formData.newPassword)) {
            errors.newPassword = 'Password must contain uppercase letter';
        } else if (!/(?=.*\d)/.test(formData.newPassword)) {
            errors.newPassword = 'Password must contain a number';
        } else if (!/(?=.*[@$!%*?&])/.test(formData.newPassword)) {
            errors.newPassword = 'Password must contain special character (@$!%*?&)';
        }

        if (!formData.confirmPassword) {
            errors.confirmPassword = 'Please confirm your password';
        } else if (formData.newPassword !== formData.confirmPassword) {
            errors.confirmPassword = 'Passwords do not match';
        }

        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleResetPassword = async () => {
        if (!validatePassword()) return;

        setLoading(true);
        setError('');

        try {
            const response = await fetch('/api/auth/reset-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: formData.email,
                    otp: formData.otp,
                    newPassword: formData.newPassword
                })
            });

            const data = await response.json();

            if (response.ok && data.success) {
                setStep(4); // Success
            } else {
                setError(data.message || 'Failed to reset password');
            }
        } catch (err) {
            setError('Failed to reset password. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fade-in" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            {/* Header */}
            <header style={{ padding: '1.5rem 3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--surface)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '700', fontSize: '1.25rem', cursor: 'pointer' }} onClick={() => navigate('/')}>
                    <img src="/TriLinkIcon.png" alt="TriLink" style={{ height: '36px' }} />
                    <span>TriLink</span>
                </div>
            </header>

            {/* Main Content */}
            <main style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
                <div className="container" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center', maxWidth: '1100px' }}>

                    {/* Left Side: Static Info */}
                    <div style={{ background: '#f1f5f9', padding: '4rem', borderRadius: '24px', height: '100%', minHeight: '500px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                        <h1 style={{ fontSize: '2.5rem', fontWeight: '700', marginBottom: '1.5rem', lineHeight: '1.2' }}>
                            Reset your password
                        </h1>
                        <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', marginBottom: '2.5rem', lineHeight: '1.6' }}>
                            We'll send you a verification code to reset your password securely.
                        </p>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-main)', fontWeight: '500' }}>
                                <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: 'var(--text-main)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                        <polyline points="20 6 9 17 4 12"></polyline>
                                    </svg>
                                </div>
                                Secure & Reliable
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-main)', fontWeight: '500' }}>
                                <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: 'var(--text-main)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                        <polyline points="20 6 9 17 4 12"></polyline>
                                    </svg>
                                </div>
                                Real-time Updates
                            </div>
                        </div>
                    </div>

                    {/* Right Side: Form */}
                    <div style={{ padding: '2rem' }}>
                        {/* Step 1: Email */}
                        {step === 1 && (
                            <>
                                <h2 style={{ fontSize: '2rem', fontWeight: '600', marginBottom: '0.5rem' }}>Forgot Password?</h2>
                                <p style={{ color: 'var(--text-muted)', marginBottom: '2.5rem', fontSize: '0.95rem' }}>
                                    Enter your registered email address
                                </p>

                                <div className="input-group">
                                    <label className="input-label">Email Address</label>
                                    <input
                                        type="email"
                                        name="email"
                                        placeholder="Enter your registered email"
                                        className={`input-field ${validationErrors.email ? 'error' : ''}`}
                                        value={formData.email}
                                        onChange={handleChange}
                                    />
                                    {validationErrors.email && <p style={{ color: 'red', fontSize: '0.8rem', marginTop: '0.25rem' }}>{validationErrors.email}</p>}
                                </div>

                                <button
                                    onClick={handleSendOtp}
                                    className="btn btn-primary"
                                    style={{ width: '100%', padding: '1rem', marginTop: '1.5rem' }}
                                    disabled={loading}
                                >
                                    {loading ? 'Sending...' : 'Send OTP'}
                                </button>
                                {error && <p style={{ color: 'red', textAlign: 'center', marginTop: '1rem' }}>{error}</p>}

                                <p style={{ textAlign: 'center', marginTop: '2rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                                    Remember your password? <span onClick={() => navigate('/login')} style={{ color: 'var(--text-main)', fontWeight: '600', cursor: 'pointer' }}>Login</span>
                                </p>
                            </>
                        )}

                        {/* Step 2: OTP Verification */}
                        {step === 2 && (
                            <>
                                <h2 style={{ fontSize: '2rem', fontWeight: '600', marginBottom: '0.5rem' }}>Enter OTP</h2>
                                <p style={{ color: 'var(--text-muted)', marginBottom: '2.5rem', fontSize: '0.95rem' }}>
                                    We sent a 6-digit code to <strong>{formData.email}</strong>
                                </p>

                                <div className="input-group">
                                    <label className="input-label">Verification Code</label>
                                    <input
                                        type="text"
                                        name="otp"
                                        placeholder="Enter 6-digit OTP"
                                        className={`input-field ${validationErrors.otp ? 'error' : ''}`}
                                        value={formData.otp}
                                        onChange={(e) => {
                                            if (/^\d{0,6}$/.test(e.target.value)) {
                                                handleChange(e);
                                            }
                                        }}
                                        maxLength={6}
                                    />
                                    {validationErrors.otp && <p style={{ color: 'red', fontSize: '0.8rem', marginTop: '0.25rem' }}>{validationErrors.otp}</p>}
                                </div>

                                {countdown > 0 && (
                                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
                                        Time remaining: <strong>{formatTime(countdown)}</strong>
                                    </p>
                                )}

                                {canResendOtp && (
                                    <p style={{ fontSize: '0.85rem', color: 'var(--text-main)', marginTop: '0.5rem', cursor: 'pointer', fontWeight: '600' }} onClick={handleSendOtp}>
                                        Resend OTP
                                    </p>
                                )}

                                <button
                                    onClick={handleVerifyOtp}
                                    className="btn btn-primary"
                                    style={{ width: '100%', padding: '1rem', marginTop: '1.5rem' }}
                                    disabled={loading}
                                >
                                    {loading ? 'Verifying...' : 'Verify OTP'}
                                </button>
                                {error && <p style={{ color: 'red', textAlign: 'center', marginTop: '1rem' }}>{error}</p>}
                            </>
                        )}

                        {/* Step 3: New Password */}
                        {step === 3 && (
                            <>
                                <h2 style={{ fontSize: '2rem', fontWeight: '600', marginBottom: '0.5rem' }}>Create New Password</h2>
                                <p style={{ color: 'var(--text-muted)', marginBottom: '2.5rem', fontSize: '0.95rem' }}>
                                    Enter a strong password for your account
                                </p>

                                <div className="input-group">
                                    <label className="input-label">New Password</label>
                                    <input
                                        type="password"
                                        name="newPassword"
                                        placeholder="Create a password"
                                        className={`input-field ${validationErrors.newPassword ? 'error' : ''}`}
                                        value={formData.newPassword}
                                        onChange={handleChange}
                                    />
                                    {validationErrors.newPassword && <p style={{ color: 'red', fontSize: '0.8rem', marginTop: '0.25rem' }}>{validationErrors.newPassword}</p>}
                                    {!validationErrors.newPassword && (
                                        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                                            Must be at least 6 characters with 1 uppercase, 1 lowercase, 1 number, and 1 special character
                                        </p>
                                    )}
                                </div>

                                <div className="input-group">
                                    <label className="input-label">Confirm Password</label>
                                    <input
                                        type="password"
                                        name="confirmPassword"
                                        placeholder="Confirm your password"
                                        className={`input-field ${validationErrors.confirmPassword ? 'error' : ''}`}
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                    />
                                    {validationErrors.confirmPassword && <p style={{ color: 'red', fontSize: '0.8rem', marginTop: '0.25rem' }}>{validationErrors.confirmPassword}</p>}
                                </div>

                                <button
                                    onClick={handleResetPassword}
                                    className="btn btn-primary"
                                    style={{ width: '100%', padding: '1rem', marginTop: '1.5rem' }}
                                    disabled={loading}
                                >
                                    {loading ? 'Resetting...' : 'Reset Password'}
                                </button>
                                {error && <p style={{ color: 'red', textAlign: 'center', marginTop: '1rem' }}>{error}</p>}
                            </>
                        )}

                        {/* Step 4: Success */}
                        {step === 4 && (
                            <>
                                <div style={{ textAlign: 'center' }}>
                                    <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
                                        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                            <polyline points="20 6 9 17 4 12"></polyline>
                                        </svg>
                                    </div>
                                    <h2 style={{ fontSize: '2rem', fontWeight: '600', marginBottom: '0.5rem' }}>Password Reset Successfully!</h2>
                                    <p style={{ color: 'var(--text-muted)', marginBottom: '2.5rem', fontSize: '0.95rem' }}>
                                        Your password has been updated. You can now login with your new password.
                                    </p>

                                    <button
                                        onClick={() => navigate('/login')}
                                        className="btn btn-primary"
                                        style={{ width: '100%', padding: '1rem' }}
                                    >
                                        Go to Login
                                    </button>
                                </div>
                            </>
                        )}
                    </div>

                </div>
            </main>
        </div>
    );
};

export default ForgotPassword;
