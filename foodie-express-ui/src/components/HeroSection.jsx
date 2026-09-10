import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, Zap, Shield, Clock, Compass, Sparkles, Star, Timer } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const heroSlides = [
  {
    eyebrow: "Flat 40% OFF first order",
    title: "Crave. Tap. Devour.",
    subtitle: "45+ kitchens across 13 cities — biryani to pizza, delivered hot in ~30 min.",
    gradient: "from-stone-950 via-orange-950 to-red-900",
    accent: "text-orange-300",
    image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=1200&auto=format&fit=crop",
    stat: { rating: "4.4", label: "avg rating", orders: "2L+ orders" },
  },
  {
    eyebrow: "Hyderabad special",
    title: "Biryani o'clock.",
    subtitle: "Dum biryanis from Paradise, Bawarchi & Pista House — sealed handis, zero spills.",
    gradient: "from-stone-950 via-amber-950 to-orange-900",
    accent: "text-amber-300",
    image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?q=80&w=1200&auto=format&fit=crop",
    stat: { rating: "4.6", label: "biryani rating", orders: "80K+ handis" },
  },
  {
    eyebrow: "Weekend drop",
    title: "Cheese pulls daily.",
    subtitle: "Wood-fired pizzas, pastas & garlic breads from top Italian kitchens.",
    gradient: "from-stone-950 via-emerald-950 to-teal-900",
    accent: "text-emerald-300",
    image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=1200&auto=format&fit=crop",
    stat: { rating: "4.3", label: "pizza rating", orders: "60K+ pizzas" },
  },
];

const MARQUEE = ["Biryani", "Pizza", "Dosa", "Momos", "Butter Chicken", "Pasta", "Burgers", "Thali", "Chinese", "Desserts"];

const HeroSection = () => {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = React.useState(0);
  const [paused, setPaused] = React.useState(false);

  React.useEffect(() => {
    if (paused) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [paused]);

  const slide = heroSlides[currentSlide];

  return (
    <section onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
      <div className="relative overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className={`bg-gradient-to-br ${slide.gradient}`}
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 md:py-20 grid md:grid-cols-2 gap-10 items-center relative z-10">
              {/* Copy */}
              <div>
                <motion.div
                  key={currentSlide}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.45 }}
                >
                  <span className="inline-flex items-center gap-2 bg-white/10 text-white text-[11px] font-black px-4 py-2 rounded-full uppercase tracking-widest mb-5 backdrop-blur border border-white/15">
                    <Sparkles size={12} className={slide.accent} /> {slide.eyebrow}
                  </span>
                  <h1 className="text-4xl md:text-6xl font-black text-white leading-[1.02] mb-4 tracking-tight">
                    {slide.title}
                  </h1>
                  <p className="text-white/70 text-base md:text-lg font-medium mb-7 max-w-md">
                    {slide.subtitle}
                  </p>
                </motion.div>

                <div className="flex flex-wrap gap-3 mb-6">
                  <button
                    onClick={() => document.getElementById('restaurants-section')?.scrollIntoView({ behavior: 'smooth' })}
                    className="btn-primary px-6 py-3.5 text-sm flex items-center gap-2"
                  >
                    <Compass size={16} /> Explore restaurants
                  </button>
                  <button
                    onClick={() => navigate('/explore')}
                    className="bg-white/10 text-white border border-white/20 px-6 py-3.5 rounded-2xl font-black text-sm flex items-center gap-2 hover:bg-white/20 transition backdrop-blur"
                  >
                    Today's offers <ChevronRight size={16} />
                  </button>
                </div>

                <div className="flex items-center gap-6 text-white/80 text-sm font-bold">
                  <span className="flex items-center gap-1.5"><Star size={15} className="text-amber-300" fill="currentColor" /> {slide.stat.rating} {slide.stat.label}</span>
                  <span className="flex items-center gap-1.5"><Timer size={15} className={slide.accent} /> {slide.stat.orders}</span>
                </div>

                <div className="flex gap-2 mt-6">
                  {heroSlides.map((_, i) => (
                    <button
                      key={i}
                      aria-label={`Slide ${i + 1}`}
                      onClick={() => setCurrentSlide(i)}
                      className={`h-1.5 rounded-full transition-all duration-300 ${i === currentSlide ? 'w-8 bg-white' : 'w-4 bg-white/40 hover:bg-white/60'}`}
                    />
                  ))}
                </div>
              </div>

              {/* Visual */}
              <motion.div
                key={`img-${currentSlide}`}
                initial={{ opacity: 0, scale: 0.96, y: 12 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="relative hidden md:block"
              >
                <div className="card overflow-hidden !rounded-3xl">
                  <img src={slide.image} alt="" loading="eager" className="w-full h-[380px] object-cover" />
                </div>
                <div className="absolute -left-4 bottom-8 glass rounded-2xl px-4 py-3 shadow-xl flex items-center gap-2 text-sm font-black text-gray-800">
                  <span className="bg-green-600 text-white text-xs font-black px-2 py-1 rounded-lg">★ {slide.stat.rating}</span>
                  {slide.stat.orders}
                </div>
                <div className="absolute -right-2 top-6 glass rounded-2xl px-4 py-3 shadow-xl text-sm font-black text-gray-800 flex items-center gap-2">
                  <Zap size={15} className="text-orange-500" /> 30-min delivery
                </div>
              </motion.div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Cuisine marquee */}
      <div className="bg-stone-950 text-white/80 overflow-hidden border-y border-white/10">
        <div className="flex gap-8 whitespace-nowrap py-3 animate-marquee w-max">
          {[...MARQUEE, ...MARQUEE].map((c, i) => (
            <span key={i} className="text-xs font-black uppercase tracking-widest flex items-center gap-8">
              {c} <span className="text-orange-400">✦</span>
            </span>
          ))}
        </div>
      </div>

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
