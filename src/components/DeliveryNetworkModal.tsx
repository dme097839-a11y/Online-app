import React, { useState } from 'react';
import { 
  X, 
  Truck, 
  MapPin, 
  Zap, 
  Building2, 
  CheckCircle2, 
  ShieldCheck, 
  Clock, 
  Banknote, 
  HelpCircle,
  Search
} from 'lucide-react';
import { NEPAL_PROVINCES, DELIVERY_OPTIONS_LIST, NepalProvinceInfo } from '../data/nepalDelivery';

interface DeliveryNetworkModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: 'en' | 'np';
}

export const DeliveryNetworkModal: React.FC<DeliveryNetworkModalProps> = ({
  isOpen,
  onClose,
  language
}) => {
  const [selectedProvinceId, setSelectedProvinceId] = useState<string>('bagmati');
  const [searchCityQuery, setSearchCityQuery] = useState('');

  if (!isOpen) return null;

  const currentProvince: NepalProvinceInfo = 
    NEPAL_PROVINCES.find(p => p.id === selectedProvinceId) || NEPAL_PROVINCES[0];

  const filteredCities = currentProvince.cities.filter(c => 
    c.city.toLowerCase().includes(searchCityQuery.toLowerCase()) ||
    c.popularAreas.some(a => a.toLowerCase().includes(searchCityQuery.toLowerCase()))
  );

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/65 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-4xl w-full overflow-hidden shadow-2xl relative border border-gray-100 max-h-[92vh] flex flex-col">
        
        {/* Modal Header */}
        <div className="bg-[#F85606] text-white px-6 py-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center border border-white/20">
              <Truck className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold">
                {language === 'en' ? 'Nepal Delivery Network & Province Guide' : 'नेपाल डेलिभरी सञ्जाल र प्रदेश जानकारी'}
              </h2>
              <p className="text-xs text-orange-100">
                100% Doorstep Coverage across all 7 Provinces with Daraz Express (DEX)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-white/20 flex items-center justify-center text-white cursor-pointer transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 3 Core Delivery Options Highlight */}
        <div className="bg-orange-50/60 border-b border-orange-100 p-4 shrink-0 grid grid-cols-1 md:grid-cols-3 gap-3">
          {DELIVERY_OPTIONS_LIST.map((opt) => (
            <div key={opt.id} className="bg-white p-3 rounded-xl border border-orange-200/70 shadow-xs flex items-start gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#F85606]/10 text-[#F85606] flex items-center justify-center shrink-0 mt-0.5">
                {opt.id === 'standard' && <Truck className="w-4 h-4" />}
                {opt.id === 'express' && <Zap className="w-4 h-4" />}
                {opt.id === 'collection_point' && <Building2 className="w-4 h-4" />}
              </div>
              <div>
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-xs font-bold text-gray-900">{opt.title}</span>
                  <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-1.5 py-0.2 rounded">
                    {opt.badge}
                  </span>
                </div>
                <p className="text-[11px] text-gray-600 mt-1 leading-snug">
                  {language === 'en' ? opt.description : opt.descriptionNp}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Content Body: Province Selector + Province Details */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          
          {/* Province Selector Pills */}
          <div>
            <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#F85606]" />
              <span>Select Province in Nepal ({NEPAL_PROVINCES.length} Total)</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2">
              {NEPAL_PROVINCES.map((prov) => (
                <button
                  key={prov.id}
                  onClick={() => setSelectedProvinceId(prov.id)}
                  className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center ${
                    selectedProvinceId === prov.id
                      ? 'border-[#F85606] bg-[#F85606] text-white shadow-sm font-bold scale-[1.02]'
                      : 'border-gray-200 bg-gray-50 hover:bg-white text-gray-700 font-medium'
                  }`}
                >
                  <span className="text-xs">{prov.name.replace(' Province', '')}</span>
                  <span className={`text-[10px] ${selectedProvinceId === prov.id ? 'text-orange-100' : 'text-gray-500'}`}>
                    {prov.nameNp}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Active Province Card */}
          <div className="bg-gray-50 rounded-2xl p-4 sm:p-5 border border-gray-200 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-gray-200 gap-2">
              <div>
                <h3 className="text-base font-extrabold text-gray-900 flex items-center gap-2">
                  <span>{currentProvince.name}</span>
                  <span className="text-sm font-semibold text-gray-500">({currentProvince.nameNp})</span>
                </h3>
                <p className="text-xs text-gray-500">
                  Provincial Hub Capital: <strong className="text-gray-800">{currentProvince.capital}</strong> | Cash on Delivery: <span className="text-emerald-700 font-bold">100% Available</span>
                </p>
              </div>

              <div className="flex items-center gap-3 text-xs">
                <div className="bg-white px-3 py-1.5 rounded-lg border border-gray-200 text-center">
                  <span className="text-gray-400 block text-[10px]">Standard Delivery</span>
                  <strong className="text-gray-900">{currentProvince.standardDeliveryDays}</strong>
                </div>
                <div className="bg-white px-3 py-1.5 rounded-lg border border-gray-200 text-center">
                  <span className="text-gray-400 block text-[10px]">Base Fee</span>
                  <strong className="text-[#F85606]">Rs. {currentProvince.baseDeliveryFee}</strong>
                </div>
              </div>
            </div>

            {/* City search filter within selected province */}
            <div className="flex items-center justify-between gap-4">
              <div className="relative flex-1 max-w-sm">
                <input
                  type="text"
                  value={searchCityQuery}
                  onChange={(e) => setSearchCityQuery(e.target.value)}
                  placeholder={`Search cities in ${currentProvince.name}...`}
                  className="w-full text-xs pl-8 pr-3 py-2 bg-white rounded-lg border border-gray-300 outline-none focus:border-[#F85606]"
                />
                <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-2.5" />
              </div>

              <span className="text-xs text-gray-500 font-medium">
                {filteredCities.length} Cities / Hubs Covered
              </span>
            </div>

            {/* Cities Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
              {filteredCities.map((city, idx) => (
                <div key={idx} className="bg-white p-3.5 rounded-xl border border-gray-200 shadow-2xs hover:border-orange-200 transition space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-gray-900 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-[#F85606]" />
                      {city.city}
                    </span>
                    <span className="text-xs font-bold text-[#F85606]">
                      Rs. {city.baseFee} (Free &gt; 2500)
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-[11px] text-gray-600">
                    <Clock className="w-3 h-3 text-gray-400" />
                    <span>Est. Delivery: <strong>{city.deliveryTime}</strong></span>
                    {city.expressAvailable && (
                      <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-1.5 py-0.2 rounded flex items-center gap-0.5">
                        <Zap className="w-2.5 h-2.5" /> Express 24h
                      </span>
                    )}
                  </div>

                  {city.hubPickupAvailable && (
                    <div className="text-[11px] text-indigo-700 bg-indigo-50/60 p-1.5 rounded-md flex items-center gap-1.5">
                      <Building2 className="w-3 h-3 shrink-0" />
                      <span className="truncate">{city.collectionHubName}</span>
                    </div>
                  )}

                  <div className="text-[10px] text-gray-500 pt-1 border-t border-gray-100">
                    Areas: {city.popularAreas.slice(0, 4).join(', ')}{city.popularAreas.length > 4 ? '...' : ''}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Daraz Nepal Nationwide Delivery Guarantees */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-emerald-900 block font-bold">Free Delivery Policy</strong>
                <p className="text-emerald-700 text-[11px]">Free standard delivery across all provinces on cart values above Rs. 2,500.</p>
              </div>
            </div>

            <div className="bg-orange-50 border border-orange-200 rounded-xl p-3 flex items-start gap-2">
              <Banknote className="w-4 h-4 text-[#F85606] shrink-0 mt-0.5" />
              <div>
                <strong className="text-orange-900 block font-bold">Cash On Delivery (COD)</strong>
                <p className="text-orange-700 text-[11px]">Pay right at your doorstep after inspecting the sealed Daraz package.</p>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-blue-900 block font-bold">14-Day Free Returns</strong>
                <p className="text-blue-700 text-[11px]">Hassle-free parcel return pickup arranged from your home or local DEX hub.</p>
              </div>
            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="bg-gray-50 px-6 py-3 border-t border-gray-100 flex items-center justify-between shrink-0 text-xs">
          <span className="text-gray-500">
            Powered by Daraz Express Logistics Network (DEX Nepal)
          </span>
          <button
            onClick={onClose}
            className="bg-[#F85606] hover:bg-[#d94800] text-white px-4 py-2 rounded-lg font-bold transition cursor-pointer"
          >
            Got It
          </button>
        </div>

      </div>
    </div>
  );
};
