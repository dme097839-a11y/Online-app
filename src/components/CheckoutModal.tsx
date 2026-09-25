import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  ShieldCheck, 
  Lock, 
  CheckCircle2, 
  Wallet, 
  Banknote, 
  Truck, 
  ArrowRight, 
  QrCode, 
  Copy, 
  Check, 
  Upload, 
  AlertCircle,
  FileCheck,
  Building2,
  Zap,
  MapPin,
  Clock
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { CartItem, ShippingAddress, PaymentMethodType, Order, PaymentGatewaysConfig } from '../types';
import { 
  NEPAL_PROVINCES, 
  DELIVERY_OPTIONS_LIST, 
  DeliveryOptionType,
  getProvinceByName,
  getCityByName 
} from '../data/nepalDelivery';
import { 
  fetchPaymentGatewaysConfig, 
  createOrderInFirestore, 
  DEFAULT_PAYMENT_GATEWAYS 
} from '../services/firebaseService';
import { useAuth } from '../services/authContext';
import { QRCodeDisplay } from './QRCodeDisplay';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  voucherDiscount: number;
  onOrderSuccess: (order: Order) => void;
  language: 'en' | 'np';
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  cartItems,
  voucherDiscount,
  onOrderSuccess,
  language
}) => {
  const { userProfile } = useAuth();

  const [step, setStep] = useState<'details' | 'payment'>('details');
  const [gateways, setGateways] = useState<PaymentGatewaysConfig>(DEFAULT_PAYMENT_GATEWAYS);
  const [loadingGateways, setLoadingGateways] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // Delivery Option Selection: standard, express, collection_point
  const [selectedDeliveryOption, setSelectedDeliveryOption] = useState<DeliveryOptionType>('standard');

  // Address State with Nepal Provinces
  const [shippingAddress, setShippingAddress] = useState<ShippingAddress>({
    fullName: userProfile?.displayName || 'Suman Shrestha',
    phoneNumber: userProfile?.phoneNumber || '9841234567',
    province: 'Bagmati Province',
    city: 'Kathmandu',
    zone: 'Baneshwor',
    streetAddress: 'House #42, Madan Bhandari Path, New Baneshwor',
    landmark: 'Opposite to Everest Hotel',
    addressType: 'home',
    deliveryOption: 'standard',
    collectionPointName: 'Daraz DEX Central Hub - Thamel / Baneshwor'
  });

  // Payment Method Selection - ONLY: esewa, khalti, ime_pay, bank_qr, cod
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethodType>('esewa');

  // Transaction verification fields for QR Payments
  const [transactionId, setTransactionId] = useState('');
  const [paymentSlipUrl, setPaymentSlipUrl] = useState('');
  const [isSubmittingOrder, setIsSubmittingOrder] = useState(false);
  const [orderError, setOrderError] = useState('');

  const slipFileInputRef = useRef<HTMLInputElement>(null);

  // Active province & available cities
  const activeProvince = getProvinceByName(shippingAddress.province) || NEPAL_PROVINCES[0];
  const availableCities = activeProvince.cities;
  const activeCityInfo = getCityByName(shippingAddress.city) || availableCities[0];

  useEffect(() => {
    if (isOpen) {
      setLoadingGateways(true);
      fetchPaymentGatewaysConfig()
        .then((cfg) => setGateways(cfg))
        .catch(console.error)
        .finally(() => setLoadingGateways(false));

      if (userProfile?.displayName) {
        setShippingAddress(prev => ({
          ...prev,
          fullName: userProfile.displayName,
          phoneNumber: userProfile.phoneNumber || prev.phoneNumber
        }));
      }
    }
  }, [isOpen, userProfile]);

  // When province changes, update city default
  const handleProvinceChange = (newProvinceName: string) => {
    const prov = getProvinceByName(newProvinceName) || NEPAL_PROVINCES[0];
    const defaultCity = prov.cities[0];
    setShippingAddress(prev => ({
      ...prev,
      province: prov.name,
      city: defaultCity.city,
      zone: defaultCity.popularAreas[0] || 'Main Chowk',
      collectionPointName: defaultCity.collectionHubName
    }));
  };

  const handleCityChange = (cityName: string) => {
    const foundCity = availableCities.find(c => c.city === cityName);
    setShippingAddress(prev => ({
      ...prev,
      city: cityName,
      zone: foundCity?.popularAreas[0] || prev.zone,
      collectionPointName: foundCity?.collectionHubName || ''
    }));
  };

  if (!isOpen) return null;

  // Price & Delivery Fee Calculations
  const subtotal = cartItems.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
  const isFreeDeliveryEligible = subtotal >= 2500;

  let deliveryFee = 0;
  if (selectedDeliveryOption === 'standard') {
    deliveryFee = isFreeDeliveryEligible ? 0 : activeCityInfo.baseFee;
  } else if (selectedDeliveryOption === 'express') {
    deliveryFee = isFreeDeliveryEligible ? 60 : (activeProvince.expressFee || 150);
  } else if (selectedDeliveryOption === 'collection_point') {
    deliveryFee = isFreeDeliveryEligible ? 0 : 35; // discounted hub pickup fee
  }

  const total = Math.max(0, subtotal + deliveryFee - voucherDiscount);

  const handleCopy = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleSlipFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (loadEvent) => {
        if (loadEvent.target?.result) {
          setPaymentSlipUrl(loadEvent.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProceedToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!shippingAddress.fullName.trim() || !shippingAddress.phoneNumber.trim() || !shippingAddress.streetAddress.trim()) {
      alert('Please fill in complete delivery details.');
      return;
    }
    setStep('payment');
  };

  const handleConfirmAndPay = async () => {
    setOrderError('');

    // If online QR payment is selected, encourage entering Transaction ID
    if (selectedMethod !== 'cod' && !transactionId.trim()) {
      setOrderError('Please enter your Transaction ID or Reference Number from your payment app.');
      return;
    }

    setIsSubmittingOrder(true);

    try {
      const trackingNumber = `DEX-NP-${Math.floor(100000 + Math.random() * 900000)}`;
      
      const estimatedDeliveryText = 
        selectedDeliveryOption === 'express'
          ? 'Next Day Express (12-24 Hours via DEX Express)'
          : selectedDeliveryOption === 'collection_point'
          ? `Ready for pickup in ${activeCityInfo.deliveryTime} at ${shippingAddress.collectionPointName || 'DEX Hub'}`
          : `${activeCityInfo.deliveryTime} (DEX Standard Doorstep)`;

      const orderPayload: Omit<Order, 'id'> = {
        trackingNumber,
        createdAt: new Date().toISOString(),
        customerId: userProfile?.uid || 'guest_customer',
        customerEmail: userProfile?.email || 'customer@daraz.np',
        customerName: shippingAddress.fullName,
        customerPhone: shippingAddress.phoneNumber,
        items: cartItems,
        shippingAddress: {
          ...shippingAddress,
          deliveryOption: selectedDeliveryOption,
          collectionPointName: activeCityInfo.collectionHubName
        },
        paymentMethod: selectedMethod,
        subtotal,
        deliveryFee,
        discount: voucherDiscount,
        total,
        status: 'placed',
        paymentStatus: selectedMethod === 'cod' ? 'pending' : (transactionId ? 'verified' : 'paid'),
        estimatedDelivery: estimatedDeliveryText,
        deliveryOption: selectedDeliveryOption,
        collectionPointName: activeCityInfo.collectionHubName,
        transactionId: transactionId.trim() || undefined,
        paymentSlipUrl: paymentSlipUrl || undefined
      };

      // Save order in Firestore
      const newOrderId = await createOrderInFirestore(orderPayload);
      const finalizedOrder: Order = {
        id: newOrderId,
        ...orderPayload
      };

      // Confetti celebration
      confetti({
        particleCount: 120,
        spread: 70,
        origin: { y: 0.6 }
      });

      onOrderSuccess(finalizedOrder);
    } catch (err: any) {
      console.error('Order creation error:', err);
      setOrderError('Failed to place order in database. Please check connection and try again.');
    } finally {
      setIsSubmittingOrder(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/65 backdrop-blur-xs flex justify-center items-center p-3 sm:p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl overflow-hidden flex flex-col max-h-[92vh] border border-gray-100">
        
        {/* Modal Header */}
        <div className="bg-[#F85606] text-white px-6 py-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <Lock className="w-5 h-5 text-white/90" />
            <h2 className="text-lg font-bold">
              {step === 'details' ? 'Daraz Secure Checkout - Delivery in Nepal' : 'Select Payment Gateway & Scan QR'}
            </h2>
          </div>
          <button 
            onClick={onClose}
            className="text-white/80 hover:text-white hover:bg-white/10 p-1.5 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Stepper Progress */}
        <div className="bg-orange-50/70 border-b border-orange-100 px-6 py-2.5 flex items-center justify-between text-xs font-semibold shrink-0">
          <div className={`flex items-center gap-2 ${step === 'details' ? 'text-[#F85606]' : 'text-emerald-700'}`}>
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] ${
              step === 'details' ? 'bg-[#F85606] text-white' : 'bg-emerald-600 text-white'
            }`}>
              1
            </span>
            <span>1. Nepal Province & Delivery Option</span>
          </div>
          
          <div className="h-0.5 flex-1 mx-4 bg-gray-200">
            <div className={`h-full bg-[#F85606] transition-all duration-300 ${step === 'payment' ? 'w-full' : 'w-0'}`} />
          </div>

          <div className={`flex items-center gap-2 ${step === 'payment' ? 'text-[#F85606]' : 'text-gray-400'}`}>
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] ${
              step === 'payment' ? 'bg-[#F85606] text-white' : 'bg-gray-200 text-gray-500'
            }`}>
              2
            </span>
            <span>2. Payment & QR Verification</span>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">

          {/* ================= STEP 1: DELIVERY ADDRESS & NEPAL PROVINCE OPTIONS ================= */}
          {step === 'details' ? (
            <form onSubmit={handleProceedToPayment} className="space-y-4">
              
              {/* Recipient Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-700">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={shippingAddress.fullName}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, fullName: e.target.value })}
                    className="w-full text-xs border border-gray-300 rounded-lg p-2.5 focus:ring-1 focus:ring-[#F85606] outline-none"
                    placeholder="Recipient's full name"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-700">Mobile Phone Number (Nepal) *</label>
                  <input
                    type="tel"
                    required
                    pattern="[0-9]{10}"
                    value={shippingAddress.phoneNumber}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, phoneNumber: e.target.value })}
                    className="w-full text-xs border border-gray-300 rounded-lg p-2.5 focus:ring-1 focus:ring-[#F85606] outline-none"
                    placeholder="98XXXXXXXX"
                  />
                </div>
              </div>

              {/* All 7 Provinces of Nepal Selection */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-700 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-[#F85606]" />
                    <span>Province in Nepal *</span>
                  </label>
                  <select
                    value={shippingAddress.province}
                    onChange={(e) => handleProvinceChange(e.target.value)}
                    className="w-full text-xs border border-gray-300 rounded-lg p-2.5 font-medium bg-white outline-none focus:border-[#F85606]"
                  >
                    {NEPAL_PROVINCES.map((prov) => (
                      <option key={prov.id} value={prov.name}>
                        {prov.name} ({prov.nameNp})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-700">City / District *</label>
                  <select
                    value={shippingAddress.city}
                    onChange={(e) => handleCityChange(e.target.value)}
                    className="w-full text-xs border border-gray-300 rounded-lg p-2.5 font-medium bg-white outline-none focus:border-[#F85606]"
                  >
                    {availableCities.map((c) => (
                      <option key={c.city} value={c.city}>
                        {c.city} (Est: {c.deliveryTime})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-700">Tole / Area / Ward *</label>
                  <input
                    type="text"
                    required
                    value={shippingAddress.zone}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, zone: e.target.value })}
                    className="w-full text-xs border border-gray-300 rounded-lg p-2.5 outline-none focus:border-[#F85606]"
                    placeholder="e.g. New Baneshwor, Ward 10"
                  />
                </div>
              </div>

              {/* Delivery Options in Nepal Selection */}
              <div className="pt-2">
                <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block mb-2 flex items-center justify-between">
                  <span>Select Delivery Option in Nepal</span>
                  {isFreeDeliveryEligible && (
                    <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      🎉 Free Delivery Active (Orders &gt; Rs. 2,500)
                    </span>
                  )}
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  
                  {/* Option 1: Standard Doorstep Delivery */}
                  <div
                    onClick={() => setSelectedDeliveryOption('standard')}
                    className={`p-3 rounded-xl border cursor-pointer transition-all ${
                      selectedDeliveryOption === 'standard'
                        ? 'border-[#F85606] bg-orange-50/60 ring-2 ring-[#F85606]/30'
                        : 'border-gray-200 bg-white hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-1.5 font-bold text-xs text-gray-900">
                        <Truck className="w-4 h-4 text-[#F85606]" />
                        <span>Standard Doorstep</span>
                      </div>
                      <span className="text-xs font-bold text-[#F85606]">
                        {isFreeDeliveryEligible ? 'FREE' : `Rs. ${activeCityInfo.baseFee}`}
                      </span>
                    </div>
                    <p className="text-[11px] text-gray-500">
                      Estimated: <strong>{activeCityInfo.deliveryTime}</strong>
                    </p>
                    <span className="text-[10px] text-gray-400 block mt-1">Direct home or office delivery</span>
                  </div>

                  {/* Option 2: Express Fast Track Delivery */}
                  <div
                    onClick={() => {
                      if (activeCityInfo.expressAvailable) {
                        setSelectedDeliveryOption('express');
                      }
                    }}
                    className={`p-3 rounded-xl border transition-all ${
                      !activeCityInfo.expressAvailable 
                        ? 'opacity-50 cursor-not-allowed bg-gray-50 border-gray-200' 
                        : selectedDeliveryOption === 'express'
                        ? 'border-amber-500 bg-amber-50/60 ring-2 ring-amber-500/30 cursor-pointer'
                        : 'border-gray-200 bg-white hover:border-gray-300 cursor-pointer'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-1.5 font-bold text-xs text-gray-900">
                        <Zap className="w-4 h-4 text-amber-500" />
                        <span>Express Fast Track</span>
                      </div>
                      <span className="text-xs font-bold text-amber-600">
                        {isFreeDeliveryEligible ? 'Rs. 60' : `Rs. ${activeProvince.expressFee || 150}`}
                      </span>
                    </div>
                    <p className="text-[11px] text-gray-500">
                      Estimated: <strong>12 - 24 Hours</strong>
                    </p>
                    <span className="text-[10px] text-gray-400 block mt-1">
                      {activeCityInfo.expressAvailable ? 'Priority DEX express courier' : 'Not available in this city'}
                    </span>
                  </div>

                  {/* Option 3: Daraz Collection Point Hub Pickup */}
                  <div
                    onClick={() => {
                      if (activeCityInfo.hubPickupAvailable) {
                        setSelectedDeliveryOption('collection_point');
                      }
                    }}
                    className={`p-3 rounded-xl border transition-all ${
                      !activeCityInfo.hubPickupAvailable
                        ? 'opacity-50 cursor-not-allowed bg-gray-50 border-gray-200'
                        : selectedDeliveryOption === 'collection_point'
                        ? 'border-indigo-600 bg-indigo-50/60 ring-2 ring-indigo-600/30 cursor-pointer'
                        : 'border-gray-200 bg-white hover:border-gray-300 cursor-pointer'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-1.5 font-bold text-xs text-gray-900">
                        <Building2 className="w-4 h-4 text-indigo-600" />
                        <span>DEX Hub Pickup</span>
                      </div>
                      <span className="text-xs font-bold text-indigo-600">
                        {isFreeDeliveryEligible ? 'FREE' : 'Rs. 35'}
                      </span>
                    </div>
                    <p className="text-[11px] text-gray-500 truncate" title={activeCityInfo.collectionHubName}>
                      {activeCityInfo.collectionHubName || 'Nearest Daraz Hub'}
                    </p>
                    <span className="text-[10px] text-emerald-600 font-semibold block mt-1">Lowest delivery rate</span>
                  </div>

                </div>
              </div>

              {/* Detailed Street Address */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-700">Detailed Street Address / House No. *</label>
                <input
                  type="text"
                  required
                  value={shippingAddress.streetAddress}
                  onChange={(e) => setShippingAddress({ ...shippingAddress, streetAddress: e.target.value })}
                  className="w-full text-xs border border-gray-300 rounded-lg p-2.5 outline-none focus:border-[#F85606]"
                  placeholder="Street name, house number, tole"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-700">Nearest Landmark (Optional)</label>
                <input
                  type="text"
                  value={shippingAddress.landmark || ''}
                  onChange={(e) => setShippingAddress({ ...shippingAddress, landmark: e.target.value })}
                  className="w-full text-xs border border-gray-300 rounded-lg p-2.5 outline-none focus:border-[#F85606]"
                  placeholder="e.g. Near Bhatbhateni Supermarket, opposite hospital"
                />
              </div>

              {/* Order Summary box */}
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-200 text-xs space-y-2 mt-4">
                <div className="font-bold text-gray-900 flex justify-between">
                  <span>Order Items ({cartItems.length}):</span>
                  <span>Rs. {subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>
                    Delivery ({shippingAddress.province} - {shippingAddress.city}):
                  </span>
                  <span>{deliveryFee === 0 ? <strong className="text-emerald-600">FREE</strong> : `Rs. ${deliveryFee}`}</span>
                </div>
                {voucherDiscount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-semibold">
                    <span>Voucher Applied:</span>
                    <span>- Rs. {voucherDiscount.toLocaleString()}</span>
                  </div>
                )}
                <div className="border-t pt-2 flex justify-between text-sm font-bold text-gray-900">
                  <span>Total Payable:</span>
                  <span className="text-[#F85606] text-base">Rs. {total.toLocaleString()}</span>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-[#F85606] hover:bg-[#d94800] text-white py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-md transition-all mt-4 cursor-pointer"
              >
                Proceed to Payment <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          ) : (

            /* ================= STEP 2: PAYMENT & QR CODE ================= */
            <div className="space-y-5">
              
              {/* Payment Method Selector Pills (Strictly Nepali Wallets, Bank QR, COD) */}
              <div>
                <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block mb-2">
                  Select Payment Option
                </label>
                
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                  
                  {/* eSewa */}
                  <button
                    type="button"
                    onClick={() => setSelectedMethod('esewa')}
                    className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center justify-center gap-1.5 cursor-pointer ${
                      selectedMethod === 'esewa'
                        ? 'border-[#60BB46] bg-emerald-50/50 ring-2 ring-[#60BB46]/40 shadow-xs'
                        : 'border-gray-200 hover:border-gray-300 bg-white'
                    }`}
                  >
                    <div className="w-7 h-7 rounded-full bg-[#60BB46] text-white font-bold text-xs flex items-center justify-center">
                      eS
                    </div>
                    <span className="text-xs font-bold text-gray-800">eSewa QR</span>
                  </button>

                  {/* Khalti */}
                  <button
                    type="button"
                    onClick={() => setSelectedMethod('khalti')}
                    className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center justify-center gap-1.5 cursor-pointer ${
                      selectedMethod === 'khalti'
                        ? 'border-[#5C2D91] bg-purple-50/50 ring-2 ring-[#5C2D91]/40 shadow-xs'
                        : 'border-gray-200 hover:border-gray-300 bg-white'
                    }`}
                  >
                    <div className="w-7 h-7 rounded-full bg-[#5C2D91] text-white font-bold text-xs flex items-center justify-center">
                      Kh
                    </div>
                    <span className="text-xs font-bold text-gray-800">Khalti QR</span>
                  </button>

                  {/* IME Pay */}
                  <button
                    type="button"
                    onClick={() => setSelectedMethod('ime_pay')}
                    className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center justify-center gap-1.5 cursor-pointer ${
                      selectedMethod === 'ime_pay'
                        ? 'border-[#E31E24] bg-rose-50/50 ring-2 ring-[#E31E24]/40 shadow-xs'
                        : 'border-gray-200 hover:border-gray-300 bg-white'
                    }`}
                  >
                    <div className="w-7 h-7 rounded-full bg-[#E31E24] text-white font-bold text-xs flex items-center justify-center">
                      IME
                    </div>
                    <span className="text-xs font-bold text-gray-800">IME Pay</span>
                  </button>

                  {/* Bank / Fonepay QR */}
                  <button
                    type="button"
                    onClick={() => setSelectedMethod('bank_qr')}
                    className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center justify-center gap-1.5 cursor-pointer ${
                      selectedMethod === 'bank_qr'
                        ? 'border-[#1A4480] bg-blue-50/50 ring-2 ring-[#1A4480]/40 shadow-xs'
                        : 'border-gray-200 hover:border-gray-300 bg-white'
                    }`}
                  >
                    <div className="w-7 h-7 rounded-full bg-[#1A4480] text-white font-bold text-xs flex items-center justify-center">
                      <QrCode className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-bold text-gray-800">Bank QR</span>
                  </button>

                  {/* Cash on Delivery */}
                  <button
                    type="button"
                    onClick={() => setSelectedMethod('cod')}
                    className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center justify-center gap-1.5 cursor-pointer ${
                      selectedMethod === 'cod'
                        ? 'border-[#F85606] bg-orange-50/50 ring-2 ring-[#F85606]/40 shadow-xs'
                        : 'border-gray-200 hover:border-gray-300 bg-white'
                    }`}
                  >
                    <div className="w-7 h-7 rounded-full bg-[#F85606] text-white font-bold text-xs flex items-center justify-center">
                      <Banknote className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-bold text-gray-800">COD</span>
                  </button>

                </div>
              </div>

              {/* Gateway-Specific QR Code & Instructions Panel */}
              {selectedMethod === 'cod' ? (
                <div className="bg-orange-50/80 border border-orange-200 rounded-xl p-4 text-xs space-y-2">
                  <div className="flex items-center gap-2 text-[#F85606] font-bold text-sm">
                    <Banknote className="w-5 h-5" />
                    <span>Cash on Delivery (COD) Selected</span>
                  </div>
                  <p className="text-gray-700">
                    Pay <strong className="text-gray-900">Rs. {total.toLocaleString()}</strong> in cash to the DEX delivery partner when your parcel arrives at your destination in <strong>{shippingAddress.city}, {shippingAddress.province}</strong>.
                  </p>
                  <p className="text-[11px] text-gray-500">
                    Please keep exact cash ready upon delivery for quick verification.
                  </p>
                </div>
              ) : (
                <div className="bg-gray-50 rounded-xl p-4 sm:p-5 border border-gray-200 space-y-4">
                  
                  {/* Gateway Header */}
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-4 border-b border-gray-200">
                    <div>
                      <h3 className="text-sm font-bold text-gray-900">
                        {selectedMethod === 'esewa' && 'Scan eSewa QR to Pay'}
                        {selectedMethod === 'khalti' && 'Scan Khalti QR to Pay'}
                        {selectedMethod === 'ime_pay' && 'Scan IME Pay QR to Pay'}
                        {selectedMethod === 'bank_qr' && 'Scan Bank / Fonepay QR to Pay'}
                      </h3>
                      <p className="text-xs text-gray-500 mt-0.5">
                        Amount to Pay:{' '}
                        <strong className="text-[#F85606] text-sm font-bold">
                          Rs. {total.toLocaleString()}
                        </strong>
                      </p>
                    </div>

                    {/* Account Details / Copy */}
                    <div className="text-xs text-right space-y-1">
                      {selectedMethod === 'bank_qr' ? (
                        <>
                          <div className="text-gray-700 font-semibold">{gateways.bank_qr.bankName}</div>
                          <div className="flex items-center gap-1.5 justify-end">
                            <span className="font-mono text-gray-900 bg-white px-2 py-0.5 rounded border">
                              {gateways.bank_qr.accountNumber}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleCopy(gateways.bank_qr.accountNumber, 'acct')}
                              className="text-gray-500 hover:text-[#F85606] cursor-pointer"
                              title="Copy Account Number"
                            >
                              {copiedField === 'acct' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                            </button>
                          </div>
                          <div className="text-[11px] text-gray-500">A/C Name: {gateways.bank_qr.accountName}</div>
                        </>
                      ) : (
                        <>
                          <div className="text-gray-700 font-semibold">
                            {selectedMethod === 'esewa' && gateways.esewa.accountName}
                            {selectedMethod === 'khalti' && gateways.khalti.accountName}
                            {selectedMethod === 'ime_pay' && gateways.ime_pay.accountName}
                          </div>
                          <div className="flex items-center gap-1.5 justify-end">
                            <span className="font-mono text-gray-900 bg-white px-2 py-0.5 rounded border">
                              {selectedMethod === 'esewa' && gateways.esewa.accountNumber}
                              {selectedMethod === 'khalti' && gateways.khalti.accountNumber}
                              {selectedMethod === 'ime_pay' && gateways.ime_pay.accountNumber}
                            </span>
                            <button
                              type="button"
                              onClick={() => {
                                const num = 
                                  selectedMethod === 'esewa' ? gateways.esewa.accountNumber :
                                  selectedMethod === 'khalti' ? gateways.khalti.accountNumber :
                                  gateways.ime_pay.accountNumber;
                                handleCopy(num, 'wallet_num');
                              }}
                              className="text-gray-500 hover:text-[#F85606] cursor-pointer"
                              title="Copy Wallet ID"
                            >
                              {copiedField === 'wallet_num' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  {/* QR Image Display */}
                  <div className="flex flex-col sm:flex-row items-center gap-5 justify-center py-2">
                    <QRCodeDisplay
                      method={selectedMethod}
                      accountName={
                        selectedMethod === 'esewa' ? gateways.esewa.accountName :
                        selectedMethod === 'khalti' ? gateways.khalti.accountName :
                        selectedMethod === 'ime_pay' ? gateways.ime_pay.accountName :
                        gateways.bank_qr.accountName
                      }
                      accountNumber={
                        selectedMethod === 'esewa' ? gateways.esewa.accountNumber :
                        selectedMethod === 'khalti' ? gateways.khalti.accountNumber :
                        selectedMethod === 'ime_pay' ? gateways.ime_pay.accountNumber :
                        gateways.bank_qr.accountNumber
                      }
                      qrCodeUrl={
                        selectedMethod === 'esewa' ? gateways.esewa.qrCodeUrl :
                        selectedMethod === 'khalti' ? gateways.khalti.qrCodeUrl :
                        selectedMethod === 'ime_pay' ? gateways.ime_pay.qrCodeUrl :
                        gateways.bank_qr.qrCodeUrl
                      }
                    />

                    <div className="space-y-3 max-w-sm text-xs">
                      <div>
                        <h4 className="font-bold text-gray-800 mb-1">Payment Instructions:</h4>
                        <ol className="list-decimal list-inside space-y-1 text-gray-600 text-[11px]">
                          <li>Open your {selectedMethod.toUpperCase().replace('_', ' ')} app or Mobile Banking app.</li>
                          <li>Scan the QR code above or transfer to the account number.</li>
                          <li>Enter amount: <strong>Rs. {total.toLocaleString()}</strong>.</li>
                          <li>In remarks, write your phone number: <strong>{shippingAddress.phoneNumber}</strong>.</li>
                          <li>Enter the Transaction ID below and upload receipt/slip.</li>
                        </ol>
                      </div>

                      {/* Transaction ID input */}
                      <div className="space-y-1">
                        <label className="font-bold text-gray-700 block">
                          Transaction ID / Ref Code *
                        </label>
                        <input
                          type="text"
                          required
                          value={transactionId}
                          onChange={(e) => setTransactionId(e.target.value)}
                          placeholder="e.g. 248901284 / FONE-982312"
                          className="w-full text-xs border border-gray-300 rounded-lg p-2.5 bg-white outline-none focus:border-[#F85606]"
                        />
                      </div>

                      {/* Receipt Upload */}
                      <div className="space-y-1">
                        <label className="font-bold text-gray-700 block">
                          Upload Payment Slip / Screenshot
                        </label>
                        <input
                          type="file"
                          ref={slipFileInputRef}
                          onChange={handleSlipFileUpload}
                          accept="image/*"
                          className="hidden"
                        />
                        <button
                          type="button"
                          onClick={() => slipFileInputRef.current?.click()}
                          className="w-full border border-dashed border-gray-300 hover:border-[#F85606] bg-white p-2.5 rounded-lg text-xs flex items-center justify-center gap-1.5 text-gray-600 cursor-pointer transition-colors"
                        >
                          {paymentSlipUrl ? (
                            <>
                              <FileCheck className="w-4 h-4 text-emerald-600" />
                              <span className="text-emerald-700 font-semibold">Slip Screenshot Attached</span>
                            </>
                          ) : (
                            <>
                              <Upload className="w-4 h-4 text-gray-400" />
                              <span>Click to attach payment slip image</span>
                            </>
                          )}
                        </button>
                      </div>

                    </div>
                  </div>

                </div>
              )}

              {/* Error Message */}
              {orderError && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-lg flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{orderError}</span>
                </div>
              )}

              {/* Step 2 Actions */}
              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setStep('details')}
                  className="w-1/3 border border-gray-300 hover:bg-gray-50 text-gray-700 py-3 rounded-xl font-bold text-xs transition cursor-pointer"
                >
                  ← Back to Details
                </button>

                <button
                  type="button"
                  onClick={handleConfirmAndPay}
                  disabled={isSubmittingOrder}
                  className="w-2/3 bg-[#F85606] hover:bg-[#d94800] text-white py-3 rounded-xl font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isSubmittingOrder ? (
                    'Confirming Order...'
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Confirm Order (Rs. {total.toLocaleString()})</span>
                    </>
                  )}
                </button>
              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
};
