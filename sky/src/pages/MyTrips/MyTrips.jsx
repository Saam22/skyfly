import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBooking } from '../../context/BookingContext';
import './MyTrips.css';

export default function MyTrips() {
  const { trips, cancelTrip, lang } = useBooking();
  const navigate = useNavigate();
  const ar = lang === 'ar';

  const [activeTab, setActiveTab] = useState('upcoming');
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [cancelConfirm, setCancelConfirm] = useState(null);
  const [showBoardingPass, setShowBoardingPass] = useState(null);

  useEffect(() => {
    document.title = ar ? 'SkyFly - رحلاتي' : 'SkyFly - My Trips';
  }, [ar]);

  const now = new Date();
  const upcoming = trips.filter(t => t.status === 'confirmed' && new Date(t.flight?.date) >= now);
  const past = trips.filter(t => t.status === 'confirmed' && new Date(t.flight?.date) < now);
  const cancelled = trips.filter(t => t.status === 'cancelled');

  const TABS = [
    { key: 'upcoming', ar: 'القادمة', en: 'Upcoming', count: upcoming.length },
    { key: 'past', ar: 'المنتهية', en: 'Past', count: past.length },
    { key: 'cancelled', ar: 'الملغاة', en: 'Cancelled', count: cancelled.length },
  ];

  const displayTrips = activeTab === 'upcoming' ? upcoming : activeTab === 'past' ? past : cancelled;

  const handleCancel = (tripId) => {
    cancelTrip(tripId);
    setCancelConfirm(null);
  };

  return (
    <div className="sky-mytrips sky-page">
      <div className="sky-container">
        {/* Header */}
        <div className="sky-mytrips__header">
          <div>
            <h1 className="sky-h2">{ar ? '✈ رحلاتي' : '✈ My Trips'}</h1>
            <p className="sky-text-muted">{ar ? 'إدارة وتتبع جميع حجوزاتك' : 'Manage and track all your bookings'}</p>
          </div>
          <button id="btn-new-booking" className="sky-btn sky-btn-primary" onClick={() => navigate('/search')}>
            {ar ? '+ حجز جديد' : '+ New Booking'}
          </button>
        </div>

        {/* Stats */}
        <div className="sky-mytrips__stats">
          {[
            { icon: '🎫', value: trips.length, label: ar ? 'إجمالي الحجوزات' : 'Total Bookings' },
            { icon: '✈', value: upcoming.length, label: ar ? 'رحلات قادمة' : 'Upcoming Flights' },
            { icon: '🌍', value: [...new Set(trips.map(t => t.flight?.to?.code))].length, label: ar ? 'وجهات مختلفة' : 'Destinations' },
            { icon: '💰', value: trips.reduce((s, t) => s + (t.totalPrice || 0), 0).toLocaleString() + (ar ? ' ج.م' : ' EGP'), label: ar ? 'إجمالي الإنفاق' : 'Total Spent' },
          ].map(s => (
            <div key={s.label} className="sky-mytrips__stat sky-card">
              <span className="sky-mytrips__stat-icon">{s.icon}</span>
              <strong className="sky-mytrips__stat-value">{s.value}</strong>
              <span className="sky-mytrips__stat-label">{s.label}</span>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="sky-mytrips__tabs">
          {TABS.map(t => (
            <button
              key={t.key}
              id={`trips-tab-${t.key}`}
              className={`sky-mytrips__tab ${activeTab === t.key ? 'sky-mytrips__tab--active' : ''}`}
              onClick={() => setActiveTab(t.key)}
            >
              {ar ? t.ar : t.en}
              {t.count > 0 && <span className="sky-navbar__badge">{t.count}</span>}
            </button>
          ))}
        </div>

        {/* Trips List */}
        <div className="sky-mytrips__list">
          {displayTrips.length === 0 ? (
            <div className="sky-mytrips__empty">
              <span>✈️</span>
              <h3>{ar ? 'لا توجد رحلات' : 'No trips found'}</h3>
              <p>{ar ? 'لم تقم بأي حجوزات بعد في هذه الفئة' : "You haven't made any bookings in this category"}</p>
              {activeTab === 'upcoming' && (
                <button className="sky-btn sky-btn-primary" onClick={() => navigate('/search')}>
                  {ar ? '🔍 ابحث عن رحلة' : '🔍 Find a Flight'}
                </button>
              )}
            </div>
          ) : (
            displayTrips.map(trip => (
              <article key={trip.id} className={`sky-mytrips__trip-card sky-card ${activeTab === 'cancelled' ? 'sky-mytrips__trip-card--cancelled' : ''}`} id={`trip-${trip.id}`}>
                <div className="sky-mytrips__trip-header">
                  <div className="sky-mytrips__trip-ref">
                    <span className="sky-label">{ar ? 'رقم الحجز' : 'Booking Ref'}</span>
                    <strong>{trip.bookingRef}</strong>
                  </div>
                  <div className="sky-mytrips__trip-status">
                    <span className={`sky-badge ${activeTab === 'cancelled' ? 'sky-badge-danger' : new Date(trip.flight?.date) < now ? 'sky-badge-primary' : 'sky-badge-success'}`}>
                      {activeTab === 'cancelled' ? (ar ? '❌ ملغاة' : '❌ Cancelled') : new Date(trip.flight?.date) < now ? (ar ? '✓ منتهية' : '✓ Completed') : (ar ? '✓ مؤكدة' : '✓ Confirmed')}
                    </span>
                  </div>
                </div>

                {/* Flight Info */}
                {trip.flight && (
                  <div className="sky-mytrips__trip-route">
                    <div className="sky-mytrips__trip-airline" style={{ background: (trip.flight.airlineColor || '#0066cc') + '18', color: trip.flight.airlineColor || '#0066cc' }}>
                      {trip.flight.airlineCode}
                    </div>
                    <div className="sky-mytrips__trip-cities">
                      <div className="sky-mytrips__trip-city">
                        <strong>{trip.flight.from?.time}</strong>
                        <span>{trip.flight.from?.code}</span>
                        <small>{trip.flight.from?.city}</small>
                      </div>
                      <div className="sky-mytrips__trip-journey">
                        <span className="sky-mytrips__trip-duration">{trip.flight.duration}</span>
                        <div className="sky-mytrips__trip-line">
                          <span className="sky-mytrips__trip-dot" />
                          <div className="sky-mytrips__trip-bar">✈</div>
                          <span className="sky-mytrips__trip-dot" />
                        </div>
                        <span className={`sky-badge ${trip.flight.stops === 0 ? 'sky-badge-success' : 'sky-badge-warning'}`}>
                          {trip.flight.stops === 0 ? (ar ? 'مباشر' : 'Direct') : `${trip.flight.stops} ${ar ? 'محطة' : 'stop'}`}
                        </span>
                      </div>
                      <div className="sky-mytrips__trip-city">
                        <strong>{trip.flight.to?.time}</strong>
                        <span>{trip.flight.to?.code}</span>
                        <small>{trip.flight.to?.city}</small>
                      </div>
                    </div>
                  </div>
                )}

                {/* Details Row */}
                <div className="sky-mytrips__trip-details">
                  <div className="sky-mytrips__trip-detail">
                    <span>📅</span>
                    <div>
                      <small>{ar ? 'تاريخ الرحلة' : 'Flight Date'}</small>
                      <strong>{trip.flight?.date ? new Date(trip.flight.date + 'T00:00:00').toLocaleDateString(ar ? 'ar-SA' : 'en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : '—'}</strong>
                    </div>
                  </div>
                  <div className="sky-mytrips__trip-detail">
                    <span>👤</span>
                    <div>
                      <small>{ar ? 'المسافرون' : 'Passengers'}</small>
                      <strong>{trip.passengers?.length || 1} {ar ? 'مسافر' : 'passenger(s)'}</strong>
                    </div>
                  </div>
                  {trip.selectedSeats?.length > 0 && (
                    <div className="sky-mytrips__trip-detail">
                      <span>💺</span>
                      <div>
                        <small>{ar ? 'المقاعد' : 'Seats'}</small>
                        <strong>{trip.selectedSeats.join(', ')}</strong>
                      </div>
                    </div>
                  )}
                  <div className="sky-mytrips__trip-detail">
                    <span>💰</span>
                    <div>
                      <small>{ar ? 'المبلغ المدفوع' : 'Amount Paid'}</small>
                      <strong className="sky-text-accent">{trip.totalPrice?.toLocaleString()} {ar ? 'ج.م' : 'EGP'}</strong>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                {activeTab !== 'cancelled' && (
                  <div className="sky-mytrips__trip-actions">
                    <button
                      id={`btn-boarding-${trip.id}`}
                      className="sky-btn sky-btn-primary sky-btn-sm"
                      onClick={() => setShowBoardingPass(trip)}
                    >
                      🎫 {ar ? 'بطاقة الصعود' : 'Boarding Pass'}
                    </button>
                    {activeTab === 'upcoming' && (
                      <>
                        <button className="sky-btn sky-btn-outline sky-btn-sm">
                          ✏️ {ar ? 'تعديل' : 'Modify'}
                        </button>
                        <button
                          id={`btn-cancel-${trip.id}`}
                          className="sky-btn sky-btn-sm"
                          style={{ background: 'rgba(239,68,68,0.1)', color: 'var(--sky-danger)', border: '1px solid rgba(239,68,68,0.3)' }}
                          onClick={() => setCancelConfirm(trip.id)}
                        >
                          ❌ {ar ? 'إلغاء' : 'Cancel'}
                        </button>
                      </>
                    )}
                  </div>
                )}
              </article>
            ))
          )}
        </div>
      </div>

      {/* Cancel Confirm Modal */}
      {cancelConfirm && (
        <div className="sky-modal-overlay" onClick={() => setCancelConfirm(null)}>
          <div className="sky-modal" onClick={e => e.stopPropagation()}>
            <h3 className="sky-h4">⚠️ {ar ? 'تأكيد الإلغاء' : 'Confirm Cancellation'}</h3>
            <p>{ar ? 'هل أنت متأكد من إلغاء هذا الحجز؟ قد تطبق رسوم إلغاء.' : 'Are you sure you want to cancel this booking? Cancellation fees may apply.'}</p>
            <div className="sky-modal-actions">
              <button className="sky-btn sky-btn-ghost" onClick={() => setCancelConfirm(null)}>{ar ? 'تراجع' : 'Go Back'}</button>
              <button id="confirm-cancel-btn" className="sky-btn" style={{ background: 'var(--sky-danger)', color: 'white' }} onClick={() => handleCancel(cancelConfirm)}>
                {ar ? 'نعم، إلغاء الحجز' : 'Yes, Cancel Booking'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Boarding Pass Modal */}
      {showBoardingPass && (
        <div className="sky-modal-overlay" onClick={() => setShowBoardingPass(null)}>
          <div className="sky-modal sky-boarding-pass" onClick={e => e.stopPropagation()}>
            <div className="sky-boarding-pass__top">
              <div className="sky-boarding-pass__logo">✈ SkyFly</div>
              <span className="sky-badge sky-badge-success">{ar ? 'مؤكدة' : 'Confirmed'}</span>
            </div>
            <div className="sky-boarding-pass__route">
              <div className="sky-boarding-pass__city">
                <strong>{showBoardingPass.flight?.from?.code}</strong>
                <small>{showBoardingPass.flight?.from?.city}</small>
                <span>{showBoardingPass.flight?.from?.time}</span>
              </div>
              <div className="sky-boarding-pass__divider">✈ ─────</div>
              <div className="sky-boarding-pass__city sky-boarding-pass__city--right">
                <strong>{showBoardingPass.flight?.to?.code}</strong>
                <small>{showBoardingPass.flight?.to?.city}</small>
                <span>{showBoardingPass.flight?.to?.time}</span>
              </div>
            </div>
            <div className="sky-boarding-pass__details">
              {[
                { label: ar ? 'المسافر' : 'Passenger', val: showBoardingPass.passengers?.[0]?.name || showBoardingPass.passengers?.[0]?.firstName + ' ' + (showBoardingPass.passengers?.[0]?.lastName || '') || '—' },
                { label: ar ? 'رقم الرحلة' : 'Flight', val: showBoardingPass.flight?.flightNumber },
                { label: ar ? 'التاريخ' : 'Date', val: showBoardingPass.flight?.date },
                { label: ar ? 'المقعد' : 'Seat', val: showBoardingPass.selectedSeats?.[0] || '—' },
                { label: ar ? 'الحجز' : 'Booking', val: showBoardingPass.bookingRef },
              ].map(d => (
                <div key={d.label} className="sky-boarding-pass__detail-item">
                  <small>{d.label}</small>
                  <strong>{d.val}</strong>
                </div>
              ))}
            </div>
            <div className="sky-boarding-pass__barcode">
              ▮▯▮▮▯▮▯▯▮▯▮▮▯▮▯▮▯▮▯▯▮
            </div>
            <button className="sky-btn sky-btn-primary sky-btn-full" onClick={() => window.print()}>
              🖨️ {ar ? 'طباعة / تنزيل' : 'Print / Download'}
            </button>
            <button className="sky-btn sky-btn-ghost sky-btn-full" onClick={() => setShowBoardingPass(null)}>
              {ar ? 'إغلاق' : 'Close'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
