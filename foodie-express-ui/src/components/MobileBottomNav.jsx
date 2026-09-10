import React from 'react';
import { Home, Search, ShoppingBag, User, ClipboardList } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const MobileBottomNav = () => {
  const location = useLocation();
  const { cart } = useCart();
  const { user } = useAuth();

  const navItems = [
    { icon: Home, label: "Home", path: "/" },
    { icon: Search, label: "Explore", path: "/explore" },
    { icon: ShoppingBag, label: "Cart", path: "/cart", badge: cart.length },
    { icon: ClipboardList, label: "Orders", path: user ? "/orders" : "/login" },
    { icon: User, label: user ? "Profile" : "Login", path: user ? "/profile" : "/login" },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 safe-bottom">
      <div className="flex items-center justify-around py-2 px-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <Link
              key={item.path}
              to={item.path}
              className="flex flex-col items-center gap-0.5 py-1 px-3 relative no-underline"
            >
              <div className="relative">
                <Icon
                  size={20}
                  className={`transition-colors ${
                    isActive ? 'text-orange-500' : 'text-gray-400'
                  }`}
                  strokeWidth={isActive ? 2.5 : 2}
                />
                {item.badge > 0 && (
                  <span className="absolute -top-1.5 -right-2 bg-orange-500 text-white text-[8px] font-black w-4 h-4 rounded-full flex items-center justify-center">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className={`text-[10px] font-bold ${
                isActive ? 'text-orange-500' : 'text-gray-400'
              }`}>
                {item.label}
              </span>
              {isActive && (
                <div className="absolute -bottom-2 w-5 h-0.5 bg-orange-500 rounded-full" />
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default MobileBottomNav;
