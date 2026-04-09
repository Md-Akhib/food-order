import React from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import HomePage from './Pages/HomePage'
import AboutPage from './Pages/AboutPage'
import ContactPage from './Pages/ContactPage'
import MenuPage from './Pages/MenuPage'
import CartPage from './Pages/CartPage'
import OrderPage from './Pages/OrderPage'
import CheckOutPage from './Pages/CheckOutPage'
import { Toaster } from 'react-hot-toast'
import Navbar from './Components/Navbar/Navbar'
import Footer from './Components/Footer/Footer'
import SearchNavbar from './Components/SearchNvbar/SearchNavbar'
import Search from './Components/Search/Search'
import PageNotFound from './Components/PageNotFound/PageNotFound'
import { useAppContext } from './Context/AppContext'
import Layout from './Pages/Admin/Layout/Layout'
import AdminLogin from './Pages/Admin/AdminLogin/AdminLogin'
import Dashboard from './Pages/Admin/Dashboard/Dashboard'
import AddMenuItem from './Pages/Admin/AddMenuItem/AddMenuItem'
import AllMenuItems from './Pages/Admin/AllMenuItems/AllMenuItems'
import AllOrders from './Pages/Admin/AllOrders/AllOrders'
import HeroSection from './Pages/Admin/HeroSection/HeroSection'
import ScrollToTop from './Components/ScrollToTop/ScrollToTop'
import AdminCategory from './Pages/Admin/AdminCategory/AdminCategory'
import Register from './Components/Register/Register'
import Profile from './Components/Profile/Profile'
import MenuDetailsPage from './Pages/MenuDetailsPage'
import VerifyPage from './Pages/VerifyPage'
import Notification from './Pages/Admin/Notification/Notification'

import ProtectedRoute from './Components/ProtectedRoute'

const App = () => {

  const { isAdmin } = useAppContext();

  const adminRoute = useLocation().pathname.includes('admin');
  const searchRoute = useLocation().pathname.includes('search');

  return (
    <>
      <Toaster containerStyle={{ zIndex: 2147483647 }} toastOptions={{ style: { zIndex: 2147483647 } }} />
      {!adminRoute && !searchRoute && <Navbar />}
      {searchRoute && <SearchNavbar />}
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/menu" element={<MenuPage />} />
        <Route path="/cart" element={<ProtectedRoute><CartPage /></ProtectedRoute>} />
        <Route path="/orders" element={<ProtectedRoute><OrderPage /></ProtectedRoute>} />
        <Route path="/checkout" element={<ProtectedRoute><CheckOutPage /></ProtectedRoute>} />
        <Route path="/search" element={<Search />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/verify" element={<VerifyPage />} />
        <Route path="/menu-details/:id" element={<MenuDetailsPage />} />
        <Route path="*" element={<PageNotFound />} />
        <Route path='/admin' element={isAdmin ? <Layout /> : <AdminLogin />}>
          <Route index element={<Dashboard />} />
          <Route path='add-menuitem' element={<AddMenuItem />} />
          <Route path='all-menuitems' element={<AllMenuItems />} />
          <Route path='all-orders' element={<AllOrders />} />
          <Route path='hero-section' element={<HeroSection />} />
          <Route path='add-category' element={<AdminCategory />} />
          <Route path='notification' element={<Notification />} />
        </Route>
      </Routes>
      {!adminRoute && <Footer />}
    </>
  )
}

export default App