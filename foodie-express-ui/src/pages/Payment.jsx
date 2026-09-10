import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { orderService, paymentService } from '../services/api';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CreditCard, Smartphone, Building, Wallet, Banknote, ShieldCheck, Loader2, IndianRupee } from 'lucide-react';
import toast from 'react-hot-toast';

const Payment = () => {
  const { cart, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [activeMethod, setActiveMethod] = useState('upi');
  const [isProcessing, setIsProcessing] = useState(false);
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);

  useEffect(() => {
    if (document.getElementById('razorpay-script')) {
      setRazorpayLoaded(true);
      return;
    }
    const script = document.createElement('script');
    script.id = 'razorpay-script';
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => setRazorpayLoaded(true);
    script.onerror = () => toast.error('Failed to load payment gateway');
    document.body.appendChild(script);
    return () => {
      const existing = document.getElementById('razorpay-script');
      if (existing) document.body.removeChild(existing);
    };
  }, []);

  const groupedCart = cart.reduce((acc, item) => {
    let resGroup = acc.find(g => g.restaurantName === item.restaurantName);
    if (!resGroup) {
      resGroup = { restaurantName: item.restaurantName, city: item.city, items: [] };
      acc.push(resGroup);
    }
    let existingItem = resGroup.items.find(i => i.id === item.id);
    if (existingItem) existingItem.quantity += 1;
    else resGroup.items.push({ ...item, quantity: 1 });
    return acc;
  }, []);

  const itemTotal = cart.reduce((total, item) => total + item.price, 0);
  const totalDeliveryFee = groupedCart.length * 40;
  const grandTotal = itemTotal + totalDeliveryFee;

  if (cart.length === 0) {
    navigate('/cart');
    return null;
  }

  const placeOrderAfterPayment = async (razorpayOrderId, razorpayPaymentId, razorpaySignature) => {
    const restaurantNames = groupedCart.map(g => g.restaurantName).join(" & ");
    const formattedItems = groupedCart.flatMap(group =>
      group.items.map(item => `${item.quantity}x ${item.name}`)
    );

    await orderService.placeOrder({
      customerEmail: user.email,
      restaurantName: restaurantNames,
      items: formattedItems,
      totalAmount: grandTotal,
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
      paymentMethod: 'online',
    });

    toast.success(`Payment successful!`);
    clearCart();
    navigate('/order-success');
  };

  const handleOnlinePayment = async () => {
    setIsProcessing(true);

    try {
      const { data: orderData } = await paymentService.createOrder({
        amount: grandTotal * 100,
        currency: 'INR',
        receipt: `order_${Date.now()}`,
      });

      const isDemo = orderData.razorpayOrderId?.startsWith('demo_');

      if (isDemo) {
        await new Promise(resolve => setTimeout(resolve, 1500));
        await placeOrderAfterPayment(
          orderData.razorpayOrderId,
          'demo_pay_' + Date.now(),
          'demo_sig_' + Date.now()
        );
        return;
      }

      const options = {
        key: orderData.keyId,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'Foodie Express',
        description: 'Delicious food delivered to your door',
        order_id: orderData.razorpayOrderId,
        prefill: {
          name: user?.name || '',
          email: user?.email || '',
        },
        theme: { color: '#f97316' },
        handler: async function (response) {
          try {
            await placeOrderAfterPayment(
              response.razorpay_order_id,
              response.razorpay_payment_id,
              response.razorpay_signature
            );
          } catch {
            toast.error('Order placement failed. Please contact support.');
            setIsProcessing(false);
          }
        },
        modal: {
          ondismiss: function () {
            setIsProcessing(false);
            toast.error('Payment cancelled');
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', function (response) {
        toast.error(`Payment failed: ${response.error.description}`);
        setIsProcessing(false);
      });
      rzp.open();
    } catch {
      toast.error('Failed to initialize payment. Please try again.');
      setIsProcessing(false);
    }
  };

  const handleCOD = async () => {
    setIsProcessing(true);

    try {
      const restaurantNames = groupedCart.map(g => g.restaurantName).join(" & ");
      const formattedItems = groupedCart.flatMap(group =>
        group.items.map(item => `${item.quantity}x ${item.name}`)
      );

      await orderService.placeOrder({
        customerEmail: user.email,
        restaurantName: restaurantNames,
        items: formattedItems,
        totalAmount: grandTotal,
        paymentMethod: 'cod',
      });

      toast.success(`Order placed! Pay ₹${grandTotal} at delivery`);
      clearCart();
      navigate('/order-success');
    } catch {
      toast.error('Failed to place order. Please try again.');
      setIsProcessing(false);
    }
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();

    if (activeMethod === 'cod') {
      await handleCOD();
    } else {
      if (!razorpayLoaded) {
        toast.error('Payment gateway is still loading. Please wait.');
        return;
      }
      await handleOnlinePayment();
    }
  };

  const paymentMethods = [
    { id: 'upi', name: 'UPI', icon: <Smartphone size={20} />, description: 'Google Pay, PhonePe, Paytm' },
    { id: 'card', name: 'Credit / Debit Card', icon: <CreditCard size={20} />, description: 'Visa, Mastercard, RuPay' },
    { id: 'netbanking', name: 'Netbanking', icon: <Building size={20} />, description: 'All major Indian banks' },
    { id: 'wallet', name: 'Wallets', icon: <Wallet size={20} />, description: 'Amazon Pay, MobiKwik' },
    { id: 'cod', name: 'Cash on Delivery', icon: <IndianRupee size={20} />, description: 'Pay at your doorstep' },
  ];

  return (
    <div className="bg-gray-50 min-h-screen py-10 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <ShieldCheck className="text-green-500" size={32} />
          <h1 className="text-3xl font-black text-gray-900">Secure Payment</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

          <div className="md:col-span-1 bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden h-fit">
            <div className="bg-gray-50 p-4 border-b border-gray-100">
              <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Payment Options</p>
            </div>
            <div className="flex flex-col">
              {paymentMethods.map((method) => (
                <button
                  key={method.id}
                  onClick={() => setActiveMethod(method.id)}
                  className={`flex items-center gap-4 p-4 text-left transition-colors border-l-4 ${
                    activeMethod === method.id
                    ? 'border-orange-500 bg-orange-50/50 text-orange-600'
                    : 'border-transparent hover:bg-gray-50 text-gray-600'
                  }`}
                >
                  <div className={activeMethod === method.id ? 'text-orange-500' : 'text-gray-400'}>
                    {method.icon}
                  </div>
                  <div>
                    <p className="font-bold text-sm">{method.name}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="md:col-span-2">
            <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100">
              <div className="flex justify-between items-center mb-8 pb-4 border-b border-gray-100">
                <h2 className="text-xl font-black text-gray-800">
                  {paymentMethods.find(m => m.id === activeMethod)?.name}
                </h2>
                <div className="text-right">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Amount to Pay</p>
                  <p className="text-2xl font-black text-gray-900">₹{grandTotal}</p>
                </div>
              </div>

              <form onSubmit={handlePaymentSubmit}>

                {activeMethod === 'upi' && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                    <label className="block text-sm font-bold text-gray-700 mb-2">Enter your UPI ID</label>
                    <input
                      type="text"
                      placeholder="e.g. 9876543210@ybl"
                      required
                      className="w-full bg-gray-50 border border-gray-200 p-4 rounded-xl font-medium focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition"
                    />
                    <p className="text-xs text-gray-400">A payment request will be sent to your UPI app.</p>
                  </motion.div>
                )}

                {activeMethod === 'card' && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Card Number</label>
                      <input type="text" placeholder="XXXX XXXX XXXX XXXX" required maxLength="19" className="w-full bg-gray-50 border border-gray-200 p-4 rounded-xl font-bold tracking-widest focus:outline-none focus:border-orange-500 transition" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Expiry</label>
                        <input type="text" placeholder="MM/YY" required className="w-full bg-gray-50 border border-gray-200 p-4 rounded-xl font-bold focus:outline-none focus:border-orange-500 transition" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">CVV</label>
                        <input type="password" placeholder="***" required maxLength="3" className="w-full bg-gray-50 border border-gray-200 p-4 rounded-xl font-bold focus:outline-none focus:border-orange-500 transition" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Name on Card</label>
                      <input type="text" placeholder="John Doe" required className="w-full bg-gray-50 border border-gray-200 p-4 rounded-xl font-bold focus:outline-none focus:border-orange-500 transition" />
                    </div>
                  </motion.div>
                )}

                {activeMethod === 'netbanking' && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                    <label className="block text-sm font-bold text-gray-700 mb-2">Select your Bank</label>
                    <select className="w-full bg-gray-50 border border-gray-200 p-4 rounded-xl font-medium focus:outline-none focus:border-orange-500 transition appearance-none">
                      <option>HDFC Bank</option>
                      <option>State Bank of India (SBI)</option>
                      <option>ICICI Bank</option>
                      <option>Axis Bank</option>
                      <option>Kotak Mahindra Bank</option>
                    </select>
                  </motion.div>
                )}

                {activeMethod === 'wallet' && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-2 gap-4">
                     {['Amazon Pay', 'MobiKwik', 'Paytm', 'PhonePe'].map((wallet) => (
                       <label key={wallet} className="border border-gray-200 p-4 rounded-xl flex items-center gap-3 cursor-pointer hover:border-orange-500 transition has-[:checked]:bg-orange-50 has-[:checked]:border-orange-500">
                         <input type="radio" name="wallet" value={wallet} required className="text-orange-500" />
                         <span className="font-bold text-sm text-gray-700">{wallet}</span>
                       </label>
                     ))}
                  </motion.div>
                )}

                {activeMethod === 'cod' && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-orange-50 border border-orange-100 p-6 rounded-2xl text-center">
                    <Banknote size={40} className="text-orange-500 mx-auto mb-4" />
                    <h3 className="font-black text-gray-800 mb-2">Pay with Cash</h3>
                    <p className="text-sm text-gray-600 font-medium">Please keep exact change of ₹{grandTotal} ready for the delivery executive.</p>
                  </motion.div>
                )}

                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full mt-8 bg-green-500 text-white py-4 rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-green-600 transition shadow-lg shadow-green-200 flex justify-center items-center gap-2 disabled:bg-gray-400 disabled:shadow-none"
                >
                  {isProcessing ? (
                    <><Loader2 className="animate-spin" size={20} /> Processing...</>
                  ) : (
                    `Pay ₹${grandTotal}`
                  )}
                </button>
              </form>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Payment;