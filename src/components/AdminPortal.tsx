import React, { useState } from 'react';
import { ShieldCheck, Lock, User, ArrowLeft, AlertCircle, LogOut, Sparkles, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../services/authContext';
import { AdminPanel } from './AdminPanel';

interface AdminPortalProps {
  onExit: () => void;
  onProductsUpdated?: () => void;
}

export const AdminPortal: React.FC<AdminPortalProps> = ({ onExit, onProductsUpdated }) => {
  const { currentUser, userProfile, isAdmin, adminLogin, loginWithGoogle, logout } = useAuth();
  
  // Administrator login credentials
  const [username, setUsername] = useState('royrox845');
  const [password, setPassword] = useState('upesh123##$$657');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleAdminSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      await adminLogin(username, password);
    } catch (err: any) {
      console.error('Admin login error:', err);
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password' || err.code === 'auth/user-not-found') {
        setErrorMsg('Invalid administrator credentials.');
      } else {
        setErrorMsg(err.message || 'Failed to authenticate admin.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAdminGoogleSignIn = async () => {
    setErrorMsg('');
    setGoogleLoading(true);
    try {
      await loginWithGoogle();
    } catch (err: any) {
      console.error('Admin Google login error:', err);
      setErrorMsg(err.message || 'Google sign-in failed. Please try again.');
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleQuickDemoFill = () => {
    setUsername('royrox845');
    setPassword('upesh123##$$657');
  };

  // If already logged in and confirmed as Admin, show the Admin Management Dashboard
  if (currentUser && isAdmin) {
    return (
      <div className="min-h-screen bg-gray-100 flex flex-col">
        {/* Admin Portal Top Navigation Bar */}
        <div className="bg-gray-900 text-white px-4 sm:px-6 py-3 flex items-center justify-between shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#F85606] flex items-center justify-center font-black text-white text-base shadow-xs">
              N
            </div>
            <div>
              <h1 className="text-sm font-bold flex items-center gap-2">
                NepalMart Official Admin & Merchant Portal
                <span className="bg-emerald-500/20 text-emerald-300 text-[10px] px-2 py-0.5 rounded font-mono border border-emerald-500/30 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                  FIREBASE: nepalmart
                </span>
              </h1>
              <p className="text-[11px] text-gray-400">
                Logged in as: <strong className="text-gray-200">{userProfile?.displayName || userProfile?.username || currentUser.displayName || currentUser.email}</strong>
                <span className="ml-2 text-amber-400 font-semibold">[Role: Administrator]</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onExit}
              className="text-xs bg-gray-800 hover:bg-gray-700 text-gray-200 px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition border border-gray-700 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Return to Store
            </button>

            <button
              onClick={() => logout()}
              className="text-xs bg-rose-600/80 hover:bg-rose-600 text-white px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              Sign Out
            </button>
          </div>
        </div>

        {/* Embedded Admin Panel */}
        <div className="flex-1 p-2 sm:p-6 flex justify-center items-start">
          <AdminPanel
            isOpen={true}
            onClose={onExit}
            onProductsUpdated={onProductsUpdated}
          />
        </div>
      </div>
    );
  }

  // Otherwise, render the dedicated Admin Login Screen
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-950 to-neutral-900 flex flex-col justify-center items-center p-4">
      
      {/* Return to store top link */}
      <div className="w-full max-w-md mb-4 flex items-center justify-between text-xs text-gray-400">
        <button
          onClick={onExit}
          className="hover:text-white flex items-center gap-1 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to NepalMart Store
        </button>
        <span className="font-mono text-gray-400 bg-gray-800 px-2 py-0.5 rounded text-[11px] border border-gray-700">
          Firebase: nepalmart
        </span>
      </div>

      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border border-gray-200">
        
        {/* Header */}
        <div className="bg-[#F85606] text-white p-6 text-center relative">
          <div className="w-14 h-14 bg-white rounded-2xl mx-auto flex items-center justify-center text-[#F85606] shadow-lg mb-3">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold">NepalMart Admin Portal</h2>
          <p className="text-xs text-orange-100 mt-1">
            Realtime merchant control center (Firebase Project: nepalmart)
          </p>
        </div>

        {/* Form */}
        <div className="p-6 space-y-4">
          
          {errorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-lg flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* 1-Click Google Sign In for Admin */}
          <div>
            <button
              type="button"
              onClick={handleAdminGoogleSignIn}
              disabled={googleLoading || loading}
              className="w-full bg-white hover:bg-gray-50 text-gray-800 border border-gray-300 hover:border-gray-400 py-2.5 px-4 rounded-xl font-semibold text-xs sm:text-sm shadow-xs transition-all flex items-center justify-center gap-2.5 cursor-pointer disabled:opacity-50"
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
              <span>{googleLoading ? 'Connecting to Google...' : 'Sign in as Admin with Google'}</span>
            </button>
          </div>

          <div className="flex items-center my-3">
            <div className="flex-1 border-t border-gray-200"></div>
            <span className="px-3 text-[11px] text-gray-400 uppercase tracking-wider font-semibold">
              Or with Admin Credentials
            </span>
            <div className="flex-1 border-t border-gray-200"></div>
          </div>

          <form onSubmit={handleAdminSignIn} className="space-y-3.5">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold text-gray-700">
                  Admin Username or Email
                </label>
                <button
                  type="button"
                  onClick={handleQuickDemoFill}
                  className="text-[10px] text-[#F85606] hover:underline font-semibold flex items-center gap-0.5 cursor-pointer"
                >
                  <Sparkles className="w-3 h-3" /> Fill Default Credentials
                </button>
              </div>
              <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2.5 focus-within:border-[#F85606] focus-within:ring-1 focus-within:ring-[#F85606]">
                <User className="w-4 h-4 text-gray-400 mr-2 shrink-0" />
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="royrox845"
                  className="w-full text-xs outline-none text-gray-900"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Admin Password
              </label>
              <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2.5 focus-within:border-[#F85606] focus-within:ring-1 focus-within:ring-[#F85606]">
                <Lock className="w-4 h-4 text-gray-400 mr-2 shrink-0" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full text-xs outline-none text-gray-900"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#F85606] hover:bg-[#d94800] text-white py-3 rounded-lg font-bold text-xs sm:text-sm shadow-md transition-all cursor-pointer mt-2 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <ShieldCheck className="w-4 h-4" />
              {loading ? 'Verifying Admin Credentials...' : 'Sign In as Administrator'}
            </button>
          </form>

          {/* Preset Credentials Box */}
          <div className="p-3 bg-gray-50 border border-gray-200 rounded-xl text-[11px] text-gray-600 space-y-1">
            <div className="flex items-center gap-1 font-semibold text-gray-800">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Configured Administrator Credentials:</span>
            </div>
            <div className="flex justify-between font-mono bg-white px-2 py-1 rounded border border-gray-200 text-gray-700">
              <span>Username: <strong>royrox845</strong></span>
              <span>Pass: <strong>upesh123##$$657</strong></span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
