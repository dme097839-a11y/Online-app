import React from 'react';
import { ShieldCheck, ChevronRight, Award, CheckCircle2, RotateCcw, Truck } from 'lucide-react';
import { OFFICIAL_BRANDS } from '../data/products';
import { SafeImage } from './SafeImage';

interface DarazMallProps {
  onSelectBrand: (brandName: string) => void;
  language: 'en' | 'np';
}

export const DarazMallSection: React.FC<DarazMallProps> = ({ onSelectBrand, language }) => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-4">
      {/* Editorial Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 pb-2 border-b border-gray-200/80 gap-2">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#d91222] text-white flex items-center justify-center shadow-xs">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base md:text-lg font-bold tracking-tight text-gray-900">
              {language === 'en' ? 'Daraz Mall — Official Flagship Stores' : 'दराज मल — आधिकारिक ब्रान्ड स्टोरहरू'}
            </h2>
            <div className="flex items-center gap-3 text-xs text-gray-500 mt-0.5">
              <span className="flex items-center gap-1 text-emerald-700 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5" /> 100% Authentic
              </span>
              <span aria-hidden="true" className="text-gray-300">·</span>
              <span className="flex items-center gap-1 text-gray-600">
                <RotateCcw className="w-3.5 h-3.5" /> 14 Days Free Return
              </span>
              <span aria-hidden="true" className="text-gray-300">·</span>
              <span className="flex items-center gap-1 text-gray-600">
                <Truck className="w-3.5 h-3.5" /> Express DEX Delivery
              </span>
            </div>
          </div>
        </div>

        <button 
          onClick={() => onSelectBrand('all')}
          className="text-xs font-semibold text-[#f85606] hover:text-[#d04500] flex items-center gap-1 transition self-start md:self-auto cursor-pointer"
        >
          <span>{language === 'en' ? 'Browse All Mall Brands' : 'सबै ब्रान्डहरू हेर्नुहोस्'}</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Featured Mall Campaign Banner & Brand Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch mb-2">
        {/* Editorial Mall Spotlight Card */}
        <div className="lg:col-span-4 relative rounded-xl overflow-hidden bg-neutral-900 text-white min-h-[180px] p-5 flex flex-col justify-between shadow-sm">
          <SafeImage
            src="/src/assets/images/darazmall_brands_showcase_1790350435738.jpg"
            alt="Daraz Mall Flagship Showcase"
            className="absolute inset-0 w-full h-full object-cover opacity-45 mix-blend-luminosity scale-100 hover:scale-105 transition-transform duration-500"
            fallbackText="Daraz Mall Brands"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
          
          <div className="relative z-10">
            <span className="text-[11px] font-bold uppercase tracking-widest text-amber-400">
              {language === 'en' ? 'Official Brand Partners' : 'आधिकारिक ब्रान्ड पार्टनर'}
            </span>
            <h3 className="text-lg font-bold text-white mt-1 leading-snug">
              {language === 'en' ? 'Direct from Authorized Nepal Distributors' : 'नेपालका अधिकृत वितरकहरूबाट सिधै'}
            </h3>
            <p className="text-xs text-gray-300 mt-1 max-w-xs leading-relaxed">
              {language === 'en' ? 'Original manufacturer warranty, VAT invoice, and authorized service centers nationwide.' : 'ओरिजिनल कम्पनी वारेन्टी, भ्याट बिल र नेपालभर अधिकृत सेवा केन्द्रहरू।'}
            </p>
          </div>

          <div className="relative z-10 pt-3">
            <button
              onClick={() => onSelectBrand('Samsung')}
              className="text-xs font-semibold bg-white text-gray-950 px-3.5 py-1.5 rounded-md hover:bg-orange-50 hover:text-[#f85606] transition cursor-pointer"
            >
              {language === 'en' ? 'Explore Samsung & LG Flagship' : 'स्यामसुङ र एलजी हेर्नुहोस्'}
            </button>
          </div>
        </div>

        {/* Brand Logos Grid */}
        <div className="lg:col-span-8 grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {OFFICIAL_BRANDS.map((brand, idx) => (
            <div
              key={idx}
              onClick={() => onSelectBrand(brand.name.split(' ')[0])}
              className="bg-white rounded-lg border border-gray-100 p-3 hover:border-red-500/60 hover:shadow-md transition cursor-pointer text-center group flex flex-col justify-between items-center"
            >
              <div className="w-12 h-12 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center font-bold text-gray-800 text-xs mb-2 group-hover:scale-105 transition">
                {brand.logo}
              </div>

              <div>
                <div className="text-xs font-semibold text-gray-900 group-hover:text-red-600 transition flex items-center justify-center gap-1">
                  <span>{brand.name}</span>
                  <Award className="w-3 h-3 text-red-500 fill-red-500" />
                </div>
                <div className="text-[11px] text-gray-500 font-normal mt-0.5">
                  {brand.discountText}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

