import { GoogleGenAI } from '@google/genai';
import { Product, AIRecommendationResult, RecommendationCriteria } from '../types';
import { PRODUCTS } from '../data/products';

export async function getSmartRecommendations(
  criteria: RecommendationCriteria,
  viewedProduct?: Product | null
): Promise<AIRecommendationResult> {
  const apiKey = (import.meta as any).env?.VITE_GEMINI_API_KEY || (process as any).env?.GEMINI_API_KEY;

  // Rule-based high precision filter matching first
  let candidates = [...PRODUCTS];

  if (criteria.category && criteria.category !== 'all') {
    const cat = criteria.category.toLowerCase();
    candidates = candidates.filter(p => p.category.toLowerCase() === cat || p.subcategory.toLowerCase().includes(cat));
  }

  if (criteria.budgetMax && criteria.budgetMax > 0) {
    candidates = candidates.filter(p => p.price <= criteria.budgetMax!);
  }

  if (criteria.query && criteria.query.trim().length > 0) {
    const q = criteria.query.toLowerCase();
    candidates = candidates.filter(p => 
      p.title.toLowerCase().includes(q) ||
      p.tags.some(t => t.toLowerCase().includes(q)) ||
      p.brand.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q)
    );
  }

  // If no strict match, fallback to all relevant appliance products
  if (candidates.length === 0) {
    candidates = PRODUCTS.slice(0, 5);
  }

  // Related accessories logic for appliances
  let suggestedAccessories: Product[] = [];
  if (viewedProduct) {
    if (viewedProduct.tags.includes('refrigerator') || viewedProduct.tags.includes('freeze')) {
      suggestedAccessories = PRODUCTS.filter(p => 
        p.id === 'acc-refrigerator-stand-trolley' || 
        p.id === 'acc-voltage-stabilizer-vguard'
      );
    } else if (viewedProduct.tags.includes('washing machine')) {
      suggestedAccessories = PRODUCTS.filter(p => 
        p.id === 'acc-anti-vibration-pads' || 
        p.id === 'acc-refrigerator-stand-trolley'
      );
    }
  }

  // If Gemini API is available, ask Gemini to provide tailored Nepali household advice and top picks
  if (apiKey && apiKey !== 'MY_GEMINI_API_KEY') {
    try {
      const ai = new GoogleGenAI({ apiKey });
      const prompt = `You are Daraz Nepal's expert Home Appliance and Shopping Advisor.
User criteria:
- Query/Need: "${criteria.query || 'Home appliances for Nepali household'}"
- Category: "${criteria.category || 'all'}"
- Max Budget: Rs. ${criteria.budgetMax || 'Flexible'}
- Family Size: "${criteria.familySize || 'Not specified'}"
- Special Preference: "${criteria.priorityFeature || 'High durability, energy saving, voltage fluctuation protection'}"

Here are available products in catalog:
${PRODUCTS.map(p => `ID: ${p.id} | Title: ${p.title} | Price: Rs. ${p.price} | Brand: ${p.brand} | Features: ${p.features.join(', ')}`).join('\n')}

Select the top 2-4 best matching product IDs and write a helpful 2-sentence rationale in friendly Nepali-English marketplace tone (explaining why they are ideal for Kathmandu/Nepal homes, power fluctuations, and value).
Respond ONLY in valid JSON matching this schema:
{
  "recommendedProductIds": ["id1", "id2"],
  "explanation": "concise rationale"
}`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
        }
      });

      const responseText = response.text?.trim();
      if (responseText) {
        const parsed = JSON.parse(responseText);
        if (parsed.recommendedProductIds && Array.isArray(parsed.recommendedProductIds)) {
          const matched = PRODUCTS.filter(p => parsed.recommendedProductIds.includes(p.id));
          if (matched.length > 0) {
            return {
              products: matched,
              explanation: parsed.explanation || 'Personalized recommendations tailored for your household needs and budget in Nepal.',
              suggestedAccessories
            };
          }
        }
      }
    } catch (err) {
      console.warn('Gemini recommendation call fallback:', err);
    }
  }

  // Smart heuristic fallback (instant, zero-latency, realistic)
  let explanation = 'Top recommended products based on Nepal power reliability, brand warranty, and customer satisfaction ratings.';
  if (criteria.query) {
    explanation = `Recommended based on your search for "${criteria.query}". Includes verified Daraz Mall warranty and best Nepali customer feedback.`;
  } else if (criteria.budgetMax) {
    explanation = `Best value-for-money options within your budget of Rs. ${criteria.budgetMax.toLocaleString('en-IN')} with official brand warranty.`;
  }

  // Sort by rating and popularity
  const topProducts = candidates.sort((a, b) => (b.rating * b.soldCount!) - (a.rating * a.soldCount!)).slice(0, 4);

  return {
    products: topProducts.length > 0 ? topProducts : PRODUCTS.slice(0, 4),
    explanation,
    suggestedAccessories
  };
}
