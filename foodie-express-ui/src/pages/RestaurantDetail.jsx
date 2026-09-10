import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { restaurantService } from '../services/api';
import { ChevronLeft, Star, Clock, MapPin, Plus, Minus, Leaf, Share2, Heart, Info, ShieldCheck } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { getRestaurantMeta, getSampleReviews, getFavorites, toggleFavorite } from '../utils/restaurantMeta';
import toast from 'react-hot-toast';
import React from 'react';

const RestaurantDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [restaurant, setRestaurant] = useState(null);
  const [activeCategory, setActiveCategory] = useState('all');
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [isFav, setIsFav] = useState(false);
  const { cart, addToCart, removeOneFromCart } = useCart();
  const { user } = useAuth();
  const canOrder = !user || user.role === 'ROLE_USER';

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const response = await restaurantService.getRestaurantById(id);
        setRestaurant(response.data);
        setIsFav(getFavorites().includes(response.data.id || id));
      } catch (error) {
        console.error("Error loading restaurant:", error);
      }
    };
    fetchDetails();
  }, [id]);

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast.success('Restaurant link copied!');
    } catch {
      toast.error('Could not copy link');
    }
  };

  const handleFav = () => {
    const next = toggleFavorite(restaurant.id || id);
    setIsFav(next);
    toast.success(next ? 'Added to favorites' : 'Removed from favorites');
  };

  if (!restaurant) {
    return (
      <div className="bg-gray-50 min-h-screen animate-pulse">
        <div className="h-64 md:h-[420px] w-full bg-gray-200" />
        <div className="max-w-4xl mx-auto px-4 md:px-6 -mt-8 relative z-10">
          <div className="bg-white rounded-2xl p-5 md:p-8 shadow-xl border border-gray-100">
            <div className="flex flex-wrap items-center gap-6 md:gap-10">
              <div className="h-10 w-16 bg-green-100 rounded-2xl" />
              <div className="space-y-1">
                <div className="h-3 w-16 bg-gray-200 rounded" />
                <div className="h-5 w-24 bg-gray-100 rounded" />
              </div>
              <div className="space-y-1">
                <div className="h-3 w-12 bg-gray-200 rounded" />
                <div className="h-5 w-20 bg-gray-100 rounded" />
              </div>
            </div>
          </div>
        </div>
        <div className="max-w-4xl mx-auto px-4 md:px-6 py-8 space-y-4">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="bg-white p-5 rounded-2xl border border-gray-100 flex justify-between items-center">
              <div className="flex-1 space-y-2">
                <div className="h-4 w-1/3 bg-gray-200 rounded" />
                <div className="h-3 w-16 bg-orange-100 rounded" />
                <div className="h-3 w-1/2 bg-gray-100 rounded hidden sm:block" />
              </div>
              <div className="h-10 w-16 bg-orange-100 rounded-xl" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  let costForTwo = restaurant.costForTwo || 350;
  if (!restaurant.costForTwo && restaurant.menu && restaurant.menu.length > 0) {
    const totalMenuPrice = restaurant.menu.reduce((sum, item) => sum + (item.price || 0), 0);
    const averageItemPrice = totalMenuPrice / restaurant.menu.length;
    costForTwo = Math.ceil((averageItemPrice * 2) / 50) * 50;
  }
  const meta = getRestaurantMeta({ ...restaurant, costForTwo });
  costForTwo = meta.costForTwo;
  const reviews = getSampleReviews(restaurant, 4);

  const vegItems = restaurant.menu?.filter(m => m.isVegetarian) || [];
  const nonVegItems = restaurant.menu?.filter(m => !m.isVegetarian) || [];
  const categories = [
    { id: 'all', label: 'All', count: restaurant.menu?.length || 0 },
    { id: 'veg', label: 'Pure Veg', count: vegItems.length },
    { id: 'nonveg', label: 'Non-Veg', count: nonVegItems.length },
  ];

  const displayedItems = activeCategory === 'veg' ? vegItems : activeCategory === 'nonveg' ? nonVegItems : restaurant.menu || [];

  const totalCartItems = cart.filter(c => c.restaurantName === restaurant.name).length;

  return (
    <div className="bg-gray-50 min-h-screen pb-32 md:pb-10">
      {/* Hero Image */}
      <div className="relative h-64 md:h-[420px] w-full">
        <img
          src={restaurant.imageUrl || "https://images.unsplash.com/photo-1504674900247-0877df9cc836"}
          className="w-full h-full object-cover brightness-[0.6]"
          alt={restaurant.name}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

        <button
          onClick={() => navigate(-1)}
          className="absolute top-6 left-6 bg-white/20 backdrop-blur-md text-white p-2.5 rounded-full hover:bg-white hover:text-black transition-all shadow-lg"
        >
          <ChevronLeft size={22} />
        </button>

        <div className="absolute top-6 right-6 flex gap-2">
          <button onClick={handleFav} aria-label="Save to favorites" className={`p-2.5 rounded-full transition-all shadow-lg backdrop-blur-md ${isFav ? 'bg-red-500 text-white' : 'bg-white/20 text-white hover:bg-white hover:text-black'}`}>
            <Heart size={18} fill={isFav ? "currentColor" : "none"} />
          </button>
          <button onClick={handleShare} aria-label="Share restaurant" className="bg-white/20 backdrop-blur-md text-white p-2.5 rounded-full hover:bg-white hover:text-black transition-all shadow-lg">
            <Share2 size={18} />
          </button>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-orange-500 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider">
                {restaurant.cuisineType}
              </span>
              <span className="bg-white/20 backdrop-blur-sm text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider">
                {restaurant.city}
              </span>
            </div>
            <h1 className="text-3xl md:text-5xl font-black text-white leading-tight">
              {restaurant.name}
            </h1>
            <p className="text-white/70 mt-2 flex items-center gap-1 font-medium text-sm md:text-base">
              <MapPin size={16} className="text-orange-400" /> {restaurant.address}
            </p>
          </div>
        </div>
      </div>

      {/* Info Card */}
      <div className="max-w-4xl mx-auto px-4 md:px-6 -mt-8 relative z-10">
        <div className="bg-white rounded-2xl p-5 md:p-8 shadow-xl border border-gray-100">
          <div className="flex flex-wrap items-center gap-6 md:gap-10">
            <div className="bg-green-600 text-white px-4 py-2.5 rounded-2xl font-black flex items-center gap-1.5 shadow-lg shadow-green-100">
              <Star size={18} fill="currentColor" /> {meta.rating}
              <span className="text-[11px] font-bold opacity-80">({meta.reviewsCount})</span>
            </div>
            <div className="flex flex-col">
              <span className="text-gray-400 text-[10px] uppercase font-bold tracking-widest mb-1">Delivery</span>
              <div className="flex items-center gap-2 font-black text-gray-700">
                <Clock size={16} className="text-orange-500" /> {meta.deliveryTime} MINS
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-gray-400 text-[10px] uppercase font-bold tracking-widest mb-1">Cost</span>
              <div className="font-black text-gray-700">
                ₹{costForTwo} FOR TWO
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-gray-400 text-[10px] uppercase font-bold tracking-widest mb-1">Delivery Fee</span>
              <div className="font-black text-green-600">
                ₹40
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Trust Banner */}
      <div className="max-w-4xl mx-auto px-4 md:px-6 mt-4">
        <div className="bg-green-50 border border-green-100 rounded-2xl p-4 flex items-center gap-3">
          <ShieldCheck size={20} className="text-green-600 flex-shrink-0" />
          <div>
            <p className="text-sm font-bold text-green-800">FSSAI Certified Restaurant</p>
            <p className="text-xs text-green-600">All safety and hygiene protocols followed</p>
          </div>
        </div>
      </div>

      {/* Menu Section */}
      <div className="max-w-4xl mx-auto px-4 md:px-6 py-8">
        {!canOrder && (
          <div className="mb-6 bg-amber-50 border border-amber-200 rounded-2xl p-4 text-sm font-bold text-amber-800">
            Staff preview mode — ordering is disabled for {user?.role?.replace('ROLE_', '')?.toLowerCase()} accounts. Login as a customer to add items to cart.
          </div>
        )}
        {/* Category Tabs */}
        <div className="flex items-center gap-3 mb-6 overflow-x-auto scrollbar-hide">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-5 py-2.5 rounded-xl text-sm font-black transition-all whitespace-nowrap flex items-center gap-2 ${
                activeCategory === cat.id
                  ? 'bg-orange-500 text-white shadow-md shadow-orange-200'
                  : 'bg-white text-gray-600 border border-gray-200 hover:border-orange-200'
              }`}
            >
              {cat.id === 'veg' && <Leaf size={14} />}
              {cat.label}
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                activeCategory === cat.id ? 'bg-white/20' : 'bg-gray-100'
              }`}>
                {cat.count}
              </span>
            </button>
          ))}
        </div>

        {/* Menu Items */}
        <div className="space-y-4">
          {displayedItems.map((item, idx) => {
            const itemCount = cart.filter(c => c.name === item.name && c.restaurantName === restaurant.name).length;
            const itemInCart = cart.find(c => c.name === item.name && c.restaurantName === restaurant.name);

            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(idx * 0.05, 0.5) }}
                className="bg-white p-4 md:p-5 rounded-2xl shadow-sm border border-gray-100 flex justify-between items-center hover:shadow-md transition-shadow gap-4"
              >
                <div className="flex items-center gap-1.5 mr-3">
                  {item.isVegetarian ? (
                    <div className="w-5 h-5 border-2 border-green-500 rounded-sm flex items-center justify-center">
                      <div className="w-2 h-2 bg-green-500 rounded-full" />
                    </div>
                  ) : (
                    <div className="w-5 h-5 border-2 border-red-500 rounded-sm flex items-center justify-center">
                      <div className="w-2 h-2 bg-red-500 rounded-full" />
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="font-black text-gray-800 text-sm md:text-base">{item.name}</h3>
                  <p className="text-orange-600 font-black text-sm md:text-base mt-0.5">₹{item.price}</p>
                  <p className="text-gray-400 text-xs mt-1 line-clamp-1 hidden sm:block">{item.description}</p>
                </div>

                {item.imageUrl && (
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    loading="lazy"
                    onError={(e) => { e.currentTarget.src = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=400&auto=format&fit=crop"; }}
                    className="w-16 h-16 md:w-20 md:h-20 rounded-xl object-cover flex-shrink-0 bg-gray-100"
                  />
                )}

                <div className="flex-shrink-0">
                  {!canOrder ? (
                    <span className="text-[11px] font-black text-gray-400 bg-gray-100 px-4 py-2.5 rounded-xl uppercase tracking-wider">
                      View only
                    </span>
                  ) : itemCount > 0 ? (
                    <div className="flex items-center gap-2 bg-orange-50 rounded-xl p-1 border border-orange-100">
                      <button
                        onClick={() => removeOneFromCart(itemInCart.id)}
                        className="bg-white text-orange-600 hover:bg-orange-600 hover:text-white w-8 h-8 rounded-lg flex items-center justify-center font-bold transition shadow-sm"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="font-black text-gray-800 w-5 text-center text-sm">{itemCount}</span>
                      <button
                        onClick={() => addToCart(item, restaurant.name, restaurant.city)}
                        className="bg-white text-orange-600 hover:bg-orange-600 hover:text-white w-8 h-8 rounded-lg flex items-center justify-center font-bold transition shadow-sm"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => addToCart(item, restaurant.name, restaurant.city)}
                      className="bg-orange-500 text-white px-6 py-2.5 rounded-xl font-black hover:bg-orange-600 transition shadow-md shadow-orange-100 uppercase text-xs tracking-wider"
                    >
                      ADD
                    </button>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Reviews Section */}
        <div className="mt-12">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-2xl font-black text-gray-800">Reviews</h2>
            <span className="bg-green-100 text-green-700 px-3 py-1 rounded-xl text-xs font-black">
              {meta.rating} ★ ({meta.reviewsCount} ratings)
            </span>
          </div>
          <p className="text-[11px] text-gray-400 mb-6">Sample customer reviews • Real ratings API coming soon</p>

          <div className="space-y-4">
            {(showAllReviews ? reviews : reviews.slice(0, 3)).map((review, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm"
              >
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-2xl">{review.avatar}</span>
                  <div>
                    <p className="font-black text-gray-800 text-sm">{review.name}</p>
                    <p className="text-xs text-gray-400">{review.date}</p>
                  </div>
                  <div className="ml-auto flex gap-0.5">
                    {Array(review.rating).fill(0).map((_, i) => (
                      <Star key={i} size={12} fill="#f97316" className="text-orange-500" />
                    ))}
                  </div>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">{review.text}</p>
              </motion.div>
            ))}
          </div>

          {reviews.length > 3 && (
            <button
              onClick={() => setShowAllReviews(!showAllReviews)}
              className="w-full mt-4 py-3 bg-white border border-gray-200 rounded-2xl text-sm font-black text-gray-600 hover:bg-gray-50 transition"
            >
              {showAllReviews ? 'Show Less' : `Show All ${reviews.length} Reviews`}
            </button>
          )}
        </div>
      </div>

      {/* Floating Cart Bar */}
      {totalCartItems > 0 && canOrder && (
        <div className="fixed bottom-20 md:bottom-6 left-4 right-4 md:left-auto md:right-6 md:w-96 z-40">
          <motion.button
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            onClick={() => navigate('/cart')}
            className="w-full bg-green-600 text-white py-4 rounded-2xl font-black flex items-center justify-between px-6 shadow-2xl shadow-green-200 hover:bg-green-700 transition"
          >
            <span className="flex items-center gap-2">
              🛒 View Cart
            </span>
            <span className="bg-white/20 px-3 py-1 rounded-lg text-sm">
              {totalCartItems} items • ₹{cart.filter(c => c.restaurantName === restaurant.name).reduce((s, c) => s + c.price, 0)}
            </span>
          </motion.button>
        </div>
      )}
    </div>
  );
};

export default RestaurantDetail;
