import { Link } from 'react-router-dom';
import { useBooking } from '../../context/BookingContext';
import './Footer.css';

export default function Footer() {
  const { lang } = useBooking();
  const ar = lang === 'ar';

  const links = ar ? {
    company: { title: 'SkyFly مصر', items: ['من نحن', 'الوظائف', 'أخبارنا', 'المسؤولية المجتمعية'] },
    support: { title: 'الدعم', items: ['مركز المساعدة', 'تواصل معنا', 'الأسئلة الشائعة', 'الدردشة المباشرة', 'واتساب'] },
    services: { title: 'خدماتنا', items: ['حجز الطيران', 'عروض مصر', 'الوجهات', 'التأمين السفري'] },
    legal: { title: 'قانوني', items: ['سياسة الخصوصية', 'شروط الاستخدام', 'سياسة الاسترداد', 'سياسة ملفات تعريف الارتباط'] },
  } : {
    company: { title: 'SkyFly Egypt', items: ['About Us', 'Careers', 'News', 'CSR'] },
    support: { title: 'Support', items: ['Help Center', 'Contact Us', 'FAQ', 'Live Chat', 'WhatsApp'] },
    services: { title: 'Services', items: ['Flights', 'Egypt Deals', 'Destinations', 'Travel Insurance'] },
    legal: { title: 'Legal', items: ['Privacy Policy', 'Terms of Use', 'Refund Policy', 'Cookie Policy'] },
  };

  const socials = ['🐦', '📘', '📸', '▶️', '💬'];

  return (
    <footer className="sky-footer">
      <div className="sky-footer__top sky-container-wide">
        <div className="sky-footer__brand">
          <Link to="/" className="sky-footer__logo">
            <span className="sky-footer__logo-plane">✈</span>
            <div>
              <span className="sky-footer__logo-text">Sky<strong>Fly</strong></span>
              <span className="sky-footer__logo-sub">مصر</span>
            </div>
          </Link>
          <p>{ar ? 'أول منصة حجز طيران مصرية. نقدم أرخص تذاكر الطيران من وإلى مصر بكل سهولة وأمان.' : 'The first Egyptian flight booking platform. Best flight deals from and to Egypt, safely and easily.'}</p>
          <div className="sky-footer__socials">
            {socials.map((s, i) => (
              <button key={i} className="sky-footer__social-btn" aria-label={`Social link ${i}`}>{s}</button>
            ))}
          </div>
          <div className="sky-footer__featured-badge">
            <span>🇪🇬</span>
            <span>{ar ? 'منصة مصرية معتمدة' : 'Licensed Egyptian Platform'}</span>
          </div>
        </div>

        {Object.values(links).map((section) => (
          <div key={section.title} className="sky-footer__col">
            <h4 className="sky-footer__col-title">{section.title}</h4>
            <ul>
              {section.items.map(item => (
                <li key={item}>
                  <a href="#" className="sky-footer__col-link">{item}</a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="sky-footer__bottom sky-container-wide">
        <p>{ar ? '© 2026 SkyFly مصر. جميع الحقوق محفوظة.' : '© 2026 SkyFly Egypt. All rights reserved.'}</p>
        <div className="sky-footer__payments">
          {['💳 Visa', '💳 Mastercard', '💳 Meeza', '💳 Apple Pay', '💳 ValU', '📱 فوري'].map(p => (
            <span key={p} className="sky-footer__payment-badge">{p}</span>
          ))}
        </div>
      </div>
    </footer>
  );
}
