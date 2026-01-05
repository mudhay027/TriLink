import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Bell, User, Send, Check, CheckCheck, ArrowLeft, Package } from 'lucide-react';
import * as signalR from '@microsoft/signalr';
import Toast from '../../components/Toast';
import { useToast } from '../../hooks/useNotification';
import '../../index.css';

const ChatPage = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const supplierId = searchParams.get('supplierId');
    const productId = searchParams.get('productId');
    const threadIdParam = searchParams.get('threadId');

    const [threads, setThreads] = useState([]);
    const [selectedThread, setSelectedThread] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [threadInfo, setThreadInfo] = useState(null);
    const [connection, setConnection] = useState(null);

    // Counter Offer Form State
    const [showCounterOfferForm, setShowCounterOfferForm] = useState(false);
    const [pricePerUnit, setPricePerUnit] = useState('');
    const [quantity, setQuantity] = useState('');

    // Offer Action Modal State
    const [showActionModal, setShowActionModal] = useState(false);
    const [actionOffer, setActionOffer] = useState(null);


    // Computed total price
    const totalPrice = pricePerUnit && quantity ? parseFloat(pricePerUnit) * parseFloat(quantity) : 0;
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);

    const currentUserId = localStorage.getItem('userId');
    const token = localStorage.getItem('token');

    // Custom notifications
    const { toast, showSuccess, showError, hideToast } = useToast();

    // Scroll to bottom when messages change
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Fetch threads (try new Chat API first, fallback to Negotiations)
    useEffect(() => {
        const fetchThreads = async () => {
            let chatApiWorked = false;

            try {
                // Try new Chat API first
                const response = await fetch('http://localhost:5081/api/chat/threads', {
                    headers: { 'Authorization': `Bearer ${token} ` }
                });
                if (response.ok) {
                    const data = await response.json();

                    // Only use Chat API if it returns actual data
                    if (data && data.length > 0) {
                        console.log('Using Chat API:', data);
                        setThreads(data);
                        chatApiWorked = true;

                        // Auto-select thread if threadId is in URL
                        if (threadIdParam) {
                            const thread = data.find(t => t.id === threadIdParam);
                            if (thread) setSelectedThread(thread);
                        }
                        return;
                    } else {
                        console.log('Chat API returned empty, falling back to Negotiations');
                    }
                }
            } catch (error) {
                console.log('Chat API not available, falling back to Negotiations');
            }

            // Fallback: Fetch from Negotiations API
            try {
                const response = await fetch('http://localhost:5081/api/Negotiation', {
                    headers: { 'Authorization': `Bearer ${token} ` }
                });
                if (response.ok) {
                    const negotiations = await response.json();
                    console.log('Fetched negotiations:', negotiations);

                    // Convert negotiations to thread-like objects
                    const threadLikeData = negotiations.map(n => ({
                        id: n.id,
                        buyerId: n.buyerId,
                        supplierId: n.sellerId,
                        buyerCompanyName: n.buyerCompanyName || n.buyerName,
                        supplierCompanyName: n.sellerCompanyName || n.sellerName,
                        productName: n.productName,
                        productId: n.productId,
                        status: n.status,
                        lastMessageAt: n.offers?.[n.offers.length - 1]?.createdAt || new Date(),
                        lastMessage: n.offers?.[n.offers.length - 1]?.message || n.productName,
                        unreadCount: 0,
                        isNegotiation: true // Flag to use Negotiation API for messages
                    }));

                    console.log('Converted to threads:', threadLikeData);
                    console.log('Looking for threadId:', threadIdParam);

                    setThreads(threadLikeData);

                    // Auto-select thread if threadId is in URL
                    if (threadIdParam) {
                        // Convert both to strings for comparison
                        const thread = threadLikeData.find(t => t.id.toString().toLowerCase() === threadIdParam.toLowerCase());
                        console.log('Found thread:', thread);
                        if (thread) {
                            setSelectedThread(thread);
                        } else {
                            console.log('Thread not found. Available IDs:', threadLikeData.map(t => t.id));
                        }
                    }
                }
            } catch (error) {
                console.error('Failed to fetch negotiations:', error);
            }
        };
        fetchThreads();
    }, [token, threadIdParam]);

    // Create thread if supplierId and productId are provided
    useEffect(() => {
        const createThread = async () => {
            if (supplierId && productId && !threadIdParam) {
                try {
                    const response = await fetch('http://localhost:5081/api/chat/threads', {
                        method: 'POST',
                        headers: {
                            'Authorization': `Bearer ${token} `,
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ supplierId, productId, initialMessage: '' })
                    });
                    if (response.ok) {
                        const data = await response.json();
                        // Refresh threads and select the new one
                        const threadsResponse = await fetch('http://localhost:5081/api/chat/threads', {
                            headers: { 'Authorization': `Bearer ${token} ` }
                        });
                        if (threadsResponse.ok) {
                            const threadsData = await threadsResponse.json();
                            setThreads(threadsData);
                            const newThread = threadsData.find(t => t.id === data.threadId);
                            if (newThread) setSelectedThread(newThread);
                        }
                    }
                } catch (error) {
                    console.error('Failed to create thread:', error);
                }
            }
        };
        createThread();
    }, [supplierId, productId, token, threadIdParam]);

    // Fetch messages when thread is selected
    useEffect(() => {
        const fetchMessages = async () => {
            if (!selectedThread) return;

            // If this is a negotiation (fallback mode), fetch from Negotiation API
            if (selectedThread.isNegotiation) {
                try {
                    const response = await fetch(`http://localhost:5081/api/Negotiation/${selectedThread.id}`, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    if (response.ok) {
                        const data = await response.json();
                        // Convert offers to message format
                        const offerMessages = (data.offers || []).map(offer => ({
                            id: offer.id,
                            senderId: offer.senderId || offer.proposerId,
                            senderName: offer.senderId === data.buyerId ? data.buyerCompanyName : data.sellerCompanyName,
                            textMessage: offer.message,
                            messageType: (offer.totalPrice > 0 || offer.amount > 0) ? 'Offer' : 'Text',
                            offer: (offer.totalPrice > 0 || offer.amount > 0) ? {
                                id: offer.id,
                                amount: offer.amount,
                                pricePerUnit: offer.pricePerUnit || (offer.quantity > 0 ? offer.amount / offer.quantity : 0),
                                totalPrice: offer.totalPrice || offer.amount,
                                quantity: offer.quantity || data.quantity,
                                unit: data.unit,
                                status: offer.status || 'Pending'
                            } : null,
                            createdAt: offer.createdAt,
                            isRead: true
                        }));

                        // Sort messages chronologically by createdAt timestamp
                        offerMessages.sort((a, b) => {
                            const dateA = new Date(a.createdAt);
                            const dateB = new Date(b.createdAt);
                            return dateA - dateB;
                        });

                        setMessages(offerMessages);
                        setThreadInfo({
                            buyerId: data.buyerId,
                            supplierId: data.sellerId,
                            buyerCompanyName: data.buyerCompanyName,
                            supplierCompanyName: data.sellerCompanyName,
                            productName: data.productName,
                            unit: data.unit,
                            desiredDeliveryDate: data.desiredDeliveryDate
                        });
                    }
                } catch (error) {
                    console.error('Failed to fetch negotiation messages:', error);
                }
                return;
            }

            // Use new Chat API
            try {
                const response = await fetch(`http://localhost:5081/api/chat/threads/${selectedThread.id}/messages`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (response.ok) {
                    const data = await response.json();
                    setMessages(data.messages);
                    setThreadInfo(data.threadInfo);

                    // Mark messages as read
                    await fetch(`http://localhost:5081/api/chat/threads/${selectedThread.id}/messages/read`, {
                        method: 'PUT',
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                }
            } catch (error) {
                console.error('Failed to fetch messages:', error);
            }
        };
        fetchMessages();
    }, [selectedThread, token]);

    // SignalR connection
    useEffect(() => {
        const newConnection = new signalR.HubConnectionBuilder()
            .withUrl('http://localhost:5081/chathub', {
                accessTokenFactory: () => token
            })
            .withAutomaticReconnect()
            .build();

        newConnection.start()
            .then(() => {
                console.log('SignalR Connected');
                setConnection(newConnection);
            })
            .catch(err => console.error('SignalR Connection Error:', err));

        newConnection.on('ReceiveMessage', (message) => {
            setMessages(prev => [...prev, message]);
        });

        newConnection.on('UserTyping', (data) => {
            if (data.userId !== currentUserId) {
                setIsTyping(data.isTyping);
            }
        });

        newConnection.on('MessagesRead', (data) => {
            setMessages(prev => prev.map(m =>
                m.senderId === currentUserId ? { ...m, isRead: true } : m
            ));
        });

        return () => {
            newConnection.stop();
        };
    }, [token, currentUserId]);

    // Join/leave thread groups
    useEffect(() => {
        if (connection && selectedThread) {
            connection.invoke('JoinThread', selectedThread.id.toString())
                .catch(err => console.error('JoinThread error:', err));

            return () => {
                connection.invoke('LeaveThread', selectedThread.id.toString())
                    .catch(err => console.error('LeaveThread error:', err));
            };
        }
    }, [connection, selectedThread]);

    const handleSendMessage = async () => {
        if (!newMessage.trim() || !selectedThread) return;

        // Optimistic update
        const optimisticMessage = {
            id: 'temp-' + Date.now(),
            senderId: currentUserId,
            textMessage: newMessage,
            messageType: 'Text',
            createdAt: new Date().toISOString(),
            isRead: false
        };
        setMessages(prev => [...prev, optimisticMessage]);
        const messageToSend = newMessage;
        setNewMessage('');

        try {
            let response;

            // Use Negotiation API if in fallback mode
            if (selectedThread.isNegotiation) {
                response = await fetch(`http://localhost:5081/api/Negotiation/${selectedThread.id}/offers`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        message: messageToSend,
                        amount: 0,
                        quantity: 0
                    })
                });
            } else {
                // Use new Chat API
                response = await fetch(`http://localhost:5081/api/chat/threads/${selectedThread.id}/messages`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ textMessage: messageToSend })
                });
            }

            if (!response.ok) {
                // Remove optimistic message on failure
                setMessages(prev => prev.filter(m => m.id !== optimisticMessage.id));
                showError('Failed to send message');
            }
        } catch (error) {
            console.error('Failed to send message:', error);
            setMessages(prev => prev.filter(m => m.id !== optimisticMessage.id));
        }
    };

    const getOtherParticipant = (thread) => {
        if (thread.buyerId === currentUserId) {
            return { name: thread.supplierCompanyName || thread.supplierName, role: 'Supplier' };
        }
        return { name: thread.buyerCompanyName || thread.buyerName, role: 'Buyer' };
    };

    const handleSendCounterOffer = async () => {
        console.log('=== Counter Offer Debug ===');
        console.log('pricePerUnit:', pricePerUnit);
        console.log('quantity:', quantity);
        console.log('selectedThread:', selectedThread);
        console.log('threadInfo:', threadInfo);
        console.log('totalPrice:', totalPrice);

        if (!pricePerUnit || !quantity || !selectedThread) {
            console.error('Validation failed!');
            showError('Please fill in all fields');
            return;
        }

        try {
            // Use the negotiation ID from selectedThread
            const negotiationId = selectedThread.id;
            console.log('Negotiation ID:', negotiationId);

            const requestBody = {
                amount: parseFloat(totalPrice),
                pricePerUnit: parseFloat(pricePerUnit),
                totalPrice: parseFloat(totalPrice),
                message: `Counter Offer: ${quantity} ${threadInfo?.unit || 'units'} at ₹${totalPrice}`,
                quantity: parseFloat(quantity)
            };
            console.log('Request body:', requestBody);

            const response = await fetch(`http://localhost:5081/api/Negotiation/${negotiationId}/offers`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(requestBody)
            });

            console.log('Response status:', response.status);
            console.log('Response ok:', response.ok);

            if (response.ok) {
                // Clear form and close
                setPricePerUnit('');
                setQuantity('');
                setShowCounterOfferForm(false);

                // Trigger message refresh by reloading the thread
                const currentThreadId = selectedThread.id;
                setSelectedThread(null);
                setTimeout(() => {
                    setSelectedThread(threads.find(t => t.id === currentThreadId));
                }, 100);
            } else {
                const errorText = await response.text();
                console.error('Failed to send counter offer. Status:', response.status);
                console.error('Error response:', errorText);
                showError(`Failed to send counter offer: ${errorText}`);
            }
        } catch (error) {
            console.error('Error sending counter offer:', error);
            showError(`Error sending counter offer: ${error.message}`);
        }
    };

    const handleUpdateNegotiationStatus = async (status) => {
        if (!selectedThread || !actionOffer) return;

        try {
            const response = await fetch(`http://localhost:5081/api/Negotiation/${selectedThread.id}/status`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    status: status,
                    offerId: actionOffer.id
                })
            });

            if (response.ok) {
                setShowActionModal(false);
                setActionOffer(null);

                // Refresh messages
                const currentThreadId = selectedThread.id;
                setSelectedThread(null);
                setTimeout(() => {
                    setSelectedThread(threads.find(t => t.id === currentThreadId));
                }, 100);

                if (status === 'Accepted') {
                    showSuccess('Offer accepted! An order has been created.');
                }
            } else {
                const error = await response.text();
                showError(`Failed to update status: ${error}`);
            }
        } catch (error) {
            console.error('Error updating status:', error);
            showError('Error updating status');
        }
    };


    return (
        <div style={{ display: 'flex', height: '100vh', background: '#f0f2f5' }}>
            {/* Toast Notification */}
            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={hideToast}
                    duration={toast.duration}
                />
            )}

            {/* Sidebar - Thread List */}
            <div style={{
                width: '350px',
                background: 'white',
                borderRight: '1px solid #e0e0e0',
                display: 'flex',
                flexDirection: 'column'
            }}>
                {/* Sidebar Header */}
                <div style={{
                    padding: '1rem',
                    background: '#f0f2f5',
                    borderBottom: '1px solid #e0e0e0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                }}>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: '600', margin: 0 }}>Chats</h2>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <Bell size={20} color="#54656f" style={{ cursor: 'pointer' }} />
                    </div>
                </div>

                {/* Thread List */}
                <div style={{ flex: 1, overflowY: 'auto' }}>
                    {threads.length === 0 ? (
                        <div style={{ padding: '2rem', textAlign: 'center', color: '#667781' }}>
                            No conversations yet
                        </div>
                    ) : (
                        threads.map(thread => {
                            const other = getOtherParticipant(thread);
                            const isSelected = selectedThread?.id === thread.id;
                            return (
                                <div
                                    key={thread.id}
                                    onClick={() => setSelectedThread(thread)}
                                    style={{
                                        display: 'flex',
                                        padding: '0.75rem 1rem',
                                        cursor: 'pointer',
                                        background: isSelected ? '#f0f2f5' : 'white',
                                        borderBottom: '1px solid #f0f2f5',
                                        gap: '0.75rem',
                                        alignItems: 'center'
                                    }}
                                >
                                    {/* Avatar */}
                                    <div style={{
                                        width: '48px',
                                        height: '48px',
                                        borderRadius: '50%',
                                        background: '#dfe5e7',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        flexShrink: 0
                                    }}>
                                        <User size={24} color="#667781" />
                                    </div>

                                    {/* Thread Info */}
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                                            <span style={{ fontWeight: '500', fontSize: '0.95rem' }}>{other.name}</span>
                                            <span style={{ fontSize: '0.75rem', color: '#667781' }}>
                                                {new Date(thread.lastMessageAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                            <span style={{
                                                fontSize: '0.85rem',
                                                color: '#667781',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                whiteSpace: 'nowrap'
                                            }}>
                                                {thread.productName}
                                            </span>
                                            {thread.unreadCount > 0 && (
                                                <span style={{
                                                    background: '#25d366',
                                                    color: 'white',
                                                    borderRadius: '50%',
                                                    width: '20px',
                                                    height: '20px',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    fontSize: '0.75rem',
                                                    fontWeight: '500'
                                                }}>
                                                    {thread.unreadCount}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>

            {/* Chat Window */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                {selectedThread ? (
                    <>
                        {/* Chat Header */}
                        <div style={{
                            padding: '0.75rem 1rem',
                            background: '#f0f2f5',
                            borderBottom: '1px solid #e0e0e0',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.75rem'
                        }}>
                            <div style={{
                                width: '40px',
                                height: '40px',
                                borderRadius: '50%',
                                background: '#dfe5e7',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                <User size={20} color="#667781" />
                            </div>
                            <div style={{ flex: 1 }}>
                                <div style={{ fontWeight: '500' }}>{getOtherParticipant(selectedThread).name}</div>
                                <div style={{ fontSize: '0.8rem', color: '#667781' }}>
                                    {isTyping ? 'typing...' : selectedThread.productName}
                                </div>
                            </div>

                            {/* Toggle Counter Offer Button */}
                            {selectedThread.status !== 'Accepted' && selectedThread.status !== 'Rejected' && (
                                <button
                                    onClick={() => setShowCounterOfferForm(!showCounterOfferForm)}
                                    style={{
                                        padding: '0.5rem 1rem',
                                        background: showCounterOfferForm ? '#25d366' : '#3b82f6',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '6px',
                                        fontSize: '0.85rem',
                                        fontWeight: '500',
                                        cursor: 'pointer'
                                    }}
                                >
                                    {showCounterOfferForm ? 'Hide Offer Form' : 'Make Counter Offer'}
                                </button>
                            )}
                        </div>

                        {/* Messages Area */}
                        <div style={{
                            flex: 1,
                            overflowY: 'auto',
                            padding: '1rem',
                            background: '#efeae2',
                            backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23d4d0c8\' fill-opacity=\'0.4\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")'
                        }}>
                            {messages.map((msg, index) => {
                                const isOwn = msg.senderId === currentUserId;
                                return (
                                    <div
                                        key={msg.id || index}
                                        style={{
                                            display: 'flex',
                                            justifyContent: isOwn ? 'flex-end' : 'flex-start',
                                            marginBottom: '0.5rem'
                                        }}
                                    >
                                        <div style={{
                                            maxWidth: '65%',
                                            padding: '0.5rem 0.75rem',
                                            borderRadius: isOwn ? '8px 8px 0 8px' : '8px 8px 8px 0',
                                            background: isOwn ? '#d9fdd3' : 'white',
                                            boxShadow: '0 1px 0.5px rgba(0,0,0,0.13)'
                                        }}>
                                            {msg.messageType === 'Offer' && msg.offer && (
                                                <div
                                                    onClick={() => {
                                                        const isClosed = selectedThread.status === 'Accepted' || selectedThread.status === 'Rejected';
                                                        const isActionable = msg.offer.status === 'Pending' || msg.offer.status === 'InNegotiation';
                                                        if (!isOwn && isActionable && !isClosed) {
                                                            setActionOffer(msg.offer);
                                                            setShowActionModal(true);
                                                        }
                                                    }}
                                                    style={{
                                                        background: '#f0f2f5',
                                                        padding: '0.75rem',
                                                        borderRadius: '6px',
                                                        marginBottom: '0.5rem',
                                                        border: '1px solid #e0e0e0',
                                                        cursor: (!isOwn && (msg.offer.status === 'Pending' || msg.offer.status === 'InNegotiation') && selectedThread.status !== 'Accepted' && selectedThread.status !== 'Rejected') ? 'pointer' : 'default',
                                                        transition: 'background 0.2s',
                                                        ':hover': {
                                                            background: (!isOwn && (msg.offer.status === 'Pending' || msg.offer.status === 'InNegotiation') && selectedThread.status !== 'Accepted' && selectedThread.status !== 'Rejected') ? '#e8ebed' : '#f0f2f5'
                                                        }
                                                    }}
                                                >
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                                                        <Package size={16} color="#667781" />
                                                        <span style={{ fontWeight: '600', fontSize: '0.9rem' }}>Price Offer</span>
                                                        <span style={{
                                                            padding: '0.125rem 0.5rem',
                                                            borderRadius: '4px',
                                                            fontSize: '0.75rem',
                                                            fontWeight: '500',
                                                            background: (msg.offer.status === 'Pending' || msg.offer.status === 'InNegotiation') ? '#ffeeba' :
                                                                msg.offer.status === 'Accepted' ? '#d4edda' : '#f8d7da',
                                                            color: (msg.offer.status === 'Pending' || msg.offer.status === 'InNegotiation') ? '#856404' :
                                                                msg.offer.status === 'Accepted' ? '#155724' : '#721c24'
                                                        }}>
                                                            {msg.offer.status}
                                                        </span>
                                                    </div>
                                                    <div style={{ fontSize: '0.9rem' }}>
                                                        <div>Unit Price: <strong>₹{(msg.offer.pricePerUnit || 0).toFixed(2)}/{threadInfo?.unit || 'unit'}</strong></div>
                                                        <div>Total Amount: <strong>₹{(msg.offer.totalPrice || 0).toFixed(2)}</strong> for {msg.offer.quantity} {threadInfo?.unit || 'units'}</div>
                                                        {threadInfo?.desiredDeliveryDate && (
                                                            <div>Expected Delivery: <strong>{new Date(threadInfo.desiredDeliveryDate).toLocaleDateString('en-GB')}</strong></div>
                                                        )}
                                                    </div>
                                                </div>
                                            )}

                                            <div style={{ fontSize: '0.9rem', wordBreak: 'break-word' }}>
                                                {msg.textMessage}
                                            </div>

                                            <div style={{
                                                display: 'flex',
                                                justifyContent: 'flex-end',
                                                alignItems: 'center',
                                                gap: '0.25rem',
                                                marginTop: '0.25rem'
                                            }}>
                                                <span style={{ fontSize: '0.7rem', color: '#667781' }}>
                                                    {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                                {isOwn && (
                                                    msg.isRead ?
                                                        <CheckCheck size={16} color="#53bdeb" /> :
                                                        <Check size={16} color="#667781" />
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Counter Offer Form */}
                        {showCounterOfferForm && (
                            <div style={{
                                padding: '1.5rem',
                                background: 'white',
                                borderTop: '1px solid #e0e0e0',
                                borderBottom: '1px solid #e0e0e0'
                            }}>
                                <h3 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '1rem' }}>Send Counter Offer</h3>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                                    {/* Price per Unit */}
                                    <div>
                                        <label style={{ fontSize: '0.85rem', color: '#667781', marginBottom: '0.5rem', display: 'block' }}>
                                            Price (₹/{threadInfo?.unit || 'unit'})
                                        </label>
                                        <input
                                            type="number"
                                            value={pricePerUnit}
                                            onChange={(e) => setPricePerUnit(e.target.value)}
                                            placeholder="0"
                                            style={{
                                                width: '100%',
                                                padding: '0.6rem',
                                                border: '1px solid #e0e0e0',
                                                borderRadius: '6px',
                                                fontSize: '0.95rem'
                                            }}
                                        />
                                    </div>

                                    {/* Quantity */}
                                    <div>
                                        <label style={{ fontSize: '0.85rem', color: '#667781', marginBottom: '0.5rem', display: 'block' }}>
                                            Quantity
                                        </label>
                                        <input
                                            type="number"
                                            value={quantity}
                                            onChange={(e) => setQuantity(e.target.value)}
                                            placeholder="0"
                                            style={{
                                                width: '100%',
                                                padding: '0.6rem',
                                                border: '1px solid #e0e0e0',
                                                borderRadius: '6px',
                                                fontSize: '0.95rem'
                                            }}
                                        />
                                    </div>

                                    {/* Total Price (Read-only) */}
                                    <div>
                                        <label style={{ fontSize: '0.85rem', color: '#667781', marginBottom: '0.5rem', display: 'block' }}>
                                            Total Price
                                        </label>
                                        <div style={{
                                            width: '100%',
                                            padding: '0.6rem',
                                            background: '#f0f2f5',
                                            border: '1px solid #e0e0e0',
                                            borderRadius: '6px',
                                            fontSize: '0.95rem',
                                            fontWeight: '600',
                                            color: '#25d366'
                                        }}>
                                            ₹{totalPrice.toFixed(2)}
                                        </div>
                                    </div>
                                </div>

                                {/* Send Button */}
                                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                    <button
                                        onClick={handleSendCounterOffer}
                                        style={{
                                            padding: '0.6rem 1.5rem',
                                            background: 'black',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '6px',
                                            fontSize: '0.95rem',
                                            fontWeight: '500',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.5rem'
                                        }}
                                    >
                                        <Send size={16} />
                                        Send Counter Offer
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Message Input */}
                        <div style={{
                            padding: '0.75rem 1rem',
                            background: '#f0f2f5',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.75rem'
                        }}>
                            <input
                                type="text"
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                                placeholder="Type a message"
                                style={{
                                    flex: 1,
                                    padding: '0.75rem 1rem',
                                    borderRadius: '8px',
                                    border: 'none',
                                    fontSize: '0.95rem',
                                    outline: 'none'
                                }}
                            />
                            <button
                                onClick={handleSendMessage}
                                disabled={!newMessage.trim()}
                                style={{
                                    width: '44px',
                                    height: '44px',
                                    borderRadius: '50%',
                                    border: 'none',
                                    background: newMessage.trim() ? '#00a884' : '#8696a0',
                                    color: 'white',
                                    cursor: newMessage.trim() ? 'pointer' : 'default',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}
                            >
                                <Send size={20} />
                            </button>
                        </div>
                    </>
                ) : (
                    /* Empty State */
                    <div style={{
                        flex: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: '#f0f2f5',
                        color: '#667781'
                    }}>
                        <div style={{
                            width: '200px',
                            height: '200px',
                            background: '#dfe5e7',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginBottom: '1.5rem'
                        }}>
                            <User size={80} color="#8696a0" />
                        </div>
                        <h3 style={{ fontWeight: '400', marginBottom: '0.5rem' }}>TriLink Chat</h3>
                        <p style={{ fontSize: '0.9rem', textAlign: 'center', maxWidth: '400px' }}>
                            Select a conversation to start messaging with buyers and suppliers
                        </p>
                    </div>
                )}
            </div>
            {/* Action Overlay Modal */}
            {showActionModal && actionOffer && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'rgba(0,0,0,0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 2000
                }}>
                    <div style={{
                        background: 'white',
                        padding: '2rem',
                        borderRadius: '12px',
                        boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
                        width: '400px',
                        textAlign: 'center'
                    }}>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem' }}>Accept the offer</h3>
                        <p style={{ color: '#667781', marginBottom: '1.5rem' }}>
                            Are you sure you want to accept this offer of ₹{actionOffer.totalPrice.toFixed(2)} for {actionOffer.quantity} {threadInfo?.unit || 'units'}?
                        </p>

                        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                            <button
                                onClick={() => handleUpdateNegotiationStatus('Accepted')}
                                style={{
                                    padding: '0.75rem 2rem',
                                    background: '#25d366',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '6px',
                                    fontWeight: '600',
                                    cursor: 'pointer',
                                    flex: 1
                                }}
                            >
                                Accept
                            </button>
                            <button
                                onClick={() => handleUpdateNegotiationStatus('Rejected')}
                                style={{
                                    padding: '0.75rem 2rem',
                                    background: '#ef4444',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '6px',
                                    fontWeight: '600',
                                    cursor: 'pointer',
                                    flex: 1
                                }}
                            >
                                Reject
                            </button>
                        </div>
                        <button
                            onClick={() => setShowActionModal(false)}
                            style={{
                                marginTop: '1rem',
                                background: 'transparent',
                                border: 'none',
                                color: '#667781',
                                cursor: 'pointer',
                                fontSize: '0.9rem'
                            }}
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ChatPage;
