import React from 'react';
import { CheckCircle, Truck, Package, Clock, ShieldCheck, Printer, ArrowRight, X } from 'lucide-react';
import { Order } from '../types';
import { SafeImage } from './SafeImage';

interface OrderSuccessModalProps {
  order: Order | null;
  onClose: () => void;
  language: 'en' | 'np';
}

export const OrderSuccessModal: React.FC<OrderSuccessModalProps> = ({ order, onClose, language }) => {
  if (!order) return null;

  const paymentLabels: Record<string, string> = {
    esewa: 'eSewa Mobile Wallet (Paid)',
    khalti: 'Khalti Digital Wallet (Paid)',
    ime_pay: 'IME Pay (Paid)',
    card: 'Visa/Mastercard 3D Secure (Paid)',
    connect_ips: 'ConnectIPS Direct (Paid)',
    cod: 'Cash on Delivery (Pending at Doorstep)',
    emi: '0% Monthly Installment (Approved)'
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[92vh] flex flex-col overflow-hidden shadow-2xl relative my-auto">
        
        {/* Header */}
        <div className="bg-emerald-600 text-white p-6 text-center relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="w-16 h-16 rounded-full bg-white text-emerald-600 flex items-center justify-center mx-auto mb-3 shadow-lg">
            <CheckCircle className="w-10 h-10" />
          </div>

          <h2 className="text-xl sm:text-2xl font-black">
            {language === 'en' ? 'Thank You! Order Placed Successfully' : 'धन्यवाद! तपाईंको अर्डर सफलतापूर्वक दर्ता भयो'}
          </h2>
          <p className="text-xs sm:text-sm text-emerald-100 mt-1">
            Tracking Number: <span className="font-mono font-bold text-white">{order.trackingNumber}</span>
          </p>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto p-6 space-y-6 flex-1">
          {/* Status Tracker */}
          <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
            <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">
              Daraz Express Delivery Status
            </div>

            <div className="grid grid-cols-4 gap-2 text-center text-xs">
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs mb-1">
                  ✓
                </div>
                <span className="font-bold text-gray-800 text-[11px]">Placed</span>
                <span className="text-[10px] text-gray-400">Today</span>
              </div>

              <div className="flex flex-col items-center">
                <div className="w-8 h-8 rounded-full bg-[#f85606] text-white flex items-center justify-center font-bold text-xs mb-1 animate-pulse">
                  <Package className="w-4 h-4" />
                </div>
                <span className="font-bold text-[#f85606] text-[11px]">Packing</span>
                <span className="text-[10px] text-gray-400">Kathmandu Hub</span>
              </div>

              <div className="flex flex-col items-center opacity-40">
                <div className="w-8 h-8 rounded-full bg-gray-300 text-gray-700 flex items-center justify-center font-bold text-xs mb-1">
                  <Truck className="w-4 h-4" />
                </div>
                <span className="font-medium text-gray-600 text-[11px]">Shipped</span>
                <span className="text-[10px] text-gray-400">DEX Rider</span>
              </div>

              <div className="flex flex-col items-center opacity-40">
                <div className="w-8 h-8 rounded-full bg-gray-300 text-gray-700 flex items-center justify-center font-bold text-xs mb-1">
                  <Clock className="w-4 h-4" />
                </div>
                <span className="font-medium text-gray-600 text-[11px]">Delivered</span>
                <span className="text-[10px] text-gray-400">Tomorrow</span>
              </div>
            </div>
          </div>

          {/* Order Details & Summary */}
          <div className="border border-gray-200 rounded-xl p-4 divide-y divide-gray-100 text-xs">
            <div className="pb-3 grid grid-cols-2 gap-4">
              <div>
                <span className="text-gray-400 block text-[11px]">Delivery To:</span>
                <div className="font-bold text-gray-800">{order.shippingAddress.fullName}</div>
                <div className="text-gray-600">{order.shippingAddress.streetAddress}, {order.shippingAddress.zone}</div>
                <div className="text-gray-600">{order.shippingAddress.city}, {order.shippingAddress.province}</div>
                <div className="text-gray-500 font-mono mt-0.5">📞 {order.shippingAddress.phoneNumber}</div>
              </div>

              <div>
                <span className="text-gray-400 block text-[11px]">Payment Method:</span>
                <div className="font-bold text-gray-800">{paymentLabels[order.paymentMethod] || order.paymentMethod}</div>
                <span className="text-gray-400 block text-[11px] mt-2">Estimated Arrival:</span>
                <div className="font-bold text-[#f85606]">{order.estimatedDelivery}</div>
              </div>
            </div>

            {/* Items */}
            <div className="py-3 space-y-2">
              <span className="text-gray-400 block text-[11px] font-bold uppercase tracking-wider">
                Purchased Items ({order.items.length})
              </span>
              {order.items.map(it => (
                <div key={it.product.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <SafeImage src={it.product.images[0]} alt="" className="w-8 h-8 rounded object-cover" fallbackText={it.product.brand} />
                    <div>
                      <span className="font-medium text-gray-800 line-clamp-1">{it.product.title}</span>
                      <span className="text-[10px] text-gray-400">Qty: {it.quantity}</span>
                    </div>
                  </div>
                  <span className="font-bold text-gray-900 tabular-nums font-mono">
                    Rs. {(it.product.price * it.quantity).toLocaleString('en-IN')}
                  </span>
                </div>
              ))}
            </div>

            {/* Totals */}
            <div className="pt-3 space-y-1">
              <div className="flex justify-between text-gray-500">
                <span>Subtotal:</span>
                <span>Rs. {order.subtotal.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-gray-500">
                <span>Delivery:</span>
                <span>{order.deliveryFee === 0 ? 'FREE' : `Rs. ${order.deliveryFee}`}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-emerald-600 font-semibold">
                  <span>Discount:</span>
                  <span>- Rs. {order.discount.toLocaleString('en-IN')}</span>
                </div>
              )}
              <div className="flex justify-between text-sm font-black text-gray-900 pt-1">
                <span>Total Amount Paid:</span>
                <span className="text-[#f85606]">Rs. {order.total.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={handlePrint}
              className="px-4 py-2.5 border border-gray-300 rounded-xl text-xs font-bold text-gray-700 hover:bg-gray-50 flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Print Receipt</span>
            </button>
            <button
              onClick={onClose}
              className="flex-1 bg-[#f85606] hover:bg-[#d44300] text-white font-bold py-2.5 rounded-xl transition flex items-center justify-center gap-2 cursor-pointer shadow-md"
            >
              <span>Continue Shopping on Daraz</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
