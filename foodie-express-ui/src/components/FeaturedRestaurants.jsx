import React from 'react';
import { motion } from 'framer-motion';
import { Star, Clock, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

const FeaturedRestaurants = ({ restaurants }) => {
  if (!restaurants || restaurants.length === 0) return null;

  const featured = restaurants.slice(0, 8);

  return (
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-black text-gray-900">
              Top restaurants near you
            </h2>
            <p className="text-gray-500 text-sm mt-1 font-medium">
              Handpicked favorites by our food experts
            </p>
          </div>
          <Link to="/explore" className="hidden md:flex items-center gap-1 text-orange-500 font-black text-sm hover:text-orange-600 transition no-underline">
            View All <span className="text-lg">→</span>
          </Link>
        </div>

        <div className="flex gap-4 md:gap-6 overflow-x-auto scrollbar-hide pb-4 -mx-4 px-4 md:mx-0 md:px-0">
          {featured.map((restaurant, idx) => (
            <motion.div
              key={restaurant.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="flex-shrink-0 w-64 md:w-72"
            >
              <Link to={`/restaurant/${restaurant.id}`} className="block no-underline group">
                <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300">
                  <div className="relative h-40 overflow-hidden bg-gray-100">
                    <img
                      src={restaurant.imageUrl || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=500"}
                      alt={restaurant.name}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 aspect-[4/3]"
                    />
                    <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg shadow-sm">
                      <div className="flex items-center gap-1">
                        <Star size={12} fill="#16a34a" className="text-green-600" />
                        <span className="text-xs font-black text-gray-800">
                          {restaurant.rating || "4.0"}
                        </span>
                      </div>
                    </div>
                    <div className="absolute top-3 right-3 bg-orange-500 text-white px-2 py-1 rounded-lg shadow-sm">
                      <span className="text-[10px] font-black uppercase">
                        {restaurant.cuisineType}
                      </span>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-black text-gray-800 group-hover:text-orange-600 transition truncate">
                      {restaurant.name}
                    </h3>
                    <div className="flex items-center gap-2 mt-1.5 text-xs text-gray-500">
                      <MapPin size={12} className="text-orange-400 flex-shrink-0" />
                      <span className="truncate">{restaurant.address}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-2 text-xs text-gray-400">
                      <Clock size={12} />
                      <span>{restaurant.deliveryTime || "30-45"} min</span>
                      <span className="text-gray-300">•</span>
                      <span>₹{restaurant.menu?.[0]?.price || 200} for one</span>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        <Link to="/explore" className="md:hidden flex items-center justify-center gap-1 text-orange-500 font-black text-sm mt-6 hover:text-orange-600 transition no-underline">
          View All Restaurants →
        </Link>
      </div>
    </section>
  );
};

export default FeaturedRestaurants;
