import React, { useEffect } from 'react';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';

const Toast = ({ message, type = 'success', onClose, duration = 3000 }) => {
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => {
      onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [message, duration, onClose]);

  if (!message) return null;

  const isError = type === 'error';
  const isInfo = type === 'info';

  let icon = <CheckCircle size={20} color="#34D399" />;
  let bg = 'rgba(16, 185, 129, 0.15)';
  let borderColor = 'rgba(16, 185, 129, 0.4)';
  let textColor = '#ECFDF5';

  if (isError) {
    icon = <AlertCircle size={20} color="#F87171" />;
    bg = 'rgba(239, 68, 68, 0.15)';
    borderColor = 'rgba(239, 68, 68, 0.4)';
    textColor = '#FEF2F2';
  } else if (isInfo) {
    icon = <Info size={20} color="#60A5FA" />;
    bg = 'rgba(59, 130, 246, 0.15)';
    borderColor = 'rgba(59, 130, 246, 0.4)';
    textColor = '#EFF6FF';
  }

  return (
    <div style={styles.toastOverlay}>
      <div style={{
        ...styles.toastContainer,
        background: bg,
        borderColor: borderColor,
        color: textColor
      }}>
        <div style={styles.iconWrapper}>{icon}</div>
        <span style={styles.messageText}>{message}</span>
        <button onClick={onClose} style={styles.closeBtn} aria-label="Close notification">
          <X size={16} color={textColor} />
        </button>
      </div>
    </div>
  );
};

const styles = {
  toastOverlay: {
    position: 'fixed',
    top: '24px',
    left: '50%',
    transform: 'translateX(-50%)',
    zIndex: 2000,
    pointerEvents: 'none',
    width: '90%',
    maxWidth: '480px',
    display: 'flex',
    justifyContent: 'center',
  },
  toastContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    padding: '0.875rem 1.25rem',
    borderRadius: '14px',
    border: '1px solid',
    backdropFilter: 'blur(16px)',
    WebkitBackdropFilter: 'blur(16px)',
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)',
    pointerEvents: 'auto',
    animation: 'toastPopIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
    width: '100%',
  },
  iconWrapper: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  messageText: {
    flex: 1,
    fontSize: '0.9rem',
    fontWeight: 600,
    lineHeight: '1.4',
  },
  closeBtn: {
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
    padding: '0.2rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0.8,
    transition: 'opacity 0.2s ease',
  },
};

// Add animation keyframes dynamically
if (typeof window !== 'undefined') {
  const styleEl = document.createElement('style');
  styleEl.innerHTML = `
    @keyframes toastPopIn {
      from {
        opacity: 0;
        transform: translateY(-20px) scale(0.95);
      }
      to {
        opacity: 1;
        transform: translateY(0) scale(1);
      }
    }
  `;
  if (!document.getElementById('toast-animation-style')) {
    styleEl.id = 'toast-animation-style';
    document.head.appendChild(styleEl);
  }
}

export default Toast;
