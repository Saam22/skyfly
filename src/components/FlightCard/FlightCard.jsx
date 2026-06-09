import { useNavigate } from 'react-router-dom';
import { useBooking } from '../../context/BookingContext';
import './FlightCard.css';

export default function FlightCard({ flight, compact = false, selected = false, onSelect }) {
  const navigate = useNavigate();
  const { searchParams, selectFlight, lang } = useBooking();
  const ar = lang === 'ar';

  const classPrice = flight.price[searchParams.class] || flight.price.economy || Object.values(flight.price).find(v => v !== null) || 0;
  const bestPrice = Math.min(...Object.values(flight.price).filter(v => v !== null));

  const handleBook = () => {
    selectFlight(flight);
    navigate(`/flight/${flight.id}`);
  };

  const handleSelect = () => {
    if (onSelect) onSelect(flight);
    else handleBook();
  };

  return (
    <article
      className={`sky-flight-card ${selected ? 'sky-flight-card--selected' : ''} ${compact ? 'sky-flight-card--compact' : ''}`}
      id={`flight-card-${flight.id}`}
    >
      <div className="sky-flight-card__header">
        <div className="sky-flight-card__airline">
          <div className="sky-flight-card__airline-logo" style={{ background: flight.airlineColor + '15', color: flight.airlineColor }}>
            {flight.airlineCode}
          </div>
          <div>
            <p className="sky-flight-card__airline-name">{flight.airline}</p>
            <p className="sky-flight-card__flight-num">{flight.flightNumber} · {flight.aircraft}</p>
          </div>
        </div>
        <div className="sky-flight-card__meta">
          {flight.seatsLeft <= 5 && (
            <span className="sky-badge sky-badge-danger">
              🔥 {ar ? `${flight.seatsLeft} مقاعد فقط` : `${flight.seatsLeft} seats left`}
            </span>
          )}
          <div className="sky-flight-card__rating">
            <span className="sky-stars">★</span> {flight.rating}
          </div>
        </div>
      </div>

      <div className="sky-flight-card__route">
        <div className="sky-flight-card__city">
          <span className="sky-flight-card__time">{flight.from.time}</span>
          <span className="sky-flight-card__code">{flight.from.code}</span>
          <span className="sky-flight-card__city-name">{flight.from.city}</span>
        </div>

        <div className="sky-flight-card__journey">
          <span className="sky-flight-card__duration">{flight.duration}</span>
          <div className="sky-flight-card__line">
            <span className="sky-flight-card__dot" />
            <div className="sky-flight-card__line-bar">
              <span className="sky-flight-card__plane">✈</span>
            </div>
            <span className="sky-flight-card__dot" />
          </div>
          <span className={`sky-flight-card__stops ${flight.stops === 0 ? 'sky-flight-card__stops--direct' : ''}`}>
            {flight.stops === 0
              ? (ar ? 'رحلة مباشرة' : 'Direct')
              : `${flight.stops} ${ar ? 'محطة' : 'stop'}`}
            {flight.stops > 0 && flight.stopDetails?.map(s => (
              <span key={s.code} className="sky-flight-card__stop-detail"> ({s.city})</span>
            ))}
          </span>
        </div>

        <div className="sky-flight-card__city sky-flight-card__city--right">
          <span className="sky-flight-card__time">{flight.to.time}</span>
          <span className="sky-flight-card__code">{flight.to.code}</span>
          <span className="sky-flight-card__city-name">{flight.to.city}</span>
        </div>
      </div>

      {!compact && (
        <div className="sky-flight-card__features">
          {flight.features.slice(0, 4).map(f => (
            <span key={f} className="sky-flight-card__feature">✓ {f}</span>
          ))}
          <span className="sky-flight-card__feature sky-flight-card__feature--baggage">
            🧳 {flight.baggage.cabin} / {flight.baggage.checked}
          </span>
        </div>
      )}

      <div className="sky-flight-card__footer">
        <div className="sky-flight-card__price-block">
          <div className="sky-price">
            <span className="sky-price-amount">{classPrice?.toLocaleString() ?? bestPrice?.toLocaleString() ?? '—'}</span>
            <span className="sky-price-currency">{flight.currency || (ar ? 'ج.م' : 'EGP')}</span>
          </div>
          <span className="sky-price-label">{ar ? 'للمسافر الواحد' : 'per person'}</span>
          {!compact && (
            <span className="sky-flight-card__ontime">
              ⏱ {ar ? `${flight.onTime}% في الموعد` : `${flight.onTime}% on time`}
            </span>
          )}
        </div>
        <div className="sky-flight-card__actions">
          {!compact && (
            <button
              id={`flight-details-${flight.id}`}
              className="sky-btn sky-btn-outline sky-btn-sm"
              onClick={() => { selectFlight(flight); navigate(`/flight/${flight.id}`); }}
            >
              {ar ? 'التفاصيل' : 'Details'}
            </button>
          )}
          <button
            id={`flight-book-${flight.id}`}
            className="sky-btn sky-btn-primary"
            onClick={handleSelect}
          >
            {ar ? 'احجز الآن' : 'Book Now'}
          </button>
        </div>
      </div>
    </article>
  );
}
