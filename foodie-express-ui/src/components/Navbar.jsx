import { useState, useRef, useEffect } from 'react';
import { ShoppingBag, User, Utensils, Package, LogOut, Heart, MapPin, ChevronDown, Check, LayoutDashboard, UserCircle, Compass, Menu, X } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import React from 'react';
import SearchBar from './SearchBar';

const Navbar = ({ selectedCity, setSelectedCity }) => {
  const { cart } = useCart();
  const { user, logoutUser } = useAuth();
  const navigate = useNavigate();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isCityOpen, setIsCityOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const dropdownRef = useRef(null);
  const cityRef = useRef(null);

  let displayName = 'Foodie';
  let displayEmail = '';

  if (user) {
    if (user.name && typeof user.name === 'string') {
      displayName = user.name;
    } else if (user.email && typeof user.email === 'string') {
      displayName = user.email.split('@')[0];
    }
    if (user.email && typeof user.email === 'string') {
      displayEmail = user.email;
    }
  }

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
      if (cityRef.current && !cityRef.current.contains(event.target)) {
        setIsCityOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    setIsDropdownOpen(false);
    toast((t) => (
      <div className="flex flex-col gap-3">
        <span className="font-medium text-gray-800">Ready to leave Foodie Express? 🌯</span>
        <div className="flex gap-2">
          <button
            onClick={() => {
              toast.dismiss(t.id);
              logoutUser();
              toast.success("Logged out! 👋");
              navigate('/');
            }}
            className="bg-red-500 text-white px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-red-600 transition"
          >
            Yes, Logout
          </button>
          <button onClick={() => toast.dismiss(t.id)} className="bg-gray-100 text-gray-700 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-gray-200 transition">
            Cancel
          </button>
        </div>
      </div>
    ), { duration: 6000, position: 'top-center' });
  };

  const cities = ["All", "Hyderabad", "Mumbai", "Delhi", "Bangalore", "Pune", "Kolkata", "Chennai", "Jaipur", "Ahmedabad", "Lucknow", "Goa", "Chandigarh", "Jalgaon"];

  const canOrder = !user || user.role === 'ROLE_USER';

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex justify-between items-center gap-4">
        
        {/* Left: Logo & City */}
        <div className="flex items-center gap-4 md:gap-6 flex-shrink-0">
          <Link to="/" className="text-xl md:text-2xl font-extrabold text-orange-600 flex items-center gap-1 md:gap-2 no-underline">
            <div className="bg-orange-500 text-white p-1.5 rounded-xl">
              <Utensils size={18} />
            </div>
            <span className="hidden sm:block">Foodie Express</span>
          </Link>

          <div className="relative border-l pl-4 border-gray-200 hidden md:block" ref={cityRef}>
            <button
              onClick={() => setIsCityOpen(!isCityOpen)}
              className="flex items-center gap-1.5 hover:bg-gray-50 px-3 py-2 rounded-xl transition border border-transparent hover:border-gray-100 group"
            >
              <MapPin size={16} className="text-orange-500 flex-shrink-0" />
              <span className="text-sm font-bold text-gray-700 group-hover:text-orange-600 max-w-[120px] truncate">
                {selectedCity === "All" ? "All Cities" : selectedCity}
              </span>
              <ChevronDown size={14} className={`text-gray-400 transition-transform duration-200 ${isCityOpen ? 'rotate-180' : ''}`} />
            </button>

            {isCityOpen && (
              <div className="absolute left-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50 max-h-80 overflow-y-auto">
                <div className="py-2">
                  {cities.map((city) => (
                    <button
                      key={city}
                      onClick={() => {
                        setSelectedCity(city);
                        setIsCityOpen(false);
                      }}
                      className={`flex items-center justify-between w-full px-4 py-2.5 text-sm transition ${
                        selectedCity === city ? 'bg-orange-50 text-orange-600 font-bold' : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {city === 'All' ? 'All Cities' : city} {selectedCity === city && <Check size={14} />}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Center: Search (desktop) */}
        <div className="hidden lg:block flex-1 max-w-xl mx-4">
          <SearchBar selectedCity={selectedCity} />
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-3 md:gap-4 flex-shrink-0">
          <Link to="/explore" className="hidden md:flex items-center gap-1.5 text-gray-600 hover:text-orange-500 transition font-medium text-sm no-underline">
            <Compass size={18} />
            <span className="hidden xl:inline">Explore</span>
          </Link>

          {canOrder && (
          <Link to="/cart" className="relative text-gray-600 hover:text-orange-500 transition no-underline">
            <ShoppingBag size={20} />
            {cart.length > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-orange-500 text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center animate-pulse-glow">
                {cart.length}
              </span>
            )}
          </Link>
          )}

          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-xl hover:bg-gray-100 transition"
          >
            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

          {user ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-2 hover:bg-gray-50 p-1 pr-3 rounded-full transition border border-transparent hover:border-gray-200"
              >
                <div className="bg-gradient-to-br from-orange-400 to-red-500 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-black shadow-sm">
                  {displayName.charAt(0).toUpperCase()}
                </div>
                <ChevronDown size={14} className={`text-gray-500 transition-transform duration-200 hidden md:block ${isDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-60 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50">
                  <div className="px-5 py-4 bg-gradient-to-br from-orange-50 to-red-50 border-b border-orange-100">
                    <p className="text-[10px] font-black text-orange-500 uppercase tracking-widest">
                      {user.role === 'ROLE_ADMIN' ? '👑 Admin Account' : 'Customer Account'}
                    </p>
                    <p className="text-sm font-black text-gray-800 capitalize mt-0.5">{displayName}</p>
                    <p className="text-xs text-gray-500 truncate">{displayEmail}</p>
                  </div>

                  <div className="py-2">
                    {user.role === 'ROLE_ADMIN' && (
                      <Link to="/admin" onClick={() => setIsDropdownOpen(false)} className="flex items-center gap-3 px-5 py-2.5 text-sm text-orange-600 bg-orange-50 font-black hover:bg-orange-100 transition no-underline border-b border-orange-100">
                        <LayoutDashboard size={16} /> Kitchen Panel
                      </Link>
                    )}
                    {user.role === 'ROLE_DELIVERY_PARTNER' && (
                      <Link to="/delivery" onClick={() => setIsDropdownOpen(false)} className="flex items-center gap-3 px-5 py-2.5 text-sm text-blue-600 bg-blue-50 font-black hover:bg-blue-100 transition no-underline border-b border-blue-100">
                        <Package size={16} /> Delivery Dashboard
                      </Link>
                    )}
                    {user.role === 'ROLE_RESTAURANT_OWNER' && (
                      <Link to="/restaurant-owner" onClick={() => setIsDropdownOpen(false)} className="flex items-center gap-3 px-5 py-2.5 text-sm text-green-600 bg-green-50 font-black hover:bg-green-100 transition no-underline border-b border-green-100">
                        <Utensils size={16} /> Restaurant Panel
                      </Link>
                    )}
                    <Link to="/profile" onClick={() => setIsDropdownOpen(false)} className="flex items-center gap-3 px-5 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition no-underline">
                      <UserCircle size={16} /> My Profile
                    </Link>
                    <Link to="/orders" onClick={() => setIsDropdownOpen(false)} className="flex items-center gap-3 px-5 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition no-underline">
                      <Package size={16} /> My Orders
                    </Link>
                    <Link to="/explore" onClick={() => setIsDropdownOpen(false)} className="flex items-center gap-3 px-5 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition no-underline">
                      <Heart size={16} /> Favorites
                    </Link>
                  </div>
                  <div className="border-t border-gray-100 py-1">
                    <button onClick={handleLogout} className="flex items-center gap-3 px-5 py-2.5 text-sm text-red-600 hover:bg-red-50 transition w-full text-left font-bold">
                      <LogOut size={16} /> Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className="bg-orange-500 text-white hover:bg-orange-600 px-4 py-2 rounded-full text-sm font-bold transition flex items-center gap-2 no-underline shadow-sm shadow-orange-200">
              <User size={16} /> <span className="hidden sm:inline">Login</span>
            </Link>
          )}
        </div>
      </div>

      {/* Mobile Search Bar */}
      <div className="lg:hidden px-4 pb-3">
        <SearchBar selectedCity={selectedCity} />
      </div>

      {/* Mobile Menu Drawer */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 py-4 space-y-2">
          <Link to="/explore" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 text-sm font-bold text-gray-700 hover:bg-gray-50 rounded-xl no-underline transition">
            <Compass size={18} /> Explore
          </Link>
          {canOrder && (
          <Link to="/cart" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 text-sm font-bold text-gray-700 hover:bg-gray-50 rounded-xl no-underline transition">
            <ShoppingBag size={18} /> Cart {cart.length > 0 && <span className="bg-orange-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full">{cart.length}</span>}
          </Link>
          )}
          {user && (
            <>
              {user.role === 'ROLE_ADMIN' && (
                <Link to="/admin" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 text-sm font-bold text-orange-600 bg-orange-50 rounded-xl no-underline transition">
                  <LayoutDashboard size={18} /> Kitchen Panel
                </Link>
              )}
              {user.role === 'ROLE_DELIVERY_PARTNER' && (
                <Link to="/delivery" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 text-sm font-bold text-blue-600 bg-blue-50 rounded-xl no-underline transition">
                  <Package size={18} /> Delivery Dashboard
                </Link>
              )}
              {user.role === 'ROLE_RESTAURANT_OWNER' && (
                <Link to="/restaurant-owner" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 text-sm font-bold text-green-600 bg-green-50 rounded-xl no-underline transition">
                  <Utensils size={18} /> Restaurant Panel
                </Link>
              )}
              {canOrder && (
              <Link to="/orders" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 text-sm font-bold text-gray-700 hover:bg-gray-50 rounded-xl no-underline transition">
                <Package size={18} /> My Orders
              </Link>
              )}
              <button onClick={() => { setIsMobileMenuOpen(false); handleLogout(); }} className="flex items-center gap-3 px-4 py-3 text-sm font-bold text-red-600 hover:bg-red-50 rounded-xl w-full transition">
                <LogOut size={18} /> Logout
              </button>
            </>
          )}
          {!user && (
            <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center justify-center gap-2 bg-orange-500 text-white px-4 py-3 rounded-xl font-bold text-sm no-underline transition">
              <User size={16} /> Login
            </Link>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
