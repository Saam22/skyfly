import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBooking } from '../../context/BookingContext';
import { LAST_MINUTE, SEASONAL_OFFERS, TRAVEL_PACKAGES, EXCLUSIVE_DISCOUNTS } from '../../data/offersData';
import './Offers.css';

const SEASONAL_GRADIENTS = [
  'linear-gradient(135deg, #C8102E 0%, #E8304A 50%, #FF6B6B 100%)',
  'linear-gradient(135deg, #1A3C6E 0%, #2D5AA0 50%, #6B9BD2 100%)',
  'linear-gradient(135deg, #D4A843 0%, #E0BC6A 50%, #F5E6B8 100%)',
  'linear-gradient(135deg, #008000 0%, #00A86B 50%, #66CDAA 100%)',
];

export default function Offers() {
  const { lang, addNotification } = useBooking();
  const navigate = useNavigate();
  const ar = lang === 'ar';
  const [copiedCode, setCopiedCode] = useState(null);

  useEffect(() => {
    document.title = ar ? 'SkyFly - العروض والخصومات' : 'SkyFly - Offers & Deals';
  }, [ar]);

  const handleCopyCode = (code) => {
    navigator.clipboard.writeText(code).then(() => {
      setCopiedCode(code);
      addNotification('success', ar ? 'تم النسخ!' : 'Copied!', ar ? `تم نسخ الكود ${code}` : `Code ${code} copied to clipboard`);
      setTimeout(() => setCopiedCode(null), 2000);
    }).catch(() => {
      addNotification('warning', ar ? 'خطأ' : 'Error', ar ? 'فشل نسخ الكود' : 'Failed to copy code');
    });
  };

  const renderStars = (rating) => {
    const full = Math.floor(rating);
    const half = rating % 1 >= 0.5;
    const stars = [];
    for (let i = 0; i < full; i++) stars.push('★');
    if (half) stars.push('½');
    return stars.join('');
  };

  return (
    <div className="sky-offers sky-page">

      {/* ===== Last Minute Deals ===== */}
      <section className="sky-section sky-offers__last-minute">
        <div className="sky-container">
          <div className="sky-section-header">
            <span className="sky-label">⚡ {ar ? 'عروض اللحظة الأخيرة' : 'Last Minute Deals'}</span>
            <h2 className="sky-h2">{ar ? 'عروض اللحظة الأخيرة' : 'Last Minute Deals'}</h2>
            <p>{ar ? 'خصومات ضخمة على رحلات قريبة جداً - احجز الآن قبل نفاد المقاعد' : 'Huge discounts on flights departing soon - book now before seats run out'}</p>
          </div>

          <div className="sky-offers__last-minute-grid">
            {LAST_MINUTE.map(offer => {
              const seatsLeft = offer.seats;
              const showWarning = seatsLeft <= 3;
              return (
                <article key={offer.id} className="sky-offers__lm-card sky-card" style={{ backgroundImage: `linear-gradient(135deg, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.35) 60%, rgba(0,0,0,0.15) 100%), url(${offer.image})` }}>
                  <div className="sky-offers__lm-badge">{ar ? 'آخر لحظة' : 'Last Minute'}</div>
                  <div className="sky-offers__lm-content">
                    <h3 className="sky-offers__lm-title">{ar ? offer.title : offer.titleEn}</h3>
                    <p className="sky-offers__lm-airline">{ar ? offer.airline : offer.airlineEn}</p>
                    <div className="sky-offers__lm-pricing">
                      <span className="sky-offers__lm-original">{offer.originalPrice.toLocaleString()} {ar ? 'ج.م' : 'EGP'}</span>
                      <span className="sky-offers__lm-price">{offer.price.toLocaleString()} <small>{ar ? 'ج.م' : 'EGP'}</small></span>
                    </div>
                    <p className="sky-offers__lm-departure">
                      {ar ? `المغادرة: ${offer.departure}` : `Departure: ${offer.departure}`}
                    </p>
                    <div className="sky-offers__lm-footer">
                      <span className={`sky-badge ${showWarning ? 'sky-badge-danger' : 'sky-badge-warning'}`}>
                        {ar ? `${seatsLeft} مقاعد متبقية` : `${seatsLeft} seats left`}
                      </span>
                      <button className="sky-btn sky-btn-sm sky-btn-primary" onClick={() => navigate('/search')}>
                        {ar ? 'احجز الآن' : 'Book Now'}
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===== Seasonal Offers ===== */}
      <section className="sky-section sky-offers__seasonal">
        <div className="sky-container">
          <div className="sky-section-header">
            <span className="sky-label">📅 {ar ? 'عروض موسمية' : 'Seasonal Offers'}</span>
            <h2 className="sky-h2">{ar ? 'عروض موسمية' : 'Seasonal Offers'}</h2>
            <p>{ar ? 'عروض مميزة طوال العام بمناسبات مختلفة' : 'Special offers year-round for every occasion'}</p>
          </div>

          <div className="sky-offers__seasonal-grid">
            {SEASONAL_OFFERS.map((offer, i) => (
              <article key={offer.id} className="sky-offers__seasonal-card sky-card" style={{ background: SEASONAL_GRADIENTS[i % SEASONAL_GRADIENTS.length] }}>
                <span className="sky-offers__seasonal-icon">{offer.icon}</span>
                <h3 className="sky-offers__seasonal-title">{ar ? offer.title : offer.titleEn}</h3>
                <p className="sky-offers__seasonal-desc">{ar ? offer.desc : offer.descEn}</p>
                <span className="sky-offers__seasonal-period">{ar ? offer.period : offer.periodEn}</span>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ===== Travel Packages ===== */}
      <section className="sky-section sky-offers__packages">
        <div className="sky-container">
          <div className="sky-section-header">
            <span className="sky-label">🧳 {ar ? 'حزم سفر' : 'Travel Packages'}</span>
            <h2 className="sky-h2">{ar ? 'حزم سفر متكاملة' : 'All-in-One Travel Packages'}</h2>
            <p>{ar ? 'احجز رحلة متكاملة بأفضل سعر - طيران، فندق، وجولات سياحية' : 'Book a complete trip at the best price - flight, hotel, and tours included'}</p>
          </div>

          <div className="sky-offers__packages-grid">
            {TRAVEL_PACKAGES.map(pkg => (
              <article key={pkg.id} className="sky-offers__package-card sky-card" style={{ backgroundImage: `linear-gradient(135deg, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.25) 70%, rgba(0,0,0,0.1) 100%), url(${pkg.image})` }}>
                <div className="sky-offers__package-header">
                  <span className="sky-offers__package-flag">{pkg.flag}</span>
                  <h3 className="sky-offers__package-name">{ar ? pkg.name : pkg.nameEn}</h3>
                </div>
                <div className="sky-offers__package-meta">
                  <div className="sky-offers__package-rating">
                    <span className="sky-stars">{renderStars(pkg.rating)}</span>
                    <span className="sky-offers__package-rating-num">{pkg.rating}</span>
                  </div>
                  <span className="sky-offers__package-nights">{ar ? `${pkg.nights} ليالٍ` : `${pkg.nights} Nights`}</span>
                </div>
                <div className="sky-offers__package-pricing">
                  <span className="sky-offers__package-original">{pkg.originalPrice.toLocaleString()} {ar ? 'ج.م' : 'EGP'}</span>
                  <span className="sky-offers__package-price">{pkg.price.toLocaleString()} <small>{ar ? 'ج.م' : 'EGP'}</small></span>
                </div>
                <ul className="sky-offers__package-includes">
                  {(ar ? pkg.includes : pkg.includesEn).map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
                <button className="sky-btn sky-btn-sm sky-btn-gold" onClick={() => navigate('/search')}>
                  {ar ? 'احجز الباقة' : 'Book Package'}
                </button>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ===== Exclusive Discounts ===== */}
      <section className="sky-section sky-offers__discounts">
        <div className="sky-container">
          <div className="sky-section-header">
            <span className="sky-label">💎 {ar ? 'خصومات حصرية' : 'Exclusive Discounts'}</span>
            <h2 className="sky-h2">{ar ? 'خصومات حصرية' : 'Exclusive Discounts'}</h2>
            <p>{ar ? 'أكواد خصم حصرية لحاملي بطاقات ومناسبات خاصة - استخدم الكود واحصل على خصم فوري' : 'Exclusive discount codes for cardholders and special occasions - use the code for instant savings'}</p>
          </div>

          <div className="sky-offers__discounts-grid">
            {EXCLUSIVE_DISCOUNTS.map(disc => (
              <article key={disc.id} className="sky-offers__discount-card sky-card">
                <div className="sky-offers__discount-header">
                  <h3 className="sky-offers__discount-title">{ar ? disc.title : disc.titleEn}</h3>
                </div>
                <p className="sky-offers__discount-desc">{ar ? disc.desc : disc.descEn}</p>
                <div className="sky-offers__discount-code-wrap">
                  <span className="sky-offers__discount-code">{disc.code}</span>
                  <button
                    className={`sky-offers__discount-copy-btn ${copiedCode === disc.code ? 'sky-offers__discount-copy-btn--copied' : ''}`}
                    onClick={() => handleCopyCode(disc.code)}
                  >
                    {copiedCode === disc.code
                      ? (ar ? '✓ تم النسخ' : '✓ Copied')
                      : (ar ? 'نسخ' : 'Copy')}
                  </button>
                </div>
                <p className="sky-offers__discount-expiry">
                  {ar ? `صالحة حتى: ${disc.expiry}` : `Valid until: ${disc.expiry}`}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
