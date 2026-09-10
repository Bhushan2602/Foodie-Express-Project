import React, { useEffect, useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { orderService } from '../services/api';
import { Truck, MapPin, Clock, CheckCircle2, Phone, Package, RefreshCw, IndianRupee } from 'lucide-react';
import toast from 'react-hot-toast';

const DeliveryDashboard = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchAssignedOrders = async () => {
    if (!user?.email) return;
    try {
      const response = await orderService.getDeliveryPartnerOrders(user.email);
      setOrders(response.data.sort((a, b) => b.id - a.id));
    } catch (err) {
      console.error("Failed to fetch orders:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAssignedOrders();
    const polling = setInterval(fetchAssignedOrders, 8000);
    return () => clearInterval(polling);
  }, [user?.email]);

  const stats = useMemo(() => {
    const active = orders.filter(o => o.status?.toUpperCase() === 'ON THE WAY').length;
    const delivered = orders.filter(o => o.status?.toUpperCase() === 'DELIVERED').length;
    const earnings = orders
      .filter(o => o.status?.toUpperCase() === 'DELIVERED')
      .reduce((s, o) => s + Math.round((o.totalAmount || 0) * 0.15), 0);
    return { active, delivered, earnings, total: orders.length };
  }, [orders]);

  const handleMarkDelivered = async (orderId) => {
    try {
      await orderService.updateOrderStatus(orderId, 'DELIVERED');
      toast.success(`Order #${orderId} delivered!`);
      fetchAssignedOrders();
    } catch {
      toast.error("Failed to update status");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <p className="font-black text-gray-400 uppercase tracking-widest text-sm">Loading Deliveries...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-950 min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div className="flex items-center gap-4">
            <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-3 rounded-2xl shadow-lg shadow-blue-500/20">
              <Truck size={28} className="text-white" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-black text-white">Delivery Dashboard</h1>
              <p className="text-gray-500 font-medium text-sm mt-1">Welcome back, {user?.name || 'Partner'}</p>
            </div>
          </div>
          <button
            onClick={fetchAssignedOrders}
            className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 text-white px-4 py-2.5 rounded-xl text-sm font-bold transition border border-gray-700"
          >
            <RefreshCw size={16} /> Refresh
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Active Deliveries', value: stats.active, icon: Truck, color: 'from-blue-500 to-indigo-600' },
            { label: 'Completed', value: stats.delivered, icon: CheckCircle2, color: 'from-green-500 to-emerald-600' },
            { label: 'Total Earnings', value: `₹${stats.earnings}`, icon: IndianRupee, color: 'from-orange-500 to-red-500' },
            { label: 'Total Assigned', value: stats.total, icon: Package, color: 'from-purple-500 to-pink-500' },
          ].map((card, idx) => {
            const Icon = card.icon;
            return (
              <div key={idx} className="bg-gray-900 rounded-2xl p-5 border border-gray-800">
                <div className={`bg-gradient-to-br ${card.color} p-3 rounded-xl shadow-lg w-fit mb-3`}>
                  <Icon size={20} className="text-white" />
                </div>
                <p className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-1">{card.label}</p>
                <p className="text-2xl font-black text-white">{card.value}</p>
              </div>
            );
          })}
        </div>

        <div className="space-y-4">
          {orders.length === 0 ? (
            <div className="bg-gray-900 rounded-2xl p-12 border border-gray-800 text-center">
              <Truck size={48} className="text-gray-700 mx-auto mb-4" />
              <p className="text-gray-500 font-medium text-lg">No deliveries assigned yet</p>
              <p className="text-gray-600 text-sm mt-2">New orders will appear here when assigned to you</p>
            </div>
          ) : (
            orders.map((order, idx) => {
              const currentStatus = order.status?.toUpperCase() || 'PENDING';
              return (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="bg-gray-900 rounded-2xl p-5 border border-gray-800 hover:border-gray-700 transition"
                >
                  <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <span className="text-xs font-black uppercase tracking-widest text-blue-500">Order #{order.id}</span>
                        <span className={`px-2 py-0.5 text-[10px] font-black uppercase rounded-md border ${
                          currentStatus === 'DELIVERED' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                          currentStatus === 'ON THE WAY' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                          'bg-orange-500/10 text-orange-400 border-orange-500/20'
                        }`}>
                          {currentStatus}
                        </span>
                      </div>
                      <h3 className="text-lg font-bold text-white mb-1">{order.restaurantName}</h3>
                      <p className="text-sm text-gray-400 mb-2 flex items-center gap-1">
                        <MapPin size={14} className="text-orange-400" />
                        {order.deliveryAddress || 'Customer address'}
                      </p>
                      <div className="flex flex-wrap gap-1.5 mb-3">
                        {order.items?.map((item, i) => (
                          <span key={i} className="text-xs font-bold text-gray-300 bg-gray-800 px-2 py-1 rounded-lg">
                            {item}
                          </span>
                        ))}
                      </div>
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span className="flex items-center gap-1"><Clock size={12} /> {order.orderTime ? new Date(order.orderTime).toLocaleTimeString() : 'N/A'}</span>
                        <span className="flex items-center gap-1 font-bold text-orange-400">₹{order.totalAmount}</span>
                        <span className="text-gray-600">→ ₹{Math.round((order.totalAmount || 0) * 0.15)} earnings</span>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2 w-full md:w-auto">
                      {currentStatus === 'ON THE WAY' && (
                        <button onClick={() => handleMarkDelivered(order.id)} className="bg-green-600 hover:bg-green-500 text-white px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition flex items-center justify-center gap-2">
                          <CheckCircle2 size={14} /> Mark Delivered
                        </button>
                      )}
                      {currentStatus === 'DELIVERED' && (
                        <div className="px-6 py-2.5 text-center text-gray-500 text-xs font-black uppercase bg-gray-800/50 rounded-xl border border-gray-800">
                          ✓ Completed
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default DeliveryDashboard;
