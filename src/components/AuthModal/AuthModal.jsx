import { useState } from 'react';
import { useBooking } from '../../context/BookingContext';
import './AuthModal.css';

export default function AuthModal({ onClose }) {
  const { lang, login, signup } = useBooking();
  const ar = lang === 'ar';
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirmPassword: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const errs = {};
    if (!form.email || !/\S+@\S+\.\S+/.test(form.email)) errs.email = ar ? 'البريد الإلكتروني غير صحيح' : 'Invalid email';
    if (!form.password || form.password.length < 6) errs.password = ar ? 'كلمة المرور 6 أحرف على الأقل' : 'Password must be 6+ characters';
    if (mode === 'signup') {
      if (!form.name) errs.name = ar ? 'الاسم مطلوب' : 'Name is required';
      if (form.password !== form.confirmPassword) errs.confirmPassword = ar ? 'كلمة المرور غير متطابقة' : 'Passwords do not match';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setTimeout(() => {
      if (mode === 'login') login(form.email, form.password);
      else signup(form.name, form.email, form.phone);
      setLoading(false);
      onClose();
    }, 1000);
  };

  return (
    <div className="sky-auth-overlay" onClick={onClose}>
      <div className="sky-auth-modal" onClick={e => e.stopPropagation()}>
        <button className="sky-auth-close" onClick={onClose}>✕</button>

        <div className="sky-auth-header">
          <div className="sky-auth-logo">✈️</div>
          <h2>{ar ? (mode === 'login' ? 'تسجيل الدخول' : 'إنشاء حساب جديد') : (mode === 'login' ? 'Welcome Back' : 'Create Account')}</h2>
          <p className="sky-text-muted">
            {ar
              ? (mode === 'login' ? 'سجل دخولك لمتابعة حجوزاتك' : 'انضم إلى SkyFly مصر واستمتع بالمزايا')
              : (mode === 'login' ? 'Sign in to manage your bookings' : 'Join SkyFly Egypt and enjoy the benefits')}
          </p>
        </div>

        <form className="sky-auth-form" onSubmit={handleSubmit}>
          {mode === 'signup' && (
            <>
              <div className="sky-auth-field">
                <label>{ar ? 'الاسم الكامل' : 'Full Name'}</label>
                <input className={`sky-input ${errors.name ? 'sky-input--error' : ''}`} placeholder={ar ? 'محمد أحمد' : 'John Smith'} value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
                {errors.name && <span className="sky-auth-error">{errors.name}</span>}
              </div>
              <div className="sky-auth-field">
                <label>{ar ? 'رقم الهاتف' : 'Phone Number'}</label>
                <input className="sky-input" placeholder="+20 123 456 7890" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} dir="ltr" />
              </div>
            </>
          )}
          <div className="sky-auth-field">
            <label>{ar ? 'البريد الإلكتروني' : 'Email Address'}</label>
            <input className={`sky-input ${errors.email ? 'sky-input--error' : ''}`} type="email" placeholder="example@email.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} dir="ltr" />
            {errors.email && <span className="sky-auth-error">{errors.email}</span>}
          </div>
          <div className="sky-auth-field">
            <label>{ar ? 'كلمة المرور' : 'Password'}</label>
            <input className={`sky-input ${errors.password ? 'sky-input--error' : ''}`} type="password" placeholder="••••••••" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} dir="ltr" />
            {errors.password && <span className="sky-auth-error">{errors.password}</span>}
          </div>
          {mode === 'signup' && (
            <div className="sky-auth-field">
              <label>{ar ? 'تأكيد كلمة المرور' : 'Confirm Password'}</label>
              <input className={`sky-input ${errors.confirmPassword ? 'sky-input--error' : ''}`} type="password" placeholder="••••••••" value={form.confirmPassword} onChange={e => setForm({ ...form, confirmPassword: e.target.value })} dir="ltr" />
              {errors.confirmPassword && <span className="sky-auth-error">{errors.confirmPassword}</span>}
            </div>
          )}
          <button type="submit" className="sky-btn sky-btn-primary sky-btn-full sky-btn-lg" disabled={loading}>
            {loading ? (ar ? '⏳ جاري...' : '⏳ Loading...') : (ar ? (mode === 'login' ? 'تسجيل الدخول' : 'إنشاء حساب') : (mode === 'login' ? 'Sign In' : 'Create Account'))}
          </button>
        </form>

        <div className="sky-auth-divider">
          <span>{ar ? 'أو' : 'OR'}</span>
        </div>

        <div className="sky-auth-social">
          {['🇪🇬', '📧', '📱'].map((icon, i) => (
            <button key={i} className="sky-auth-social-btn">{icon}</button>
          ))}
        </div>
        <p className="sky-auth-switch">
          {ar ? (mode === 'login' ? 'ليس لديك حساب؟' : 'لديك حساب بالفعل؟') : (mode === 'login' ? "Don't have an account?" : 'Already have an account?')}
          {' '}
          <button className="sky-auth-switch-btn" onClick={() => { setMode(mode === 'login' ? 'signup' : 'login'); setErrors({}); }}>
            {ar ? (mode === 'login' ? 'إنشاء حساب' : 'تسجيل الدخول') : (mode === 'login' ? 'Sign Up' : 'Sign In')}
          </button>
        </p>
      </div>
    </div>
  );
}
