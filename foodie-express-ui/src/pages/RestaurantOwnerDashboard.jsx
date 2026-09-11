import React, { useEffect, useState, useMemo, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { orderService, restaurantService, authService } from '../services/api';
import { salesByDay, ordersByDay, statusSplit } from '../utils/salesAnalytics';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { Store, Clock, CheckCircle2, Truck, Package, RefreshCw, IndianRupee, UtensilsCrossed, ListOrdered, BarChart3 } from 'lucide-react';
import toast from 'react-hot-toast';
import MenuManager from '../components/MenuManager';

const RestaurantOwnerDashboard = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState('');
  const [selectedRestaurantId, setSelectedRestaurantId] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('orders');
  const pollingRef = useRef(null);

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const response = await restaurantService.getAllRestaurants();
        setRestaurants(response.data);
        if (response.data.length > 0) {
          setSelectedRestaurant(response.data[0].name);
          setSelectedRestaurantId(response.data[0].id);
        }
      } catch (err) {
        console.error("Failed to fetch restaurants:", err);
      }
    };
    fetchRestaurants();
  }, []);

  const fetchOrders = useCallback(async () => {
    if (!selectedRestaurant) return;
    try {
      const response = await orderService.getRestaurantOrders(selectedRestaurant);
      setOrders(response.data.sort((a, b) => b.id - a.id));
    } catch (err) {
      console.error("Failed to fetch orders:", err);
    } finally {
      setIsLoading(false);
    }
  }, [selectedRestaurant]);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);

  useEffect(() => {
    if (activeTab === 'orders') {
      pollingRef.current = setInterval(fetchOrders, 5000);
    }
    return () => { if (pollingRef.current) clearInterval(pollingRef.current); };
  }, [activeTab, fetchOrders]);

  const stats = useMemo(() => {
    const total = orders.length;
    const pending = orders.filter(o => o.status?.toUpperCase() === 'PENDING').length;
    const preparing = orders.filter(o => o.status?.toUpperCase() === 'PREPARING').length;
    const delivered = orders.filter(o => o.status?.toUpperCase() === 'DELIVERED').length;
    const deliveredOrders = orders.filter(o => o.status?.toUpperCase() === 'DELIVERED');
    const revenue = deliveredOrders.reduce((s, o) => s + (o.totalAmount || 0), 0);
    const paid = orders.filter(o => o.paymentStatus === 'PAID').length;
    const unpaid = total - paid;
    const avgOrder = delivered ? Math.round(revenue / delivered) : 0;
    return { total, pending, preparing, delivered, revenue, paid, unpaid, avgOrder };
  }, [orders]);

  const salesData = useMemo(() => salesByDay(orders), [orders]);
  const ordersData = useMemo(() => ordersByDay(orders), [orders]);
  const statusData = useMemo(() => statusSplit(orders), [orders]);
  const PIE_COLORS = ['#f97316', '#3b82f6', '#22c55e', '#06b6d4', '#a855f7', '#eab308'];

  const handleMarkPreparing = async (orderId) => {
    try {
      await orderService.updateOrderStatus(orderId, 'PREPARING');
      toast.success(`Order #${orderId} is now being prepared!`);
      fetchOrders();
    } catch {
      toast.error("Failed to update status");
    }
  };

  const handleMarkReady = async (orderId) => {
    try {
      const partnersRes = await authService.getDeliveryPartners();
      const partners = partnersRes.data || [];
      const order = orders.find((o) => o.id === orderId);
      // Exclude the last decliner to avoid decline loops (fall back to full pool if alone)
      const eligible = order?.declinedBy
        ? partners.filter((p) => p.toLowerCase() !== order.declinedBy.toLowerCase())
        : partners;
      const pool = eligible.length > 0 ? eligible : partners;
      if (pool.length === 0) {
        toast.error("No delivery partners available. Order marked as Ready.");
        await orderService.updateOrderStatus(orderId, 'READY');
        fetchOrders();
        return;
      }
      const assignedPartner = pool[Math.floor(Math.random() * pool.length)];
      await orderService.assignDeliveryPartner(orderId, assignedPartner);
      toast.success(
        order?.declinedBy
          ? `Order #${orderId} reassigned to ${assignedPartner} (was declined by ${order.declinedBy}).`
          : `Order #${orderId} ready! Sent to ${assignedPartner} for acceptance.`
      );
      fetchOrders();
    } catch {
      toast.error("Failed to update status");
    }
  };

  if (isLoading && orders.length === 0) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
          <p className="font-black text-gray-400 uppercase tracking-widest text-sm">Loading Restaurant Panel...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-950 min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div className="flex items-center gap-4">
            <div className="bg-gradient-to-br from-orange-500 to-red-500 p-3 rounded-2xl shadow-lg shadow-orange-500/20">
              <Store size={28} className="text-white" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-black text-white">Restaurant Panel</h1>
              <p className="text-gray-500 font-medium text-sm mt-1">Manage orders and your menu</p>
            </div>
          </div>
          <div className="flex gap-2 items-center">
            <select
              value={selectedRestaurant}
              onChange={(e) => {
                setSelectedRestaurant(e.target.value);
                const found = restaurants.find(r => r.name === e.target.value);
                setSelectedRestaurantId(found?.id || '');
              }}
              className="bg-gray-800 text-white border border-gray-700 px-4 py-2.5 rounded-xl text-sm font-bold"
            >
              {restaurants.map(r => (
                <option key={r.id} value={r.name}>{r.name}</option>
              ))}
            </select>
            <button
              onClick={fetchOrders}
              className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 text-white px-4 py-2.5 rounded-xl text-sm font-bold transition border border-gray-700"
            >
              <RefreshCw size={16} />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8">
          {[
            { id: 'orders', label: 'Orders', icon: ListOrdered },
            { id: 'analytics', label: 'Sales Analytics', icon: BarChart3 },
            { id: 'menu', label: 'Menu Manager', icon: UtensilsCrossed },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-black transition ${
                activeTab === tab.id
                  ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20'
                  : 'bg-gray-900 text-gray-400 border border-gray-800 hover:border-gray-700'
              }`}
            >
              <tab.icon size={16} /> {tab.label}
            </button>
          ))}
        </div>

        {activeTab === 'orders' && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
              {[
                { label: 'Total Orders', value: stats.total, icon: Package, color: 'from-gray-500 to-gray-600' },
                { label: 'New Orders', value: stats.pending, icon: Clock, color: 'from-orange-500 to-red-500' },
                { label: 'Preparing', value: stats.preparing, icon: Store, color: 'from-blue-500 to-indigo-600' },
                { label: 'Delivered', value: stats.delivered, icon: CheckCircle2, color: 'from-green-500 to-emerald-600' },
                { label: 'Revenue', value: `₹${stats.revenue.toLocaleString()}`, icon: IndianRupee, color: 'from-purple-500 to-pink-500' },
              ].map((card, idx) => {
                const Icon = card.icon;
                return (
                  <div key={idx} className="bg-gray-900 rounded-2xl p-5 border border-gray-800">
                    <div className={`bg-gradient-to-br ${card.color} p-3 rounded-xl shadow-lg w-fit mb-3`}>
                      <Icon size={18} className="text-white" />
                    </div>
                    <p className="text-gray-400 text-[10px] font-black uppercase tracking-wider mb-1">{card.label}</p>
                    <p className="text-xl font-black text-white">{card.value}</p>
                  </div>
                );
              })}
            </div>

            <div className="space-y-4">
              {orders.length === 0 ? (
                <div className="bg-gray-900 rounded-2xl p-12 border border-gray-800 text-center">
                  <Store size={48} className="text-gray-700 mx-auto mb-4" />
                  <p className="text-gray-500 font-medium text-lg">No orders for {selectedRestaurant || 'this restaurant'}</p>
                  <p className="text-gray-600 text-sm mt-2">Orders from customers will appear here</p>
                </div>
              ) : (
                orders.map((order, idx) => {
                  const currentStatus = order.status?.toUpperCase() || 'PENDING';
                  return (
                    <motion.div
                      key={order.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.03 }}
                      className="bg-gray-900 rounded-2xl p-5 border border-gray-800 hover:border-gray-700 transition"
                    >
                      <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-3">
                            <span className="text-xs font-black uppercase tracking-widest text-orange-500">Order #{order.id}</span>
                            <span className={`px-2 py-0.5 text-[10px] font-black uppercase rounded-md border ${
                              currentStatus === 'DELIVERED' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                              currentStatus === 'ON THE WAY' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                              currentStatus === 'READY' ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20' :
                              currentStatus === 'PREPARING' ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' :
                              'bg-orange-500/10 text-orange-400 border-orange-500/20'
                            }`}>
                              {currentStatus === 'READY' ? (order.assignedDeliveryPartner ? 'READY · AWAITING PARTNER' : 'READY · UNASSIGNED') : currentStatus}
                            </span>
                            {order.assignedDeliveryPartner && (
                              <span className="text-[10px] font-bold text-gray-500 flex items-center gap-1">
                                <Truck size={10} /> {order.assignedDeliveryPartner}
                              </span>
                            )}
                            {currentStatus === 'READY' && !order.assignedDeliveryPartner && order.declinedBy && (
                              <span className="text-[10px] font-black text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-md">
                                ⚠ Declined by {order.declinedBy}{order.declineCount > 1 ? ` (${order.declineCount}x)` : ''} — tap Ready to reassign
                              </span>
                            )}
                            {currentStatus === 'READY' && !order.assignedDeliveryPartner && !order.declinedBy && (
                              <span className="text-[10px] font-black text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 px-2 py-0.5 rounded-md">
                                READY · UNASSIGNED
                              </span>
                            )}
                            {order.deliverySlot === 'LATER' && order.scheduledFor && (
                              <span className="text-[10px] font-black text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 px-2 py-0.5 rounded-md">
                                🕒 {new Date(order.scheduledFor).toLocaleString()}
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-gray-500 mb-2">{order.customerEmail}</p>
                          <div className="flex flex-wrap gap-1.5 mb-3">
                            {order.items?.map((item, i) => (
                              <span key={i} className="text-xs font-bold text-gray-300 bg-gray-800 px-2 py-1 rounded-lg">
                                {item}
                              </span>
                            ))}
                          </div>
                          <div className="flex items-center gap-4 text-xs text-gray-500">
                            <span className="flex items-center gap-1"><Clock size={12} /> {order.orderTime ? new Date(order.orderTime).toLocaleString() : 'N/A'}</span>
                            <span className="font-bold text-orange-400">₹{order.totalAmount}</span>
                          </div>
                        </div>

                        <div className="flex flex-col gap-2 w-full md:w-auto">
                          {currentStatus === 'PENDING' && (
                            <button onClick={() => handleMarkPreparing(order.id)} className="bg-yellow-600 hover:bg-yellow-500 text-white px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition flex items-center justify-center gap-2">
                              <Store size={14} /> Start Preparing
                            </button>
                          )}
                          {currentStatus === 'PREPARING' && (
                            <button onClick={() => handleMarkReady(order.id)} className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition flex items-center justify-center gap-2">
                              <Truck size={14} /> Ready for Pickup
                            </button>
                          )}
                          {currentStatus === 'READY' && !order.assignedDeliveryPartner && (
                            <button onClick={() => handleMarkReady(order.id)} className="bg-cyan-600 hover:bg-cyan-500 text-white px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition flex items-center justify-center gap-2">
                              <Truck size={14} /> Reassign Partner
                            </button>
                          )}
                          {currentStatus === 'ON THE WAY' && (
                            <div className="px-6 py-2.5 text-center text-blue-400 text-xs font-black uppercase bg-blue-500/10 rounded-xl border border-blue-500/20">
                              In Transit
                            </div>
                          )}
                          {currentStatus === 'DELIVERED' && (
                            <div className="px-6 py-2.5 text-center text-gray-500 text-xs font-black uppercase bg-gray-800/50 rounded-xl border border-gray-800">
                              ✓ Delivered
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  );
                })
              )}
            </div>
          </>
        )}

        {activeTab === 'analytics' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { label: 'Avg Order Value', value: `₹${stats.avgOrder}` },
                { label: 'Paid Orders', value: stats.paid },
                { label: 'Unpaid (COD pending)', value: stats.unpaid },
              ].map((c) => (
                <div key={c.label} className="bg-gray-900 rounded-2xl p-5 border border-gray-800">
                  <p className="text-gray-400 text-[10px] font-black uppercase tracking-wider mb-1">{c.label}</p>
                  <p className="text-xl font-black text-white">{c.value}</p>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="bg-gray-900 rounded-2xl p-5 border border-gray-800">
                <h3 className="font-black text-white mb-4">Sales — last 7 days (delivered)</h3>
                <ResponsiveContainer width="100%" height={240}>
                  <BarChart data={salesData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                    <XAxis dataKey="day" stroke="#71717a" fontSize={12} />
                    <YAxis stroke="#71717a" fontSize={12} />
                    <Tooltip contentStyle={{ background: '#18181b', border: '1px solid #27272a', borderRadius: 12 }} />
                    <Bar dataKey="sales" fill="#f97316" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="bg-gray-900 rounded-2xl p-5 border border-gray-800">
                <h3 className="font-black text-white mb-4">Orders — last 7 days</h3>
                <ResponsiveContainer width="100%" height={240}>
                  <LineChart data={ordersData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                    <XAxis dataKey="day" stroke="#71717a" fontSize={12} />
                    <YAxis stroke="#71717a" fontSize={12} allowDecimals={false} />
                    <Tooltip contentStyle={{ background: '#18181b', border: '1px solid #27272a', borderRadius: 12 }} />
                    <Line type="monotone" dataKey="orders" stroke="#3b82f6" strokeWidth={3} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="bg-gray-900 rounded-2xl p-5 border border-gray-800">
              <h3 className="font-black text-white mb-4">Orders by status</h3>
              <ResponsiveContainer width="100%" height={240}>
                <PieChart>
                  <Pie data={statusData} dataKey="value" nameKey="name" outerRadius={90} label>
                    {statusData.map((_, i) => (
                      <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ background: '#18181b', border: '1px solid #27272a', borderRadius: 12 }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {activeTab === 'menu' && selectedRestaurantId && (
          <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
            <MenuManager restaurantId={selectedRestaurantId} restaurantName={selectedRestaurant} />
          </div>
        )}
      </div>
    </div>
  );
};

export default RestaurantOwnerDashboard;
