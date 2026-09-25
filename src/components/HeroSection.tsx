import React, { useState, useEffect } from 'react';
import { ChevronRight, ChevronLeft, ShieldCheck, Truck, RefreshCw, Zap, Gift, Award, Flame, Tag } from 'lucide-react';
import { CATEGORIES } from '../data/categories';
import { PROMO_VOUCHERS } from '../data/products';

interface HeroSectionProps {
  onSelectCategory: (categoryId: string) => void;
  selectedCategory: string;
  onClaimVoucher: (code: string) => void;
  claimedVouchers: string[];
  language: 'en' | 'np';
}

const HERO_SLIDES = [
  {
    id: 1,
    title: 'Home Appliances Mega Saver Festival',
    titleNp: 'घरायसी उपकरण महा बचत महोत्सव',
    subtitle: 'Refrigerators & Washing Machines with 10-Yr Warranty & Free Home Delivery',
    subtitleNp: 'फ्रिज र वासिङ मेसिनमा १० वर्षसम्म वारेन्टी र घरमै सित्तैमा डेलिभरी',
    tag: 'UP TO 45% OFF',
    bgGradient: 'from-orange-600 via-red-600 to-amber-700',
    badge: '⚡ LIMITED FESTIVAL SPECIAL',
    image: '/src/assets/images/hero_nepal_megasale_1790350394444.jpg',
    cta: 'Explore Appliances',
    catId: 'appliances'
  },
  {
    id: 2,
    title: 'Dashain & Tihar Dhamaka Deals',
    titleNp: 'दसैं तथा तिहार विशेष धमाका अफर',
    subtitle: 'Official Brands: Samsung, LG, Whirlpool, Sony & Baltra at Unbeatable Prices',
    subtitleNp: 'स्यामसुङ, एलजी, व्हर्लपूल, सोनी र बाल्ट्रा ब्रान्डमा भारी छुट',
    tag: 'EXTRA RS. 2,000 OFF',
    bgGradient: 'from-rose-700 via-orange-600 to-red-800',
    badge: '🎁 FREE GIFTS ON EVERY WASHING MACHINE',
    image: '/src/assets/images/darazmall_brands_showcase_1790350435738.jpg',
    cta: 'Shop Big Brands',
    catId: 'appliances'
  },
  {
    id: 3,
    title: 'Electronics & Smartphone Bonanza',
    titleNp: 'इलेक्ट्रोनिक्स र स्मार्टफोन मेला',
    subtitle: 'Pay instantly with eSewa, Khalti, IME Pay, Bank QR Code or Cash on Delivery',
    subtitleNp: 'इसेवा, खल्ती, आईएमई पे तथा बैंक क्युआर कोडबाट सजिलै भुक्तानी गर्नुहोस्',
    tag: 'FAST QR & CASH',
    bgGradient: 'from-blue-700 via-indigo-700 to-purple-800',
    badge: '📱 100% NTA REGISTERED PHONES',
    image: '/src/assets/images/product_samsung_fridge_1790350408340.jpg',
    cta: 'Browse Gadgets',
    catId: 'electronic-devices'
  }
];

export const HeroSection: React.FC<HeroSectionProps> = ({
  onSelectCategory,
  selectedCategory,
  onClaimVoucher,
  claimedVouchers,
  language
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const slide = HERO_SLIDES[currentSlide];

  return (
    <div className="max-w-7xl mx-auto px-4 pt-3 pb-6">
      {/* 3-Column Layout: Sidebar Categories | Main Banner Slider | Quick Perks & Vouchers */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 items-stretch">
        
        {/* Left Category Menu (Daraz signature sidebar) */}
        <div className="hidden lg:block lg:col-span-3 bg-white rounded-lg shadow-sm border border-gray-100 overflow-visible relative text-sm py-2">
          <div className="px-4 py-2 font-bold text-gray-900 border-b border-gray-100 flex items-center justify-between text-xs tracking-wider uppercase text-[#f85606]">
            <span>{language === 'en' ? 'Categories' : 'कोटिहरू'}</span>
            <span className="text-[10px] bg-orange-100 text-[#f85606] px-1.5 py-0.5 rounded font-bold">ALL</span>
          </div>

          <div className="divide-y divide-gray-50">
            {CATEGORIES.map((cat) => {
              const isActive = selectedCategory === cat.id;
              const isHovered = hoveredCategory === cat.id;

              return (
                <div
                  key={cat.id}
                  onMouseEnter={() => setHoveredCategory(cat.id)}
                  onMouseLeave={() => setHoveredCategory(null)}
                  className="relative group"
                >
                  <button
                    onClick={() => onSelectCategory(cat.id)}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 text-xs text-left transition cursor-pointer ${
                      isActive
                        ? 'bg-orange-50 text-[#f85606] font-bold'
                        : 'text-gray-700 hover:text-[#f85606] hover:bg-gray-50'
                    }`}
                  >
                    <span className="truncate pr-2">
                      {language === 'en' ? cat.name : cat.nameNp}
                    </span>
                    <ChevronRight className="w-3.5 h-3.5 text-gray-400 group-hover:text-[#f85606] group-hover:translate-x-0.5 transition" />
                  </button>

                  {/* Subcategory Popover Flyout */}
                  {isHovered && (
                    <div className="absolute left-full top-0 ml-1 w-64 bg-white rounded-lg shadow-xl border border-gray-100 p-3 z-50 animate-in fade-in zoom-in-95 duration-150">
                      <div className="text-xs font-bold text-gray-800 border-b border-gray-100 pb-1.5 mb-2 text-[#f85606]">
                        {language === 'en' ? cat.name : cat.nameNp}
                      </div>
                      <div className="space-y-1">
                        {cat.subcategories.map((sub, idx) => (
                          <div
                            key={idx}
                            onClick={() => onSelectCategory(cat.id)}
                            className="text-xs text-gray-600 hover:text-[#f85606] hover:bg-orange-50 px-2 py-1.5 rounded cursor-pointer transition flex items-center justify-between"
                          >
                            <span>{sub}</span>
                            <span className="text-[10px] text-gray-300">›</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Center: Dynamic Hero Slider */}
        <div className="lg:col-span-6 relative rounded-xl overflow-hidden min-h-[300px] md:min-h-[360px] shadow-sm flex flex-col justify-between group">
          {/* Background image & gradient overlay */}
          <div 
            className="absolute inset-0 bg-cover bg-center transition-all duration-700 scale-100 group-hover:scale-105"
            style={{ backgroundImage: `url(${slide.image})` }}
          />
          <div className={`absolute inset-0 bg-gradient-to-r ${slide.bgGradient} opacity-85 mix-blend-multiply`} />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />

          {/* Slide Content */}
          <div className="relative z-10 p-6 md:p-8 flex flex-col justify-between h-full text-white">
            <div>
              <div className="inline-flex items-center gap-1.5 bg-yellow-400 text-gray-900 font-extrabold text-[11px] px-2.5 py-0.5 rounded-full mb-3 shadow">
                <Flame className="w-3.5 h-3.5 text-red-600 fill-red-600" />
                {slide.badge}
              </div>
              <h2 className="text-2xl md:text-3xl font-black leading-tight drop-shadow-md max-w-md">
                {language === 'en' ? slide.title : slide.titleNp}
              </h2>
              <p className="text-xs md:text-sm text-white/90 mt-2 font-medium max-w-sm drop-shadow">
                {language === 'en' ? slide.subtitle : slide.subtitleNp}
              </p>
            </div>

            <div className="mt-6 flex items-center justify-between">
              <div>
                <span className="bg-white/20 backdrop-blur-md border border-white/30 text-white font-black text-xs md:text-sm px-3 py-1.5 rounded-md inline-block">
                  {slide.tag}
                </span>
              </div>

              <button
                onClick={() => onSelectCategory(slide.catId)}
                className="bg-[#f85606] hover:bg-[#ff691e] text-white font-bold text-xs md:text-sm px-5 py-2.5 rounded-lg shadow-lg hover:shadow-xl transition transform hover:scale-105 cursor-pointer flex items-center gap-1"
              >
                <span>{slide.cta}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Slider Controls */}
          <button
            onClick={() => setCurrentSlide((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length)}
            className="absolute left-2 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition cursor-pointer"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length)}
            className="absolute right-2 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition cursor-pointer"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Dot Indicators */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex space-x-1.5">
            {HERO_SLIDES.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentSlide(i)}
                className={`h-1.5 rounded-full transition-all ${
                  currentSlide === i ? 'w-6 bg-yellow-400' : 'w-2 bg-white/60'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Right Column: User Perks & Collectible Vouchers */}
        <div className="lg:col-span-3 flex flex-col gap-2.5">
          {/* Daraz Guarantee Card */}
          <div className="bg-gradient-to-br from-orange-500 to-[#f85606] rounded-xl p-4 text-white shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs uppercase tracking-wider font-extrabold text-orange-100 flex items-center gap-1">
                  <Award className="w-4 h-4 text-yellow-300" />
                  DARAZ OFFICIAL
                </span>
                <span className="bg-black/20 text-[10px] px-2 py-0.5 rounded-full font-bold">100% Genuine</span>
              </div>
              <h3 className="text-sm font-black leading-snug">
                {language === 'en' ? 'Nepal’s Trusted Mega Store' : 'नेपालको भरपर्दो सपिङ मल'}
              </h3>
              <p className="text-[11px] text-white/90 mt-1">
                Direct authorized distributors for Samsung, LG, Whirlpool, Sony & CG in Nepal.
              </p>
            </div>

            <div className="mt-3 pt-2.5 border-t border-white/20 grid grid-cols-2 gap-2 text-[10px] text-white/90 font-medium">
              <div className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-yellow-300" />
                <span>Up to 10 Yr Warranty</span>
              </div>
              <div className="flex items-center gap-1">
                <Truck className="w-3.5 h-3.5 text-yellow-300" />
                <span>Fast Valley Delivery</span>
              </div>
              <div className="flex items-center gap-1">
                <RefreshCw className="w-3.5 h-3.5 text-yellow-300" />
                <span>14 Days Easy Returns</span>
              </div>
              <div className="flex items-center gap-1">
                <Zap className="w-3.5 h-3.5 text-yellow-300" />
                <span>eSewa & Khalti Ready</span>
              </div>
            </div>
          </div>

          {/* Vouchers Widget */}
          <div className="bg-white rounded-xl p-3 border border-gray-100 shadow-sm flex-1 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-gray-800 flex items-center gap-1">
                <Gift className="w-3.5 h-3.5 text-[#f85606]" />
                {language === 'en' ? 'Exclusive Vouchers' : 'विशेष छुट भौचरहरू'}
              </span>
              <span className="text-[10px] text-[#f85606] font-semibold cursor-pointer">Collect All</span>
            </div>

            <div className="space-y-2">
              {PROMO_VOUCHERS.slice(0, 2).map((voucher) => {
                const isClaimed = claimedVouchers.includes(voucher.code);
                return (
                  <div
                    key={voucher.code}
                    className="p-2 rounded-lg bg-orange-50/60 border border-orange-200 flex items-center justify-between text-xs"
                  >
                    <div>
                      <div className="font-bold text-[#f85606] flex items-center gap-1 text-xs">
                        <Tag className="w-3 h-3" />
                        Rs. {voucher.discount} OFF
                      </div>
                      <div className="text-[10px] text-gray-500">Min spend Rs. {voucher.minSpend.toLocaleString('en-IN')}</div>
                    </div>
                    <button
                      onClick={() => onClaimVoucher(voucher.code)}
                      disabled={isClaimed}
                      className={`text-[11px] font-bold px-2.5 py-1 rounded transition cursor-pointer ${
                        isClaimed
                          ? 'bg-gray-200 text-gray-500 cursor-default'
                          : 'bg-[#f85606] hover:bg-[#d44300] text-white shadow-xs'
                      }`}
                    >
                      {isClaimed ? 'COLLECTED' : 'COLLECT'}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

      </div>

      {/* Feature Badges Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-3">
        <div className="bg-white p-3 rounded-lg border border-gray-100 shadow-xs flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-orange-100 flex items-center justify-center text-[#f85606] flex-shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-gray-800">100% Authentic</div>
            <div className="text-[11px] text-gray-500">Genuine or 2x Money Back</div>
          </div>
        </div>

        <div className="bg-white p-3 rounded-lg border border-gray-100 shadow-xs flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 flex-shrink-0">
            <Truck className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-gray-800">Free & Fast Delivery</div>
            <div className="text-[11px] text-gray-500">Kathmandu, Pokhara, Chitwan</div>
          </div>
        </div>

        <div className="bg-white p-3 rounded-lg border border-gray-100 shadow-xs flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 flex-shrink-0">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-gray-800">Secure Payments</div>
            <div className="text-[11px] text-gray-500">eSewa, Khalti, IME Pay, Cards</div>
          </div>
        </div>

        <div className="bg-white p-3 rounded-lg border border-gray-100 shadow-xs flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 flex-shrink-0">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-gray-800">Brand Warranty</div>
            <div className="text-[11px] text-gray-500">Up to 10-20 Years on Inverter</div>
          </div>
        </div>
      </div>
    </div>
  );
};
