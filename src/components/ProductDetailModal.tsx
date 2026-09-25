import React, { useState, useEffect } from 'react';
import { 
  X, Star, Heart, ShoppingCart, ShieldCheck, Truck, RefreshCw, 
  MapPin, CheckCircle, CheckCircle2, Check, ArrowLeft, Info, Share2, Award, Zap, ChevronRight, Plus, Minus, Building2
} from 'lucide-react';
import { Product, CartItem } from '../types';
import { NEPAL_PROVINCES, ALL_NEPAL_CITIES, NepalCityInfo, NepalProvinceInfo } from '../data/nepalDelivery';
import { MOCK_REVIEWS } from '../data/products';
import { SafeImage } from './SafeImage';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product, quantity: number) => void;
  onBuyNow: (product: Product, quantity: number) => void;
  onToggleWishlist: (productId: string, e: React.MouseEvent) => void;
  isWishlisted: boolean;
  language: 'en' | 'np';
  allProducts: Product[];
  onSelectProduct: (p: Product) => void;
  cartItemQuantity?: number;
  onOpenCart?: () => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onAddToCart,
  onBuyNow,
  onToggleWishlist,
  isWishlisted,
  language,
  allProducts,
  onSelectProduct,
  cartItemQuantity = 0,
  onOpenCart
}) => {
  if (!product) return null;

  const [selectedImage, setSelectedImage] = useState(product.images[0]);
  const [quantity, setQuantity] = useState(1);
  const [selectedProvince, setSelectedProvince] = useState<NepalProvinceInfo>(NEPAL_PROVINCES[0]);
  const [selectedCity, setSelectedCity] = useState<NepalCityInfo>(NEPAL_PROVINCES[0].cities[0]);
  const [activeTab, setActiveTab] = useState<'specs' | 'features' | 'reviews'>('specs');
  const [copiedLink, setCopiedLink] = useState(false);
  const [addedFeedback, setAddedFeedback] = useState<{ count: number; timestamp: number } | null>(null);
  const [addedAccessories, setAddedAccessories] = useState<Record<string, boolean>>({});

  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // Cross-sell accessories
  const recommendedAccessories = allProducts.filter(p => {
    if (product.tags.includes('refrigerator') || product.tags.includes('freeze')) {
      return p.id === 'acc-refrigerator-stand-trolley' || p.id === 'acc-voltage-stabilizer-vguard';
    }
    if (product.tags.includes('washing machine')) {
      return p.id === 'acc-anti-vibration-pads' || p.id === 'acc-refrigerator-stand-trolley';
    }
    return false;
  });

  const handleShare = () => {
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleAddToCartWithFeedback = () => {
    onAddToCart(product, quantity);
    setAddedFeedback({ count: quantity, timestamp: Date.now() });
    setTimeout(() => {
      setAddedFeedback(null);
    }, 3500);
  };

  const handleAddAccessory = (acc: Product) => {
    onAddToCart(acc, 1);
    setAddedAccessories(prev => ({ ...prev, [acc.id]: true }));
    setTimeout(() => {
      setAddedAccessories(prev => ({ ...prev, [acc.id]: false }));
    }, 2500);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-xl max-w-5xl w-full max-h-[92vh] flex flex-col overflow-hidden shadow-2xl relative my-auto">
        
        {/* Top Header with prominent Go Back button */}
        <div className="px-4 sm:px-6 py-3 border-b border-gray-100 flex items-center justify-between bg-[#fbfbfb]">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            {/* Primary Go Back Button */}
            <button
              onClick={onClose}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white hover:bg-orange-50 text-gray-800 hover:text-[#f85606] font-bold text-xs sm:text-sm border border-gray-300 hover:border-[#f85606] shadow-2xs transition cursor-pointer shrink-0 group"
              title="Go back to products"
            >
              <ArrowLeft className="w-4 h-4 text-gray-600 group-hover:text-[#f85606] group-hover:-translate-x-0.5 transition-transform" />
              <span>Go Back</span>
            </button>

            <div className="hidden sm:flex items-center gap-1.5 text-xs text-gray-500 truncate">
              <span className="font-semibold text-[#f85606]">{product.brand}</span>
              <span>›</span>
              <span>{product.subcategory}</span>
              <span>›</span>
              <span className="truncate max-w-[220px] text-gray-700">{product.title}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Share Button */}
            <button
              onClick={handleShare}
              className="text-xs text-gray-600 hover:text-[#f85606] flex items-center gap-1 cursor-pointer bg-white border border-gray-200 px-2.5 py-1.5 rounded-lg hover:border-gray-300 shadow-2xs transition"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span className="hidden xs:inline">{copiedLink ? 'Copied Link!' : 'Share'}</span>
            </button>

            {/* Close X Button */}
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 flex items-center justify-center transition cursor-pointer"
              title="Close (Esc)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="overflow-y-auto p-4 sm:p-6 space-y-6 flex-1">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            
            {/* Left: Product Images Gallery */}
            <div className="md:col-span-5 flex flex-col gap-3">
              <div className="relative pt-[100%] rounded-xl overflow-hidden bg-gray-50 border border-gray-100 shadow-xs">
                <SafeImage
                  src={selectedImage || product.images[0]}
                  alt={product.title}
                  className="absolute inset-0 w-full h-full object-cover"
                  fallbackText={product.title}
                />
                {product.discountPercent > 0 && (
                  <div className="absolute top-3 left-3 bg-[#f85606] text-white text-xs font-black px-2 py-0.5 rounded shadow">
                    -{product.discountPercent}% OFF
                  </div>
                )}
                {product.isDarazMall && (
                  <div className="absolute top-3 right-3 bg-red-600 text-white text-[10px] font-extrabold px-2 py-0.5 rounded uppercase tracking-wider flex items-center gap-1 shadow">
                    <ShieldCheck className="w-3 h-3" />
                    Daraz Mall
                  </div>
                )}
              </div>

              {/* Thumbnails */}
              {product.images.length > 1 && (
                <div className="flex gap-2">
                  {product.images.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedImage(img)}
                      className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition cursor-pointer ${
                        selectedImage === img ? 'border-[#f85606]' : 'border-gray-200 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <SafeImage src={img} alt="thumbnail" className="w-full h-full object-cover" fallbackText="Item" />
                    </button>
                  ))}
                </div>
              )}

              {/* Verified Authentic Banner */}
              <div className="bg-orange-50/70 border border-orange-200 rounded-lg p-3 text-xs flex items-start gap-2.5">
                <Award className="w-4 h-4 text-[#f85606] flex-shrink-0 mt-0.5" />
                <div className="text-gray-700">
                  <span className="font-bold text-[#f85606]">100% Authentic Product</span>
                  <p className="text-[11px] text-gray-500 mt-0.5">
                    Original manufacturer warranty honored across authorized Nepal service centers.
                  </p>
                </div>
              </div>
            </div>

            {/* Middle: Title, Price, Quantity & CTA */}
            <div className="md:col-span-4 flex flex-col justify-between space-y-4">
              <div>
                <h1 className="text-base sm:text-lg font-bold text-gray-900 leading-snug">
                  {language === 'en' ? product.title : (product.titleNp || product.title)}
                </h1>

                {/* Rating & Brand */}
                <div className="flex items-center gap-3 mt-2 text-xs">
                  <div className="flex items-center gap-1 bg-amber-50 px-2 py-0.5 rounded text-amber-800 font-bold border border-amber-200">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span>{product.rating}</span>
                  </div>
                  <span className="text-gray-500 font-medium">({product.reviewCount} customer ratings)</span>
                  <span className="text-gray-300">|</span>
                  <span className="text-gray-500 font-semibold">{product.soldCount || 100}+ sold</span>
                </div>

                {/* Price Display */}
                <div className="mt-4 bg-[#fff9f6] p-4 rounded-xl border border-orange-100">
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl sm:text-3xl font-black text-[#f85606]">
                      Rs. {product.price.toLocaleString('en-IN')}
                    </span>
                    {product.originalPrice > product.price && (
                      <span className="text-xs text-gray-400 line-through">
                        Rs. {product.originalPrice.toLocaleString('en-IN')}
                      </span>
                    )}
                  </div>

                  <div className="mt-2 text-xs font-semibold text-emerald-700 flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-[#F85606]" />
                    <span>Instant Payment via eSewa, Khalti, IME Pay, Bank QR & Doorstep COD</span>
                  </div>

                  <div className="text-[11px] text-gray-500 mt-1">
                    Inclusive of all Nepali VAT and local municipal taxes.
                  </div>
                </div>

                {/* Interactive Quantity Selector (+ / - / direct input / presets) */}
                <div className="mt-4 space-y-2 bg-gray-50/70 p-3 rounded-xl border border-gray-200">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-gray-800">Select Quantity to Buy:</span>
                    <span className="text-xs font-bold text-[#f85606]">
                      Item Total: Rs. {(product.price * quantity).toLocaleString('en-IN')}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    {/* Stepper with - and + buttons and direct number input */}
                    <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden bg-white shadow-2xs">
                      <button
                        type="button"
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        disabled={quantity <= 1}
                        className="px-3 py-2 bg-gray-50 hover:bg-orange-50 text-gray-700 hover:text-[#f85606] font-bold text-xs cursor-pointer transition disabled:opacity-40 disabled:cursor-not-allowed"
                        title="Decrease Quantity"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>

                      <input
                        type="number"
                        min={1}
                        max={999}
                        value={quantity}
                        onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                        className="w-14 text-center font-bold text-xs border-x border-gray-200 py-2 outline-none text-gray-900 focus:bg-orange-50/40"
                      />

                      <button
                        type="button"
                        onClick={() => setQuantity(quantity + 1)}
                        className="px-3 py-2 bg-gray-50 hover:bg-orange-50 text-gray-700 hover:text-[#f85606] font-bold text-xs cursor-pointer transition"
                        title="Increase Quantity"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Quick batch quantity buttons (1, 2, 3, 5, 10, 20) */}
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {[1, 2, 3, 5, 10, 20].map((q) => (
                        <button
                          key={q}
                          type="button"
                          onClick={() => setQuantity(q)}
                          className={`px-2 py-1 rounded-md text-[11px] font-bold transition cursor-pointer ${
                            quantity === q
                              ? 'bg-[#f85606] text-white shadow-2xs'
                              : 'bg-white hover:bg-gray-100 text-gray-700 border border-gray-200'
                          }`}
                        >
                          {q}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="text-[11px] text-gray-500 flex items-center justify-between pt-1 border-t border-gray-200/60">
                    <span>In stock & ready to ship</span>
                    <span className="text-gray-400">Available: {product.stockCount || 50} units</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2.5 pt-4">
                {/* Already in Cart Indicator */}
                {cartItemQuantity > 0 && (
                  <div className="bg-orange-50 border border-orange-200 text-orange-800 text-[11px] font-semibold px-3 py-1.5 rounded-lg flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <ShoppingCart className="w-3.5 h-3.5 text-[#f85606]" />
                      <span>Currently <strong>{cartItemQuantity}</strong> in your Cart</span>
                    </span>
                    {onOpenCart && (
                      <button
                        type="button"
                        onClick={onOpenCart}
                        className="text-[#f85606] font-bold hover:underline cursor-pointer"
                      >
                        View Cart →
                      </button>
                    )}
                  </div>
                )}

                {/* Instant Feedback Alert when Add to Cart is clicked */}
                {addedFeedback && (
                  <div className="bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs px-3.5 py-2.5 rounded-lg flex items-center justify-between shadow-xs animate-in fade-in duration-200">
                    <div className="flex items-center gap-2 font-bold">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Added {addedFeedback.count} {addedFeedback.count === 1 ? 'item' : 'items'} to Cart!</span>
                    </div>
                    {onOpenCart && (
                      <button
                        type="button"
                        onClick={onOpenCart}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] px-2.5 py-1 rounded shadow-xs cursor-pointer transition"
                      >
                        Open Cart
                      </button>
                    )}
                  </div>
                )}

                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={handleAddToCartWithFeedback}
                    className={`font-bold text-xs sm:text-sm py-3 rounded-lg transition flex items-center justify-center gap-2 cursor-pointer shadow-xs active:scale-[0.98] ${
                      addedFeedback
                        ? 'bg-emerald-600 text-white border border-emerald-600 shadow-md ring-2 ring-emerald-300'
                        : 'bg-orange-50 hover:bg-orange-100 text-[#f85606] border border-[#f85606]'
                    }`}
                  >
                    {addedFeedback ? (
                      <>
                        <Check className="w-4 h-4 text-white" />
                        <span>Added to Cart!</span>
                      </>
                    ) : (
                      <>
                        <ShoppingCart className="w-4 h-4" />
                        <span>
                          {language === 'en' 
                            ? `Add ${quantity} to Cart` 
                            : `${quantity} वटा कार्टमा थप्नुहोस्`}
                        </span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      onBuyNow(product, quantity);
                    }}
                    className="bg-[#f85606] hover:bg-[#d44300] text-white font-bold text-xs sm:text-sm py-3 rounded-lg transition shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]"
                  >
                    <Zap className="w-4 h-4 fill-white" />
                    <span>
                      {language === 'en' 
                        ? `Buy ${quantity} Now` 
                        : `अहिले ${quantity} किन्नुहोस्`}
                    </span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={(e) => onToggleWishlist(product.id, e)}
                    className={`py-2 px-3 rounded-lg text-xs font-semibold border transition flex items-center justify-center gap-1.5 cursor-pointer ${
                      isWishlisted
                        ? 'bg-red-50 text-red-600 border-red-200'
                        : 'bg-white hover:bg-gray-50 text-gray-700 border-gray-200'
                    }`}
                  >
                    <Heart className={`w-3.5 h-3.5 ${isWishlisted ? 'fill-red-500 text-red-500' : ''}`} />
                    <span>{isWishlisted ? 'Saved in Wishlist' : 'Add to Wishlist'}</span>
                  </button>

                  {/* Go Back Option Button */}
                  <button
                    type="button"
                    onClick={onClose}
                    className="py-2 px-3 rounded-lg text-xs font-bold text-gray-700 hover:text-[#f85606] bg-gray-100 hover:bg-orange-50 border border-gray-200 hover:border-orange-200 transition flex items-center justify-center gap-1.5 cursor-pointer group"
                    title="Go back to products list"
                  >
                    <ArrowLeft className="w-3.5 h-3.5 text-gray-500 group-hover:text-[#f85606] group-hover:-translate-x-0.5 transition-transform" />
                    <span>Go Back to Products</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Right: Nepal Delivery & Warranty Details */}
            <div className="md:col-span-3 bg-gray-50/80 rounded-xl p-4 border border-gray-200 text-xs space-y-4">
              <div>
                <div className="text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-2 flex items-center justify-between">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-[#f85606]" />
                    Delivery Options in Nepal
                  </span>
                  <span className="text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded font-bold">
                    All 7 Provinces
                  </span>
                </div>

                {/* Province Selector */}
                <div className="space-y-1.5 mb-2">
                  <select
                    value={selectedProvince.id}
                    onChange={(e) => {
                      const found = NEPAL_PROVINCES.find(p => p.id === e.target.value);
                      if (found) {
                        setSelectedProvince(found);
                        setSelectedCity(found.cities[0]);
                      }
                    }}
                    className="w-full bg-white border border-gray-300 rounded p-1.5 text-xs text-gray-800 font-semibold outline-none focus:border-[#f85606]"
                  >
                    {NEPAL_PROVINCES.map(p => (
                      <option key={p.id} value={p.id}>
                        {p.name} ({p.nameNp})
                      </option>
                    ))}
                  </select>

                  {/* City Selector */}
                  <select
                    value={selectedCity.city}
                    onChange={(e) => {
                      const found = selectedProvince.cities.find(c => c.city === e.target.value);
                      if (found) setSelectedCity(found);
                    }}
                    className="w-full bg-white border border-gray-300 rounded p-1.5 text-xs text-gray-800 font-medium outline-none focus:border-[#f85606]"
                  >
                    {selectedProvince.cities.map(c => (
                      <option key={c.city} value={c.city}>
                        {c.city} (Est: {c.deliveryTime})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mt-2 space-y-2 bg-white p-2.5 rounded-lg border border-gray-200">
                  {/* Standard Delivery */}
                  <div>
                    <div className="flex items-center justify-between text-gray-800">
                      <span className="font-bold flex items-center gap-1">
                        <Truck className="w-3.5 h-3.5 text-[#f85606]" /> Standard Doorstep:
                      </span>
                      <span className="font-bold text-[#f85606]">
                        {product.isFreeDelivery ? 'FREE' : `Rs. ${selectedCity.baseFee}`}
                      </span>
                    </div>
                    <div className="text-[11px] text-gray-500 pl-4">
                      Estimated: <strong>{selectedCity.deliveryTime}</strong>
                    </div>
                  </div>

                  {/* Express Delivery (if supported) */}
                  {selectedCity.expressAvailable && (
                    <div className="border-t border-gray-100 pt-1.5">
                      <div className="flex items-center justify-between text-gray-800">
                        <span className="font-bold flex items-center gap-1 text-amber-700">
                          <Zap className="w-3.5 h-3.5 text-amber-500" /> Fast Track Express:
                        </span>
                        <span className="font-bold text-amber-600">
                          Rs. {selectedProvince.expressFee || 150}
                        </span>
                      </div>
                      <div className="text-[11px] text-gray-500 pl-4">
                        12 - 24 Hours priority DEX courier
                      </div>
                    </div>
                  )}

                  {/* Collection Hub (if supported) */}
                  {selectedCity.hubPickupAvailable && (
                    <div className="border-t border-gray-100 pt-1.5">
                      <div className="flex items-center justify-between text-gray-800">
                        <span className="font-bold text-[11px] text-indigo-700 flex items-center gap-1">
                          <Building2 className="w-3.5 h-3.5" /> DEX Hub Pickup:
                        </span>
                        <span className="font-bold text-indigo-600 text-[11px]">
                          Rs. 35 / FREE
                        </span>
                      </div>
                      <div className="text-[10px] text-gray-400 pl-4 truncate" title={selectedCity.collectionHubName}>
                        {selectedCity.collectionHubName}
                      </div>
                    </div>
                  )}

                  {/* COD & Free Delivery */}
                  <div className="border-t border-gray-100 pt-1.5 text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
                    <CheckCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>Cash on Delivery (COD) Available across {selectedCity.city}</span>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-3">
                <div className="text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-2 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#f85606]" />
                  Return & Warranty
                </div>

                <div className="space-y-2 text-gray-700">
                  <div className="flex items-start gap-1.5">
                    <RefreshCw className="w-3.5 h-3.5 text-gray-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="font-semibold">14 Days Free Return</div>
                      <div className="text-[10px] text-gray-400">Change of mind not applicable</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#f85606] flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="font-semibold">{product.warranty}</div>
                      <div className="text-[10px] text-gray-400">Authorised Service Centers Nepal</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Methods Accepted */}
              <div className="border-t border-gray-200 pt-3">
                <div className="text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1.5">
                  Secure Nepali Payments
                </div>
                <div className="flex flex-wrap gap-1">
                  <span className="bg-emerald-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded">eSewa</span>
                  <span className="bg-purple-700 text-white text-[9px] font-bold px-1.5 py-0.5 rounded">Khalti</span>
                  <span className="bg-red-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded">IME Pay</span>
                  <span className="bg-blue-800 text-white text-[9px] font-bold px-1.5 py-0.5 rounded">Bank QR</span>
                  <span className="bg-amber-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded">COD</span>
                </div>
              </div>
            </div>

          </div>

          {/* Frequently Bought Together / Cross-sell bundle for Appliances */}
          {recommendedAccessories.length > 0 && (
            <div className="bg-orange-50/50 rounded-xl p-4 border border-orange-200">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-1.5 text-xs font-bold text-gray-800">
                  <Zap className="w-4 h-4 text-[#f85606]" />
                  <span>Frequently Bought Together for Nepali Homes</span>
                </div>
                <span className="text-[11px] text-[#f85606] font-semibold">Recommended by 94% of buyers</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {recommendedAccessories.map(acc => (
                  <div key={acc.id} className="bg-white rounded-lg p-2.5 border border-gray-200 flex items-center justify-between gap-3 shadow-2xs">
                    <div className="flex items-center gap-2.5">
                      <SafeImage src={acc.images[0]} alt={acc.title} className="w-12 h-12 rounded object-cover flex-shrink-0" fallbackText={acc.brand} />
                      <div>
                        <h4 className="text-xs font-medium text-gray-800 line-clamp-1">{acc.title}</h4>
                        <div className="text-xs font-bold text-[#f85606] tabular-nums font-mono">Rs. {acc.price.toLocaleString('en-IN')}</div>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleAddAccessory(acc)}
                      className={`text-xs font-bold px-2.5 py-1.5 rounded transition cursor-pointer flex-shrink-0 flex items-center gap-1 ${
                        addedAccessories[acc.id]
                          ? 'bg-emerald-600 text-white'
                          : 'bg-orange-100 hover:bg-[#f85606] hover:text-white text-[#f85606]'
                      }`}
                    >
                      {addedAccessories[acc.id] ? (
                        <>
                          <Check className="w-3 h-3" />
                          <span>Added</span>
                        </>
                      ) : (
                        <span>+ Add</span>
                      )}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Specifications, Features, and Reviews Tabs */}
          <div className="border-t border-gray-200 pt-4">
            <div className="flex border-b border-gray-200 text-xs font-bold">
              <button
                onClick={() => setActiveTab('specs')}
                className={`pb-2.5 px-4 cursor-pointer transition ${
                  activeTab === 'specs'
                    ? 'border-b-2 border-[#f85606] text-[#f85606]'
                    : 'text-gray-500 hover:text-gray-800'
                }`}
              >
                Specifications
              </button>
              <button
                onClick={() => setActiveTab('features')}
                className={`pb-2.5 px-4 cursor-pointer transition ${
                  activeTab === 'features'
                    ? 'border-b-2 border-[#f85606] text-[#f85606]'
                    : 'text-gray-500 hover:text-gray-800'
                }`}
              >
                Key Highlights & Features
              </button>
              <button
                onClick={() => setActiveTab('reviews')}
                className={`pb-2.5 px-4 cursor-pointer transition ${
                  activeTab === 'reviews'
                    ? 'border-b-2 border-[#f85606] text-[#f85606]'
                    : 'text-gray-500 hover:text-gray-800'
                }`}
              >
                Verified Reviews ({product.reviewCount})
              </button>
            </div>

            <div className="py-4 text-xs">
              {activeTab === 'specs' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2">
                  {Object.entries(product.specs).map(([key, val]) => (
                    <div key={key} className="flex justify-between py-1.5 border-b border-gray-100">
                      <span className="text-gray-500 font-medium">{key}</span>
                      <span className="text-gray-900 font-semibold text-right">{val}</span>
                    </div>
                  ))}
                  <div className="flex justify-between py-1.5 border-b border-gray-100">
                    <span className="text-gray-500 font-medium">Official Brand</span>
                    <span className="text-gray-900 font-semibold">{product.brand}</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-gray-100">
                    <span className="text-gray-500 font-medium">Warranty</span>
                    <span className="text-gray-900 font-semibold">{product.warranty}</span>
                  </div>
                </div>
              )}

              {activeTab === 'features' && (
                <div className="space-y-3">
                  <p className="text-gray-700 leading-relaxed text-xs sm:text-sm">
                    {product.description}
                  </p>
                  <ul className="space-y-2 mt-3">
                    {product.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-2 text-gray-700">
                        <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {activeTab === 'reviews' && (
                <div className="space-y-4">
                  <div className="bg-gray-50 p-4 rounded-lg flex items-center gap-6">
                    <div className="text-center">
                      <div className="text-3xl font-black text-gray-900">{product.rating}</div>
                      <div className="flex text-amber-400 justify-center my-1">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                        ))}
                      </div>
                      <div className="text-[10px] text-gray-500">{product.reviewCount} total ratings</div>
                    </div>
                    <div className="border-l border-gray-200 pl-6 text-xs text-gray-600 space-y-1">
                      <div className="font-semibold text-gray-800">100% Genuine Buyer Feedback</div>
                      <div className="text-emerald-700 font-medium">✓ Verified delivery across Kathmandu, Pokhara, Chitwan</div>
                    </div>
                  </div>

                  <div className="divide-y divide-gray-100 space-y-3">
                    {MOCK_REVIEWS.map(rev => (
                      <div key={rev.id} className="pt-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-gray-800">{rev.userName}</span>
                            {rev.verifiedPurchase && (
                              <span className="bg-emerald-50 text-emerald-700 text-[10px] font-bold px-1.5 py-0.5 rounded">
                                Verified Purchase
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] text-gray-400">{rev.date}</span>
                        </div>
                        <div className="flex text-amber-400 my-1">
                          {[...Array(rev.rating)].map((_, i) => (
                            <Star key={i} className="w-3 h-3 fill-amber-400" />
                          ))}
                        </div>
                        <p className="text-gray-700 text-xs mt-1 leading-relaxed">{rev.comment}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
