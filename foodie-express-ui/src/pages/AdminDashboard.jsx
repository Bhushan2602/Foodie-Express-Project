import React, { useEffect, useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { orderService, restaurantService, authService } from '../services/api';
import { Package, ChefHat, CheckCircle2, Clock, Truck, RefreshCw, TrendingUp, IndianRupee, Users, ShoppingBag, ArrowUpRight, ArrowDownRight, BarChart3, Activity, Plus } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar } from 'recharts';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

const COLORS = ['#f97316', '#22c55e', '#3b82f6', '#ef4444', '#8b5cf6', '#ec4899'];

const AdminDashboard = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeView, setActiveView] = useState('overview');
  const [restaurants, setRestaurants] = useState([]);
  const [demoOrder, setDemoOrder] = useState({ restaurantName: '', items: '', totalAmount: '', paymentMethod: 'cod' });

  const fetchAllOrders = async () => {
    setIsLoading(true);
    try {
      const response = await orderService.getAllOrders();
      setOrders(response.data.sort((a, b) => b.id - a.id));
    } catch (error) {
      console.error("Failed to fetch orders:", error);
      toast.error("Could not load kitchen orders.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchAllOrders(); }, []);

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const response = await restaurantService.getAllRestaurants();
        setRestaurants(response.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchRestaurants();
  }, []);

  const handlePlaceDemoOrder = async () => {
    if (!demoOrder.restaurantName || !demoOrder.items || !demoOrder.totalAmount) {
      toast.error("Please fill all fields");
      return;
    }
    try {
      const payload = {
        userEmail: user?.email || 'admin@foodieexpress.com',
        restaurantName: demoOrder.restaurantName,
        items: demoOrder.items.split(',').map(i => i.trim()),
        totalAmount: parseFloat(demoOrder.totalAmount),
        paymentMethod: demoOrder.paymentMethod,
        status: 'PREPARING',
        paymentStatus: 'PAID',
      };
      await orderService.placeOrder(payload);
      toast.success("Demo order placed successfully!");
      setDemoOrder({ restaurantName: '', items: '', totalAmount: '', paymentMethod: 'cod' });
      fetchAllOrders();
    } catch (err) {
      toast.error("Failed to place order");
    }
  };

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      await orderService.updateOrderStatus(orderId, newStatus);
      toast.success(`Order #${orderId} marked as ${newStatus}`);
      fetchAllOrders();
    } catch {
      toast.error("Failed to update status.");
    }
  };

  const handleAutoAssign = async (orderId) => {
    try {
      const partnersRes = await authService.getDeliveryPartners();
      const partners = partnersRes.data;
      if (partners.length === 0) {
        toast.error("No delivery partners available!");
        return;
      }
      const assignedPartner = partners[Math.floor(Math.random() * partners.length)];
      await orderService.assignDeliveryPartner(orderId, assignedPartner);
      toast.success(`Assigned to ${assignedPartner}`);
      fetchAllOrders();
    } catch {
      toast.error("Failed to assign delivery partner.");
    }
  };

  const stats = useMemo(() => {
    const total = orders.length;
    const totalRevenue = orders.reduce((s, o) => s + (o.totalAmount || 0), 0);
    const delivered = orders.filter(o => o.status?.toUpperCase() === 'DELIVERED').length;
    const pending = orders.filter(o => o.status?.toUpperCase() === 'PENDING' || o.status?.toUpperCase() === 'PREPARING').length;
    const onTheWay = orders.filter(o => o.status?.toUpperCase() === 'ON THE WAY').length;
    const avgOrderValue = total > 0 ? Math.round(totalRevenue / total) : 0;
    const uniqueCustomers = new Set(orders.map(o => o.customerEmail)).size;

    return { total, totalRevenue, delivered, pending, onTheWay, avgOrderValue, uniqueCustomers };
  }, [orders]);

  const statusDistribution = useMemo(() => {
    return [
      { name: 'Pending', value: stats.pending, color: '#f97316' },
      { name: 'On The Way', value: stats.onTheWay, color: '#3b82f6' },
      { name: 'Delivered', value: stats.delivered, color: '#22c55e' },
    ].filter(d => d.value > 0);
  }, [stats]);

  const revenueData = useMemo(() => {
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dayStr = d.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric' });
      last7Days.push({
        name: dayStr,
        revenue: Math.floor(Math.random() * 5000) + 2000 + (stats.totalRevenue / 7),
        orders: Math.floor(Math.random() * 8) + 3 + Math.floor(stats.total / 7),
      });
    }
    return last7Days;
  }, [stats]);

  const restaurantData = useMemo(() => {
    const counts = {};
    orders.forEach(o => {
      const name = o.restaurantName || 'Unknown';
      counts[name] = (counts[name] || 0) + 1;
    });
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
      .map(([name, count]) => ({ name: name.length > 15 ? name.slice(0, 15) + '...' : name, orders: count }));
  }, [orders]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
          <p className="font-black text-gray-400 uppercase tracking-widest text-sm">Loading Dashboard...</p>
        </div>
      </div>
    );
  }

  const statCards = [
    { label: 'Total Revenue', value: `₹${stats.totalRevenue.toLocaleString()}`, icon: IndianRupee, color: 'from-green-500 to-emerald-600', change: '+12.5%', up: true },
    { label: 'Total Orders', value: stats.total, icon: ShoppingBag, color: 'from-orange-500 to-red-500', change: '+8.2%', up: true },
    { label: 'Active Orders', value: stats.pending + stats.onTheWay, icon: Activity, color: 'from-blue-500 to-indigo-600', change: `${stats.pending} pending`, up: false },
    { label: 'Avg Order Value', value: `₹${stats.avgOrderValue}`, icon: TrendingUp, color: 'from-purple-500 to-pink-500', change: '+5.3%', up: true },
  ];

  return (
    <div className="bg-gray-950 min-h-screen p-4 md:p-8 font-sans text-gray-100">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div className="flex items-center gap-4">
            <div className="bg-gradient-to-br from-orange-500 to-red-500 p-3 rounded-2xl shadow-lg shadow-orange-500/20">
              <ChefHat size={28} className="text-white" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-black text-white">Kitchen Dashboard</h1>
              <p className="text-gray-500 font-medium text-sm mt-1">Enterprise Order Management System</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={fetchAllOrders}
              className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 text-white px-4 py-2.5 rounded-xl text-sm font-bold transition border border-gray-700"
            >
              <RefreshCw size={16} /> Refresh
            </button>
            <div className="bg-green-500/10 border border-green-500/20 px-4 py-2.5 rounded-xl flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-green-400 text-sm font-bold">Live</span>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 mb-8 overflow-x-auto scrollbar-hide">
          {[
            { id: 'overview', label: 'Overview', icon: BarChart3 },
            { id: 'orders', label: 'Orders', icon: Package },
            { id: 'place-order', label: 'Place Demo Order', icon: Plus },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveView(tab.id)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-black transition whitespace-nowrap ${
                  activeView === tab.id
                    ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20'
                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700 border border-gray-700'
                }`}
              >
                <Icon size={16} /> {tab.label}
              </button>
            );
          })}
        </div>

        {activeView === 'overview' && (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {statCards.map((card, idx) => {
                const Icon = card.icon;
                return (
                  <div key={idx} className="bg-gray-900 rounded-2xl p-5 border border-gray-800 hover:border-gray-700 transition">
                    <div className="flex items-start justify-between mb-4">
                      <div className={`bg-gradient-to-br ${card.color} p-3 rounded-xl shadow-lg`}>
                        <Icon size={20} className="text-white" />
                      </div>
                      <span className={`text-xs font-bold flex items-center gap-0.5 ${card.up ? 'text-green-400' : 'text-blue-400'}`}>
                        {card.up ? <ArrowUpRight size={12} /> : <Activity size={12} />}
                        {card.change}
                      </span>
                    </div>
                    <p className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-1">{card.label}</p>
                    <p className="text-2xl font-black text-white">{card.value}</p>
                  </div>
                );
              })}
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              {/* Revenue Chart */}
              <div className="lg:col-span-2 bg-gray-900 rounded-2xl p-6 border border-gray-800">
                <h3 className="text-lg font-black text-white mb-6">Revenue Overview</h3>
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                    <XAxis dataKey="name" stroke="#6b7280" fontSize={12} />
                    <YAxis stroke="#6b7280" fontSize={12} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#111827', border: '1px solid #374151', borderRadius: '12px' }}
                      labelStyle={{ color: '#f9fafb' }}
                      itemStyle={{ color: '#f97316' }}
                    />
                    <Bar dataKey="revenue" fill="#f97316" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Status Distribution */}
              <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
                <h3 className="text-lg font-black text-white mb-6">Order Status</h3>
                {statusDistribution.length > 0 ? (
                  <>
                    <ResponsiveContainer width="100%" height={200}>
                      <PieChart>
                        <Pie
                          data={statusDistribution}
                          cx="50%"
                          cy="50%"
                          innerRadius={50}
                          outerRadius={80}
                          paddingAngle={4}
                          dataKey="value"
                        >
                          {statusDistribution.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{ backgroundColor: '#111827', border: '1px solid #374151', borderRadius: '12px' }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="flex flex-wrap gap-3 mt-4">
                      {statusDistribution.map((d) => (
                        <div key={d.name} className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: d.color }} />
                          <span className="text-xs font-bold text-gray-400">{d.name}: {d.value}</span>
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <p className="text-gray-500 text-sm text-center py-8">No order data yet</p>
                )}
              </div>
            </div>

            {/* Restaurant Performance */}
            <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800 mb-8">
              <h3 className="text-lg font-black text-white mb-6">Top Restaurants by Orders</h3>
              {restaurantData.length > 0 ? (
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={restaurantData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                    <XAxis type="number" stroke="#6b7280" fontSize={12} />
                    <YAxis dataKey="name" type="category" stroke="#6b7280" fontSize={11} width={120} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#111827', border: '1px solid #374151', borderRadius: '12px' }}
                    />
                    <Bar dataKey="orders" fill="#22c55e" radius={[0, 6, 6, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-gray-500 text-sm text-center py-8">No data available</p>
              )}
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
              <div className="bg-gray-900 rounded-2xl p-5 border border-gray-800 flex items-center gap-4">
                <div className="bg-blue-500/10 p-3 rounded-xl">
                  <Users size={20} className="text-blue-400" />
                </div>
                <div>
                  <p className="text-gray-400 text-xs font-bold uppercase tracking-wider">Unique Customers</p>
                  <p className="text-xl font-black text-white">{stats.uniqueCustomers}</p>
                </div>
              </div>
              <div className="bg-gray-900 rounded-2xl p-5 border border-gray-800 flex items-center gap-4">
                <div className="bg-green-500/10 p-3 rounded-xl">
                  <CheckCircle2 size={20} className="text-green-400" />
                </div>
                <div>
                  <p className="text-gray-400 text-xs font-bold uppercase tracking-wider">Delivery Rate</p>
                  <p className="text-xl font-black text-white">
                    {stats.total > 0 ? Math.round((stats.delivered / stats.total) * 100) : 0}%
                  </p>
                </div>
              </div>
              <div className="bg-gray-900 rounded-2xl p-5 border border-gray-800 flex items-center gap-4">
                <div className="bg-purple-500/10 p-3 rounded-xl">
                  <Truck size={20} className="text-purple-400" />
                </div>
                <div>
                  <p className="text-gray-400 text-xs font-bold uppercase tracking-wider">In Transit</p>
                  <p className="text-xl font-black text-white">{stats.onTheWay}</p>
                </div>
              </div>
            </div>
          </>
        )}

        {activeView === 'orders' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {orders.map(order => {
              const currentStatus = order.status ? order.status.toUpperCase() : 'PENDING';
              return (
                <div key={order.id} className="bg-gray-900 rounded-2xl p-5 border border-gray-800 shadow-lg flex flex-col hover:border-gray-700 transition">
                  <div className="flex justify-between items-start border-b border-gray-800 pb-4 mb-4">
                    <div>
                      <span className="text-xs font-black uppercase tracking-widest text-orange-500">Order #{order.id}</span>
                      <h3 className="text-base font-bold text-white mt-1">{order.restaurantName}</h3>
                      <p className="text-xs text-gray-500 mt-1">{order.customerEmail}</p>
                      {order.assignedDeliveryPartner && (
                        <p className="text-xs text-blue-400 mt-1 flex items-center gap-1">
                          <Truck size={10} /> {order.assignedDeliveryPartner}
                        </p>
                      )}
                    </div>
                    <div className={`px-3 py-1 text-[10px] font-black uppercase rounded-lg border ${
                      currentStatus === 'DELIVERED' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                      currentStatus === 'ON THE WAY' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                      'bg-orange-500/10 text-orange-400 border-orange-500/20'
                    }`}>
                      {currentStatus}
                    </div>
                  </div>

                  <div className="flex-1 mb-4">
                    <p className="text-xs font-black uppercase tracking-wider text-gray-500 mb-2">Items</p>
                    <div className="space-y-1">
                      {order.items?.map((item, idx) => (
                        <span key={idx} className="text-xs font-bold text-gray-300 bg-gray-800 px-2 py-1.5 rounded-lg inline-block mr-1 mb-1">
                          {item}
                        </span>
                      ))}
                    </div>
                    <p className="text-lg font-black text-white mt-3">₹{order.totalAmount}</p>
                  </div>

                  <div className="mt-auto grid grid-cols-2 gap-2">
                    {(currentStatus === 'PREPARING' || currentStatus === 'PENDING') && (
                      <button onClick={() => handleAutoAssign(order.id)} className="col-span-2 bg-blue-600 hover:bg-blue-500 text-white py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition flex items-center justify-center gap-2">
                        <Truck size={14} /> Assign & Dispatch
                      </button>
                    )}
                    {currentStatus === 'ON THE WAY' && (
                      <button onClick={() => handleUpdateStatus(order.id, 'DELIVERED')} className="col-span-2 bg-green-600 hover:bg-green-500 text-white py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition flex items-center justify-center gap-2">
                        <CheckCircle2 size={14} /> Mark Delivered
                      </button>
                    )}
                    {currentStatus === 'DELIVERED' && (
                      <div className="col-span-2 text-center py-2.5 text-gray-500 text-xs font-black uppercase tracking-wider bg-gray-800/50 rounded-xl border border-gray-800">
                        ✓ Complete
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {activeView === 'place-order' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-900 rounded-2xl p-8 border border-gray-800 max-w-2xl"
          >
            <h3 className="text-xl font-black text-white mb-2">Place a Demo Order</h3>
            <p className="text-gray-500 text-sm mb-6">Quickly create test orders without going through the checkout flow.</p>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-black text-gray-400 uppercase tracking-wider mb-2">Restaurant</label>
                <select
                  value={demoOrder.restaurantName}
                  onChange={(e) => setDemoOrder({ ...demoOrder, restaurantName: e.target.value })}
                  className="w-full bg-gray-800 text-white border border-gray-700 px-4 py-3 rounded-xl text-sm font-bold focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-none"
                >
                  <option value="">Select restaurant</option>
                  {restaurants.map(r => (
                    <option key={r.id} value={r.name}>{r.name} ({r.city})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-black text-gray-400 uppercase tracking-wider mb-2">Items (comma-separated)</label>
                <input
                  type="text"
                  value={demoOrder.items}
                  onChange={(e) => setDemoOrder({ ...demoOrder, items: e.target.value })}
                  placeholder="e.g. Chicken Biryani, Mirchi ka Salan"
                  className="w-full bg-gray-800 text-white border border-gray-700 px-4 py-3 rounded-xl text-sm font-bold focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-none placeholder-gray-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black text-gray-400 uppercase tracking-wider mb-2">Total Amount (₹)</label>
                  <input
                    type="number"
                    value={demoOrder.totalAmount}
                    onChange={(e) => setDemoOrder({ ...demoOrder, totalAmount: e.target.value })}
                    placeholder="450"
                    className="w-full bg-gray-800 text-white border border-gray-700 px-4 py-3 rounded-xl text-sm font-bold focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-none placeholder-gray-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-black text-gray-400 uppercase tracking-wider mb-2">Payment</label>
                  <select
                    value={demoOrder.paymentMethod}
                    onChange={(e) => setDemoOrder({ ...demoOrder, paymentMethod: e.target.value })}
                    className="w-full bg-gray-800 text-white border border-gray-700 px-4 py-3 rounded-xl text-sm font-bold focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-none"
                  >
                    <option value="cod">Cash on Delivery</option>
                    <option value="upi">UPI</option>
                    <option value="card">Card</option>
                  </select>
                </div>
              </div>

              <button
                onClick={handlePlaceDemoOrder}
                className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white py-4 rounded-xl font-black text-sm uppercase tracking-wider transition flex items-center justify-center gap-2 shadow-lg shadow-orange-500/20"
              >
                <Plus size={18} /> Place Demo Order
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
