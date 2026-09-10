import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Pencil, Trash2, Leaf, X, Utensils, DollarSign } from 'lucide-react';
import { restaurantService } from '../services/api';
import toast from 'react-hot-toast';

const MenuManager = ({ restaurantId, restaurantName }) => {
  const [menuItems, setMenuItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const [formData, setFormData] = useState({
    name: '', description: '', price: '', isVegetarian: true
  });

  useEffect(() => {
    if (restaurantId) fetchMenu();
  }, [restaurantId]);

  const fetchMenu = async () => {
    try {
      setIsLoading(true);
      const res = await restaurantService.getRestaurantById(restaurantId);
      setMenuItems(res.data.menu || []);
    } catch {
      toast.error("Failed to load menu");
    } finally {
      setIsLoading(false);
    }
  };

  const openAddModal = () => {
    setEditingItem(null);
    setFormData({ name: '', description: '', price: '', isVegetarian: true });
    setShowModal(true);
  };

  const openEditModal = (item) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      description: item.description || '',
      price: String(item.price),
      isVegetarian: item.isVegetarian
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.price) {
      toast.error("Name and price are required");
      return;
    }
    try {
      const payload = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        price: parseFloat(formData.price),
        isVegetarian: formData.isVegetarian
      };
      if (editingItem) {
        await restaurantService.updateMenuItem(restaurantId, editingItem.id, payload);
        toast.success("Item updated!");
      } else {
        await restaurantService.addMenuItem(restaurantId, payload);
        toast.success("Item added!");
      }
      setShowModal(false);
      fetchMenu();
    } catch {
      toast.error("Failed to save item");
    }
  };

  const handleDelete = async (itemId) => {
    if (!confirm("Delete this item?")) return;
    try {
      await restaurantService.deleteMenuItem(restaurantId, itemId);
      toast.success("Item deleted!");
      fetchMenu();
    } catch {
      toast.error("Failed to delete item");
    }
  };

  const totalRevenue = menuItems.reduce((s, i) => s + i.price, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-black text-gray-800">Menu Items</h3>
          <p className="text-sm text-gray-400 mt-1">{menuItems.length} items in {restaurantName}</p>
        </div>
        <button
          onClick={openAddModal}
          className="bg-orange-500 text-white px-5 py-2.5 rounded-xl text-sm font-black flex items-center gap-2 hover:bg-orange-600 transition shadow-lg shadow-orange-100"
        >
          <Plus size={16} /> Add Item
        </button>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="bg-white rounded-2xl p-5 animate-pulse">
              <div className="flex justify-between">
                <div className="flex-1">
                  <div className="h-4 w-1/3 bg-gray-200 rounded mb-2" />
                  <div className="h-3 w-1/2 bg-gray-100 rounded" />
                </div>
                <div className="h-8 w-20 bg-gray-100 rounded" />
              </div>
            </div>
          ))}
        </div>
      ) : menuItems.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-dashed border-gray-200">
          <Utensils size={40} className="mx-auto text-gray-300 mb-4" />
          <p className="text-gray-400 font-medium">No menu items yet. Add your first dish!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {menuItems.map((item) => (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-2xl p-4 border border-gray-100 hover:shadow-md transition flex items-start gap-3"
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                item.isVegetarian ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
              }`}>
                {item.isVegetarian ? <Leaf size={18} /> : <Utensils size={18} />}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-black text-gray-800 text-sm truncate">{item.name}</h4>
                <p className="text-xs text-gray-400 truncate mt-0.5">{item.description || 'No description'}</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="bg-orange-50 text-orange-600 px-2 py-0.5 rounded-lg text-xs font-black flex items-center gap-1">
                    <DollarSign size={10} />₹{item.price}
                  </span>
                  {item.isVegetarian && (
                    <span className="bg-green-50 text-green-600 px-2 py-0.5 rounded-lg text-[10px] font-black">VEG</span>
                  )}
                </div>
              </div>
              <div className="flex gap-1.5 flex-shrink-0">
                <button
                  onClick={() => openEditModal(item)}
                  className="p-2 rounded-xl hover:bg-blue-50 text-blue-500 transition"
                >
                  <Pencil size={14} />
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="p-2 rounded-xl hover:bg-red-50 text-red-400 transition"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-black text-gray-800">
                  {editingItem ? 'Edit Item' : 'Add New Item'}
                </h3>
                <button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-100 rounded-xl transition">
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-xs font-black text-gray-500 uppercase tracking-wider">Item Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full mt-1 bg-gray-50 border border-gray-200 px-4 py-3 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="e.g. Chicken Biryani"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-black text-gray-500 uppercase tracking-wider">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full mt-1 bg-gray-50 border border-gray-200 px-4 py-3 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
                    rows={2}
                    placeholder="Describe your dish..."
                  />
                </div>
                <div>
                  <label className="text-xs font-black text-gray-500 uppercase tracking-wider">Price (₹) *</label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full mt-1 bg-gray-50 border border-gray-200 px-4 py-3 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="e.g. 320"
                    min="1"
                    required
                  />
                </div>
                <div className="flex items-center gap-3">
                  <label className="text-xs font-black text-gray-500 uppercase tracking-wider">Type</label>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, isVegetarian: true })}
                      className={`px-4 py-2 rounded-xl text-xs font-black transition border-2 ${
                        formData.isVegetarian
                          ? 'border-green-500 bg-green-50 text-green-600'
                          : 'border-gray-200 text-gray-500 hover:border-gray-300'
                      }`}
                    >
                      <Leaf size={12} className="inline mr-1" /> Veg
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, isVegetarian: false })}
                      className={`px-4 py-2 rounded-xl text-xs font-black transition border-2 ${
                        !formData.isVegetarian
                          ? 'border-red-500 bg-red-50 text-red-600'
                          : 'border-gray-200 text-gray-500 hover:border-gray-300'
                      }`}
                    >
                      <Utensils size={12} className="inline mr-1" /> Non-Veg
                    </button>
                  </div>
                </div>
                <button
                  type="submit"
                  className="w-full bg-orange-500 text-white py-3 rounded-xl font-black hover:bg-orange-600 transition shadow-lg shadow-orange-200"
                >
                  {editingItem ? 'Update Item' : 'Add Item'}
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MenuManager;
