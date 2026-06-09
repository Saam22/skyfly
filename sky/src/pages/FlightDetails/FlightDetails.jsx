import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useBooking } from '../../context/BookingContext';
import { getFlightById } from '../../data/flightsData';
import './FlightDetails.css';

const TABS = [
  { key: 'overview', ar: 'نظرة عامة', en: 'Overview' },
  { key: 'cabin', ar: 'تفاصيل المقصورة', en: 'Cabin Details' },
  { key: 'baggage', ar: 'الأمتعة', en: 'Baggage' },
  { key: 'services', ar: 'الخدمات', en: 'Services' },
];

export default function FlightDetails() {
  const { id } = useParams();
  const { booking, selectFlight, lang } = useBooking();
  const navigate = useNavigate();
  const ar = lang === 'ar';

  const [activeTab, setActiveTab] = useState('overview');
  const [selectedClass, setSelectedClass] = useState('economy');

  const flight = booking.flight?.id === id ? booking.flight : getFlightById(id);

  useEffect(() => {
    if (!flight) { navigate('/search'); return; }
    if (flight) selectFlight(flight);
    document.title = `SkyFly - ${flight?.airline || ''} ${flight?.flightNumber || ''}`;
  }, [id]);

  if (!flight) return null;

  const classPrice = flight.price[selectedClass];

  const CABIN_CLASSES = [
    { key: 'economy', label: ar ? 'اقتصادي' : 'Economy', icon: '💺', price: flight.price.economy, features: [ar ? 'مقعد قياسي' : 'Standard seat', ar ? '7 كجم أمتعة مقصورة' : '7kg cabin bag', ar ? '30 كجم أمتعة مسجلة' : '30kg checked baggage', ar ? 'وجبة مجانية' : 'Free meal'] },
    { key: 'business', label: ar ? 'رجال أعمال' : 'Business', icon: '🛋️', price: flight.price.business, features: [ar ? 'مقعد قابل للتحويل لسرير' : 'Lie-flat seat', ar ? 'قاعدة عرض خاصة' : 'Private entertainment', ar ? '40 كجم أمتعة' : '40kg baggage', ar ? 'وجبات ومشروبات فاخرة' : 'Fine dining & drinks', ar ? 'دخول الصالة' : 'Lounge access'] },
    { key: 'first', label: ar ? 'درجة أولى' : 'First Class', icon: '👑', price: flight.price.first, features: [ar ? 'جناح خاص' : 'Private suite', ar ? '50 كجم أمتعة' : '50kg baggage', ar ? 'خدمة شخصية' : 'Personal concierge', ar ? 'وجبات مشيف خاص' : 'Private chef meals', ar ? 'منامة فاخرة' : 'Luxury sleepwear', ar ? 'دخول الصالة الأولى' : 'First class lounge'] },
  ];

  return (
    <div className="sky-flight-details sky-page">
      <div className="sky-container">
        {/* Back */}
        <button className="sky-flight-details__back" onClick={() => navigate('/search')}>
          ← {ar ? 'العودة للنتائج' : 'Back to results'}
        </button>

        {/* Header */}
        <div className="sky-flight-details__header sky-card">
          <div className="sky-flight-details__airline">
            <div className="sky-flight-details__airline-logo" style={{ background: flight.airlineColor + '18', color: flight.airlineColor }}>
              {flight.airlineCode}
            </div>
            <div>
              <h1 className="sky-h3">{flight.airline}</h1>
              <p className="sky-flight-details__subtitle">
                {flight.flightNumber} · {flight.aircraft} · ⭐ {flight.rating} · {ar ? `${flight.onTime}% في الموعد` : `${flight.onTime}% on time`}
              </p>
            </div>
          </div>

          {/* Route Summary */}
          <div className="sky-flight-details__route">
            <div className="sky-flight-details__city">
              <span className="sky-flight-details__time">{flight.from.time}</span>
              <span className="sky-flight-details__code">{flight.from.code}</span>
              <span className="sky-flight-details__city-name">{flight.from.city}</span>
              <span className="sky-flight-details__airport">{flight.from.airport}</span>
            </div>

            <div className="sky-flight-details__journey-center">
              <span className="sky-flight-details__duration">{flight.duration}</span>
              <div className="sky-flight-details__line">
                <div className="sky-flight-details__dot" />
                <div className="sky-flight-details__bar">
                  {flight.stops > 0 && flight.stopDetails.map(s => (
                    <div key={s.code} className="sky-flight-details__stop-marker">
                      <div className="sky-flight-details__stop-dot" />
                      <span>{s.city}</span>
                    </div>
                  ))}
                  <span className="sky-flight-details__plane-icon">✈</span>
                </div>
                <div className="sky-flight-details__dot" />
              </div>
              <span className={`sky-flight-details__stops-badge ${flight.stops === 0 ? 'sky-badge-success' : 'sky-badge-warning'} sky-badge`}>
                {flight.stops === 0 ? (ar ? '✓ مباشر' : '✓ Direct') : `${flight.stops} ${ar ? 'محطة' : 'stop'}`}
              </span>
            </div>

            <div className="sky-flight-details__city sky-flight-details__city--right">
              <span className="sky-flight-details__time">{flight.to.time}</span>
              <span className="sky-flight-details__code">{flight.to.code}</span>
              <span className="sky-flight-details__city-name">{flight.to.city}</span>
              <span className="sky-flight-details__airport">{flight.to.airport}</span>
            </div>
          </div>
        </div>

        <div className="sky-flight-details__body">
          {/* TABS */}
          <div className="sky-flight-details__tabs-section">
            <div className="sky-flight-details__tabs">
              {TABS.map(t => (
                <button
                  key={t.key}
                  id={`tab-${t.key}`}
                  className={`sky-flight-details__tab ${activeTab === t.key ? 'sky-flight-details__tab--active' : ''}`}
                  onClick={() => setActiveTab(t.key)}
                >
                  {ar ? t.ar : t.en}
                </button>
              ))}
            </div>

            <div className="sky-flight-details__tab-content">
              {/* OVERVIEW */}
              {activeTab === 'overview' && (
                <div className="sky-animate-fade">
                  <h2 className="sky-h4" style={{ marginBottom: 16 }}>{ar ? 'مميزات الرحلة' : 'Flight Amenities'}</h2>
                  <div className="sky-flight-details__amenities">
                    {flight.features.map(f => (
                      <div key={f} className="sky-flight-details__amenity">
                        <span className="sky-flight-details__amenity-icon">✓</span>
                        <span>{f}</span>
                      </div>
                    ))}
                  </div>
                  {flight.stops > 0 && (
                    <div style={{ marginTop: 24 }}>
                      <h2 className="sky-h4" style={{ marginBottom: 12 }}>{ar ? 'تفاصيل المحطات' : 'Stopover Details'}</h2>
                      {flight.stopDetails.map(s => (
                        <div key={s.code} className="sky-flight-details__stop-card">
                          <span className="sky-badge sky-badge-warning">🔄 {ar ? 'توقف' : 'Stopover'}</span>
                          <strong>{s.city} ({s.code})</strong>
                          <span>{ar ? 'مدة الانتظار:' : 'Layover:'} {s.duration}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* CABIN */}
              {activeTab === 'cabin' && (
                <div className="sky-animate-fade">
                  <h2 className="sky-h4" style={{ marginBottom: 16 }}>{ar ? 'اختر درجة السفر' : 'Choose Travel Class'}</h2>
                  <div className="sky-flight-details__classes">
                    {CABIN_CLASSES.filter(c => c.price).map(c => (
                      <div
                        key={c.key}
                        id={`cabin-${c.key}`}
                        className={`sky-flight-details__class-card ${selectedClass === c.key ? 'sky-flight-details__class-card--active' : ''}`}
                        onClick={() => setSelectedClass(c.key)}
                      >
                        <div className="sky-flight-details__class-icon">{c.icon}</div>
                        <h3 className="sky-h4">{c.label}</h3>
                        <div className="sky-price" style={{ margin: '8px 0' }}>
                          <span className="sky-price-amount">{c.price?.toLocaleString()}</span>
                          <span className="sky-price-currency">{ar ? 'ج.م' : 'EGP'}</span>
                        </div>
                        <ul className="sky-flight-details__class-features">
                          {c.features.map(f => <li key={f}>✓ {f}</li>)}
                        </ul>
                        {selectedClass === c.key && (
                          <div className="sky-flight-details__class-selected">✓ {ar ? 'محدد' : 'Selected'}</div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* BAGGAGE */}
              {activeTab === 'baggage' && (
                <div className="sky-animate-fade">
                  <h2 className="sky-h4" style={{ marginBottom: 16 }}>{ar ? 'سياسة الأمتعة' : 'Baggage Policy'}</h2>
                  <div className="sky-flight-details__baggage-grid">
                    {[
                      { icon: '👜', title: ar ? 'حقيبة شخصية' : 'Personal Item', desc: ar ? 'تحت المقعد' : 'Under the seat', limit: '5 كجم', free: true },
                      { icon: '🧳', title: ar ? 'حقيبة المقصورة' : 'Cabin Baggage', desc: ar ? 'صندوق أعلى المقعد' : 'Overhead bin', limit: flight.baggage.cabin, free: true },
                      { icon: '🗃️', title: ar ? 'الأمتعة المسجلة' : 'Checked Baggage', desc: ar ? 'أمتعة إضافية مؤمنة' : 'Stored in cargo', limit: flight.baggage.checked, free: true },
                      { icon: '➕', title: ar ? 'أمتعة إضافية' : 'Extra Baggage', desc: ar ? 'أمتعة زائدة عن الحد' : 'Overweight/extra pieces', limit: ar ? 'بسعر إضافي' : 'Additional fee', free: false },
                    ].map(b => (
                      <div key={b.title} className="sky-flight-details__baggage-item">
                        <span className="sky-flight-details__baggage-icon">{b.icon}</span>
                        <div>
                          <h4>{b.title}</h4>
                          <p>{b.desc}</p>
                          <span className={`sky-badge ${b.free ? 'sky-badge-success' : 'sky-badge-warning'}`}>
                            {b.free ? (ar ? '✓ مجاني' : '✓ Free') : (ar ? '💳 مدفوع' : '💳 Paid')} · {b.limit}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* SERVICES */}
              {activeTab === 'services' && (
                <div className="sky-animate-fade">
                  <h2 className="sky-h4" style={{ marginBottom: 16 }}>{ar ? 'الخدمات الإضافية' : 'Additional Services'}</h2>
                  <div className="sky-flight-details__services-grid">
                    {[
                      { icon: '🍽️', title: ar ? 'الوجبات الخاصة' : 'Special Meals', desc: ar ? 'حلال، نباتي، خالٍ من الجلوتين' : 'Halal, Vegetarian, Gluten-free', price: ar ? 'مجاني' : 'Free' },
                      { icon: '💺', title: ar ? 'اختيار المقعد' : 'Seat Selection', desc: ar ? 'اختر مقعدك المفضل مسبقاً' : 'Pre-select your preferred seat', price: ar ? 'من 50 ج.م' : 'From 50 EGP' },
                      { icon: '📡', title: 'WiFi', desc: ar ? 'إنترنت عالي السرعة على متن الطائرة' : 'High-speed internet onboard', price: ar ? 'من 80 ج.م' : 'From 80 EGP' },
                      { icon: '🛡️', title: ar ? 'تأمين السفر' : 'Travel Insurance', desc: ar ? 'تغطية شاملة لرحلتك' : 'Comprehensive trip coverage', price: ar ? 'من 120 ج.م' : 'From 120 EGP' },
                      { icon: '🚖', title: ar ? 'نقل من/إلى المطار' : 'Airport Transfer', desc: ar ? 'توصيل خاص من وإلى المطار' : 'Private transfer to/from airport', price: ar ? 'من 150 ج.م' : 'From 150 EGP' },
                      { icon: '🏨', title: ar ? 'فندق خلال التوقف' : 'Transit Hotel', desc: ar ? 'فندق فاخر خلال فترة الانتظار' : 'Luxury hotel during layover', price: ar ? 'من 400 ج.م' : 'From 400 EGP' },
                    ].map(s => (
                      <div key={s.title} className="sky-flight-details__service-card sky-card">
                        <span className="sky-flight-details__service-icon">{s.icon}</span>
                        <div>
                          <h4>{s.title}</h4>
                          <p>{s.desc}</p>
                        </div>
                        <span className="sky-badge sky-badge-primary">{s.price}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* BOOKING SIDEBAR */}
          <div className="sky-flight-details__booking-panel">
            <div className="sky-flight-details__price-card sky-card">
              <h3 className="sky-h4">{ar ? 'تفاصيل السعر' : 'Price Summary'}</h3>
              <div className="sky-flight-details__price-rows">
                <div className="sky-flight-details__price-row">
                  <span>{ar ? `سعر التذكرة (${selectedClass === 'economy' ? 'اقتصادي' : selectedClass === 'business' ? 'أعمال' : 'أولى'})` : `Ticket (${selectedClass})`}</span>
                  <span>{classPrice?.toLocaleString()} {ar ? 'ج.م' : 'EGP'}</span>
                </div>
                <div className="sky-flight-details__price-row">
                  <span>{ar ? 'الرسوم والضرائب' : 'Taxes & Fees'}</span>
                  <span>{Math.round(classPrice * 0.15).toLocaleString()} {ar ? 'ج.م' : 'EGP'}</span>
                </div>
                <div className="sky-flight-details__price-row sky-flight-details__price-row--total">
                  <strong>{ar ? 'الإجمالي' : 'Total'}</strong>
                  <strong className="sky-text-accent">{Math.round(classPrice * 1.15).toLocaleString()} {ar ? 'ج.م' : 'EGP'}</strong>
                </div>
              </div>
              <button
                id="btn-proceed-booking"
                className="sky-btn sky-btn-primary sky-btn-full sky-btn-lg"
                onClick={() => { selectFlight({ ...flight, price: { ...flight.price } }); navigate('/booking'); }}
              >
                {ar ? '✈ المتابعة للحجز' : '✈ Proceed to Booking'}
              </button>
              <p className="sky-flight-details__guarantee">
                🔒 {ar ? 'ضمان أفضل سعر · استرداد مجاني' : 'Best price guarantee · Free cancellation'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
