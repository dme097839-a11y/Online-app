import React from 'react';
import { Star, Heart, ShoppingCart, ShieldCheck, Zap, Plus, Minus } from 'lucide-react';
import { Product } from '../types';
import { SafeImage } from './SafeImage';

interface ProductCardProps {
  product: Product;
  onSelect: (product: Product) => void;
  onAddToCart: (product: Product, e: React.MouseEvent) => void;
  onUpdateQuantity?: (productId: string, quantity: number) => void;
  cartQuantity?: number;
  onToggleWishlist: (productId: string, e: React.MouseEvent) => void;
  isWishlisted: boolean;
  language: 'en' | 'np';
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onSelect,
  onAddToCart,
  onUpdateQuantity,
  cartQuantity = 0,
  onToggleWishlist,
  isWishlisted,
  language
}) => {
  return (
    <div
      onClick={() => onSelect(product)}
      className="bg-white rounded-lg border border-gray-100 hover:border-[#f85606]/50 hover:shadow-lg transition-all duration-200 flex flex-col justify-between overflow-hidden cursor-pointer group relative"
    >
      {/* Top Image Container */}
      <div className="relative pt-[100%] overflow-hidden bg-neutral-50">
        <SafeImage
          src={product.images[0]}
          alt={product.title}
          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          fallbackText={product.title}
        />

        {/* Discount Badge */}
        {product.discountPercent > 0 && (
          <div className="absolute top-2 left-2 bg-[#f85606] text-white text-[11px] font-bold px-1.5 py-0.5 rounded shadow-xs">
            -{product.discountPercent}%
          </div>
        )}

        {/* Daraz Mall Flag */}
        {product.isDarazMall && (
          <div className="absolute top-2 right-2 bg-red-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider flex items-center gap-0.5 shadow-xs">
            <ShieldCheck className="w-2.5 h-2.5" />
            Mall
          </div>
        )}

        {/* Wishlist Heart Icon */}
        <button
          onClick={(e) => onToggleWishlist(product.id, e)}
          className={`absolute bottom-2 right-2 w-7 h-7 rounded-full flex items-center justify-center transition shadow-xs cursor-pointer ${
            isWishlisted
              ? 'bg-red-500 text-white'
              : 'bg-white/90 hover:bg-white text-gray-500 hover:text-red-500'
          }`}
          title={isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
        >
          <Heart className={`w-3.5 h-3.5 ${isWishlisted ? 'fill-white' : ''}`} />
        </button>
      </div>

      {/* Product Content Body */}
      <div className="p-3 flex-1 flex flex-col justify-between">
        <div>
          {/* Brand & Category unboxed metadata */}
          <div className="flex items-center gap-1.5 text-[11px] text-gray-500 font-medium mb-1">
            <span className="text-[#f85606] font-semibold">{product.brand}</span>
            <span aria-hidden="true">·</span>
            <span className="truncate max-w-[120px]">{product.subcategory}</span>
          </div>

          {/* Title */}
          <h3 className="text-xs font-normal text-gray-900 line-clamp-2 leading-relaxed group-hover:text-[#f85606] transition" title={product.title}>
            {language === 'en' ? product.title : (product.titleNp || product.title)}
          </h3>

          {/* Price Section */}
          <div className="mt-2">
            <div className="text-base font-bold text-[#f85606] tracking-tight tabular-nums font-mono">
              Rs. {product.price.toLocaleString('en-IN')}
            </div>
            {product.originalPrice > product.price && (
              <div className="flex items-center gap-1.5 text-[11px] text-gray-400 tabular-nums">
                <span className="line-through">
                  Rs. {product.originalPrice.toLocaleString('en-IN')}
                </span>
                <span className="text-gray-500 font-medium">(-{product.discountPercent}%)</span>
              </div>
            )}
          </div>
        </div>

        {/* Rating & Sold count */}
        <div className="mt-2.5 pt-2 border-t border-gray-100">
          <div className="flex items-center justify-between text-[11px]">
            <div className="flex items-center gap-1">
              <div className="flex text-amber-400">
                <Star className="w-3 h-3 fill-amber-400" />
              </div>
              <span className="font-semibold text-gray-800 tabular-nums">{product.rating}</span>
              <span className="text-gray-400">({product.reviewCount})</span>
            </div>
            {product.soldCount && (
              <span className="text-gray-400 text-[10px] tabular-nums">
                {product.soldCount} sold
              </span>
            )}
          </div>

          {/* Clean unboxed delivery info */}
          <div className="flex items-center gap-2 mt-1.5 text-[10px] text-gray-500">
            {product.isFreeDelivery && (
              <span className="text-emerald-700 font-medium">Free Delivery</span>
            )}
            {product.isFreeDelivery && product.isFlashSale && <span aria-hidden="true">·</span>}
            {product.isFlashSale && (
              <span className="text-[#f85606] font-medium">Flash Deal</span>
            )}
          </div>

          {/* Add to Cart or Stepper (+ / -) */}
          <div className="mt-2.5" onClick={(e) => e.stopPropagation()}>
            {cartQuantity > 0 ? (
              <div className="flex items-center justify-between bg-orange-50/90 border border-[#f85606] rounded-md py-1 px-1.5 shadow-2xs">
                <button
                  type="button"
                  onClick={() => onUpdateQuantity && onUpdateQuantity(product.id, cartQuantity - 1)}
                  className="w-6 h-6 rounded bg-white hover:bg-orange-100 text-[#f85606] font-bold text-xs flex items-center justify-center border border-orange-200 cursor-pointer transition"
                  title="Remove 1"
                >
                  <Minus className="w-3 h-3" />
                </button>

                <div className="flex flex-col items-center">
                  <span className="text-xs font-bold text-[#f85606] tabular-nums">
                    {cartQuantity} in Cart
                  </span>
                  <span className="text-[9px] text-gray-500 font-medium tabular-nums font-mono">
                    (Rs. {(product.price * cartQuantity).toLocaleString('en-IN')})
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => onUpdateQuantity && onUpdateQuantity(product.id, cartQuantity + 1)}
                  className="w-6 h-6 rounded bg-[#f85606] hover:bg-[#d44300] text-white font-bold text-xs flex items-center justify-center cursor-pointer transition shadow-2xs"
                  title="Add 1 more"
                >
                  <Plus className="w-3 h-3" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onAddToCart(product, e);
                }}
                className="w-full bg-orange-50 hover:bg-[#f85606] text-[#f85606] hover:text-white border border-orange-200 hover:border-transparent text-xs font-semibold py-1.5 rounded-md transition flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs active:scale-[0.97]"
              >
                <ShoppingCart className="w-3.5 h-3.5" />
                <span>{language === 'en' ? 'Add to Cart' : 'कार्टमा राख्नुहोस्'}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
