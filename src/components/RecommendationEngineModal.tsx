import React, { useState } from 'react';
import { 
  X, Sparkles, Wand2, Check, ArrowRight, ShieldCheck, 
  HelpCircle, ThumbsUp, ShoppingCart, RefreshCw, Star
} from 'lucide-react';
import { Product, RecommendationCriteria, AIRecommendationResult } from '../types';
import { getSmartRecommendations } from '../services/geminiRecommendation';
import { SafeImage } from './SafeImage';

interface RecommendationEngineModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectProduct: (p: Product) => void;
  onAddToCart: (p: Product, e: React.MouseEvent) => void;
  language: 'en' | 'np';
}

export const RecommendationEngineModal: React.FC<RecommendationEngineModalProps> = ({
  isOpen,
  onClose,
  onSelectProduct,
  onAddToCart,
  language
}) => {
  if (!isOpen) return null;

  const [category, setCategory] = useState<string>('appliances');
  const [subType, setSubType] = useState<string>('refrigerator');
  const [budgetMax, setBudgetMax] = useState<number>(60000);
  const [familySize, setFamilySize] = useState<string>('3-5 Members (Standard Family)');
  const [priority, setPriority] = useState<string>('Inverter Power Saving & Nepal Surge Protection');
  const [customQuery, setCustomQuery] = useState<string>('');
  
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [results, setResults] = useState<AIRecommendationResult | null>(null);

  const handleRunRecommendation = async () => {
    setIsLoading(true);
    try {
      const criteria: RecommendationCriteria = {
        category,
        budgetMax,
        familySize,
        priorityFeature: priority,
        query: customQuery || `${subType} for ${familySize}`
      };

      const res = await getSmartRecommendations(criteria);
      setResults(res);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[92vh] flex flex-col overflow-hidden shadow-2xl relative my-auto">
        
        {/* Top Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-orange-500 to-amber-500 text-white">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center shadow-inner">
              <Sparkles className="w-5 h-5 text-yellow-200 animate-pulse" />
            </div>
            <div>
              <h2 className="text-base font-black tracking-tight">
                {language === 'en' ? 'Daraz AI Appliance & Product Advisor' : 'दराज एआई उत्पादन सल्लाहकार'}
              </h2>
              <p className="text-xs text-orange-100">
                Personalized appliance recommendations tailored for Nepali households & power conditions
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-black/20 hover:bg-black/30 text-white flex items-center justify-center transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto p-6 space-y-6 flex-1">
          {!results ? (
            <div className="space-y-5">
              <div className="bg-orange-50/70 border border-orange-200 rounded-xl p-3.5 text-xs text-gray-700 flex items-start gap-2.5">
                <Wand2 className="w-4 h-4 text-[#f85606] flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-[#f85606]">How the AI Recommendation Engine Works:</span>
                  <p className="mt-0.5 text-gray-600">
                    Tell us your family size, appliance requirements, and budget. Our smart algorithm matches the best rated models in Nepal with official compressor/motor warranties and power backup compatibility.
                  </p>
                </div>
              </div>

              {/* Step 1: Appliance Type */}
              <div>
                <label className="block text-xs font-bold text-gray-800 uppercase tracking-wider mb-2">
                  1. Which Appliance are you looking for?
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {[
                    { id: 'refrigerator', label: '❄️ Refrigerator / Freeze', cat: 'appliances' },
                    { id: 'washing-machine', label: '🧺 Washing Machine', cat: 'appliances' },
                    { id: 'smart-tv', label: '📺 Smart Google TV', cat: 'appliances' },
                    { id: 'kitchen', label: '🍳 Kitchen & Oven', cat: 'appliances' }
                  ].map(item => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => { setSubType(item.id); setCategory(item.cat); }}
                      className={`p-3 rounded-xl border text-xs font-bold transition cursor-pointer text-left ${
                        subType === item.id
                          ? 'border-[#f85606] bg-orange-50 text-[#f85606] shadow-xs'
                          : 'border-gray-200 hover:border-gray-300 text-gray-700'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Step 2: Family Size / Capacity */}
              <div>
                <label className="block text-xs font-bold text-gray-800 uppercase tracking-wider mb-2">
                  2. Household / Family Size
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {[
                    '1-2 Members (Compact / Single Door)',
                    '3-5 Members (Standard Family / 250L+ / 7-8kg)',
                    '6+ Members or Commercial (Deep Freezer / Side-by-Side)'
                  ].map(size => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => setFamilySize(size)}
                      className={`p-3 rounded-xl border text-xs font-semibold transition cursor-pointer text-left ${
                        familySize === size
                          ? 'border-[#f85606] bg-orange-50 text-[#f85606] shadow-xs'
                          : 'border-gray-200 hover:border-gray-300 text-gray-700'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Step 3: Budget Range */}
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-xs font-bold text-gray-800 uppercase tracking-wider">
                    3. Maximum Budget
                  </label>
                  <span className="text-sm font-black text-[#f85606]">
                    Up to Rs. {budgetMax.toLocaleString('en-IN')}
                  </span>
                </div>
                <input
                  type="range"
                  min={15000}
                  max={200000}
                  step={5000}
                  value={budgetMax}
                  onChange={(e) => setBudgetMax(Number(e.target.value))}
                  className="w-full accent-[#f85606] cursor-pointer"
                />
                <div className="flex justify-between text-[11px] text-gray-400 font-medium mt-1">
                  <span>Rs. 15,000</span>
                  <span>Rs. 60,000</span>
                  <span>Rs. 1,00,000</span>
                  <span>Rs. 2,00,000+</span>
                </div>
              </div>

              {/* Step 4: Special Nepal Requirements */}
              <div>
                <label className="block text-xs font-bold text-gray-800 uppercase tracking-wider mb-2">
                  4. Key Priority Feature for Nepal Homes
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {[
                    'Inverter Power Saving & Nepal Surge Protection',
                    'Works on Low Water Tank Pressure (Kathmandu)',
                    'Silent Operation & Anti-Vibration',
                    'Hot Water / Steam Wash for Winter'
                  ].map(p => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setPriority(p)}
                      className={`p-2.5 rounded-lg border text-xs text-left transition cursor-pointer ${
                        priority === p
                          ? 'border-[#f85606] bg-orange-50 text-[#f85606] font-bold'
                          : 'border-gray-200 text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom Prompt / Question */}
              <div>
                <label className="block text-xs font-bold text-gray-800 uppercase tracking-wider mb-1.5">
                  Specific Requirements or Notes (Optional)
                </label>
                <input
                  type="text"
                  value={customQuery}
                  onChange={(e) => setCustomQuery(e.target.value)}
                  placeholder="e.g. Need frost-free fridge that keeps veggies fresh for 2 weeks during power cuts..."
                  className="w-full text-xs px-3.5 py-2.5 border border-gray-300 rounded-xl outline-none focus:border-[#f85606]"
                />
              </div>

              {/* Trigger Button */}
              <button
                onClick={handleRunRecommendation}
                disabled={isLoading}
                className="w-full bg-[#f85606] hover:bg-[#d44300] text-white font-bold py-3.5 rounded-xl shadow-lg transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 text-sm"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Analyzing Appliance Catalog & Nepali User Ratings...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Generate AI Recommendations</span>
                  </>
                )}
              </button>
            </div>
          ) : (
            <div className="space-y-5">
              {/* AI Rationale Box */}
              <div className="bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200 rounded-xl p-4">
                <div className="flex items-center gap-2 text-xs font-bold text-[#f85606] mb-1">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <span>AI Recommendation Analysis</span>
                </div>
                <p className="text-xs text-gray-800 leading-relaxed font-medium">
                  {results.explanation}
                </p>
              </div>

              {/* Recommended Product Cards */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Top Matched Appliances ({results.products.length})
                  </h3>
                  <button
                    onClick={() => setResults(null)}
                    className="text-xs text-[#f85606] hover:underline font-semibold cursor-pointer"
                  >
                    Modify Search Criteria
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {results.products.map(product => (
                    <div
                      key={product.id}
                      className="bg-white rounded-xl border border-gray-200 p-3.5 flex gap-3 hover:border-orange-300 hover:shadow-md transition shadow-2xs"
                    >
                      <SafeImage
                        src={product.images[0]}
                        alt={product.title}
                        onClick={() => { onClose(); onSelectProduct(product); }}
                        className="w-20 h-20 rounded-lg object-cover cursor-pointer flex-shrink-0"
                        fallbackText={product.brand}
                      />

                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center justify-between text-[10px] text-gray-400">
                            <span className="font-bold text-[#f85606]">{product.brand}</span>
                            <div className="flex items-center gap-0.5 text-amber-500 font-bold">
                              <Star className="w-2.5 h-2.5 fill-amber-400" />
                              {product.rating}
                            </div>
                          </div>
                          <h4 
                            onClick={() => { onClose(); onSelectProduct(product); }}
                            className="text-xs font-semibold text-gray-800 line-clamp-2 hover:text-[#f85606] cursor-pointer"
                          >
                            {product.title}
                          </h4>
                          <div className="text-xs font-bold text-[#f85606] mt-1 tabular-nums font-mono">
                            Rs. {product.price.toLocaleString('en-IN')}
                          </div>
                        </div>

                        <div className="flex gap-2 mt-2">
                          <button
                            onClick={() => { onClose(); onSelectProduct(product); }}
                            className="text-[11px] font-bold text-gray-700 hover:text-[#f85606] px-2 py-1 bg-gray-100 hover:bg-orange-50 rounded cursor-pointer"
                          >
                            View Specs
                          </button>
                          <button
                            onClick={(e) => onAddToCart(product, e)}
                            className="text-[11px] font-bold text-white bg-[#f85606] hover:bg-[#d44300] px-3 py-1 rounded shadow-xs cursor-pointer flex items-center gap-1"
                          >
                            <ShoppingCart className="w-3 h-3" />
                            Add to Cart
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recommended Accessories Bundle */}
              {results.suggestedAccessories && results.suggestedAccessories.length > 0 && (
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                  <div className="text-xs font-bold text-gray-800 mb-2 flex items-center gap-1">
                    <ThumbsUp className="w-3.5 h-3.5 text-[#f85606]" />
                    <span>Recommended Protection Accessories for Nepal Homes:</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {results.suggestedAccessories.map(acc => (
                      <div key={acc.id} className="bg-white p-2.5 rounded-lg border border-gray-200 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <SafeImage src={acc.images[0]} alt="" className="w-10 h-10 rounded object-cover" fallbackText={acc.brand} />
                          <div>
                            <div className="text-xs font-semibold text-gray-800 line-clamp-1">{acc.title}</div>
                            <div className="text-xs font-bold text-[#f85606] tabular-nums font-mono">Rs. {acc.price.toLocaleString('en-IN')}</div>
                          </div>
                        </div>
                        <button
                          onClick={(e) => onAddToCart(acc, e)}
                          className="text-xs bg-orange-50 hover:bg-[#f85606] text-[#f85606] hover:text-white px-2.5 py-1 rounded font-bold border border-orange-200 cursor-pointer"
                        >
                          + Add
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <button
                onClick={() => setResults(null)}
                className="w-full py-2.5 border border-gray-300 rounded-xl text-xs font-bold text-gray-700 hover:bg-gray-50 transition cursor-pointer"
              >
                Reset & Ask Another Question
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
