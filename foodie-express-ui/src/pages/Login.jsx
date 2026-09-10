import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { Utensils, Mail, Lock, ArrowRight, Loader, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/api';
import toast from 'react-hot-toast';

const Login = () => {
  const navigate = useNavigate();
  const { loginUser } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [showForgot, setShowForgot] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await authService.login(credentials);
      loginUser(response.data);
      toast.success("Welcome back to Foodie Express! 🍔");
      navigate('/');
    } catch (error) {
      console.error("Login Error:", error);
      toast.error("Invalid email or password. Please try again.");
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
          <div className="absolute top-10 right-10 text-[100px] opacity-10">🍔</div>
          <div className="relative z-10">
            <div className="bg-white/20 p-3 rounded-2xl w-fit mb-6 backdrop-blur-sm">
              <Utensils size={32} />
            </div>
            <h2 className="text-4xl font-black mb-4 leading-tight">Welcome Back!</h2>
            <p className="text-orange-100 font-medium leading-relaxed mb-8">
              Login to access your saved addresses, track your current orders, and quickly reorder your favorites.
            </p>
            <div className="space-y-3 mt-auto">
              {['Track orders in real-time', 'Save favorite restaurants', 'Exclusive member offers'].map((feature) => (
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
          <div className="mb-8 md:hidden">
            <Link to="/" className="text-2xl font-extrabold text-orange-600 flex items-center gap-2 no-underline">
              <Utensils size={24} /> Foodie Express
            </Link>
          </div>
          
          <h2 className="text-2xl font-black text-gray-900 mb-2">Sign In</h2>
          <p className="text-gray-500 text-sm mb-8 font-medium">Enter your email and password to access your account.</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Email Address</label>
              <div className="relative">
                <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input 
                  type="email" name="email" required value={credentials.email} onChange={handleChange}
                  className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition outline-none text-gray-800 font-medium"
                  placeholder="john@example.com"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">Password</label>
                <button type="button" onClick={() => { setForgotEmail(credentials.email); setShowForgot(true); }} className="text-xs font-bold text-orange-500 hover:text-orange-600 transition">Forgot?</button>
              </div>
              <div className="relative">
                <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input 
                  type={showPassword ? 'text' : 'password'} name="password" required value={credentials.password} onChange={handleChange}
                  className="w-full pl-11 pr-12 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition outline-none text-gray-800 font-medium"
                  placeholder="••••••••"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button 
              type="submit" disabled={isLoading}
              className="w-full mt-6 bg-orange-500 text-white font-black py-4 rounded-xl hover:bg-orange-600 transition flex justify-center items-center gap-2 shadow-lg shadow-orange-200 disabled:bg-gray-400 disabled:shadow-none"
            >
              {isLoading ? (
                <><Loader size={20} className="animate-spin" /> Authenticating...</>
              ) : (
                <>Login to Account <ArrowRight size={20} /></>
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-gray-500 text-sm font-medium">
              Don&apos;t have an account yet?{' '}
              <Link to="/register" className="text-orange-600 font-black hover:underline transition">Create one here</Link>
            </p>
          </div>
        </div>
      </motion.div>

      {showForgot && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setShowForgot(false)}>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="font-black text-gray-800 mb-1">Reset password</h3>
            <p className="text-xs text-gray-500 mb-4">Demo build — no emails are sent. To change a known password, use Profile → Change Password after login.</p>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!forgotEmail.includes('@')) {
                  toast.error('Enter a valid email');
                  return;
                }
                setShowForgot(false);
                toast.success(`If ${forgotEmail} exists, a reset link was sent (demo).`);
              }}
              className="space-y-3"
            >
              <input
                type="email"
                value={forgotEmail}
                onChange={(e) => setForgotEmail(e.target.value)}
                placeholder="you@email.com"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-orange-500"
                required
              />
              <div className="flex gap-2">
                <button className="flex-1 bg-orange-500 text-white py-3 rounded-xl text-xs font-black hover:bg-orange-600">Send reset link</button>
                <button type="button" onClick={() => setShowForgot(false)} className="px-5 py-3 bg-gray-100 rounded-xl text-xs font-black text-gray-600 hover:bg-gray-200">Cancel</button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Login;
