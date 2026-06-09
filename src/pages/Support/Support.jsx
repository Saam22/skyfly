import { useState, useEffect, useMemo } from 'react';
import { useBooking } from '../../context/BookingContext';
import { FAQ_CATEGORIES, FAQ_ITEMS } from '../../data/faqData';
import './Support.css';

const CONTACT_SUBJECTS = [
  { value: 'general', label: 'استفسار عام', labelEn: 'General Inquiry' },
  { value: 'booking', label: 'مشكلة في الحجز', labelEn: 'Booking Issue' },
  { value: 'baggage', label: 'الأمتعة', labelEn: 'Baggage' },
  { value: 'complaint', label: 'شكوى', labelEn: 'Complaint' },
  { value: 'suggestion', label: 'اقتراح', labelEn: 'Suggestion' },
  { value: 'other', label: 'أخرى', labelEn: 'Other' },
];

const CONTACT_INFO = {
  phone: '16111',
  email: 'support@skyfly-egypt.com',
  address: { ar: 'القاهرة الجديدة، مصر', en: 'New Cairo, Egypt' },
  hours: { ar: 'يومياً ٢٤ ساعة', en: '24/7 Daily' },
};

export default function Support() {
  const { lang, submitContact } = useBooking();
  const ar = lang === 'ar';

  const [activeTab, setActiveTab] = useState('help');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState(null);
  const [expandedItems, setExpandedItems] = useState([]);
  const [contactForm, setContactForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    document.title = ar ? 'SkyFly - مركز المساعدة' : 'SkyFly - Support Center';
  }, [ar]);

  const filteredItems = useMemo(() => {
    let items = FAQ_ITEMS;
    if (activeCategory) {
      items = items.filter(item => item.category === activeCategory);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      items = items.filter(item =>
        item.question.toLowerCase().includes(q) ||
        item.questionEn.toLowerCase().includes(q) ||
        item.answer.toLowerCase().includes(q) ||
        item.answerEn.toLowerCase().includes(q)
      );
    }
    return items;
  }, [activeCategory, searchQuery]);

  const toggleExpand = (id) => {
    setExpandedItems(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const handleCategoryClick = (catId) => {
    setActiveCategory(prev => prev === catId ? null : catId);
    setExpandedItems([]);
  };

  const handleContactChange = (field, value) => {
    setContactForm(prev => ({ ...prev, [field]: value }));
    if (formErrors[field]) {
      setFormErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!contactForm.name.trim()) errors.name = ar ? 'الاسم مطلوب' : 'Name is required';
    if (!contactForm.email.trim()) errors.email = ar ? 'البريد الإلكتروني مطلوب' : 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(contactForm.email)) errors.email = ar ? 'بريد إلكتروني غير صالح' : 'Invalid email';
    if (!contactForm.subject) errors.subject = ar ? 'الموضوع مطلوب' : 'Subject is required';
    if (!contactForm.message.trim()) errors.message = ar ? 'الرسالة مطلوبة' : 'Message is required';
    return errors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errors = validateForm();
    setFormErrors(errors);
    if (Object.keys(errors).length > 0) return;
    submitContact(contactForm);
    setFormSubmitted(true);
    setContactForm({ name: '', email: '', phone: '', subject: '', message: '' });
  };

  const tabs = ar
    ? [
        { key: 'help', label: '📖 مركز المساعدة', icon: '📖' },
        { key: 'chat', label: '💬 الدردشة المباشرة', icon: '💬' },
        { key: 'contact', label: '📞 تواصل معنا', icon: '📞' },
      ]
    : [
        { key: 'help', label: '📖 Help Center', icon: '📖' },
        { key: 'chat', label: '💬 Live Chat', icon: '💬' },
        { key: 'contact', label: '📞 Contact Us', icon: '📞' },
      ];

  return (
    <div className="sky-support sky-page">
      <section className="sky-support__hero">
        <div className="sky-container">
          <div className="sky-support__hero-content">
            <h1 className="sky-h1">
              {ar ? 'كيف يمكننا مساعدتك؟' : 'How can we help you?'}
            </h1>
            <p>
              {ar
                ? 'نحن هنا للإجابة على جميع استفساراتك على مدار الساعة'
                : 'We are here to answer all your questions around the clock'}
            </p>
          </div>
        </div>
      </section>

      <section className="sky-section sky-support__body">
        <div className="sky-container">
          <div className="sky-support__tabs">
            {tabs.map(t => (
              <button
                key={t.key}
                className={`sky-support__tab ${activeTab === t.key ? 'sky-support__tab--active' : ''}`}
                onClick={() => setActiveTab(t.key)}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* ===== Help Center Tab ===== */}
          {activeTab === 'help' && (
            <div className="sky-support__help">
              <div className="sky-support__search-wrap">
                <span className="sky-support__search-icon">🔍</span>
                <input
                  className="sky-input sky-support__search-input"
                  type="text"
                  placeholder={ar ? 'ابحث في الأسئلة الشائعة...' : 'Search FAQ...'}
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                  <button className="sky-support__search-clear" onClick={() => setSearchQuery('')}>
                    ✕
                  </button>
                )}
              </div>

              <div className="sky-support__categories">
                {FAQ_CATEGORIES.map(cat => {
                  const isActive = activeCategory === cat.id;
                  return (
                    <button
                      key={cat.id}
                      className={`sky-support__category-pill ${isActive ? 'sky-support__category-pill--active' : ''}`}
                      onClick={() => handleCategoryClick(cat.id)}
                    >
                      <span>{cat.icon}</span>
                      <span>{ar ? cat.label : cat.labelEn}</span>
                      {isActive && <span className="sky-support__category-x">✕</span>}
                    </button>
                  );
                })}
              </div>

              <div className="sky-support__faq-list">
                {filteredItems.length === 0 ? (
                  <div className="sky-support__faq-empty">
                    <span>🔍</span>
                    <p>{ar ? 'لا توجد نتائج مطابقة' : 'No matching results found'}</p>
                    <button className="sky-btn sky-btn-ghost sky-btn-sm" onClick={() => { setSearchQuery(''); setActiveCategory(null); }}>
                      {ar ? 'مسح البحث' : 'Clear search'}
                    </button>
                  </div>
                ) : (
                  filteredItems.map(item => {
                    const isOpen = expandedItems.includes(item.id);
                    return (
                      <div key={item.id} className={`sky-support__faq-item sky-card ${isOpen ? 'sky-support__faq-item--open' : ''}`}>
                        <button
                          className="sky-support__faq-question"
                          onClick={() => toggleExpand(item.id)}
                          aria-expanded={isOpen}
                        >
                          <span>{ar ? item.question : item.questionEn}</span>
                          <span className={`sky-support__faq-arrow ${isOpen ? 'sky-support__faq-arrow--open' : ''}`}>
                            ▼
                          </span>
                        </button>
                        <div className={`sky-support__faq-answer ${isOpen ? 'sky-support__faq-answer--open' : ''}`}>
                          <p>{ar ? item.answer : item.answerEn}</p>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}

          {/* ===== Live Chat Tab ===== */}
          {activeTab === 'chat' && (
            <div className="sky-support__chat sky-card">
              <div className="sky-support__chat-icon">💬</div>
              <h2 className="sky-h3">
                {ar ? 'الدردشة المباشرة' : 'Live Chat'}
              </h2>
              <p className="sky-support__chat-desc">
                {ar
                  ? 'يمكنك التحدث مع فريق الدعم الفني لدينا مباشرة عبر الدردشة المباشرة. فريقنا متاح على مدار الساعة للإجابة على استفساراتك.'
                  : 'Chat with our support team in real-time. Our team is available 24/7 to answer your questions.'}
              </p>
              <div className="sky-support__chat-features">
                <div className="sky-support__chat-feature">
                  <span>🕐</span>
                  <span>{ar ? 'متاح ٢٤ ساعة' : 'Available 24/7'}</span>
                </div>
                <div className="sky-support__chat-feature">
                  <span>⚡</span>
                  <span>{ar ? 'رد فوري' : 'Instant response'}</span>
                </div>
                <div className="sky-support__chat-feature">
                  <span>🔒</span>
                  <span>{ar ? 'معلوماتك آمنة' : 'Your info is safe'}</span>
                </div>
              </div>
              <p className="sky-support__chat-note">
                {ar
                  ? '💡 يمكنك أيضاً فتح الدردشة المباشرة في أي وقت من خلال زر الدردشة في الزاوية السفلية اليمنى'
                  : '💡 You can also open live chat anytime using the chat button in the bottom-right corner'}
              </p>
              <button className="sky-btn sky-btn-primary sky-btn-lg" onClick={() => {
                const chatBtn = document.querySelector('.sky-chat-btn');
                if (chatBtn) chatBtn.click();
              }}>
                💬 {ar ? 'ابدأ المحادثة' : 'Start Chat'}
              </button>
            </div>
          )}

          {/* ===== Contact Us Tab ===== */}
          {activeTab === 'contact' && (
            <div className="sky-support__contact">
              <div className="sky-support__contact-grid">
                <div className="sky-support__contact-form-wrap">
                  {formSubmitted ? (
                    <div className="sky-support__contact-success sky-card">
                      <span className="sky-support__contact-success-icon">✅</span>
                      <h3 className="sky-h4">
                        {ar ? 'تم إرسال رسالتك!' : 'Your message has been sent!'}
                      </h3>
                      <p>
                        {ar
                          ? 'شكراً لتواصلك مع SkyFly مصر. سيقوم فريق الدعم بالرد عليك في أقرب وقت ممكن.'
                          : 'Thank you for contacting SkyFly Egypt. Our support team will get back to you as soon as possible.'}
                      </p>
                      <button className="sky-btn sky-btn-primary" onClick={() => setFormSubmitted(false)}>
                        {ar ? 'إرسال رسالة أخرى' : 'Send another message'}
                      </button>
                    </div>
                  ) : (
                    <div className="sky-support__contact-form sky-card">
                      <h2 className="sky-h3">
                        {ar ? 'أرسل لنا رسالة' : 'Send us a message'}
                      </h2>
                      <form onSubmit={handleSubmit}>
                        <div className="sky-support__form-row">
                          <div className="sky-support__form-field">
                            <label>{ar ? 'الاسم الكامل' : 'Full Name'} *</label>
                            <input
                              className={`sky-input ${formErrors.name ? 'sky-input--error' : ''}`}
                              type="text"
                              value={contactForm.name}
                              onChange={e => handleContactChange('name', e.target.value)}
                              placeholder={ar ? 'أدخل اسمك' : 'Enter your name'}
                            />
                            {formErrors.name && <span className="sky-support__form-error">{formErrors.name}</span>}
                          </div>
                          <div className="sky-support__form-field">
                            <label>{ar ? 'البريد الإلكتروني' : 'Email'} *</label>
                            <input
                              className={`sky-input ${formErrors.email ? 'sky-input--error' : ''}`}
                              type="email"
                              value={contactForm.email}
                              onChange={e => handleContactChange('email', e.target.value)}
                              placeholder={ar ? 'أدخل بريدك الإلكتروني' : 'Enter your email'}
                              dir="ltr"
                            />
                            {formErrors.email && <span className="sky-support__form-error">{formErrors.email}</span>}
                          </div>
                        </div>
                        <div className="sky-support__form-row">
                          <div className="sky-support__form-field">
                            <label>{ar ? 'رقم الهاتف' : 'Phone'}</label>
                            <input
                              className="sky-input"
                              type="tel"
                              value={contactForm.phone}
                              onChange={e => handleContactChange('phone', e.target.value)}
                              placeholder={ar ? 'أدخل رقم هاتفك (اختياري)' : 'Enter your phone (optional)'}
                              dir="ltr"
                            />
                          </div>
                          <div className="sky-support__form-field">
                            <label>{ar ? 'الموضوع' : 'Subject'} *</label>
                            <select
                              className={`sky-input sky-select ${formErrors.subject ? 'sky-input--error' : ''}`}
                              value={contactForm.subject}
                              onChange={e => handleContactChange('subject', e.target.value)}
                            >
                              <option value="">{ar ? 'اختر الموضوع...' : 'Select subject...'}</option>
                              {CONTACT_SUBJECTS.map(s => (
                                <option key={s.value} value={s.value}>
                                  {ar ? s.label : s.labelEn}
                                </option>
                              ))}
                            </select>
                            {formErrors.subject && <span className="sky-support__form-error">{formErrors.subject}</span>}
                          </div>
                        </div>
                        <div className="sky-support__form-field">
                          <label>{ar ? 'الرسالة' : 'Message'} *</label>
                          <textarea
                            className={`sky-input sky-support__textarea ${formErrors.message ? 'sky-input--error' : ''}`}
                            value={contactForm.message}
                            onChange={e => handleContactChange('message', e.target.value)}
                            placeholder={ar ? 'اكتب رسالتك هنا...' : 'Type your message here...'}
                            rows={5}
                          />
                          {formErrors.message && <span className="sky-support__form-error">{formErrors.message}</span>}
                        </div>
                        <button type="submit" className="sky-btn sky-btn-primary sky-btn-lg sky-btn-full">
                          📨 {ar ? 'إرسال الرسالة' : 'Send Message'}
                        </button>
                      </form>
                    </div>
                  )}
                </div>

                <div className="sky-support__contact-info">
                  <div className="sky-support__info-card sky-card">
                    <h3 className="sky-h4">
                      {ar ? 'معلومات الاتصال' : 'Contact Information'}
                    </h3>
                    <div className="sky-support__info-list">
                      <div className="sky-support__info-item">
                        <span className="sky-support__info-icon">📞</span>
                        <div>
                          <span className="sky-support__info-label">{ar ? 'الهاتف' : 'Phone'}</span>
                          <span className="sky-support__info-value" dir="ltr">{CONTACT_INFO.phone}</span>
                        </div>
                      </div>
                      <div className="sky-support__info-item">
                        <span className="sky-support__info-icon">✉️</span>
                        <div>
                          <span className="sky-support__info-label">{ar ? 'البريد الإلكتروني' : 'Email'}</span>
                          <span className="sky-support__info-value">{CONTACT_INFO.email}</span>
                        </div>
                      </div>
                      <div className="sky-support__info-item">
                        <span className="sky-support__info-icon">📍</span>
                        <div>
                          <span className="sky-support__info-label">{ar ? 'العنوان' : 'Address'}</span>
                          <span className="sky-support__info-value">{ar ? CONTACT_INFO.address.ar : CONTACT_INFO.address.en}</span>
                        </div>
                      </div>
                      <div className="sky-support__info-item">
                        <span className="sky-support__info-icon">🕐</span>
                        <div>
                          <span className="sky-support__info-label">{ar ? 'ساعات العمل' : 'Working Hours'}</span>
                          <span className="sky-support__info-value">{ar ? CONTACT_INFO.hours.ar : CONTACT_INFO.hours.en}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
