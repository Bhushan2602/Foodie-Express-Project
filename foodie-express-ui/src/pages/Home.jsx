import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { restaurantService } from '../services/api';
import { Plus, Minus } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { imgFallback } from '../utils/restaurantMeta';
import { Link } from 'react-router-dom';
import HeroSection from '../components/HeroSection';
import CuisineCategories from '../components/CuisineCategories';
import CityExplorer from '../components/CityExplorer';
import FeaturedRestaurants from '../components/FeaturedRestaurants';
import Testimonials from '../components/Testimonials';
import AppBanner from '../components/AppBanner';
import RestaurantSkeleton from '../components/RestaurantSkeleton';

const Home = ({ selectedCity, setSelectedCity }) => {
  const [restaurants, setRestaurants] = useState([]);
  const [filteredRestaurants, setFilteredRestaurants] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCuisine, setSelectedCuisine] = useState('All');
  const { cart, addToCart, removeOneFromCart } = useCart();
  const { user } = useAuth();
  const canOrder = !user || user.role === 'ROLE_USER';

  useEffect(() => {
    const fetchRestaurants = async () => {
      setIsLoading(true);
      try {
        const response = (selectedCity === "All" || selectedCity === "")
          ? await restaurantService.getAllRestaurants()
          : await restaurantService.getRestaurantsByCity(selectedCity);
        setRestaurants(response.data);
        setFilteredRestaurants(response.data);
      } catch (error) {
        console.error("Error fetching food:", error);
      } finally {
        setTimeout(() => setIsLoading(false), 500);
      }
    };
    fetchRestaurants();
  }, [selectedCity]);

  useEffect(() => {
    let result = [...restaurants];

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(r =>
        r.name.toLowerCase().includes(q) ||
        r.cuisineType?.toLowerCase().includes(q) ||
        r.menu?.some(m => m.name.toLowerCase().includes(q))
      );
    }

    if (selectedCuisine !== 'All') {
      result = result.filter(r =>
        r.cuisineType?.toLowerCase().includes(selectedCuisine.toLowerCase())
      );
    }

    setFilteredRestaurants(result);
  }, [searchQuery, selectedCuisine, restaurants]);

  const handleCuisineSelect = (cuisine) => {
    setSelectedCuisine(cuisine);
    const el = document.getElementById('restaurants-section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="bg-gray-50 dark:bg-stone-950 min-h-screen pb-20 md:pb-0">
      <HeroSection />

      {selectedCity === "All" || selectedCity === "" ? (
        <>
          <CuisineCategories onSelect={handleCuisineSelect} />
          <CityExplorer onSelectCity={(city) => setSelectedCity?.(city)} />
          <FeaturedRestaurants restaurants={restaurants} />
        </>
      ) : (
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 pt-8">
          <div className="card p-5 flex items-center justify-between">
            <div>
              <p className="text-[11px] font-black uppercase tracking-widest text-orange-600">Showing city</p>
              <h2 className="text-2xl font-black text-gray-900 dark:text-white">{selectedCity}</h2>
            </div>
            <button
              onClick={() => setSelectedCity?.("All")}
              className="text-xs font-black text-orange-600 hover:underline"
            >
              View all cities
            </button>
          </div>
        </div>
      )}

      {/* Restaurants Section */}
      <section id="restaurants-section" className="py-12 bg-white dark:bg-stone-950">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-black text-gray-900">
                {searchQuery
                  ? `Results for "${searchQuery}"`
                  : selectedCuisine !== 'All'
                  ? selectedCuisine + ' Restaurants'
                  : selectedCity !== 'All'
                  ? `Restaurants in ${selectedCity}`
                  : 'All Restaurants'
                }
              </h2>
              <p className="text-gray-500 text-sm mt-1 font-medium">
                {isLoading ? 'Loading...' : `${filteredRestaurants.length} restaurants available`}
              </p>
            </div>
            {(searchQuery || selectedCuisine !== 'All') && (
              <button
                onClick={() => { setSearchQuery(''); setSelectedCuisine('All'); }}
                className="text-orange-500 text-xs font-bold hover:text-orange-600 transition"
              >
                Clear Filters
              </button>
            )}
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {Array(8).fill("").map((_, i) => <RestaurantSkeleton key={i} />)}
            </div>
          ) : filteredRestaurants.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredRestaurants.map((res, idx) => (
                <motion.div
                  key={res.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: Math.min(idx * 0.05, 0.5) }}
                  className="bg-white dark:bg-stone-900 rounded-2xl shadow-sm border border-gray-100 dark:border-white/10 overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col lift-3d"
                >
                  <Link to={`/restaurant/${res.id}`} className="h-48 overflow-hidden relative block bg-gray-100">
                    <img
                      src={res.imageUrl || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=500"}
                      alt={res.name}
                      loading="lazy"
                      onError={imgFallback}
                      className="w-full h-full object-cover hover:scale-110 transition-transform duration-500 aspect-[4/3]"
                    />
                    <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg shadow-sm">
                      <span className="text-xs font-black text-gray-800">⭐ {res.rating || "4.0"}</span>
                    </div>
                    <div className="absolute top-3 right-3 bg-orange-500 text-white px-2 py-1 rounded-lg shadow-sm">
                      <span className="text-[10px] font-black uppercase">{res.cuisineType}</span>
                    </div>
                  </Link>

                  <div className="p-5 flex-1 flex flex-col">
                    <Link to={`/restaurant/${res.id}`} className="no-underline group">
                      <h2 className="text-lg font-black text-gray-800 group-hover:text-orange-600 transition line-clamp-1">
                        {res.name}
                      </h2>
                    </Link>
                    <div className="flex items-center text-gray-400 text-xs mt-1 mb-3">
                      📍 {res.address}
                    </div>
                    <p className="text-xs text-gray-400 mb-4">
                      ⏱ {res.deliveryTime || "30-45"} min • 🏙 {res.city}
                    </p>

                    <div className="mt-auto border-t pt-3">
                      <h3 className="font-bold text-[10px] uppercase tracking-widest text-gray-400 mb-2">Quick Add</h3>
                      {!canOrder && (
                        <p className="text-[11px] font-bold text-amber-700 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2">
                          Staff preview — ordering disabled.
                        </p>
                      )}
                      {canOrder && res.menu?.slice(0, 2).map((item, i) => {
                        const itemCount = cart.filter(c => c.name === item.name && c.restaurantName === res.name).length;
                        const itemInCart = cart.find(c => c.name === item.name && c.restaurantName === res.name);
                        return (
                          <div key={i} className="flex justify-between items-center py-2 border-b border-gray-50 last:border-0">
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
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-gray-50 rounded-3xl border border-dashed border-gray-200">
              <p className="text-5xl mb-4">🍽️</p>
              <p className="text-gray-400 font-medium text-lg">No restaurants found</p>
              <button
                onClick={() => { setSearchQuery(''); setSelectedCuisine('All'); }}
                className="mt-4 text-orange-500 text-sm font-bold underline"
              >
                Reset Filters
              </button>
            </div>
          )}
        </div>
      </section>

      <Testimonials />
      <AppBanner />
    </div>
  );
};

export default Home;
