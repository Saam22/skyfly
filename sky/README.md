# SkyFly مصر ✈️ 🇪🇬

Egyptian flight booking website built with React + Vite. RTL Arabic-first with English toggle, dark/light theme, and full booking flow.

## Features

- **Flight Search** – Search with filters (price, stops, airlines, departure time), sort, compare up to 3 flights
- **Flight Details** – Overview, cabin classes, baggage info, services tabs
- **Booking Wizard** – 5-step flow: passengers → interactive seat map → extras → payment → confirmation
- **Payment Methods** – Credit Card, Apple Pay, STC Pay, Mada, Meeza, ValU, Fawry
- **Trip Management** – Upcoming/past/cancelled tabs, cancel with confirmation, boarding pass modal, trip search, modify extras
- **User Account** – Profile editing, saved passengers, wishlist, statistics
- **Authentication** – Login/signup modal with form validation
- **Live Chat** – Floating bot with keyword auto-replies
- **Toast Notifications** – Success, error, warning, info
- **Dark/Light Theme** – Persistent toggle
- **Arabic/English** – Full RTL support with language toggle
- **Responsive** – Mobile-first design

## Tech Stack

- **React 19** + **Vite 8**
- **React Router 7** – Client-side routing
- **CSS Custom Properties** – Design system with Egyptian palette (red #C8102E, gold #D4A843, cream #F5F0E8)
- **localStorage** – All data persistence (no backend)

## Getting Started

```bash
npm install
npm run dev
```

Open http://localhost:5173

## Build

```bash
npm run build
```

Output in `dist/`

## Project Structure

```
src/
├── App.jsx              # Root with routes
├── main.jsx             # Entry with BrowserRouter + BookingProvider
├── index.css            # Design system tokens, animations, dark mode
├── context/
│   └── BookingContext.jsx  # Global state (auth, booking, trips, wishlist, lang, theme)
├── data/
│   ├── airportsData.js  # 29 airports (9 Egyptian)
│   ├── airlinesData.js  # 12 airlines
│   └── flightsData.js   # 12 flights + seat map generator
├── components/
│   ├── Navbar/          # Logo with flag, glassmorphism, hamburger menu
│   ├── Footer/          # 4-column grid, Egyptian payment badges
│   ├── SearchBar/       # Trip type, airports autocomplete, passenger picker
│   ├── FlightCard/      # Airline logo, route, features, price
│   ├── AuthModal/       # Login/signup with validation
│   ├── LiveChat/        # Floating chat bot
│   └── Toast/           # Notification system
└── pages/
    ├── Home/            # Hero with pyramids animation, offers, destinations
    ├── SearchResults/   # Filters, sort, compare drawer
    ├── FlightDetails/   # 4 tabs, class selector, price breakdown
    ├── Booking/         # 5-step wizard with seat map + payment
    ├── MyTrips/         # Trips list, cancel, boarding pass, modify
    └── Account/         # Profile, saved passengers, wishlist, stats
```

## Data

All data is mock. Flights cover 12 routes from Cairo (CAI) to Hurghada, Sharm El-Sheikh, Luxor, Aswan, Dubai, Istanbul, London, Doha, and Jeddah. Airlines include EgyptAir, Air Cairo, and Nile Air.

## localStorage Keys

| Key | Description |
|-----|-------------|
| `skyfly_user` | Logged-in user |
| `skyfly_trips` | Booking history |
| `skyfly_booking` | Current booking in progress |
| `skyfly_saved_passengers` | Saved passenger profiles |
| `skyfly_wishlist` | Favorite flight IDs |
| `skyfly_theme` | `light` / `dark` |
| `skyfly_lang` | `ar` / `en` |
