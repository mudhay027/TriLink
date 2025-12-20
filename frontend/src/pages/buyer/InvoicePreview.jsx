import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Bell, User, ArrowLeft, Printer, Download } from 'lucide-react';
import html2pdf from 'html2pdf.js';
import '../../index.css';

const InvoicePreview = () => {
    const navigate = useNavigate();
    const { invoiceId } = useParams();
    const [invoice, setInvoice] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (invoiceId) {
            fetchInvoice();
        }
    }, [invoiceId]);

    const fetchInvoice = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:5081/api/invoice/${invoiceId}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.ok) {
                const data = await response.json();
                setInvoice(data);
            } else {
                alert('Failed to load invoice');
                const userId = localStorage.getItem('userId');
                navigate(`/buyer/orders/${userId}`);
            }
            setLoading(false);
        } catch (error) {
            console.error('Error fetching invoice:', error);
            alert('Error loading invoice');
            setLoading(false);
        }
    };

    const handleDownload = () => {
        const element = document.querySelector('.invoice-container');
        const opt = {
            margin: 0.5,
            filename: `Invoice-${invoice.invoiceNumber}.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2, useCORS: true },
            jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
        };
        html2pdf().set(opt).from(element).save();
    };

    const handlePrint = () => {
        window.print();
    };

    if (loading) {
        return <div style={{ padding: '3rem', textAlign: 'center' }}>Loading invoice...</div>;
    }

    if (!invoice) {
        return <div style={{ padding: '3rem', textAlign: 'center' }}>Invoice not found</div>;
    }

    return (
        <div className="fade-in" style={{ minHeight: '100vh', background: '#f8fafc' }}>
            {/* Navigation Bar */}
            <nav style={{ background: 'white', borderBottom: '1px solid var(--border)', padding: '1rem 3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '3rem' }}>
                    <div style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--text-main)' }}>TriLink</div>
                    <div style={{ display: 'flex', gap: '2rem', fontSize: '0.95rem', fontWeight: '500' }}>
                        <a href="#" onClick={() => { const userId = localStorage.getItem('userId'); navigate(`/buyer/dashboard/${userId}`); }} style={{ color: 'var(--text-muted)', cursor: 'pointer' }}>Dashboard</a>
                        <a href="#" onClick={() => { const userId = localStorage.getItem('userId'); navigate(`/buyer/search/${userId}`); }} style={{ color: 'var(--text-main)', cursor: 'pointer' }}>Search Products</a>
                        <a href="#" onClick={() => { const userId = localStorage.getItem('userId'); navigate(`/buyer/active-negotiations/${userId}`); }} style={{ color: 'var(--text-muted)', cursor: 'pointer' }}>Negotiation</a>
                        <a href="#" onClick={() => { const userId = localStorage.getItem('userId'); navigate(`/buyer/orders/${userId}`); }} style={{ color: 'var(--text-muted)', cursor: 'pointer' }}>Orders</a>
                        <a href="#" onClick={() => { const userId = localStorage.getItem('userId'); navigate(`/buyer/logistics-jobs/${userId}`); }} style={{ color: 'var(--text-muted)', cursor: 'pointer' }}>Logistics Jobs</a>
                    </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                    <Bell size={20} color="var(--text-muted)" />
                    <div
                        style={{ width: '32px', height: '32px', background: '#e2e8f0', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                        onClick={() => { const userId = localStorage.getItem('userId'); navigate(`/buyer/profile/${userId}`); }}
                    >
                        <User size={18} color="var(--text-muted)" />
                    </div>
                </div>
            </nav>

            <main className="container" style={{ padding: '3rem 1rem', maxWidth: '1000px' }}>
                <div style={{ marginBottom: '2rem' }}>
                    <h1 style={{ fontSize: '1.75rem', fontWeight: '600', marginBottom: '0.5rem' }}>Invoice PDF Preview Viewer</h1>
                    <p style={{ color: 'var(--text-muted)' }}>View generated invoice documents</p>
                </div>

                {/* Toolbar */}
                <div style={{ background: 'white', padding: '1rem 1.5rem', borderRadius: '8px 8px 0 0', border: '1px solid var(--border)', borderBottom: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontWeight: '500' }}>
                        <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0.25rem' }}>
                            <ArrowLeft size={20} />
                        </button>
                        INV-2025-001.pdf
                    </div>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <button onClick={handlePrint} className="btn btn-outline" style={{ padding: '0.5rem 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem' }}>
                            <Printer size={16} /> Print
                        </button>
                        <button onClick={handleDownload} className="btn btn-primary" style={{ padding: '0.5rem 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem' }}>
                            <Download size={16} /> Download
                        </button>
                    </div>
                </div>

                {/* Invoice Container */}
                <div className="invoice-container" style={{ background: 'white', border: '1px solid var(--border)', borderRadius: '0 0 8px 8px', padding: '4rem', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>

                    {/* Header Section */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4rem' }}>
                        <div>
                            <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '0.25rem' }}>{invoice.supplierCompanyName || invoice.supplierName}</h3>
                            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
                                {invoice.supplierAddress}<br />
                                {invoice.supplierContactNumber}<br />
                                {invoice.supplierGSTNumber && <>GST: {invoice.supplierGSTNumber}</>}
                            </div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <h2 style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '1rem', letterSpacing: '0.05em' }}>INVOICE</h2>
                            <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: '1.6' }}>
                                Invoice No: <span style={{ color: 'var(--text-main)', fontWeight: '500' }}>{invoice.invoiceNumber}</span><br />
                                Date: <span style={{ color: 'var(--text-main)', fontWeight: '500' }}>{new Date(invoice.invoiceDate).toLocaleDateString()}</span><br />
                                Due Date: <span style={{ color: 'var(--text-main)', fontWeight: '500' }}>{new Date(invoice.dueDate).toLocaleDateString()}</span>
                            </div>
                        </div>
                    </div>

                    {/* Bill To */}
                    <div style={{ border: '1px solid var(--border)', borderRadius: '8px', padding: '1.5rem', marginBottom: '3rem' }}>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.5rem', textTransform: 'uppercase' }}>Bill To</div>
                        <h4 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '0.5rem' }}>{invoice.buyerCompanyName || invoice.buyerName}</h4>
                        <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
                            {invoice.buyerAddress}<br />
                            {invoice.buyerGSTNumber && <>GST: {invoice.buyerGSTNumber}</>}
                        </div>
                    </div>

                    {/* Items Table */}
                    <div style={{ marginBottom: '2rem' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ background: '#f8fafc', borderBottom: '1px solid var(--border)' }}>
                                    <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-main)' }}>Description</th>
                                    <th style={{ padding: '1rem', textAlign: 'center', fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-main)' }}>Quantity</th>
                                    <th style={{ padding: '1rem', textAlign: 'right', fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-main)' }}>Unit Price</th>
                                    <th style={{ padding: '1rem', textAlign: 'right', fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-main)' }}>Amount</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr style={{ borderBottom: '1px solid var(--border)' }}>
                                    <td style={{ padding: '1.5rem 1rem' }}>
                                        <div style={{ fontWeight: '500', marginBottom: '0.25rem' }}>{invoice.productName}</div>
                                        <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Order: {invoice.orderId}</div>
                                    </td>
                                    <td style={{ padding: '1.5rem 1rem', textAlign: 'center' }}>{invoice.quantity} {invoice.unit}</td>
                                    <td style={{ padding: '1.5rem 1rem', textAlign: 'right' }}>₹{(invoice.subTotal / invoice.quantity).toFixed(2)}</td>
                                    <td style={{ padding: '1.5rem 1rem', textAlign: 'right', fontWeight: '500' }}>₹{invoice.subTotal.toFixed(2)}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    {/* Totals */}
                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '3rem' }}>
                        <div style={{ width: '300px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', fontSize: '0.9rem' }}>
                                <span style={{ color: 'var(--text-muted)' }}>Subtotal:</span>
                                <span style={{ fontWeight: '500' }}>₹{invoice.subTotal.toFixed(2)}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', fontSize: '0.9rem' }}>
                                <span style={{ color: 'var(--text-muted)' }}>GST ({invoice.taxRate}%):</span>
                                <span style={{ fontWeight: '500' }}>₹{invoice.taxAmount.toFixed(2)}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem 0', marginTop: '0.5rem', borderTop: '1px solid var(--border)', background: '#f8fafc', borderRadius: '4px', paddingLeft: '1rem', paddingRight: '1rem' }}>
                                <span style={{ fontWeight: '600' }}>Total Amount:</span>
                                <span style={{ fontWeight: '700', fontSize: '1.1rem' }}>₹{invoice.totalAmount.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>

                    {/* Notes/Terms */}
                    {invoice.notes && (
                        <div style={{ borderTop: '1px solid var(--border)', paddingTop: '2rem' }}>
                            <h4 style={{ fontSize: '0.9rem', fontWeight: '600', marginBottom: '0.5rem' }}>Terms & Conditions:</h4>
                            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.6', whiteSpace: 'pre-wrap' }}>
                                {invoice.notes}
                            </p>
                        </div>
                    )}

                </div>
            </main >
        </div >
    );
};

export default InvoicePreview;
