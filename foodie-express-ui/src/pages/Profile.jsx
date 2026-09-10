import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { User, Mail, Shield, Package, Heart, MapPin, Settings, LogOut, ChevronRight, Edit3, Plus, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

const Profile = () => {
  const { user, logoutUser } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');
  const [addresses, setAddresses] = useState(() => {
    const saved = localStorage.getItem('foodie_addresses');
    return saved ? JSON.parse(saved) : [
      { id: 1, label: 'Home', address: '123, MG Road, Near City Park', city: 'Hyderabad', isDefault: true },
      { id: 2, label: 'Office', address: '456, Tech Park, HITECH City', city: 'Hyderabad', isDefault: false },
    ];
  });
  const [newAddress, setNewAddress] = useState({ label: '', address: '', city: '' });
  const [showAddAddress, setShowAddAddress] = useState(false);

  const displayName = user?.name || user?.email?.split('@')[0] || 'Foodie';
  const displayEmail = user?.email || 'user@example.com';

  const handleAddAddress = (e) => {
    e.preventDefault();
    if (!newAddress.label || !newAddress.address || !newAddress.city) {
      toast.error('Please fill all fields');
      return;
    }
    const updated = [...addresses, { ...newAddress, id: Date.now(), isDefault: false }];
    setAddresses(updated);
    localStorage.setItem('foodie_addresses', JSON.stringify(updated));
    setNewAddress({ label: '', address: '', city: '' });
    setShowAddAddress(false);
    toast.success('Address added!');
  };

  const handleDeleteAddress = (id) => {
    const updated = addresses.filter(a => a.id !== id);
    setAddresses(updated);
    localStorage.setItem('foodie_addresses', JSON.stringify(updated));
    toast.success('Address removed');
  };

  const handleSetDefault = (id) => {
    const updated = addresses.map(a => ({ ...a, isDefault: a.id === id }));
    setAddresses(updated);
    localStorage.setItem('foodie_addresses', JSON.stringify(updated));
    toast.success('Default address updated');
  };

  const handleLogout = () => {
    logoutUser();
    toast.success('Logged out!');
    navigate('/');
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'addresses', label: 'Addresses', icon: MapPin },
    { id: 'favorites', label: 'Favorites', icon: Heart },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  if (!user) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center bg-gray-50 p-4">
        <User size={64} className="text-gray-200 mb-4" />
        <h2 className="text-2xl font-black text-gray-800 mb-2">Not logged in</h2>
        <p className="text-gray-500 mb-6">Please login to view your profile</p>
        <Link to="/login" className="bg-orange-500 text-white px-8 py-3 rounded-2xl font-black hover:bg-orange-600 transition no-underline">
          Login Now
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen pb-20 md:pb-0">
      {/* Header */}
      <div className="bg-gradient-to-br from-orange-500 via-red-500 to-pink-500 text-white py-12 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center text-4xl border-2 border-white/30">
              {displayName.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="text-3xl font-black">{displayName}</h1>
              <p className="text-white/70 font-medium">{displayEmail}</p>
              {user.role === 'ROLE_ADMIN' && (
                <span className="inline-flex items-center gap-1 bg-white/20 text-xs font-black px-3 py-1 rounded-full mt-2">
                  <Shield size={12} /> Admin
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 -mt-6 relative z-10">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          {/* Tabs */}
          <div className="flex border-b overflow-x-auto scrollbar-hide">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-4 text-sm font-bold whitespace-nowrap transition border-b-2 ${
                    activeTab === tab.id
                      ? 'border-orange-500 text-orange-600 bg-orange-50/50'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Icon size={16} />
                  {tab.label}
                </button>
              );
            })}
          </div>

          <div className="p-6 md:p-8">
            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gray-50 rounded-2xl p-6">
                    <label className="text-xs font-black text-gray-400 uppercase tracking-wider mb-2 block">Full Name</label>
                    <p className="text-lg font-bold text-gray-800">{displayName}</p>
                  </div>
                  <div className="bg-gray-50 rounded-2xl p-6">
                    <label className="text-xs font-black text-gray-400 uppercase tracking-wider mb-2 block">Email</label>
                    <p className="text-lg font-bold text-gray-800">{displayEmail}</p>
                  </div>
                  <div className="bg-gray-50 rounded-2xl p-6">
                    <label className="text-xs font-black text-gray-400 uppercase tracking-wider mb-2 block">Role</label>
                    <p className="text-lg font-bold text-gray-800">{user.role === 'ROLE_ADMIN' ? '👑 Admin' : '🍽️ Customer'}</p>
                  </div>
                  <div className="bg-gray-50 rounded-2xl p-6">
                    <label className="text-xs font-black text-gray-400 uppercase tracking-wider mb-2 block">Member Since</label>
                    <p className="text-lg font-bold text-gray-800">2026</p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <Link to="/orders" className="bg-orange-50 rounded-2xl p-4 text-center hover:bg-orange-100 transition no-underline">
                    <Package size={24} className="text-orange-500 mx-auto mb-2" />
                    <span className="text-xs font-black text-gray-700">My Orders</span>
                  </Link>
                  <button className="bg-red-50 rounded-2xl p-4 text-center hover:bg-red-100 transition">
                    <Heart size={24} className="text-red-500 mx-auto mb-2" />
                    <span className="text-xs font-black text-gray-700">Favorites</span>
                  </button>
                  <button onClick={handleLogout} className="bg-gray-100 rounded-2xl p-4 text-center hover:bg-gray-200 transition">
                    <LogOut size={24} className="text-gray-500 mx-auto mb-2" />
                    <span className="text-xs font-black text-gray-700">Logout</span>
                  </button>
                </div>
              </motion.div>
            )}

            {/* Addresses Tab */}
            {activeTab === 'addresses' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-black text-gray-800">Saved Addresses</h3>
                  <button
                    onClick={() => setShowAddAddress(!showAddAddress)}
                    className="bg-orange-500 text-white px-4 py-2 rounded-xl text-xs font-black flex items-center gap-1 hover:bg-orange-600 transition"
                  >
                    <Plus size={14} /> Add New
                  </button>
                </div>

                {showAddAddress && (
                  <motion.form
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    onSubmit={handleAddAddress}
                    className="bg-orange-50 border border-orange-100 rounded-2xl p-6 space-y-3"
                  >
                    <input
                      type="text"
                      placeholder="Label (e.g., Home, Office)"
                      value={newAddress.label}
                      onChange={(e) => setNewAddress({ ...newAddress, label: e.target.value })}
                      className="w-full px-4 py-3 bg-white border border-orange-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-orange-200"
                      required
                    />
                    <textarea
                      placeholder="Full address"
                      value={newAddress.address}
                      onChange={(e) => setNewAddress({ ...newAddress, address: e.target.value })}
                      className="w-full px-4 py-3 bg-white border border-orange-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-orange-200 h-20 resize-none"
                      required
                    />
                    <input
                      type="text"
                      placeholder="City"
                      value={newAddress.city}
                      onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                      className="w-full px-4 py-3 bg-white border border-orange-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-orange-200"
                      required
                    />
                    <div className="flex gap-2">
                      <button type="submit" className="bg-orange-500 text-white px-6 py-2 rounded-xl text-xs font-black hover:bg-orange-600 transition">
                        Save Address
                      </button>
                      <button type="button" onClick={() => setShowAddAddress(false)} className="bg-gray-100 text-gray-600 px-6 py-2 rounded-xl text-xs font-black hover:bg-gray-200 transition">
                        Cancel
                      </button>
                    </div>
                  </motion.form>
                )}

                {addresses.map((addr) => (
                  <div key={addr.id} className={`bg-white rounded-2xl p-5 border-2 transition ${
                    addr.isDefault ? 'border-orange-200 bg-orange-50/30' : 'border-gray-100 hover:border-gray-200'
                  }`}>
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <div className={`p-2 rounded-xl ${addr.isDefault ? 'bg-orange-100 text-orange-500' : 'bg-gray-100 text-gray-400'}`}>
                          <MapPin size={20} />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-black text-gray-800">{addr.label}</span>
                            {addr.isDefault && (
                              <span className="bg-orange-100 text-orange-600 text-[10px] font-black px-2 py-0.5 rounded-full">DEFAULT</span>
                            )}
                          </div>
                          <p className="text-sm text-gray-500 mt-1">{addr.address}</p>
                          <p className="text-xs text-gray-400 mt-0.5">{addr.city}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        {!addr.isDefault && (
                          <button
                            onClick={() => handleSetDefault(addr.id)}
                            className="text-xs font-bold text-orange-500 hover:text-orange-600 transition px-2 py-1 rounded-lg hover:bg-orange-50"
                          >
                            Set Default
                          </button>
                        )}
                        <button
                          onClick={() => handleDeleteAddress(addr.id)}
                          className="text-gray-400 hover:text-red-500 transition p-1 rounded-lg hover:bg-red-50"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </motion.div>
            )}

            {/* Favorites Tab */}
            {activeTab === 'favorites' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
                <Heart size={64} className="text-gray-200 mx-auto mb-4" />
                <h3 className="text-xl font-black text-gray-800 mb-2">No favorites yet</h3>
                <p className="text-gray-500 text-sm mb-6">Start browsing and heart your favorite restaurants!</p>
                <Link to="/explore" className="bg-orange-500 text-white px-8 py-3 rounded-2xl font-black hover:bg-orange-600 transition no-underline">
                  Explore Restaurants
                </Link>
              </motion.div>
            )}

            {/* Settings Tab */}
            {activeTab === 'settings' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                <h3 className="font-black text-gray-800 mb-4">Account Settings</h3>
                {[
                  { label: 'Edit Profile', icon: Edit3, color: 'text-blue-500 bg-blue-50' },
                  { label: 'Change Password', icon: Shield, color: 'text-green-500 bg-green-50' },
                  { label: 'Notification Settings', icon: Settings, color: 'text-purple-500 bg-purple-50' },
                  { label: 'Payment Methods', icon: Mail, color: 'text-orange-500 bg-orange-50' },
                ].map((item) => (
                  <button
                    key={item.label}
                    className="w-full flex items-center justify-between p-4 bg-white border border-gray-100 rounded-2xl hover:shadow-md transition text-left"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-xl ${item.color}`}>
                        <item.icon size={20} />
                      </div>
                      <span className="font-bold text-gray-800">{item.label}</span>
                    </div>
                    <ChevronRight size={16} className="text-gray-400" />
                  </button>
                ))}

                <div className="mt-8 pt-6 border-t">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center gap-2 py-4 bg-red-50 text-red-600 rounded-2xl font-black hover:bg-red-100 transition"
                  >
                    <LogOut size={18} /> Sign Out
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
