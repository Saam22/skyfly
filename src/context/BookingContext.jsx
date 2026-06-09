import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { LOYALTY_TIERS } from '../data/loyaltyData';

const BookingContext = createContext(null);

const STORAGE_KEY = 'skyfly_booking';
const TRIPS_KEY = 'skyfly_trips';
const USER_KEY = 'skyfly_user';
const SAVED_PASSENGERS_KEY = 'skyfly_saved_passengers';
const WISHLIST_KEY = 'skyfly_wishlist';
const LOYALTY_KEY = 'skyfly_loyalty';
const CONTACT_KEY = 'skyfly_contact';

export function BookingProvider({ children }) {
  const [theme, setTheme] = useState(() => localStorage.getItem('skyfly_theme') || 'light');
  const [lang, setLang] = useState(() => localStorage.getItem('skyfly_lang') || 'ar');

  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem(USER_KEY)) || null; }
    catch { return null; }
  });

  const [savedPassengers, setSavedPassengers] = useState(() => {
    try { return JSON.parse(localStorage.getItem(SAVED_PASSENGERS_KEY)) || []; }
    catch { return []; }
  });

  const [savedPassports, setSavedPassports] = useState(() => {
    try { return JSON.parse(localStorage.getItem('skyfly_passports')) || []; }
    catch { return []; }
  });

  const [wishlist, setWishlist] = useState(() => {
    try { return JSON.parse(localStorage.getItem(WISHLIST_KEY)) || []; }
    catch { return []; }
  });

  const [searchParams, setSearchParams] = useState({
    tripType: 'roundtrip',
    from: 'CAI',
    to: '',
    departDate: '',
    returnDate: '',
    adults: 1,
    children: 0,
    infants: 0,
    class: 'economy',
  });

  const [booking, setBooking] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {
        flight: null, returnFlight: null, passengers: [], selectedSeats: [],
        extras: { insurance: false, meal: false, extraBaggage: false },
        totalPrice: 0, bookingRef: null, status: null,
      };
    } catch { return { flight: null, returnFlight: null, passengers: [], selectedSeats: [], extras: {}, totalPrice: 0, bookingRef: null, status: null }; }
  });

  const [trips, setTrips] = useState(() => {
    try { return JSON.parse(localStorage.getItem(TRIPS_KEY)) || sampleTrips(); }
    catch { return sampleTrips(); }
  });

  const [loyalty, setLoyalty] = useState(() => {
    try { return JSON.parse(localStorage.getItem(LOYALTY_KEY)) || { points: 4200, tier: 'bronze', history: [] }; }
    catch { return { points: 4200, tier: 'bronze', history: [] }; }
  });

  const [adminMode, setAdminMode] = useState(() => {
    try { return JSON.parse(localStorage.getItem('skyfly_admin')) || false; }
    catch { return false; }
  });

  const [contactMessages, setContactMessages] = useState(() => {
    try { return JSON.parse(localStorage.getItem(CONTACT_KEY)) || []; }
    catch { return []; }
  });

  const [notifications, setNotifications] = useState([]);

  // Persist
  useEffect(() => { localStorage.setItem(STORAGE_KEY, JSON.stringify(booking)); }, [booking]);
  useEffect(() => { localStorage.setItem(TRIPS_KEY, JSON.stringify(trips)); }, [trips]);
  useEffect(() => { localStorage.setItem(USER_KEY, JSON.stringify(user)); }, [user]);
  useEffect(() => { localStorage.setItem(SAVED_PASSENGERS_KEY, JSON.stringify(savedPassengers)); }, [savedPassengers]);
  useEffect(() => { localStorage.setItem('skyfly_passports', JSON.stringify(savedPassports)); }, [savedPassports]);
  useEffect(() => { localStorage.setItem(WISHLIST_KEY, JSON.stringify(wishlist)); }, [wishlist]);
  useEffect(() => { localStorage.setItem(LOYALTY_KEY, JSON.stringify(loyalty)); }, [loyalty]);
  useEffect(() => { localStorage.setItem('skyfly_admin', JSON.stringify(adminMode)); }, [adminMode]);
  useEffect(() => { localStorage.setItem(CONTACT_KEY, JSON.stringify(contactMessages)); }, [contactMessages]);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    document.documentElement.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');
    document.documentElement.setAttribute('lang', lang);
    localStorage.setItem('skyfly_theme', theme);
    localStorage.setItem('skyfly_lang', lang);
  }, [theme, lang]);

  const toggleTheme = () => setTheme(t => t === 'light' ? 'dark' : 'light');
  const toggleLang = () => setLang(l => l === 'ar' ? 'en' : 'ar');

  // ---- Auth ----
  // eslint-disable-next-line no-unused-vars
  const login = (email, password) => {
    const mockUser = { id: 'USR001', name: 'محمد أحمد', email, phone: '+201234567890', avatar: null, memberSince: '2025-01-15' };
    setUser(mockUser);
    addNotification('success', 'تسجيل الدخول', 'مرحباً بعودتك يا محمد!');
    return mockUser;
  };

  const signup = (name, email, phone) => {
    const newUser = { id: 'USR' + Date.now(), name, email, phone, avatar: null, memberSince: new Date().toISOString().split('T')[0] };
    setUser(newUser);
    addNotification('success', 'مرحباً بك!', 'تم إنشاء حسابك بنجاح في SkyFly مصر 🎉');
    return newUser;
  };

  const logout = () => {
    setUser(null);
    addNotification('info', 'تسجيل خروج', 'تم تسجيل الخروج بنجاح');
  };

  const updateProfile = (updates) => {
    setUser(prev => ({ ...prev, ...updates }));
    addNotification('success', 'تم التحديث', 'تم تحديث الملف الشخصي بنجاح');
  };

  // ---- Saved Passengers ----
  const addSavedPassenger = (pax) => {
    setSavedPassengers(prev => [...prev, { ...pax, id: 'PAX' + Date.now() }]);
    addNotification('success', 'تم الحفظ', 'تم حفظ بيانات المسافر');
  };

  const removeSavedPassenger = (id) => {
    setSavedPassengers(prev => prev.filter(p => p.id !== id));
  };

  // ---- Wishlist ----
  const toggleWishlist = (flightId) => {
    setWishlist(prev => {
      if (prev.includes(flightId)) {
        addNotification('info', 'تمت الإزالة', 'تم حذف الرحلة من المفضلة');
        return prev.filter(id => id !== flightId);
      }
      addNotification('success', 'تمت الإضافة', 'تم إضافة الرحلة إلى المفضلة ❤️');
      return [...prev, flightId];
    });
  };

  const isInWishlist = (flightId) => wishlist.includes(flightId);

  // ---- Notifications ----
  const addNotification = useCallback((type, title, message) => {
    const id = Date.now();
    setNotifications(prev => [...prev, { id, type, title, message }]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 4000);
  }, []);

  const dismissNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  // ---- Booking ----
  const selectFlight = (flight, travelClass) => {
    const cls = travelClass || searchParams.class;
    const price = flight.price?.[cls] || flight.price?.economy || 0;
    setBooking(prev => ({ ...prev, flight, totalPrice: price }));
  };

  const setPassengers = (pax) => setBooking(prev => ({ ...prev, passengers: pax }));
  const setSelectedSeats = (seats) => setBooking(prev => ({ ...prev, selectedSeats: seats }));
  const setExtras = (extras) => setBooking(prev => ({ ...prev, extras }));

  const confirmBooking = () => {
    const ref = 'SKY' + Math.random().toString(36).toUpperCase().slice(2, 8);
    const newTrip = {
      id: ref, bookingRef: ref, flight: booking.flight,
      passengers: booking.passengers, selectedSeats: booking.selectedSeats,
      extras: booking.extras, totalPrice: booking.totalPrice,
      status: 'confirmed', bookedAt: new Date().toISOString(),
    };
    setTrips(prev => [newTrip, ...prev]);
    setBooking(prev => ({ ...prev, bookingRef: ref, status: 'confirmed' }));
    addNotification('success', 'تم الحجز! 🎉', `رقم حجزك: ${ref}. سيصلك التأكيد عبر البريد`);
    return ref;
  };

  const cancelTrip = (tripId) => {
    setTrips(prev => prev.map(t => t.id === tripId ? { ...t, status: 'cancelled' } : t));
    addNotification('warning', 'تم الإلغاء', 'تم إلغاء الحجز بنجاح');
  };

  const modifyTrip = (tripId, updates) => {
    setTrips(prev => prev.map(t => t.id === tripId ? { ...t, ...updates } : t));
    addNotification('success', 'تم التعديل', 'تم تعديل الحجز بنجاح');
  };

  const clearBooking = () => {
    setBooking({ flight: null, returnFlight: null, passengers: [], selectedSeats: [], extras: {}, totalPrice: 0, bookingRef: null, status: null });
  };

  // ---- Loyalty ----
  const getLoyaltyTier = () => {
    const sorted = [...LOYALTY_TIERS].sort((a, b) => b.minPoints - a.minPoints);
    return sorted.find(t => loyalty.points >= t.minPoints) || LOYALTY_TIERS[0];
  };

  const addLoyaltyPoints = (points, desc, descEn) => {
    setLoyalty(prev => ({
      points: prev.points + points,
      tier: getLoyaltyTier().id,
      history: [{ id: 'lh' + Date.now(), date: new Date().toISOString().split('T')[0], description: desc, descriptionEn: descEn, points, type: 'earned' }, ...prev.history],
    }));
  };

  const redeemPoints = (points, desc, descEn) => {
    if (loyalty.points < points) return false;
    setLoyalty(prev => ({
      ...prev,
      points: prev.points - points,
      history: [{ id: 'lh' + Date.now(), date: new Date().toISOString().split('T')[0], description: desc, descriptionEn: descEn, points: -points, type: 'redeemed' }, ...prev.history],
    }));
    addNotification('success', 'تم الاستبدال', `تم استبدال ${points} نقطة بنجاح`);
    return true;
  };

  // ---- Admin ----
  const toggleAdminMode = () => setAdminMode(p => !p);

  // ---- Contact ----
  const submitContact = (data) => {
    const msg = { id: 'msg' + Date.now(), ...data, date: new Date().toISOString(), status: 'new' };
    setContactMessages(prev => [msg, ...prev]);
    addNotification('success', 'تم الإرسال', 'شكراً لتواصلك! سنرد عليك في أقرب وقت');
    return msg;
  };

  // ---- Saved Passports ----
  const addSavedPassport = (p) => {
    setSavedPassports(prev => [...prev, { ...p, id: 'PSP' + Date.now() }]);
    addNotification('success', 'تم الحفظ', 'تم حفظ جواز السفر');
  };
  const removeSavedPassport = (id) => setSavedPassports(prev => prev.filter(p => p.id !== id));

  // ---- Confirm Booking with loyalty ----
  const confirmBookingWithLoyalty = () => {
    const ref = confirmBooking();
    const pts = Math.floor((booking.totalPrice || 0) / 10);
    if (pts > 0) addLoyaltyPoints(pts, `رحلة ${ref}`, `Trip ${ref}`);
    return ref;
  };

  return (
    <BookingContext.Provider value={{
      theme, toggleTheme, lang, toggleLang,
      searchParams, setSearchParams,
      user, login, signup, logout, updateProfile,
      savedPassengers, addSavedPassenger, removeSavedPassenger,
      savedPassports, addSavedPassport, removeSavedPassport,
      wishlist, toggleWishlist, isInWishlist,
      notifications, dismissNotification,
      booking, selectFlight, setPassengers, setSelectedSeats, setExtras, confirmBooking, confirmBookingWithLoyalty, clearBooking,
      trips, cancelTrip, modifyTrip,
      loyalty, getLoyaltyTier, addLoyaltyPoints, redeemPoints,
      adminMode, toggleAdminMode,
      contactMessages, submitContact,
    }}>
      {children}
    </BookingContext.Provider>
  );
}

export const useBooking = () => {
  const ctx = useContext(BookingContext);
  if (!ctx) throw new Error('useBooking must be used within BookingProvider');
  return ctx;
};

function sampleTrips() {
  return [
    {
      id: 'SKYX1234', bookingRef: 'SKYX1234',
      flight: { airline: 'مصر للطيران', airlineCode: 'MS', airlineColor: '#C8102E', flightNumber: 'MS 777', from: { code: 'CAI', city: 'القاهرة', time: '08:00' }, to: { code: 'DXB', city: 'دبي', time: '12:30' }, duration: '3س 30د', stops: 0, date: '2026-07-15' },
      passengers: [{ name: 'محمد أحمد', passport: 'A1234567', nationality: 'مصري' }],
      selectedSeats: ['14A'], extras: { insurance: true, meal: false, extraBaggage: false },
      totalPrice: 4200, status: 'confirmed', bookedAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    },
    {
      id: 'SKYP9876', bookingRef: 'SKYP9876',
      flight: { airline: 'Air Cairo', airlineCode: 'SM', airlineColor: '#003D7A', flightNumber: 'SM 044', from: { code: 'CAI', city: 'القاهرة', time: '06:15' }, to: { code: 'HRG', city: 'الغردقة', time: '07:15' }, duration: '1س 00د', stops: 0, date: '2026-08-05' },
      passengers: [{ name: 'سارة محمد', passport: 'B7654321', nationality: 'مصري' }],
      selectedSeats: ['22B'], extras: { insurance: false, meal: true, extraBaggage: true },
      totalPrice: 890, status: 'confirmed', bookedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    },
  ];
}
