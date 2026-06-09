export const LOYALTY_TIERS = [
  { id: 'bronze', name: 'برونزي', nameEn: 'Bronze', minPoints: 0, color: '#CD7F32', icon: '🥉', multiplier: 1, benefits: ['تسجيل وصول سريع', 'عروض حصرية'], benefitsEn: ['Fast check-in', 'Exclusive offers'] },
  { id: 'silver', name: 'فضي', nameEn: 'Silver', minPoints: 5000, color: '#C0C0C0', icon: '🥈', multiplier: 1.25, benefits: ['خصم 5% على الحجوزات', 'أولوية الصعود', 'أمتعة إضافية مجانية'], benefitsEn: ['5% off bookings', 'Priority boarding', 'Free extra baggage'] },
  { id: 'gold', name: 'ذهبي', nameEn: 'Gold', minPoints: 15000, color: '#FFD700', icon: '🥇', multiplier: 1.5, benefits: ['خصم 10% على الحجوزات', 'صالة المطار', 'ترقية مجانية عند التوفر', 'خدمة كونسيرج 24/7'], benefitsEn: ['10% off bookings', 'Lounge access', 'Free upgrade when available', '24/7 concierge'] },
  { id: 'platinum', name: 'بلاتينيوم', nameEn: 'Platinum', minPoints: 40000, color: '#E5E4E2', icon: '💎', multiplier: 2, benefits: ['خصم 20% على الحجوزات', 'ترقية مضمونة للدرجة الأولى', 'حجز مجاني رفيق سفر', 'هدايا سنوية', 'أولوية الحجز'], benefitsEn: ['20% off bookings', 'Guaranteed first class upgrade', 'Free companion ticket', 'Annual gifts', 'Priority booking'] },
];

export const REWARDS = [
  { id: 'r1', name: 'كوبون خصم 500 ج.م', nameEn: '500 EGP Discount Coupon', points: 2000, icon: '🎫', category: 'discount' },
  { id: 'r2', name: 'أمتعة إضافية مجانية', nameEn: 'Free Extra Baggage', points: 3000, icon: '🧳', category: 'baggage' },
  { id: 'r3', name: 'دخول صالة المطار', nameEn: 'Airport Lounge Access', points: 5000, icon: '🛋️', category: 'lounge' },
  { id: 'r4', name: 'ترقية درجة الأعمال', nameEn: 'Business Class Upgrade', points: 10000, icon: '💺', category: 'upgrade' },
  { id: 'r5', name: 'رحلة داخلية مجانية', nameEn: 'Free Domestic Flight', points: 15000, icon: '✈️', category: 'flight' },
  { id: 'r6', name: 'اشتراك سنوي في صالة كبار الشخصيات', nameEn: 'Annual VIP Lounge Membership', points: 25000, icon: '👑', category: 'vip' },
  { id: 'r7', name: 'تذكرة ذهاب وعائد دولية', nameEn: 'International Round Trip', points: 50000, icon: '🌍', category: 'flight' },
];

export const PARTNERS = [
  { id: 'p1', name: 'فندق ماريوت', nameEn: 'Marriott Hotels', logo: '🏨', discount: '15%', color: '#E31837' },
  { id: 'p2', name: 'هيرتز لتأجير السيارات', nameEn: 'Hertz Rent a Car', logo: '🚗', discount: '20%', color: '#FFD700' },
  { id: 'p3', name: 'أكسا للتأمين', nameEn: 'AXA Insurance', logo: '🛡️', discount: '25%', color: '#003399' },
  { id: 'p4', name: 'مطار القاهرة - صالة كبار الزوار', nameEn: 'Cairo VIP Lounge', logo: '🌟', discount: '30%', color: '#8B4513' },
  { id: 'p5', name: 'العربية للسياحة', nameEn: 'Arabia Tourism', logo: '🌴', discount: '12%', color: '#008000' },
  { id: 'p6', name: 'سويس إير (توصيل فندقي)', nameEn: 'Swiss Air (Hotel Transfer)', logo: '🚐', discount: '18%', color: '#E30613' },
];

export const POINTS_HISTORY_SAMPLE = [
  { id: 'h1', date: '2026-06-08', description: 'رحلة القاهرة - دبي', descriptionEn: 'Cairo - Dubai Flight', points: 850, type: 'earned' },
  { id: 'h2', date: '2026-06-05', description: 'مكافأة تسجيل', descriptionEn: 'Signup Bonus', points: 500, type: 'earned' },
  { id: 'h3', date: '2026-06-01', description: 'كوبون خصم 500 ج.م', descriptionEn: '500 EGP Discount Coupon', points: -2000, type: 'redeemed' },
  { id: 'h4', date: '2026-05-28', description: 'رحلة القاهرة - الغردقة', descriptionEn: 'Cairo - Hurghada Flight', points: 320, type: 'earned' },
  { id: 'h5', date: '2026-05-20', description: 'رحلة دبي - القاهرة', descriptionEn: 'Dubai - Cairo Flight', points: 780, type: 'earned' },
  { id: 'h6', date: '2026-05-15', description: 'مكافأة عيد الفطر', descriptionEn: 'Eid Bonus', points: 1000, type: 'earned' },
  { id: 'h7', date: '2026-05-10', description: 'دخول صالة المطار', descriptionEn: 'Lounge Access Reward', points: -5000, type: 'redeemed' },
  { id: 'h8', date: '2026-05-05', description: 'رحلة القاهرة - جدة', descriptionEn: 'Cairo - Jeddah Flight', points: 650, type: 'earned' },
];
