import { useState, Suspense, lazy, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import MobileBottomNav from './components/MobileBottomNav';
import ErrorBoundary from './components/ErrorBoundary';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';
import CustomerRoute from './components/CustomerRoute';
import DeliveryPartnerRoute from './components/DeliveryPartnerRoute';
import RestaurantOwnerRoute from './components/RestaurantOwnerRoute';
import { Toaster } from 'react-hot-toast';

const Home = lazy(() => import('./pages/Home'));
const Login = lazy(() => import('./pages/Login'));
const Cart = lazy(() => import('./pages/Cart'));
const RestaurantDetail = lazy(() => import('./pages/RestaurantDetail'));
const MyOrders = lazy(() => import('./pages/MyOrders'));
const Register = lazy(() => import('./pages/Register'));
const OrderSuccess = lazy(() => import('./pages/OrderSuccess'));
const Payment = lazy(() => import('./pages/Payment'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const OrderTracking = lazy(() => import('./pages/OrderTracking'));
const Explore = lazy(() => import('./pages/Explore'));
const Profile = lazy(() => import('./pages/Profile'));
const DeliveryDashboard = lazy(() => import('./pages/DeliveryDashboard'));
const RestaurantOwnerDashboard = lazy(() => import('./pages/RestaurantOwnerDashboard'));

const PageFallback = () => (
  <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-3 gap-6">
    {[1, 2, 3].map((i) => (
      <div key={i} className="skeleton-card">
        <div className="shimmer-bg h-40 rounded-xl mb-4" />
        <div className="shimmer-bg h-4 rounded w-2/3 mb-2" />
        <div className="shimmer-bg h-3 rounded w-1/3" />
      </div>
    ))}
  </div>
);

const AnimatedRoutes = ({ selectedCity, setSelectedCity }) => {
  const location = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [location.pathname]);
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.2 }}
      >
        <Suspense fallback={<PageFallback />}>
          <Routes location={location}>
            <Route path="/" element={<Home selectedCity={selectedCity} setSelectedCity={setSelectedCity} />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/cart" element={<CustomerRoute><Cart /></CustomerRoute>} />
            <Route path="/restaurant/:id" element={<RestaurantDetail />} />
            <Route path="/explore" element={<Explore headerCity={selectedCity} />} />
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
                <p className="text-gray-500 mb-6">The page you&apos;re looking for doesn&apos;t exist.</p>
                <a href="/" className="bg-orange-500 text-white px-8 py-3 rounded-2xl font-black hover:bg-orange-600 transition no-underline">
                  Go Home
                </a>
              </div>
            } />
          </Routes>
        </Suspense>
      </motion.div>
    </AnimatePresence>
  );
};

function App() {
  const [selectedCity, setSelectedCity] = useState("All");

  useEffect(() => {
    if (localStorage.getItem('foodie_theme') === 'dark') {
      document.documentElement.classList.add('dark');
    }
    document.documentElement.dataset.theme = localStorage.getItem('foodie_ui_theme') === 'liquid' ? 'liquid' : 'sunset';
  }, []);

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
                <AnimatedRoutes selectedCity={selectedCity} setSelectedCity={setSelectedCity} />
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
