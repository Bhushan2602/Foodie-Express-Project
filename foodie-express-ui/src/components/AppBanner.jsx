import React from 'react';
import { motion } from 'framer-motion';
import { Utensils, ArrowRight, Smartphone } from 'lucide-react';

const AppBanner = () => {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-orange-500 via-red-500 to-pink-500 rounded-3xl p-8 md:p-12 lg:p-16 overflow-hidden relative">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -ml-16 -mb-16" />

          <div className="grid md:grid-cols-2 gap-8 items-center relative z-10">
            <div>
              <span className="inline-block bg-white/20 text-white text-xs font-black px-4 py-2 rounded-full uppercase tracking-wider mb-6 backdrop-blur-sm">
                📱 Download the App
              </span>
              <h2 className="text-3xl md:text-4xl font-black text-white leading-tight mb-4">
                Get the Foodie Express app
              </h2>
              <p className="text-white/80 font-medium mb-8 max-w-md leading-relaxed">
                Order food on the go with our lightning-fast mobile app. 
                Exclusive app-only offers, real-time tracking, and seamless payments.
              </p>
              <div className="flex gap-4">
                <button className="bg-white text-gray-900 px-6 py-3 rounded-xl font-black text-sm hover:bg-gray-100 transition flex items-center gap-2 shadow-lg">
                  <Smartphone size={18} /> App Store
                </button>
                <button className="bg-white/20 text-white px-6 py-3 rounded-xl font-black text-sm hover:bg-white/30 transition flex items-center gap-2 backdrop-blur-sm border border-white/20">
                  <Smartphone size={18} /> Play Store
                </button>
              </div>
            </div>

            <div className="hidden md:flex justify-center">
              <motion.div
                animate={{ y: [0, -12, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="bg-white/10 backdrop-blur-xl p-6 rounded-3xl border border-white/20"
              >
                <div className="bg-white rounded-2xl p-6 w-56 shadow-2xl">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="bg-orange-100 p-2 rounded-xl">
                      <Utensils size={16} className="text-orange-500" />
                    </div>
                    <span className="text-sm font-black text-gray-800">Foodie Express</span>
                  </div>
                  <div className="space-y-2">
                    <div className="h-3 bg-gray-100 rounded-full w-full" />
                    <div className="h-3 bg-gray-100 rounded-full w-3/4" />
                    <div className="h-3 bg-orange-100 rounded-full w-1/2" />
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-[10px] font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full">Live Tracking</span>
                    <ArrowRight size={14} className="text-orange-500" />
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AppBanner;
