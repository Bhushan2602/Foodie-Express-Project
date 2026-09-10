import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { MapPin, ChevronRight } from 'lucide-react';

const FALLBACK_CITY = "https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=400&auto=format&fit=crop";

const cities = [
  { name: "Hyderabad", image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?q=80&w=400&auto=format&fit=crop", restaurants: "500+", tagline: "City of Biryani" },
  { name: "Mumbai", image: "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?q=80&w=400", restaurants: "800+", tagline: "Street Food Capital" },
  { name: "Delhi", image: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?q=80&w=400&auto=format&fit=crop", restaurants: "700+", tagline: "Mughlai Paradise" },
  { name: "Bangalore", image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=400", restaurants: "600+", tagline: "Garden City Food" },
  { name: "Pune", image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?q=80&w=400", restaurants: "350+", tagline: "Oxford of the East" },
  { name: "Kolkata", image: "https://images.unsplash.com/photo-1567337710282-00832b415979?q=80&w=400", restaurants: "400+", tagline: "City of Joy" },
  { name: "Chennai", image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?q=80&w=400&auto=format&fit=crop", restaurants: "380+", tagline: "Temple of Food" },
  { name: "Jaipur", image: "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?q=80&w=400", restaurants: "250+", tagline: "Pink City Flavors" },
  { name: "Ahmedabad", image: "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?q=80&w=400&auto=format&fit=crop", restaurants: "300+", tagline: "Foodie's Paradise" },
  { name: "Lucknow", image: "https://images.unsplash.com/photo-1596797038530-2c107229654b?q=80&w=400", restaurants: "280+", tagline: "Nawabi Cuisine" },
  { name: "Goa", image: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?q=80&w=400", restaurants: "200+", tagline: "Coastal Delights" },
  { name: "Chandigarh", image: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?q=80&w=400&auto=format&fit=crop", restaurants: "180+", tagline: "City Beautiful Eats" },
];

const CityExplorer = ({ onSelectCity }) => {
  const navigate = useNavigate();

  return (
    <section className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-black text-gray-900">
              Explore cities near you
            </h2>
            <p className="text-gray-500 text-sm mt-1 font-medium">
              Discover restaurants across 12 amazing cities
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {cities.map((city, idx) => (
            <motion.button
              key={city.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              whileHover={{ y: -6 }}
              onClick={() => {
                onSelectCity?.(city.name);
                navigate(`/explore?city=${city.name}`);
              }}
              className="group relative h-48 md:h-56 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer bg-gray-100 lift-3d"
            >
              <img
                src={city.image}
                alt={city.name}
                loading="lazy"
                onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = FALLBACK_CITY; }}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-4 text-left">
                <div className="flex items-center gap-1 mb-1">
                  <MapPin size={12} className="text-orange-400" />
                  <span className="text-[10px] font-black text-orange-400 uppercase tracking-widest">
                    {city.restaurants} Restaurants
                  </span>
                </div>
                <h3 className="text-white font-black text-lg md:text-xl">{city.name}</h3>
                <p className="text-white/60 text-xs font-medium">{city.tagline}</p>
              </div>
              <div className="absolute top-3 right-3 bg-white/20 backdrop-blur-sm p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                <ChevronRight size={16} className="text-white" />
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CityExplorer;
