import React from 'react';
import { motion } from 'framer-motion';

const cuisines = [
  { name: "Biryani", emoji: "🍛", image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?q=80&w=200" },
  { name: "Pizza", emoji: "🍕", image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=200" },
  { name: "Burger", emoji: "🍔", image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=200" },
  { name: "Dosa", emoji: "🫓", image: "https://images.unsplash.com/photo-1630383249896-424e482df921?q=80&w=200" },
  { name: "Chinese", emoji: "🥡", image: "https://images.unsplash.com/photo-1569058242253-92a9c755a0ec?q=80&w=200" },
  { name: "Thali", emoji: "🍽️", image: "https://images.unsplash.com/photo-1596797038530-2c107229654b?q=80&w=200" },
  { name: "Rolls", emoji: "🌯", image: "https://images.unsplash.com/photo-1626700051175-6818013e1d4f?q=80&w=200" },
  { name: "Momos", emoji: "🥟", image: "https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?q=80&w=200" },
  { name: "Cake", emoji: "🎂", image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=200" },
  { name: "Coffee", emoji: "☕", image: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?q=80&w=200" },
  { name: "Ice Cream", emoji: "🍦", image: "https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?q=80&w=200" },
  { name: "Seafood", emoji: "🦐", image: "https://images.unsplash.com/photo-1559737558-2f5a35f4523b?q=80&w=200" },
];

const CuisineCategories = ({ onSelect }) => {
  return (
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-black text-gray-900">
              What's on your mind?
            </h2>
            <p className="text-gray-500 text-sm mt-1 font-medium">Explore by your favorite cuisine</p>
          </div>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4">
          {cuisines.map((cuisine, idx) => (
            <motion.button
              key={cuisine.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              whileHover={{ scale: 1.05, y: -4 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onSelect?.(cuisine.name)}
              className="rounded-2xl overflow-hidden flex flex-col items-center gap-0 hover:shadow-lg transition-all duration-300 border border-transparent hover:border-gray-100 group cursor-pointer bg-white"
            >
              <div className="w-full aspect-square overflow-hidden relative">
                <img
                  src={cuisine.image}
                  alt={cuisine.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <span className="absolute bottom-2 left-0 right-0 text-center text-white text-xs font-black uppercase tracking-wider drop-shadow-lg">
                  {cuisine.name}
                </span>
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CuisineCategories;
