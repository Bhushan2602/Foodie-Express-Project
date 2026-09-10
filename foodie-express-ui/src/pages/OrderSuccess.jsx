import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, ShoppingBag, ListOrdered } from 'lucide-react';
import { Link } from 'react-router-dom';

const OrderSuccess = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <motion.div 
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="max-w-md w-full bg-white rounded-[2rem] shadow-xl p-10 text-center border border-gray-100"
      >
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
