import React, { useState, useEffect } from 'react';
import { Zap, ChevronRight, Flame, ShoppingCart } from 'lucide-react';
import { Product } from '../types';
import { SafeImage } from './SafeImage';

interface FlashSaleProps {
  products: Product[];
  onSelectProduct: (product: Product) => void;
  onAddToCart: (product: Product, e: React.MouseEvent) => void;
  language: 'en' | 'np';
}

export const FlashSale: React.FC<FlashSaleProps> = ({
  products,
  onSelectProduct,
  onAddToCart,
  language
}) => {
  // Countdown Timer
  const [timeLeft, setTimeLeft] = useState({
    hours: 4,
    minutes: 36,
    seconds: 18
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 12, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const flashSaleItems = products.filter(p => p.isFlashSale).slice(0, 6);

  return (
    <div className="max-w-7xl mx-auto px-4 py-4">
      <div className="bg-white rounded-xl shadow-xs border border-gray-100 overflow-hidden">
        {/* Flash Sale Header */}
        <div className="p-4 border-b border-gray-100 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-1.5">
              <span className="w-7 h-7 rounded-lg bg-orange-600 text-white flex items-center justify-center font-black shadow-xs">
                <Zap className="w-4 h-4 fill-white" />
              </span>
              <h2 className="text-lg font-black tracking-tight text-[#f85606] uppercase">
                {language === 'en' ? 'Flash Sale' : 'फ्ल्यास सेल'}
              </h2>
            </div>

            <div className="flex items-center gap-2 text-xs font-semibold text-gray-500">
              <span className="text-gray-400">On Sale Now</span>
              <div className="flex items-center gap-1 text-white text-xs font-black">
                <span className="bg-[#f85606] px-2 py-1 rounded">
                  {String(timeLeft.hours).padStart(2, '0')}
                </span>
                <span className="text-gray-600 font-bold">:</span>
                <span className="bg-[#f85606] px-2 py-1 rounded">
                  {String(timeLeft.minutes).padStart(2, '0')}
                </span>
                <span className="text-gray-600 font-bold">:</span>
                <span className="bg-[#f85606] px-2 py-1 rounded">
                  {String(timeLeft.seconds).padStart(2, '0')}
                </span>
              </div>
            </div>
          </div>

          <button className="text-xs font-bold text-[#f85606] border border-[#f85606] hover:bg-orange-50 px-3.5 py-1.5 rounded transition flex items-center gap-1 cursor-pointer">
            <span>{language === 'en' ? 'SHOP ALL PRODUCTS' : 'सबै सामान हेर्नुहोस्'}</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Product Cards Row */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 divide-x divide-y md:divide-y-0 divide-gray-100">
          {flashSaleItems.map((product) => {
            const percentageClaimed = Math.min(95, Math.floor(60 + (product.rating * 7)));

            return (
              <div
                key={product.id}
                onClick={() => onSelectProduct(product)}
                className="p-3 hover:shadow-md transition bg-white flex flex-col justify-between group cursor-pointer"
              >
                <div>
                  <div className="relative pt-[100%] overflow-hidden rounded bg-gray-50 mb-2">
                    <SafeImage
                      src={product.images[0]}
                      alt={product.title}
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition"
                      fallbackText={product.title}
                    />
                    <div className="absolute top-1 left-1 bg-[#f85606] text-white text-[10px] font-bold px-1.5 py-0.5 rounded shadow-2xs">
                      -{product.discountPercent}%
                    </div>
                  </div>

                  <h3 className="text-xs text-gray-800 line-clamp-2 leading-snug group-hover:text-[#f85606] transition" title={product.title}>
                    {language === 'en' ? product.title : (product.titleNp || product.title)}
                  </h3>

                  <div className="mt-2">
                    <div className="text-sm font-bold text-[#f85606] tabular-nums font-mono">
                      Rs. {product.price.toLocaleString('en-IN')}
                    </div>
                    <div className="text-[10px] text-gray-400 line-through tabular-nums">
                      Rs. {product.originalPrice.toLocaleString('en-IN')}
                    </div>
                  </div>
                </div>

                {/* Claimed Progress Bar */}
                <div className="mt-3">
                  <div className="w-full bg-orange-100 rounded-full h-2 overflow-hidden relative">
                    <div
                      className="bg-gradient-to-r from-orange-500 to-red-500 h-full rounded-full transition-all duration-500"
                      style={{ width: `${percentageClaimed}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-[9px] text-gray-400 font-semibold mt-1">
                    <span className="flex items-center gap-0.5 text-orange-600">
                      <Flame className="w-2.5 h-2.5 fill-orange-500" />
                      {percentageClaimed}% Sold
                    </span>
                    <span>{product.stockCount} left</span>
                  </div>
                </div>

                {/* Quick Add to Cart Button */}
                <div className="mt-2 pt-2 border-t border-gray-100 flex items-center justify-between">
                  <span className="text-[10px] text-gray-500 font-medium">Flash Deal</span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onAddToCart(product, e);
                    }}
                    className="bg-orange-50 hover:bg-[#f85606] text-[#f85606] hover:text-white px-2 py-1 rounded text-[11px] font-bold border border-orange-200 hover:border-transparent flex items-center gap-1 transition cursor-pointer active:scale-95"
                    title="Add to Cart"
                  >
                    <ShoppingCart className="w-3 h-3" />
                    <span>Add</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
