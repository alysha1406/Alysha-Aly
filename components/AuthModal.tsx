
import React, { useState, useContext } from 'react';
import { X, Eye, EyeOff, CheckCircle } from 'lucide-react';
import { LanguageContext } from '../App';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { t } = useContext(LanguageContext);
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [showPassword, setShowPassword] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      onClose();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
        <button onClick={onClose} className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors text-slate-400">
          <X size={20} />
        </button>

        {isSuccess ? (
          <div className="p-12 text-center flex flex-col items-center">
            <CheckCircle size={64} className="text-green-500 mb-6 animate-bounce" />
            <h3 className="text-2xl font-bold mb-2">Welcome to Football Nova</h3>
            <p className="text-slate-500">Your account has been successfully verified.</p>
          </div>
        ) : (
          <div className="p-8">
            <div className="mb-8">
              <h2 className="text-3xl font-black uppercase tracking-tighter text-slate-900 mb-2">
                {mode === 'signin' ? 'Sign In' : 'Join Nova ID'}
              </h2>
              <p className="text-slate-500 text-sm">Access exclusive content and personalized football insights.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === 'signup' && (
                <input
                  type="text"
                  placeholder="Full Name"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:border-orange-500 transition-colors"
                  required
                />
              )}
              <input
                type="email"
                placeholder="Email Address"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:border-orange-500 transition-colors"
                required
              />
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Password"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:border-orange-500 transition-colors"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              {mode === 'signin' && (
                <div className="flex justify-between items-center text-xs font-semibold uppercase tracking-wider text-slate-500">
                  <label className="flex items-center gap-2 cursor-pointer hover:text-slate-900">
                    <input type="checkbox" className="accent-orange-500" />
                    Remember Me
                  </label>
                  <a href="#" className="hover:text-orange-500 transition-colors">Forgot Password?</a>
                </div>
              )}

              {mode === 'signup' && (
                <div className="flex flex-col space-y-4 pt-2">
                   <select className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:border-orange-500 transition-colors text-slate-500 text-sm">
                     <option>Select Country / Region</option>
                     <option>United Kingdom</option>
                     <option>Turkey</option>
                     <option>Brazil</option>
                     <option>Argentina</option>
                   </select>
                   <label className="flex items-start gap-3 text-xs text-slate-500 cursor-pointer">
                    <input type="checkbox" className="mt-0.5 accent-orange-500" required />
                    I agree to the Terms of Service and Privacy Policy.
                  </label>
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-slate-900 text-white font-bold py-4 rounded-lg hover:bg-orange-600 transition-all duration-300 uppercase tracking-widest mt-6"
              >
                {mode === 'signin' ? 'Sign In' : 'Create Account'}
              </button>
            </form>

            <div className="mt-8 pt-6 border-t border-gray-100 text-center">
              <button
                onClick={() => setMode(mode === 'signin' ? 'signup' : 'signin')}
                className="text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors uppercase tracking-wider"
              >
                {mode === 'signin' ? "Don't have an account? Join Now" : "Already a member? Sign In"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthModal;
