import React, { useState, useRef, useEffect } from 'react';
import { Search, X, TrendingUp, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { restaurantService } from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';

const SearchBar = ({ onSearch, selectedCity = 'All' }) => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [recentSearches, setRecentSearches] = useState(() => {
    const saved = localStorage.getItem('foodie_recent_searches');
    return saved ? JSON.parse(saved) : ['Biryani', 'Pizza', 'Dosa', 'Butter Chicken'];
  });
  const inputRef = useRef(null);
  const containerRef = useRef(null);

  const trendingSearches = [
    'Biryani', 'Pizza', 'Dosa', 'Butter Chicken', 'Momos',
    'Pasta', 'Burger', 'Rolls', 'Chinese', 'Thali'
  ];

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (query.length < 2) {
      setSuggestions([]);
      return;
    }

    const fetchSuggestions = async () => {
      try {
        const response = (selectedCity && selectedCity !== 'All')
          ? await restaurantService.getRestaurantsByCity(selectedCity)
          : await restaurantService.getAllRestaurants();
        const allRestaurants = response.data;
        const filtered = allRestaurants.filter(r =>
          r.name.toLowerCase().includes(query.toLowerCase()) ||
          r.cuisineType?.toLowerCase().includes(query.toLowerCase()) ||
          r.city?.toLowerCase().includes(query.toLowerCase()) ||
          r.menu?.some(m => m.name.toLowerCase().includes(query.toLowerCase()))
        ).slice(0, 6);
        setSuggestions(filtered);
      } catch (err) {
        console.error(err);
      }
    };

    const debounce = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(debounce);
  }, [query, selectedCity]);

  const handleSelect = (restaurant) => {
    const updated = [restaurant.name, ...recentSearches.filter(s => s !== restaurant.name)].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem('foodie_recent_searches', JSON.stringify(updated));
    setQuery('');
    setIsOpen(false);
    navigate(`/restaurant/${restaurant.id}`);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      if (onSearch) {
        onSearch(query);
      } else {
        navigate(`/explore?q=${encodeURIComponent(query)}`);
      }
      const updated = [query, ...recentSearches.filter(s => s !== query)].slice(0, 5);
      setRecentSearches(updated);
      localStorage.setItem('foodie_recent_searches', JSON.stringify(updated));
      setQuery('');
      setIsOpen(false);
    }
  };

  const handleQuickSearch = (term) => {
    setQuery(term);
    if (onSearch) {
      onSearch(term);
    } else {
      navigate(`/explore?q=${encodeURIComponent(term)}`);
    }
    setIsOpen(false);
  };

  return (
    <div ref={containerRef} className="relative w-full max-w-2xl">
      <form onSubmit={handleSearchSubmit}>
        <div className={`relative flex items-center transition-all duration-300 ${isOpen ? 'ring-2 ring-orange-200 shadow-xl shadow-orange-100/50' : 'shadow-md'} bg-white rounded-2xl border ${isOpen ? 'border-orange-200' : 'border-gray-100'}`}>
          <Search size={20} className="absolute left-4 text-gray-400" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setIsOpen(true)}
            placeholder="Search restaurants, cuisines, or dishes..."
            className="w-full pl-12 pr-12 py-4 bg-transparent rounded-2xl text-sm font-medium text-gray-800 placeholder-gray-400 focus:outline-none"
          />
          {query && (
            <button
              type="button"
              onClick={() => { setQuery(''); setSuggestions([]); }}
              className="absolute right-4 p-1 hover:bg-gray-100 rounded-full transition"
            >
              <X size={16} className="text-gray-400" />
            </button>
          )}
        </div>
      </form>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50"
          >
            {suggestions.length > 0 ? (
              <div className="p-2">
                <p className="px-3 py-2 text-[10px] font-black text-gray-400 uppercase tracking-widest">Results</p>
                {suggestions.map((r) => (
                  <button
                    key={r.id}
                    onClick={() => handleSelect(r)}
                    className="flex items-center gap-3 w-full px-3 py-3 hover:bg-orange-50 rounded-xl transition text-left"
                  >
                    <div className="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0 bg-gray-100">
                      <img src={r.imageUrl} alt={r.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-sm text-gray-800 truncate">{r.name}</p>
                      <p className="text-xs text-gray-500">{r.cuisineType} • {r.city}</p>
                    </div>
                    <span className="text-xs font-bold text-orange-500 bg-orange-50 px-2 py-1 rounded-lg">
                      {r.menu?.length || 0} items
                    </span>
                  </button>
                ))}
              </div>
            ) : query.length >= 2 ? (
              <div className="p-6 text-center">
                <p className="text-gray-400 text-sm font-medium">No results found for "{query}"</p>
              </div>
            ) : (
              <div className="p-4">
                {recentSearches.length > 0 && (
                  <div className="mb-4">
                    <p className="px-2 py-2 text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-1">
                      <Clock size={12} /> Recent Searches
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {recentSearches.map((term) => (
                        <button
                          key={term}
                          onClick={() => handleQuickSearch(term)}
                          className="px-3 py-1.5 bg-gray-100 hover:bg-orange-50 hover:text-orange-600 text-gray-600 rounded-full text-xs font-bold transition"
                        >
                          {term}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <p className="px-2 py-2 text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-1">
                    <TrendingUp size={12} /> Trending
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {trendingSearches.map((term) => (
                      <button
                        key={term}
                        onClick={() => handleQuickSearch(term)}
                        className="px-3 py-1.5 bg-orange-50 hover:bg-orange-100 text-orange-600 rounded-full text-xs font-bold transition"
                      >
                        {term}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SearchBar;
