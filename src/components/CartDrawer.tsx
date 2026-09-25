import React, { useState } from 'react';
import { X, Trash2, ShoppingBag, ArrowRight, ShieldCheck, Tag, Plus, Minus } from 'lucide-react';
import { CartItem } from '../types';
import { PROMO_VOUCHERS } from '../data/products';
import { SafeImage } from './SafeImage';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
  onProceedCheckout: (voucherCode?: string, discountAmount?: number) => void;
  language: 'en' | 'np';
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onProceedCheckout,
  language
}) => {
  if (!isOpen) return null;

  const [couponCode, setCouponCode] = useState('');
  const [appliedVoucher, setAppliedVoucher] = useState<{ code: string; discount: number } | null>(null);
  const [couponError, setCouponError] = useState('');

  const subtotal = cartItems.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
  const freeShippingThreshold = 2500;
  const isFreeShipping = subtotal >= freeShippingThreshold;
  const shippingFee = cartItems.length === 0 ? 0 : (isFreeShipping ? 0 : 85);

  const discountAmount = appliedVoucher ? appliedVoucher.discount : 0;
  const finalTotal = Math.max(0, subtotal + shippingFee - discountAmount);

  const handleApplyCoupon = (codeToApply?: string) => {
    const code = (codeToApply || couponCode).trim().toUpperCase();
    setCouponError('');

    const matched = PROMO_VOUCHERS.find(v => v.code === code);
    if (!matched) {
      setCouponError('Invalid voucher code. Try DARAZNEW150 or APPLIANCE2000');
      return;
    }

    if (subtotal < matched.minSpend) {
      setCouponError(`Minimum spend of Rs. ${matched.minSpend.toLocaleString('en-IN')} required for this voucher.`);
      return;
    }

    setAppliedVoucher({ code: matched.code, discount: matched.discount });
    setCouponCode(matched.code);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs flex justify-end animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-md h-full flex flex-col shadow-2xl relative animate-in slide-in-from-right duration-300">
        
        {/* Header */}
        <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-[#f85606]" />
            <h2 className="text-base font-bold text-gray-900">
              {language === 'en' ? 'My Shopping Cart' : 'मेरो किनमेल कार्ट'} ({cartItems.length})
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-gray-200 flex items-center justify-center text-gray-600 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free Shipping Progress Indicator */}
        <div className="bg-orange-50 px-4 py-2.5 border-b border-orange-100 text-xs">
          {isFreeShipping ? (
            <div className="text-emerald-700 font-bold flex items-center gap-1.5">
              <span>🎉 Congratulations! You unlocked FREE Delivery across Nepal!</span>
            </div>
          ) : (
            <div>
              <div className="flex justify-between text-gray-700 font-medium mb-1">
                <span>Add Rs. {(freeShippingThreshold - subtotal).toLocaleString('en-IN')} more for Free Delivery</span>
                <span className="font-bold text-[#f85606]">{Math.floor((subtotal / freeShippingThreshold) * 100)}%</span>
              </div>
              <div className="w-full bg-orange-200 h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-[#f85606] h-full rounded-full transition-all duration-300"
                  style={{ width: `${Math.min(100, (subtotal / freeShippingThreshold) * 100)}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Cart Items List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {cartItems.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3">
              <div className="w-20 h-20 rounded-full bg-orange-100 flex items-center justify-center text-[#f85606]">
                <ShoppingBag className="w-10 h-10" />
              </div>
              <h3 className="text-base font-bold text-gray-800">Your Cart is Empty</h3>
              <p className="text-xs text-gray-500 max-w-xs">
                Explore our wide collection of refrigerators, washing machines, electronics, and lifestyle products!
              </p>
              <button
                onClick={onClose}
                className="mt-2 bg-[#f85606] text-white text-xs font-bold px-6 py-2.5 rounded-lg shadow-sm hover:bg-[#d44300] transition cursor-pointer"
              >
                Start Shopping Now
              </button>
            </div>
          ) : (
            cartItems.map((item) => (
              <div
                key={item.product.id}
                className="bg-white rounded-lg border border-gray-200 p-3 flex gap-3 shadow-2xs hover:border-orange-200 transition"
              >
                <SafeImage
                  src={item.product.images[0]}
                  alt={item.product.title}
                  className="w-18 h-18 rounded-md object-cover flex-shrink-0 border border-gray-100"
                  fallbackText={item.product.brand}
                />

                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-1">
                      <h4 className="text-xs font-semibold text-gray-800 line-clamp-1">
                        {item.product.title}
                      </h4>
                      <button
                        onClick={() => onRemoveItem(item.product.id)}
                        className="text-gray-400 hover:text-red-500 transition p-1 cursor-pointer"
                        title="Remove"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="text-[11px] text-gray-500">{item.product.brand}</div>
                  </div>

                  <div className="flex items-center justify-between mt-2">
                    <div className="text-xs font-bold text-[#f85606] tabular-nums font-mono">
                      Rs. {(item.product.price * item.quantity).toLocaleString('en-IN')}
                    </div>

                    {/* Quantity controls (+ / - / direct input) */}
                    <div className="flex items-center gap-1.5">
                      <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden bg-white shadow-2xs">
                        <button
                          type="button"
                          onClick={() => onUpdateQuantity(item.product.id, item.quantity - 1)}
                          className="px-2.5 py-1 bg-gray-50 hover:bg-orange-50 text-gray-700 hover:text-[#f85606] text-xs font-bold cursor-pointer transition"
                          title="Decrease Quantity"
                        >
                          <Minus className="w-3 h-3" />
                        </button>

                        <input
                          type="number"
                          min={1}
                          max={999}
                          value={item.quantity}
                          onChange={(e) => onUpdateQuantity(item.product.id, Math.max(1, parseInt(e.target.value) || 1))}
                          className="w-11 text-center font-bold text-xs border-x border-gray-200 py-1 outline-none text-gray-900 focus:bg-orange-50/40"
                        />

                        <button
                          type="button"
                          onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
                          className="px-2.5 py-1 bg-gray-50 hover:bg-orange-50 text-gray-700 hover:text-[#f85606] text-xs font-bold cursor-pointer transition"
                          title="Increase Quantity"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Voucher Box & Order Summary Footer */}
        {cartItems.length > 0 && (
          <div className="border-t border-gray-200 p-4 bg-gray-50/90 space-y-3">
            {/* Voucher input */}
            <div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                  placeholder="Enter Voucher (e.g. APPLIANCE2000)"
                  className="flex-1 uppercase bg-white border border-gray-300 rounded-lg px-3 py-1.5 text-xs text-gray-800 outline-none focus:border-[#f85606]"
                />
                <button
                  onClick={() => handleApplyCoupon()}
                  className="bg-gray-800 hover:bg-gray-900 text-white text-xs font-bold px-3 py-1.5 rounded-lg cursor-pointer transition"
                >
                  Apply
                </button>
              </div>

              {couponError && (
                <div className="text-[11px] text-red-600 mt-1">{couponError}</div>
              )}

              {appliedVoucher && (
                <div className="text-[11px] text-emerald-700 font-bold mt-1 flex items-center gap-1">
                  <Tag className="w-3 h-3" />
                  Voucher {appliedVoucher.code} applied (-Rs. {appliedVoucher.discount})
                </div>
              )}
            </div>

            {/* Calculations */}
            <div className="space-y-1.5 text-xs text-gray-600 pt-2 border-t border-gray-200">
              <div className="flex justify-between">
                <span>Subtotal ({cartItems.length} items):</span>
                <span className="font-semibold text-gray-800">Rs. {subtotal.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping Fee:</span>
                <span className="font-semibold">
                  {shippingFee === 0 ? <span className="text-emerald-700 font-bold">FREE</span> : `Rs. ${shippingFee}`}
                </span>
              </div>
              {appliedVoucher && (
                <div className="flex justify-between text-emerald-700 font-bold">
                  <span>Voucher Discount:</span>
                  <span>- Rs. {appliedVoucher.discount.toLocaleString('en-IN')}</span>
                </div>
              )}
              <div className="flex justify-between text-sm font-bold text-gray-900 pt-2 border-t border-gray-200">
                <span>Total Amount:</span>
                <span className="text-[#f85606] text-base">Rs. {finalTotal.toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* Proceed Button */}
            <button
              onClick={() => {
                onProceedCheckout(appliedVoucher?.code, appliedVoucher?.discount);
              }}
              className="w-full bg-[#f85606] hover:bg-[#d44300] text-white font-bold py-3 rounded-xl transition flex items-center justify-center gap-2 cursor-pointer shadow-md hover:shadow-lg"
            >
              <span>{language === 'en' ? 'PROCEED TO CHECKOUT' : 'चेकआउट गर्नुहोस्'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="flex items-center justify-center gap-2 text-[10px] text-gray-400">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>100% Safe & Encrypted Payment Guarantee</span>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
