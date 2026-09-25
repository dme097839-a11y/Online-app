/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  Sparkles, SlidersHorizontal, ArrowUpDown, CheckCircle, 
  HelpCircle, ShieldCheck, Flame, Zap, ShoppingBag, Heart,
  Tag, Filter, Check
} from 'lucide-react';
import { Product, CartItem, Order } from './types';
import { initialProducts, PROMO_VOUCHERS } from './data/products';
import { CATEGORIES } from './data/categories';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { FlashSale } from './components/FlashSale';
import { DarazMallSection } from './components/DarazMallSection';
import { ProductCard } from './components/ProductCard';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { RecommendationEngineModal } from './components/RecommendationEngineModal';
import { OrderSuccessModal } from './components/OrderSuccessModal';
import { WishlistDrawer } from './components/WishlistDrawer';
import { AuthModal } from './components/AuthModal';
import { AdminPortal } from './components/AdminPortal';
import { MyOrdersModal } from './components/MyOrdersModal';
import { DeliveryNetworkModal } from './components/DeliveryNetworkModal';
import { Footer } from './components/Footer';
import { AuthProvider, useAuth } from './services/authContext';
import { fetchProductsFromFirestore, subscribeToProducts } from './services/firebaseService';

function DarazMainContent() {
  const { userProfile, currentUser, isAdmin } = useAuth();

  // URL-based routing: /admin route handler (accessible anywhere via /admin, #/admin, or ?admin)
  const getInitialPath = () => {
    const path = window.location.pathname.toLowerCase();
    const hash = window.location.hash.toLowerCase();
    const search = window.location.search.toLowerCase();
    if (
      path === '/admin' || 
      path.startsWith('/admin/') || 
      path.endsWith('/admin') || 
      path.endsWith('/admin/') ||
      hash === '#/admin' || 
      hash.startsWith('#/admin') || 
      hash === '#admin' ||
      search.includes('admin=true') ||
      search.includes('admin=1') ||
      search === '?admin'
    ) {
      return '/admin';
    }
    return '/';
  };

  const [currentPath, setCurrentPath] = useState<string>(getInitialPath);

  useEffect(() => {
    const handleLocationChange = () => {
      setCurrentPath(getInitialPath());
    };
    window.addEventListener('popstate', handleLocationChange);
    window.addEventListener('hashchange', handleLocationChange);
    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('hashchange', handleLocationChange);
    };
  }, []);

  const navigateTo = (path: string) => {
    window.history.pushState({}, '', path);
    setCurrentPath(path);
  };

  // Products from Firebase Firestore (Realtime Synchronized)
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [loadingProducts, setLoadingProducts] = useState(false);

  useEffect(() => {
    setLoadingProducts(true);
    const unsubscribe = subscribeToProducts(
      (items) => {
        if (items && items.length > 0) {
          setProducts(items);
        }
        setLoadingProducts(false);
      },
      (err) => {
        console.error('Realtime products listener error:', err);
        setLoadingProducts(false);
      }
    );
    return () => unsubscribe();
  }, []);

  // Persistent Cart & Wishlist
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('daraz_cart');
      return saved ? JSON.parse(saved) : [
        { product: initialProducts[0], quantity: 1 }
      ];
    } catch {
      return [{ product: initialProducts[0], quantity: 1 }];
    }
  });

  const [wishlistIds, setWishlistIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('daraz_wishlist');
      return saved ? JSON.parse(saved) : ['fridge-samsung-253l', 'wash-lg-8kg-front-load'];
    } catch {
      return ['fridge-samsung-253l', 'wash-lg-8kg-front-load'];
    }
  });

  const [claimedVouchers, setClaimedVouchers] = useState<string[]>(['DARAZNEW150']);

  useEffect(() => {
    try {
      localStorage.setItem('daraz_cart', JSON.stringify(cartItems));
    } catch {
      // ignore
    }
  }, [cartItems]);

  useEffect(() => {
    try {
      localStorage.setItem('daraz_wishlist', JSON.stringify(wishlistIds));
    } catch {
      // ignore
    }
  }, [wishlistIds]);

  // UI Modals State
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isAIAdvisorOpen, setIsAIAdvisorOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isMyOrdersOpen, setIsMyOrdersOpen] = useState(false);
  const [isDeliveryGuideOpen, setIsDeliveryGuideOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [activeOrder, setActiveOrder] = useState<Order | null>(null);

  // Language State
  const [language, setLanguage] = useState<'en' | 'np'>('en');

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedBrand, setSelectedBrand] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'popular' | 'price-asc' | 'price-desc' | 'rating'>('popular');
  const [freeDeliveryOnly, setFreeDeliveryOnly] = useState(false);
  const [darazMallOnly, setDarazMallOnly] = useState(false);

  // Toast Notification State
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2800);
  };

  // Cart Actions
  const handleAddToCart = (product: Product, quantityOrEvent?: number | React.MouseEvent) => {
    if (!product || !product.id) return;
    const qty = (typeof quantityOrEvent === 'number' && !isNaN(quantityOrEvent) && quantityOrEvent > 0)
      ? Math.floor(quantityOrEvent)
      : 1;

    setCartItems(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + qty }
            : item
        );
      }
      return [...prev, { product, quantity: qty }];
    });
    showToast(`✓ Added ${qty} × "${(product.title || 'Item').slice(0, 24)}..." to Cart! 🛒`);
  };

  const handleBuyNow = (product: Product, quantity: number) => {
    handleAddToCart(product, quantity);
    setSelectedProduct(null);
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  const handleUpdateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveItem(productId);
      return;
    }
    setCartItems(prev =>
      prev.map(it => it.product.id === productId ? { ...it, quantity } : it)
    );
  };

  const handleRemoveItem = (productId: string) => {
    setCartItems(prev => prev.filter(it => it.product.id !== productId));
    showToast('Item removed from Cart');
  };

  // Wishlist Actions
  const handleToggleWishlist = (productId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setWishlistIds(prev => {
      const exists = prev.includes(productId);
      if (exists) {
        showToast('Removed from Wishlist');
        return prev.filter(id => id !== productId);
      } else {
        showToast('Saved to Wishlist ❤️');
        return [...prev, productId];
      }
    });
  };

  const handleClaimVoucher = (code: string) => {
    if (!claimedVouchers.includes(code)) {
      setClaimedVouchers(prev => [...prev, code]);
      showToast(`Voucher ${code} collected successfully! 🎉`);
    }
  };

  // Checkout Flow
  const [checkoutVoucherDiscount, setCheckoutVoucherDiscount] = useState<number>(0);

  const handleProceedCheckout = (_voucherCode?: string, discount?: number) => {
    setCheckoutVoucherDiscount(discount || 0);
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  const handleOrderSuccess = (order: Order) => {
    setActiveOrder(order);
    setIsCheckoutOpen(false);
    setCartItems([]);
  };

  // Filtered Products Memo
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Category filter
    if (selectedCategory !== 'all') {
      result = result.filter(p => p.category === selectedCategory || p.subcategory?.toLowerCase().includes(selectedCategory.toLowerCase()));
    }

    // Brand filter
    if (selectedBrand !== 'all') {
      result = result.filter(p => p.brand.toLowerCase() === selectedBrand.toLowerCase());
    }

    // Free delivery filter
    if (freeDeliveryOnly) {
      result = result.filter(p => p.isFreeDelivery);
    }

    // Daraz Mall filter
    if (darazMallOnly) {
      result = result.filter(p => p.isDarazMall);
    }

    // Search query
    if (searchQuery.trim().length > 0) {
      const q = searchQuery.toLowerCase();
      result = result.filter(p =>
        p.title.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.subcategory?.toLowerCase().includes(q) ||
        p.description?.toLowerCase().includes(q) ||
        (p.tags && p.tags.some(t => t.toLowerCase().includes(q)))
      );
    }

    // Sort order
    if (sortBy === 'price-asc') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'rating') {
      result.sort((a, b) => b.rating - a.rating);
    } else {
      result.sort((a, b) => (b.rating * b.reviewCount) - (a.rating * a.reviewCount));
    }

    return result;
  }, [products, selectedCategory, selectedBrand, freeDeliveryOnly, darazMallOnly, searchQuery, sortBy]);

  // Wishlisted products list
  const wishlistedProducts = useMemo(() => {
    return products.filter(p => wishlistIds.includes(p.id));
  }, [products, wishlistIds]);

  // Available brands in current filtered or total list
  const availableBrands = useMemo(() => {
    const brandsSet = new Set<string>();
    products.forEach(p => {
      if (p.brand) brandsSet.add(p.brand);
    });
    return Array.from(brandsSet);
  }, [products]);

  // ==================== ROUTE: /admin ====================
  if (currentPath === '/admin') {
    return (
      <AdminPortal
        onExit={() => navigateTo('/')}
        onProductsUpdated={() => {}}
      />
    );
  }

  // ==================== ROUTE: / (PUBLIC STORE) ====================
  return (
    <div className="min-h-screen bg-[#F5F5F5] text-gray-800 flex flex-col font-sans selection:bg-[#F85606] selection:text-white">
      
      {/* Toast Notification with top-priority z-index */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-[9999] bg-gray-900/95 text-white px-4 py-3 rounded-xl shadow-2xl text-xs sm:text-sm flex items-center gap-2.5 border border-orange-500/30 animate-slide-up backdrop-blur-md">
          <Check className="w-4 h-4 text-[#F85606] shrink-0" />
          <span className="font-medium">{toastMessage}</span>
        </div>
      )}

      {/* Main Header */}
      <Header
        cartItems={cartItems}
        wishlistCount={wishlistIds.length}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenWishlist={() => setIsWishlistOpen(true)}
        onOpenAIAdvisor={() => setIsAIAdvisorOpen(true)}
        onOpenMyOrders={() => setIsMyOrdersOpen(true)}
        onOpenDeliveryGuide={() => setIsDeliveryGuideOpen(true)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onSelectCategory={(cat) => {
          setSelectedCategory(cat);
          if (cat !== 'all') {
            document.getElementById('catalog-section')?.scrollIntoView({ behavior: 'smooth' });
          }
        }}
        selectedCategory={selectedCategory}
        language={language}
        onToggleLanguage={() => setLanguage(l => l === 'en' ? 'np' : 'en')}
        onOpenAuth={() => setIsAuthOpen(true)}
      />

      {/* Hero Section with Slider, Vouchers, & Categories flyout */}
      <HeroSection
        onSelectCategory={(cat) => {
          setSelectedCategory(cat);
          document.getElementById('catalog-section')?.scrollIntoView({ behavior: 'smooth' });
        }}
        selectedCategory={selectedCategory}
        onClaimVoucher={handleClaimVoucher}
        claimedVouchers={claimedVouchers}
        language={language}
      />

      {/* Flash Sale Section */}
      <FlashSale
        products={products}
        onSelectProduct={setSelectedProduct}
        onAddToCart={(p, e) => handleAddToCart(p, e)}
        language={language}
      />

      {/* Daraz Mall Official Store Brands */}
      <DarazMallSection
        language={language}
        onSelectBrand={(brand) => {
          setSelectedBrand(brand);
          document.getElementById('catalog-section')?.scrollIntoView({ behavior: 'smooth' });
        }}
      />

      {/* Main Catalog / Just For You Section */}
      <main id="catalog-section" className="max-w-7xl mx-auto px-4 py-8 flex-1 w-full">
        
        {/* Section Heading & Sorting Bar */}
        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-2xs mb-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-black text-gray-900 flex items-center gap-2">
                <span>{language === 'en' ? 'Just For You' : 'तपाईंको लागि मात्र'}</span>
                <span className="text-xs font-normal text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                  {filteredProducts.length} items
                </span>
                {loadingProducts && (
                  <span className="text-xs text-[#F85606] animate-pulse">Syncing...</span>
                )}
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">
                {language === 'en'
                  ? 'Refrigerators, Washing Machines, Electronics & Everyday essentials with authentic warranty'
                  : 'फ्रिज, वासिङ मेसिन, इलेक्ट्रोनिक्स र आधिकारिक वारेन्टीसहितका सामानहरू'}
              </p>
            </div>

            {/* Filters & Sorting */}
            <div className="flex flex-wrap items-center gap-2.5 text-xs">
              
              {/* Category Pill select */}
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="bg-gray-50 border border-gray-200 rounded-lg px-2.5 py-1.5 font-medium text-gray-700 outline-none focus:border-[#F85606]"
              >
                <option value="all">All Categories</option>
                <option value="appliances">Appliances (Freezer, Washer)</option>
                <option value="electronic-devices">Smartphones & TVs</option>
                <option value="accessories">Appliance Accessories</option>
                <option value="fashion">Fashion & Lifestyle</option>
                <option value="groceries">Groceries & Tea</option>
              </select>

              {/* Brand filter */}
              <select
                value={selectedBrand}
                onChange={(e) => setSelectedBrand(e.target.value)}
                className="bg-gray-50 border border-gray-200 rounded-lg px-2.5 py-1.5 font-medium text-gray-700 outline-none focus:border-[#F85606]"
              >
                <option value="all">All Brands</option>
                {availableBrands.map(b => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>

              {/* Sort Order */}
              <div className="flex items-center gap-1 bg-gray-50 border border-gray-200 rounded-lg px-2 py-1">
                <ArrowUpDown className="w-3.5 h-3.5 text-gray-500" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="bg-transparent font-medium text-gray-700 outline-none cursor-pointer"
                >
                  <option value="popular">Popularity</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="rating">Customer Rating</option>
                </select>
              </div>

              {/* Toggle: Daraz Mall */}
              <button
                onClick={() => setDarazMallOnly(!darazMallOnly)}
                className={`px-3 py-1.5 rounded-lg border font-semibold transition cursor-pointer flex items-center gap-1 ${
                  darazMallOnly 
                    ? 'bg-red-50 border-red-300 text-red-700' 
                    : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5 text-red-600" />
                <span>Mall Only</span>
              </button>

              {/* Toggle: Free Delivery */}
              <button
                onClick={() => setFreeDeliveryOnly(!freeDeliveryOnly)}
                className={`px-3 py-1.5 rounded-lg border font-semibold transition cursor-pointer flex items-center gap-1 ${
                  freeDeliveryOnly 
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-700' 
                    : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Zap className="w-3.5 h-3.5 text-emerald-600" />
                <span>Free Delivery</span>
              </button>

              {/* Reset Filters */}
              {(selectedCategory !== 'all' || selectedBrand !== 'all' || freeDeliveryOnly || darazMallOnly || searchQuery) && (
                <button
                  onClick={() => {
                    setSelectedCategory('all');
                    setSelectedBrand('all');
                    setFreeDeliveryOnly(false);
                    setDarazMallOnly(false);
                    setSearchQuery('');
                  }}
                  className="text-[#F85606] hover:underline font-semibold px-2 py-1"
                >
                  Reset
                </button>
              )}

            </div>
          </div>
        </div>

        {/* Product Cards Grid */}
        {filteredProducts.length === 0 ? (
          <div className="bg-white rounded-xl p-12 text-center border border-gray-100 shadow-2xs my-6">
            <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-gray-800">No matching products found</h3>
            <p className="text-xs text-gray-500 mt-1 max-w-md mx-auto">
              We couldn't find anything matching your filters or search term "{searchQuery}". Try selecting "All Categories" or reset your search.
            </p>
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSelectedBrand('all');
                setSearchQuery('');
                setFreeDeliveryOnly(false);
                setDarazMallOnly(false);
              }}
              className="mt-4 bg-[#F85606] text-white text-xs font-bold px-4 py-2 rounded-lg hover:bg-[#d44300] transition"
            >
              Show All Products
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {filteredProducts.map((product) => {
              const inCart = cartItems.find(it => it.product.id === product.id);
              const cartQuantity = inCart ? inCart.quantity : 0;
              return (
                <ProductCard
                  key={product.id}
                  product={product}
                  onSelect={setSelectedProduct}
                  onAddToCart={(p, e) => handleAddToCart(p, e)}
                  onUpdateQuantity={handleUpdateQuantity}
                  cartQuantity={cartQuantity}
                  onToggleWishlist={handleToggleWishlist}
                  isWishlisted={wishlistIds.includes(product.id)}
                  language={language}
                />
              );
            })}
          </div>
        )}

      </main>

      {/* Modals */}
      
      {/* Product Detail Modal */}
      <ProductDetailModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={(p, qty) => handleAddToCart(p, qty)}
        onBuyNow={handleBuyNow}
        onToggleWishlist={handleToggleWishlist}
        isWishlisted={selectedProduct ? wishlistIds.includes(selectedProduct.id) : false}
        language={language}
        allProducts={products}
        onSelectProduct={setSelectedProduct}
        cartItemQuantity={selectedProduct ? (cartItems.find(it => it.product.id === selectedProduct.id)?.quantity || 0) : 0}
        onOpenCart={() => {
          setSelectedProduct(null);
          setIsCartOpen(true);
        }}
      />

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onProceedCheckout={handleProceedCheckout}
        language={language}
      />

      {/* Wishlist Drawer */}
      <WishlistDrawer
        isOpen={isWishlistOpen}
        onClose={() => setIsWishlistOpen(false)}
        wishlistedProducts={wishlistedProducts}
        onRemoveFromWishlist={(id) => {
          setWishlistIds(prev => prev.filter(i => i !== id));
          showToast('Removed from Wishlist');
        }}
        onAddToCart={(p, e) => {
          e.stopPropagation();
          handleAddToCart(p, 1);
        }}
        language={language}
      />

      {/* Checkout Modal with Secure Gateways (eSewa, Khalti, IME Pay, Bank QR, COD) */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cartItems={cartItems}
        voucherDiscount={checkoutVoucherDiscount}
        onOrderSuccess={handleOrderSuccess}
        language={language}
      />

      {/* Recommendation Engine Modal */}
      <RecommendationEngineModal
        isOpen={isAIAdvisorOpen}
        onClose={() => setIsAIAdvisorOpen(false)}
        onSelectProduct={setSelectedProduct}
        onAddToCart={(p, e) => handleAddToCart(p, e)}
        language={language}
      />

      {/* Order Success Confirmation & Tracking */}
      <OrderSuccessModal
        order={activeOrder}
        onClose={() => setActiveOrder(null)}
        language={language}
      />

      {/* Real Customer Auth Modal (Zero Demo Shortcuts) */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        language={language}
      />

      {/* Customer My Orders Modal */}
      <MyOrdersModal
        isOpen={isMyOrdersOpen}
        onClose={() => setIsMyOrdersOpen(false)}
        language={language}
      />

      {/* Nepal Delivery Network & Province Guide Modal */}
      <DeliveryNetworkModal
        isOpen={isDeliveryGuideOpen}
        onClose={() => setIsDeliveryGuideOpen(false)}
        language={language}
      />

      {/* Footer */}
      <Footer 
        language={language} 
        onOpenDeliveryGuide={() => setIsDeliveryGuideOpen(true)}
      />

    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <DarazMainContent />
    </AuthProvider>
  );
}
