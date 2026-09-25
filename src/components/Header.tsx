import React, { useState } from 'react';
import { 
  Search, 
  ShoppingCart, 
  Heart, 
  Sparkles, 
  ShieldCheck, 
  Globe, 
  User, 
  HelpCircle, 
  Smartphone, 
  Tag, 
  Package, 
  LogOut,
  QrCode,
  Truck
} from 'lucide-react';
import { CartItem } from '../types';
import { useAuth } from '../services/authContext';

interface HeaderProps {
  cartItems: CartItem[];
  wishlistCount: number;
  onOpenCart: () => void;
  onOpenWishlist: () => void;
  onOpenAIAdvisor: () => void;
  onOpenMyOrders: () => void;
  onOpenDeliveryGuide?: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onSelectCategory: (cat: string) => void;
  selectedCategory: string;
  language: 'en' | 'np';
  onToggleLanguage: () => void;
  onOpenAuth: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  cartItems,
  wishlistCount,
  onOpenCart,
  onOpenWishlist,
  onOpenAIAdvisor,
  onOpenMyOrders,
  onOpenDeliveryGuide,
  searchQuery,
  onSearchChange,
  onSelectCategory,
  selectedCategory,
  language,
  onToggleLanguage,
  onOpenAuth
}) => {
  const { currentUser, userProfile, isAdmin, logout } = useAuth();
  const [isFocused, setIsFocused] = useState(false);
  const totalCartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const popularSearches = [
    'Samsung Double Door Fridge',
    'LG Front Load Washing Machine',
    'Baltra Deep Freezer',
    'Whirlpool Top Load',
    'Sony 55 4K TV',
    'Philips Air Fryer',
    'eSewa QR & Khalti Deals'
  ];

  return (
    <header className="sticky top-0 z-40 bg-white shadow-sm border-b border-gray-100">
      {/* Top Utility Bar (Signature Daraz Top Header) */}
      <div className="bg-[#F7F7F7] border-b border-gray-200 text-xs text-[#555] py-1.5 px-4 hidden md:block">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <span className="hover:text-[#F85606] cursor-pointer flex items-center gap-1 font-medium text-[#F85606]">
              <Smartphone className="w-3.5 h-3.5" />
              {language === 'en' ? 'SAVE MORE ON APP' : 'एपमा थप बचत गर्नुहोस्'}
            </span>
            <button
              onClick={onOpenDeliveryGuide}
              className="hover:text-[#F85606] cursor-pointer flex items-center gap-1 font-semibold text-gray-700"
            >
              <Truck className="w-3.5 h-3.5 text-[#F85606]" />
              {language === 'en' ? 'Delivery Across Nepal (7 Provinces)' : 'नेपालका ७ वटै प्रदेशमा डेलिभरी'}
            </button>
            <span className="hover:text-[#F85606] cursor-pointer flex items-center gap-1">
              <HelpCircle className="w-3.5 h-3.5 text-gray-400" />
              {language === 'en' ? 'Help & Customer Care' : 'सहायता र ग्राहक सेवा'}
            </span>
          </div>

          <div className="flex items-center space-x-4">
            {/* Live Firebase project status indicator */}
            <div className="hidden lg:flex items-center gap-1.5 text-[11px] font-mono text-emerald-800 bg-emerald-50/80 px-2 py-0.5 rounded-md border border-emerald-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Firebase: <strong>nepalmart</strong></span>
            </div>

            {/* Language Switcher */}
            <button
              onClick={onToggleLanguage}
              className="flex items-center gap-1 hover:text-[#F85606] transition font-medium cursor-pointer"
              title="Toggle Language"
            >
              <Globe className="w-3.5 h-3.5 text-[#F85606]" />
              <span>{language === 'en' ? 'नेपाली' : 'English'}</span>
            </button>

            {currentUser ? (
              <div className="flex items-center gap-3">
                <button
                  onClick={onOpenMyOrders}
                  className="hover:text-[#F85606] flex items-center gap-1 font-medium text-gray-700 cursor-pointer"
                >
                  <Package className="w-3.5 h-3.5 text-gray-500" />
                  <span>{language === 'en' ? 'My Orders' : 'मेरा अर्डरहरू'}</span>
                </button>

                <div className="flex items-center gap-1.5 text-gray-900 font-semibold bg-gray-100 px-2.5 py-1 rounded-full text-[11px]">
                  <User className="w-3.5 h-3.5 text-[#F85606]" />
                  <span>{userProfile?.displayName || currentUser.displayName || currentUser.email?.split('@')[0] || 'My Account'}</span>
                  {isAdmin && (
                    <span className="bg-amber-500 text-gray-950 font-black text-[9px] px-1 rounded uppercase">ADMIN</span>
                  )}
                </div>

                <button
                  onClick={() => logout()}
                  className="hover:text-rose-600 transition cursor-pointer text-gray-500 text-[11px] flex items-center gap-1"
                  title="Sign Out"
                >
                  <LogOut className="w-3 h-3" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={onOpenAuth}
                  className="hover:text-[#F85606] transition cursor-pointer font-semibold text-gray-700"
                >
                  {language === 'en' ? 'LOGIN / SIGN UP' : 'लगइन / दर्ता'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Bar */}
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-4 md:gap-8">
          
          {/* Logo */}
          <div 
            onClick={() => { onSelectCategory('all'); onSearchChange(''); }}
            className="flex items-center gap-2 cursor-pointer shrink-0 select-none group"
          >
            <div className="w-10 h-10 bg-[#F85606] rounded-xl flex items-center justify-center text-white font-black text-2xl shadow-md transform group-hover:scale-105 transition">
              N
            </div>
            <div className="flex flex-col">
              <div className="flex items-center">
                <span className="text-2xl font-black tracking-tight text-[#F85606]">nepalmart</span>
                <span className="text-xs bg-[#F85606] text-white px-1.5 py-0.5 rounded-sm ml-1 font-bold">NP</span>
              </div>
              <span className="text-[9px] uppercase tracking-wider text-gray-500 font-medium">
                {language === 'en' ? 'Nepal Online Shopping Mall' : 'नेपालको मनपर्ने अनलाइन सपिङ'}
              </span>
            </div>
          </div>

          {/* Search Box */}
          <div className="flex-1 max-w-2xl relative">
            <div className="flex items-center bg-[#F5F5F5] rounded-lg border border-transparent focus-within:border-[#F85606] focus-within:bg-white transition overflow-hidden shadow-inner">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setTimeout(() => setIsFocused(false), 250)}
                placeholder={
                  language === 'en' 
                    ? "Search in NepalMart (e.g. Refrigerator, Washing Machine, Sony TV, AC...)"
                    : "नेपालमार्टमा खोज्नुहोस् (जस्तै फ्रिज, वासिङ मेसिन, टिभी, एसी...)"
                }
                className="w-full px-4 py-2.5 text-sm bg-transparent outline-none text-gray-800 placeholder-gray-400"
              />
              <button 
                className="bg-[#F85606] hover:bg-[#d44300] text-white px-5 py-2.5 transition flex items-center justify-center shrink-0 cursor-pointer"
                title="Search"
              >
                <Search className="w-5 h-5" />
              </button>
            </div>

            {/* Live Search Quick Suggest Dropdown */}
            {isFocused && !searchQuery && (
              <div className="absolute left-0 right-0 top-full mt-1.5 bg-white rounded-lg shadow-xl border border-gray-100 p-3 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Tag className="w-3 h-3 text-[#F85606]" />
                  {language === 'en' ? 'Trending Searches in Nepal' : 'नेपालमा धेरै खोजिएका'}
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {popularSearches.map((term, i) => (
                    <button
                      key={i}
                      onClick={() => onSearchChange(term)}
                      className="text-xs bg-gray-100 hover:bg-orange-50 hover:text-[#F85606] text-gray-700 px-2.5 py-1 rounded-full transition cursor-pointer"
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* AI Recommendation Engine Button */}
            <button
              onClick={onOpenAIAdvisor}
              className="hidden lg:flex items-center gap-1.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white px-3 py-2 rounded-lg text-xs font-semibold shadow-sm hover:shadow transition transform hover:-translate-y-0.5 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 animate-spin-slow" />
              <span>{language === 'en' ? 'AI Advisor' : 'एआई सल्लाहकार'}</span>
            </button>

            {/* My Orders (Mobile & Desktop) */}
            <button
              onClick={onOpenMyOrders}
              className="p-2 text-gray-600 hover:text-[#F85606] hover:bg-orange-50 rounded-lg transition cursor-pointer"
              title="My Orders"
            >
              <Package className="w-5 h-5" />
            </button>

            {/* Wishlist */}
            <button
              onClick={onOpenWishlist}
              className="relative p-2 text-gray-600 hover:text-[#F85606] hover:bg-orange-50 rounded-lg transition cursor-pointer"
              title="Wishlist"
            >
              <Heart className="w-5 h-5" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#F85606] text-white text-[11px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white shadow-xs">
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* Cart */}
            <button
              onClick={onOpenCart}
              className="relative p-2 text-gray-700 hover:text-[#F85606] hover:bg-orange-50 rounded-lg transition cursor-pointer flex items-center gap-2 group"
              title="Cart"
            >
              <div className="relative">
                <ShoppingCart className="w-6 h-6 text-gray-700 group-hover:text-[#F85606] transition" />
                {totalCartCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-[#F85606] text-white text-[11px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white shadow-sm animate-pulse-subtle">
                    {totalCartCount}
                  </span>
                )}
              </div>
              <div className="hidden xl:flex flex-col text-left">
                <span className="text-[10px] text-gray-400 font-medium">Cart</span>
                <span className="text-xs font-bold text-gray-800">
                  Rs. {cartItems.reduce((acc, it) => acc + (it.product.price * it.quantity), 0).toLocaleString()}
                </span>
              </div>
            </button>
          </div>
        </div>

        {/* Bottom Quick Links Bar */}
        <div className="flex items-center gap-3 overflow-x-auto pt-2 pb-1 text-xs font-medium text-gray-600 scrollbar-none border-t border-gray-100 mt-2">
          <button
            onClick={() => onSelectCategory('all')}
            className={`px-3 py-1 rounded-full whitespace-nowrap transition cursor-pointer ${
              selectedCategory === 'all'
                ? 'bg-[#F85606] text-white font-semibold'
                : 'hover:bg-gray-100 text-gray-700'
            }`}
          >
            {language === 'en' ? 'All Products' : 'सबै सामानहरू'}
          </button>

          <button
            onClick={() => onSelectCategory('appliances')}
            className={`px-3 py-1 rounded-full whitespace-nowrap transition cursor-pointer flex items-center gap-1 ${
              selectedCategory === 'appliances'
                ? 'bg-[#F85606] text-white font-semibold'
                : 'hover:bg-orange-50 hover:text-[#F85606] text-gray-700'
            }`}
          >
            <span>❄️ {language === 'en' ? 'Freeze & Washing Machines' : 'फ्रिज र वासिङ मेसिन'}</span>
          </button>

          <button
            onClick={() => onSelectCategory('electronic-devices')}
            className={`px-3 py-1 rounded-full whitespace-nowrap transition cursor-pointer ${
              selectedCategory === 'electronic-devices'
                ? 'bg-[#F85606] text-white font-semibold'
                : 'hover:bg-gray-100 text-gray-700'
            }`}
          >
            {language === 'en' ? 'Smartphones & TVs' : 'स्मार्टफोन र टिभी'}
          </button>

          <span className="text-gray-300">|</span>

          <div className="flex items-center gap-4 text-xs font-semibold text-gray-700 whitespace-nowrap">
            <span className="flex items-center gap-1 text-red-600 hover:underline cursor-pointer">
              <ShieldCheck className="w-3.5 h-3.5 text-red-500" />
              Daraz Mall 100% Authentic
            </span>
            <span className="text-[#F85606] font-bold flex items-center gap-1 cursor-pointer">
              ⚡ Flash Sale
            </span>
            <button 
              onClick={onOpenDeliveryGuide}
              className="text-emerald-600 hover:text-emerald-700 font-semibold cursor-pointer flex items-center gap-1 transition"
            >
              🚚 Free Delivery Over Rs. 2,500 (All 7 Provinces)
            </button>
            <span className="text-purple-600 font-medium cursor-pointer flex items-center gap-1">
              <QrCode className="w-3.5 h-3.5" /> eSewa & Khalti QR Pay
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};
