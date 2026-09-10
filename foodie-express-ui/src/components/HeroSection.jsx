import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, Zap, Shield, Clock, Compass, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const heroSlides = [
  {
    title: "Hungry?",
    subtitle: "Order from 100+ restaurants across 12 cities",
    gradient: "from-orange-600 via-red-500 to-pink-500",
    emoji: "🍔",
    image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=1200"
  },
  {
    title: "Craving Biryani?",
    subtitle: "Hyderabad's best biryanis delivered hot to your door",
    gradient: "from-amber-500 via-orange-500 to-red-500",
    emoji: "🍛",
    image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?q=80&w=1200"
  },
  {
    title: "Weekend Vibes",
    subtitle: "Pizza, Pasta & more from top Italian kitchens",
    gradient: "from-green-500 via-emerald-500 to-teal-500",
    emoji: "🍕",
    image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=1200"
  },
  {
    title: "Late Night Cravings?",
    subtitle: "We deliver until midnight. Every single day.",
    gradient: "from-purple-600 via-indigo-500 to-blue-500",
    emoji: "🌙",
    image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=1200"
  }
];

const HeroSection = () => {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = React.useState(0);
  const [paused, setPaused] = React.useState(false);

  React.useEffect(() => {
    if (paused) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [paused]);

  const slide = heroSlides[currentSlide];

  return (
    <section className="relative overflow-hidden" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
      <AnimatePresence mode="wait">
      <motion.div
        key={currentSlide}
        initial={{ opacity: 0, scale: 1.02 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.6 }}
        className={`bg-gradient-to-br ${slide.gradient}`}
      >
        <div className="absolute inset-0">
          <img
            src={slide.image}
            alt=""
            className="w-full h-full object-cover opacity-20"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent" />
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
            backgroundSize: '32px 32px'
          }}></div>
        </div>

        <div className="absolute top-10 right-10 text-[120px] md:text-[200px] opacity-10 select-none animate-float">
          {slide.emoji}
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 relative z-10">
          <div className="max-w-2xl">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <span className="inline-block bg-white/20 text-white text-xs font-black px-4 py-2 rounded-full uppercase tracking-wider mb-6 backdrop-blur-sm">
                🎉 Flat 40% OFF on first order
              </span>
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-white leading-tight mb-4">
                {slide.title}
              </h1>
              <p className="text-lg md:text-xl text-white/80 font-medium mb-8 max-w-lg">
                {slide.subtitle}
              </p>
            </motion.div>

            {/* Single global search lives in Navbar — hero uses CTAs to avoid duplicates */}
            <div className="mb-8 flex flex-wrap gap-3">
              <button
                onClick={() => document.getElementById('restaurants-section')?.scrollIntoView({ behavior: 'smooth' })}
                className="bg-white text-gray-900 px-6 py-3.5 rounded-2xl font-black text-sm flex items-center gap-2 hover:bg-orange-50 transition shadow-xl"
              >
                <Compass size={16} /> Explore restaurants
              </button>
              <button
                onClick={() => navigate('/explore')}
                className="bg-white/15 text-white border border-white/30 px-6 py-3.5 rounded-2xl font-black text-sm flex items-center gap-2 hover:bg-white/25 transition backdrop-blur-sm"
              >
                <Sparkles size={16} /> Today's offers <ChevronRight size={16} />
              </button>
            </div>
            <p className="text-white/60 text-xs font-bold mb-8 uppercase tracking-widest">
              Use the search bar above to find any dish or restaurant
            </p>

            <div className="flex flex-wrap gap-4 mb-8">
              {heroSlides.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentSlide(i)}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    i === currentSlide ? 'w-8 bg-white' : 'w-4 bg-white/40'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </motion.div>
      </AnimatePresence>

      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-wrap items-center justify-center gap-6 md:gap-12">
            {[
              { icon: Zap, text: "30-min delivery", color: "text-orange-500" },
              { icon: Shield, text: "100% safe payments", color: "text-green-500" },
              { icon: Clock, text: "Live order tracking", color: "text-blue-500" },
            ].map(({ icon: Icon, text, color }) => (
              <div key={text} className="flex items-center gap-2 text-sm font-bold text-gray-600">
                <Icon size={18} className={color} />
                {text}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
