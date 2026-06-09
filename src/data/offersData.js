export const LAST_MINUTE = [
  { id: 'lm1', title: 'القاهرة → دبي', titleEn: 'Cairo → Dubai', airline: 'مصر للطيران', airlineEn: 'EgyptAir', price: 2800, originalPrice: 4200, departure: '2026-06-12', seats: 4, image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=400&q=60' },
  { id: 'lm2', title: 'القاهرة → اسطنبول', titleEn: 'Cairo → Istanbul', airline: 'الخطوط التركية', airlineEn: 'Turkish Airlines', price: 3500, originalPrice: 5400, departure: '2026-06-14', seats: 2, image: 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=400&q=60' },
  { id: 'lm3', title: 'القاهرة → الغردقة', titleEn: 'Cairo → Hurghada', airline: 'Air Cairo', airlineEn: 'Air Cairo', price: 450, originalPrice: 890, departure: '2026-06-11', seats: 6, image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&q=60' },
  { id: 'lm4', title: 'الإسكندرية → جدة', titleEn: 'Alexandria → Jeddah', airline: 'العربية للطيران', airlineEn: 'Air Arabia', price: 1800, originalPrice: 2900, departure: '2026-06-13', seats: 3, image: 'https://images.unsplash.com/photo-1595152452543-e5fc28ebc2b8?w=400&q=60' },
];

export const SEASONAL_OFFERS = [
  { id: 'so1', title: 'عروض الصيف', titleEn: 'Summer Deals', desc: 'خصم حتى 40% على رحلات البحر المتوسط والصيف', descEn: 'Up to 40% off Mediterranean summer flights', period: 'يونيو - أغسطس', periodEn: 'Jun - Aug', color: '#C8102E', icon: '☀️' },
  { id: 'so2', title: 'عروض الشتاء', titleEn: 'Winter Deals', desc: 'خصم حتى 35% على رحلات أوروبا وآسيا', descEn: 'Up to 35% off Europe & Asia flights', period: 'نوفمبر - فبراير', periodEn: 'Nov - Feb', color: '#1A3C6E', icon: '❄️' },
  { id: 'so3', title: 'عروض رمضان', titleEn: 'Ramadan Offers', desc: 'عروض خاصة للعمرة والزيارة بأفضل الأسعار', descEn: 'Special Umrah & visit deals at best prices', period: 'رمضان', periodEn: 'Ramadan', color: '#D4A843', icon: '🌙' },
  { id: 'so4', title: 'عروض العيد', titleEn: 'Eid Offers', desc: 'احتفل بالعيد مع عائلة بأقل الأسعار', descEn: 'Celebrate Eid with family at lowest prices', period: 'العيدين', periodEn: 'Both Eids', color: '#008000', icon: '🎉' },
];

export const TRAVEL_PACKAGES = [
  { id: 'tp1', name: 'استانة السحرية', nameEn: 'Magical Istanbul', price: 8500, originalPrice: 11000, nights: 4, includes: ['طيران', 'فندق 5 نجوم', 'جولات سياحية', 'انتقالات'], includesEn: ['Flight', '5★ Hotel', 'Tours', 'Transfers'], image: 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=400&q=60', rating: 4.7, flag: '🇹🇷' },
  { id: 'tp2', name: 'دبي الفاخرة', nameEn: 'Luxury Dubai', price: 12000, originalPrice: 16000, nights: 5, includes: ['طيران درجة رجال الأعمال', 'فندق 7 نجوم', 'جولة برج خليفة', 'تأشيرة'], includesEn: ['Business Class', '7★ Hotel', 'Burj Khalifa Tour', 'Visa'], image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=400&q=60', rating: 4.9, flag: '🇦🇪' },
  { id: 'tp3', name: 'أمواج الغردقة', nameEn: 'Hurghada Waves', price: 3200, originalPrice: 4800, nights: 3, includes: ['طيران', 'منتجع شامل', 'غطس', 'رحلات بحرية'], includesEn: ['Flight', 'All-inclusive Resort', 'Diving', 'Boat Trips'], image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&q=60', rating: 4.5, flag: '🇪🇬' },
  { id: 'tp4', name: 'عظمة الأقصر وأسوان', nameEn: 'Luxor & Aswan Grand', price: 4500, originalPrice: 6500, nights: 4, includes: ['طيران', 'فنادق', 'مركب نيلي', 'مرشد سياحي'], includesEn: ['Flight', 'Hotels', 'Nile Cruise', 'Tour Guide'], image: 'https://images.unsplash.com/photo-1568322445389-f64ac2515020?w=400&q=60', rating: 4.6, flag: '🇪🇬' },
];

export const EXCLUSIVE_DISCOUNTS = [
  { id: 'ed1', title: 'خصم الطلاب', titleEn: 'Student Discount', desc: 'خصم 15% للطلاب على جميع الرحلات', descEn: '15% off all flights for students', code: 'STUDENT15', expiry: '2026-09-30' },
  { id: 'ed2', title: 'خصم العائلة', titleEn: 'Family Discount', desc: 'خصم 20% عند حجز 4 تذاكر أو أكثر', descEn: '20% off when booking 4+ tickets', code: 'FAMILY20', expiry: '2026-12-31' },
  { id: 'ed3', title: 'خصم أول حجز', titleEn: 'First Booking', desc: 'خصم 10% على أول حجز لك مع SkyFly', descEn: '10% off your first SkyFly booking', code: 'SKYFLY10', expiry: '2026-08-31' },
  { id: 'ed4', title: 'خصم كبار السن', titleEn: 'Senior Discount', desc: 'خصم 25% لمن فوق 60 سنة', descEn: '25% off for ages 60+', code: 'SENIOR25', expiry: '2026-12-31' },
];
