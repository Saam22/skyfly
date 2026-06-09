import { createContext, useContext, useState, useEffect } from 'react';

const BookingContext = createContext(null);

const STORAGE_KEY = 'skyfly_booking';
const TRIPS_KEY = 'skyfly_trips';

export function BookingProvider({ children }) {
  const [theme, setTheme] = useState(() => localStorage.getItem('skyfly_theme') || 'light');
  const [lang, setLang] = useState(() => localStorage.getItem('skyfly_lang') || 'ar');

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
        flight: null,
        returnFlight: null,
        passengers: [],
        selectedSeats: [],
        seatMap: null,
        extras: { insurance: false, meal: false, extraBaggage: false },
        totalPrice: 0,
        bookingRef: null,
        status: null,
      };
    } catch { return { flight: null, returnFlight: null, passengers: [], selectedSeats: [], seatMap: null, extras: {}, totalPrice: 0, bookingRef: null, status: null }; }
  });

  const loadSeatMap = (flight) => {
    const airline = getAirline(flight.airlineCode);
    setBooking(prev => ({
      ...prev,
      seatMap: airline?.seatMap || null
    }));
  };

  const [trips, setTrips] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(TRIPS_KEY)) || sampleTrips();
    } catch { return sampleTrips(); }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(booking));
  }, [booking]);

  useEffect(() => {
    localStorage.setItem(TRIPS_KEY, JSON.stringify(trips));
  }, [trips]);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    document.documentElement.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');
    document.documentElement.setAttribute('lang', lang);
    localStorage.setItem('skyfly_theme', theme);
    localStorage.setItem('skyfly_lang', lang);
  }, [theme, lang]);

  const toggleTheme = () => setTheme(t => t === 'light' ? 'dark' : 'light');
  const toggleLang = () => setLang(l => l === 'ar' ? 'en' : 'ar');

  const selectFlight = (flight, travelClass) => {
    const cls = travelClass || searchParams.class;
    const price = flight.price?.[cls] || flight.price?.economy || 0;
    setBooking(prev => ({ ...prev, flight, totalPrice: price }));
  };

  const setPassengers = (passengers) => {
    setBooking(prev => ({ ...prev, passengers }));
  };

  const setSelectedSeats = (seats) => {
    setBooking(prev => ({ ...prev, selectedSeats: seats }));
  };

  const setExtras = (extras) => {
    setBooking(prev => ({ ...prev, extras }));
  };

  const confirmBooking = () => {
    const ref = 'SKY' + Math.random().toString(36).toUpperCase().slice(2, 8);
    const newTrip = {
      id: ref,
      bookingRef: ref,
      flight: booking.flight,
      passengers: booking.passengers,
      selectedSeats: booking.selectedSeats,
      extras: booking.extras,
      totalPrice: booking.totalPrice,
      status: 'confirmed',
      bookedAt: new Date().toISOString(),
    };
    setTrips(prev => [newTrip, ...prev]);
    setBooking(prev => ({ ...prev, bookingRef: ref, status: 'confirmed' }));
    return ref;
  };

  const cancelTrip = (tripId) => {
    setTrips(prev => prev.map(t => t.id === tripId ? { ...t, status: 'cancelled' } : t));
  };

  const clearBooking = () => {
    setBooking({ flight: null, returnFlight: null, passengers: [], selectedSeats: [], extras: {}, totalPrice: 0, bookingRef: null, status: null });
  };

  return (
    <BookingContext.Provider value={{
      theme, toggleTheme,
      lang, toggleLang,
      searchParams, setSearchParams,
      booking, selectFlight, loadSeatMap, setPassengers, setSelectedSeats, setExtras, confirmBooking, clearBooking,
      trips, cancelTrip,
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
      id: 'SKYX1234',
      bookingRef: 'SKYX1234',
      flight: {
        airline: 'مصر للطيران',
        airlineCode: 'MS',
        airlineColor: '#C8102E',
        flightNumber: 'MS 777',
        from: { code: 'CAI', city: 'القاهرة', time: '08:00' },
        to: { code: 'DXB', city: 'دبي', time: '12:30' },
        duration: '3س 30د',
        stops: 0,
        date: '2026-07-15',
      },
      passengers: [{ name: 'محمد أحمد', passport: 'A1234567', nationality: 'مصري' }],
      selectedSeats: ['14A'],
      extras: { insurance: true, meal: false, extraBaggage: false },
      totalPrice: 4200,
      status: 'confirmed',
      bookedAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    },
    {
      id: 'SKYP9876',
      bookingRef: 'SKYP9876',
      flight: {
        airline: 'Air Cairo',
        airlineCode: 'SM',
        airlineColor: '#003D7A',
        flightNumber: 'SM 044',
        from: { code: 'CAI', city: 'القاهرة', time: '06:15' },
        to: { code: 'HRG', city: 'الغردقة', time: '07:15' },
        duration: '1س 00د',
        stops: 0,
        date: '2026-08-05',
      },
      passengers: [{ name: 'سارة محمد', passport: 'B7654321', nationality: 'مصري' }],
      selectedSeats: ['22B'],
      extras: { insurance: false, meal: true, extraBaggage: true },
      totalPrice: 890,
      status: 'confirmed',
      bookedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    },
  ];
}
