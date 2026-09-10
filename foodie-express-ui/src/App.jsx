import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import MobileBottomNav from './components/MobileBottomNav';
import ErrorBoundary from './components/ErrorBoundary';
import Home from './pages/Home';
import Login from './pages/Login';
import Cart from './pages/Cart';
import RestaurantDetail from './pages/RestaurantDetail';
import MyOrders from './pages/MyOrders';
import Register from './pages/Register';
import ProtectedRoute from './components/ProtectedRoute';
import OrderSuccess from './pages/OrderSuccess';
import Payment from './pages/Payment';
import AdminDashboard from './pages/AdminDashboard';
import OrderTracking from './pages/OrderTracking';
import AdminRoute from './components/AdminRoute';
import CustomerRoute from './components/CustomerRoute';
import DeliveryPartnerRoute from './components/DeliveryPartnerRoute';
import RestaurantOwnerRoute from './components/RestaurantOwnerRoute';
import Explore from './pages/Explore';
import Profile from './pages/Profile';
import DeliveryDashboard from './pages/DeliveryDashboard';
import RestaurantOwnerDashboard from './pages/RestaurantOwnerDashboard';
import { Toaster } from 'react-hot-toast';

function App() {
  const [selectedCity, setSelectedCity] = useState("All");

  return (
    <ErrorBoundary>
      <AuthProvider>
        <CartProvider>
          <Router>
            <div className="min-h-screen bg-gray-50 flex flex-col">
              <Toaster
                position="top-center"
                toastOptions={{
                  duration: 3000,
                  style: {
                    background: '#363636',
                    color: '#fff',
                    borderRadius: '14px',
                    fontWeight: 'bold',
                    fontSize: '14px',
                  },
                  success: {
                    iconTheme: {
                      primary: '#22c55e',
                      secondary: '#fff',
                    },
                  },
                  error: {
                    iconTheme: {
                      primary: '#ef4444',
                      secondary: '#fff',
                    },
                  },
                }}
              />

              <Navbar selectedCity={selectedCity} setSelectedCity={setSelectedCity} />

              <main className="flex-1">
                <Routes>
                  <Route path="/" element={<Home selectedCity={selectedCity} setSelectedCity={setSelectedCity} />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/cart" element={<CustomerRoute><Cart /></CustomerRoute>} />
                  <Route path="/restaurant/:id" element={<RestaurantDetail />} />
                  <Route path="/explore" element={<Explore />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/orders" element={<ProtectedRoute><MyOrders /></ProtectedRoute>} />
                  <Route path="/order/:id" element={<ProtectedRoute><OrderTracking /></ProtectedRoute>} />
                  <Route path="/payment" element={<CustomerRoute><Payment /></CustomerRoute>} />
                  <Route path="/order-success" element={<CustomerRoute><OrderSuccess /></CustomerRoute>} />
                  <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
                  <Route path="/delivery" element={<DeliveryPartnerRoute><DeliveryDashboard /></DeliveryPartnerRoute>} />
                  <Route path="/restaurant-owner" element={<RestaurantOwnerRoute><RestaurantOwnerDashboard /></RestaurantOwnerRoute>} />
                  <Route path="*" element={
                    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-8">
                      <span className="text-7xl mb-4">404</span>
                      <h1 className="text-3xl font-black text-gray-800 mb-2">Page Not Found</h1>
                      <p className="text-gray-500 mb-6">The page you're looking for doesn't exist.</p>
                      <a href="/" className="bg-orange-500 text-white px-8 py-3 rounded-2xl font-black hover:bg-orange-600 transition no-underline">
                        Go Home
                      </a>
                    </div>
                  } />
                </Routes>
              </main>

              <div className="hidden md:block">
                <Footer />
              </div>

              <MobileBottomNav />
            </div>
          </Router>
        </CartProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
