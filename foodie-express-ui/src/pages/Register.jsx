import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { Utensils, User, Mail, Lock, ArrowRight, Loader, Eye, EyeOff } from 'lucide-react';
import { authService } from '../services/api';
import toast from 'react-hot-toast';

const Register = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ fullName: '', email: '', password: '', confirmPassword: '', role: 'ROLE_USER' });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }
    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters long.");
      return;
    }
    setIsLoading(true);
    try {
      const payload = { name: formData.fullName, email: formData.email, password: formData.password, role: formData.role };
      await authService.register(payload);
      toast.success("Account created successfully! Please login. 🎉");
      navigate('/login');
    } catch (error) {
      const errorMsg = error.response?.data || error.response?.data?.message || "Registration failed. Please try again.";
      toast.error(typeof errorMsg === 'string' ? errorMsg : "Registration failed.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl w-full bg-white rounded-[2rem] shadow-xl border border-gray-100 overflow-hidden flex flex-col md:flex-row"
      >
        {/* Brand Panel */}
        <div className="md:w-5/12 bg-gradient-to-br from-orange-500 via-red-500 to-pink-500 p-10 text-white flex flex-col justify-center relative overflow-hidden hidden md:flex">
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>
          <div className="absolute bottom-10 left-10 text-[100px] opacity-10">🎉</div>
          <div className="relative z-10">
            <div className="bg-white/20 p-3 rounded-2xl w-fit mb-6 backdrop-blur-sm">
              <Utensils size={32} />
            </div>
            <h2 className="text-4xl font-black mb-4 leading-tight">Join the Foodie Family</h2>
            <p className="text-orange-100 font-medium leading-relaxed mb-8">
              Create an account to track your orders, save your favorite restaurants, and get exclusive delivery offers.
            </p>
            <div className="space-y-3 mt-auto">
              {['Free delivery on first order', 'Access to exclusive deals', '24/7 customer support'].map((feature) => (
                <div key={feature} className="flex items-center gap-2 text-sm text-white/80">
                  <div className="w-5 h-5 bg-white/20 rounded-full flex items-center justify-center text-[10px]">✓</div>
                  {feature}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="md:w-7/12 p-8 md:p-12">
          <div className="mb-6 md:hidden">
            <Link to="/" className="text-2xl font-extrabold text-orange-600 flex items-center gap-2 no-underline">
              <Utensils size={24} /> Foodie Express
            </Link>
          </div>
          
          <h2 className="text-2xl font-black text-gray-900 mb-2">Create an Account</h2>
          <p className="text-gray-500 text-sm mb-6 font-medium">Please fill in your details to get started.</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Full Name</label>
              <div className="relative">
                <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="text" name="fullName" required value={formData.fullName} onChange={handleChange}
                  className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition outline-none text-gray-800 font-medium"
                  placeholder="John Doe" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Email Address</label>
              <div className="relative">
                <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="email" name="email" required value={formData.email} onChange={handleChange}
                  className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition outline-none text-gray-800 font-medium"
                  placeholder="john@example.com" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Password</label>
                <div className="relative">
                  <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input type={showPassword ? 'text' : 'password'} name="password" required value={formData.password} onChange={handleChange}
                    className="w-full pl-11 pr-12 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition outline-none text-gray-800 font-medium"
                    placeholder="••••••••" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Confirm</label>
                <div className="relative">
                  <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input type="password" name="confirmPassword" required value={formData.confirmPassword} onChange={handleChange}
                    className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition outline-none text-gray-800 font-medium"
                    placeholder="••••••••" />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">I am a</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { value: 'ROLE_USER', label: 'Customer', emoji: '🍔' },
                  { value: 'ROLE_DELIVERY_PARTNER', label: 'Delivery Partner', emoji: '🛵' },
                  { value: 'ROLE_RESTAURANT_OWNER', label: 'Restaurant Owner', emoji: '🏪' },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setFormData({ ...formData, role: opt.value })}
                    className={`flex flex-col items-center gap-1 p-3 rounded-xl border-2 transition text-center ${
                      formData.role === opt.value
                        ? 'border-orange-500 bg-orange-50 text-orange-700'
                        : 'border-gray-200 bg-gray-50 text-gray-500 hover:border-gray-300'
                    }`}
                  >
                    <span className="text-xl">{opt.emoji}</span>
                    <span className="text-[10px] font-black uppercase tracking-wider">{opt.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <button type="submit" disabled={isLoading}
              className="w-full mt-4 bg-orange-500 text-white font-black py-4 rounded-xl hover:bg-orange-600 transition flex justify-center items-center gap-2 shadow-lg shadow-orange-200 disabled:bg-gray-400 disabled:shadow-none">
              {isLoading ? (
                <><Loader size={20} className="animate-spin" /> Creating Account...</>
              ) : (
                <>Sign Up <ArrowRight size={20} /></>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-500 text-sm font-medium">
              Already have an account?{' '}
              <Link to="/login" className="text-orange-600 font-black hover:underline transition">Login here</Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;
