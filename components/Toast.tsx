'use client';

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useRef,
  useState,
} from 'react';
import { createPortal } from 'react-dom';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type ToastType = 'success' | 'error' | 'info' | 'warning';

interface ToastAction {
  label: string;
  onClick: () => void;
}

interface ToastOptions {
  type?: ToastType;
  duration?: number;
  action?: ToastAction;
}

interface ToastItem extends Required<Omit<ToastOptions, 'action'>> {
  id: string;
  message: string;
  action?: ToastAction;
  exiting: boolean;
}

interface ToastContextValue {
  toast: (message: string, options?: ToastOptions) => void;
}

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return ctx;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const MAX_TOASTS = 3;
const DEFAULT_DURATION = 4000;
const EXIT_DURATION = 300; // ms — must match CSS animation duration

const TYPE_COLORS: Record<ToastType, string> = {
  success: 'var(--color-green)',
  error: 'var(--color-red)',
  warning: 'var(--color-amber)',
  info: 'var(--accent)',
};

const TYPE_LABELS: Record<ToastType, string> = {
  success: 'Success',
  error: 'Error',
  warning: 'Warning',
  info: 'Info',
};

// ---------------------------------------------------------------------------
// Keyframe styles (injected once into <head>)
// ---------------------------------------------------------------------------

const TOAST_STYLES = `
@keyframes toast-enter {
  from {
    opacity: 0;
    transform: translateY(12px) scale(0.97);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes toast-exit {
  from {
    opacity: 1;
    transform: translateY(0) scale(1);
    max-height: 120px;
    margin-bottom: 8px;
  }
  to {
    opacity: 0;
    transform: translateY(8px) scale(0.96);
    max-height: 0;
    margin-bottom: 0;
  }
}

.toast-item {
  animation: toast-enter 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

.toast-item--exiting {
  animation: toast-exit ${EXIT_DURATION}ms cubic-bezier(0.4, 0, 1, 1) forwards;
  pointer-events: none;
  overflow: hidden;
}

.toast-container {
  position: fixed;
  bottom: 24px;
  right: 24px;
  z-index: 9999;
  display: flex;
  flex-direction: column-reverse;
  gap: 0;
  width: 360px;
  max-width: calc(100vw - 48px);
  pointer-events: none;
}

@media (max-width: 480px) {
  .toast-container {
    right: 50%;
    transform: translateX(50%);
    bottom: 16px;
    width: calc(100vw - 32px);
    max-width: 400px;
  }
}
`;

function useStyleInjection() {
  const injected = useRef(false);
  useEffect(() => {
    if (injected.current) return;
    injected.current = true;
    if (typeof document === 'undefined') return;
    if (document.getElementById('toast-keyframes')) return;
    const style = document.createElement('style');
    style.id = 'toast-keyframes';
    style.textContent = TOAST_STYLES;
    document.head.appendChild(style);
  }, []);
}

// ---------------------------------------------------------------------------
// Individual Toast card
// ---------------------------------------------------------------------------

interface ToastCardProps {
  item: ToastItem;
  onDismiss: (id: string) => void;
}

function ToastCard({ item, onDismiss }: ToastCardProps) {
  const barColor = TYPE_COLORS[item.type];
  const ariaLabel = `${TYPE_LABELS[item.type]}: ${item.message}`;

  return (
    <div
      role="alert"
      aria-live="polite"
      aria-atomic="true"
      aria-label={ariaLabel}
      className={`toast-item${item.exiting ? ' toast-item--exiting' : ''}`}
      style={{
        display: 'flex',
        alignItems: 'stretch',
        background: 'var(--bg-elevated)',
        border: '1px solid var(--border-default)',
        borderRadius: '10px',
        boxShadow: 'var(--shadow-modal)',
        overflow: 'hidden',
        pointerEvents: 'all',
        marginBottom: '8px',
        minWidth: 0,
        width: '100%',
      }}
    >
      {/* Colored indicator bar */}
      <div
        aria-hidden="true"
        style={{
          width: '4px',
          flexShrink: 0,
          background: barColor,
          borderRadius: '10px 0 0 10px',
        }}
      />

      {/* Content */}
      <div
        style={{
          flex: 1,
          padding: '12px 8px 12px 12px',
          display: 'flex',
          flexDirection: 'column',
          gap: '6px',
          minWidth: 0,
        }}
      >
        <p
          style={{
            margin: 0,
            fontSize: '14px',
            lineHeight: '1.45',
            color: 'var(--text-1)',
            wordBreak: 'break-word',
          }}
        >
          {item.message}
        </p>

        {item.action && (
          <button
            type="button"
            onClick={() => {
              item.action!.onClick();
              onDismiss(item.id);
            }}
            style={{
              alignSelf: 'flex-start',
              background: 'none',
              border: 'none',
              padding: '2px 0',
              cursor: 'pointer',
              fontSize: '13px',
              fontWeight: 600,
              color: barColor,
              textDecoration: 'underline',
              textUnderlineOffset: '2px',
            }}
          >
            {item.action.label}
          </button>
        )}
      </div>

      {/* Close button */}
      <button
        type="button"
        aria-label="Dismiss notification"
        onClick={() => onDismiss(item.id)}
        style={{
          flexShrink: 0,
          alignSelf: 'flex-start',
          background: 'none',
          border: 'none',
          padding: '10px 10px 10px 4px',
          cursor: 'pointer',
          color: 'var(--text-2)',
          lineHeight: 1,
          fontSize: '18px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          opacity: 0.7,
          transition: 'opacity 0.15s',
        }}
        onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.opacity = '1')}
        onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.opacity = '0.7')}
      >
        ×
      </button>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Provider
// ---------------------------------------------------------------------------

let uidCounter = 0;
function nextId(): string {
  return `toast-${++uidCounter}-${Date.now()}`;
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  useStyleInjection();

  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const timersRef = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());

  const scheduleExit = useCallback((id: string, delay: number) => {
    const timer = setTimeout(() => {
      // Mark as exiting
      setToasts((prev) =>
        prev.map((t) => (t.id === id ? { ...t, exiting: true } : t))
      );
      // Remove after animation
      const removeTimer = setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
        timersRef.current.delete(id);
      }, EXIT_DURATION);
      timersRef.current.set(id, removeTimer);
    }, delay);
    timersRef.current.set(id, timer);
  }, []);

  const dismiss = useCallback(
    (id: string) => {
      const existing = timersRef.current.get(id);
      if (existing) {
        clearTimeout(existing);
        timersRef.current.delete(id);
      }
      setToasts((prev) =>
        prev.map((t) => (t.id === id ? { ...t, exiting: true } : t))
      );
      const removeTimer = setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
        timersRef.current.delete(id);
      }, EXIT_DURATION);
      timersRef.current.set(id, removeTimer);
    },
    []
  );

  const toast = useCallback(
    (message: string, options: ToastOptions = {}) => {
      const { type = 'info', duration = DEFAULT_DURATION, action } = options;
      const id = nextId();

      setToasts((prev) => {
        const visible = prev.filter((t) => !t.exiting);
        let next = [...prev];

        // If at or over limit, trigger exit on the oldest visible toast
        if (visible.length >= MAX_TOASTS) {
          const oldest = visible[visible.length - 1];
          next = next.map((t) =>
            t.id === oldest.id ? { ...t, exiting: true } : t
          );
          // Schedule actual removal for the oldest
          const existingTimer = timersRef.current.get(oldest.id);
          if (existingTimer) clearTimeout(existingTimer);
          const removeTimer = setTimeout(() => {
            setToasts((p) => p.filter((t) => t.id !== oldest.id));
            timersRef.current.delete(oldest.id);
          }, EXIT_DURATION);
          timersRef.current.set(oldest.id, removeTimer);
        }

        const newItem: ToastItem = { id, message, type, duration, action, exiting: false };
        return [newItem, ...next];
      });

      scheduleExit(id, duration);
    },
    [scheduleExit]
  );

  // Clean up all timers on unmount
  useEffect(() => {
    const timers = timersRef.current;
    return () => {
      timers.forEach((t) => clearTimeout(t));
      timers.clear();
    };
  }, []);

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const contextValue: ToastContextValue = { toast };

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
      {mounted &&
        createPortal(
          <div className="toast-container" aria-label="Notifications">
            {toasts.map((item) => (
              <ToastCard key={item.id} item={item} onDismiss={dismiss} />
            ))}
          </div>,
          document.body
        )}
    </ToastContext.Provider>
  );
}
