import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { restaurantService } from '../services/api';
import { MapPin, Plus, Minus, Star, Clock, SlidersHorizontal, Leaf, Search, Grid3X3, List, X, ChevronDown } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import RestaurantSkeleton from '../components/RestaurantSkeleton';

const cuisineFilters = [
  'All', 'Biryani', 'North Indian', 'South Indian', 'Chinese', 'Italian',
  'Mughlai', 'Street Food', 'Continental', 'Thai', 'Bengali', 'Gujarati',
  'Rajasthani', 'Seafood', 'Bakery', 'Cafe', 'Fast Food', 'Chettinad'
];

const sortOptions = [
  { id: 'relevance', label: 'Relevance' },
  { id: 'rating', label: 'Rating' },
  { id: 'delivery', label: 'Delivery Time' },
  { id: 'costLow', label: 'Cost: Low to High' },
  { id: 'costHigh', label: 'Cost: High to Low' },
];

const Explore = () => {
  const [searchParams] = useSearchParams();
  const [restaurants, setRestaurants] = useState([]);
  const [filteredRestaurants, setFilteredRestaurants] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(() => searchParams.get('q') || '');
  const [selectedCity, setSelectedCity] = useState(() => searchParams.get('city') || 'All');
  const [selectedCuisine, setSelectedCuisine] = useState('All');
  const [sortBy, setSortBy] = useState('relevance');
  const [isVegOnly, setIsVegOnly] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 2000]);
  const [viewMode, setViewMode] = useState('grid');
  const [showFilters, setShowFilters] = useState(false);
  const { cart, addToCart, removeOneFromCart } = useCart();
  const { user } = useAuth();
  const canOrder = !user || user.role === 'ROLE_USER';

  useEffect(() => {
    const q = searchParams.get('q');
    const city = searchParams.get('city');
    if (q) setSearchQuery(q);
    if (city) setSelectedCity(city);
  }, [searchParams]);

  useEffect(() => {
    const fetchAll = async () => {
      setIsLoading(true);
      try {
        const response = (selectedCity && selectedCity !== 'All')
          ? await restaurantService.getRestaurantsByCity(selectedCity)
          : await restaurantService.getAllRestaurants();
        setRestaurants(response.data);
        setFilteredRestaurants(response.data);
      } catch (err) {
        console.error(err);
      } finally {
        setTimeout(() => setIsLoading(false), 600);
      }
    };
    fetchAll();
  }, [selectedCity]);

  useEffect(() => {
    let result = [...restaurants];

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(r =>
        r.name.toLowerCase().includes(q) ||
        r.cuisineType?.toLowerCase().includes(q) ||
        r.city?.toLowerCase().includes(q) ||
        r.menu?.some(m => m.name.toLowerCase().includes(q))
      );
    }

    if (selectedCuisine !== 'All') {
      result = result.filter(r =>
        r.cuisineType?.toLowerCase() === selectedCuisine.toLowerCase()
      );
    }

    if (selectedCity && selectedCity !== 'All') {
      result = result.filter(r =>
        r.city?.toLowerCase() === selectedCity.toLowerCase()
      );
    }

    if (isVegOnly) {
      result = result.filter(r =>
        r.menu?.some(m => m.isVegetarian)
      );
    }

    const minAvgPrice = priceRange[0];
    const maxAvgPrice = priceRange[1];
    result = result.filter(r => {
      if (!r.menu || r.menu.length === 0) return true;
      const avg = r.menu.reduce((s, m) => s + m.price, 0) / r.menu.length;
      return avg >= minAvgPrice && avg <= maxAvgPrice;
    });

    switch (sortBy) {
      case 'rating':
        result.sort((a, b) => (parseFloat(b.rating) || 4) - (parseFloat(a.rating) || 4));
        break;
      case 'delivery':
        result.sort((a, b) => (parseInt(a.deliveryTime) || 30) - (parseInt(b.deliveryTime) || 30));
        break;
      case 'costLow':
        result.sort((a, b) => (a.menu?.[0]?.price || 0) - (b.menu?.[0]?.price || 0));
        break;
      case 'costHigh':
        result.sort((a, b) => (b.menu?.[0]?.price || 0) - (a.menu?.[0]?.price || 0));
        break;
      default:
        break;
    }

    setFilteredRestaurants(result);
  }, [searchQuery, selectedCuisine, selectedCity, sortBy, isVegOnly, priceRange, restaurants]);

  return (
    <div className="bg-gray-50 min-h-screen pb-20 md:pb-0">
      {/* Hero Header */}
      <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white py-8 md:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl md:text-4xl font-black mb-2"
          >
            Explore Restaurants
          </motion.h1>
          <p className="text-gray-400 font-medium mb-6">
            Discover {restaurants.length}+ restaurants{selectedCity && selectedCity !== 'All' ? ` in ${selectedCity}` : ' across 12 cities'}
          </p>

          {/* Search */}
          <div className="relative max-w-2xl">
            <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by restaurant, cuisine, dish, or city..."
              className="w-full pl-12 pr-4 py-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 transition font-medium"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-white/10 rounded-full transition"
              >
                <X size={16} className="text-gray-400" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white border-b sticky top-[64px] z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 py-3 overflow-x-auto scrollbar-hide">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-xl text-xs font-black uppercase tracking-wider transition flex-shrink-0"
            >
              <SlidersHorizontal size={14} /> Filters
            </button>

            <div className="h-6 w-[1px] bg-gray-200 flex-shrink-0" />

            <button
              onClick={() => setIsVegOnly(!isVegOnly)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black uppercase transition-all flex-shrink-0 ${
                isVegOnly
                  ? 'bg-green-600 text-white shadow-md shadow-green-100'
                  : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
              }`}
            >
              <Leaf size={14} /> Veg Only
            </button>

            <div className="h-6 w-[1px] bg-gray-200 flex-shrink-0" />

            {cuisineFilters.slice(0, 8).map((cuisine) => (
              <button
                key={cuisine}
                onClick={() => setSelectedCuisine(cuisine)}
                className={`px-3 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex-shrink-0 ${
                  selectedCuisine === cuisine
                    ? 'bg-orange-500 text-white shadow-sm'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {cuisine}
              </button>
            ))}

            <div className="h-6 w-[1px] bg-gray-200 flex-shrink-0" />

            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition ${viewMode === 'grid' ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-500'}`}
              >
                <Grid3X3 size={16} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition ${viewMode === 'list' ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-500'}`}
              >
                <List size={16} />
              </button>
            </div>

            <div className="flex-1" />

            <div className="hidden md:flex items-center gap-2 flex-shrink-0">
              {sortOptions.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => setSortBy(opt.id)}
                  className={`px-3 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                    sortBy === opt.id
                      ? 'bg-orange-500 text-white shadow-sm'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Advanced Filters Panel */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="bg-white border-b overflow-hidden"
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-xs font-black text-gray-500 uppercase tracking-wider mb-3">
                    Cuisine Type
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {cuisineFilters.map((cuisine) => (
                      <button
                        key={cuisine}
                        onClick={() => setSelectedCuisine(cuisine)}
                        className={`px-3 py-1.5 rounded-full text-xs font-bold transition ${
                          selectedCuisine === cuisine
                            ? 'bg-orange-500 text-white'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        {cuisine}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-black text-gray-500 uppercase tracking-wider mb-3">
                    Price Range (avg per dish)
                  </label>
                  <div className="flex items-center gap-4">
                    <input
                      type="range"
                      min="0"
                      max="2000"
                      step="50"
                      value={priceRange[1]}
                      onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
                      className="flex-1 accent-orange-500"
                    />
                    <span className="text-sm font-bold text-gray-700 min-w-[80px]">
                      ₹0 - ₹{priceRange[1]}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-black text-gray-500 uppercase tracking-wider mb-3">
                    Sort By
                  </label>
                  <div className="space-y-2">
                    {sortOptions.map((opt) => (
                      <button
                        key={opt.id}
                        onClick={() => setSortBy(opt.id)}
                        className={`w-full text-left px-4 py-2 rounded-xl text-sm font-bold transition ${
                          sortBy === opt.id
                            ? 'bg-orange-50 text-orange-600 border border-orange-200'
                            : 'text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Results */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm font-bold text-gray-500">
            {isLoading ? 'Searching...' : `${filteredRestaurants.length} restaurants found`}
          </p>
          {!isLoading && (selectedCuisine !== 'All' || selectedCity !== 'All') && (
            <button
              onClick={() => { setSelectedCuisine('All'); setSelectedCity('All'); setSearchQuery(''); }}
              className="text-orange-500 text-xs font-bold hover:text-orange-600 transition"
            >
              Clear Filters
            </button>
          )}
        </div>

        {isLoading ? (
          <div className={`grid gap-6 ${
            viewMode === 'grid'
              ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
              : 'grid-cols-1'
          }`}>
            {Array(6).fill('').map((_, i) => <RestaurantSkeleton key={i} />)}
          </div>
        ) : filteredRestaurants.length > 0 ? (
          <div className={`grid gap-6 ${
            viewMode === 'grid'
              ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
              : 'grid-cols-1'
          }`}>
            {filteredRestaurants.map((res, idx) => (
              <motion.div
                key={res.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(idx * 0.05, 0.5) }}
              >
                {viewMode === 'grid' ? (
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col h-full">
                    <Link to={`/restaurant/${res.id}`} className="h-48 overflow-hidden relative block">
                      <img
                        src={res.imageUrl || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=500"}
                        alt={res.name}
                        className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg shadow-sm">
                        <div className="flex items-center gap-1">
                          <Star size={12} fill="#16a34a" className="text-green-600" />
                          <span className="text-xs font-black">{res.rating || "4.0"}</span>
                        </div>
                      </div>
                      <div className="absolute top-3 right-3 bg-orange-500 text-white px-2 py-1 rounded-lg">
                        <span className="text-[10px] font-black uppercase">{res.cuisineType}</span>
                      </div>
                    </Link>
                    <div className="p-5 flex-1 flex flex-col">
                      <Link to={`/restaurant/${res.id}`} className="no-underline">
                        <h2 className="text-lg font-black text-gray-800 hover:text-orange-600 transition line-clamp-1">
                          {res.name}
                        </h2>
                      </Link>
                      <div className="flex items-center text-gray-400 text-xs mt-1 gap-1 mb-4">
                        <MapPin size={12} className="text-orange-400 flex-shrink-0" />
                        <span className="truncate">{res.address} • {res.city}</span>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-gray-400 mb-4">
                        <span className="flex items-center gap-1"><Clock size={12} /> {res.deliveryTime || "30-45"} min</span>
                      </div>
                      <div className="mt-auto border-t pt-3">
                        <h3 className="font-bold text-[10px] uppercase tracking-widest text-gray-400 mb-2">Menu</h3>
                        {!canOrder && (
                          <p className="text-[11px] font-bold text-amber-700 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2 mb-2">
                            Staff preview — ordering disabled.
                          </p>
                        )}
                        {canOrder && res.menu?.slice(0, 3).map((item, i) => {
                          const itemCount = cart.filter(c => c.name === item.name && c.restaurantName === res.name).length;
                          const itemInCart = cart.find(c => c.name === item.name && c.restaurantName === res.name);
                          return (
                            <div key={i} className="flex justify-between items-center py-2 last:border-0">
                              <div className="flex-1 min-w-0 mr-3">
                                <span className="text-sm font-semibold text-gray-700 block truncate">{item.name}</span>
                                <span className="text-xs font-bold text-orange-500">₹{item.price}</span>
                              </div>
                              {itemCount > 0 ? (
                                <div className="flex items-center gap-2 bg-orange-50 rounded-xl p-0.5 border border-orange-100 flex-shrink-0">
                                  <button onClick={() => removeOneFromCart(itemInCart.id)} className="bg-white text-orange-600 w-6 h-6 rounded-lg flex items-center justify-center font-bold hover:bg-orange-600 hover:text-white transition shadow-sm">
                                    <Minus size={12} />
                                  </button>
                                  <span className="font-black text-xs w-3 text-center">{itemCount}</span>
                                  <button onClick={() => addToCart(item, res.name, res.city)} className="bg-white text-orange-600 w-6 h-6 rounded-lg flex items-center justify-center font-bold hover:bg-orange-600 hover:text-white transition shadow-sm">
                                    <Plus size={12} />
                                  </button>
                                </div>
                              ) : (
                                <button onClick={() => addToCart(item, res.name, res.city)} className="bg-orange-500 text-white p-1.5 rounded-xl hover:bg-orange-600 transition shadow-md shadow-orange-100 flex-shrink-0">
                                  <Plus size={14} />
                                </button>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                ) : (
                  /* List View */
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition flex">
                    <Link to={`/restaurant/${res.id}`} className="w-48 md:w-64 h-48 flex-shrink-0 overflow-hidden relative block">
                      <img
                        src={res.imageUrl || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=500"}
                        alt={res.name}
                        className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                      />
                    </Link>
                    <div className="p-5 flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="bg-orange-100 text-orange-600 text-[10px] font-black px-2 py-0.5 rounded-full uppercase">
                              {res.cuisineType}
                            </span>
                            <span className="bg-green-50 text-green-600 text-[10px] font-black px-2 py-0.5 rounded-full flex items-center gap-0.5">
                              <Star size={10} fill="currentColor" /> {res.rating || "4.0"}
                            </span>
                          </div>
                          <Link to={`/restaurant/${res.id}`} className="no-underline">
                            <h2 className="text-xl font-black text-gray-800 hover:text-orange-600 transition">{res.name}</h2>
                          </Link>
                          <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                            <MapPin size={12} /> {res.address} • {res.city}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-4 mt-3 text-xs text-gray-500">
                        <span className="flex items-center gap-1"><Clock size={12} /> {res.deliveryTime || "30-45"} min</span>
                      </div>
                      {canOrder && res.menu?.slice(0, 2).map((item, i) => {
                        const itemCount = cart.filter(c => c.name === item.name && c.restaurantName === res.name).length;
                        const itemInCart = cart.find(c => c.name === item.name && c.restaurantName === res.name);
                        return (
                          <div key={i} className="flex justify-between items-center py-2 border-t border-gray-50 mt-2">
                            <div className="flex-1 min-w-0 mr-3">
                              <span className="text-sm font-semibold text-gray-700 block truncate">{item.name}</span>
                              <span className="text-xs font-bold text-orange-500">₹{item.price}</span>
                            </div>
                            {itemCount > 0 ? (
                              <div className="flex items-center gap-2 bg-orange-50 rounded-xl p-0.5 border border-orange-100 flex-shrink-0">
                                <button onClick={() => removeOneFromCart(itemInCart.id)} className="bg-white text-orange-600 w-6 h-6 rounded-lg flex items-center justify-center font-bold hover:bg-orange-600 hover:text-white transition shadow-sm">
                                  <Minus size={12} />
                                </button>
                                <span className="font-black text-xs w-3 text-center">{itemCount}</span>
                                <button onClick={() => addToCart(item, res.name, res.city)} className="bg-white text-orange-600 w-6 h-6 rounded-lg flex items-center justify-center font-bold hover:bg-orange-600 hover:text-white transition shadow-sm">
                                  <Plus size={12} />
                                </button>
                              </div>
                            ) : (
                              <button onClick={() => addToCart(item, res.name, res.city)} className="bg-orange-500 text-white px-3 py-1 rounded-xl hover:bg-orange-600 transition shadow-md shadow-orange-100 text-xs font-black flex-shrink-0">
                                ADD +
                              </button>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
            <p className="text-4xl mb-4">🔍</p>
            <p className="text-gray-400 font-medium text-lg">No restaurants found matching your criteria</p>
            <button
              onClick={() => { setSelectedCuisine('All'); setSearchQuery(''); setIsVegOnly(false); setSortBy('relevance'); }}
              className="mt-4 text-orange-500 text-sm font-bold underline"
            >
              Reset All Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Explore;
