import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useBooking } from '../../context/BookingContext';
import AuthModal from '../AuthModal/AuthModal';
import './Navbar.css';

export default function Navbar() {
  const { theme, toggleTheme, lang, toggleLang, trips, user } = useBooking();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const navRef = useRef(null);

  const isHome = location.pathname === '/';
  const confirmedTrips = trips.filter(t => t.status === 'confirmed').length;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [location]);

  const navLinks = lang === 'ar'
    ? [
        { label: 'الرئيسية', path: '/' },
        { label: 'البحث', path: '/search' },
        { label: 'رحلاتي', path: '/my-trips', badge: confirmedTrips },
        ...(user ? [{ label: 'حسابي', path: '/account' }] : []),
      ]
    : [
        { label: 'Home', path: '/' },
        { label: 'Search', path: '/search' },
        { label: 'My Trips', path: '/my-trips', badge: confirmedTrips },
        ...(user ? [{ label: 'Account', path: '/account' }] : []),
      ];

  const egyptianFlag = '🇪🇬';

  return (
    <nav ref={navRef} className={`sky-navbar ${scrolled || !isHome ? 'sky-navbar--solid' : ''} ${menuOpen ? 'sky-navbar--open' : ''}`} role="navigation" aria-label="Main navigation">
      <div className="sky-navbar__inner sky-container-wide">
        <Link to="/" className="sky-navbar__logo" id="nav-logo">
          <div className="sky-navbar__logo-icon-wrap">
            <span className="sky-navbar__logo-icon">✈</span>
            <span className="sky-navbar__logo-flag">{egyptianFlag}</span>
          </div>
          <div className="sky-navbar__logo-text-wrap">
            <span className="sky-navbar__logo-text">Sky<span>Fly</span></span>
            <span className="sky-navbar__logo-sub">مصر</span>
          </div>
        </Link>

        <ul className="sky-navbar__links sky-hide-mobile" role="list">
          {navLinks.map(link => (
            <li key={link.path}>
              <Link
                to={link.path}
                id={`nav-${link.path.replace('/', '') || 'home'}`}
                className={`sky-navbar__link ${location.pathname === link.path ? 'sky-navbar__link--active' : ''}`}
              >
                {link.label}
                {link.badge > 0 && (
                  <span className="sky-navbar__badge">{link.badge}</span>
                )}
              </Link>
            </li>
          ))}
        </ul>

        <div className="sky-navbar__actions">
          <button
            id="nav-lang-toggle"
            className="sky-navbar__action-btn"
            onClick={toggleLang}
            title={lang === 'ar' ? 'Switch to English' : 'تبديل للعربية'}
            aria-label="Toggle language"
          >
            <span className="sky-navbar__lang-icon">🌐</span>
            <span className="sky-hide-mobile">{lang === 'ar' ? 'EN' : 'عر'}</span>
          </button>

          <button
            id="nav-theme-toggle"
            className="sky-navbar__action-btn"
            onClick={toggleTheme}
            title={theme === 'dark' ? 'وضع نهاري' : 'وضع ليلي'}
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>

          {user ? (
            <button className="sky-navbar__action-btn" id="nav-avatar" onClick={() => navigate('/account')} title={user.name}>
              <span className="sky-navbar__avatar">{user.name?.charAt(0) || '👤'}</span>
            </button>
          ) : (
            <button id="nav-login" className="sky-btn sky-btn-outline sky-btn-sm sky-hide-mobile" onClick={() => setShowAuth(true)}>
              👤 {lang === 'ar' ? 'دخول' : 'Login'}
            </button>
          )}

          <button
            id="nav-book-cta"
            className="sky-btn sky-btn-primary sky-btn-sm sky-hide-mobile"
            onClick={() => navigate('/search')}
          >
            {lang === 'ar' ? '🔍 ابحث الآن' : '🔍 Search Flights'}
          </button>

          <button
            id="nav-hamburger"
            className="sky-navbar__hamburger"
            onClick={() => setMenuOpen(m => !m)}
            aria-expanded={menuOpen}
            aria-label="Toggle menu"
          >
            <span /><span /><span />
          </button>
        </div>

        {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}
      </div>

      <div className={`sky-navbar__mobile-menu ${menuOpen ? 'sky-navbar__mobile-menu--open' : ''}`}>
        <ul role="list">
          {navLinks.map(link => (
            <li key={link.path}>
              <Link
                to={link.path}
                className={`sky-navbar__mobile-link ${location.pathname === link.path ? 'sky-navbar__mobile-link--active' : ''}`}
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
                {link.badge > 0 && <span className="sky-navbar__badge">{link.badge}</span>}
              </Link>
            </li>
          ))}
        </ul>
        <div className="sky-navbar__mobile-footer">
          <button className="sky-btn sky-btn-primary sky-btn-full" onClick={() => { navigate('/search'); setMenuOpen(false); }}>
            {lang === 'ar' ? '🔍 ابحث عن رحلة' : '🔍 Find Flights'}
          </button>
          <p className="sky-navbar__mobile-brand">SkyFly مصر ✈️ 🇪🇬</p>
        </div>
      </div>
    </nav>
  );
}
