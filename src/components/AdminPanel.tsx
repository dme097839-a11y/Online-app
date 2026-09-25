import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Package, 
  ShoppingBag, 
  QrCode, 
  Plus, 
  Trash2, 
  Edit, 
  CheckCircle, 
  Clock, 
  Truck, 
  AlertCircle, 
  Upload, 
  Save, 
  RotateCcw, 
  Search, 
  Filter, 
  ExternalLink,
  DollarSign,
  Tag,
  ShieldCheck,
  Eye,
  Check,
  Image as ImageIcon
} from 'lucide-react';
import { Product, Order, PaymentGatewaysConfig } from '../types';
import { 
  fetchProductsFromFirestore, 
  addProductToFirestore, 
  updateProductInFirestore, 
  deleteProductFromFirestore, 
  seedInitialProducts,
  fetchAllOrders,
  updateOrderInFirestore,
  deleteOrderFromFirestore,
  fetchPaymentGatewaysConfig,
  savePaymentGatewaysConfig,
  DEFAULT_PAYMENT_GATEWAYS,
  subscribeToProducts,
  subscribeToOrders
} from '../services/firebaseService';

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onProductsUpdated?: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ isOpen, onClose, onProductsUpdated }) => {
  const [activeTab, setActiveTab] = useState<'orders' | 'products' | 'payment_qrs'>('orders');
  
  // Data states
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [gatewaysConfig, setGatewaysConfig] = useState<PaymentGatewaysConfig>(DEFAULT_PAYMENT_GATEWAYS);
  const [loading, setLoading] = useState(false);
  const [saveSuccessMessage, setSaveSuccessMessage] = useState<string | null>(null);

  // Orders tab states
  const [orderFilter, setOrderFilter] = useState<string>('all');
  const [orderSearch, setOrderSearch] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Products tab states
  const [productSearch, setProductSearch] = useState('');
  const [productCategoryFilter, setProductCategoryFilter] = useState('all');
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Product form states
  const [pTitle, setPTitle] = useState('');
  const [pTitleNp, setPTitleNp] = useState('');
  const [pCategory, setPCategory] = useState('appliances');
  const [pSubcategory, setPSubcategory] = useState('refrigerator');
  const [pBrand, setPBrand] = useState('');
  const [pPrice, setPPrice] = useState<number>(0);
  const [pOriginalPrice, setPOriginalPrice] = useState<number>(0);
  const [pDiscountPercent, setPDiscountPercent] = useState<number>(15);
  const [pStock, setPStock] = useState<number>(10);
  const [pImage, setPImage] = useState('');
  const [pDarazMall, setPDarazMall] = useState(true);
  const [pFlashSale, setPFlashSale] = useState(false);
  const [pFreeDelivery, setPFreeDelivery] = useState(true);
  const [pWarranty, setPWarranty] = useState('1 Year Official Brand Warranty');
  const [pDescription, setPDescription] = useState('');
  const [pSpecs, setPSpecs] = useState<string>('Capacity: 250L\nEnergy Rating: 4 Star\nInverter: Smart Inverter Technology');

  // Quick preset discount options as requested (5, 10, 15, 20, 25, 30, ...)
  const DISCOUNT_OPTIONS = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80];

  const handleDiscountSelect = (percent: number) => {
    setPDiscountPercent(percent);
    if (percent === 0) {
      if (pOriginalPrice > 0) {
        setPPrice(pOriginalPrice);
      }
      return;
    }
    if (pOriginalPrice > 0) {
      const computedPrice = Math.round(pOriginalPrice * (1 - percent / 100));
      setPPrice(computedPrice);
    } else if (pPrice > 0) {
      const computedOriginal = Math.round(pPrice / (1 - percent / 100));
      setPOriginalPrice(computedOriginal);
    }
  };

  const handlePriceChange = (newPrice: number) => {
    setPPrice(newPrice);
    if (pOriginalPrice > newPrice && pOriginalPrice > 0) {
      const disc = Math.round(((pOriginalPrice - newPrice) / pOriginalPrice) * 100);
      setPDiscountPercent(disc);
    }
  };

  const handleOriginalPriceChange = (newOriginal: number) => {
    setPOriginalPrice(newOriginal);
    if (newOriginal > pPrice && pPrice > 0) {
      const disc = Math.round(((newOriginal - pPrice) / newOriginal) * 100);
      setPDiscountPercent(disc);
    } else if (pDiscountPercent > 0 && newOriginal > 0) {
      const computedPrice = Math.round(newOriginal * (1 - pDiscountPercent / 100));
      setPPrice(computedPrice);
    }
  };

  // File upload refs
  const esewaFileRef = useRef<HTMLInputElement>(null);
  const khaltiFileRef = useRef<HTMLInputElement>(null);
  const imeFileRef = useRef<HTMLInputElement>(null);
  const bankFileRef = useRef<HTMLInputElement>(null);
  const productImageFileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    fetchPaymentGatewaysConfig()
      .then(setGatewaysConfig)
      .catch(console.error);

    setLoading(true);
    const unsubProducts = subscribeToProducts(
      (prods) => {
        setProducts(prods);
        setLoading(false);
      },
      (err) => {
        console.error('Products subscription error:', err);
        setLoading(false);
      }
    );

    const unsubOrders = subscribeToOrders(
      (ords) => {
        setOrders(ords);
      },
      (err) => {
        console.error('Orders subscription error:', err);
      }
    );

    return () => {
      unsubProducts();
      unsubOrders();
    };
  }, [isOpen]);

  const handleRefresh = async () => {
    setLoading(true);
    try {
      const [ords, prods] = await Promise.all([
        fetchAllOrders(),
        fetchProductsFromFirestore()
      ]);
      setOrders(ords);
      setProducts(prods);
      showToast('Data synchronized from Firebase Firestore');
    } catch (err) {
      console.error('Refresh error:', err);
    } finally {
      setLoading(false);
    }
  };

  const showToast = (msg: string) => {
    setSaveSuccessMessage(msg);
    setTimeout(() => setSaveSuccessMessage(null), 3500);
  };

  // Convert uploaded image file to data URL
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, callback: (url: string) => void) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (loadEvent) => {
        if (loadEvent.target?.result) {
          callback(loadEvent.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // ==================== PRODUCT ACTIONS ====================

  const openAddProductModal = () => {
    setEditingProduct(null);
    setPTitle('');
    setPTitleNp('');
    setPCategory('appliances');
    setPSubcategory('refrigerator');
    setPBrand('Samsung');
    setPPrice(35000);
    setPOriginalPrice(42000);
    setPDiscountPercent(17);
    setPStock(15);
    setPImage('https://images.unsplash.com/photo-1584992236310-6edddc08acff?w=600&auto=format&fit=crop&q=80');
    setPDarazMall(true);
    setPFlashSale(false);
    setPFreeDelivery(true);
    setPWarranty('1 Year Official Brand Warranty');
    setPDescription('Official Nepal warranty product with high energy efficiency.');
    setPSpecs('Capacity: 250L\nCompressor: Digital Inverter\nCooling: Frost Free');
    setIsProductModalOpen(true);
  };

  const openEditProductModal = (product: Product) => {
    setEditingProduct(product);
    setPTitle(product.title);
    setPTitleNp(product.titleNp || '');
    setPCategory(product.category);
    setPSubcategory(product.subcategory);
    setPBrand(product.brand);
    setPPrice(product.price);
    setPOriginalPrice(product.originalPrice);
    const initialDiscount = product.discountPercent || (
      product.originalPrice > product.price 
        ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
        : 0
    );
    setPDiscountPercent(initialDiscount);
    setPStock(product.stockCount || 10);
    setPImage(product.images[0] || '');
    setPDarazMall(product.isDarazMall ?? false);
    setPFlashSale(product.isFlashSale ?? false);
    setPFreeDelivery(product.isFreeDelivery ?? true);
    setPWarranty(product.warranty || '1 Year Brand Warranty');
    setPDescription(product.description || '');
    
    // convert specs record to string
    const specsString = product.specs 
      ? Object.entries(product.specs).map(([k, v]) => `${k}: ${v}`).join('\n')
      : '';
    setPSpecs(specsString);
    setIsProductModalOpen(true);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pTitle.trim() || pPrice <= 0) {
      alert('Please fill valid product title and price');
      return;
    }

    // Parse specs
    const specsObj: Record<string, string> = {};
    pSpecs.split('\n').forEach(line => {
      const parts = line.split(':');
      if (parts.length >= 2) {
        specsObj[parts[0].trim()] = parts.slice(1).join(':').trim();
      }
    });

    const origPrice = pOriginalPrice > pPrice ? pOriginalPrice : (pDiscountPercent > 0 ? Math.round(pPrice / (1 - pDiscountPercent / 100)) : pPrice);
    const discountPercent = pDiscountPercent > 0 
      ? pDiscountPercent 
      : (origPrice > pPrice ? Math.round(((origPrice - pPrice) / origPrice) * 100) : 0);

    const productPayload: Omit<Product, 'id'> = {
      title: pTitle,
      titleNp: pTitleNp,
      category: pCategory,
      subcategory: pSubcategory,
      brand: pBrand || 'Generic',
      price: Number(pPrice),
      originalPrice: Number(origPrice),
      discountPercent: Number(discountPercent),
      rating: editingProduct?.rating || 4.8,
      reviewCount: editingProduct?.reviewCount || 12,
      images: [pImage.trim() || 'https://images.unsplash.com/photo-1584992236310-6edddc08acff?w=600&auto=format&fit=crop&q=80'],
      inStock: pStock > 0,
      stockCount: Number(pStock),
      isDarazMall: pDarazMall,
      isFlashSale: pFlashSale,
      isFreeDelivery: pFreeDelivery,
      warranty: pWarranty,
      specs: specsObj,
      description: pDescription || `${pTitle} with official Nepal warranty and fast delivery across Nepal.`,
      features: ['Official Brand Warranty', 'Fast Delivery Across Nepal', '100% Authentic Product'],
      tags: [pCategory, pSubcategory, pBrand.toLowerCase()]
    };

    setLoading(true);
    try {
      if (editingProduct) {
        await updateProductInFirestore(editingProduct.id, productPayload);
        showToast(`Updated "${pTitle}" successfully!`);
      } else {
        await addProductToFirestore(productPayload);
        showToast(`Added new product "${pTitle}" successfully!`);
      }
      setIsProductModalOpen(false);
      if (onProductsUpdated) onProductsUpdated();
    } catch (err) {
      console.error('Failed to save product:', err);
      alert('Error saving product to Firebase.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (id: string, title: string) => {
    if (!window.confirm(`Are you sure you want to permanently delete "${title}"?`)) return;
    setLoading(true);
    try {
      await deleteProductFromFirestore(id);
      showToast(`Deleted "${title}" from catalog.`);
      if (onProductsUpdated) onProductsUpdated();
    } catch (err) {
      console.error('Failed to delete product:', err);
      alert('Could not delete product.');
    } finally {
      setLoading(false);
    }
  };

  const handleSeedDefaults = async () => {
    if (!window.confirm('Reset/seed standard NepalMart products catalog into Firebase Firestore?')) return;
    setLoading(true);
    try {
      await seedInitialProducts();
      showToast('Firebase catalog successfully populated with default products!');
      if (onProductsUpdated) onProductsUpdated();
    } catch (err) {
      console.error('Failed to seed:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickToggleStock = async (prod: Product) => {
    const newInStock = !prod.inStock;
    const newStockCount = newInStock ? (prod.stockCount > 0 ? prod.stockCount : 15) : 0;
    try {
      await updateProductInFirestore(prod.id, {
        inStock: newInStock,
        stockCount: newStockCount
      });
      showToast(`Updated stock status for "${prod.title}"`);
    } catch (err) {
      console.error('Failed to toggle stock:', err);
    }
  };

  const handleQuickToggleFlashSale = async (prod: Product) => {
    const newFlashSale = !prod.isFlashSale;
    try {
      await updateProductInFirestore(prod.id, {
        isFlashSale: newFlashSale
      });
      showToast(`Flash sale ${newFlashSale ? 'activated' : 'deactivated'} for "${prod.title}"`);
    } catch (err) {
      console.error('Failed to toggle flash sale:', err);
    }
  };

  // ==================== ORDER ACTIONS ====================

  const handleUpdateOrderStatus = async (orderId: string, status: Order['status']) => {
    try {
      await updateOrderInFirestore(orderId, { status });
      setOrders(orders.map(o => o.id === orderId ? { ...o, status } : o));
      if (selectedOrder?.id === orderId) {
        setSelectedOrder({ ...selectedOrder, status });
      }
      showToast(`Order status updated to "${status.toUpperCase()}"`);
    } catch (err) {
      console.error('Error updating order:', err);
      alert('Failed to update order status');
    }
  };

  const handleUpdatePaymentStatus = async (orderId: string, paymentStatus: Order['paymentStatus']) => {
    try {
      await updateOrderInFirestore(orderId, { paymentStatus });
      setOrders(orders.map(o => o.id === orderId ? { ...o, paymentStatus } : o));
      if (selectedOrder?.id === orderId) {
        setSelectedOrder({ ...selectedOrder, paymentStatus });
      }
      showToast(`Payment marked as "${paymentStatus.toUpperCase()}"`);
    } catch (err) {
      console.error('Error updating payment status:', err);
    }
  };

  const handleDeleteOrder = async (orderId: string) => {
    if (!window.confirm('Delete this order record permanently?')) return;
    try {
      await deleteOrderFromFirestore(orderId);
      setOrders(orders.filter(o => o.id !== orderId));
      if (selectedOrder?.id === orderId) setSelectedOrder(null);
      showToast('Order removed from database.');
    } catch (err) {
      console.error('Error deleting order:', err);
    }
  };

  // ==================== PAYMENT QR SETTINGS ====================

  const handleSavePaymentSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await savePaymentGatewaysConfig(gatewaysConfig);
      showToast('Payment QR codes and merchant details saved to Firebase Firestore!');
    } catch (err) {
      console.error('Failed to save payment settings:', err);
      alert('Error saving payment settings.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  // Filtered orders
  const filteredOrders = orders.filter(order => {
    const matchesFilter = orderFilter === 'all' || order.status === orderFilter;
    const matchesSearch = !orderSearch.trim() || 
      order.trackingNumber.toLowerCase().includes(orderSearch.toLowerCase()) ||
      order.shippingAddress.fullName.toLowerCase().includes(orderSearch.toLowerCase()) ||
      order.shippingAddress.phoneNumber.includes(orderSearch);
    return matchesFilter && matchesSearch;
  });

  // Filtered products
  const filteredProducts = products.filter(prod => {
    const matchesCategory = productCategoryFilter === 'all' || prod.category === productCategoryFilter;
    const matchesSearch = !productSearch.trim() ||
      prod.title.toLowerCase().includes(productSearch.toLowerCase()) ||
      prod.brand.toLowerCase().includes(productSearch.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex justify-center items-start p-2 sm:p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-6xl my-4 flex flex-col max-h-[92vh] overflow-hidden border border-gray-200">
        
        {/* Header */}
        <div className="bg-[#F85606] text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-2 rounded-lg">
              <ShieldCheck className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold flex items-center gap-2">
                NepalMart Seller & Admin Control Center
                <span className="bg-white/25 text-xs px-2.5 py-0.5 rounded-full font-mono flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-pulse"></span>
                  Firebase: nepalmart
                </span>
              </h2>
              <p className="text-xs text-orange-100">
                Manage orders, customer payments, upload QR codes, and edit catalog products in real-time
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="text-white/80 hover:text-white hover:bg-white/10 p-2 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Success Alert Banner */}
        {saveSuccessMessage && (
          <div className="bg-emerald-50 border-b border-emerald-200 text-emerald-800 px-6 py-2.5 text-sm font-medium flex items-center gap-2 animate-fadeIn">
            <Check className="w-4 h-4 text-emerald-600" />
            {saveSuccessMessage}
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="flex border-b border-gray-200 bg-gray-50 px-6">
          <button
            onClick={() => setActiveTab('orders')}
            className={`py-3.5 px-5 font-semibold text-sm flex items-center gap-2 border-b-2 transition-colors ${
              activeTab === 'orders'
                ? 'border-[#F85606] text-[#F85606] bg-white'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            Orders Management
            <span className="ml-1 bg-orange-100 text-[#F85606] px-2 py-0.5 rounded-full text-xs font-bold">
              {orders.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('products')}
            className={`py-3.5 px-5 font-semibold text-sm flex items-center gap-2 border-b-2 transition-colors ${
              activeTab === 'products'
                ? 'border-[#F85606] text-[#F85606] bg-white'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            <Package className="w-4 h-4" />
            Products & Pricing
            <span className="ml-1 bg-gray-200 text-gray-700 px-2 py-0.5 rounded-full text-xs font-bold">
              {products.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('payment_qrs')}
            className={`py-3.5 px-5 font-semibold text-sm flex items-center gap-2 border-b-2 transition-colors ${
              activeTab === 'payment_qrs'
                ? 'border-[#F85606] text-[#F85606] bg-white'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            <QrCode className="w-4 h-4" />
            Payment QR & Gateways
            <span className="ml-1 bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full text-xs font-bold">
              Live QR
            </span>
          </button>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto p-6 bg-gray-50/50">

          {/* ========================================================= */}
          {/* TAB 1: ORDERS MANAGEMENT */}
          {/* ========================================================= */}
          {activeTab === 'orders' && (
            <div className="space-y-4">
              {/* Filter & Search Bar */}
              <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2 flex-1 min-w-[260px]">
                  <Search className="w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search by Tracking #, Customer Name or Phone..."
                    value={orderSearch}
                    onChange={(e) => setOrderSearch(e.target.value)}
                    className="w-full text-sm border-0 focus:ring-0 focus:outline-none"
                  />
                  {orderSearch && (
                    <button onClick={() => setOrderSearch('')} className="text-xs text-gray-400 hover:text-gray-600">
                      Clear
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-2 overflow-x-auto">
                  <Filter className="w-4 h-4 text-gray-400 shrink-0" />
                  {['all', 'placed', 'confirmed', 'packed', 'shipped', 'delivered', 'cancelled'].map((st) => (
                    <button
                      key={st}
                      onClick={() => setOrderFilter(st)}
                      className={`text-xs capitalize px-3 py-1.5 rounded-lg font-medium transition-all ${
                        orderFilter === st
                          ? 'bg-[#F85606] text-white shadow-xs'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                  <button 
                    onClick={handleRefresh}
                    className="p-1.5 text-gray-500 hover:text-gray-800 rounded-lg hover:bg-gray-100 cursor-pointer"
                    title="Refresh Orders from Firebase"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Orders Table & Details Split View */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Orders List */}
                <div className="lg:col-span-2 space-y-3">
                  {loading && orders.length === 0 ? (
                    <div className="bg-white p-12 text-center rounded-xl border border-gray-200 text-gray-500">
                      <div className="animate-spin w-6 h-6 border-2 border-[#F85606] border-t-transparent rounded-full mx-auto mb-2" />
                      Loading orders from Firestore...
                    </div>
                  ) : filteredOrders.length === 0 ? (
                    <div className="bg-white p-12 text-center rounded-xl border border-gray-200">
                      <ShoppingBag className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                      <h4 className="text-gray-700 font-semibold">No orders found</h4>
                      <p className="text-xs text-gray-500 mt-1">
                        When customers checkout using eSewa, Khalti, IME Pay, Bank QR or COD, their orders appear here in real-time.
                      </p>
                    </div>
                  ) : (
                    filteredOrders.map((order) => {
                      const isSelected = selectedOrder?.id === order.id;
                      return (
                        <div
                          key={order.id}
                          onClick={() => setSelectedOrder(order)}
                          className={`bg-white p-4 rounded-xl border transition-all cursor-pointer hover:shadow-md ${
                            isSelected
                              ? 'border-[#F85606] ring-1 ring-[#F85606] shadow-sm'
                              : 'border-gray-200'
                          }`}
                        >
                          <div className="flex items-start justify-between">
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-mono font-bold text-gray-900 text-sm">
                                  {order.trackingNumber}
                                </span>
                                <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                                  order.status === 'delivered' ? 'bg-emerald-100 text-emerald-800' :
                                  order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                                  order.status === 'packed' ? 'bg-purple-100 text-purple-800' :
                                  order.status === 'confirmed' ? 'bg-amber-100 text-amber-800' :
                                  order.status === 'cancelled' ? 'bg-rose-100 text-rose-800' :
                                  'bg-orange-100 text-orange-800'
                                }`}>
                                  {order.status}
                                </span>
                                <span className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full ${
                                  order.paymentStatus === 'paid' || order.paymentStatus === 'verified'
                                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                    : 'bg-amber-50 text-amber-700 border border-amber-200'
                                }`}>
                                  {order.paymentStatus}
                                </span>
                              </div>
                              <p className="text-xs text-gray-500 mt-1">
                                Customer: <strong className="text-gray-800">{order.shippingAddress.fullName}</strong> ({order.shippingAddress.phoneNumber})
                              </p>
                              <p className="text-xs text-gray-500">
                                Date: {new Date(order.createdAt).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })}
                              </p>
                            </div>
                            <div className="text-right">
                              <span className="text-base font-bold text-[#F85606]">
                                Rs. {order.total.toLocaleString()}
                              </span>
                              <div className="text-xs uppercase font-medium text-gray-500 mt-1">
                                {order.paymentMethod.replace('_', ' ')}
                              </div>
                            </div>
                          </div>

                          {/* Quick item preview */}
                          <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-600">
                            <span className="truncate max-w-[340px]">
                              {order.items.length} item(s): {order.items.map(i => `${i.product.title} (x${i.quantity})`).join(', ')}
                            </span>
                            <span className="text-[#F85606] font-medium hover:underline flex items-center gap-1">
                              View Details &rarr;
                            </span>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>

                {/* Order Details Drawer / Card */}
                <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm space-y-4">
                  {selectedOrder ? (
                    <>
                      <div className="flex items-center justify-between border-b pb-3">
                        <div>
                          <span className="text-xs text-gray-500">Order Details</span>
                          <h4 className="font-mono font-bold text-gray-900">{selectedOrder.trackingNumber}</h4>
                        </div>
                        <button
                          onClick={() => setSelectedOrder(null)}
                          className="text-gray-400 hover:text-gray-600 p-1"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Status updates */}
                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-gray-700 block">Change Delivery Status</label>
                        <select
                          value={selectedOrder.status}
                          onChange={(e) => handleUpdateOrderStatus(selectedOrder.id, e.target.value as Order['status'])}
                          className="w-full text-xs font-medium border border-gray-300 rounded-lg p-2 bg-gray-50 focus:bg-white focus:ring-1 focus:ring-[#F85606]"
                        >
                          <option value="placed">Placed (Order Received)</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="packed">Packed at Hub</option>
                          <option value="shipped">Shipped via DEX Courier</option>
                          <option value="delivered">Delivered to Customer</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-gray-700 block">Payment Verification</label>
                        <select
                          value={selectedOrder.paymentStatus}
                          onChange={(e) => handleUpdatePaymentStatus(selectedOrder.id, e.target.value as Order['paymentStatus'])}
                          className="w-full text-xs font-medium border border-gray-300 rounded-lg p-2 bg-gray-50 focus:bg-white focus:ring-1 focus:ring-[#F85606]"
                        >
                          <option value="pending">Pending Payment Verification</option>
                          <option value="verified">Verified (Txn Checked)</option>
                          <option value="paid">Paid & Completed</option>
                          <option value="failed">Failed / Invalid Slip</option>
                        </select>
                      </div>

                      {/* Payment Verification Details */}
                      <div className="bg-orange-50/60 p-3 rounded-lg border border-orange-100 text-xs space-y-1.5">
                        <div className="font-semibold text-gray-800 flex items-center justify-between">
                          <span>Gateway:</span>
                          <span className="uppercase text-[#F85606] font-bold">
                            {selectedOrder.paymentMethod.replace('_', ' ')}
                          </span>
                        </div>
                        {selectedOrder.transactionId && (
                          <div className="flex items-center justify-between">
                            <span className="text-gray-600">Transaction ID:</span>
                            <span className="font-mono font-bold text-gray-900 bg-white px-2 py-0.5 rounded border border-orange-200">
                              {selectedOrder.transactionId}
                            </span>
                          </div>
                        )}
                        {selectedOrder.paymentSlipUrl && (
                          <div className="pt-2">
                            <span className="text-gray-600 block mb-1 font-semibold">Payment Slip Screenshot:</span>
                            <a 
                              href={selectedOrder.paymentSlipUrl} 
                              target="_blank" 
                              rel="noreferrer"
                              className="block group relative overflow-hidden rounded border border-gray-200 bg-black/5"
                            >
                              <img 
                                src={selectedOrder.paymentSlipUrl} 
                                alt="Payment Slip" 
                                className="w-full h-36 object-contain rounded bg-white"
                              />
                              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-xs font-medium transition-opacity">
                                Click to View Full Slip
                              </div>
                            </a>
                          </div>
                        )}
                      </div>

                      {/* Customer & Shipping info */}
                      <div className="space-y-1.5 text-xs text-gray-700 bg-gray-50 p-3 rounded-lg border border-gray-200">
                        <div className="font-semibold text-gray-900 border-b pb-1">Delivery Address</div>
                        <p><strong>Name:</strong> {selectedOrder.shippingAddress.fullName}</p>
                        <p><strong>Phone:</strong> {selectedOrder.shippingAddress.phoneNumber}</p>
                        <p><strong>Address:</strong> {selectedOrder.shippingAddress.streetAddress}, {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.province}</p>
                        {selectedOrder.shippingAddress.landmark && (
                          <p><strong>Landmark:</strong> {selectedOrder.shippingAddress.landmark}</p>
                        )}
                      </div>

                      {/* Items List */}
                      <div className="space-y-2">
                        <div className="text-xs font-semibold text-gray-800">Purchased Items ({selectedOrder.items.length})</div>
                        <div className="max-h-48 overflow-y-auto space-y-2 pr-1">
                          {selectedOrder.items.map((item, idx) => (
                            <div key={idx} className="flex items-center gap-2 text-xs border-b pb-2">
                              <img 
                                src={item.product.images[0]} 
                                alt={item.product.title} 
                                className="w-10 h-10 object-contain rounded border border-gray-200 shrink-0 bg-white"
                              />
                              <div className="flex-1 min-w-0">
                                <p className="font-medium text-gray-900 truncate">{item.product.title}</p>
                                <p className="text-gray-500">Qty: {item.quantity} &times; Rs. {item.product.price.toLocaleString()}</p>
                              </div>
                              <span className="font-semibold text-gray-800">
                                Rs. {(item.quantity * item.product.price).toLocaleString()}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Total */}
                      <div className="pt-2 border-t flex justify-between items-center text-sm font-bold">
                        <span>Total Paid:</span>
                        <span className="text-[#F85606] text-base">Rs. {selectedOrder.total.toLocaleString()}</span>
                      </div>

                      {/* Delete Order */}
                      <div className="pt-2">
                        <button
                          onClick={() => handleDeleteOrder(selectedOrder.id)}
                          className="w-full text-xs text-rose-600 hover:text-rose-800 hover:bg-rose-50 py-2 rounded-lg font-medium transition-colors flex items-center justify-center gap-1.5"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          Delete Order Record
                        </button>
                      </div>
                    </>
                  ) : (
                    <div className="py-16 text-center text-gray-400">
                      <Eye className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                      <p className="text-xs font-medium">Select an order from the list to view customer info, verify payment slip, or change DEX delivery status.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 2: PRODUCTS & PRICING */}
          {/* ========================================================= */}
          {activeTab === 'products' && (
            <div className="space-y-4">
              {/* Product Top Action Bar */}
              <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3 flex-1 min-w-[280px]">
                  <Search className="w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search product by title, brand (e.g. Samsung, LG, Baltra)..."
                    value={productSearch}
                    onChange={(e) => setProductSearch(e.target.value)}
                    className="w-full text-sm border-0 focus:ring-0 focus:outline-none"
                  />
                  {productSearch && (
                    <button onClick={() => setProductSearch('')} className="text-xs text-gray-400 hover:text-gray-600">
                      Clear
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <select
                    value={productCategoryFilter}
                    onChange={(e) => setProductCategoryFilter(e.target.value)}
                    className="text-xs border border-gray-300 rounded-lg px-2.5 py-1.5 bg-gray-50 text-gray-700"
                  >
                    <option value="all">All Categories</option>
                    <option value="appliances">Appliances (Refrigerators, Washers)</option>
                    <option value="electronics">Electronics (TVs, Audio)</option>
                    <option value="phones">Mobile Phones & Tablets</option>
                    <option value="accessories">Appliance Protection Accessories</option>
                    <option value="fashion">Fashion & Lifestyle</option>
                    <option value="groceries">Groceries & Tea</option>
                  </select>

                  <button
                    onClick={openAddProductModal}
                    className="bg-[#F85606] hover:bg-[#d94800] text-white text-xs font-bold px-4 py-2 rounded-lg flex items-center gap-1.5 transition-colors shadow-sm"
                  >
                    <Plus className="w-4 h-4" />
                    Add Product
                  </button>

                  <button
                    onClick={handleSeedDefaults}
                    className="text-gray-600 hover:text-gray-900 border border-gray-300 hover:bg-gray-100 text-xs font-medium px-3 py-2 rounded-lg flex items-center gap-1.5 transition-colors"
                    title="Seed standard Daraz products into Firebase"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    Reset Catalog
                  </button>
                </div>
              </div>

              {/* Products Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredProducts.map((prod) => (
                  <div 
                    key={prod.id} 
                    className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
                  >
                    <div>
                      {/* Product Header / Image */}
                      <div className="h-44 bg-gray-50 relative p-3 flex items-center justify-center border-b border-gray-100">
                        <img 
                          src={prod.images[0] || 'https://images.unsplash.com/photo-1584992236310-6edddc08acff?w=600&auto=format&fit=crop&q=80'} 
                          alt={prod.title} 
                          className="max-h-full max-w-full object-contain mix-blend-multiply" 
                        />
                        {prod.isDarazMall && (
                          <span className="absolute top-2 left-2 bg-[#d12420] text-white text-[10px] font-bold px-1.5 py-0.5 rounded shadow-xs uppercase">
                            Mall
                          </span>
                        )}
                        {prod.discountPercent > 0 && (
                          <span className="absolute top-2 right-2 bg-[#F85606] text-white text-[10px] font-bold px-1.5 py-0.5 rounded shadow-xs">
                            -{prod.discountPercent}% OFF
                          </span>
                        )}
                      </div>

                      {/* Content */}
                      <div className="p-3.5 space-y-2">
                        <div className="flex items-center justify-between text-[11px] text-gray-500">
                          <span className="font-semibold text-gray-700 uppercase">{prod.brand}</span>
                          <span className="capitalize bg-gray-100 px-2 py-0.5 rounded-full">{prod.subcategory}</span>
                        </div>
                        <h4 className="text-xs font-semibold text-gray-900 line-clamp-2 leading-snug">
                          {prod.title}
                        </h4>
                        
                        <div className="flex items-baseline gap-2">
                          <span className="text-sm font-bold text-[#F85606]">
                            Rs. {prod.price.toLocaleString()}
                          </span>
                          {prod.originalPrice > prod.price && (
                            <span className="text-[11px] text-gray-400 line-through">
                              Rs. {prod.originalPrice.toLocaleString()}
                            </span>
                          )}
                        </div>

                        <div className="text-[11px] text-gray-500 flex items-center justify-between pt-1">
                          <span>Stock: <strong className={prod.stockCount > 0 ? 'text-emerald-600' : 'text-rose-600'}>{prod.stockCount} units</strong></span>
                          <span>Rating: ⭐ {prod.rating}</span>
                        </div>
                      </div>
                    </div>

                    {/* Quick Realtime Toggles */}
                    <div className="px-3 py-2 bg-gray-50 border-t border-gray-100 flex items-center justify-between text-[11px] gap-2">
                      <button
                        type="button"
                        onClick={() => handleQuickToggleStock(prod)}
                        className={`px-2 py-1 rounded text-[10px] font-bold transition flex items-center gap-1 cursor-pointer border ${
                          prod.inStock
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                            : 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100'
                        }`}
                        title="Click to toggle In Stock / Out of Stock in realtime"
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${prod.inStock ? 'bg-emerald-500' : 'bg-rose-500'}`}></span>
                        {prod.inStock ? 'In Stock' : 'Out of Stock'}
                      </button>

                      <button
                        type="button"
                        onClick={() => handleQuickToggleFlashSale(prod)}
                        className={`px-2 py-1 rounded text-[10px] font-bold transition flex items-center gap-1 cursor-pointer border ${
                          prod.isFlashSale
                            ? 'bg-orange-50 text-[#F85606] border-orange-200 hover:bg-orange-100'
                            : 'bg-gray-100 text-gray-500 border-gray-200 hover:bg-gray-200'
                        }`}
                        title="Click to toggle Flash Sale showcase in realtime"
                      >
                        ⚡ {prod.isFlashSale ? 'Flash Sale ON' : 'Flash Sale OFF'}
                      </button>
                    </div>

                    {/* Action Bar */}
                    <div className="p-3 bg-white border-t border-gray-100 flex items-center justify-between gap-2">
                      <button
                        onClick={() => openEditProductModal(prod)}
                        className="flex-1 bg-white hover:bg-gray-100 border border-gray-200 text-gray-800 text-xs font-semibold py-1.5 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <Edit className="w-3.5 h-3.5 text-blue-600" />
                        Edit & Price
                      </button>

                      <button
                        onClick={() => handleDeleteProduct(prod.id, prod.title)}
                        className="bg-white hover:bg-rose-50 border border-gray-200 text-rose-600 text-xs font-medium p-1.5 rounded-lg flex items-center justify-center transition-colors cursor-pointer"
                        title="Delete product permanently from Firebase catalog"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 3: PAYMENT QR & GATEWAYS */}
          {/* ========================================================= */}
          {activeTab === 'payment_qrs' && (
            <form onSubmit={handleSavePaymentSettings} className="space-y-6 max-w-4xl mx-auto">
              
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-xs text-amber-900 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold">Production Ready Payment Gateway & QR System</h4>
                  <p className="mt-0.5 text-amber-800">
                    Uploaded QR codes, merchant names, and phone numbers are stored in Firebase Firestore and automatically displayed to customers at checkout. Customers can scan your QR code with eSewa, Khalti, IME Pay, or their Mobile Banking app, and submit their transaction ID / screenshot slip.
                  </p>
                </div>
              </div>

              {/* 1. eSewa Configuration */}
              <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b pb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-[#60BB46] flex items-center justify-center text-white font-bold text-xs">
                      eS
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 text-sm">eSewa Mobile Wallet & QR Code</h3>
                      <p className="text-xs text-gray-500">Nepal's #1 digital wallet payment gateway</p>
                    </div>
                  </div>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <span className="text-xs text-gray-600 font-medium">Active in Checkout</span>
                    <input
                      type="checkbox"
                      checked={gatewaysConfig.esewa.active}
                      onChange={(e) => setGatewaysConfig({
                        ...gatewaysConfig,
                        esewa: { ...gatewaysConfig.esewa, active: e.target.checked }
                      })}
                      className="rounded text-[#F85606] focus:ring-[#F85606] w-4 h-4"
                    />
                  </label>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-700">eSewa Merchant Name</label>
                    <input
                      type="text"
                      value={gatewaysConfig.esewa.accountName}
                      onChange={(e) => setGatewaysConfig({
                        ...gatewaysConfig,
                        esewa: { ...gatewaysConfig.esewa, accountName: e.target.value }
                      })}
                      className="w-full text-xs border border-gray-300 rounded-lg p-2.5 focus:ring-1 focus:ring-[#F85606]"
                      placeholder="e.g. DARAZ NEPAL OFFICIAL STORE"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-700">eSewa Registered Number / ID</label>
                    <input
                      type="text"
                      value={gatewaysConfig.esewa.accountNumber}
                      onChange={(e) => setGatewaysConfig({
                        ...gatewaysConfig,
                        esewa: { ...gatewaysConfig.esewa, accountNumber: e.target.value }
                      })}
                      className="w-full text-xs border border-gray-300 rounded-lg p-2.5 focus:ring-1 focus:ring-[#F85606]"
                      placeholder="e.g. 9841234567"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-700">QR Code Image</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={gatewaysConfig.esewa.qrCodeUrl}
                        onChange={(e) => setGatewaysConfig({
                          ...gatewaysConfig,
                          esewa: { ...gatewaysConfig.esewa, qrCodeUrl: e.target.value }
                        })}
                        className="w-full text-xs border border-gray-300 rounded-lg p-2 focus:ring-1 focus:ring-[#F85606]"
                        placeholder="Image URL or upload below"
                      />
                      <input
                        type="file"
                        ref={esewaFileRef}
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleFileUpload(e, (url) => {
                          setGatewaysConfig({
                            ...gatewaysConfig,
                            esewa: { ...gatewaysConfig.esewa, qrCodeUrl: url }
                          });
                        })}
                      />
                      <button
                        type="button"
                        onClick={() => esewaFileRef.current?.click()}
                        className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-lg text-xs font-medium shrink-0 flex items-center gap-1"
                      >
                        <Upload className="w-3.5 h-3.5" /> Upload
                      </button>
                    </div>
                  </div>
                </div>

                {/* QR Preview & Instructions */}
                <div className="flex items-center gap-4 bg-gray-50 p-3 rounded-lg border border-gray-200">
                  <img
                    src={gatewaysConfig.esewa.qrCodeUrl || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&auto=format&fit=crop&q=80'}
                    alt="eSewa QR Preview"
                    className="w-20 h-20 object-contain rounded bg-white border border-gray-300 p-1"
                  />
                  <div className="flex-1 space-y-1">
                    <label className="text-xs font-semibold text-gray-700">Customer Instructions (shown on checkout)</label>
                    <textarea
                      rows={2}
                      value={gatewaysConfig.esewa.instructions}
                      onChange={(e) => setGatewaysConfig({
                        ...gatewaysConfig,
                        esewa: { ...gatewaysConfig.esewa, instructions: e.target.value }
                      })}
                      className="w-full text-xs border border-gray-300 rounded-lg p-2 focus:ring-1 focus:ring-[#F85606]"
                    />
                  </div>
                </div>
              </div>

              {/* 2. Khalti Configuration */}
              <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b pb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-[#5C2D91] flex items-center justify-center text-white font-bold text-xs">
                      Kh
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 text-sm">Khalti Digital Wallet & QR Code</h3>
                      <p className="text-xs text-gray-500">Popular digital wallet across youth and urban Nepal</p>
                    </div>
                  </div>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <span className="text-xs text-gray-600 font-medium">Active in Checkout</span>
                    <input
                      type="checkbox"
                      checked={gatewaysConfig.khalti.active}
                      onChange={(e) => setGatewaysConfig({
                        ...gatewaysConfig,
                        khalti: { ...gatewaysConfig.khalti, active: e.target.checked }
                      })}
                      className="rounded text-[#F85606] focus:ring-[#F85606] w-4 h-4"
                    />
                  </label>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-700">Khalti Account Name</label>
                    <input
                      type="text"
                      value={gatewaysConfig.khalti.accountName}
                      onChange={(e) => setGatewaysConfig({
                        ...gatewaysConfig,
                        khalti: { ...gatewaysConfig.khalti, accountName: e.target.value }
                      })}
                      className="w-full text-xs border border-gray-300 rounded-lg p-2.5 focus:ring-1 focus:ring-[#F85606]"
                      placeholder="e.g. DARAZ NEPAL E-COMMERCE"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-700">Khalti Registered Number</label>
                    <input
                      type="text"
                      value={gatewaysConfig.khalti.accountNumber}
                      onChange={(e) => setGatewaysConfig({
                        ...gatewaysConfig,
                        khalti: { ...gatewaysConfig.khalti, accountNumber: e.target.value }
                      })}
                      className="w-full text-xs border border-gray-300 rounded-lg p-2.5 focus:ring-1 focus:ring-[#F85606]"
                      placeholder="e.g. 9801234567"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-700">QR Code Image</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={gatewaysConfig.khalti.qrCodeUrl}
                        onChange={(e) => setGatewaysConfig({
                          ...gatewaysConfig,
                          khalti: { ...gatewaysConfig.khalti, qrCodeUrl: e.target.value }
                        })}
                        className="w-full text-xs border border-gray-300 rounded-lg p-2 focus:ring-1 focus:ring-[#F85606]"
                      />
                      <input
                        type="file"
                        ref={khaltiFileRef}
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleFileUpload(e, (url) => {
                          setGatewaysConfig({
                            ...gatewaysConfig,
                            khalti: { ...gatewaysConfig.khalti, qrCodeUrl: url }
                          });
                        })}
                      />
                      <button
                        type="button"
                        onClick={() => khaltiFileRef.current?.click()}
                        className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-lg text-xs font-medium shrink-0 flex items-center gap-1"
                      >
                        <Upload className="w-3.5 h-3.5" /> Upload
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 bg-gray-50 p-3 rounded-lg border border-gray-200">
                  <img
                    src={gatewaysConfig.khalti.qrCodeUrl || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&auto=format&fit=crop&q=80'}
                    alt="Khalti QR Preview"
                    className="w-20 h-20 object-contain rounded bg-white border border-gray-300 p-1"
                  />
                  <div className="flex-1 space-y-1">
                    <label className="text-xs font-semibold text-gray-700">Instructions</label>
                    <textarea
                      rows={2}
                      value={gatewaysConfig.khalti.instructions}
                      onChange={(e) => setGatewaysConfig({
                        ...gatewaysConfig,
                        khalti: { ...gatewaysConfig.khalti, instructions: e.target.value }
                      })}
                      className="w-full text-xs border border-gray-300 rounded-lg p-2 focus:ring-1 focus:ring-[#F85606]"
                    />
                  </div>
                </div>
              </div>

              {/* 3. IME Pay Configuration */}
              <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b pb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-[#E31E24] flex items-center justify-center text-white font-bold text-xs">
                      IME
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 text-sm">IME Pay Wallet & QR Code</h3>
                      <p className="text-xs text-gray-500">IME Group digital payment system</p>
                    </div>
                  </div>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <span className="text-xs text-gray-600 font-medium">Active in Checkout</span>
                    <input
                      type="checkbox"
                      checked={gatewaysConfig.ime_pay.active}
                      onChange={(e) => setGatewaysConfig({
                        ...gatewaysConfig,
                        ime_pay: { ...gatewaysConfig.ime_pay, active: e.target.checked }
                      })}
                      className="rounded text-[#F85606] focus:ring-[#F85606] w-4 h-4"
                    />
                  </label>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-700">IME Pay Account Name</label>
                    <input
                      type="text"
                      value={gatewaysConfig.ime_pay.accountName}
                      onChange={(e) => setGatewaysConfig({
                        ...gatewaysConfig,
                        ime_pay: { ...gatewaysConfig.ime_pay, accountName: e.target.value }
                      })}
                      className="w-full text-xs border border-gray-300 rounded-lg p-2.5 focus:ring-1 focus:ring-[#F85606]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-700">IME Pay Number</label>
                    <input
                      type="text"
                      value={gatewaysConfig.ime_pay.accountNumber}
                      onChange={(e) => setGatewaysConfig({
                        ...gatewaysConfig,
                        ime_pay: { ...gatewaysConfig.ime_pay, accountNumber: e.target.value }
                      })}
                      className="w-full text-xs border border-gray-300 rounded-lg p-2.5 focus:ring-1 focus:ring-[#F85606]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-700">QR Code Image</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={gatewaysConfig.ime_pay.qrCodeUrl}
                        onChange={(e) => setGatewaysConfig({
                          ...gatewaysConfig,
                          ime_pay: { ...gatewaysConfig.ime_pay, qrCodeUrl: e.target.value }
                        })}
                        className="w-full text-xs border border-gray-300 rounded-lg p-2 focus:ring-1 focus:ring-[#F85606]"
                      />
                      <input
                        type="file"
                        ref={imeFileRef}
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleFileUpload(e, (url) => {
                          setGatewaysConfig({
                            ...gatewaysConfig,
                            ime_pay: { ...gatewaysConfig.ime_pay, qrCodeUrl: url }
                          });
                        })}
                      />
                      <button
                        type="button"
                        onClick={() => imeFileRef.current?.click()}
                        className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-lg text-xs font-medium shrink-0 flex items-center gap-1"
                      >
                        <Upload className="w-3.5 h-3.5" /> Upload
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 bg-gray-50 p-3 rounded-lg border border-gray-200">
                  <img
                    src={gatewaysConfig.ime_pay.qrCodeUrl || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&auto=format&fit=crop&q=80'}
                    alt="IME Pay QR Preview"
                    className="w-20 h-20 object-contain rounded bg-white border border-gray-300 p-1"
                  />
                  <div className="flex-1 space-y-1">
                    <label className="text-xs font-semibold text-gray-700">Instructions</label>
                    <textarea
                      rows={2}
                      value={gatewaysConfig.ime_pay.instructions}
                      onChange={(e) => setGatewaysConfig({
                        ...gatewaysConfig,
                        ime_pay: { ...gatewaysConfig.ime_pay, instructions: e.target.value }
                      })}
                      className="w-full text-xs border border-gray-300 rounded-lg p-2 focus:ring-1 focus:ring-[#F85606]"
                    />
                  </div>
                </div>
              </div>

              {/* 4. Bank Fonepay QR Configuration */}
              <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b pb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-[#1A4480] flex items-center justify-center text-white font-bold text-xs">
                      QR
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 text-sm">Bank Fonepay Merchant QR</h3>
                      <p className="text-xs text-gray-500">Universal QR readable by all Nepali commercial banks</p>
                    </div>
                  </div>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <span className="text-xs text-gray-600 font-medium">Active in Checkout</span>
                    <input
                      type="checkbox"
                      checked={gatewaysConfig.bank_qr.active}
                      onChange={(e) => setGatewaysConfig({
                        ...gatewaysConfig,
                        bank_qr: { ...gatewaysConfig.bank_qr, active: e.target.checked }
                      })}
                      className="rounded text-[#F85606] focus:ring-[#F85606] w-4 h-4"
                    />
                  </label>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-700">Bank Name</label>
                    <input
                      type="text"
                      value={gatewaysConfig.bank_qr.bankName}
                      onChange={(e) => setGatewaysConfig({
                        ...gatewaysConfig,
                        bank_qr: { ...gatewaysConfig.bank_qr, bankName: e.target.value }
                      })}
                      className="w-full text-xs border border-gray-300 rounded-lg p-2.5 focus:ring-1 focus:ring-[#F85606]"
                      placeholder="e.g. Nabil Bank / Fonepay"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-700">Account Name</label>
                    <input
                      type="text"
                      value={gatewaysConfig.bank_qr.accountName}
                      onChange={(e) => setGatewaysConfig({
                        ...gatewaysConfig,
                        bank_qr: { ...gatewaysConfig.bank_qr, accountName: e.target.value }
                      })}
                      className="w-full text-xs border border-gray-300 rounded-lg p-2.5 focus:ring-1 focus:ring-[#F85606]"
                      placeholder="e.g. DARAZ NEPAL ONLINE PVT LTD"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-700">Account Number</label>
                    <input
                      type="text"
                      value={gatewaysConfig.bank_qr.accountNumber}
                      onChange={(e) => setGatewaysConfig({
                        ...gatewaysConfig,
                        bank_qr: { ...gatewaysConfig.bank_qr, accountNumber: e.target.value }
                      })}
                      className="w-full text-xs border border-gray-300 rounded-lg p-2.5 focus:ring-1 focus:ring-[#F85606]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-700">QR Code Image</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={gatewaysConfig.bank_qr.qrCodeUrl}
                        onChange={(e) => setGatewaysConfig({
                          ...gatewaysConfig,
                          bank_qr: { ...gatewaysConfig.bank_qr, qrCodeUrl: e.target.value }
                        })}
                        className="w-full text-xs border border-gray-300 rounded-lg p-2 focus:ring-1 focus:ring-[#F85606]"
                      />
                      <input
                        type="file"
                        ref={bankFileRef}
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleFileUpload(e, (url) => {
                          setGatewaysConfig({
                            ...gatewaysConfig,
                            bank_qr: { ...gatewaysConfig.bank_qr, qrCodeUrl: url }
                          });
                        })}
                      />
                      <button
                        type="button"
                        onClick={() => bankFileRef.current?.click()}
                        className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-lg text-xs font-medium shrink-0 flex items-center gap-1"
                      >
                        <Upload className="w-3.5 h-3.5" /> Upload
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 bg-gray-50 p-3 rounded-lg border border-gray-200">
                  <img
                    src={gatewaysConfig.bank_qr.qrCodeUrl || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&auto=format&fit=crop&q=80'}
                    alt="Bank QR Preview"
                    className="w-20 h-20 object-contain rounded bg-white border border-gray-300 p-1"
                  />
                  <div className="flex-1 space-y-1">
                    <label className="text-xs font-semibold text-gray-700">Instructions</label>
                    <textarea
                      rows={2}
                      value={gatewaysConfig.bank_qr.instructions}
                      onChange={(e) => setGatewaysConfig({
                        ...gatewaysConfig,
                        bank_qr: { ...gatewaysConfig.bank_qr, instructions: e.target.value }
                      })}
                      className="w-full text-xs border border-gray-300 rounded-lg p-2 focus:ring-1 focus:ring-[#F85606]"
                    />
                  </div>
                </div>
              </div>

              {/* Save Button */}
              <div className="sticky bottom-0 bg-white/90 backdrop-blur-sm p-4 rounded-xl border border-gray-200 flex items-center justify-between shadow-lg">
                <span className="text-xs text-gray-500">
                  All changes are securely synchronized to your Firebase Firestore project.
                </span>
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-[#F85606] hover:bg-[#d94800] text-white px-6 py-2.5 rounded-lg font-bold text-xs flex items-center gap-2 shadow-sm transition-all"
                >
                  <Save className="w-4 h-4" />
                  {loading ? 'Saving...' : 'Save Payment Gateways & QR Codes'}
                </button>
              </div>

            </form>
          )}

        </div>
      </div>

      {/* ========================================================= */}
      {/* ADD / EDIT PRODUCT MODAL */}
      {/* ========================================================= */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-60 bg-black/70 backdrop-blur-xs flex items-center justify-center p-3">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-gray-200">
            <div className="bg-[#F85606] text-white px-5 py-3.5 flex items-center justify-between">
              <h3 className="font-bold text-sm">
                {editingProduct ? `Edit Product: ${editingProduct.title}` : 'Add New Product to Store'}
              </h3>
              <button 
                onClick={() => setIsProductModalOpen(false)}
                className="text-white/80 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="p-5 space-y-4 text-xs">
              
              {/* Title & Nepali Title */}
              <div className="space-y-1">
                <label className="font-semibold text-gray-800">Product Title *</label>
                <input
                  type="text"
                  required
                  value={pTitle}
                  onChange={(e) => setPTitle(e.target.value)}
                  placeholder="e.g. Samsung 253L Digital Inverter Double Door Refrigerator"
                  className="w-full border border-gray-300 rounded-lg p-2.5 text-xs focus:ring-1 focus:ring-[#F85606]"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-gray-800">Nepali Title (optional)</label>
                <input
                  type="text"
                  value={pTitleNp}
                  onChange={(e) => setPTitleNp(e.target.value)}
                  placeholder="e.g. सामसुङ २५३ लिटर इन्भर्टर डबल डोर फ्रिज"
                  className="w-full border border-gray-300 rounded-lg p-2 text-xs focus:ring-1 focus:ring-[#F85606]"
                />
              </div>

              {/* Categories & Brand */}
              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-gray-800">Category</label>
                  <select
                    value={pCategory}
                    onChange={(e) => setPCategory(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg p-2 text-xs"
                  >
                    <option value="appliances">Appliances (Freezer, Washer)</option>
                    <option value="electronics">Electronics (TV, Audio)</option>
                    <option value="phones">Mobile Phones & Tablets</option>
                    <option value="accessories">Protection & Accessories</option>
                    <option value="fashion">Fashion & Lifestyle</option>
                    <option value="groceries">Groceries & Tea</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-gray-800">Subcategory</label>
                  <input
                    type="text"
                    value={pSubcategory}
                    onChange={(e) => setPSubcategory(e.target.value)}
                    placeholder="e.g. refrigerator, washing_machine"
                    className="w-full border border-gray-300 rounded-lg p-2 text-xs"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-gray-800">Brand</label>
                  <input
                    type="text"
                    value={pBrand}
                    onChange={(e) => setPBrand(e.target.value)}
                    placeholder="e.g. Samsung, LG, Baltra, CG"
                    className="w-full border border-gray-300 rounded-lg p-2 text-xs"
                  />
                </div>
              </div>

              {/* Price, Original Price, and Interactive Computed Discount Selector */}
              <div className="bg-orange-50/60 p-3.5 rounded-xl border border-orange-200/80 space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <label className="font-bold text-gray-800 flex items-center justify-between">
                      <span>Selling Price (Rs.) *</span>
                    </label>
                    <input
                      type="number"
                      required
                      min={1}
                      value={pPrice}
                      onChange={(e) => handlePriceChange(Number(e.target.value))}
                      className="w-full border border-gray-300 rounded-lg p-2 text-xs font-bold text-[#F85606] bg-white outline-none focus:border-[#F85606]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-semibold text-gray-700">Original / M.R.P. (Rs.)</label>
                    <input
                      type="number"
                      min={0}
                      value={pOriginalPrice}
                      onChange={(e) => handleOriginalPriceChange(Number(e.target.value))}
                      className="w-full border border-gray-300 rounded-lg p-2 text-xs bg-white outline-none focus:border-[#F85606]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-semibold text-gray-700 flex items-center justify-between">
                      <span>Computed Discount</span>
                      <span className="text-emerald-700 font-bold">{pDiscountPercent}% OFF</span>
                    </label>
                    <select
                      value={pDiscountPercent}
                      onChange={(e) => handleDiscountSelect(Number(e.target.value))}
                      className="w-full border border-emerald-300 bg-white rounded-lg p-2 text-xs font-bold text-emerald-800 outline-none focus:border-emerald-500 cursor-pointer"
                    >
                      {DISCOUNT_OPTIONS.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt === 0 ? '0% - No Discount' : `${opt}% OFF Discount`}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Quick preset discount pills (5, 10, 15, 20, 25, 30, ...) */}
                <div className="pt-1 border-t border-orange-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-gray-500 text-[11px] font-medium mr-1">Quick Select %:</span>
                    {[5, 10, 15, 20, 25, 30, 40, 50, 60, 70].map((disc) => (
                      <button
                        key={disc}
                        type="button"
                        onClick={() => handleDiscountSelect(disc)}
                        className={`px-2 py-0.5 rounded text-[11px] font-bold transition cursor-pointer ${
                          pDiscountPercent === disc
                            ? 'bg-[#F85606] text-white shadow-xs'
                            : 'bg-white hover:bg-orange-100 text-gray-700 border border-gray-200'
                        }`}
                      >
                        {disc}%
                      </button>
                    ))}
                    <button
                      type="button"
                      onClick={() => handleDiscountSelect(0)}
                      className={`px-2 py-0.5 rounded text-[11px] font-medium transition cursor-pointer ${
                        pDiscountPercent === 0
                          ? 'bg-gray-800 text-white shadow-xs'
                          : 'bg-white hover:bg-gray-100 text-gray-500 border border-gray-200'
                      }`}
                    >
                      Clear
                    </button>
                  </div>

                  {/* Savings preview */}
                  {pOriginalPrice > pPrice && (
                    <div className="text-[11px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-semibold whitespace-nowrap">
                      Saves Rs. {(pOriginalPrice - pPrice).toLocaleString()} ({pDiscountPercent}% OFF)
                    </div>
                  )}
                </div>
              </div>

              {/* Stock and Image */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-gray-800">Available Stock Count</label>
                  <input
                    type="number"
                    min={0}
                    value={pStock}
                    onChange={(e) => setPStock(Number(e.target.value))}
                    className="w-full border border-gray-300 rounded-lg p-2 text-xs"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-gray-800">Warranty</label>
                  <input
                    type="text"
                    value={pWarranty}
                    onChange={(e) => setPWarranty(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg p-2 text-xs"
                    placeholder="e.g. 1 Year Official Warranty"
                  />
                </div>
              </div>

              {/* Image URL and File Upload */}
              <div className="space-y-1">
                <label className="font-semibold text-gray-800">Product Image URL</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    required
                    value={pImage}
                    onChange={(e) => setPImage(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="flex-1 border border-gray-300 rounded-lg p-2 text-xs"
                  />
                  <input
                    type="file"
                    ref={productImageFileRef}
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleFileUpload(e, (url) => setPImage(url))}
                  />
                  <button
                    type="button"
                    onClick={() => productImageFileRef.current?.click()}
                    className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-3 py-2 rounded-lg text-xs font-semibold flex items-center gap-1"
                  >
                    <Upload className="w-3.5 h-3.5" /> Upload File
                  </button>
                </div>
              </div>

              {/* Badges / Checkboxes */}
              <div className="flex items-center gap-6 py-1">
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={pDarazMall}
                    onChange={(e) => setPDarazMall(e.target.checked)}
                    className="rounded text-[#F85606]"
                  />
                  <span className="font-medium text-gray-800">Daraz Mall (100% Authentic)</span>
                </label>

                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={pFlashSale}
                    onChange={(e) => setPFlashSale(e.target.checked)}
                    className="rounded text-[#F85606]"
                  />
                  <span className="font-medium text-gray-800">Flash Sale Item</span>
                </label>

                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={pFreeDelivery}
                    onChange={(e) => setPFreeDelivery(e.target.checked)}
                    className="rounded text-[#F85606]"
                  />
                  <span className="font-medium text-gray-800">Free Delivery</span>
                </label>
              </div>

              {/* Technical Specifications (key: value) */}
              <div className="space-y-1">
                <label className="font-semibold text-gray-800">
                  Specifications (one per line, format: Key: Value)
                </label>
                <textarea
                  rows={3}
                  value={pSpecs}
                  onChange={(e) => setPSpecs(e.target.value)}
                  placeholder="Capacity: 253 Liters&#10;Door Type: Double Door&#10;Inverter: Yes&#10;Star Rating: 4 Star"
                  className="w-full border border-gray-300 rounded-lg p-2 font-mono text-[11px]"
                />
              </div>

              {/* Buttons */}
              <div className="pt-2 flex justify-end gap-2 border-t">
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-[#F85606] hover:bg-[#d94800] text-white px-5 py-2 rounded-lg font-bold"
                >
                  {loading ? 'Saving...' : editingProduct ? 'Save Product Changes' : 'Create Product'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};
