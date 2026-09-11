import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { orderService } from '../services/api';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';
import { Package, Clock, CheckCircle, MapPin, ShoppingBag, ChefHat, Truck, ExternalLink, RotateCcw, XCircle, Ban } from 'lucide-react';

const statusFilters = ['All', 'Pending', 'Preparing', 'On The Way', 'Delivered', 'Cancelled'];

const MyOrders = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('All');

  useEffect(() => {
    let polling;
    const fetchOrders = async () => {
      if (!user?.email) { setIsLoading(false); return; }
      try {
        const response = await orderService.getUserOrders(user.email);
        const sorted = (response.data || []).sort((a, b) => b.id - a.id);
        setOrders(sorted);
      } catch (err) { console.error(err); } 
      finally { setIsLoading(false); }
    };
    fetchOrders();
    polling = setInterval(fetchOrders, 8000);
    return () => clearInterval(polling);
  }, [user]);

  const getStatusDisplay = (status) => {
    const s = status?.toLowerCase() || 'pending';
    if (s === 'delivered') return { color: 'text-green-600 bg-green-50 border-green-100', icon: <CheckCircle size={14} />, label: 'Delivered' };
    if (s === 'cancelled') return { color: 'text-red-600 bg-red-50 border-red-100', icon: <Ban size={14} />, label: 'Cancelled' };
    if (s === 'ready') return { color: 'text-cyan-600 bg-cyan-50 border-cyan-100', icon: <Truck size={14} />, label: 'On The Way' };
    if (s === 'on the way') return { color: 'text-blue-600 bg-blue-50 border-blue-100', icon: <Truck size={14} />, label: 'On The Way' };
    if (s === 'preparing') return { color: 'text-orange-600 bg-orange-50 border-orange-100', icon: <ChefHat size={14} />, label: 'Preparing' };
    return { color: 'text-yellow-600 bg-yellow-50 border-yellow-100', icon: <Clock size={14} />, label: 'Pending' };
  };

  const cancelFeeFor = (order) => {
    const s = (order.status || '').toUpperCase();
    return (s === 'READY' || s === 'ON THE WAY') ? 30 : 0;
  };

  const handleCancel = async (order) => {
    const fee = cancelFeeFor(order);
    const msg = fee > 0
      ? `Cancel order #${order.id}? A ₹${fee} cancellation charge applies (partner already involved).${order.paymentMethod === 'cod' ? ' No online refund — fee is recorded on the order.' : ' Refund = paid amount minus fee.'}`
      : `Cancel order #${order.id}? No charge applies before dispatch.`;
    if (!window.confirm(msg)) return;
    try {
      await orderService.cancelOrder(order.id, user.email);
      toast.success(fee > 0 ? `Order cancelled. ₹${fee} fee applied.` : 'Order cancelled — no charge.');
      const response = await orderService.getUserOrders(user.email);
      setOrders((response.data || []).sort((a, b) => b.id - a.id));
    } catch (err) {
      toast.error(err.response?.data?.message || 'Cancel failed');
    }
  };

  const filteredOrders = activeFilter === 'All'
    ? orders
    : orders.filter(o => getStatusDisplay(o.status).label === activeFilter);

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto p-6 md:p-10">
        {[1, 2].map(i => (
          <div key={i} className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 animate-pulse mb-4">
            <div className="h-4 w-1/4 bg-gray-200 rounded mb-4" />
            <div className="h-8 w-1/2 bg-gray-100 rounded mb-6" />
            <div className="h-12 w-full bg-gray-50 rounded-xl" />
          </div>
        ))}
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-4">
        <div className="bg-orange-100 p-6 rounded-full mb-6">
          <ShoppingBag size={48} className="text-orange-500" />
        </div>
        <h2 className="text-2xl font-black text-gray-800">No orders yet</h2>
        <p className="text-gray-500 mt-2 font-medium text-center">Start exploring delicious restaurants!</p>
        <Link to="/explore" className="mt-6 bg-orange-500 text-white px-8 py-3 rounded-2xl font-black hover:bg-orange-600 transition no-underline shadow-lg shadow-orange-200">
          Explore Restaurants
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-8 pb-24 md:pb-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl md:text-3xl font-black flex items-center gap-3">
            <Package className="text-orange-500" /> My Orders
          </h1>
          <span className="text-xs font-bold text-gray-400">{orders.length} total</span>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto scrollbar-hide pb-2">
          {statusFilters.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-4 py-2 rounded-xl text-xs font-black transition whitespace-nowrap ${
                activeFilter === filter
                  ? 'bg-orange-500 text-white shadow-md shadow-orange-200'
                  : 'bg-white text-gray-500 border border-gray-200 hover:border-orange-200'
              }`}
            >
              {filter}
              {filter !== 'All' && (
                <span className="ml-1.5 bg-white/20 px-1.5 py-0.5 rounded text-[10px]">
                  {orders.filter(o => getStatusDisplay(o.status).label === filter).length}
                </span>
              )}
            </button>
          ))}
        </div>

        <div className="space-y-4">
          {filteredOrders.map((order, idx) => {
            const statusStyle = getStatusDisplay(order.status);
            const cancellable = !['delivered', 'cancelled'].includes((order.status || '').toLowerCase());
            const isActive = order.status?.toLowerCase() !== 'delivered' && order.status?.toLowerCase() !== 'cancelled';
            return (
              <motion.div 
                key={order.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(idx * 0.05, 0.5) }}
                className="bg-white rounded-2xl p-5 md:p-6 shadow-sm border border-gray-100 hover:shadow-md transition"
              >
                <div className="flex justify-between items-start mb-4 border-b border-gray-50 pb-3">
                  <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Order #{order.id}</p>
                    <p className="text-xs font-bold text-gray-500 mt-0.5">
                      {order.orderTime ? new Date(order.orderTime).toLocaleDateString('en-IN', {
                        day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
                      }) : 'Today'}
                    </p>
                  </div>
                  <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase border ${statusStyle.color}`}>
                    {statusStyle.icon} {statusStyle.label}
                  </div>
                </div>

                <div className="flex flex-col md:flex-row justify-between items-end gap-4">
                  <div className="flex-1">
                    <h3 className="font-black text-base mb-2 flex items-center gap-2">
                      <MapPin size={16} className="text-orange-500" /> {order.restaurantName}
                    </h3>
                    <div className="flex flex-wrap gap-1.5">
                      {order.items?.map((item, i) => (
                        <span key={i} className="bg-gray-50 px-2.5 py-1 rounded-lg text-[11px] font-bold text-gray-600 border border-gray-100">
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-[10px] text-gray-400 font-black uppercase mb-0.5">Total</p>
                      <p className="text-xl font-black text-gray-900">₹{order.totalAmount}</p>
                    </div>
                    <div className="flex flex-col gap-2">
                      {isActive && (
                        <Link
                          to={`/order/${order.id}`}
                          className="bg-orange-500 text-white px-4 py-2 rounded-xl text-xs font-black flex items-center gap-1 hover:bg-orange-600 transition no-underline"
                        >
                          Track <ExternalLink size={10} />
                        </Link>
                      )}
                      {cancellable && (
                        <button
                          onClick={() => handleCancel(order)}
                          className="bg-white text-red-600 border border-red-200 px-4 py-2 rounded-xl text-xs font-black flex items-center gap-1 hover:bg-red-50 transition"
                        >
                          <XCircle size={10} /> Cancel{cancelFeeFor(order) > 0 ? ` (₹${cancelFeeFor(order)} fee)` : ' (free)'}
                        </button>
                      )}
                      {order.status?.toLowerCase() === 'cancelled' && order.cancellationFee > 0 && (
                        <p className="text-[11px] font-bold text-red-500">Fee applied: ₹{order.cancellationFee}</p>
                      )}
                      {!isActive && (
                        <Link
                          to="/"
                          className="bg-gray-100 text-gray-600 px-4 py-2 rounded-xl text-xs font-black flex items-center gap-1 hover:bg-gray-200 transition no-underline"
                        >
                          <RotateCcw size={10} /> Reorder
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default MyOrders;
