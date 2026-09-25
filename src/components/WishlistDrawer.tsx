import React from 'react';
import { X, Heart, ShoppingCart, Trash2 } from 'lucide-react';
import { Product } from '../types';
import { SafeImage } from './SafeImage';

interface WishlistDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  wishlistedProducts: Product[];
  onRemoveFromWishlist: (productId: string) => void;
  onAddToCart: (product: Product, e: React.MouseEvent) => void;
  language: 'en' | 'np';
}

export const WishlistDrawer: React.FC<WishlistDrawerProps> = ({
  isOpen,
  onClose,
  wishlistedProducts,
  onRemoveFromWishlist,
  onAddToCart,
  language
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs flex justify-end animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-md h-full flex flex-col shadow-2xl relative animate-in slide-in-from-right duration-300">
        
        {/* Header */}
        <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50">
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-red-500 fill-red-500" />
            <h2 className="text-base font-bold text-gray-900">
              {language === 'en' ? 'My Wishlist' : 'मेरो इच्छासूची'} ({wishlistedProducts.length})
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-gray-200 flex items-center justify-center text-gray-600 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {wishlistedProducts.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3">
              <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center text-red-400">
                <Heart className="w-8 h-8" />
              </div>
              <h3 className="text-sm font-bold text-gray-800">Your Wishlist is Empty</h3>
              <p className="text-xs text-gray-500 max-w-xs">
                Tap the heart icon on any appliance or item to save it for later.
              </p>
            </div>
          ) : (
            wishlistedProducts.map(product => (
              <div
                key={product.id}
                className="bg-white rounded-lg border border-gray-200 p-3 flex gap-3 shadow-2xs hover:border-orange-200 transition"
              >
                <SafeImage
                  src={product.images[0]}
                  alt={product.title}
                  className="w-16 h-16 rounded-md object-cover flex-shrink-0"
                  fallbackText={product.brand}
                />

                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-1">
                      <h4 className="text-xs font-semibold text-gray-800 line-clamp-1">
                        {product.title}
                      </h4>
                      <button
                        onClick={() => onRemoveFromWishlist(product.id)}
                        className="text-gray-400 hover:text-red-500 transition p-1 cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="text-[11px] text-gray-500">{product.brand}</div>
                  </div>

                  <div className="flex items-center justify-between mt-2">
                    <div className="text-xs font-bold text-[#f85606] tabular-nums font-mono">
                      Rs. {product.price.toLocaleString('en-IN')}
                    </div>

                    <button
                      onClick={(e) => onAddToCart(product, e)}
                      className="bg-orange-50 hover:bg-[#f85606] text-[#f85606] hover:text-white px-2.5 py-1 rounded text-xs font-bold transition flex items-center gap-1 cursor-pointer border border-orange-200 hover:border-transparent"
                    >
                      <ShoppingCart className="w-3 h-3" />
                      <span>Add to Cart</span>
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
};
