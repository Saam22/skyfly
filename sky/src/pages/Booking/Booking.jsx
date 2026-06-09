import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBooking } from '../../context/BookingContext';
import { generateSeatMap } from '../../data/flightsData';
import './Booking.css';

const STEPS = [
  { key: 'passengers', ar: '👤 المسافرون', en: '👤 Passengers' },
  { key: 'seats', ar: '💺 المقاعد', en: '💺 Seats' },
  { key: 'extras', ar: '⚡ الإضافات', en: '⚡ Extras' },
  { key: 'payment', ar: '💳 الدفع', en: '💳 Payment' },
  { key: 'confirm', ar: '✅ التأكيد', en: '✅ Confirmation' },
];

const NATIONALITIES = ['مصري', 'سعودي', 'إماراتي', 'كويتي', 'قطري', 'بحريني', 'عُماني', 'أردني', 'لبناني', 'تونسي', 'جزائري', 'مغربي', 'سوري', 'عراقي', 'يمني', 'سوداني', 'ليبي', 'فلسطيني', 'أخرى'];

export default function Booking() {
  const { booking, searchParams, setPassengers, setSelectedSeats, setExtras, confirmBooking, lang } = useBooking();
  const navigate = useNavigate();
  const ar = lang === 'ar';
  const [step, setStep] = useState(0);

  // If no flight selected, redirect
  useEffect(() => {
    if (!booking.flight) { navigate('/search'); return; }
    document.title = ar ? 'SkyFly - إتمام الحجز' : 'SkyFly - Complete Booking';
  }, [booking.flight]);

  // Passengers state
  const totalPax = (searchParams.adults || 1) + (searchParams.children || 0);
  const [passengers, setPassengersLocal] = useState(
    Array.from({ length: totalPax }, (_, i) => ({
      id: i,
      firstName: '',
      lastName: '',
      nationality: '',
      passport: '',
      dob: '',
      gender: 'male',
    }))
  );
  const [passengerErrors, setPassengerErrors] = useState({});

  // Seats state
  const [seatMap] = useState(() => generateSeatMap());
  const [selectedSeatsLocal, setSelectedSeatsLocal] = useState([]);

  // Extras state
  const [extrasLocal, setExtrasLocal] = useState({ insurance: false, meal: false, extraBaggage: false, wheelchair: false });

  // Payment state
  const [payment, setPayment] = useState({ method: 'card', cardNumber: '', expiry: '', cvv: '', cardName: '' });
  const [paying, setPaying] = useState(false);
  const [bookingRef, setBookingRef] = useState(null);

  const flight = booking.flight;
  if (!flight) return null;

  const classPrice = flight.price[searchParams.class] || flight.price.economy;
  const extrasTotal = (extrasLocal.insurance ? 120 : 0) + (extrasLocal.meal ? 45 : 0) + (extrasLocal.extraBaggage ? 150 : 0);
  const total = (classPrice * totalPax + extrasTotal) * 1.15;

  // Validate passengers
  const validatePassengers = () => {
    const errs = {};
    passengers.forEach((p, i) => {
      if (!p.firstName) errs[`${i}_firstName`] = true;
      if (!p.lastName) errs[`${i}_lastName`] = true;
      if (!p.passport) errs[`${i}_passport`] = true;
    });
    setPassengerErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const goNext = () => {
    if (step === 0) {
      if (!validatePassengers()) return;
      setPassengers(passengers);
    }
    if (step === 1) setSelectedSeats(selectedSeatsLocal);
    if (step === 2) setExtras(extrasLocal);
    if (step === 3) {
      setPaying(true);
      setTimeout(() => {
        const ref = confirmBooking();
        setBookingRef(ref);
        setStep(4);
        setPaying(false);
      }, 2000);
      return;
    }
    if (step < 4) setStep(s => s + 1);
  };

  const goBack = () => { if (step > 0) setStep(s => s - 1); };

  const toggleSeat = (seatId) => {
    if (selectedSeatsLocal.includes(seatId)) {
      setSelectedSeatsLocal(prev => prev.filter(s => s !== seatId));
    } else if (selectedSeatsLocal.length < totalPax) {
      setSelectedSeatsLocal(prev => [...prev, seatId]);
    }
  };

  return (
    <div className="sky-booking sky-page">
      <div className="sky-container">
        {/* Progress Steps */}
        <div className="sky-booking__steps">
          {STEPS.map((s, i) => (
            <div key={s.key} className={`sky-booking__step ${i === step ? 'sky-booking__step--active' : ''} ${i < step ? 'sky-booking__step--done' : ''}`}>
              <div className="sky-booking__step-circle">
                {i < step ? '✓' : i + 1}
              </div>
              <span className="sky-hide-mobile">{ar ? s.ar : s.en}</span>
              {i < STEPS.length - 1 && <div className="sky-booking__step-line" />}
            </div>
          ))}
        </div>

        <div className="sky-booking__body">
          {/* MAIN CONTENT */}
          <div className="sky-booking__main">

            {/* STEP 0: PASSENGERS */}
            {step === 0 && (
              <div className="sky-booking__panel sky-animate-fade">
                <h2 className="sky-h3">{ar ? 'بيانات المسافرين' : 'Passenger Details'}</h2>
                <p className="sky-text-muted" style={{ marginBottom: 24 }}>{ar ? 'يرجى إدخال البيانات كما تظهر في جواز السفر' : 'Please enter details as they appear on passport'}</p>
                {passengers.map((pax, i) => (
                  <div key={i} className="sky-booking__passenger-card">
                    <h3 className="sky-booking__pax-title">
                      👤 {ar ? `المسافر ${i + 1}` : `Passenger ${i + 1}`}
                      {i < (searchParams.adults || 1) ? (
                        <span className="sky-badge sky-badge-primary">{ar ? 'كبير' : 'Adult'}</span>
                      ) : (
                        <span className="sky-badge sky-badge-warning">{ar ? 'طفل' : 'Child'}</span>
                      )}
                    </h3>
                    <div className="sky-booking__form-grid">
                      <div className="sky-booking__form-field">
                        <label htmlFor={`pax-${i}-fn`}>{ar ? 'الاسم الأول *' : 'First Name *'}</label>
                        <input
                          id={`pax-${i}-fn`}
                          className={`sky-input ${passengerErrors[`${i}_firstName`] ? 'sky-input--error' : ''}`}
                          value={pax.firstName}
                          onChange={e => setPassengersLocal(prev => prev.map((p, j) => j === i ? { ...p, firstName: e.target.value } : p))}
                          placeholder={ar ? 'محمد' : 'John'}
                        />
                      </div>
                      <div className="sky-booking__form-field">
                        <label htmlFor={`pax-${i}-ln`}>{ar ? 'الاسم الأخير *' : 'Last Name *'}</label>
                        <input
                          id={`pax-${i}-ln`}
                          className={`sky-input ${passengerErrors[`${i}_lastName`] ? 'sky-input--error' : ''}`}
                          value={pax.lastName}
                          onChange={e => setPassengersLocal(prev => prev.map((p, j) => j === i ? { ...p, lastName: e.target.value } : p))}
                          placeholder={ar ? 'الأحمدي' : 'Smith'}
                        />
                      </div>
                      <div className="sky-booking__form-field">
                        <label htmlFor={`pax-${i}-nat`}>{ar ? 'الجنسية' : 'Nationality'}</label>
                        <select
                          id={`pax-${i}-nat`}
                          className="sky-input sky-select"
                          value={pax.nationality}
                          onChange={e => setPassengersLocal(prev => prev.map((p, j) => j === i ? { ...p, nationality: e.target.value } : p))}
                        >
                          <option value="">{ar ? 'اختر الجنسية' : 'Select nationality'}</option>
                          {NATIONALITIES.map(n => <option key={n} value={n}>{n}</option>)}
                        </select>
                      </div>
                      <div className="sky-booking__form-field">
                        <label htmlFor={`pax-${i}-pp`}>{ar ? 'رقم جواز السفر *' : 'Passport Number *'}</label>
                        <input
                          id={`pax-${i}-pp`}
                          className={`sky-input ${passengerErrors[`${i}_passport`] ? 'sky-input--error' : ''}`}
                          value={pax.passport}
                          onChange={e => setPassengersLocal(prev => prev.map((p, j) => j === i ? { ...p, passport: e.target.value } : p))}
                          placeholder="A1234567"
                          dir="ltr"
                        />
                      </div>
                      <div className="sky-booking__form-field">
                        <label htmlFor={`pax-${i}-dob`}>{ar ? 'تاريخ الميلاد' : 'Date of Birth'}</label>
                        <input
                          id={`pax-${i}-dob`}
                          type="date"
                          className="sky-input"
                          value={pax.dob}
                          onChange={e => setPassengersLocal(prev => prev.map((p, j) => j === i ? { ...p, dob: e.target.value } : p))}
                        />
                      </div>
                      <div className="sky-booking__form-field">
                        <label>{ar ? 'الجنس' : 'Gender'}</label>
                        <div className="sky-booking__gender-btns">
                          {['male', 'female'].map(g => (
                            <button
                              key={g}
                              id={`pax-${i}-gender-${g}`}
                              className={`sky-booking__gender-btn ${pax.gender === g ? 'sky-booking__gender-btn--active' : ''}`}
                              onClick={() => setPassengersLocal(prev => prev.map((p, j) => j === i ? { ...p, gender: g } : p))}
                            >
                              {g === 'male' ? (ar ? '👨 ذكر' : '👨 Male') : (ar ? '👩 أنثى' : '👩 Female')}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* STEP 1: SEAT MAP */}
            {step === 1 && (
              <div className="sky-booking__panel sky-animate-fade">
                <h2 className="sky-h3">{ar ? 'اختر مقعدك' : 'Choose Your Seat'}</h2>
                <p className="sky-text-muted" style={{ marginBottom: 16 }}>
                  {ar ? `اختر ${totalPax} مقاعد (${selectedSeatsLocal.length}/${totalPax} مختار)` : `Select ${totalPax} seats (${selectedSeatsLocal.length}/${totalPax} selected)`}
                </p>
                {/* Legend */}
                <div className="sky-booking__seat-legend">
                  {[
                    { class: 'available', label: ar ? 'متاح' : 'Available' },
                    { class: 'occupied', label: ar ? 'محجوز' : 'Occupied' },
                    { class: 'selected', label: ar ? 'مختار' : 'Selected' },
                    { class: 'business-seat', label: ar ? 'أعمال' : 'Business' },
                    { class: 'extra-legroom-seat', label: ar ? 'مساحة إضافية' : 'Extra Legroom' },
                  ].map(l => (
                    <div key={l.class} className="sky-booking__seat-legend-item">
                      <div className={`sky-booking__seat sky-booking__seat--${l.class}`} style={{ cursor: 'default' }} />
                      <span>{l.label}</span>
                    </div>
                  ))}
                </div>
                {/* Aircraft */}
                <div className="sky-booking__aircraft">
                  <div className="sky-booking__aircraft-nose" />
                  <div className="sky-booking__seat-map">
                    {/* Headers */}
                    <div className="sky-booking__seat-row sky-booking__seat-row--header">
                      <span className="sky-booking__row-num" />
                      {['A', 'B', 'C', '', 'D', 'E', 'F'].map((l, i) => (
                        <span key={i} className={`sky-booking__seat-letter ${l === '' ? 'sky-booking__aisle' : ''}`}>{l}</span>
                      ))}
                    </div>
                    {(() => {
                      const rendered = [];
                      let lastType = null;
                      seatMap.slice(0, 20).forEach(({ row, seats }) => {
                        const type = seats[0].type;
                        if (type !== lastType) {
                          const label = type === 'business' ? (ar ? 'درجة الأعمال' : 'Business Class')
                            : type === 'extra-legroom' ? (ar ? 'مساحة إضافية للأرجل' : 'Extra Legroom')
                            : (ar ? 'الدرجة السياحية' : 'Economy Class');
                          rendered.push(
                            <div key={`label-${row}`} className="sky-booking__section-label">{label}</div>
                          );
                          lastType = type;
                        }
                        rendered.push(
                          <div key={row} className={`sky-booking__seat-row ${type === 'business' ? 'sky-booking__seat-row--business' : type === 'extra-legroom' ? 'sky-booking__seat-row--extra' : ''}`}>
                            <span className="sky-booking__row-num">{row}</span>
                            {seats.slice(0, 3).map(seat => (
                              <button
                                key={seat.id}
                                id={`seat-${seat.id}`}
                                className={`sky-booking__seat sky-booking__seat--${selectedSeatsLocal.includes(seat.id) ? 'selected' : seat.status === 'occupied' ? 'occupied' : type === 'business' ? 'business-seat' : type === 'extra-legroom' ? 'extra-legroom-seat' : 'available'}`}
                                disabled={seat.status === 'occupied'}
                                onClick={() => toggleSeat(seat.id)}
                                title={`${seat.id}${seat.price > 0 ? ` +${seat.price} EGP` : ''}${seat.status === 'occupied' ? ` (${ar ? 'محجوز' : 'Occupied'})` : ''}`}
                              />
                            ))}
                            <span className="sky-booking__aisle" />
                            {seats.slice(3).map(seat => (
                              <button
                                key={seat.id}
                                id={`seat-${seat.id}`}
                                className={`sky-booking__seat sky-booking__seat--${selectedSeatsLocal.includes(seat.id) ? 'selected' : seat.status === 'occupied' ? 'occupied' : type === 'business' ? 'business-seat' : type === 'extra-legroom' ? 'extra-legroom-seat' : 'available'}`}
                                disabled={seat.status === 'occupied'}
                                onClick={() => toggleSeat(seat.id)}
                                title={`${seat.id}${seat.price > 0 ? ` +${seat.price} EGP` : ''}${seat.status === 'occupied' ? ` (${ar ? 'محجوز' : 'Occupied'})` : ''}`}
                              />
                            ))}
                          </div>
                        );
                      });
                      return rendered;
                    })()}
                  </div>
                </div>
                {selectedSeatsLocal.length > 0 && (
                  <div className="sky-booking__selected-seats">
                    {ar ? 'المقاعد المختارة:' : 'Selected:'} <strong>{selectedSeatsLocal.join(', ')}</strong>
                  </div>
                )}
              </div>
            )}

            {/* STEP 2: EXTRAS */}
            {step === 2 && (
              <div className="sky-booking__panel sky-animate-fade">
                <h2 className="sky-h3">{ar ? 'الخدمات الإضافية' : 'Add-On Services'}</h2>
                <p className="sky-text-muted" style={{ marginBottom: 24 }}>{ar ? 'حسّن تجربة سفرك بإضافات مميزة' : 'Enhance your journey with premium add-ons'}</p>
                <div className="sky-booking__extras-grid">
                  {[
                    { key: 'insurance', icon: '🛡️', title: ar ? 'تأمين السفر' : 'Travel Insurance', desc: ar ? 'تغطية شاملة ضد الإلغاء والتأخير والفقدان' : 'Full coverage against cancellation, delays & loss', price: 120 },
                    { key: 'meal', icon: '🍽️', title: ar ? 'وجبة مميزة' : 'Premium Meal', desc: ar ? 'اختر وجبتك من قائمة طعام مميزة' : 'Choose from a premium dining menu', price: 45 },
                    { key: 'extraBaggage', icon: '🧳', title: ar ? 'أمتعة إضافية' : 'Extra Baggage', desc: ar ? 'أمتعة إضافية بوزن 20 كجم' : 'Extra 20kg baggage allowance', price: 150 },
                    { key: 'wheelchair', icon: '♿', title: ar ? 'مساعدة خاصة' : 'Special Assistance', desc: ar ? 'مساعدة على الكرسي المتحرك والمشي' : 'Wheelchair & mobility assistance', price: 0 },
                  ].map(extra => (
                    <div
                      key={extra.key}
                      id={`extra-${extra.key}`}
                      className={`sky-booking__extra-card ${extrasLocal[extra.key] ? 'sky-booking__extra-card--selected' : ''}`}
                      onClick={() => setExtrasLocal(prev => ({ ...prev, [extra.key]: !prev[extra.key] }))}
                    >
                      <div className="sky-booking__extra-icon">{extra.icon}</div>
                      <div className="sky-booking__extra-info">
                        <h4>{extra.title}</h4>
                        <p>{extra.desc}</p>
                      </div>
                      <div className="sky-booking__extra-price">
                        {extra.price > 0 ? `+${extra.price} ${ar ? 'ج.م' : 'EGP'}` : (ar ? 'مجاني' : 'Free')}
                        <div className={`sky-booking__extra-check ${extrasLocal[extra.key] ? 'sky-booking__extra-check--active' : ''}`}>
                          {extrasLocal[extra.key] ? '✓' : '+'}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* STEP 3: PAYMENT */}
            {step === 3 && (
              <div className="sky-booking__panel sky-animate-fade">
                <h2 className="sky-h3">{ar ? 'طريقة الدفع' : 'Payment Method'}</h2>
                {/* Method selection */}
                <div className="sky-booking__payment-methods">
                  {[
                    { key: 'card', label: ar ? '💳 بطاقة ائتمانية' : '💳 Credit Card' },
                    { key: 'apple', label: ar ? '🍎 Apple Pay' : '🍎 Apple Pay' },
                    { key: 'stc', label: ar ? '📱 STC Pay' : '📱 STC Pay' },
                    { key: 'mada', label: ar ? '💳 مدى' : '💳 Mada' },
                    { key: 'meeza', label: ar ? '💳 ميزة' : '💳 Meeza' },
                    { key: 'valu', label: ar ? '🟣 ValU' : '🟣 ValU' },
                    { key: 'fawry', label: ar ? '🧡 فوري' : '🧡 Fawry' },
                  ].map(m => (
                    <button
                      key={m.key}
                      id={`pay-method-${m.key}`}
                      className={`sky-booking__pay-method ${payment.method === m.key ? 'sky-booking__pay-method--active' : ''}`}
                      onClick={() => setPayment(prev => ({ ...prev, method: m.key }))}
                    >
                      {m.label}
                    </button>
                  ))}
                </div>

                {payment.method === 'card' && (
                  <div className="sky-booking__card-form sky-animate-fade">
                    {/* Card visual */}
                    <div className="sky-booking__card-visual">
                      <div className="sky-booking__card-chip">▬▬▬</div>
                      <div className="sky-booking__card-number">
                        {(payment.cardNumber || '•••• •••• •••• ••••').replace(/(\d{4})/g, '$1 ').trim()}
                      </div>
                      <div className="sky-booking__card-footer">
                        <span>{payment.cardName || (ar ? 'اسم صاحب البطاقة' : 'Card Holder')}</span>
                        <span>{payment.expiry || 'MM/YY'}</span>
                      </div>
                    </div>

                    <div className="sky-booking__form-grid">
                      <div className="sky-booking__form-field" style={{ gridColumn: '1 / -1' }}>
                        <label htmlFor="card-number">{ar ? 'رقم البطاقة' : 'Card Number'}</label>
                        <input
                          id="card-number"
                          className="sky-input"
                          placeholder="1234 5678 9012 3456"
                          value={payment.cardNumber}
                          onChange={e => setPayment(p => ({ ...p, cardNumber: e.target.value.replace(/\D/g, '').slice(0, 16) }))}
                          dir="ltr"
                        />
                      </div>
                      <div className="sky-booking__form-field" style={{ gridColumn: '1 / -1' }}>
                        <label htmlFor="card-name">{ar ? 'اسم صاحب البطاقة' : 'Cardholder Name'}</label>
                        <input id="card-name" className="sky-input" placeholder={ar ? 'محمد أحمد' : 'John Smith'} value={payment.cardName} onChange={e => setPayment(p => ({ ...p, cardName: e.target.value }))} />
                      </div>
                      <div className="sky-booking__form-field">
                        <label htmlFor="card-expiry">{ar ? 'تاريخ الانتهاء' : 'Expiry'}</label>
                        <input id="card-expiry" className="sky-input" placeholder="MM/YY" value={payment.expiry} onChange={e => setPayment(p => ({ ...p, expiry: e.target.value }))} dir="ltr" />
                      </div>
                      <div className="sky-booking__form-field">
                        <label htmlFor="card-cvv">CVV</label>
                        <input id="card-cvv" className="sky-input" placeholder="•••" type="password" maxLength={4} value={payment.cvv} onChange={e => setPayment(p => ({ ...p, cvv: e.target.value }))} dir="ltr" />
                      </div>
                    </div>
                  </div>
                )}

                {payment.method !== 'card' && (
                  <div className="sky-booking__pay-redirect sky-animate-fade">
                    <span style={{ fontSize: '3rem' }}>
                      {payment.method === 'apple' ? '🍎' : payment.method === 'stc' ? '📱' : payment.method === 'mada' ? '💳' : payment.method === 'meeza' ? '💚' : payment.method === 'valu' ? '🟣' : '🧡'}
                    </span>
                    <p>{ar ? 'سيتم توجيهك لإتمام الدفع عند الضغط على "ادفع الآن"' : "You'll be redirected to complete payment when you click 'Pay Now'"}</p>
                    {payment.method === 'meeza' && <p className="sky-text-muted" style={{ fontSize: '0.85rem' }}>{ar ? 'ميزة – شبكة الدفع الوطنية المصرية' : 'Meeza – Egyptian National Payment Network'}</p>}
                    {payment.method === 'valu' && <p className="sky-text-muted" style={{ fontSize: '0.85rem' }}>{ar ? 'ValU – تقسيط مريح بدون فوائد' : 'ValU – Flexible installment plan'}</p>}
                    {payment.method === 'fawry' && <p className="sky-text-muted" style={{ fontSize: '0.85rem' }}>{ar ? 'فوري – ادفع نقداً في أي منفذ فوري' : 'Fawry – Pay cash at any Fawry outlet'}</p>}
                  </div>
                )}

                <div className="sky-booking__security-badges">
                  {['🔒 SSL مشفر', '🛡️ PCI DSS', '✓ 3D Secure'].map(b => (
                    <span key={b} className="sky-booking__security-badge">{b}</span>
                  ))}
                </div>
              </div>
            )}

            {/* STEP 4: CONFIRMATION */}
            {step === 4 && (
              <div className="sky-booking__panel sky-booking__confirm sky-animate-fade">
                <div className="sky-booking__confirm-icon">🎉</div>
                <h2 className="sky-h2">{ar ? 'تم الحجز بنجاح!' : 'Booking Confirmed!'}</h2>
                <p>{ar ? 'تم تأكيد حجزك وسيصلك تأكيد على بريدك الإلكتروني' : 'Your booking is confirmed. A confirmation email will be sent.'}</p>
                <div className="sky-booking__ref-card">
                  <span className="sky-label">{ar ? 'رقم الحجز' : 'Booking Reference'}</span>
                  <strong className="sky-booking__ref-number">{bookingRef}</strong>
                </div>
                <div className="sky-booking__confirm-flight">
                  <div><strong>{flight.airline}</strong> · {flight.flightNumber}</div>
                  <div>{flight.from.city} → {flight.to.city} · {flight.from.time} - {flight.to.time}</div>
                  <div>{flight.date}</div>
                </div>
                <div className="sky-booking__confirm-actions">
                  <button id="btn-boarding-pass" className="sky-btn sky-btn-primary sky-btn-lg" onClick={() => navigate('/my-trips')}>
                    {ar ? '🎫 عرض بطاقة الصعود' : '🎫 View Boarding Pass'}
                  </button>
                  <button className="sky-btn sky-btn-outline sky-btn-lg" onClick={() => navigate('/')}>
                    {ar ? 'العودة للرئيسية' : 'Back to Home'}
                  </button>
                </div>
              </div>
            )}

            {/* Navigation */}
            {step < 4 && (
              <div className="sky-booking__nav">
                {step > 0 && (
                  <button className="sky-btn sky-btn-ghost" onClick={goBack}>
                    ← {ar ? 'السابق' : 'Back'}
                  </button>
                )}
                <button
                  id="booking-next-btn"
                  className={`sky-btn sky-btn-primary sky-btn-lg ${paying ? 'sky-btn-loading' : ''}`}
                  onClick={goNext}
                  disabled={paying}
                >
                  {paying ? (ar ? '⏳ جاري المعالجة...' : '⏳ Processing...') : step === 3 ? (ar ? `💳 ادفع ${total.toLocaleString()} ج.م` : `💳 Pay ${total.toLocaleString()} EGP`) : (ar ? 'التالي ←' : 'Next →')}
                </button>
              </div>
            )}
          </div>

          {/* PRICE SIDEBAR */}
          {step < 4 && (
            <div className="sky-booking__sidebar">
              <div className="sky-card sky-booking__summary-card">
                <h3 className="sky-h4">{ar ? 'ملخص الحجز' : 'Booking Summary'}</h3>
                <div className="sky-booking__summary-flight">
                  <div className="sky-booking__summary-airline" style={{ color: flight.airlineColor }}>
                    {flight.airlineCode}
                  </div>
                  <div>
                    <strong>{flight.airline}</strong>
                    <p>{flight.from.city} → {flight.to.city}</p>
                    <p>{flight.from.time} – {flight.to.time} · {flight.duration}</p>
                  </div>
                </div>
                <div className="sky-divider" />
                <div className="sky-booking__summary-rows">
                  <div className="sky-booking__summary-row">
                    <span>{ar ? `تذاكر (${totalPax}x)` : `Tickets (${totalPax}x)`}</span>
                    <span>{(classPrice * totalPax).toLocaleString()} {ar ? 'ج.م' : 'EGP'}</span>
                  </div>
                  {extrasTotal > 0 && (
                    <div className="sky-booking__summary-row">
                      <span>{ar ? 'الإضافات' : 'Add-ons'}</span>
                      <span>+{extrasTotal} {ar ? 'ج.م' : 'EGP'}</span>
                    </div>
                  )}
                  <div className="sky-booking__summary-row">
                    <span>{ar ? 'الضرائب (15%)' : 'Taxes (15%)'}</span>
                    <span>{Math.round((classPrice * totalPax + extrasTotal) * 0.15).toLocaleString()} {ar ? 'ج.م' : 'EGP'}</span>
                  </div>
                  <div className="sky-booking__summary-row sky-booking__summary-row--total">
                    <strong>{ar ? 'الإجمالي' : 'Total'}</strong>
                    <strong className="sky-text-accent">{Math.round(total).toLocaleString()} {ar ? 'ج.م' : 'EGP'}</strong>
                  </div>
                </div>
                {selectedSeatsLocal.length > 0 && (
                  <div className="sky-booking__summary-seats">
                    <span className="sky-label">{ar ? 'المقاعد' : 'Seats'}</span>
                    <strong>{selectedSeatsLocal.join(', ')}</strong>
                  </div>
                )}
                <p className="sky-booking__summary-secure">
                  🔒 {ar ? 'حجز آمن ومشفر' : 'Secure & encrypted booking'}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
