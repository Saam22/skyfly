import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBooking } from '../../context/BookingContext';
import AuthModal from '../../components/AuthModal/AuthModal';
import './Account.css';

export default function Account() {
  const { lang, user, logout, updateProfile, savedPassengers, removeSavedPassenger, trips, wishlist, toggleWishlist } = useBooking();
  const navigate = useNavigate();
  const ar = lang === 'ar';
  const [activeTab, setActiveTab] = useState('profile');
  const [showAuth, setShowAuth] = useState(!user);
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState({ name: '', phone: '' });

  useEffect(() => {
    document.title = ar ? 'SkyFly - حسابي' : 'SkyFly - My Account';
    if (user) setShowAuth(false);
  }, [user, ar]);

  useEffect(() => {
    if (user) setEditForm({ name: user.name || '', phone: user.phone || '' });
  }, [user]);

  if (!user) {
    return <div className="sky-account sky-page">{showAuth && <AuthModal onClose={() => navigate('/')} />}</div>;
  }

  const handleSaveProfile = () => {
    updateProfile(editForm);
    setEditing(false);
  };

  const tabs = ar
    ? [
        { key: 'profile', label: '👤 الملف الشخصي' },
        { key: 'passengers', label: '👥 المسافرون المحفوظون' },
        { key: 'wishlist', label: '❤️ المفضلة' },
        { key: 'stats', label: '📊 إحصائيات' },
      ]
    : [
        { key: 'profile', label: '👤 Profile' },
        { key: 'passengers', label: '👥 Saved Passengers' },
        { key: 'wishlist', label: '❤️ Wishlist' },
        { key: 'stats', label: '📊 Statistics' },
      ];

  const totalSpent = trips.reduce((s, t) => s + (t.totalPrice || 0), 0);
  const completedTrips = trips.filter(t => t.status === 'confirmed' && new Date(t.flight?.date) < new Date()).length;

  return (
    <div className="sky-account sky-page">
      <div className="sky-container">
        {/* Profile Header */}
        <div className="sky-account__header sky-card">
          <div className="sky-account__avatar">
            {user.avatar ? <img src={user.avatar} alt="" /> : <span>{user.name?.charAt(0) || '👤'}</span>}
          </div>
          <div className="sky-account__info">
            <h1 className="sky-h3">{user.name}</h1>
            <p className="sky-text-muted">{user.email} · {user.phone || ''}</p>
            <span className="sky-badge sky-badge-primary">{ar ? `عضو منذ ${new Date(user.memberSince).toLocaleDateString('ar-SA')}` : `Member since ${new Date(user.memberSince).toLocaleDateString()}`}</span>
          </div>
          <button className="sky-btn sky-btn-outline sky-btn-sm" onClick={logout}>
            🚪 {ar ? 'تسجيل خروج' : 'Logout'}
          </button>
        </div>

        {/* Tabs */}
        <div className="sky-account__tabs">
          {tabs.map(t => (
            <button key={t.key} className={`sky-account__tab ${activeTab === t.key ? 'sky-account__tab--active' : ''}`} onClick={() => setActiveTab(t.key)}>
              {t.label}
            </button>
          ))}
        </div>

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div className="sky-account__panel sky-card">
            <div className="sky-account__panel-header">
              <h2 className="sky-h4">{ar ? 'البيانات الشخصية' : 'Personal Information'}</h2>
              <button className="sky-btn sky-btn-ghost sky-btn-sm" onClick={() => setEditing(!editing)}>
                {editing ? (ar ? 'إلغاء' : 'Cancel') : (ar ? '✏️ تعديل' : '✏️ Edit')}
              </button>
            </div>
            <div className="sky-account__profile-form">
              <div className="sky-account__field">
                <label>{ar ? 'الاسم الكامل' : 'Full Name'}</label>
                <input className="sky-input" value={editForm.name} onChange={e => setEditForm({ ...editForm, name: e.target.value })} disabled={!editing} />
              </div>
              <div className="sky-account__field">
                <label>{ar ? 'البريد الإلكتروني' : 'Email'}</label>
                <input className="sky-input" value={user.email} disabled />
              </div>
              <div className="sky-account__field">
                <label>{ar ? 'رقم الهاتف' : 'Phone'}</label>
                <input className="sky-input" value={editForm.phone} onChange={e => setEditForm({ ...editForm, phone: e.target.value })} disabled={!editing} dir="ltr" />
              </div>
            </div>
            {editing && (
              <button className="sky-btn sky-btn-primary" onClick={handleSaveProfile}>
                💾 {ar ? 'حفظ التغييرات' : 'Save Changes'}
              </button>
            )}
          </div>
        )}

        {/* Saved Passengers Tab */}
        {activeTab === 'passengers' && (
          <div className="sky-account__panel sky-card">
            <div className="sky-account__panel-header">
              <h2 className="sky-h4">{ar ? 'المسافرون المحفوظون' : 'Saved Passengers'}</h2>
              <span className="sky-badge sky-badge-primary">{savedPassengers.length}</span>
            </div>
            {savedPassengers.length === 0 ? (
              <div className="sky-account__empty">
                <span>👤</span>
                <p>{ar ? 'لا يوجد مسافرين محفوظين' : 'No saved passengers'}</p>
                <p className="sky-text-muted">{ar ? 'احفظ بيانات المسافرين لتسريع الحجوزات القادمة' : 'Save passenger details for faster future bookings'}</p>
              </div>
            ) : (
              <div className="sky-account__pax-list">
                {savedPassengers.map(pax => (
                  <div key={pax.id} className="sky-account__pax-card">
                    <div className="sky-account__pax-avatar">{pax.firstName?.charAt(0) || '👤'}</div>
                    <div>
                      <strong>{pax.firstName} {pax.lastName}</strong>
                      <p className="sky-text-muted">{pax.nationality} · {pax.passport}</p>
                    </div>
                    <button className="sky-btn sky-btn-sm" style={{ background: 'rgba(239,68,68,0.1)', color: 'var(--sky-danger)' }} onClick={() => removeSavedPassenger(pax.id)}>
                      🗑️
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Wishlist Tab */}
        {activeTab === 'wishlist' && (
          <div className="sky-account__panel sky-card">
            <div className="sky-account__panel-header">
              <h2 className="sky-h4">{ar ? 'الرحلات المفضلة' : 'Wishlist'}</h2>
              <span className="sky-badge sky-badge-accent">{wishlist.length}</span>
            </div>
            {wishlist.length === 0 ? (
              <div className="sky-account__empty">
                <span>❤️</span>
                <p>{ar ? 'لا توجد رحلات في المفضلة' : 'No flights in wishlist'}</p>
                <button className="sky-btn sky-btn-primary" onClick={() => navigate('/search')}>
                  🔍 {ar ? 'ابحث عن رحلات' : 'Search Flights'}
                </button>
              </div>
            ) : (
              <div className="sky-account__wishlist-grid">
                {wishlist.map(id => (
                  <div key={id} className="sky-account__wishlist-item sky-card" onClick={() => navigate(`/flight/${id}`)}>
                    <span className="sky-account__wishlist-code">{id}</span>
                    <button className="sky-account__wishlist-remove" onClick={(e) => { e.stopPropagation(); toggleWishlist(id); }}>❤️</button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Stats Tab */}
        {activeTab === 'stats' && (
          <div className="sky-account__panel">
            <div className="sky-account__stats-grid">
              {[
                { icon: '✈️', value: trips.length, label: ar ? 'إجمالي الحجوزات' : 'Total Bookings' },
                { icon: '✅', value: completedTrips, label: ar ? 'رحلات منتهية' : 'Completed Trips' },
                { icon: '💰', value: `${totalSpent.toLocaleString()} ${ar ? 'ج.م' : 'EGP'}`, label: ar ? 'إجمالي الإنفاق' : 'Total Spent' },
                { icon: '⭐', value: '4.8', label: ar ? 'متوسط التقييم' : 'Avg Rating' },
              ].map((s, i) => (
                <div key={i} className="sky-account__stat-card sky-card">
                  <span className="sky-account__stat-icon">{s.icon}</span>
                  <strong className="sky-account__stat-value">{s.value}</strong>
                  <span className="sky-account__stat-label">{s.label}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
