import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { api } from '../api/api';
import { Check, ShoppingCart, Factory, Truck, ChevronRight, UploadCloud, FileText, Edit2 } from 'lucide-react';
import '../index.css';

const Registration = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const role = location.state?.role || 'buyer'; // Default to buyer if accessed directly
    const [step, setStep] = useState(1);

    // Form State
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        confirmPassword: '',
        companyName: '',
        gstNumber: '',
        panNumber: '',
        address: '',
        contactPerson: '',
        contactNumber: '',
        documents: {
            gstCertificate: null,
            panCard: null
        }
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [validationErrors, setValidationErrors] = useState({});

    // OTP States
    const [otpSent, setOtpSent] = useState(false);
    const [otpValue, setOtpValue] = useState('');
    const [otpVerified, setOtpVerified] = useState(false);
    const [otpLoading, setOtpLoading] = useState(false);
    const [otpError, setOtpError] = useState('');
    const [countdown, setCountdown] = useState(0);
    const [canResendOtp, setCanResendOtp] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        if (validationErrors[name]) {
            setValidationErrors({ ...validationErrors, [name]: '' });
        }
        setError('');
    };

    const handleFileChange = (docType, file) => {
        setFormData({
            ...formData,
            documents: {
                ...formData.documents,
                [docType]: file
            }
        });
        if (validationErrors[docType]) {
            setValidationErrors({ ...validationErrors, [docType]: '' });
        }
    };

    const validateStep = (currentStep) => {
        const errors = {};
        if (currentStep === 1) {
            if (!formData.fullName.trim()) errors.fullName = 'Full name is required';
            if (!formData.email.trim()) {
                errors.email = 'Email is required';
            } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
                errors.email = 'Invalid email format';
            }
            if (!formData.password) {
                errors.password = 'Password is required';
            } else if (formData.password.length < 6) {
                errors.password = 'Password must be at least 6 characters';
            } else if (!/(?=.*[a-z])/.test(formData.password)) {
                errors.password = 'Password must contain at least one lowercase letter';
            } else if (!/(?=.*[A-Z])/.test(formData.password)) {
                errors.password = 'Password must contain at least one uppercase letter';
            } else if (!/(?=.*\d)/.test(formData.password)) {
                errors.password = 'Password must contain at least one number';
            } else if (!/(?=.*[@$!%*?&#])/.test(formData.password)) {
                errors.password = 'Password must contain at least one special character (@$!%*?&#)';
            }
            if (formData.password !== formData.confirmPassword) {
                errors.confirmPassword = 'Passwords do not match';
            }
        } else if (currentStep === 2) {
            if (!formData.companyName.trim()) errors.companyName = 'Company name is required';
            if (!formData.gstNumber.trim()) {
                errors.gstNumber = 'GST number is required';
            } else if (!/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(formData.gstNumber)) {
                errors.gstNumber = 'Invalid GST format (e.g. 22AAAAA0000A1Z5)';
            }
            if (!formData.panNumber.trim()) {
                errors.panNumber = 'PAN number is required';
            } else if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(formData.panNumber)) {
                errors.panNumber = 'Invalid PAN format (e.g. ABCDE1234F)';
            }
            if (!formData.address.trim()) errors.address = 'Business address is required';
            if (!formData.contactPerson.trim()) {
                errors.contactPerson = 'Contact person is required';
            } else if (!/^[A-Za-z\s]+$/.test(formData.contactPerson)) {
                errors.contactPerson = 'Contact person name must contain only alphabets';
            }
            if (!formData.contactNumber.trim()) {
                errors.contactNumber = 'Contact number is required';
            } else if (!/^\d{10}$/.test(formData.contactNumber)) {
                errors.contactNumber = 'Contact number must be 10 digits';
            }
        } else if (currentStep === 3) {
            if (!formData.documents.gstCertificate) errors.gstCertificate = 'GST Certificate is required';
            if (!formData.documents.panCard) errors.panCard = 'PAN Card is required';
        }

        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const nextStep = () => {
        // Check OTP verification FIRST before field validation
        if (step === 1 && !otpVerified) {
            setError('⚠️ Please verify your email with OTP before you can register!');
            setValidationErrors({ email: 'Email verification required' });
            // Scroll to top to show error
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return;
        }

        if (!validateStep(step)) return;

        if (step === 4) {
            handleRegister();
        } else {
            setStep(step + 1);
            setError(''); // Clear error when moving to next step
        }
    };
    const prevStep = () => setStep(step - 1);

    // Handle OTP countdown timer
    React.useEffect(() => {
        let timer;
        if (countdown > 0) {
            timer = setTimeout(() => setCountdown(countdown - 1), 1000);
        } else if (countdown === 0 && otpSent) {
            setCanResendOtp(true);
        }
        return () => clearTimeout(timer);
    }, [countdown, otpSent]);

    const handleSendOtp = async () => {
        if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email)) {
            setOtpError('Please enter a valid email address');
            return;
        }

        setOtpLoading(true);
        setOtpError('');

        try {
            const response = await fetch('/api/auth/send-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: formData.email })
            });

            // Parse JSON response for both success and error cases
            const data = await response.json();

            if (response.ok && data.success) {
                setOtpSent(true);
                setCountdown(600); // 10 minutes
                setCanResendOtp(false);
                setOtpError('');
            } else {
                // Handle error responses (400, 500, etc.)
                if (data.message && data.message.toLowerCase().includes('already registered')) {
                    setOtpError('⚠️ This email is already registered. Please login instead.');
                } else {
                    setOtpError(data.message || 'Failed to send OTP. Please try again.');
                }
            }
        } catch (err) {
            console.error('OTP send error:', err);
            setOtpError('Failed to send OTP. Please check your connection and try again.');
        } finally {
            setOtpLoading(false);
        }
    };

    const handleVerifyOtp = async () => {
        if (!otpValue || otpValue.length !== 6) {
            setOtpError('Please enter a valid 6-digit OTP');
            return;
        }

        setOtpLoading(true);
        setOtpError('');

        try {
            const response = await fetch('/api/auth/verify-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: formData.email, otp: otpValue })
            });

            const data = await response.json();

            if (response.ok && data.success) {
                setOtpVerified(true);
                setOtpError('');
            } else {
                setOtpError(data.message || 'Invalid OTP. Please try again.');
            }
        } catch (err) {
            setOtpError('Failed to verify OTP. Please try again.');
        } finally {
            setOtpLoading(false);
        }
    };

    const handleRegister = async () => {
        setLoading(true);
        setError('');
        try {
            const submitData = new FormData();
            submitData.append('email', formData.email);
            submitData.append('username', formData.email); // Map email to username
            submitData.append('password', formData.password);
            submitData.append('role', role);

            // Handle optional company fields
            if (formData.companyName) submitData.append('companyName', formData.companyName);
            if (formData.gstNumber) submitData.append('gstNumber', formData.gstNumber);
            if (formData.panNumber) submitData.append('panNumber', formData.panNumber);
            if (formData.address) submitData.append('address', formData.address); // Changed from addressLine1 to address to match DTO
            if (formData.contactPerson) submitData.append('contactPerson', formData.contactPerson);
            if (formData.contactNumber) submitData.append('contactNumber', formData.contactNumber);

            if (formData.documents.gstCertificate) {
                submitData.append('gstCertificateFile', formData.documents.gstCertificate); // Changed to match DTO property
            }
            if (formData.documents.panCard) {
                submitData.append('panCardFile', formData.documents.panCard); // Changed to match DTO property
            }

            // await api.post('/auth/register', submitData, true);
            const response = await api.post('/auth/register', submitData, true);
            if (response && response.jwtToken) {
                localStorage.setItem('token', response.jwtToken);
                localStorage.setItem('username', response.username);
                localStorage.setItem('role', response.role);
                // Also store userId if backend returns it on registration (need to ensure backend does this or make another call)
                // Assuming backend update for Register is meant to align with Login:
                if (response.userId) {
                    localStorage.setItem('userId', response.userId);
                }
            }
            // Temporarily redirect to simple login or dashboard if ID is missing, but goal is dynamic
            // Ideally we should update Register endpoint to return UserId too.
            // For now, let's keep it simple or assume Login flow is preferred. 
            // Given user code: "setStep(5)" -> completion step, then likely a button to "Go to Dashboard"

            setStep(5);

            // setStep(5); // Move to completion step on success
        } catch (err) {
            console.error('Registration error:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fade-in" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            {/* Header */}
            <header style={{ padding: '1.5rem 3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--surface)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '700', fontSize: '1.25rem', cursor: 'pointer' }} onClick={() => navigate('/')}>
                    <img src="/trilink_logo.jpg" alt="TriLink" style={{ height: '36px' }} />
                    <span>TriLink</span>
                </div>
                <div style={{ display: 'flex', gap: '2rem', alignItems: 'center', fontSize: '0.9rem', fontWeight: '500' }}>
                    <button onClick={() => navigate('/login')} className="btn btn-outline" style={{ padding: '0.5rem 1.25rem', borderRadius: '8px', fontSize: '0.9rem' }}>
                        Login
                    </button>
                </div>
            </header>

            {/* Main Content */}
            <main style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
                <div className="container" style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '4rem', alignItems: 'center', maxWidth: '1200px', width: '100%' }}>

                    {/* Left Side: Static Welcome */}
                    <div style={{ background: '#f1f5f9', padding: '4rem', borderRadius: '24px', height: '100%', minHeight: '600px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                        <h1 style={{ fontSize: '2.5rem', fontWeight: '700', marginBottom: '1.5rem', lineHeight: '1.2' }}>
                            Welcome to TriLink
                        </h1>
                        <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', marginBottom: '2.5rem', lineHeight: '1.6' }}>
                            Streamline your B2B procurement process with our comprehensive platform.
                        </p>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {['Automated vendor management', 'Real-time order tracking', 'Comprehensive analytics'].map((item, index) => (
                                <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-main)', fontWeight: '500' }}>
                                    <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: 'var(--text-main)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                            <polyline points="20 6 9 17 4 12"></polyline>
                                        </svg>
                                    </div>
                                    {item}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right Side: Dynamic Form */}
                    <div style={{ padding: '2rem' }}>
                        {step === 1 && (
                            <Step1Account
                                formData={formData}
                                handleChange={handleChange}
                                onNext={nextStep}
                                navigate={navigate}
                                validationErrors={validationErrors}
                                otpSent={otpSent}
                                otpValue={otpValue}
                                setOtpValue={setOtpValue}
                                otpVerified={otpVerified}
                                otpLoading={otpLoading}
                                otpError={otpError}
                                countdown={countdown}
                                canResendOtp={canResendOtp}
                                onSendOtp={handleSendOtp}
                                onVerifyOtp={handleVerifyOtp}
                                error={error}
                            />
                        )}
                        {step === 2 && (
                            <Step2CompanyDetails
                                formData={formData}
                                handleChange={handleChange}
                                onNext={nextStep}
                                validationErrors={validationErrors}
                            />
                        )}
                        {step === 3 && (
                            <Step3Documents
                                formData={formData}
                                handleFileChange={handleFileChange}
                                onNext={nextStep}
                                onPrev={prevStep}
                                validationErrors={validationErrors}
                            />
                        )}
                        {step === 4 && (
                            <Step4Review
                                formData={formData}
                                onNext={nextStep}
                                onPrev={prevStep}
                                onEditCompanyDetails={() => setStep(2)}
                                error={error}
                                loading={loading}
                            />
                        )}
                        {step === 5 && (
                            <Step5Complete
                                role={role}
                                navigate={navigate}
                            />
                        )}
                    </div>

                </div>
            </main>
        </div>
    );
};

// Shared Progress Indicator
const ProgressIndicator = ({ currentStep }) => {
    const steps = [
        { num: 1, label: 'Company Details' },
        { num: 2, label: 'Document Upload' },
        { num: 3, label: 'Review' }
    ];

    const activeStep = currentStep - 1;

    return (
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '2.5rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            {steps.map((s, index) => (
                <React.Fragment key={s.num}>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        color: activeStep >= s.num ? 'var(--text-main)' : 'var(--text-muted)',
                        fontWeight: activeStep >= s.num ? '600' : '400'
                    }}>
                        <div style={{
                            width: '24px', height: '24px',
                            background: activeStep >= s.num ? 'var(--text-main)' : '#e2e8f0',
                            color: activeStep >= s.num ? 'white' : '#64748b',
                            borderRadius: '50%',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '0.5rem',
                            transition: 'all 0.3s ease'
                        }}>
                            {activeStep > s.num ? <Check size={14} /> : s.num}
                        </div>
                        {s.label}
                    </div>
                    {index < steps.length - 1 && (
                        <div style={{ height: '1px', width: '40px', background: activeStep > s.num ? 'var(--text-main)' : 'var(--border)', margin: '0 1rem', transition: 'all 0.3s ease' }}></div>
                    )}
                </React.Fragment>
            ))}
        </div>
    );
};

// Step 1: Create Account with OTP Verification
const Step1Account = ({
    formData,
    handleChange,
    onNext,
    navigate,
    validationErrors,
    otpSent,
    otpValue,
    setOtpValue,
    otpVerified,
    otpLoading,
    otpError,
    countdown,
    canResendOtp,
    onSendOtp,
    onVerifyOtp,
    error
}) => {
    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className="fade-in">
            <h2 style={{ fontSize: '1.75rem', fontWeight: '600', marginBottom: '2rem' }}>Create your account</h2>

            {/* Error Banner */}
            {error && (
                <div style={{
                    background: '#fee2e2',
                    border: '2px solid #ef4444',
                    borderRadius: '12px',
                    padding: '1rem 1.5rem',
                    marginBottom: '1.5rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem'
                }}>
                    <div style={{ fontSize: '1.5rem' }}>⚠️</div>
                    <p style={{ margin: 0, color: '#991b1b', fontWeight: '600', fontSize: '0.95rem' }}>{error}</p>
                </div>
            )}

            <div className="input-group">
                <label className="input-label">Full Name</label>
                <input
                    type="text"
                    name="fullName"
                    placeholder="Enter your full name"
                    className={`input-field ${validationErrors.fullName ? 'error' : ''}`}
                    value={formData.fullName}
                    onChange={handleChange}
                    disabled={otpVerified}
                />
                {validationErrors.fullName && <p style={{ color: 'red', fontSize: '0.8rem', marginTop: '0.25rem' }}>{validationErrors.fullName}</p>}
            </div>

            <div className="input-group">
                <label className="input-label">Email Address</label>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                    <div style={{ flex: 1 }}>
                        <input
                            type="email"
                            name="email"
                            placeholder="Enter your email"
                            className={`input-field ${validationErrors.email ? 'error' : ''}`}
                            value={formData.email}
                            onChange={handleChange}
                            disabled={otpSent}
                        />
                        {validationErrors.email && <p style={{ color: 'red', fontSize: '0.8rem', marginTop: '0.25rem' }}>{validationErrors.email}</p>}
                        {otpError && !otpSent && <p style={{ color: 'red', fontSize: '0.8rem', marginTop: '0.25rem', fontWeight: '600' }}>{otpError}</p>}
                    </div>
                    {!otpSent && (
                        <button
                            onClick={onSendOtp}
                            className="btn btn-primary"
                            disabled={otpLoading || !formData.email || !/\S+@\S+\.\S+/.test(formData.email)}
                            style={{ padding: '0.75rem 1.5rem', minWidth: '140px', whiteSpace: 'nowrap' }}
                        >
                            {otpLoading ? 'Sending...' : 'Generate OTP'}
                        </button>
                    )}
                    {otpVerified && (
                        <div style={{ padding: '0.75rem 1.5rem', background: '#10b981', color: 'white', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '600' }}>
                            <Check size={20} /> Verified
                        </div>
                    )}
                </div>
            </div>

            {otpSent && !otpVerified && (
                <div className="input-group" style={{ background: '#f0f9ff', padding: '1.5rem', borderRadius: '12px', border: '1px solid #e0f2fe' }}>
                    <label className="input-label">Enter OTP</label>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1rem' }}>
                        We've sent a 6-digit OTP to your email. Please check your inbox.
                    </p>
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                        <div style={{ flex: 1 }}>
                            <input
                                type="text"
                                placeholder="Enter 6-digit OTP"
                                className="input-field"
                                value={otpValue}
                                onChange={(e) => {
                                    const val = e.target.value.replace(/\D/g, '').slice(0, 6);
                                    setOtpValue(val);
                                }}
                                maxLength={6}
                                style={{ letterSpacing: '0.5rem', fontSize: '1.2rem', textAlign: 'center' }}
                            />
                            {otpError && <p style={{ color: 'red', fontSize: '0.8rem', marginTop: '0.25rem' }}>{otpError}</p>}
                        </div>
                        <button
                            onClick={onVerifyOtp}
                            className="btn btn-primary"
                            disabled={otpLoading || otpValue.length !== 6}
                            style={{ padding: '0.75rem 1.5rem', minWidth: '120px' }}
                        >
                            {otpLoading ? 'Verifying...' : 'Verify OTP'}
                        </button>
                    </div>
                    <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <p style={{ fontSize: '0.85rem', color: countdown > 60 ? 'var(--text-main)' : 'red', fontWeight: '600' }}>
                            {countdown > 0 ? `Time remaining: ${formatTime(countdown)}` : 'OTP Expired'}
                        </p>
                        {canResendOtp && (
                            <button
                                onClick={onSendOtp}
                                className="btn btn-outline"
                                disabled={otpLoading}
                                style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}
                            >
                                Resend OTP
                            </button>
                        )}
                    </div>
                </div>
            )}

            <div className="input-group">
                <label className="input-label">Password</label>
                <input
                    type="password"
                    name="password"
                    placeholder="Create a password"
                    className={`input-field ${validationErrors.password ? 'error' : ''}`}
                    value={formData.password}
                    onChange={handleChange}
                    disabled={!otpVerified}
                />
                {validationErrors.password && <p style={{ color: 'red', fontSize: '0.8rem', marginTop: '0.25rem' }}>{validationErrors.password}</p>}
                <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginTop: '0.25rem' }}>
                    Must be at least 6 characters with 1 uppercase, 1 lowercase, 1 number, and 1 special character (@$!%*?&#)
                </p>
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
                    disabled={!otpVerified}
                />
                {validationErrors.confirmPassword && <p style={{ color: 'red', fontSize: '0.8rem', marginTop: '0.25rem' }}>{validationErrors.confirmPassword}</p>}
            </div>

            <button
                onClick={onNext}
                className="btn btn-primary"
                style={{ width: '100%', marginTop: '1rem', padding: '1rem' }}
                disabled={!otpVerified}
            >
                Register
            </button>

            <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                Already have an account? <span onClick={() => navigate('/login')} style={{ color: 'var(--text-main)', fontWeight: '600', cursor: 'pointer' }}>Login</span>
            </p>
        </div>
    );
};

// Step 2: Company Details
const Step2CompanyDetails = ({ formData, handleChange, onNext, validationErrors }) => (
    <div className="fade-in">
        <h2 style={{ fontSize: '1.75rem', fontWeight: '600', marginBottom: '0.5rem' }}>Complete your profile</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', fontSize: '0.95rem' }}>
            Please provide the required information to verify your account
        </p>

        <ProgressIndicator currentStep={2} />

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <div className="input-group">
                <label className="input-label">Company Name</label>
                <input
                    type="text"
                    name="companyName"
                    placeholder="Enter company name"
                    className={`input-field ${validationErrors.companyName ? 'error' : ''}`}
                    value={formData.companyName}
                    onChange={handleChange}
                />
                {validationErrors.companyName && <p style={{ color: 'red', fontSize: '0.8rem', marginTop: '0.25rem' }}>{validationErrors.companyName}</p>}
            </div>
            <div className="input-group">
                <label className="input-label">GST Number</label>
                <input
                    type="text"
                    name="gstNumber"
                    placeholder="Enter GST number"
                    className={`input-field ${validationErrors.gstNumber ? 'error' : ''}`}
                    value={formData.gstNumber}
                    onChange={handleChange}
                />
                {validationErrors.gstNumber && <p style={{ color: 'red', fontSize: '0.8rem', marginTop: '0.25rem' }}>{validationErrors.gstNumber}</p>}
            </div>
            {/* Added PAN Number Field */}
            <div className="input-group">
                <label className="input-label">PAN Number</label>
                <input
                    type="text"
                    name="panNumber"
                    placeholder="Enter PAN number"
                    className={`input-field ${validationErrors.panNumber ? 'error' : ''}`}
                    value={formData.panNumber}
                    onChange={handleChange}
                />
                {validationErrors.panNumber && <p style={{ color: 'red', fontSize: '0.8rem', marginTop: '0.25rem' }}>{validationErrors.panNumber}</p>}
            </div>
            {/* Spacer for grid to keep last item left aligned if needed, or just let it flow */}
            <div></div>
        </div>

        <div className="input-group">
            <label className="input-label">Business Address</label>
            <textarea
                name="address"
                placeholder="Enter complete business address"
                className={`input-field ${validationErrors.address ? 'error' : ''}`}
                rows="3"
                style={{ resize: 'none' }}
                value={formData.address}
                onChange={handleChange}
            />
            {validationErrors.address && <p style={{ color: 'red', fontSize: '0.8rem', marginTop: '0.25rem' }}>{validationErrors.address}</p>}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <div className="input-group">
                <label className="input-label">Contact Person Name</label>
                <input
                    type="text"
                    name="contactPerson"
                    placeholder="Enter contact person name"
                    className={`input-field ${validationErrors.contactPerson ? 'error' : ''}`}
                    value={formData.contactPerson}
                    onChange={handleChange}
                />
                {validationErrors.contactPerson && <p style={{ color: 'red', fontSize: '0.8rem', marginTop: '0.25rem' }}>{validationErrors.contactPerson}</p>}
            </div>
            <div className="input-group">
                <label className="input-label">Contact Number</label>
                <input
                    type="text"
                    name="contactNumber"
                    placeholder="Enter contact number"
                    className={`input-field ${validationErrors.contactNumber ? 'error' : ''}`}
                    value={formData.contactNumber}
                    onChange={handleChange}
                />
                {validationErrors.contactNumber && <p style={{ color: 'red', fontSize: '0.8rem', marginTop: '0.25rem' }}>{validationErrors.contactNumber}</p>}
            </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
            <button
                onClick={onNext}
                className="btn btn-primary"
                style={{ padding: '0.75rem 2rem' }}
            >
                Next Step
            </button>
        </div>
    </div>
);

// Step 3: Document Upload
const Step3Documents = ({ formData, handleFileChange, onNext, onPrev, validationErrors }) => {
    return (
        <div className="fade-in">
            <h2 style={{ fontSize: '1.75rem', fontWeight: '600', marginBottom: '0.5rem' }}>Upload Documents</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', fontSize: '0.95rem' }}>
                Please upload the necessary documents for verification
            </p>

            <ProgressIndicator currentStep={3} />

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <FileUpload
                    label="GST Certificate"
                    subLabel="Upload your GST registration certificate (PDF/JPG)"
                    file={formData.documents.gstCertificate}
                    onChange={(e) => handleFileChange('gstCertificate', e.target.files[0])}
                    error={validationErrors.gstCertificate}
                />
                <FileUpload
                    label="PAN Card / Company ID"
                    subLabel="Upload company PAN card or ID proof (PDF/JPG)"
                    file={formData.documents.panCard}
                    onChange={(e) => handleFileChange('panCard', e.target.files[0])}
                    error={validationErrors.panCard}
                />
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2rem' }}>
                <button
                    onClick={onPrev}
                    className="btn btn-outline"
                    style={{ padding: '0.75rem 2rem' }}
                >
                    Back
                </button>
                <button
                    onClick={onNext}
                    className="btn btn-primary"
                    style={{ padding: '0.75rem 2rem' }}
                >
                    Next Step
                </button>
            </div>
        </div>
    );
};

const FileUpload = ({ label, subLabel, file, onChange, error }) => (
    <div style={{
        border: '2px dashed var(--border)',
        borderRadius: '12px',
        padding: '2rem',
        textAlign: 'center',
        background: file ? '#f0fdf4' : (error ? '#fef2f2' : '#f8fafc'),
        borderColor: file ? 'var(--accent)' : (error ? 'red' : 'var(--border)'),
        transition: 'all 0.3s ease',
        cursor: 'pointer',
        position: 'relative'
    }}>
        <input
            type="file"
            onChange={onChange}
            style={{
                position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                opacity: 0, cursor: 'pointer'
            }}
        />
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
                width: '48px', height: '48px',
                background: file ? 'var(--accent)' : (error ? 'red' : '#e2e8f0'),
                borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: (file || error) ? 'white' : 'var(--text-muted)'
            }}>
                {file ? <Check size={24} /> : <UploadCloud size={24} />}
            </div>
            <div>
                <h4 style={{ fontWeight: '600', color: error ? 'red' : 'var(--text-main)', marginBottom: '0.25rem' }}>
                    {file ? file.name : (error || label)}
                </h4>
                <p style={{ fontSize: '0.85rem', color: error ? 'red' : 'var(--text-muted)' }}>
                    {file ? 'File selected' : subLabel}
                </p>
            </div>
        </div>
    </div>
);

// Step 4: Review
const Step4Review = ({ formData, onNext, onPrev, onEditCompanyDetails, error, loading }) => (
    <div className="fade-in">
        <h2 style={{ fontSize: '1.75rem', fontWeight: '600', marginBottom: '0.5rem' }}>Review Details</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', fontSize: '0.95rem' }}>
            Please review your information before final submission
        </p>

        <ProgressIndicator currentStep={4} />

        <div style={{ background: '#f8fafc', borderRadius: '16px', padding: '2rem', border: '1px solid var(--border)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid var(--border)', paddingBottom: '1rem' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: '600' }}>Company Information</h3>
                <button className="btn btn-outline" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', gap: '0.5rem' }} onClick={onEditCompanyDetails}>
                    <Edit2 size={14} /> Edit
                </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                <ReviewItem label="Company Name" value={formData.companyName} />
                <ReviewItem label="GST Number" value={formData.gstNumber} />
                <ReviewItem label="PAN Number" value={formData.panNumber} />
                <ReviewItem label="Contact Person" value={formData.contactPerson} />
                <ReviewItem label="Contact Number" value={formData.contactNumber} />
                <ReviewItem label="Email Address" value={formData.email} />
                <div style={{ gridColumn: 'span 2' }}>
                    <ReviewItem label="Business Address" value={formData.address} />
                </div>
            </div>

            <div style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border)' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '1rem' }}>Uploaded Documents</h3>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <DocumentPreview name="GST Certificate" file={formData.documents.gstCertificate} />
                    <DocumentPreview name="PAN Card" file={formData.documents.panCard} />
                </div>
            </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2rem' }}>
            <button
                onClick={onPrev}
                className="btn btn-outline"
                style={{ padding: '0.75rem 2rem' }}
            >
                Back
            </button>
            <button
                onClick={onNext}
                className="btn btn-primary"
                style={{ padding: '0.75rem 2rem' }}
            >
                Submit & Finish
            </button>
        </div>
        {error && <div style={{ color: 'red', marginTop: '1rem', textAlign: 'center' }}>{error}</div>}
        {loading && <div style={{ textAlign: 'center', marginTop: '1rem' }}>Registering...</div>}
    </div>
);

const ReviewItem = ({ label, value }) => (
    <div>
        <span style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>{label}</span>
        <span style={{ fontWeight: '500', color: 'var(--text-main)' }}>{value || '-'}</span>
    </div>
);

const DocumentPreview = ({ name, file }) => (
    <div style={{
        display: 'flex', alignItems: 'center', gap: '0.75rem',
        padding: '0.75rem 1rem', background: 'white',
        border: '1px solid var(--border)', borderRadius: '8px',
        fontSize: '0.9rem', fontWeight: '500'
    }}>
        <FileText size={18} color="var(--primary)" />
        {name}: <span style={{ color: file ? 'var(--accent)' : 'var(--text-muted)' }}>{file ? 'Uploaded' : 'Pending'}</span>
    </div>
);

// Step 5: Setup Complete
const Step5Complete = ({ role, navigate }) => {
    const getRoleData = () => {
        switch (role) {
            case 'supplier': return { label: 'Supplier Dashboard', icon: <Factory size={32} /> };
            case 'logistics': return { label: 'Logistics Dashboard', icon: <Truck size={32} /> };
            default: return { label: 'Buyer Dashboard', icon: <ShoppingCart size={32} /> };
        }
    };

    const { label, icon } = getRoleData();

    return (
        <div className="fade-in" style={{ textAlign: 'center', padding: '2rem 0' }}>
            <div style={{
                width: '64px', height: '64px', background: 'var(--text-main)', borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem auto',
                boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)'
            }}>
                <Check color="white" size={32} strokeWidth={3} />
            </div>

            <h2 style={{ fontSize: '1.75rem', fontWeight: '600', marginBottom: '1rem' }}>Setup Complete!</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '3rem', maxWidth: '400px', margin: '0 auto 3rem auto' }}>
                Your account has been successfully verified and configured.
            </p>

            <div style={{
                border: '1px solid var(--border)', borderRadius: '16px', padding: '2rem',
                maxWidth: '350px', margin: '0 auto 2rem auto', background: 'white',
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem'
            }}>
                <div style={{ color: 'var(--text-main)' }}>
                    {icon}
                </div>
                <h3 style={{ fontWeight: '600', fontSize: '1.1rem' }}>{label}</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    Access procurement tools, manage orders, and track deliveries
                </p>
            </div>

            <button
                onClick={() => {
                    const userId = localStorage.getItem('userId');
                    if (role === 'supplier') {
                        navigate(`/supplier/dashboard/${userId}`);
                    } else if (role === 'buyer') {
                        navigate(`/buyer/dashboard/${userId}`);
                    } else if (role === 'logistics') {
                        navigate(`/logistics/dashboard/${userId}`);
                    } else {
                        navigate('/dashboard', { state: { role } });
                    }
                }}
                className="btn btn-primary"
                style={{ width: '100%', maxWidth: '350px', padding: '1rem' }}
            >
                Go to Dashboard
            </button>
        </div>
    );
};

export default Registration;
