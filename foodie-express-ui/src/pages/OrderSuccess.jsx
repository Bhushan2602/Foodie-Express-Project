import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, ShoppingBag, ListOrdered, PartyPopper } from 'lucide-react';
import { Link } from 'react-router-dom';

const CONFETTI = Array.from({ length: 24 }, (_, i) => ({
  left: `${(i * 41) % 100}%`,
  delay: (i % 8) * 0.12,
  color: ['#f97316', '#22c55e', '#3b82f6', '#eab308', '#ec4899'][i % 5],
  size: 6 + (i % 3) * 3,
}));

const OrderSuccess = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-stone-950 flex items-center justify-center p-6 overflow-hidden">
      {/* Confetti burst (pure CSS/Framer — no extra deps) */}
      <div className="fixed inset-0 pointer-events-none">
        {CONFETTI.map((c, i) => (
          <motion.span
            key={i}
            initial={{ y: -20, opacity: 0, rotate: 0 }}
            animate={{ y: '110vh', opacity: [0, 1, 1, 0], rotate: 360 }}
            transition={{ duration: 2.8, delay: c.delay, ease: 'easeIn' }}
            className="absolute top-0 rounded-sm"
            style={{ left: c.left, width: c.size, height: c.size * 0.5, background: c.color }}
          />
        ))}
      </div>
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="max-w-md w-full bg-white dark:bg-stone-900 rounded-[2rem] shadow-xl p-10 text-center border border-gray-100 dark:border-white/10 relative"
      >
        <p className="inline-flex items-center gap-1.5 text-[11px] font-black uppercase tracking-widest text-orange-600 bg-orange-50 dark:bg-orange-500/10 px-3 py-1.5 rounded-full mb-4">
          <PartyPopper size={13} /> Order placed
        </p>
        <motion.div 
          initial={{ scale: 0, rotate: -45 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
          className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6"
        >
          <CheckCircle size={48} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <h1 className="text-3xl font-black text-gray-900 mb-2">Order Confirmed!</h1>
          <p className="text-gray-500 font-medium mb-2">
            Your delicious food is being prepared with love.
          </p>
          <p className="text-xs text-gray-400 mb-8">
            You can track your order status in real-time.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="space-y-3"
        >
          <Link to="/orders" className="w-full flex items-center justify-center gap-2 bg-gray-900 text-white py-4 rounded-2xl font-black tracking-wide hover:bg-black transition shadow-lg no-underline">
            <ListOrdered size={18} /> View My Orders
          </Link>
          <Link to="/" className="w-full flex items-center justify-center gap-2 bg-white text-gray-600 py-4 rounded-2xl font-black tracking-wide hover:bg-gray-50 transition border border-gray-200 no-underline">
            <ShoppingBag size={18} /> Order More Food
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default OrderSuccess;
