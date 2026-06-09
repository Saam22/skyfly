import { useState, useEffect } from 'react';
import { useBooking } from '../../context/BookingContext';
import { LOYALTY_TIERS, REWARDS, PARTNERS, POINTS_HISTORY_SAMPLE } from '../../data/loyaltyData';
import './Loyalty.css';

const TIER_GRADIENTS = {
  bronze: 'linear-gradient(135deg, #CD7F32 0%, #E8A45A 100%)',
  silver: 'linear-gradient(135deg, #A8A8A8 0%, #C0C0C0 50%, #D8D8D8 100%)',
  gold: 'linear-gradient(135deg, #B8860B 0%, #FFD700 40%, #FFF8DC 100%)',
  platinum: 'linear-gradient(135deg, #7B68EE 0%, #B0C4DE 40%, #E5E4E2 100%)',
};

const CATEGORY_COLORS = {
  discount: 'sky-badge-warning',
  baggage: 'sky-badge-primary',
  lounge: 'sky-badge-accent',
  upgrade: 'sky-badge-success',
  flight: 'sky-badge-primary',
  vip: 'sky-badge-accent',
};

export default function Loyalty() {
  const { lang, loyalty, redeemPoints, getLoyaltyTier, addNotification } = useBooking();
  const ar = lang === 'ar';

  const [animatePoints, setAnimatePoints] = useState(false);
  const [selectedTier, setSelectedTier] = useState(null);
  const [showRedeemModal, setShowRedeemModal] = useState(null);

  const currentTier = getLoyaltyTier();
  const points = loyalty.points || 0;

  useEffect(() => {
    document.title = ar ? 'SkyFly - برنامج الولاء' : 'SkyFly - Loyalty Program';
  }, [ar]);

  useEffect(() => {
    setTimeout(() => setAnimatePoints(true), 300);
  }, []);

  const currentTierIndex = LOYALTY_TIERS.findIndex(t => t.id === currentTier.id);
  const nextTier = LOYALTY_TIERS[currentTierIndex + 1];
  const progressToNext = nextTier
    ? Math.min(100, ((points - currentTier.minPoints) / (nextTier.minPoints - currentTier.minPoints)) * 100)
    : 100;
  const pointsToNext = nextTier ? nextTier.minPoints - points : 0;

  const handleRedeem = (reward) => {
    if (points < reward.points) {
      addNotification('warning', ar ? 'نقاط غير كافية' : 'Insufficient Points', ar ? `تحتاج ${reward.points - points} نقطة إضافية` : `You need ${reward.points - points} more points`);
      return;
    }
    setShowRedeemModal(reward);
  };

  const confirmRedeem = () => {
    if (!showRedeemModal) return;
    redeemPoints(showRedeemModal.points, showRedeemModal.name, showRedeemModal.nameEn);
    setShowRedeemModal(null);
  };

  return (
    <div className="sky-loyalty sky-page">
      {/* Hero Section */}
      <section className="sky-loyalty__hero">
        <div className="sky-loyalty__hero-bg" aria-hidden="true" />
        <div className="sky-container">
          <div className="sky-loyalty__hero-content">
            <div className="sky-loyalty__tier-badge" style={{ background: TIER_GRADIENTS[currentTier.id] }}>
              <span className="sky-loyalty__tier-icon">{currentTier.icon}</span>
              <div className="sky-loyalty__tier-info">
                <span className="sky-loyalty__tier-label">{ar ? 'مستواك' : 'Your Tier'}</span>
                <h1 className="sky-loyalty__tier-name">{ar ? currentTier.name : currentTier.nameEn}</h1>
              </div>
            </div>

            <div className="sky-loyalty__points-display">
              <span className="sky-loyalty__points-label">{ar ? 'نقاط الولاء' : 'Loyalty Points'}</span>
              <div className="sky-loyalty__points-counter">
                <span className={`sky-loyalty__points-number ${animatePoints ? 'sky-loyalty__points-animate' : ''}`}>
                  {points.toLocaleString()}
                </span>
                <span className="sky-loyalty__points-unit">{ar ? 'نقطة' : 'pts'}</span>
              </div>
              {nextTier && (
                <p className="sky-loyalty__points-next">
                  {ar
                    ? `${pointsToNext.toLocaleString()} نقطة للوصول إلى ${nextTier.name}`
                    : `${pointsToNext.toLocaleString()} pts to reach ${nextTier.nameEn}`
                  }
                </p>
              )}
              {!nextTier && (
                <p className="sky-loyalty__points-next sky-loyalty__points-max">
                  {ar ? '🥇 أنت في أعلى مستوى!' : '🥇 You are at the top tier!'}
                </p>
              )}
            </div>

            <div className="sky-loyalty__progress-wrap">
              <div className="sky-loyalty__progress-bar">
                <div
                  className="sky-loyalty__progress-fill"
                  style={{ width: `${progressToNext}%`, background: TIER_GRADIENTS[currentTier.id] }}
                />
              </div>
              <div className="sky-loyalty__progress-labels">
                <span>{currentTier.icon} {ar ? currentTier.name : currentTier.nameEn}</span>
                {nextTier && <span>{nextTier.icon} {ar ? nextTier.name : nextTier.nameEn}</span>}
              </div>
            </div>

            <div className="sky-loyalty__hero-actions">
              <button
                className="sky-btn sky-btn-gold sky-btn-lg"
                onClick={() => document.getElementById('sky-loyalty-rewards')?.scrollIntoView({ behavior: 'smooth' })}
              >
                🎁 {ar ? 'استبدل نقاطك' : 'Redeem Points'}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Tiers Section */}
      <section className="sky-section sky-loyalty__tiers" id="sky-loyalty-tiers">
        <div className="sky-container">
          <div className="sky-section-header">
            <span className="sky-label">🏆 {ar ? 'المستويات' : 'Tiers'}</span>
            <h2 className="sky-h2">{ar ? 'المستويات والامتيازات' : 'Tiers & Benefits'}</h2>
            <p>{ar ? 'كلما زادت نقاطك، زادت امتيازاتك مع SkyFly مصر' : 'The more points you earn, the more perks you get with SkyFly Egypt'}</p>
          </div>

          <div className="sky-loyalty__tiers-grid">
            {LOYALTY_TIERS.map((tier) => {
              const isCurrent = tier.id === currentTier.id;
              const isUnlocked = points >= tier.minPoints;
              return (
                <div
                  key={tier.id}
                  className={`sky-loyalty__tier-card sky-card ${isCurrent ? 'sky-loyalty__tier-card--current' : ''} ${!isUnlocked && !isCurrent ? 'sky-loyalty__tier-card--locked' : ''}`}
                  style={isCurrent ? { borderColor: tier.color, boxShadow: `0 0 30px ${tier.color}33` } : {}}
                  onClick={() => setSelectedTier(selectedTier === tier.id ? null : tier.id)}
                >
                  <div className="sky-loyalty__tier-card-header" style={{ background: `${tier.color}15` }}>
                    <span className="sky-loyalty__tier-card-icon">{tier.icon}</span>
                    <h3 className="sky-h4">{ar ? tier.name : tier.nameEn}</h3>
                  </div>
                  <div className="sky-loyalty__tier-card-body">
                    <div className="sky-loyalty__tier-card-stats">
                      <div className="sky-loyalty__tier-card-stat">
                        <span className="sky-loyalty__tier-card-stat-value">{tier.minPoints.toLocaleString()}</span>
                        <span className="sky-loyalty__tier-card-stat-label">{ar ? 'نقطة كحد أدنى' : 'Min Points'}</span>
                      </div>
                      <div className="sky-loyalty__tier-card-stat">
                        <span className="sky-loyalty__tier-card-stat-value">{tier.multiplier}x</span>
                        <span className="sky-loyalty__tier-card-stat-label">{ar ? 'مضاعف النقاط' : 'Multiplier'}</span>
                      </div>
                    </div>
                    <ul className="sky-loyalty__tier-card-benefits">
                      {(ar ? tier.benefits : tier.benefitsEn).map((b, bi) => (
                        <li key={bi}>
                          <span className="sky-loyalty__benefit-check">✓</span>
                          {b}
                        </li>
                      ))}
                    </ul>
                    {isCurrent && (
                      <span className="sky-loyalty__tier-card-badge">{ar ? 'المستوى الحالي' : 'Current'}</span>
                    )}
                    {!isUnlocked && !isCurrent && (
                      <span className="sky-loyalty__tier-card-locked-label">
                        🔒 {ar ? `تحتاج ${(tier.minPoints - points).toLocaleString()} نقطة` : `${(tier.minPoints - points).toLocaleString()} pts needed`}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Rewards Section */}
      <section className="sky-section sky-loyalty__rewards" id="sky-loyalty-rewards">
        <div className="sky-container">
          <div className="sky-section-header">
            <span className="sky-label">🎁 {ar ? 'المكافآت' : 'Rewards'}</span>
            <h2 className="sky-h2">{ar ? 'استبدل نقاطك بمكافآت رائعة' : 'Redeem Your Points for Great Rewards'}</h2>
            <p>{ar ? 'اختر من بين مجموعة متنوعة من المكافآت الحصرية' : 'Choose from a variety of exclusive rewards'}</p>
          </div>

          <div className="sky-loyalty__rewards-grid">
            {REWARDS.map(reward => {
              const canAfford = points >= reward.points;
              return (
                <div key={reward.id} className={`sky-loyalty__reward-card sky-card ${!canAfford ? 'sky-loyalty__reward-card--locked' : ''}`}>
                  <div className="sky-loyalty__reward-icon-wrap">
                    <span className="sky-loyalty__reward-icon">{reward.icon}</span>
                  </div>
                  <span className={`sky-badge ${CATEGORY_COLORS[reward.category] || 'sky-badge-primary'} sky-loyalty__reward-badge`}>
                    {reward.category}
                  </span>
                  <h3 className="sky-loyalty__reward-name">{ar ? reward.name : reward.nameEn}</h3>
                  <div className="sky-loyalty__reward-points">
                    <span className="sky-loyalty__reward-points-icon">⭐</span>
                    <span className={`sky-loyalty__reward-points-value ${!canAfford ? 'sky-loyalty__reward-points-insufficient' : ''}`}>
                      {reward.points.toLocaleString()} {ar ? 'نقطة' : 'pts'}
                    </span>
                  </div>
                  <button
                    className={`sky-btn sky-btn-sm ${canAfford ? 'sky-btn-gold' : 'sky-btn-ghost'}`}
                    onClick={() => handleRedeem(reward)}
                    disabled={!canAfford}
                    style={!canAfford ? { opacity: 0.5, cursor: 'not-allowed' } : {}}
                  >
                    {canAfford ? (ar ? '🔄 استبدال' : '🔄 Redeem') : (ar ? '🔒 نقاط غير كافية' : '🔒 Insufficient')}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* History Section */}
      <section className="sky-section sky-loyalty__history">
        <div className="sky-container">
          <div className="sky-section-header">
            <span className="sky-label">📋 {ar ? 'سجل النقاط' : 'Points History'}</span>
            <h2 className="sky-h2">{ar ? 'سجل النقاط' : 'Points History'}</h2>
            <p>{ar ? 'تتبع جميع معاملات نقاط الولاء الخاصة بك' : 'Track all your loyalty points transactions'}</p>
          </div>

          <div className="sky-card sky-loyalty__history-card">
            {POINTS_HISTORY_SAMPLE.length === 0 ? (
              <div className="sky-loyalty__history-empty">
                <span>📭</span>
                <p>{ar ? 'لا توجد معاملات بعد' : 'No transactions yet'}</p>
              </div>
            ) : (
              <div className="sky-loyalty__history-table">
                <div className="sky-loyalty__history-header">
                  <span>{ar ? 'التاريخ' : 'Date'}</span>
                  <span>{ar ? 'الوصف' : 'Description'}</span>
                  <span>{ar ? 'النقاط' : 'Points'}</span>
                  <span>{ar ? 'النوع' : 'Type'}</span>
                </div>
                {POINTS_HISTORY_SAMPLE.map(h => (
                  <div key={h.id} className="sky-loyalty__history-row">
                    <span className="sky-loyalty__history-date">{h.date}</span>
                    <span className="sky-loyalty__history-desc">{ar ? h.description : h.descriptionEn}</span>
                    <span className={`sky-loyalty__history-points ${h.type === 'earned' ? 'sky-loyalty__history-points--earned' : 'sky-loyalty__history-points--redeemed'}`}>
                      {h.type === 'earned' ? '+' : ''}{h.points.toLocaleString()}
                    </span>
                    <span className={`sky-badge ${h.type === 'earned' ? 'sky-badge-success' : 'sky-badge-danger'}`}>
                      {ar ? (h.type === 'earned' ? 'مكتسبة' : 'مستبدلة') : (h.type === 'earned' ? 'Earned' : 'Redeemed')}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Partners Section */}
      <section className="sky-section sky-loyalty__partners">
        <div className="sky-container">
          <div className="sky-section-header">
            <span className="sky-label">🤝 {ar ? 'الشركاء' : 'Partners'}</span>
            <h2 className="sky-h2">{ar ? 'شركاؤنا' : 'Our Partners'}</h2>
            <p>{ar ? 'استمتع بخصومات حصرية لدى شركائنا في مصر وحول العالم' : 'Enjoy exclusive discounts with our partners in Egypt and worldwide'}</p>
          </div>

          <div className="sky-loyalty__partners-grid">
            {PARTNERS.map(p => (
              <div key={p.id} className="sky-loyalty__partner-card sky-card">
                <div className="sky-loyalty__partner-logo-wrap" style={{ background: `${p.color}12` }}>
                  <span className="sky-loyalty__partner-logo">{p.logo}</span>
                </div>
                <h3 className="sky-loyalty__partner-name">{ar ? p.name : p.nameEn}</h3>
                <div className="sky-loyalty__partner-discount" style={{ background: p.color, color: '#fff' }}>
                  {ar ? 'خصم' : 'OFF'} {p.discount}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Redeem Confirmation Modal */}
      {showRedeemModal && (
        <div className="sky-loyalty__modal-overlay" onClick={() => setShowRedeemModal(null)}>
          <div className="sky-loyalty__modal" onClick={e => e.stopPropagation()}>
            <div className="sky-loyalty__modal-icon">{showRedeemModal.icon}</div>
            <h3 className="sky-h4">{ar ? showRedeemModal.name : showRedeemModal.nameEn}</h3>
            <p className="sky-loyalty__modal-desc">
              {ar
                ? `هل أنت متأكد من استبدال ${showRedeemModal.points.toLocaleString()} نقطة؟`
                : `Are you sure you want to redeem ${showRedeemModal.points.toLocaleString()} points?`
              }
            </p>
            <div className="sky-loyalty__modal-actions">
              <button className="sky-btn sky-btn-ghost" onClick={() => setShowRedeemModal(null)}>
                {ar ? 'إلغاء' : 'Cancel'}
              </button>
              <button className="sky-btn sky-btn-gold" onClick={confirmRedeem}>
                ✅ {ar ? 'تأكيد الاستبدال' : 'Confirm Redeem'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
