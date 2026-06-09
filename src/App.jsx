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
import Account from './pages/Account/Account'
import Admin from './pages/Admin/Admin'
import Loyalty from './pages/Loyalty/Loyalty'
import Offers from './pages/Offers/Offers'
import Support from './pages/Support/Support'
import Blog from './pages/Blog/Blog'
import BlogPost from './pages/BlogPost/BlogPost'
import Services from './pages/Services/Services'
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
          <Route path="/account" element={<Account />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/loyalty" element={<Loyalty />} />
          <Route path="/offers" element={<Offers />} />
          <Route path="/support" element={<Support />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
          <Route path="/services" element={<Services />} />
        </Routes>
      </main>
      <Footer />
      <LiveChat />
      <Toast />
    </>
  )
}

export default App
