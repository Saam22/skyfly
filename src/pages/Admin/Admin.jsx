import { useState, useEffect } from 'react';
import { useBooking } from '../../context/BookingContext';
import { ADMIN_STATS, ADMIN_FLIGHTS, ADMIN_CUSTOMERS, ADMIN_PAYMENTS } from '../../data/adminData';
import './Admin.css';

const TABS = [
  { key: 'stats', label: '📈 الإحصائيات', labelEn: '📈 Statistics' },
  { key: 'flights', label: '✈️ الرحلات', labelEn: '✈️ Flights' },
  { key: 'customers', label: '👥 العملاء', labelEn: '👥 Customers' },
  { key: 'payments', label: '💰 المالية', labelEn: '💰 Payments' },
  { key: 'settings', label: '⚙️ الإعدادات', labelEn: '⚙️ Settings' },
];

function formatCurrency(n) {
  return n.toLocaleString() + ' ج.م';
}

function formatCurrencyEn(n) {
  return 'EGP ' + n.toLocaleString();
}

export default function Admin() {
  const { lang, toggleAdminMode, adminMode, toggleLang, toggleTheme, theme } = useBooking();
  const ar = lang === 'ar';
  const [activeTab, setActiveTab] = useState('stats');

  useEffect(() => {
    document.title = ar ? 'SkyFly - لوحة التحكم' : 'SkyFly - Admin Dashboard';
  }, [ar]);

  return (
    <div className="sky-admin sky-page">
      <div className="sky-container-wide">
        {/* Header */}
        <div className="sky-admin__header">
          <div>
            <h1 className="sky-h2">{ar ? 'لوحة التحكم' : 'Admin Dashboard'}</h1>
            <p className="sky-admin__header-sub">{ar ? 'مرحباً بك في لوحة إدارة SkyFly مصر' : 'Welcome to SkyFly Egypt Admin Panel'}</p>
          </div>
          <div className="sky-admin__header-actions">
            <button className={`sky-btn sky-btn-sm ${adminMode ? 'sky-btn-primary' : 'sky-btn-ghost'}`} onClick={toggleAdminMode}>
              {adminMode ? '🛡️ ' + (ar ? 'وضع المشرف نشط' : 'Admin Mode ON') : '🔒 ' + (ar ? 'تفعيل المشرف' : 'Enable Admin')}
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="sky-admin__tabs">
          {TABS.map(t => (
            <button
              key={t.key}
              className={`sky-admin__tab ${activeTab === t.key ? 'sky-admin__tab--active' : ''}`}
              onClick={() => setActiveTab(t.key)}
            >
              {ar ? t.label : t.labelEn}
            </button>
          ))}
        </div>

        {/* Stats Tab */}
        {activeTab === 'stats' && <StatsTab ar={ar} />}

        {/* Flights Tab */}
        {activeTab === 'flights' && <FlightsTab ar={ar} />}

        {/* Customers Tab */}
        {activeTab === 'customers' && <CustomersTab ar={ar} />}

        {/* Payments Tab */}
        {activeTab === 'payments' && <PaymentsTab ar={ar} />}

        {/* Settings Tab */}
        {activeTab === 'settings' && <SettingsTab ar={ar} lang={lang} toggleLang={toggleLang} toggleTheme={toggleTheme} theme={theme} adminMode={adminMode} toggleAdminMode={toggleAdminMode} />}
      </div>
    </div>
  );
}

function StatsTab({ ar }) {
  const stats = ADMIN_STATS;
  const maxBooking = Math.max(...stats.dailyBookings);
  const maxRevenue = Math.max(...stats.revenueChart);

  const statCards = [
    { icon: '📋', value: stats.totalBookings.toLocaleString(), label: ar ? 'إجمالي الحجوزات' : 'Total Bookings', labelEn: 'Total Bookings' },
    { icon: '💰', value: ar ? formatCurrency(stats.revenue) : formatCurrencyEn(stats.revenue), label: ar ? 'الإيرادات' : 'Revenue', labelEn: 'Revenue' },
    { icon: '📊', value: stats.conversionRate + '%', label: ar ? 'معدل التحويل' : 'Conversion Rate', labelEn: 'Conversion Rate' },
    { icon: '👥', value: stats.activeUsers.toLocaleString(), label: ar ? 'المستخدمين النشطين' : 'Active Users', labelEn: 'Active Users' },
    { icon: '🎯', value: ar ? formatCurrency(stats.avgBookingValue) : formatCurrencyEn(stats.avgBookingValue), label: ar ? 'متوسط قيمة الحجز' : 'Avg Booking Value', labelEn: 'Avg Booking Value' },
    { icon: '🌍', value: '5', label: ar ? 'إجمالي الوجهات' : 'Total Destinations', labelEn: 'Total Destinations' },
  ];

  return (
    <div className="sky-admin__tab-content">
      <div className="sky-admin__stats-grid">
        {statCards.map((s, i) => (
          <div key={i} className="sky-admin__stat-card sky-card">
            <span className="sky-admin__stat-icon">{s.icon}</span>
            <strong className="sky-admin__stat-value">{s.value}</strong>
            <span className="sky-admin__stat-label">{ar ? s.label : s.labelEn}</span>
          </div>
        ))}
      </div>

      <div className="sky-admin__charts">
        <div className="sky-admin__chart-box sky-card">
          <h3 className="sky-h4">{ar ? 'الحجوزات اليومية' : 'Daily Bookings'}</h3>
          <div className="sky-admin__bar-chart">
            {stats.dailyBookings.map((val, i) => (
              <div key={i} className="sky-admin__bar-item">
                <span className="sky-admin__bar-value">{val}</span>
                <div className="sky-admin__bar-track">
                  <div
                    className="sky-admin__bar-fill sky-admin__bar-fill--bookings"
                    style={{ height: `${(val / maxBooking) * 100}%` }}
                  />
                </div>
                <span className="sky-admin__bar-label">{stats.dailyLabels[i]}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="sky-admin__chart-box sky-card">
          <h3 className="sky-h4">{ar ? 'الإيرادات' : 'Revenue'}</h3>
          <div className="sky-admin__bar-chart">
            {stats.revenueChart.map((val, i) => (
              <div key={i} className="sky-admin__bar-item">
                <span className="sky-admin__bar-value">{ar ? (val / 1000000).toFixed(1) + 'م' : (val / 1000000).toFixed(1) + 'M'}</span>
                <div className="sky-admin__bar-track">
                  <div
                    className="sky-admin__bar-fill sky-admin__bar-fill--revenue"
                    style={{ height: `${(val / maxRevenue) * 100}%` }}
                  />
                </div>
                <span className="sky-admin__bar-label">{stats.dailyLabels[i]}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="sky-admin__chart-box sky-card">
        <h3 className="sky-h4">{ar ? 'أفضل الوجهات' : 'Top Destinations'}</h3>
        <div className="sky-admin__table-wrap">
          <table className="sky-admin__table">
            <thead>
              <tr>
                <th>{ar ? 'المدينة' : 'City'}</th>
                <th>{ar ? 'عدد الحجوزات' : 'Bookings'}</th>
                <th>{ar ? 'الإيرادات' : 'Revenue'}</th>
                <th>{ar ? 'النسبة' : 'Share'}</th>
              </tr>
            </thead>
            <tbody>
              {stats.topDestinations.map((d, i) => (
                <tr key={i}>
                  <td><span className="sky-admin__dest-rank">#{i + 1}</span> {ar ? d.city : d.cityEn}</td>
                  <td>{d.count.toLocaleString()}</td>
                  <td className="sky-admin__td-revenue">{ar ? formatCurrency(d.revenue) : formatCurrencyEn(d.revenue)}</td>
                  <td>
                    <div className="sky-admin__share-bar">
                      <div className="sky-admin__share-fill" style={{ width: `${(d.count / stats.topDestinations[0].count) * 100}%` }} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function FlightsTab({ ar }) {
  const flights = ADMIN_FLIGHTS;

  return (
    <div className="sky-admin__tab-content">
      <div className="sky-admin__chart-box sky-card">
        <div className="sky-admin__table-header">
          <h3 className="sky-h4">{ar ? 'جميع الرحلات' : 'All Flights'}</h3>
          <span className="sky-badge sky-badge-primary">{flights.length} {ar ? 'رحلة' : 'flights'}</span>
        </div>
        <div className="sky-admin__table-wrap">
          <table className="sky-admin__table">
            <thead>
              <tr>
                <th>{ar ? 'رقم الرحلة' : 'Flight'}</th>
                <th>{ar ? 'شركة الطيران' : 'Airline'}</th>
                <th>{ar ? 'المسار' : 'Route'}</th>
                <th>{ar ? 'السعر' : 'Price'}</th>
                <th>{ar ? 'المقاعد' : 'Seats'}</th>
                <th>{ar ? 'المحجوز' : 'Booked'}</th>
                <th>{ar ? 'الحالة' : 'Status'}</th>
              </tr>
            </thead>
            <tbody>
              {flights.map(f => {
                const statusMap = {
                  scheduled: { label: ar ? 'مجدول' : 'Scheduled', cls: 'sky-badge-primary' },
                  boarding: { label: ar ? 'صعود طائرة' : 'Boarding', cls: 'sky-badge-accent' },
                  delayed: { label: ar ? 'مؤجل' : 'Delayed', cls: 'sky-badge-warning' },
                  cancelled: { label: ar ? 'ملغي' : 'Cancelled', cls: 'sky-badge-danger' },
                };
                const st = statusMap[f.status] || statusMap.scheduled;
                const pct = Math.round((f.booked / f.seats) * 100);
                return (
                  <tr key={f.id}>
                    <td><strong>{f.flightNumber}</strong></td>
                    <td>{ar ? f.airline : f.airlineEn}</td>
                    <td>{f.route}</td>
                    <td className="sky-admin__td-price">{ar ? f.price.toLocaleString() + ' ج.م' : 'EGP ' + f.price.toLocaleString()}</td>
                    <td>{f.seats}</td>
                    <td>
                      <div className="sky-admin__cell-bar">
                        <span>{f.booked}/{f.seats}</span>
                        <div className="sky-admin__seat-track">
                          <div className="sky-admin__seat-fill" style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                    </td>
                    <td><span className={`sky-badge ${st.cls}`}>{st.label}</span></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

const TIER_CONFIG = {
  platinum: { bg: 'linear-gradient(135deg, #E2E8F0, #94A3B8)', color: '#1E293B' },
  gold: { bg: 'linear-gradient(135deg, #FEF3C7, #F59E0B)', color: '#1A120B' },
  silver: { bg: 'linear-gradient(135deg, #F1F5F9, #CBD5E1)', color: '#1E293B' },
  bronze: { bg: 'linear-gradient(135deg, #FFF7ED, #D68A5C)', color: '#1A120B' },
};

function CustomersTab({ ar }) {
  const customers = ADMIN_CUSTOMERS;

  const statusMap = {
    active: { label: 'نشط', labelEn: 'Active', cls: 'sky-badge-success' },
    vip: { label: 'VIP', labelEn: 'VIP', cls: 'sky-badge-accent' },
    inactive: { label: 'غير نشط', labelEn: 'Inactive', cls: 'sky-badge-warning' },
  };

  return (
    <div className="sky-admin__tab-content">
      <div className="sky-admin__chart-box sky-card">
        <div className="sky-admin__table-header">
          <h3 className="sky-h4">{ar ? 'إدارة العملاء' : 'Customer Management'}</h3>
          <span className="sky-badge sky-badge-primary">{customers.length} {ar ? 'عميل' : 'customers'}</span>
        </div>
        <div className="sky-admin__table-wrap">
          <table className="sky-admin__table">
            <thead>
              <tr>
                <th>{ar ? 'الاسم' : 'Name'}</th>
                <th>{ar ? 'البريد الإلكتروني' : 'Email'}</th>
                <th>{ar ? 'الحجوزات' : 'Trips'}</th>
                <th>{ar ? 'الإنفاق' : 'Spent'}</th>
                <th>{ar ? 'الحالة' : 'Status'}</th>
                <th>{ar ? 'المستوى' : 'Tier'}</th>
              </tr>
            </thead>
            <tbody>
              {customers.map(c => {
                const st = statusMap[c.status] || statusMap.inactive;
                const tier = TIER_CONFIG[c.tier];
                return (
                  <tr key={c.id}>
                    <td><strong>{ar ? c.name : c.nameEn}</strong></td>
                    <td className="sky-text-muted">{c.email}</td>
                    <td><span className="sky-admin__trip-count">{c.trips}</span></td>
                    <td className="sky-admin__td-price">{ar ? c.spent.toLocaleString() + ' ج.م' : 'EGP ' + c.spent.toLocaleString()}</td>
                    <td><span className={`sky-badge ${st.cls}`}>{ar ? st.label : st.labelEn}</span></td>
                    <td>
                      <span className="sky-admin__tier-badge" style={{ background: tier.bg, color: tier.color }}>
                        {c.tier === 'platinum' ? '💎 ' : c.tier === 'gold' ? '🥇 ' : c.tier === 'silver' ? '🥈 ' : '🥉 '}
                        {c.tier.charAt(0).toUpperCase() + c.tier.slice(1)}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

const PAYMENT_METHOD_ICONS = {
  'فيزا': '💳',
  'Visa': '💳',
  'مدى': '🏦',
  'Mada': '🏦',
  'Apple Pay': '🍎',
  'STC Pay': '📱',
  'فوري': '🏧',
  'Fawry': '🏧',
};

function PaymentsTab({ ar }) {
  const payments = ADMIN_PAYMENTS;

  const statusMap = {
    completed: { label: 'مكتمل', labelEn: 'Completed', cls: 'sky-badge-success' },
    refunded: { label: 'مسترجع', labelEn: 'Refunded', cls: 'sky-badge-warning' },
    pending: { label: 'معلق', labelEn: 'Pending', cls: 'sky-badge-primary' },
  };

  return (
    <div className="sky-admin__tab-content">
      <div className="sky-admin__chart-box sky-card">
        <div className="sky-admin__table-header">
          <h3 className="sky-h4">{ar ? 'المعاملات المالية' : 'Payment Transactions'}</h3>
          <span className="sky-badge sky-badge-primary">{payments.length} {ar ? 'معاملة' : 'transactions'}</span>
        </div>
        <div className="sky-admin__table-wrap">
          <table className="sky-admin__table">
            <thead>
              <tr>
                <th>{ar ? 'المرجع' : 'Ref'}</th>
                <th>{ar ? 'المبلغ' : 'Amount'}</th>
                <th>{ar ? 'طريقة الدفع' : 'Method'}</th>
                <th>{ar ? 'الحالة' : 'Status'}</th>
                <th>{ar ? 'التاريخ' : 'Date'}</th>
                <th>{ar ? 'العميل' : 'Customer'}</th>
              </tr>
            </thead>
            <tbody>
              {payments.map(p => {
                const st = statusMap[p.status] || statusMap.pending;
                const icon = PAYMENT_METHOD_ICONS[ar ? p.method : p.methodEn] || '💳';
                return (
                  <tr key={p.id}>
                    <td><code className="sky-admin__ref">{p.ref}</code></td>
                    <td className="sky-admin__td-price">{ar ? p.amount.toLocaleString() + ' ج.م' : 'EGP ' + p.amount.toLocaleString()}</td>
                    <td>{icon} {ar ? p.method : p.methodEn}</td>
                    <td><span className={`sky-badge ${st.cls}`}>{ar ? st.label : st.labelEn}</span></td>
                    <td className="sky-text-muted">{p.date}</td>
                    <td>{ar ? p.customer : p.customerEn}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function SettingsTab({ ar, lang, toggleLang, toggleTheme, theme, adminMode, toggleAdminMode }) {
  return (
    <div className="sky-admin__tab-content">
      <div className="sky-admin__settings">
        <div className="sky-admin__settings-card sky-card">
          <h3 className="sky-h4">{ar ? 'وضع المشرف' : 'Admin Mode'}</h3>
          <p className="sky-text-muted">{ar ? 'تفعيل وضع المشرف للتحكم الكامل في النظام' : 'Enable admin mode for full system control'}</p>
          <button className={`sky-btn ${adminMode ? 'sky-btn-primary' : 'sky-btn-outline'}`} onClick={toggleAdminMode}>
            {adminMode ? '🛡️ ' + (ar ? 'إيقاف وضع المشرف' : 'Disable Admin Mode') : '🔒 ' + (ar ? 'تفعيل وضع المشرف' : 'Enable Admin Mode')}
          </button>
        </div>

        <div className="sky-admin__settings-card sky-card">
          <h3 className="sky-h4">{ar ? 'الإعدادات السريعة' : 'Quick Settings'}</h3>
          <div className="sky-admin__setting-row">
            <span>{ar ? 'اللغة' : 'Language'}</span>
            <button className="sky-btn sky-btn-ghost sky-btn-sm" onClick={toggleLang}>
              {lang === 'ar' ? '🇪🇬 العربية' : '🇬🇧 English'}
            </button>
          </div>
          <div className="sky-admin__setting-row">
            <span>{ar ? 'السمة' : 'Theme'}</span>
            <button className="sky-btn sky-btn-ghost sky-btn-sm" onClick={toggleTheme}>
              {theme === 'light' ? (ar ? '☀️ فاتح' : '☀️ Light') : (ar ? '🌙 داكن' : '🌙 Dark')}
            </button>
          </div>
        </div>

        <div className="sky-admin__settings-card sky-card">
          <h3 className="sky-h4">{ar ? 'معلومات التطبيق' : 'App Info'}</h3>
          <div className="sky-admin__info-grid">
            <div className="sky-admin__info-item">
              <span className="sky-text-muted">{ar ? 'الإصدار' : 'Version'}</span>
              <strong>v2.5.0</strong>
            </div>
            <div className="sky-admin__info-item">
              <span className="sky-text-muted">{ar ? 'آخر تحديث' : 'Last Update'}</span>
              <strong>2026-06-09</strong>
            </div>
            <div className="sky-admin__info-item">
              <span className="sky-text-muted">{ar ? 'المنصة' : 'Platform'}</span>
              <strong>SkyFly Egypt</strong>
            </div>
            <div className="sky-admin__info-item">
              <span className="sky-text-muted">{ar ? 'البيئة' : 'Environment'}</span>
              <strong className="sky-badge sky-badge-success">{ar ? 'إنتاج' : 'Production'}</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
