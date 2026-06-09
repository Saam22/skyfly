export const ADMIN_STATS = {
  totalBookings: 15420,
  dailyBookings: [320, 380, 290, 410, 350, 520, 480],
  dailyLabels: ['السبت', 'الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة'],
  revenue: 45200000,
  revenueChart: [1800000, 2100000, 1600000, 2400000, 1900000, 2800000, 2200000],
  topDestinations: [
    { city: 'دبي', cityEn: 'Dubai', count: 2450, revenue: 9800000 },
    { city: 'الغردقة', cityEn: 'Hurghada', count: 2100, revenue: 2100000 },
    { city: 'جدة', cityEn: 'Jeddah', count: 1890, revenue: 5670000 },
    { city: 'اسطنبول', cityEn: 'Istanbul', count: 1560, revenue: 6240000 },
    { city: 'الدوحة', cityEn: 'Doha', count: 1200, revenue: 4800000 },
  ],
  conversionRate: 18.5,
  activeUsers: 45200,
  avgBookingValue: 2930,
};

export const ADMIN_FLIGHTS = [
  { id: 'af1', flightNumber: 'MS 777', airline: 'مصر للطيران', airlineEn: 'EgyptAir', route: 'CAI → DXB', price: 4200, seats: 120, booked: 98, status: 'scheduled', date: '2026-06-10' },
  { id: 'af2', flightNumber: 'MS 044', airline: 'Air Cairo', airlineEn: 'Air Cairo', route: 'CAI → HRG', price: 890, seats: 80, booked: 72, status: 'scheduled', date: '2026-06-10' },
  { id: 'af3', flightNumber: 'EK 925', airline: 'طيران الإمارات', airlineEn: 'Emirates', route: 'CAI → DXB', price: 5800, seats: 200, booked: 185, status: 'scheduled', date: '2026-06-11' },
  { id: 'af4', flightNumber: 'TK 691', airline: 'الخطوط التركية', airlineEn: 'Turkish Airlines', route: 'CAI → IST', price: 5400, seats: 150, booked: 102, status: 'boarding', date: '2026-06-09' },
  { id: 'af5', flightNumber: 'QR 1302', airline: 'الخطوط القطرية', airlineEn: 'Qatar Airways', route: 'CAI → DOH', price: 4800, seats: 180, booked: 156, status: 'scheduled', date: '2026-06-12' },
  { id: 'af6', flightNumber: 'NE 101', airline: 'نيل إير', airlineEn: 'Nile Air', route: 'CAI → SSH', price: 750, seats: 60, booked: 45, status: 'delayed', date: '2026-06-09' },
  { id: 'af7', flightNumber: 'SV 302', airline: 'الخطوط السعودية', airlineEn: 'Saudia', route: 'CAI → JED', price: 3200, seats: 160, booked: 140, status: 'scheduled', date: '2026-06-11' },
];

export const ADMIN_CUSTOMERS = [
  { id: 'u1', name: 'محمد أحمد', nameEn: 'Mohamed Ahmed', email: 'mohamed@example.com', trips: 12, spent: 45000, status: 'active', joinDate: '2025-01-15', tier: 'gold' },
  { id: 'u2', name: 'سارة محمد', nameEn: 'Sara Mohamed', email: 'sara@example.com', trips: 8, spent: 28000, status: 'active', joinDate: '2025-03-20', tier: 'silver' },
  { id: 'u3', name: 'أحمد علي', nameEn: 'Ahmed Ali', email: 'ahmed@example.com', trips: 5, spent: 12000, status: 'active', joinDate: '2025-06-10', tier: 'bronze' },
  { id: 'u4', name: 'نورا حسن', nameEn: 'Nora Hassan', email: 'nora@example.com', trips: 20, spent: 85000, status: 'vip', joinDate: '2024-11-05', tier: 'platinum' },
  { id: 'u5', name: 'خالد عمر', nameEn: 'Khaled Omar', email: 'khaled@example.com', trips: 3, spent: 6000, status: 'inactive', joinDate: '2026-02-01', tier: 'bronze' },
  { id: 'u6', name: 'مريم عبدالله', nameEn: 'Maryam Abdullah', email: 'maryam@example.com', trips: 15, spent: 52000, status: 'active', joinDate: '2025-04-18', tier: 'gold' },
];

export const ADMIN_PAYMENTS = [
  { id: 'pay1', ref: 'SKY-X7K2M', amount: 4200, method: 'فيزا', methodEn: 'Visa', status: 'completed', date: '2026-06-08', customer: 'محمد أحمد', customerEn: 'Mohamed Ahmed' },
  { id: 'pay2', ref: 'SKY-P9J4R', amount: 890, method: 'مدى', methodEn: 'Mada', status: 'completed', date: '2026-06-07', customer: 'سارة محمد', customerEn: 'Sara Mohamed' },
  { id: 'pay3', ref: 'SKY-L3M8N', amount: 5400, method: 'Apple Pay', methodEn: 'Apple Pay', status: 'completed', date: '2026-06-07', customer: 'أحمد علي', customerEn: 'Ahmed Ali' },
  { id: 'pay4', ref: 'SKY-V5B2X', amount: 3200, method: 'STC Pay', methodEn: 'STC Pay', status: 'refunded', date: '2026-06-06', customer: 'نورا حسن', customerEn: 'Nora Hassan', refundDate: '2026-06-08' },
  { id: 'pay5', ref: 'SKY-Q8W1E', amount: 5800, method: 'فيزا', methodEn: 'Visa', status: 'pending', date: '2026-06-09', customer: 'خالد عمر', customerEn: 'Khaled Omar' },
  { id: 'pay6', ref: 'SKY-H6Y9U', amount: 750, method: 'فوري', methodEn: 'Fawry', status: 'completed', date: '2026-06-05', customer: 'مريم عبدالله', customerEn: 'Maryam Abdullah' },
];
