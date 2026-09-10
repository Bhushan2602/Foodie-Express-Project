import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { orderService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { ChevronLeft, ClipboardList, ChefHat, Truck, CheckCircle2, MapPin, RefreshCw, Phone, Star, RotateCcw } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const OrderTracking = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [order, setOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchOrderDetails = async () => {
    if (!user) return;
    try {
      const response = await orderService.getUserOrders(user.email);
      const foundOrder = response.data.find(o => o.id === parseInt(id));
      if (foundOrder) {
        setOrder(foundOrder);
      } else {
        toast.error("Order not found!");
        navigate('/orders');
      }
    } catch (error) {
      console.error("Error fetching order:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrderDetails();
    const interval = setInterval(fetchOrderDetails, 5000);
    return () => clearInterval(interval);
  }, [id, user]);

  if (isLoading || !order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
          <p className="font-black text-gray-400 tracking-widest uppercase text-sm">Locating Order...</p>
        </div>
      </div>
    );
  }

  const status = order.status ? order.status.toUpperCase() : 'PENDING';
  let currentStep = 0;
  if (status === 'PREPARING') currentStep = 1;
  if (status === 'ON THE WAY') currentStep = 2;
  if (status === 'DELIVERED') currentStep = 3;

  const getEstimatedTime = () => {
    if (currentStep === 0) return { time: '30-45', color: 'text-white' };
    if (currentStep === 1) return { time: '15-25', color: 'text-orange-400' };
    if (currentStep === 2) return { time: '5-10', color: 'text-blue-400' };
    return { time: 'Arrived!', color: 'text-green-400' };
  };

  const eta = getEstimatedTime();

  const trackingSteps = [
    { title: "Order Placed", desc: "We have received your order", icon: ClipboardList, time: order.orderTime ? new Date(order.orderTime).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) : '' },
    { title: "In the Kitchen", desc: "The chef is preparing your food", icon: ChefHat, time: '' },
    { title: "Out for Delivery", desc: "Your food is on the way", icon: Truck, time: '' },
    { title: "Delivered", desc: "Enjoy your meal!", icon: CheckCircle2, time: '' }
  ];

  const driverInfo = {
    name: "Rajesh K.",
    rating: "4.8",
    vehicle: "MH-12-AB-1234",
  };

  return (
    <div className="bg-gray-50 min-h-screen py-6 px-4 md:px-8 pb-24 md:pb-8">
      <div className="max-w-3xl mx-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button onClick={() => navigate('/orders')} className="bg-white p-2.5 rounded-xl shadow-sm border border-gray-100 hover:bg-gray-50 transition text-gray-600">
            <ChevronLeft size={22} />
          </button>
          <div className="text-center">
            <h1 className="text-xl font-black text-gray-900">Track Order</h1>
            <p className="text-xs font-bold text-orange-500 uppercase tracking-widest">#{order.id}</p>
          </div>
          <div className="w-10" />
        </div>

        {/* Live Status Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-2xl p-6 md:p-8 text-white mb-6 shadow-xl relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-48 h-48 bg-orange-500 opacity-10 rounded-full blur-3xl -mr-16 -mt-16" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-500 opacity-10 rounded-full blur-3xl -ml-16 -mb-16" />
          
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-6">
              <div>
                <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-1">Estimated Arrival</p>
                <h2 className={`text-4xl md:text-5xl font-black ${eta.color} transition-all`}>
                  {eta.time.includes('-') ? (
                    <>{eta.time} <span className="text-lg text-gray-400">min</span></>
                  ) : eta.time}
                </h2>
              </div>
              <div className="flex items-center gap-1.5 bg-green-500/20 px-3 py-1.5 rounded-full">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-xs font-bold text-green-400">Live</span>
              </div>
            </div>

            {/* Animated Progress Bar */}
            <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${((currentStep + 1) / 4) * 100}%` }}
                transition={{ duration: 1, ease: 'easeOut' }}
                className="h-full bg-gradient-to-r from-orange-500 to-green-500 rounded-full"
              />
            </div>
            <div className="flex justify-between mt-2 text-[10px] text-gray-500 font-bold">
              <span>Placed</span>
              <span>Preparing</span>
              <span>On the Way</span>
              <span>Delivered</span>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          
          {/* Visual Tracker */}
          <div className="md:col-span-3 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h3 className="font-black text-gray-800 mb-6 border-b pb-3 text-sm uppercase tracking-wider">Order Progress</h3>
            
            <div className="space-y-0">
              {trackingSteps.map((step, index) => {
                const Icon = step.icon;
                const isActive = index === currentStep;
                const isCompleted = index < currentStep;
                const isLast = index === trackingSteps.length - 1;
                
                return (
                  <div key={index} className="flex gap-4">
                    {/* Timeline */}
                    <div className="flex flex-col items-center">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-all ${
                        isActive ? 'bg-orange-500 text-white shadow-lg shadow-orange-200 ring-4 ring-orange-100' :
                        isCompleted ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-400'
                      }`}>
                        {isActive && <div className="absolute w-10 h-10 rounded-full border-4 border-orange-300 animate-ping opacity-30" />}
                        <Icon size={16} />
                      </div>
                      {!isLast && (
                        <div className={`w-0.5 h-12 ${
                          isCompleted ? 'bg-green-500' : 'bg-gray-200'
                        }`} />
                      )}
                    </div>

                    {/* Content */}
                    <div className="pb-6 flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className={`font-black text-sm ${
                          isActive ? 'text-orange-600' : isCompleted ? 'text-gray-800' : 'text-gray-400'
                        }`}>
                          {step.title}
                        </h4>
                        {step.time && (
                          <span className="text-[10px] text-gray-400 font-bold">{step.time}</span>
                        )}
                      </div>
                      <p className={`text-xs mt-0.5 ${isActive ? 'text-gray-600' : 'text-gray-400'}`}>
                        {step.desc}
                      </p>
                      {isActive && (
                        <motion.div
                          initial={{ opacity: 0, y: -5 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="mt-2 bg-orange-50 text-orange-600 px-3 py-1.5 rounded-lg text-xs font-bold inline-flex items-center gap-1"
                        >
                          <RefreshCw size={10} className="animate-spin" /> Updating live...
                        </motion.div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column */}
          <div className="md:col-span-2 space-y-4">
            {/* Delivery Partner */}
            {currentStep >= 2 && currentStep < 3 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100"
              >
                <h3 className="font-black text-gray-800 mb-4 text-sm uppercase tracking-wider">Delivery Partner</h3>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center text-xl font-black text-orange-600">
                    {driverInfo.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-bold text-gray-800">{driverInfo.name}</p>
                    <div className="flex items-center gap-1 text-xs text-gray-400">
                      <Star size={10} fill="#f97316" className="text-orange-500" /> {driverInfo.rating} • {driverInfo.vehicle}
                    </div>
                  </div>
                </div>
                <button className="w-full bg-green-500 text-white py-2.5 rounded-xl text-xs font-black flex items-center justify-center gap-2 hover:bg-green-600 transition">
                  <Phone size={14} /> Call Partner
                </button>
              </motion.div>
            )}

            {/* Reorder */}
            {currentStep === 3 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-green-50 border border-green-200 rounded-2xl p-5 text-center"
              >
                <span className="text-4xl mb-2 block">🎉</span>
                <h3 className="font-black text-green-800 mb-1">Delivered!</h3>
                <p className="text-xs text-green-600 mb-4">Enjoy your meal. Rate your experience!</p>
                <div className="flex gap-2 mb-4">
                  {[1,2,3,4,5].map(s => (
                    <button key={s} className="text-2xl hover:scale-125 transition-transform">⭐</button>
                  ))}
                </div>
                <Link to="/" className="w-full flex items-center justify-center gap-2 bg-orange-500 text-white py-3 rounded-xl text-xs font-black hover:bg-orange-600 transition no-underline">
                  <RotateCcw size={14} /> Reorder
                </Link>
              </motion.div>
            )}

            {/* Receipt */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <h3 className="font-black text-gray-800 mb-4 text-sm uppercase tracking-wider">Receipt</h3>
              
              <div className="flex items-start gap-3 mb-4 bg-gray-50 p-3 rounded-xl border border-gray-100">
                <MapPin className="text-orange-500 mt-0.5 shrink-0" size={16} />
                <div>
                  <p className="text-[10px] font-black uppercase text-gray-400 mb-0.5">Delivering From</p>
                  <p className="font-bold text-gray-800 text-sm">{order.restaurantName}</p>
                </div>
              </div>

              <div className="space-y-2 mb-4">
                {order.items?.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center text-sm">
                    <span className="font-medium text-gray-600">{item}</span>
                  </div>
                ))}
              </div>

              <div className="border-t border-dashed pt-3 flex justify-between items-center">
                <span className="font-black text-gray-800 text-sm">Total</span>
                <span className="font-black text-orange-600 text-lg">₹{order.totalAmount}</span>
              </div>
            </div>

            <Link to="/orders" className="block w-full text-center py-3 bg-gray-100 text-gray-600 rounded-xl text-xs font-black hover:bg-gray-200 transition no-underline">
              View All Orders
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderTracking;
