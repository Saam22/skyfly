import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SearchBar from '../../components/SearchBar/SearchBar';
import FlightCard from '../../components/FlightCard/FlightCard';
import { useBooking } from '../../context/BookingContext';
import { flights } from '../../data/flightsData';
import './SearchResults.css';

const SORT_OPTIONS = {
  price_asc: { ar: 'الأرخص أولاً', en: 'Cheapest First' },
  price_desc: { ar: 'الأغلى أولاً', en: 'Priciest First' },
  duration_asc: { ar: 'الأسرع أولاً', en: 'Fastest First' },
  departure_asc: { ar: 'أقرب إقلاع', en: 'Earliest Departure' },
  rating_desc: { ar: 'الأعلى تقييماً', en: 'Highest Rated' },
};

export default function SearchResults() {
  const { searchParams, lang } = useBooking();
  const ar = lang === 'ar';
  const navigate = useNavigate();

  const [sort, setSort] = useState('price_asc');
  const [filterStops, setFilterStops] = useState([]);
  const [filterAirlines, setFilterAirlines] = useState([]);
  const [filterMaxPrice, setFilterMaxPrice] = useState(10000);
  const [filterDep, setFilterDep] = useState({ morning: false, afternoon: false, evening: false, night: false });
  const [compareList, setCompareList] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = ar ? 'SkyFly - نتائج البحث' : 'SkyFly - Search Results';
    const t = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(t);
  }, [ar]);

  // Available airlines from results
  const allAirlines = [...new Set(flights.map(f => f.airline))];
  const maxAvailablePrice = Math.max(...flights.map(f => f.price.economy || 0));

  // Filtered + sorted flights
  const results = useMemo(() => {
    let filtered = [...flights];

    // Stops filter
    if (filterStops.length > 0) {
      filtered = filtered.filter(f => filterStops.includes(f.stops));
    }

    // Airline filter
    if (filterAirlines.length > 0) {
      filtered = filtered.filter(f => filterAirlines.includes(f.airline));
    }

    // Price filter
    const classKey = searchParams.class || 'economy';
    filtered = filtered.filter(f => {
      const price = f.price[classKey] || f.price.economy;
      return price <= filterMaxPrice;
    });

    // Departure time filter
    const anyDep = Object.values(filterDep).some(Boolean);
    if (anyDep) {
      filtered = filtered.filter(f => {
        const hr = parseInt(f.from.time.split(':')[0]);
        if (filterDep.morning && hr >= 5 && hr < 12) return true;
        if (filterDep.afternoon && hr >= 12 && hr < 17) return true;
        if (filterDep.evening && hr >= 17 && hr < 21) return true;
        if (filterDep.night && (hr >= 21 || hr < 5)) return true;
        return false;
      });
    }

    // Sort
    filtered.sort((a, b) => {
      const pa = a.price[searchParams.class] || a.price.economy;
      const pb = b.price[searchParams.class] || b.price.economy;
      switch (sort) {
        case 'price_asc': return pa - pb;
        case 'price_desc': return pb - pa;
        case 'duration_asc': return a.durationMins - b.durationMins;
        case 'departure_asc': return a.from.time.localeCompare(b.from.time);
        case 'rating_desc': return b.rating - a.rating;
        default: return 0;
      }
    });

    return filtered;
  }, [filterStops, filterAirlines, filterMaxPrice, filterDep, sort, searchParams.class]);

  const toggleCompare = (flight) => {
    setCompareList(prev => {
      if (prev.find(f => f.id === flight.id)) return prev.filter(f => f.id !== flight.id);
      if (prev.length >= 3) return prev;
      return [...prev, flight];
    });
  };

  const toggleStop = (val) => {
    setFilterStops(prev => prev.includes(val) ? prev.filter(s => s !== val) : [...prev, val]);
  };

  const toggleAirline = (name) => {
    setFilterAirlines(prev => prev.includes(name) ? prev.filter(a => a !== name) : [...prev, name]);
  };

  const clearFilters = () => {
    setFilterStops([]);
    setFilterAirlines([]);
    setFilterMaxPrice(maxAvailablePrice);
    setFilterDep({ morning: false, afternoon: false, evening: false, night: false });
  };

  const hasFilters = filterStops.length > 0 || filterAirlines.length > 0 || filterMaxPrice < maxAvailablePrice || Object.values(filterDep).some(Boolean);

  const fromAirport = searchParams.from || 'JED';
  const toAirport = searchParams.to || 'DXB';

  return (
    <div className="sky-search-results sky-page">
      {/* Compact Search Bar */}
      <div className="sky-search-results__top">
        <div className="sky-container-wide">
          <div className="sky-search-results__breadcrumb">
            <button onClick={() => navigate('/')} className="sky-search-results__back">
              ← {ar ? 'الرئيسية' : 'Home'}
            </button>
            <span className="sky-search-results__route">
              {fromAirport} → {toAirport}
            </span>
            {searchParams.departDate && (
              <span className="sky-search-results__date">
                📅 {new Date(searchParams.departDate).toLocaleDateString(ar ? 'ar-SA' : 'en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </span>
            )}
          </div>
          <SearchBar compact />
        </div>
      </div>

      <div className="sky-container-wide sky-search-results__body">
        {/* SIDEBAR FILTERS */}
        <aside className={`sky-search-results__sidebar ${showFilters ? 'sky-search-results__sidebar--open' : ''}`}>
          <div className="sky-search-results__filter-header">
            <h2 className="sky-h4">{ar ? '🔧 الفلاتر' : '🔧 Filters'}</h2>
            {hasFilters && (
              <button className="sky-search-results__clear-btn" onClick={clearFilters}>
                {ar ? 'مسح الكل' : 'Clear All'}
              </button>
            )}
          </div>

          {/* Stops */}
          <div className="sky-search-results__filter-section">
            <h3 className="sky-search-results__filter-title">{ar ? 'عدد المحطات' : 'Stops'}</h3>
            {[
              { val: 0, label: ar ? 'رحلة مباشرة' : 'Non-stop' },
              { val: 1, label: ar ? 'محطة واحدة' : '1 Stop' },
              { val: 2, label: ar ? 'محطتان' : '2 Stops' },
            ].map(s => (
              <label key={s.val} className="sky-search-results__filter-check" id={`filter-stop-${s.val}`}>
                <input type="checkbox" checked={filterStops.includes(s.val)} onChange={() => toggleStop(s.val)} />
                <span>{s.label}</span>
              </label>
            ))}
          </div>

          {/* Price */}
          <div className="sky-search-results__filter-section">
            <h3 className="sky-search-results__filter-title">
              {ar ? 'الحد الأقصى للسعر' : 'Max Price'}:             <strong>{filterMaxPrice.toLocaleString()} {ar ? 'ج.م' : 'EGP'}</strong>
            </h3>
            <input
              id="filter-price"
              type="range"
              min={300}
              max={maxAvailablePrice}
              step={50}
              value={filterMaxPrice}
              onChange={e => setFilterMaxPrice(Number(e.target.value))}
              className="sky-search-results__range"
            />
            <div className="sky-search-results__range-labels">
              <span>300</span>
              <span>{maxAvailablePrice.toLocaleString()}</span>
            </div>
          </div>

          {/* Departure Time */}
          <div className="sky-search-results__filter-section">
            <h3 className="sky-search-results__filter-title">{ar ? 'وقت الإقلاع' : 'Departure Time'}</h3>
            <div className="sky-search-results__time-grid">
              {[
                { key: 'morning', label: ar ? '🌅 صباح' : '🌅 Morning', sub: '5-12' },
                { key: 'afternoon', label: ar ? '☀️ ظهر' : '☀️ Afternoon', sub: '12-17' },
                { key: 'evening', label: ar ? '🌆 مساء' : '🌆 Evening', sub: '17-21' },
                { key: 'night', label: ar ? '🌙 ليل' : '🌙 Night', sub: '21-5' },
              ].map(t => (
                <button
                  key={t.key}
                  id={`filter-dep-${t.key}`}
                  className={`sky-search-results__time-btn ${filterDep[t.key] ? 'sky-search-results__time-btn--active' : ''}`}
                  onClick={() => setFilterDep(prev => ({ ...prev, [t.key]: !prev[t.key] }))}
                >
                  <span>{t.label}</span>
                  <small>{t.sub}</small>
                </button>
              ))}
            </div>
          </div>

          {/* Airlines */}
          <div className="sky-search-results__filter-section">
            <h3 className="sky-search-results__filter-title">{ar ? 'الخطوط الجوية' : 'Airlines'}</h3>
            {allAirlines.map(a => (
              <label key={a} className="sky-search-results__filter-check" id={`filter-airline-${a.replace(/\s/g, '-')}`}>
                <input type="checkbox" checked={filterAirlines.includes(a)} onChange={() => toggleAirline(a)} />
                <span>{a}</span>
              </label>
            ))}
          </div>
        </aside>

        {/* RESULTS MAIN */}
        <main className="sky-search-results__main">
          {/* Toolbar */}
          <div className="sky-search-results__toolbar">
            <div className="sky-search-results__count">
              {loading ? (
                <span className="sky-skeleton" style={{ width: 150, height: 20 }} />
              ) : (
                <span>
                  <strong>{results.length}</strong> {ar ? 'رحلة متاحة' : 'flights found'}
                </span>
              )}
            </div>
            <div className="sky-search-results__toolbar-right">
              {/* Mobile filter toggle */}
              <button
                id="toggle-filters"
                className="sky-btn sky-btn-outline sky-btn-sm sky-hide-tablet"
                onClick={() => setShowFilters(f => !f)}
              >
                🔧 {ar ? 'فلاتر' : 'Filters'} {hasFilters && <span className="sky-navbar__badge">{[filterStops.length, filterAirlines.length].reduce((a,b) => a+b, 0) + (filterMaxPrice < maxAvailablePrice ? 1 : 0)}</span>}
              </button>
              {/* Sort */}
              <select
                id="sort-select"
                className="sky-input sky-select"
                style={{ width: 'auto', minWidth: 180 }}
                value={sort}
                onChange={e => setSort(e.target.value)}
              >
                {Object.entries(SORT_OPTIONS).map(([val, label]) => (
                  <option key={val} value={val}>{ar ? label.ar : label.en}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Compare Bar */}
          {compareList.length > 0 && (
            <div className="sky-search-results__compare-bar">
              <span>{ar ? 'مقارنة:' : 'Compare:'}</span>
              {compareList.map(f => (
                <span key={f.id} className="sky-search-results__compare-pill">
                  {f.airline}
                  <button onClick={() => toggleCompare(f)}>✕</button>
                </span>
              ))}
              {compareList.length >= 2 && (
                <button className="sky-btn sky-btn-primary sky-btn-sm">
                  {ar ? 'قارن الآن' : 'Compare Now'}
                </button>
              )}
            </div>
          )}

          {/* Flight List */}
          <div className="sky-search-results__list">
            {loading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="sky-search-results__skeleton sky-card" style={{ animationDelay: `${i * 0.1}s` }}>
                  <div className="sky-skeleton" style={{ width: '40%', height: 20 }} />
                  <div className="sky-skeleton" style={{ width: '100%', height: 60, marginTop: 12 }} />
                  <div className="sky-skeleton" style={{ width: '30%', height: 36, marginTop: 12 }} />
                </div>
              ))
            ) : results.length === 0 ? (
              <div className="sky-search-results__empty">
                <span>✈️</span>
                <h3>{ar ? 'لا توجد رحلات متاحة' : 'No flights found'}</h3>
                <p>{ar ? 'جرب تعديل الفلاتر أو تغيير التواريخ' : 'Try adjusting filters or changing dates'}</p>
                <button className="sky-btn sky-btn-primary" onClick={clearFilters}>{ar ? 'مسح الفلاتر' : 'Clear Filters'}</button>
              </div>
            ) : (
              results.map(flight => (
                <div key={flight.id} className="sky-search-results__card-wrap">
                  <FlightCard flight={flight} />
                  <button
                    className={`sky-search-results__compare-check ${compareList.find(f => f.id === flight.id) ? 'sky-search-results__compare-check--active' : ''}`}
                    onClick={() => toggleCompare(flight)}
                    title={ar ? 'إضافة للمقارنة' : 'Add to compare'}
                  >
                    {compareList.find(f => f.id === flight.id) ? '✓' : '+'} {ar ? 'مقارنة' : 'Compare'}
                  </button>
                </div>
              ))
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
