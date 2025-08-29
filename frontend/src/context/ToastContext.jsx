import React, { createContext, useContext, useCallback, useState, useMemo } from 'react';

const ToastContext = createContext(null);

export const useToast = () => useContext(ToastContext);

export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);

    const remove = useCallback((id) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    }, []);

    const show = useCallback((message, options = {}) => {
        const id = Math.random().toString(36).slice(2);
        const toast = {
            id,
            message,
            type: options.type || 'success',
            duration: options.duration ?? 2000,
        };
        setToasts(prev => [...prev, toast]);
        if (toast.duration > 0) {
            setTimeout(() => remove(id), toast.duration);
        }
        return id;
    }, [remove]);

    const value = useMemo(() => ({ show, remove }), [show, remove]);

    return (
        <ToastContext.Provider value={value}>
            {children}
            {/* Overlay + centered toast(s) */}
            {toasts.length > 0 && (
                <div className="fixed inset-0 z-[2000] flex items-center justify-center">
                    <div className="absolute inset-0 bg-black/30" />
                    <div className="relative flex flex-col items-center gap-3">
                        {toasts.map(t => (
                            <div
                                key={t.id}
                                className={`flex items-center gap-4 px-8 py-6 rounded-2xl shadow-xl border text-base font-medium bg-white ${t.type === 'success' ? 'border-green-200' : 'border-red-200'}`}
                                role="status"
                            >
                                <span className={`inline-flex h-12 w-12 items-center justify-center rounded-full ${t.type === 'success' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'} text-2xl`}>
                                    {t.type === 'success' ? '✓' : '!'}
                                </span>
                                <span className="text-gray-800">{t.message}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </ToastContext.Provider>
    );
};


