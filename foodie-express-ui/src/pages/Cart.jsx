import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { Trash2, ShoppingBag, ArrowRight, Plus, Minus, MapPin, Info, Tag, Clock, X, Coins } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const promoCodes = {
  'WELCOME50': { discount: 50, type: 'flat', minOrder: 199, description: 'Flat ₹50 off on first order' },
  'FOODIE20': { discount: 20, type: 'percent', maxDiscount: 150, minOrder: 299, description: '20% off up to ₹150' },
  'FREEDEL': { discount: 40, type: 'delivery', minOrder: 149, description: 'Free delivery on orders above ₹149' },
  'HUNGRY30': { discount: 30, type: 'flat', minOrder: 399, description: 'Flat ₹30 off' },
};

const tipOptions = [0, 20, 30, 50, 100];

const Cart = () => {
  const { cart, clearCart, addToCart, removeOneFromCart, deleteItemTypeFromCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState(null);
  const [selectedTip, setSelectedTip] = useState(0);
  const [deliverySlot, setDeliverySlot] = useState('now');

  const groupedCart = cart.reduce((acc, item) => {
    let resGroup = acc.find(g => g.restaurantName === item.restaurantName);
    if (!resGroup) {
      resGroup = { restaurantName: item.restaurantName, city: item.city, items: [] };
      acc.push(resGroup);
    }
    let existingItem = resGroup.items.find(i => i.id === item.id);
    if (existingItem) {
      existingItem.quantity += 1;
      existingItem.totalPrice += item.price;
    } else {
      resGroup.items.push({ ...item, quantity: 1, totalPrice: item.price });
    }
    return acc;
  }, []);

  const itemTotal = cart.reduce((total, item) => total + item.price, 0);
  const deliveryFeePerRestaurant = 40;
  const totalDeliveryFee = groupedCart.length * deliveryFeePerRestaurant;
  const taxesAndCharges = Math.round(itemTotal * 0.05);
  const subtotal = itemTotal + totalDeliveryFee + taxesAndCharges;

  let discount = 0;
  if (appliedPromo) {
    const promo = promoCodes[appliedPromo];
    if (promo.type === 'flat') {
      discount = promo.discount;
    } else if (promo.type === 'percent') {
      discount = Math.min(Math.round(itemTotal * promo.discount / 100), promo.maxDiscount || Infinity);
    } else if (promo.type === 'delivery') {
      discount = totalDeliveryFee;
    }
  }

  const grandTotal = Math.max(subtotal - discount + selectedTip, 0);

  const handleApplyPromo = () => {
    const code = promoCode.toUpperCase().trim();
    const promo = promoCodes[code];
    if (!promo) {
      toast.error('Invalid promo code');
      return;
    }
    if (itemTotal < promo.minOrder) {
      toast.error(`Minimum order ₹${promo.minOrder} required`);
      return;
    }
    setAppliedPromo(code);
    toast.success(`Promo applied! ${promo.description}`);
  };

  const handleRemovePromo = () => {
    setAppliedPromo(null);
    setPromoCode('');
    toast('Promo removed', { icon: '🏷️' });
  };

  const handleCheckout = () => {
    if (!user) {
      toast.error("Please login first to proceed to payment!");
      navigate('/login');
      return;
    }
    if (cart.length === 0) return;
    navigate('/payment');
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center bg-gray-50 p-4">
        <div className="bg-orange-100 p-6 rounded-full mb-6">
          <ShoppingBag size={48} className="text-orange-500" />
        </div>
        <h2 className="text-2xl font-black text-gray-800">Your cart is empty</h2>
        <p className="text-gray-500 mt-2 font-medium text-center">Looks like you haven't added any food yet!</p>
        <Link to="/explore" className="mt-8 bg-orange-500 text-white px-8 py-3 rounded-2xl font-black hover:bg-orange-600 transition shadow-lg shadow-orange-200 no-underline">
          Browse Restaurants
        </Link>
      </div>
    );
  }

  const deliverySlots = [
    { id: 'now', label: 'Now', time: '30-45 min' },
    { id: 'later', label: 'Later', time: 'Choose time' },
  ];

  return (
    <div className="bg-gray-50 min-h-screen py-8 pb-32 md:pb-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-5">
          <div className="flex justify-between items-center mb-2">
            <h1 className="text-2xl md:text-3xl font-black text-gray-900 flex items-center gap-3">
              <ShoppingBag className="text-orange-500" /> Checkout
            </h1>
            <button 
              onClick={clearCart}
              className="flex items-center gap-2 text-red-500 text-sm font-bold hover:text-red-600 transition bg-red-50 px-3 py-1.5 rounded-xl"
            >
              <Trash2 size={14} /> Clear
            </button>
          </div>

          {/* Delivery Slot */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <div className="flex items-center gap-2 mb-3">
              <Clock size={16} className="text-orange-500" />
              <h3 className="font-black text-gray-800 text-sm">Delivery Time</h3>
            </div>
            <div className="flex gap-3">
              {deliverySlots.map((slot) => (
                <button
                  key={slot.id}
                  onClick={() => setDeliverySlot(slot.id)}
                  className={`flex-1 py-3 rounded-xl text-sm font-bold transition border-2 ${
                    deliverySlot === slot.id
                      ? 'border-orange-500 bg-orange-50 text-orange-600'
                      : 'border-gray-200 text-gray-500 hover:border-gray-300'
                  }`}
                >
                  <span className="block font-black">{slot.label}</span>
                  <span className="text-xs text-gray-400">{slot.time}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Multi-restaurant Warning */}
          {groupedCart.length > 1 && (
            <div className="bg-blue-50 border border-blue-100 p-4 rounded-2xl flex items-start gap-3">
              <Info className="text-blue-500 flex-shrink-0 mt-0.5" size={18} />
              <div>
                <h3 className="text-blue-800 font-bold text-sm">Multiple Deliveries Required</h3>
                <p className="text-blue-600 text-xs mt-1 font-medium">
                  Ordering from <span className="font-black">{groupedCart.length} restaurants</span>. 
                  ₹40 delivery fee charged per restaurant.
                </p>
              </div>
            </div>
          )}

          {/* Restaurant Groups */}
          {groupedCart.map((group, index) => (
            <div key={index} className="bg-white rounded-2xl p-5 md:p-6 shadow-sm border border-gray-100">
              <div className="flex items-center gap-2 mb-5 border-b pb-3">
                <MapPin size={18} className="text-orange-500" />
                <h2 className="font-black text-gray-800">{group.restaurantName}</h2>
                <span className="ml-auto bg-gray-100 text-gray-500 text-[10px] font-black px-2 py-1 rounded-lg uppercase">
                  Order {index + 1}
                </span>
              </div>

              <div className="space-y-4">
                {group.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center py-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        {item.isVegetarian !== undefined && (
                          <div className={`w-4 h-4 border-2 rounded-sm flex items-center justify-center flex-shrink-0 ${
                            item.isVegetarian ? 'border-green-500' : 'border-red-500'
                          }`}>
                            <div className={`w-1.5 h-1.5 rounded-full ${item.isVegetarian ? 'bg-green-500' : 'bg-red-500'}`} />
                          </div>
                        )}
                        <p className="font-bold text-gray-800 text-sm">{item.name}</p>
                      </div>
                      <p className="text-xs text-gray-400 mt-1 ml-6">₹{item.price} each</p>
                      
                      <div className="flex items-center gap-2 bg-orange-50 rounded-xl p-1 border border-orange-100 w-fit mt-2 ml-6">
                        <button 
                          onClick={() => removeOneFromCart(item.id)}
                          className="bg-white text-orange-600 hover:bg-orange-600 hover:text-white w-6 h-6 rounded-lg flex items-center justify-center font-bold transition shadow-sm"
                        >
                          <Minus size={12} />
                        </button>
                        <span className="font-black text-gray-800 w-4 text-center text-xs">{item.quantity}</span>
                        <button 
                          onClick={() => addToCart(item, group.restaurantName, group.city)}
                          className="bg-white text-orange-600 hover:bg-orange-600 hover:text-white w-6 h-6 rounded-lg flex items-center justify-center font-bold transition shadow-sm"
                        >
                          <Plus size={12} />
                        </button>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-2 ml-4">
                      <div className="font-black text-gray-800">₹{item.totalPrice}</div>
                      <button 
                        onClick={() => deleteItemTypeFromCart(item.id)}
                        className="text-red-400 hover:text-red-600 text-xs font-bold flex items-center gap-1 transition"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* Tip Driver */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <div className="flex items-center gap-2 mb-3">
              <Coins size={16} className="text-orange-500" />
              <h3 className="font-black text-gray-800 text-sm">Tip your delivery partner</h3>
            </div>
            <p className="text-xs text-gray-400 mb-3">Show appreciation for their service</p>
            <div className="flex gap-2">
              {tipOptions.map((tip) => (
                <button
                  key={tip}
                  onClick={() => setSelectedTip(tip)}
                  className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition border-2 ${
                    selectedTip === tip
                      ? 'border-orange-500 bg-orange-50 text-orange-600'
                      : 'border-gray-200 text-gray-500 hover:border-gray-300'
                  }`}
                >
                  {tip === 0 ? 'None' : `₹${tip}`}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Billing */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 sticky top-[100px]">
            <h2 className="text-lg font-black text-gray-800 mb-5 border-b pb-3">Bill Details</h2>
            
            {/* Promo Code */}
            <div className="mb-5">
              {appliedPromo ? (
                <div className="bg-green-50 border border-green-200 rounded-xl p-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Tag size={14} className="text-green-600" />
                    <div>
                      <span className="text-xs font-black text-green-700">{appliedPromo}</span>
                      <p className="text-[10px] text-green-600">{promoCodes[appliedPromo].description}</p>
                    </div>
                  </div>
                  <button onClick={handleRemovePromo} className="text-green-600 hover:text-red-500 transition">
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    placeholder="Enter promo code"
                    className="flex-1 bg-gray-50 border border-gray-200 px-3 py-2.5 rounded-xl text-sm font-medium focus:outline-none focus:border-orange-500 transition"
                  />
                  <button
                    onClick={handleApplyPromo}
                    disabled={!promoCode}
                    className="bg-orange-500 text-white px-4 py-2.5 rounded-xl text-xs font-black hover:bg-orange-600 transition disabled:bg-gray-300"
                  >
                    Apply
                  </button>
                </div>
              )}
              <p className="text-[10px] text-gray-400 mt-1.5">Try: WELCOME50, FOODIE20, FREEDEL</p>
            </div>
            
            <div className="space-y-3 text-sm font-medium text-gray-600">
              <div className="flex justify-between">
                <span>Item Total</span>
                <span className="font-bold text-gray-800">₹{itemTotal}</span>
              </div>
              
              <div className="flex justify-between">
                <span>Delivery Fee</span>
                <span className="font-bold text-gray-800">₹{totalDeliveryFee}</span>
              </div>

              <div className="flex justify-between">
                <span>Taxes & Charges</span>
                <span className="font-bold text-gray-800">₹{taxesAndCharges}</span>
              </div>

              {selectedTip > 0 && (
                <div className="flex justify-between">
                  <span>Driver Tip</span>
                  <span className="font-bold text-green-600">+₹{selectedTip}</span>
                </div>
              )}

              {discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Promo Discount</span>
                  <span className="font-bold">-₹{discount}</span>
                </div>
              )}

              <div className="flex justify-between pt-3 border-t border-dashed border-gray-200">
                <span className="font-black text-gray-800 text-lg">To Pay</span>
                <span className="font-black text-orange-600 text-2xl">₹{grandTotal}</span>
              </div>
            </div>

            <button 
              onClick={handleCheckout}
              className="w-full mt-6 bg-green-500 text-white py-4 rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-green-600 transition shadow-lg shadow-green-200 flex justify-center items-center gap-2"
            >
              Proceed to Payment <ArrowRight size={18} />
            </button>

            <p className="text-[10px] text-gray-400 text-center mt-3">
              Safe and secure payment powered by Razorpay
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
