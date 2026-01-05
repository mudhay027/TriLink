import { useState, useCallback } from 'react';

export const useToast = () => {
    const [toast, setToast] = useState(null);

    const showToast = useCallback((message, type = 'info', duration = 3000) => {
        setToast({ message, type, duration });
    }, []);

    const hideToast = useCallback(() => {
        setToast(null);
    }, []);

    const showSuccess = useCallback((message) => showToast(message, 'success'), [showToast]);
    const showError = useCallback((message) => showToast(message, 'error'), [showToast]);
    const showWarning = useCallback((message) => showToast(message, 'warning'), [showToast]);
    const showInfo = useCallback((message) => showToast(message, 'info'), [showToast]);

    return {
        toast,
        showToast,
        hideToast,
        showSuccess,
        showError,
        showWarning,
        showInfo
    };
};

export const useConfirm = () => {
    const [confirmState, setConfirmState] = useState({
        isOpen: false,
        title: '',
        message: '',
        onConfirm: () => { },
        confirmText: 'Confirm',
        cancelText: 'Cancel',
        confirmColor: '#ef4444'
    });

    const showConfirm = useCallback(({
        title = 'Confirm Action',
        message = 'Are you sure you want to proceed?',
        onConfirm = () => { },
        confirmText = 'Confirm',
        cancelText = 'Cancel',
        confirmColor = '#ef4444'
    }) => {
        setConfirmState({
            isOpen: true,
            title,
            message,
            onConfirm,
            confirmText,
            cancelText,
            confirmColor
        });
    }, []);

    const hideConfirm = useCallback(() => {
        setConfirmState(prev => ({ ...prev, isOpen: false }));
    }, []);

    return {
        confirmState,
        showConfirm,
        hideConfirm
    };
};
