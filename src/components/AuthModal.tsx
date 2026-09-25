import React, { useState } from 'react';
import { X, Smartphone, Lock, User, Mail, AlertCircle } from 'lucide-react';
import { useAuth } from '../services/authContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: 'en' | 'np';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  language
}) => {
  const { login, signup, loginWithGoogle } = useAuth();

  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleGoogleAuth = async () => {
    setErrorMsg('');
    setGoogleLoading(true);
    try {
      await loginWithGoogle();
      onClose();
    } catch (err: any) {
      console.error('Google Sign-in error:', err);
      if (err.code === 'auth/popup-closed-by-user') {
        setErrorMsg('Sign-in cancelled. Please try again.');
      } else if (err.code === 'auth/popup-blocked') {
        setErrorMsg('Popup was blocked by browser. Please allow popups for Google login.');
      } else {
        setErrorMsg(err.message || 'Google sign-in failed. Please try again.');
      }
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      if (mode === 'login') {
        await login(email, password);
      } else {
        if (!name.trim()) throw new Error('Please enter your full name');
        if (password.length < 6) throw new Error('Password must be at least 6 characters');
        await signup(email, password, name, phone);
      }
      onClose();
    } catch (err: any) {
      console.error('Firebase Auth error:', err);
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password' || err.code === 'auth/user-not-found') {
        setErrorMsg('Invalid email or password. Please check your credentials.');
      } else if (err.code === 'auth/email-already-in-use') {
        setErrorMsg('An account with this email already exists. Please sign in.');
      } else if (err.code === 'auth/weak-password') {
        setErrorMsg('Password should be at least 6 characters.');
      } else if (err.code === 'auth/invalid-email') {
        setErrorMsg('Please enter a valid email address.');
      } else {
        setErrorMsg(err.message || 'Authentication failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-md w-full overflow-hidden shadow-2xl relative border border-gray-100">
        
        {/* Header */}
        <div className="p-6 pb-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#F85606] text-white flex items-center justify-center font-black text-sm shadow-xs">
              N
            </div>
            <div>
              <h3 className="text-base font-bold text-gray-900">
                {mode === 'login' 
                  ? (language === 'en' ? 'Sign in to NepalMart' : 'नेपालमार्टमा लगइन गर्नुहोस्')
                  : (language === 'en' ? 'Create NepalMart Account' : 'नयाँ खाता खोल्नुहोस्')}
              </h3>
              <p className="text-xs text-gray-500">
                {mode === 'login' 
                  ? 'Access your orders, wishlist & fast checkout' 
                  : 'Join thousands of happy shoppers across Nepal'}
              </p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="w-8 h-8 rounded-full hover:bg-gray-200 flex items-center justify-center text-gray-500 cursor-pointer transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 pt-4 space-y-4">
          {errorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-lg flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* 1-Click Google Sign-in */}
          <div>
            <button
              type="button"
              onClick={handleGoogleAuth}
              disabled={googleLoading || loading}
              className="w-full bg-white hover:bg-gray-50 text-gray-800 border border-gray-300 hover:border-gray-400 py-2.5 px-4 rounded-xl font-semibold text-xs sm:text-sm shadow-2xs transition-all flex items-center justify-center gap-3 cursor-pointer disabled:opacity-50"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>{googleLoading ? 'Connecting to Google...' : `Continue with Google (${mode === 'login' ? 'Sign In' : 'Sign Up'})`}</span>
            </button>
          </div>

          <div className="flex items-center gap-3 text-xs text-gray-400">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="font-semibold uppercase tracking-wider text-[10px]">or with email</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3.5">
            {mode === 'signup' && (
              <>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Full Name *</label>
                  <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2.5 focus-within:border-[#F85606] focus-within:ring-1 focus-within:ring-[#F85606]">
                    <User className="w-4 h-4 text-gray-400 mr-2 shrink-0" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter your full name"
                      className="w-full text-xs outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Mobile Phone (Nepal)</label>
                  <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2.5 focus-within:border-[#F85606] focus-within:ring-1 focus-within:ring-[#F85606]">
                    <Smartphone className="w-4 h-4 text-gray-400 mr-2 shrink-0" />
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="98XXXXXXXX"
                      className="w-full text-xs outline-none"
                    />
                  </div>
                </div>
              </>
            )}

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Email Address *</label>
              <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2.5 focus-within:border-[#F85606] focus-within:ring-1 focus-within:ring-[#F85606]">
                <Mail className="w-4 h-4 text-gray-400 mr-2 shrink-0" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="youremail@example.com"
                  className="w-full text-xs outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Password *</label>
              <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2.5 focus-within:border-[#F85606] focus-within:ring-1 focus-within:ring-[#F85606]">
                <Lock className="w-4 h-4 text-gray-400 mr-2 shrink-0" />
                <input
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  className="w-full text-xs outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || googleLoading}
              className="w-full bg-[#F85606] hover:bg-[#d94800] text-white py-3 rounded-lg font-bold text-xs sm:text-sm shadow-md transition-colors cursor-pointer mt-2 disabled:opacity-50"
            >
              {loading ? 'Authenticating...' : mode === 'login' ? 'SIGN IN WITH EMAIL' : 'CREATE ACCOUNT WITH EMAIL'}
            </button>
          </form>

          {/* Switch Login / Sign Up */}
          <div className="text-center text-xs text-gray-600 border-t border-gray-100 pt-3 space-y-2">
            {mode === 'login' ? (
              <p>
                New to NepalMart?{' '}
                <button
                  type="button"
                  onClick={() => { setMode('signup'); setErrorMsg(''); }}
                  className="text-[#F85606] font-bold hover:underline cursor-pointer"
                >
                  Sign Up Here
                </button>
              </p>
            ) : (
              <p>
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => { setMode('login'); setErrorMsg(''); }}
                  className="text-[#F85606] font-bold hover:underline cursor-pointer"
                >
                  Sign In
                </button>
              </p>
            )}

            {/* Firebase Status Badge */}
            <div className="pt-2 border-t border-gray-100 flex items-center justify-center text-[11px] text-gray-400">
              <span className="flex items-center gap-1.5 font-mono text-[11px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                Firebase: nepalmart secure auth
              </span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
