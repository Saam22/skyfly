import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBooking } from '../../context/BookingContext';
import { airports } from '../../data/airportsData';
import './SearchBar.css';

const CLASSES = {
  economy: 'اقتصادي',
  premium: 'اقتصادي مميز',
  business: 'رجال أعمال',
  first: 'درجة أولى',
};

export default function SearchBar({ compact = false }) {
  const { searchParams, setSearchParams, lang } = useBooking();
  const navigate = useNavigate();
  const ar = lang === 'ar';

  const [fromOpen, setFromOpen] = useState(false);
  const [toOpen, setToOpen] = useState(false);
  const [passOpen, setPassOpen] = useState(false);
  const [fromQuery, setFromQuery] = useState('');
  const [toQuery, setToQuery] = useState('');
  const [errors, setErrors] = useState({});


  const fromRef = useRef(null);
  const toRef = useRef(null);
  const passRef = useRef(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handler = (e) => {
      if (!fromRef.current?.contains(e.target)) setFromOpen(false);
      if (!toRef.current?.contains(e.target)) setToOpen(false);
      if (!passRef.current?.contains(e.target)) setPassOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const filteredFrom = airports.filter(a =>
    fromQuery === '' || a.city.includes(fromQuery) || a.code.includes(fromQuery.toUpperCase()) || a.cityEn.toLowerCase().includes(fromQuery.toLowerCase())
  );
  const filteredTo = airports.filter(a =>
    toQuery === '' || a.city.includes(toQuery) || a.code.includes(toQuery.toUpperCase()) || a.cityEn.toLowerCase().includes(toQuery.toLowerCase())
  );

  const fromAirport = airports.find(a => a.code === searchParams.from);
  const toAirport = airports.find(a => a.code === searchParams.to);
  const totalPassengers = searchParams.adults + searchParams.children + searchParams.infants;

  const handleSwap = () => {
    setSearchParams(prev => ({ ...prev, from: prev.to, to: prev.from }));
  };

  const handleSearch = () => {
    const errs = {};
    if (!searchParams.from) errs.from = ar ? 'اختر مطار المغادرة' : 'Select departure airport';
    if (!searchParams.to) errs.to = ar ? 'اختر مطار الوصول' : 'Select arrival airport';
    if (!searchParams.departDate) errs.departDate = ar ? 'اختر تاريخ المغادرة' : 'Select departure date';
    setErrors(errs);
    if (Object.keys(errs).length === 0) {
      navigate('/search');
    }
  };

  const updatePassenger = (type, delta) => {
    setSearchParams(prev => {
      const val = Math.max(type === 'adults' ? 1 : 0, Math.min(9, (prev[type] || 0) + delta));
      return { ...prev, [type]: val };
    });
  };

  return (
    <div className={`sky-searchbar ${compact ? 'sky-searchbar--compact' : ''}`} role="search" aria-label={ar ? 'بحث عن رحلات' : 'Search flights'}>
      {/* Trip Type Tabs */}
      {!compact && (
        <div className="sky-searchbar__tabs">
          {[
            { value: 'roundtrip', label: ar ? '↔ ذهاب وعودة' : '↔ Round Trip' },
            { value: 'oneway', label: ar ? '→ ذهاب فقط' : '→ One Way' },
            { value: 'multi', label: ar ? '⊕ متعدد الوجهات' : '⊕ Multi-City' },
          ].map(t => (
            <button
              key={t.value}
              id={`search-tab-${t.value}`}
              className={`sky-searchbar__tab ${searchParams.tripType === t.value ? 'sky-searchbar__tab--active' : ''}`}
              onClick={() => setSearchParams(prev => ({ ...prev, tripType: t.value }))}
            >
              {t.label}
            </button>
          ))}
        </div>
      )}

      {/* Main Search Row */}
      <div className="sky-searchbar__row">
        {/* From */}
        <div className={`sky-searchbar__field sky-searchbar__field--airport ${errors.from ? 'sky-searchbar__field--error' : ''}`} ref={fromRef}>
          <label className="sky-searchbar__label">{ar ? '✈ من' : '✈ From'}</label>
          <div className="sky-searchbar__input-wrap" onClick={() => setFromOpen(true)}>
            {fromAirport ? (
              <div className="sky-searchbar__selected">
                <span className="sky-searchbar__code">{fromAirport.code}</span>
                <span className="sky-searchbar__city">{fromAirport.city}</span>
                <span className="sky-searchbar__flag">{fromAirport.flag}</span>
              </div>
            ) : (
              <input
                id="search-from"
                className="sky-searchbar__text-input"
                placeholder={ar ? 'المدينة أو المطار' : 'City or Airport'}
                value={fromQuery}
                onChange={e => { setFromQuery(e.target.value); setFromOpen(true); }}
                onFocus={() => setFromOpen(true)}
                autoComplete="off"
              />
            )}
            {fromAirport && (
              <button className="sky-searchbar__clear" onClick={(e) => { e.stopPropagation(); setSearchParams(p => ({ ...p, from: '' })); }}>✕</button>
            )}
          </div>
          {errors.from && <span className="sky-searchbar__error">{errors.from}</span>}
          {fromOpen && (
            <div className="sky-searchbar__dropdown">
              {!fromAirport && (
                <input
                  className="sky-searchbar__dropdown-search"
                  placeholder={ar ? 'ابحث...' : 'Search...'}
                  value={fromQuery}
                  onChange={e => setFromQuery(e.target.value)}
                  autoFocus
                />
              )}
              {filteredFrom.slice(0, 8).map(a => (
                <button key={a.code} className="sky-searchbar__dropdown-item" onClick={() => { setSearchParams(p => ({ ...p, from: a.code })); setFromOpen(false); setFromQuery(''); }}>
                  <span className="sky-searchbar__dropdown-flag">{a.flag}</span>
                  <div>
                    <strong>{a.code}</strong>
                    <span>{a.city} · {a.country}</span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Swap Button */}
        <button id="search-swap" className="sky-searchbar__swap" onClick={handleSwap} aria-label={ar ? 'تبديل المطارات' : 'Swap airports'}>
          ⇄
        </button>

        {/* To */}
        <div className={`sky-searchbar__field sky-searchbar__field--airport ${errors.to ? 'sky-searchbar__field--error' : ''}`} ref={toRef}>
          <label className="sky-searchbar__label">{ar ? '🛬 إلى' : '🛬 To'}</label>
          <div className="sky-searchbar__input-wrap" onClick={() => setToOpen(true)}>
            {toAirport ? (
              <div className="sky-searchbar__selected">
                <span className="sky-searchbar__code">{toAirport.code}</span>
                <span className="sky-searchbar__city">{toAirport.city}</span>
                <span className="sky-searchbar__flag">{toAirport.flag}</span>
              </div>
            ) : (
              <input
                id="search-to"
                className="sky-searchbar__text-input"
                placeholder={ar ? 'المدينة أو المطار' : 'City or Airport'}
                value={toQuery}
                onChange={e => { setToQuery(e.target.value); setToOpen(true); }}
                onFocus={() => setToOpen(true)}
                autoComplete="off"
              />
            )}
            {toAirport && (
              <button className="sky-searchbar__clear" onClick={(e) => { e.stopPropagation(); setSearchParams(p => ({ ...p, to: '' })); }}>✕</button>
            )}
          </div>
          {errors.to && <span className="sky-searchbar__error">{errors.to}</span>}
          {toOpen && (
            <div className="sky-searchbar__dropdown">
              {!toAirport && (
                <input
                  className="sky-searchbar__dropdown-search"
                  placeholder={ar ? 'ابحث...' : 'Search...'}
                  value={toQuery}
                  onChange={e => setToQuery(e.target.value)}
                  autoFocus
                />
              )}
              {filteredTo.slice(0, 8).map(a => (
                <button key={a.code} className="sky-searchbar__dropdown-item" onClick={() => { setSearchParams(p => ({ ...p, to: a.code })); setToOpen(false); setToQuery(''); }}>
                  <span className="sky-searchbar__dropdown-flag">{a.flag}</span>
                  <div>
                    <strong>{a.code}</strong>
                    <span>{a.city} · {a.country}</span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Depart Date */}
        <div className={`sky-searchbar__field ${errors.departDate ? 'sky-searchbar__field--error' : ''}`}>
          <label className="sky-searchbar__label" htmlFor="search-depart">{ar ? '📅 المغادرة' : '📅 Depart'}</label>
          <input
            id="search-depart"
            type="date"
            className="sky-searchbar__date-input"
            value={searchParams.departDate}
            min={new Date().toISOString().split('T')[0]}
            onChange={e => setSearchParams(prev => ({ ...prev, departDate: e.target.value }))}
          />
          {errors.departDate && <span className="sky-searchbar__error">{errors.departDate}</span>}
        </div>

        {/* Return Date */}
        {searchParams.tripType === 'roundtrip' && (
          <div className="sky-searchbar__field">
            <label className="sky-searchbar__label" htmlFor="search-return">{ar ? '📅 العودة' : '📅 Return'}</label>
            <input
              id="search-return"
              type="date"
              className="sky-searchbar__date-input"
              value={searchParams.returnDate}
              min={searchParams.departDate || new Date().toISOString().split('T')[0]}
              onChange={e => setSearchParams(prev => ({ ...prev, returnDate: e.target.value }))}
            />
          </div>
        )}

        {/* Passengers & Class */}
        <div className="sky-searchbar__field sky-searchbar__field--pass" ref={passRef}>
          <label className="sky-searchbar__label">{ar ? '👥 المسافرون' : '👥 Passengers'}</label>
          <button id="search-passengers" className="sky-searchbar__pass-btn" onClick={() => setPassOpen(p => !p)}>
            <span>{totalPassengers} {ar ? 'مسافر' : 'Pax'}</span>
            <span className="sky-searchbar__pass-class">{CLASSES[searchParams.class]}</span>
          </button>
          {passOpen && (
            <div className="sky-searchbar__dropdown sky-searchbar__dropdown--pass">
              {/* Passengers */}
              {[
                { key: 'adults', label: ar ? 'كبار (12+)' : 'Adults (12+)', icon: '👤' },
                { key: 'children', label: ar ? 'أطفال (2-11)' : 'Children (2-11)', icon: '👦' },
                { key: 'infants', label: ar ? 'رضع (0-2)' : 'Infants (0-2)', icon: '👶' },
              ].map(p => (
                <div key={p.key} className="sky-searchbar__pass-row">
                  <span>{p.icon} {p.label}</span>
                  <div className="sky-searchbar__counter">
                    <button id={`pass-dec-${p.key}`} onClick={() => updatePassenger(p.key, -1)}>−</button>
                    <span>{searchParams[p.key] || 0}</span>
                    <button id={`pass-inc-${p.key}`} onClick={() => updatePassenger(p.key, 1)}>+</button>
                  </div>
                </div>
              ))}
              <div className="sky-searchbar__divider-small" />
              {/* Class */}
              <p className="sky-searchbar__class-title">{ar ? 'درجة السفر' : 'Travel Class'}</p>
              {Object.entries(CLASSES).map(([val, label]) => (
                <button
                  key={val}
                  id={`class-${val}`}
                  className={`sky-searchbar__class-opt ${searchParams.class === val ? 'sky-searchbar__class-opt--active' : ''}`}
                  onClick={() => setSearchParams(p => ({ ...p, class: val }))}
                >
                  {label}
                  {searchParams.class === val && <span>✓</span>}
                </button>
              ))}
              <button className="sky-btn sky-btn-primary sky-btn-sm sky-btn-full" style={{ marginTop: 8 }} onClick={() => setPassOpen(false)}>
                {ar ? 'تأكيد' : 'Confirm'}
              </button>
            </div>
          )}
        </div>

        {/* Search Button */}
        <button id="search-submit" className="sky-btn sky-btn-primary sky-btn-lg sky-searchbar__submit" onClick={handleSearch}>
          <span>🔍</span>
          {ar ? 'بحث' : 'Search'}
        </button>
      </div>
    </div>
  );
}
