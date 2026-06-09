import { useState, useEffect, useCallback } from 'react';
import { useBooking } from '../../context/BookingContext';
import './Toast.css';

let toastId = 0;
let addToastGlobal = null;

export function showToast(message, type = 'info', duration = 4000) {
  if (addToastGlobal) addToastGlobal({ id: ++toastId, message, type, duration });
}

export default function Toast() {
  const { lang } = useBooking();
  const ar = lang === 'ar';
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((toast) => {
    setToasts(prev => [...prev, toast]);
  }, []);

  useEffect(() => {
    addToastGlobal = addToast;
    return () => { addToastGlobal = null; };
  }, [addToast]);

  useEffect(() => {
    if (toasts.length === 0) return;
    const latest = toasts[toasts.length - 1];
    const timer = setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== latest.id));
    }, latest.duration);
    return () => clearTimeout(timer);
  }, [toasts]);

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const ICONS = { success: '✅', error: '❌', warning: '⚠️', info: 'ℹ️' };
  const TITLES = {
    success: ar ? 'تم بنجاح' : 'Success',
    error: ar ? 'خطأ' : 'Error',
    warning: ar ? 'تنبيه' : 'Warning',
    info: ar ? 'تنبيه' : 'Info',
  };

  return (
    <div className="sky-toast-container" aria-live="polite">
      {toasts.map((t, i) => (
        <div
          key={t.id}
          className={`sky-toast sky-toast--${t.type}`}
          style={{ animationDelay: `${i * 0.1}s` }}
          role="alert"
        >
          <span className="sky-toast-icon">{ICONS[t.type]}</span>
          <div className="sky-toast-content">
            <strong>{TITLES[t.type]}</strong>
            <p>{t.message}</p>
          </div>
          <button className="sky-toast-close" onClick={() => removeToast(t.id)} aria-label="Close">✕</button>
        </div>
      ))}
    </div>
  );
}
