import React from 'react';
import { ShieldCheck, Truck, RotateCcw, Smartphone, CreditCard } from 'lucide-react';

interface FooterProps {
  language: 'en' | 'np';
  onOpenDeliveryGuide?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ language, onOpenDeliveryGuide }) => {
  return (
    <footer className="bg-white border-t border-gray-200 mt-12 text-xs text-gray-600">
      {/* Trust Highlights */}
      <div className="border-b border-gray-100 bg-[#fafafa]">
        <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center text-[#f85606] mb-2">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-gray-900 text-sm">100% Authentic Products</h4>
            <p className="text-[11px] text-gray-500 mt-0.5">Authorised warranty & genuine brand guarantee</p>
          </div>

          <div 
            onClick={onOpenDeliveryGuide}
            className="flex flex-col items-center cursor-pointer group"
          >
            <div className="w-12 h-12 rounded-full bg-blue-100 group-hover:bg-blue-200 flex items-center justify-center text-blue-600 mb-2 transition">
              <Truck className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-gray-900 text-sm group-hover:text-[#F85606] transition flex items-center gap-1">
              <span>Daraz Express Delivery</span>
            </h4>
            <p className="text-[11px] text-gray-500 mt-0.5 group-hover:underline">Prompt delivery across all 7 provinces of Nepal</p>
          </div>

          <div className="flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 mb-2">
              <RotateCcw className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-gray-900 text-sm">14 Days Free Return</h4>
            <p className="text-[11px] text-gray-500 mt-0.5">Easy returns and doorstep pickup service</p>
          </div>

          <div className="flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 mb-2">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-gray-900 text-sm">Secure Payment Gateways</h4>
            <p className="text-[11px] text-gray-500 mt-0.5">eSewa, Khalti, IME Pay, Bank QR & COD</p>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Column 1: Customer Care */}
          <div>
            <h3 className="font-bold text-gray-900 text-sm mb-3">Customer Care</h3>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-[#f85606] transition">Help Center & FAQ</a></li>
              <li><a href="#" className="hover:text-[#f85606] transition">How to Buy on Daraz</a></li>
              <li><a href="#" className="hover:text-[#f85606] transition">Returns & Refunds</a></li>
              <li><a href="#" className="hover:text-[#f85606] transition">Contact Us & Support</a></li>
              <li><a href="#" className="hover:text-[#f85606] transition">Purchase Protection Guarantee</a></li>
            </ul>
          </div>

          {/* Column 2: Daraz Nepal */}
          <div>
            <h3 className="font-bold text-gray-900 text-sm mb-3">Daraz Nepal</h3>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-[#f85606] transition">About Daraz Nepal</a></li>
              <li><a href="#" className="hover:text-[#f85606] transition">Careers at Daraz</a></li>
              <li><a href="#" className="hover:text-[#f85606] transition">Daraz Cares & CSR</a></li>
              <li><a href="#" className="hover:text-[#f85606] transition">Terms & Privacy Policy</a></li>
              <li><a href="#" className="hover:text-[#f85606] transition">Sell on Daraz Nepal</a></li>
            </ul>
          </div>

          {/* Column 3: Payment Partners */}
          <div>
            <h3 className="font-bold text-gray-900 text-sm mb-3">Payment Methods</h3>
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="bg-[#60BB46] text-white font-bold px-2 py-1 rounded text-xs">eSewa QR</span>
              <span className="bg-[#5C2D91] text-white font-bold px-2 py-1 rounded text-xs">Khalti QR</span>
              <span className="bg-[#ED1C24] text-white font-bold px-2 py-1 rounded text-xs">IME Pay</span>
              <span className="bg-[#1A4480] text-white font-bold px-2 py-1 rounded text-xs">Bank Fonepay QR</span>
              <span className="bg-gray-800 text-white font-bold px-2 py-1 rounded text-xs">Cash on Delivery</span>
            </div>

            <h3 className="font-bold text-gray-900 text-sm mb-2 mt-4">Verified Delivery Partner</h3>
            <div className="text-xs font-semibold text-gray-700">
              🚚 Daraz Express (DEX) Nepal
            </div>
          </div>

          {/* Column 4: App Download & Social */}
          <div>
            <h3 className="font-bold text-gray-900 text-sm mb-3">Shop on the Go</h3>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-lg bg-[#f85606] text-white font-black text-xl flex items-center justify-center">
                d
              </div>
              <div>
                <div className="font-bold text-gray-900">Daraz App</div>
                <div className="text-[11px] text-gray-400">Scan QR or Download</div>
              </div>
            </div>
            <div className="space-y-1.5">
              <div className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-3 py-1.5 rounded-lg font-medium cursor-pointer text-[11px] flex items-center justify-between">
                <span>Google Play Store</span>
                <span>⭐ 4.6</span>
              </div>
              <div className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-3 py-1.5 rounded-lg font-medium cursor-pointer text-[11px] flex items-center justify-between">
                <span>Apple App Store</span>
                <span>⭐ 4.7</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="border-t border-gray-100 mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between text-gray-400 text-[11px]">
          <div>
            © 2026 Daraz Nepal (Alibaba Group). All Rights Reserved.
          </div>
          <div className="mt-2 sm:mt-0 flex gap-4">
            <span className="hover:text-gray-600 cursor-pointer">Bagmati</span>
            <span className="hover:text-gray-600 cursor-pointer">Gandaki</span>
            <span className="hover:text-gray-600 cursor-pointer">Koshi</span>
            <span className="hover:text-gray-600 cursor-pointer">Lumbini</span>
            <span className="hover:text-gray-600 cursor-pointer">Madhesh</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
