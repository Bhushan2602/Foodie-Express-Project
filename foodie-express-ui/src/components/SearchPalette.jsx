import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { restaurantService } from '../services/api';

const SearchPalette = ({ open, onClose, selectedCity }) => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);

  useEffect(() => {
    if (!open) {
      setQuery('');
      setResults([]);
      return;
    }
  }, [open ]);

  useEffect(() => {
    if (query.length < 2) {
      setResults([]);
      return;
    }
    const t = setTimeout(async () => {
      try {
        const res = selectedCity && selectedCity !== 'All'
          ? await restaurantService.getRestaurantsByCity(selectedCity)
          : await restaurantService.getAllRestaurants();
        const q = query.toLowerCase();
        setResults(res.data.filter((r) =>
          r.name.toLowerCase().includes(q) ||
          r.cuisineType?.toLowerCase().includes(q) ||
          r.menu?.some((m) => m.name.toLowerCase().includes(q))).slice(0, 7));
      } catch {
        setResults([]);
      }
    }, 250);
    return () => clearTimeout(t);
  }, [query, selectedCity]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm flex items-start justify-center pt-24 px-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: -12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.98 }}
            transition={{ duration: 0.18 }}
            className="w-full max-w-xl bg-white rounded-2xl shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 px-5 py-4 border-b">
              <Search size={18} className="text-gray-400" />
              <input
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search restaurants, cuisines, dishes..."
                className="flex-1 outline-none text-sm font-medium"
              />
              <kbd className="text-[10px] font-black bg-gray-100 px-2 py-1 rounded-lg text-gray-500">ESC</kbd>
            </div>
            <div className="max-h-80 overflow-y-auto p-2">
              {results.length === 0 && (
                <p className="text-xs text-gray-400 font-bold px-4 py-6 text-center">
                  {query.length < 2 ? 'Type at least 2 characters. Enter goes to Explore.' : 'No matches — press Enter to search in Explore.'}
                </p>
              )}
              {results.map((r) => (
                <button
                  key={r.id}
                  onClick={() => { onClose(); navigate(`/restaurant/${r.id}`); }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-orange-50 rounded-xl text-left transition"
                >
                  <img src={r.imageUrl} alt="" onError={(e) => { e.currentTarget.src = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=200&auto=format&fit=crop"; }} className="w-10 h-10 rounded-xl object-cover bg-gray-100" />
                  <span className="flex-1 min-w-0">
                    <span className="block text-sm font-bold text-gray-800 truncate">{r.name}</span>
                    <span className="block text-xs text-gray-500">{r.cuisineType} • {r.city}</span>
                  </span>
                </button>
              ))}
              {query.trim() && (
                <button
                  onClick={() => { onClose(); navigate(`/explore?q=${encodeURIComponent(query)}`); }}
                  className="w-full mt-1 px-4 py-3 bg-gray-50 hover:bg-orange-50 rounded-xl text-sm font-black text-orange-600 transition"
                >
                  Search “{query}” in Explore →
                </button>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SearchPalette;
