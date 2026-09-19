import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';

const ToastContext = createContext(null);

const TOAST_LIMIT = 5;
const TOAST_REMOVE_DELAY = 5000;

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback((message, type = 'info') => {
    const id = Date.now() + Math.random();
    const toast = { id, message, type };

    setToasts((prev) => [...prev, toast].slice(-TOAST_LIMIT));

    setTimeout(() => {
      removeToast(id);
    }, TOAST_REMOVE_DELAY);

    return id;
  }, [removeToast]);

  const toast = useMemo(() => ({
    default: (message) => addToast(message, 'default'),
    success: (message) => addToast(message, 'success'),
    error: (message) => addToast(message, 'error'),
    warning: (message) => addToast(message, 'warning'),
    info: (message) => addToast(message, 'info'),
  }), [addToast]);

  return (
    <ToastContext.Provider value={{ toasts, toast, removeToast }}>
      {children}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </ToastContext.Provider>
  );
};

const ToastContainer = ({ toasts, onRemove }) => {
  if (toasts.length === 0) return null;

  return (
    <div
      className="toast-container"
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        pointerEvents: 'none',
      }}
    >
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onRemove={onRemove} />
      ))}
    </div>
  );
};

const ToastItem = ({ toast, onRemove }) => {
  const typeStyles = {
    success: { background: 'var(--success-bg)', border: '1px solid var(--success-border)', color: 'var(--success-text)', icon: '✓' },
    error: { background: 'var(--danger-bg)', border: '1px solid var(--danger-border)', color: 'var(--danger-text)', icon: '✕' },
    warning: { background: 'var(--warning-bg)', border: '1px solid var(--warning-border)', color: 'var(--warning-text)', icon: '⚠' },
    info: { background: 'var(--info-bg)', border: '1px solid var(--info-border)', color: 'var(--info-text)', icon: 'ℹ' },
    default: { background: 'var(--bg-card)', border: '1px solid var(--border-light)', color: 'var(--text-main)', icon: 'ℹ' },
  };

  const style = typeStyles[toast.type] || typeStyles.default;

  return (
    <div
      className="toast-item"
      style={{
        pointerEvents: 'auto',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '14px 18px',
        borderRadius: 'var(--radius-md)',
        boxShadow: 'var(--shadow-lg)',
        minWidth: '280px',
        maxWidth: '420px',
        background: style.background,
        border: style.border,
        color: style.color,
        animation: 'slideIn 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      }}
    >
      <span style={{ fontSize: '18px', fontWeight: 'bold', flexShrink: 0 }}>{style.icon}</span>
      <p style={{ margin: 0, fontSize: '14px', fontWeight: 500, lineHeight: 1.4, flex: 1 }}>{toast.message}</p>
      <button
        onClick={() => onRemove(toast.id)}
        style={{
          background: 'transparent',
          border: 'none',
          color: 'inherit',
          opacity: 0.6,
          cursor: 'pointer',
          padding: '4px',
          fontSize: '18px',
          lineHeight: 1,
          flexShrink: 0,
        }}
        aria-label="Close"
      >
        ×
      </button>
    </div>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context.toast;
};