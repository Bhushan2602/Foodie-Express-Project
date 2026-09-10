import React from 'react';
import { Link } from 'react-router-dom';
import { Utensils, Mail, Phone, MapPin, Globe, MessageCircle, Heart, Play } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 py-16">
          
          <div>
            <Link to="/" className="flex items-center gap-2 text-white no-underline mb-4">
              <div className="bg-orange-500 p-2 rounded-xl">
                <Utensils size={20} />
              </div>
              <span className="text-xl font-black">Foodie Express</span>
            </Link>
            <p className="text-sm text-gray-400 leading-relaxed mb-6">
              India's fastest growing food delivery platform. From street food to fine dining, we deliver happiness to your doorstep.
            </p>
            <div className="flex gap-3">
              {[Globe, MessageCircle, Heart, Play].map((Icon, i) => (
                <a key={i} href="#" className="w-10 h-10 bg-gray-800 hover:bg-orange-500 rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110 no-underline text-gray-400 hover:text-white">
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-white font-black text-sm uppercase tracking-wider mb-6">Explore</h3>
            <ul className="space-y-3">
              {['Home', 'Restaurants', 'Offers', 'Blog', 'Careers'].map((item) => (
                <li key={item}>
                  <Link to="/" className="text-sm text-gray-400 hover:text-orange-400 transition no-underline">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-white font-black text-sm uppercase tracking-wider mb-6">Cities</h3>
            <ul className="space-y-3">
              {['Hyderabad', 'Mumbai', 'Delhi', 'Bangalore', 'Pune', 'Kolkata', 'Chennai'].map((city) => (
                <li key={city}>
                  <Link to="/" className="text-sm text-gray-400 hover:text-orange-400 transition no-underline">
                    {city}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-white font-black text-sm uppercase tracking-wider mb-6">Contact</h3>
            <ul className="space-y-4">
              <li className="flex items-center gap-3 text-sm text-gray-400">
                <Mail size={16} className="text-orange-500" />
                hello@foodieexpress.com
              </li>
              <li className="flex items-center gap-3 text-sm text-gray-400">
                <Phone size={16} className="text-orange-500" />
                +91 1800-123-4567
              </li>
              <li className="flex items-center gap-3 text-sm text-gray-400">
                <MapPin size={16} className="text-orange-500" />
                Hyderabad, India
              </li>
            </ul>
            <div className="mt-6 p-4 bg-gray-800 rounded-xl border border-gray-700">
              <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-2">Download the App</p>
              <div className="flex gap-2">
                <button className="flex-1 bg-white text-gray-900 px-3 py-2 rounded-lg text-xs font-black hover:bg-gray-100 transition">
                  App Store
                </button>
                <button className="flex-1 bg-white text-gray-900 px-3 py-2 rounded-lg text-xs font-black hover:bg-gray-100 transition">
                  Play Store
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 py-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-gray-500">
            &copy; 2026 Foodie Express. All rights reserved. Built with passion.
          </p>
          <div className="flex gap-6">
            {['Privacy Policy', 'Terms of Service', 'Refund Policy'].map((item) => (
              <a key={item} href="#" className="text-xs text-gray-500 hover:text-orange-400 transition no-underline">
                {item}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
