import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBooking } from '../../context/BookingContext';
import { HOTELS, CAR_RENTALS, INSURANCE_PLANS, AIRPORT_LOUNGES } from '../../data/servicesData';
import './Services.css';

const TABS = [
  { key: 'hotels', icon: '🏨' },
  { key: 'car', icon: '🚗' },
  { key: 'insurance', icon: '🛡️' },
  { key: 'lounge', icon: '🛋️' },
];

const INSURANCE_ACCENTS = { basic: '#10b981', standard: '#3b82f6', premium: '#8b5cf6' };

function renderStars(count) {
  return '★'.repeat(count);
}

export default function Services() {
  const { lang } = useBooking();
  const navigate = useNavigate();
  const ar = lang === 'ar';
  const [activeTab, setActiveTab] = useState('hotels');

  useEffect(() => {
    document.title = ar ? 'SkyFly - الخدمات' : 'SkyFly - Services';
  }, [ar]);

  return (
    <div className="sky-services sky-page">
      <section className="sky-section sky-services__hero">
        <div className="sky-container">
          <div className="sky-section-header">
            <span className="sky-label">✨ {ar ? 'خدمات السفر' : 'Travel Services'}</span>
            <h2 className="sky-h2">{ar ? 'كل ما تحتاج لسفرتك' : 'Everything You Need for Your Trip'}</h2>
            <p>{ar ? 'فنادق، تأجير سيارات، تأمين سفر، وصالات مطار - كل الخدمات في مكان واحد' : 'Hotels, car rental, travel insurance, and airport lounges - all in one place'}</p>
          </div>

          <div className="sky-services__tabs">
            {TABS.map(tab => (
              <button
                key={tab.key}
                className={`sky-services__tab ${activeTab === tab.key ? 'sky-services__tab--active' : ''}`}
                onClick={() => setActiveTab(tab.key)}
              >
                <span className="sky-services__tab-icon">{tab.icon}</span>
                <span className="sky-services__tab-label">
                  {ar
                    ? ({ hotels: 'فنادق', car: 'تأجير سيارات', insurance: 'تأمين سفر', lounge: 'صالات المطار' })[tab.key]
                    : ({ hotels: 'Hotels', car: 'Car Rental', insurance: 'Insurance', lounge: 'Airport Lounges' })[tab.key]
                  }
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ===== Hotels ===== */}
      {activeTab === 'hotels' && (
        <section className="sky-section sky-services__section">
          <div className="sky-container">
            <div className="sky-services__grid">
              {HOTELS.map(hotel => (
                <article key={hotel.id} className="sky-services__card sky-card">
                  <div className="sky-services__card-img-wrap">
                    <img src={hotel.image} alt={ar ? hotel.name : hotel.nameEn} className="sky-services__card-img" loading="lazy" />
                    <span className="sky-services__card-badge">
                      {hotel.stars} {renderStars(hotel.stars)}
                    </span>
                  </div>
                  <div className="sky-services__card-body">
                    <h3 className="sky-services__card-title">{ar ? hotel.name : hotel.nameEn}</h3>
                    <p className="sky-services__card-subtitle">{ar ? hotel.city : hotel.cityEn}</p>
                    <div className="sky-services__card-rating">
                      <span className="sky-stars">{renderStars(Math.floor(hotel.rating))}</span>
                      <span className="sky-services__card-rating-num">{hotel.rating}</span>
                    </div>
                    <p className="sky-services__card-location">📍 {hotel.location}</p>
                    <div className="sky-services__card-chips">
                      {(ar ? hotel.amenities : hotel.amenitiesEn).map((a, i) => (
                        <span key={i} className="sky-badge sky-badge-primary">{a}</span>
                      ))}
                    </div>
                    <div className="sky-services__card-footer">
                      <div className="sky-services__card-price">
                        <strong>{hotel.price.toLocaleString()}</strong>
                        <small> {ar ? 'ج.م / ليلة' : 'EGP / night'}</small>
                      </div>
                      <button className="sky-btn sky-btn-sm sky-btn-primary" onClick={() => navigate('#')}>
                        {ar ? 'احجز الآن' : 'Book Now'}
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ===== Car Rental ===== */}
      {activeTab === 'car' && (
        <section className="sky-section sky-services__section">
          <div className="sky-container">
            <div className="sky-services__grid">
              {CAR_RENTALS.map(car => (
                <article key={car.id} className="sky-services__card sky-card">
                  <div className="sky-services__card-img-wrap">
                    <img src={car.image} alt={ar ? car.name : car.nameEn} className="sky-services__card-img" loading="lazy" />
                    <span className="sky-services__card-badge sky-services__card-badge--type">
                      {ar ? car.type : car.typeEn}
                    </span>
                  </div>
                  <div className="sky-services__card-body">
                    <h3 className="sky-services__card-title">{ar ? car.name : car.nameEn}</h3>
                    <p className="sky-services__card-subtitle">
                      {ar ? `المورد: ${car.supplier}` : `Supplier: ${car.supplierEn}`}
                    </p>
                    <div className="sky-services__card-meta">
                      <span>👥 {car.seats} {ar ? 'مقاعد' : 'seats'}</span>
                    </div>
                    <div className="sky-services__card-chips">
                      {(ar ? car.features : car.featuresEn).map((f, i) => (
                        <span key={i} className="sky-badge sky-badge-accent">{f}</span>
                      ))}
                    </div>
                    <div className="sky-services__card-footer">
                      <div className="sky-services__card-price">
                        <strong>{car.price.toLocaleString()}</strong>
                        <small> {ar ? 'ج.م / يوم' : 'EGP / day'}</small>
                      </div>
                      <button className="sky-btn sky-btn-sm sky-btn-primary" onClick={() => navigate('#')}>
                        {ar ? 'احجز الآن' : 'Book Now'}
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ===== Insurance ===== */}
      {activeTab === 'insurance' && (
        <section className="sky-section sky-services__section">
          <div className="sky-container">
            <div className="sky-services__insurance-grid">
              {INSURANCE_PLANS.map((plan, idx) => {
                const key = ['basic', 'standard', 'premium'][idx];
                const accent = INSURANCE_ACCENTS[key];
                return (
                  <article
                    key={plan.id}
                    className="sky-services__plan-card"
                    style={{ '--plan-accent': accent }}
                  >
                    <div className="sky-services__plan-header" style={{ background: accent }}>
                      <h3 className="sky-services__plan-name">{ar ? plan.name : plan.nameEn}</h3>
                      <div className="sky-services__plan-price">
                        <strong>{plan.price.toLocaleString()}</strong>
                        <small> {ar ? 'ج.م' : 'EGP'}</small>
                      </div>
                    </div>
                    <div className="sky-services__plan-body">
                      <p className="sky-services__plan-coverage">
                        {ar ? plan.coverage : plan.coverageEn}
                      </p>
                      <ul className="sky-services__plan-benefits">
                        {(ar ? plan.benefits : plan.benefitsEn).map((b, i) => (
                          <li key={i} className="sky-services__plan-benefit">
                            <span className="sky-services__plan-check" style={{ color: accent }}>✓</span>
                            {b}
                          </li>
                        ))}
                      </ul>
                      <button
                        className="sky-btn sky-btn-sm sky-btn-full"
                        style={{ background: accent, color: '#fff' }}
                        onClick={() => navigate('#')}
                      >
                        {ar ? 'اشتر الآن' : 'Buy Now'}
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ===== Airport Lounges ===== */}
      {activeTab === 'lounge' && (
        <section className="sky-section sky-services__section">
          <div className="sky-container">
            <div className="sky-services__grid">
              {AIRPORT_LOUNGES.map(lounge => (
                <article key={lounge.id} className="sky-services__card sky-card">
                  <div className="sky-services__card-img-wrap">
                    <img src={lounge.image} alt={ar ? lounge.name : lounge.nameEn} className="sky-services__card-img" loading="lazy" />
                  </div>
                  <div className="sky-services__card-body">
                    <h3 className="sky-services__card-title">{ar ? lounge.name : lounge.nameEn}</h3>
                    <p className="sky-services__card-subtitle">
                      {ar ? `${lounge.airport} - ${lounge.terminal}` : `${lounge.airportEn} - ${lounge.terminal}`}
                    </p>
                    <div className="sky-services__card-rating">
                      <span className="sky-stars">{renderStars(Math.floor(lounge.rating))}</span>
                      <span className="sky-services__card-rating-num">{lounge.rating}</span>
                    </div>
                    <div className="sky-services__card-chips">
                      {(ar ? lounge.features : lounge.featuresEn).map((f, i) => (
                        <span key={i} className="sky-badge sky-badge-success">{f}</span>
                      ))}
                    </div>
                    <div className="sky-services__card-footer">
                      <div className="sky-services__card-price">
                        <strong>{lounge.price.toLocaleString()}</strong>
                        <small> {ar ? 'ج.م / شخص' : 'EGP / person'}</small>
                      </div>
                      <button className="sky-btn sky-btn-sm sky-btn-primary" onClick={() => navigate('#')}>
                        {ar ? 'احجز الدخول' : 'Book Entry'}
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
