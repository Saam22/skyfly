import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar/Navbar'
import Footer from './components/Footer/Footer'
import LiveChat from './components/LiveChat/LiveChat'
import Toast from './components/Toast/Toast'
import Home from './pages/Home/Home'
import SearchResults from './pages/SearchResults/SearchResults'
import FlightDetails from './pages/FlightDetails/FlightDetails'
import Booking from './pages/Booking/Booking'
import MyTrips from './pages/MyTrips/MyTrips'
import './App.css'

function App() {
  return (
    <>
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<SearchResults />} />
          <Route path="/flight/:id" element={<FlightDetails />} />
          <Route path="/booking" element={<Booking />} />
          <Route path="/my-trips" element={<MyTrips />} />
        </Routes>
      </main>
      <Footer />
      <LiveChat />
      <Toast />
    </>
  )
}

export default App
