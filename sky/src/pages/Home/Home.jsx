import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import SearchBar from '../../components/SearchBar/SearchBar';
import { useBooking } from '../../context/BookingContext';
import { popularDestinations } from '../../data/airportsData';
import './Home.css';

const STATS = [
  { value: '200+', label: 'خط جوي عالمي', labelEn: 'Global Airlines', icon: '✈️' },
  { value: '5M+', label: 'مسافر سنوياً', labelEn: 'Travelers Yearly', icon: '👥' },
  { value: '4.8★', label: 'تقييم العملاء', labelEn: 'Customer Rating', icon: '⭐' },
  { value: '24/7', label: 'دعم مصري', labelEn: 'Egyptian Support', icon: '🇪🇬' },
];

const FEATURES = [
  { icon: '🇪🇬', title: 'منصة مصرية 100%', titleEn: '100% Egyptian', desc: 'أول منصة حجز طيران مصرية تدعم السياحة والمسافر المصري', descEn: 'First Egyptian flight booking platform supporting local travelers' },
  { icon: '💰', title: 'أرخص الأسعار', titleEn: 'Best Prices', desc: 'نضمن لك أقل سعر بتقنيات مقارنة ذكية مع أكثر من 200 خط جوي', descEn: 'Guaranteed lowest prices with smart comparison across 200+ airlines' },
  { icon: '⚡', title: 'حجز فوري', titleEn: 'Instant Booking', desc: 'تذكرتك الإلكترونية في ثوانٍ مع تأكيد فوري عبر البريد', descEn: 'E-ticket in seconds with instant email confirmation' },
  { icon: '🔄', title: 'إلغاء وتعديل مرن', titleEn: 'Flexible Changes', desc: 'سياسة إلغاء وتعديل مرنة تناسب احتياجات المسافر المصري', descEn: 'Flexible cancellation policy tailored for Egyptian travelers' },
  { icon: '💬', title: 'دعم مصري 24/7', titleEn: '24/7 Local Support', desc: 'فريق دعم مصري متخصص متاح كل لحظة لخدمتك بالعربية', descEn: 'Dedicated Egyptian support team available 24/7 in Arabic' },
  { icon: '📱', title: 'تطبيق سكاي فلاي', titleEn: 'SkyFly App', desc: 'حمّل تطبيقنا لإدارة حجوزاتك بسهولة من أي مكان', descEn: 'Download our app to manage bookings anywhere' },
];

const OFFERS = [
  { title: 'رحلات البحر الأحمر', titleEn: 'Red Sea Trips', desc: 'خصم حتى 45% على رحلات الغردقة وشرم الشيخ', descEn: 'Up to 45% off on Hurghada & Sharm flights', discount: '45%', color: '#C8102E', bg: 'linear-gradient(135deg, rgba(200,16,46,0.85), rgba(232,48,74,0.85))', emoji: '🏖️', image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80' },
  { title: 'سياحة النيل', titleEn: 'Nile Tourism', desc: 'عروض خاصة للأقصر وأسوان بأسعار لا تقاوم', descEn: 'Special deals for Luxor & Aswan', discount: '35%', color: '#D4A843', bg: 'linear-gradient(135deg, rgba(184,145,46,0.85), rgba(212,168,67,0.85))', emoji: '🏛️', image: 'https://images.unsplash.com/photo-1568322445389-f64ac2515020?w=800&q=80' },
  { title: 'رحلات الخليج', titleEn: 'Gulf Flights', desc: 'أسعار مخفضة للسفر من مصر إلى الإمارات وقطر', descEn: 'Discounted fares from Egypt to UAE & Qatar', discount: '30%', color: '#1A3C6E', bg: 'linear-gradient(135deg, rgba(26,60,110,0.85), rgba(45,94,160,0.85))', emoji: '🌆', image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&q=80' },
];

const AIRLINES_STRIP = ['🇪🇬 مصر للطيران', '🇪🇬 Air Cairo', '🇪🇬 Nile Air', '🇦🇪 طيران الإمارات', '🇶🇦 الخطوط القطرية', '🇹🇷 الخطوط التركية', '🇦🇪 العربية للطيران', '🇯🇴 الملكية الأردنية'];

const EGYPTIAN_DESTINATIONS_EXTRA = [
  { label: 'الغردقة', labelEn: 'Hurghada', desc: 'أجمل شواطئ البحر الأحمر', descEn: 'Red Sea beaches' },
  { label: 'الأقصر', labelEn: 'Luxor', desc: 'مدينة الآثار الفرعونية', descEn: 'Pharaonic monuments' },
  { label: 'شرم الشيخ', labelEn: 'Sharm', desc: 'وجهة الغوص الأولى', descEn: 'Top diving destination' },
  { label: 'أسوان', labelEn: 'Aswan', desc: 'سحر النيل الخالد', descEn: 'Timeless Nile' },
];

export default function Home() {
  const { lang, setSearchParams } = useBooking();
  const navigate = useNavigate();
  const ar = lang === 'ar';
  const heroRef = useRef(null);

  useEffect(() => {
    document.title = ar ? 'SkyFly مصر - احجز رحلتك بأفضل الأسعار' : 'SkyFly Egypt - Book Your Flight at Best Prices';
  }, [ar]);

  const handleDestinationClick = (dest) => {
    setSearchParams(prev => ({ ...prev, to: dest.code }));
    navigate('/search');
  };

  return (
    <main className="sky-home">
      {/* HERO */}
      <section className="sky-home__hero" ref={heroRef} aria-label={ar ? 'بحث الرحلات' : 'Flight search'}>
        <div className="sky-home__hero-bg" aria-hidden="true">
          <div className="sky-home__pyramid sky-home__pyramid-1" />
          <div className="sky-home__pyramid sky-home__pyramid-2" />
          <div className="sky-home__pyramid sky-home__pyramid-3" />
          <div className="sky-home__cloud sky-home__cloud-1" />
          <div className="sky-home__cloud sky-home__cloud-2" />
          <div className="sky-home__plane-trail" />
          <div className="sky-home__sun" />
        </div>

        <div className="sky-home__hero-content sky-container">
          <div className="sky-home__hero-badge sky-animate-fade">
            <span>🇪🇬</span>
            <span>{ar ? 'أول منصة حجز طيران مصرية' : 'First Egyptian Flight Booking Platform'}</span>
          </div>
          <h1 className="sky-home__hero-title sky-h1">
            {ar ? (
              <>سافر من مصر للعالم مع <span className="sky-home__hero-brand">SkyFly</span></>
            ) : (
              <>Travel from Egypt to the World with <span className="sky-home__hero-brand">SkyFly</span></>
            )}
          </h1>
          <p className="sky-home__hero-subtitle">
            {ar ? 'أرخص تذاكر الطيران من وإلى مصر. قارن الأسعار، احجز فوراً، وسافر بثقة' : 'Cheapest flights from and to Egypt. Compare prices, book instantly, travel with confidence'}
          </p>

          <div className="sky-home__searchbar-wrap sky-animate-fade" style={{ animationDelay: '0.2s' }}>
            <SearchBar />
          </div>

          <div className="sky-home__stats sky-animate-fade" style={{ animationDelay: '0.35s' }}>
            {STATS.map(s => (
              <div key={s.value} className="sky-home__stat">
                <span className="sky-home__stat-icon">{s.icon}</span>
                <strong>{s.value}</strong>
                <span>{ar ? s.label : s.labelEn}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="sky-home__hero-scroll" aria-hidden="true">
          <span>↓</span>
        </div>
      </section>

      {/* AIRLINES STRIP */}
      <section className="sky-home__airlines" aria-label={ar ? 'شركاؤنا من الخطوط الجوية' : 'Airline partners'}>
        <div className="sky-home__airlines-track">
          {[...AIRLINES_STRIP, ...AIRLINES_STRIP].map((a, i) => (
            <span key={i} className="sky-home__airline-pill">{a}</span>
          ))}
        </div>
      </section>

      {/* EGYPTIAN DESTINATIONS STRIP */}
      <section className="sky-home__egypt-strip">
        <div className="sky-container">
          <div className="sky-home__egypt-strip-grid">
            {EGYPTIAN_DESTINATIONS_EXTRA.map((d, i) => (
              <div key={i} className="sky-home__egypt-strip-item">
                <span className="sky-home__egypt-strip-icon">
                  {['🏖️', '🏛️', '🤿', '🌴'][i]}
                </span>
                <div>
                  <strong>{ar ? d.label : d.labelEn}</strong>
                  <span>{ar ? d.desc : d.descEn}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SPECIAL OFFERS */}
      <section className="sky-section sky-home__offers" aria-label={ar ? 'العروض الخاصة' : 'Special offers'}>
        <div className="sky-container">
          <div className="sky-section-header">
            <span className="sky-label">🎉 {ar ? 'عروض حصرية لمصر' : 'Exclusive Egypt Deals'}</span>
            <h2 className="sky-h2">{ar ? 'عروض لا تفوتها من مصر' : "Don't Miss These Egypt Deals"}</h2>
            <p>{ar ? 'اغتنم أفضل العروض على الرحلات من وإلى مصر' : 'Grab the best deals on flights from and to Egypt'}</p>
          </div>

          <div className="sky-home__offers-grid">
            {OFFERS.map((offer, i) => (
              <article key={i} className="sky-home__offer-card" style={{ background: `${offer.bg}, url(${offer.image})` }}>
                <div className="sky-home__offer-emoji">{offer.emoji}</div>
                <div className="sky-home__offer-discount">{ar ? 'خصم' : 'OFF'} {offer.discount}</div>
                <h3 className="sky-h4">{ar ? offer.title : offer.titleEn}</h3>
                <p>{ar ? offer.desc : offer.descEn}</p>
                <button
                  className="sky-btn sky-btn-sm"
                  style={{ background: 'rgba(255,255,255,0.2)', color: 'white', border: '1px solid rgba(255,255,255,0.3)', marginTop: 12 }}
                  onClick={() => navigate('/search')}
                >
                  {ar ? 'احجز الآن ←' : 'Book Now →'}
                </button>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* POPULAR DESTINATIONS */}
      <section className="sky-section sky-home__destinations" aria-label={ar ? 'وجهات شائعة' : 'Popular destinations'}>
        <div className="sky-container">
          <div className="sky-section-header">
            <span className="sky-label">🌍 {ar ? 'وجهات من مصر' : 'Destinations from Egypt'}</span>
            <h2 className="sky-h2">{ar ? 'الوجهات الأكثر طلباً من مصر' : 'Most Booked from Egypt'}</h2>
            <p>{ar ? 'استكشف أفضل الوجهات العالمية بأرخص الأسعار من مطارات مصر' : 'Explore top global destinations at best prices from Egyptian airports'}</p>
          </div>

          <div className="sky-home__destinations-grid">
            {popularDestinations.map((dest, i) => (
              <article
                key={dest.code}
                className={`sky-home__dest-card ${i === 0 ? 'sky-home__dest-card--featured' : ''}`}
                onClick={() => handleDestinationClick(dest)}
                id={`dest-${dest.code}`}
                tabIndex={0}
                role="button"
                onKeyDown={e => e.key === 'Enter' && handleDestinationClick(dest)}
              >
                <img
                  src={dest.image}
                  alt={dest.city}
                  className="sky-home__dest-img"
                  loading="lazy"
                />
                <div className="sky-home__dest-overlay" />
                {dest.tag && (
                  <span className={`sky-home__dest-tag sky-home__dest-tag--${dest.tagColor}`}>{dest.tag}</span>
                )}
                <div className="sky-home__dest-info">
                  <div className="sky-home__dest-location">
                    <h3 className="sky-h4">{ar ? dest.city : dest.cityEn}</h3>
                    <p>{dest.country}</p>
                  </div>
                  <div className="sky-home__dest-price">
                    <span className="sky-home__dest-from">{ar ? 'من' : 'From'}</span>
                    <strong>{dest.price.toLocaleString()} {ar ? 'ج.م' : 'EGP'}</strong>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="sky-section sky-home__features" aria-label={ar ? 'مميزاتنا' : 'Our features'}>
        <div className="sky-container">
          <div className="sky-section-header">
            <span className="sky-label">⚡ {ar ? 'لماذا SkyFly مصر؟' : 'Why SkyFly Egypt?'}</span>
            <h2 className="sky-h2">{ar ? 'أول منصة حجز طيران مصرية' : 'The First Egyptian Booking Platform'}</h2>
            <p>{ar ? 'نقدم تجربة حجز استثنائية للمسافر المصري والعربي' : 'We provide exceptional booking experience for Egyptian and Arab travelers'}</p>
          </div>

          <div className="sky-home__features-grid">
            {FEATURES.map((f, i) => (
              <article key={i} className="sky-home__feature-card sky-card">
                <div className="sky-home__feature-icon">{f.icon}</div>
                <h3 className="sky-h4">{ar ? f.title : f.titleEn}</h3>
                <p>{ar ? f.desc : f.descEn}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* CTA BANNER */}
      <section className="sky-home__cta sky-section" aria-label={ar ? 'ابدأ الحجز' : 'Start booking'}>
        <div className="sky-container">
          <div className="sky-home__cta-card">
            <div className="sky-home__cta-content">
              <span className="sky-home__cta-emoji sky-animate-float">🇪🇬</span>
              <h2 className="sky-h2">{ar ? 'جهّز شنطتك لرحلة من مصر!' : 'Ready for your trip from Egypt?'}</h2>
              <p>{ar ? 'انضم لأكثر من 5 ملايين مسافر يثقون في SkyFly مصر. أرخص الأسعار، أضمن الخدمة.' : 'Join over 5M travelers who trust SkyFly Egypt. Best prices, guaranteed service.'}</p>
              <button id="cta-search-btn" className="sky-btn sky-btn-primary sky-btn-xl" onClick={() => navigate('/search')}>
                {ar ? '🔍 ابحث عن رحلتك الآن' : '🔍 Search Your Flight Now'}
              </button>
              <div className="sky-home__cta-trust">
                <span>🇪🇬 {ar ? 'منصة مصرية مرخصة' : 'Licensed Egyptian Platform'}</span>
                <span>🔒 {ar ? 'دفع آمن مشفر' : 'Secure Encrypted Payment'}</span>
                <span>⭐ {ar ? 'آلاف التقييمات 4.8' : 'Thousands of 4.8★ Reviews'}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Egypt section */}
      <section className="sky-home__egypt-badge">
        <div className="sky-container text-center">
          <div className="sky-home__egypt-badge-inner">
            <span className="sky-home__egypt-flag">🇪🇬</span>
            <div>
              <h3>{ar ? 'SkyFly مصر - طيرانك بأيادٍ مصرية' : 'SkyFly Egypt - Egyptian Hands, Global Reach'}</h3>
              <p>{ar ? 'نفخر بأن نكون أول منصة حجز طيران مصرية تخدم المسافر المصري والعربي حول العالم' : 'Proud to be the first Egyptian booking platform serving travelers worldwide'}</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
