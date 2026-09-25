import { Product } from '../types';

export const PRODUCTS: Product[] = [
  // --- REFRIGERATORS & FREEZERS ---
  {
    id: 'fridge-samsung-253l',
    title: 'Samsung 253L Inverter Double Door Refrigerator with Convertible 3-in-1',
    titleNp: 'स्यामसुङ २५३ लिटर इन्भर्टर डबल डोर फ्रिज',
    category: 'appliances',
    subcategory: 'Refrigerators & Freezers',
    brand: 'Samsung',
    price: 49990,
    originalPrice: 58900,
    discountPercent: 15,
    rating: 4.8,
    reviewCount: 342,
    images: [
      '/src/assets/images/product_samsung_fridge_1790350408340.jpg',
      '/src/assets/images/hero_nepal_megasale_1790350394444.jpg'
    ],
    inStock: true,
    stockCount: 18,
    isDarazMall: true,
    isFlashSale: true,
    isFreeDelivery: true,
    soldCount: 890,
    warranty: '10 Years Compressor Warranty + 1 Year Comprehensive',
    specs: {
      'Capacity': '253 Litres',
      'Door Type': 'Double Door (Frost Free)',
      'Energy Rating': '3 Star BEE Efficiency',
      'Compressor': 'Digital Inverter with 50% energy saving',
      'Deodorizer': 'Built-in Active Carbon Filter',
      'Toughened Glass Shelves': 'Yes (Up to 175kg weight capacity)',
      'Stabilizer Free Operation': '100V - 300V safe in Nepal fluctuations'
    },
    description: 'Enjoy greater energy efficiency, less noise and a long-lasting performance. The Samsung Digital Inverter Compressor automatically adjusts its speed in response to cooling demand across 7 levels. Ideal for medium-sized Nepali families of 3-5 members with stabilizer-free operation.',
    features: [
      'Convertible 3-in-1 Mode for extra storage flexibility',
      'Toughened glass shelves tested up to 175 kg',
      'MoistFresh Zone keeps fruits & veggies crisp for up to 15 days',
      'Runs on Home Inverter during Nepal load-shedding'
    ],
    tags: ['refrigerator', 'freeze', 'samsung', 'frost-free', 'inverter', 'home appliance'],
    emiAvailable: true,
    minEmiPerMonth: 4165
  },
  {
    id: 'fridge-lg-260l',
    title: 'LG 260L 3-Star Smart Inverter Frost-Free Double Door Refrigerator',
    titleNp: 'एलजी २६० लिटर स्मार्ट इन्भर्टर डबल डोर फ्रिज',
    category: 'appliances',
    subcategory: 'Refrigerators & Freezers',
    brand: 'LG',
    price: 52490,
    originalPrice: 62000,
    discountPercent: 15,
    rating: 4.9,
    reviewCount: 420,
    images: [
      'https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1584992236310-6edddc08acff?auto=format&fit=crop&w=800&q=80'
    ],
    inStock: true,
    stockCount: 12,
    isDarazMall: true,
    isFlashSale: false,
    isFreeDelivery: true,
    soldCount: 1250,
    warranty: '10 Years Smart Inverter Compressor Warranty',
    specs: {
      'Capacity': '260 Litres',
      'Door Type': 'Double Door (Frost Free)',
      'Cooling Technology': 'Door Cooling+ & Multi Air Flow',
      'Compressor': 'Smart Inverter Compressor',
      'Smart Diagnosis': 'LG ThinQ diagnosis via Smartphone',
      'Refrigerant': 'Eco-Friendly R600a Gas'
    },
    description: 'LG Door Cooling+ makes inside temperature more even and cools 35% faster than conventional cooling systems. Significantly reduces the temperature gap between the inner part and the door side of the compartment.',
    features: [
      'DoorCooling+ for uniform 360-degree chilling',
      'Smart Inverter Compressor with super-quiet sound',
      'Auto Smart Connect to power backup',
      'Express Freeze function'
    ],
    tags: ['refrigerator', 'freeze', 'lg', 'frost-free', 'smart inverter', 'home appliance'],
    emiAvailable: true,
    minEmiPerMonth: 4374
  },
  {
    id: 'fridge-cg-192l',
    title: 'CG 192L Direct Cool Single Door Refrigerator (Made for Nepal Power Grid)',
    titleNp: 'सिजी १९२ लिटर सिंगल डोर फ्रिज',
    category: 'appliances',
    subcategory: 'Refrigerators & Freezers',
    brand: 'CG',
    price: 21990,
    originalPrice: 26500,
    discountPercent: 17,
    rating: 4.6,
    reviewCount: 215,
    images: [
      'https://images.unsplash.com/photo-1584992236310-6edddc08acff?auto=format&fit=crop&w=800&q=80'
    ],
    inStock: true,
    stockCount: 25,
    isDarazMall: true,
    isFlashSale: true,
    isFreeDelivery: true,
    soldCount: 650,
    warranty: '5 Years Compressor Warranty + 1 Year Comprehensive',
    specs: {
      'Capacity': '192 Litres',
      'Door Type': 'Single Door Direct Cool',
      'Defrosting': 'Manual Defrost with Push-Button',
      'Voltage Protection': 'Built-in Heavy Surge Protector',
      'Chiller Tray': 'Super Cool Deep Chiller'
    },
    description: 'Chaudhary Group (CG) engineered specifically for Nepali homes. Ultra-low electricity consumption with thick high-density PUF insulation to keep food cold for up to 10 hours during blackouts.',
    features: [
      'Super quick ice formation in just 45 minutes',
      'Anti-bacterial gasket stops mold and fungus',
      'Large vegetable crisper with humidity controller',
      'Child safety door lock'
    ],
    tags: ['refrigerator', 'freeze', 'cg', 'budget fridge', 'single door'],
    emiAvailable: true,
    minEmiPerMonth: 1832
  },
  {
    id: 'fridge-samsung-side-by-side',
    title: 'Samsung 653L French Door Side-by-Side Refrigerator with SpaceMax & Wi-Fi',
    titleNp: 'स्यामसुङ ६५३ लिटर साइड-बाइ-साइड लक्जरी फ्रिज',
    category: 'appliances',
    subcategory: 'Refrigerators & Freezers',
    brand: 'Samsung',
    price: 185000,
    originalPrice: 220000,
    discountPercent: 16,
    rating: 4.9,
    reviewCount: 88,
    images: [
      'https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1584992236310-6edddc08acff?auto=format&fit=crop&w=800&q=80'
    ],
    inStock: true,
    stockCount: 5,
    isDarazMall: true,
    isFlashSale: false,
    isFreeDelivery: true,
    soldCount: 95,
    warranty: '20 Years Digital Inverter Compressor Warranty',
    specs: {
      'Capacity': '653 Litres',
      'Design': 'Side-by-Side Premium Stainless Steel Finish',
      'Wi-Fi': 'SmartThings Mobile App integration',
      'Cooling': 'Twin Cooling Plus with independent evaporators',
      'Sound Level': '37 dBA Silent Operation'
    },
    description: 'Experience luxury refrigeration. SpaceMax technology creates thinner walls for spacious interior storage without expanding outer dimensions. Twin Cooling Plus preserves food freshness twice as long.',
    features: [
      'SmartThings AI Energy Mode reduces power usage by 10%',
      'Plumbing-less in-door ice and water dispenser',
      'Power Freeze and Power Cool buttons',
      '20 years warranty on digital inverter compressor'
    ],
    tags: ['refrigerator', 'freeze', 'side-by-side', 'luxury', 'samsung', 'smart home'],
    emiAvailable: true,
    minEmiPerMonth: 15416
  },
  {
    id: 'fridge-baltra-deep-freezer',
    title: 'Baltra Arctic 200L Deep Freezer / Chest Freezer with Quick Freeze',
    titleNp: 'बाल्ट्रा २०० लिटर चेस्ट डिप फ्रिजर',
    category: 'appliances',
    subcategory: 'Refrigerators & Freezers',
    brand: 'Baltra',
    price: 34500,
    originalPrice: 41000,
    discountPercent: 16,
    rating: 4.7,
    reviewCount: 160,
    images: [
      'https://images.unsplash.com/photo-1584992236310-6edddc08acff?auto=format&fit=crop&w=800&q=80'
    ],
    inStock: true,
    stockCount: 14,
    isDarazMall: true,
    isFlashSale: true,
    isFreeDelivery: true,
    soldCount: 310,
    warranty: '3 Years Comprehensive Warranty',
    specs: {
      'Capacity': '200 Litres',
      'Type': 'Hard Top Chest Deep Freezer',
      'Temperature Range': '-18°C to -24°C Deep Chilling',
      'Basket': 'Heavy Duty Removable Storage Wire Basket',
      'Mobility': '360 Heavy Duty Castor Wheels'
    },
    description: 'Perfect for commercial shops, restaurants, meat storage, and large families in Nepal. Fast sub-zero chilling with low power draw.',
    features: [
      'Fast freeze switch for quick cold preservation',
      'Lock and key security',
      'Internal LED lighting',
      'Stays frozen for 24+ hours during load shedding'
    ],
    tags: ['freeze', 'deep freezer', 'chest freezer', 'baltra', 'meat storage'],
    emiAvailable: true,
    minEmiPerMonth: 2875
  },

  // --- WASHING MACHINES ---
  {
    id: 'wash-lg-8kg-front-load',
    title: 'LG 8Kg AI Direct Drive 6-Motion Fully Automatic Front Load Washing Machine',
    titleNp: 'एलजी ८ केजी एआई डाइरेक्ट ड्राइभ फ्रन्ट लोड वासिङ मेसिन',
    category: 'appliances',
    subcategory: 'Washing Machines',
    brand: 'LG',
    price: 66990,
    originalPrice: 79900,
    discountPercent: 16,
    rating: 4.9,
    reviewCount: 512,
    images: [
      '/src/assets/images/product_lg_washer_1790350421117.jpg',
      '/src/assets/images/darazmall_brands_showcase_1790350435738.jpg'
    ],
    inStock: true,
    stockCount: 16,
    isDarazMall: true,
    isFlashSale: true,
    isFreeDelivery: true,
    soldCount: 1420,
    warranty: '10 Years Motor Warranty + 2 Years Comprehensive',
    specs: {
      'Capacity': '8.0 Kg (Ideal for 4-6 members)',
      'Type': 'Front Load Fully Automatic',
      'Motor': 'AI Direct Drive Inverter (Beltless)',
      'RPM': '1400 Max Spin Speed for fast drying',
      'Heater': 'Built-in Steam allergy care (99.9% virus removal)',
      'Display': 'Full Touch LED Display with Jog Dial'
    },
    description: 'AI DD detects not only the weight, but also senses the softness of fabric, and chooses the optimal motions for the fabric by itself. Steam wash removes 99.9% allergens such as dust mites and pollen.',
    features: [
      'AI DD 18% better fabric protection',
      'Steam Allergy Care certified by British Allergy Foundation',
      'TurboWash 59 delivers immaculate wash in 59 minutes',
      'Tempered glass door and hygienic stainless steel lifter'
    ],
    tags: ['washing machine', 'lg', 'front load', 'inverter', 'ai dd', 'home appliance'],
    emiAvailable: true,
    minEmiPerMonth: 5582
  },
  {
    id: 'wash-samsung-8kg-ecobubble',
    title: 'Samsung 8Kg EcoBubble Inverter Front Load Washing Machine with Hygiene Steam',
    titleNp: 'स्यामसुङ ८ केजी इकोबबल फ्रन्ट लोड वासिङ मेसिन',
    category: 'appliances',
    subcategory: 'Washing Machines',
    brand: 'Samsung',
    price: 63500,
    originalPrice: 74900,
    discountPercent: 15,
    rating: 4.8,
    reviewCount: 390,
    images: [
      'https://images.unsplash.com/photo-1582735689369-4fe89db7114c?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?auto=format&fit=crop&w=800&q=80'
    ],
    inStock: true,
    stockCount: 20,
    isDarazMall: true,
    isFlashSale: false,
    isFreeDelivery: true,
    soldCount: 980,
    warranty: '20 Years Digital Inverter Motor Warranty',
    specs: {
      'Capacity': '8.0 Kg',
      'Type': 'Front Load Fully Automatic',
      'Technology': 'EcoBubble turns detergent into soft bubbles',
      'RPM': '1400 RPM spin speed',
      'Energy': '5-Star Energy Efficiency Rating',
      'Drum': 'Diamond Drum with gentle fabric ridges'
    },
    description: 'EcoBubble technology generates foam that penetrates fabrics 40x faster than detergent alone, removing dirt easily even in cold water and saving up to 70% electricity.',
    features: [
      'EcoBubble foam washing technology',
      'Hygiene Steam deep cleans with hot vapor',
      'Drum Clean+ removes 99.9% of odor-causing bacteria without chemicals',
      'StayClean Drawer ensures no detergent residue'
    ],
    tags: ['washing machine', 'samsung', 'front load', 'ecobubble', 'home appliance'],
    emiAvailable: true,
    minEmiPerMonth: 5291
  },
  {
    id: 'wash-whirlpool-7.5kg-top-load',
    title: 'Whirlpool 7.5Kg 360 BloomWash Fully Automatic Top Load Washing Machine',
    titleNp: 'व्हर्लपूल ७.५ केजी ब्लूमवास टप लोड वासिङ मेसिन',
    category: 'appliances',
    subcategory: 'Washing Machines',
    brand: 'Whirlpool',
    price: 36990,
    originalPrice: 44000,
    discountPercent: 16,
    rating: 4.7,
    reviewCount: 280,
    images: [
      'https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?auto=format&fit=crop&w=800&q=80'
    ],
    inStock: true,
    stockCount: 15,
    isDarazMall: true,
    isFlashSale: true,
    isFreeDelivery: true,
    soldCount: 740,
    warranty: '10 Years Motor Warranty',
    specs: {
      'Capacity': '7.5 Kg',
      'Type': 'Top Load Fully Automatic',
      'Motor': 'Hexa Bloom Impeller with 6-motion wash',
      'Water Pressure Support': 'Works even on low Nepali tank pressure (ZPF Tech)',
      'Hot Wash': 'Built-in In-Situ Water Heater'
    },
    description: 'Equipped with Zero Pressure Fill (ZPF) technology that fills tub 50% faster even if water pressure from your rooftop water tank is low. Removes up to 50 tough stains.',
    features: [
      '360 BloomWash circular water spray',
      'ZPF technology for low water pressure homes in Kathmandu',
      'In-built heater heats water up to 60°C',
      'Soft close hydraulic glass lid'
    ],
    tags: ['washing machine', 'whirlpool', 'top load', 'budget washing machine'],
    emiAvailable: true,
    minEmiPerMonth: 3082
  },
  {
    id: 'wash-yasuda-7kg-semi',
    title: 'Yasuda 7.2Kg Semi-Automatic Twin Tub Washing Machine with Magic Filter',
    titleNp: 'यासुदा ७.२ केजी सेमी-अटोमेटिक वासिङ मेसिन',
    category: 'appliances',
    subcategory: 'Washing Machines',
    brand: 'Yasuda',
    price: 15990,
    originalPrice: 19500,
    discountPercent: 18,
    rating: 4.5,
    reviewCount: 195,
    images: [
      'https://images.unsplash.com/photo-1582735689369-4fe89db7114c?auto=format&fit=crop&w=800&q=80'
    ],
    inStock: true,
    stockCount: 30,
    isDarazMall: true,
    isFlashSale: false,
    isFreeDelivery: true,
    soldCount: 880,
    warranty: '5 Years Motor Warranty + 1 Year Spare Parts',
    specs: {
      'Capacity': '7.2 Kg Wash / 5.0 Kg Spin Dryer',
      'Type': 'Semi-Automatic Twin Tub',
      'Body': 'Rust-proof Polypropylene Fiber Body',
      'Power': 'Low Wattage 380W Wash / 160W Spin',
      'Air Jet Dry': 'Super spin speed for rapid drying'
    },
    description: 'High value, ultra-durable semi-automatic washing machine popular throughout Nepal. Extremely low water and power consumption with rust-proof body.',
    features: [
      'Dual water inlets for wash and spin tubs',
      'Magic lint collector filter',
      'Castor wheels for effortless moving',
      'Anti-rat base cover'
    ],
    tags: ['washing machine', 'semi automatic', 'yasuda', 'affordable', 'twin tub'],
    emiAvailable: true,
    minEmiPerMonth: 1332
  },

  // --- OTHER APPLIANCES (TV, AC, MICROWAVE, KITCHEN) ---
  {
    id: 'tv-sony-55-bravia',
    title: 'Sony Bravia 55" 4K Ultra HD Smart Google TV (Dolby Atmos & Vision)',
    titleNp: 'सोनी ब्राभिया ५५ इन्च ४के स्मार्ट गुगल टिभी',
    category: 'appliances',
    subcategory: 'TV & Home Appliances',
    brand: 'Sony',
    price: 94990,
    originalPrice: 115000,
    discountPercent: 17,
    rating: 4.9,
    reviewCount: 310,
    images: [
      'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1461151304267-38535e780c79?auto=format&fit=crop&w=800&q=80'
    ],
    inStock: true,
    stockCount: 8,
    isDarazMall: true,
    isFlashSale: true,
    isFreeDelivery: true,
    soldCount: 420,
    warranty: '2 Years Comprehensive Warranty in Nepal',
    specs: {
      'Screen Size': '55 Inches (139 cm)',
      'Resolution': '4K HDR (3840 x 2160)',
      'Processor': 'Sony 4K Processor X1',
      'Audio': '20W Bass Reflex Speakers with Dolby Atmos',
      'Operating System': 'Google TV with Voice Remote & Chromecast built-in'
    },
    description: 'Over a billion colors are brought to life by TRILUMINOS PRO and our 4K Processor X1. With extreme contrast, everything you watch feels so real.',
    features: [
      '4K X-Reality PRO upscales 2K images to 4K',
      'Dolby Vision & Dolby Atmos cinematic sound',
      'Google Assistant remote with voice search',
      'X-Protection PRO protects against dust, surges, humidity'
    ],
    tags: ['tv', 'sony', 'smart tv', '4k', 'google tv', 'home appliance'],
    emiAvailable: true,
    minEmiPerMonth: 7915
  },
  {
    id: 'ac-samsung-1.5ton-inverter',
    title: 'Samsung 1.5 Ton WindFree Split Inverter Air Conditioner (Hot & Cold)',
    titleNp: 'स्यामसुङ १.५ टन विन्डफ्री इन्भर्टर एसी (तातो र चिसो)',
    category: 'appliances',
    subcategory: 'Air Conditioners',
    brand: 'Samsung',
    price: 89900,
    originalPrice: 108000,
    discountPercent: 17,
    rating: 4.8,
    reviewCount: 140,
    images: [
      'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=800&q=80'
    ],
    inStock: true,
    stockCount: 10,
    isDarazMall: true,
    isFlashSale: false,
    isFreeDelivery: true,
    soldCount: 220,
    warranty: '10 Years Compressor Warranty + Free Standard Installation',
    specs: {
      'Tonnage': '1.5 Ton (Ideal for 150-180 sq.ft rooms)',
      'Type': 'Hot & Cold (All season cooling and winter heating in Kathmandu)',
      'Compressor': 'Digital Inverter Boost',
      'Condenser': '100% Copper with Durafin+ anti-corrosion coating'
    },
    description: 'WindFree cooling keeps you comfortably cool without the unpleasant feeling of cold draft on your skin. Cool air is gently dispersed through 23,000 micro air holes.',
    features: [
      'WindFree cooling eliminates direct cold blasts',
      'Hot & Cold mode keeps you warm in freezing Nepali winters',
      'Copper tubes with anti-corrosion Durafin coating',
      'Tri-Care filter captures large dust, fibers, and hairs'
    ],
    tags: ['ac', 'air conditioner', 'samsung', 'inverter ac', 'heating and cooling'],
    emiAvailable: true,
    minEmiPerMonth: 7491
  },
  {
    id: 'micro-lg-28l-convection',
    title: 'LG 28L Charcoal Convection Microwave Oven with Diet Fry & Roti Maker',
    titleNp: 'एलजी २८ लिटर चारकोल कन्भेक्सन माइक्रोवेभ ओभन',
    category: 'appliances',
    subcategory: 'Microwaves & Ovens',
    brand: 'LG',
    price: 31500,
    originalPrice: 38000,
    discountPercent: 17,
    rating: 4.8,
    reviewCount: 210,
    images: [
      'https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?auto=format&fit=crop&w=800&q=80'
    ],
    inStock: true,
    stockCount: 15,
    isDarazMall: true,
    isFlashSale: true,
    isFreeDelivery: true,
    soldCount: 450,
    warranty: '10 Years Magnetron Warranty',
    specs: {
      'Capacity': '28 Litres',
      'Type': 'Convection (Baking, Grilling, Reheating & Defrosting)',
      'Heater': 'Charcoal Lighting Heater for tandoori barbecue taste',
      'Auto Cook': '301 Auto Cook Nepali & Continental Menus'
    },
    description: 'Prepare crispy tandoori chicken, baked cakes, and soft rotis at the touch of a button. Charcoal Lighting Heater maintains natural flavors and crispy exterior.',
    features: [
      'Charcoal Lighting Heater maintains juicy interior and crispy crust',
      'Diet Fry cooks samosas and fries with 88% less oil',
      'Pasteurize milk without boiling over',
      'Stainless steel cavity for hygiene and durability'
    ],
    tags: ['microwave', 'oven', 'lg', 'convection', 'air fryer', 'kitchen appliance'],
    emiAvailable: true,
    minEmiPerMonth: 2625
  },
  {
    id: 'airfryer-philips-xxl',
    title: 'Philips Essential Digital Air Fryer 4.1L with Rapid Air Technology',
    titleNp: 'फिलिप्स डिजिटल एयर फ्रायर ४.१ लिटर',
    category: 'appliances',
    subcategory: 'Kitchen Appliances',
    brand: 'Philips',
    price: 13990,
    originalPrice: 17500,
    discountPercent: 20,
    rating: 4.9,
    reviewCount: 680,
    images: [
      'https://images.unsplash.com/photo-1585515320310-259814833e62?auto=format&fit=crop&w=800&q=80'
    ],
    inStock: true,
    stockCount: 35,
    isDarazMall: true,
    isFlashSale: true,
    isFreeDelivery: true,
    soldCount: 1890,
    warranty: '2 Years Global Warranty',
    specs: {
      'Capacity': '4.1 Litres (0.8 kg food capacity)',
      'Power': '1400 Watts',
      'Presets': '7 Preset cooking modes (Fries, Meat, Fish, Baking)',
      'Temperature': 'Adjustable 60°C - 200°C'
    },
    description: 'Fry with up to 90% less oil! Rapid Air Technology with unique starfish design swirls hot air to create delicious foods that are crispy on the outside and tender on the inside.',
    features: [
      'Touchscreen with 7 convenient presets',
      'Keep warm function keeps food hot for 30 minutes',
      'QuickClean basket with non-stick coating',
      'NutriU recipe app with Nepali dishes'
    ],
    tags: ['air fryer', 'philips', 'healthy cooking', 'kitchen appliance'],
    emiAvailable: false
  },
  {
    id: 'water-kent-grand-plus',
    title: 'KENT Grand Plus 9L RO + UV + UF + TDS Controller Water Purifier',
    titleNp: 'केन्ट ग्रान्ड प्लस आरओ वाटर प्युरिफायर',
    category: 'appliances',
    subcategory: 'Water Purifiers',
    brand: 'Kent',
    price: 24990,
    originalPrice: 29500,
    discountPercent: 15,
    rating: 4.8,
    reviewCount: 340,
    images: [
      'https://images.unsplash.com/photo-1548839140-29a749e1bc4e?auto=format&fit=crop&w=800&q=80'
    ],
    inStock: true,
    stockCount: 18,
    isDarazMall: true,
    isFlashSale: false,
    isFreeDelivery: true,
    soldCount: 780,
    warranty: '1 Year Warranty + 3 Years Free Service',
    specs: {
      'Purification': 'RO + UV + UF + Alkaline + TDS Control',
      'Storage Capacity': '9 Litres pure water tank',
      'Purification Rate': '20 Litres per hour',
      'UV LED in Tank': 'Keeps stored water pure 24/7'
    },
    description: 'Designed specifically for underground tanker and jar water prevalent in Kathmandu Valley. TDS Controller retains essential natural minerals in drinking water.',
    features: [
      'Multiple purification removes arsenic, fluoride, rust and bacteria',
      'Zero Water Wastage technology re-circulates rejected water',
      'Digital filter change and UV fail alarm',
      'Transparent cover with water level indicator'
    ],
    tags: ['water purifier', 'kent', 'ro purifier', 'health', 'drinking water'],
    emiAvailable: true,
    minEmiPerMonth: 2082
  },

  // --- SMARTPHONES & ELECTRONIC DEVICES ---
  {
    id: 'phone-redmi-note13pro',
    title: 'Xiaomi Redmi Note 13 Pro 5G (8GB RAM / 256GB Storage) 200MP OIS Camera',
    titleNp: 'शाओमी रेडमी नोट १३ प्रो ५जी (८/२५६ जिबी)',
    category: 'electronic-devices',
    subcategory: 'Smartphones',
    brand: 'Xiaomi',
    price: 34999,
    originalPrice: 39999,
    discountPercent: 13,
    rating: 4.8,
    reviewCount: 780,
    images: [
      'https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80'
    ],
    inStock: true,
    stockCount: 40,
    isDarazMall: true,
    isFlashSale: true,
    isFreeDelivery: true,
    soldCount: 2300,
    warranty: '1 Year Official Nepal NTA Registered Warranty',
    specs: {
      'Camera': '200MP Ultra-clear Main Camera with OIS',
      'Display': '6.67" 1.5K 120Hz CrystalRes AMOLED',
      'Processor': 'Snapdragon 7s Gen 2 (4nm)',
      'Battery': '5100mAh with 67W Turbo Charge (In-box charger)',
      'Security': 'In-display fingerprint sensor'
    },
    description: 'Flagship-level 200MP camera with OIS anti-shake technology. Stunning 1.5K AMOLED display with Gorilla Glass Victus drop resistance.',
    features: [
      '200MP main camera captures exceptional high-resolution detail',
      '67W turbo charge hits 50% in just 15 minutes',
      'Corning Gorilla Glass Victus durability',
      'Dolby Atmos dual stereo speakers'
    ],
    tags: ['smartphone', 'xiaomi', 'redmi', '5g', 'mobile phone'],
    emiAvailable: true,
    minEmiPerMonth: 2916
  },
  {
    id: 'phone-iphone-15-pro-max',
    title: 'Apple iPhone 15 Pro Max 256GB Natural Titanium (Official GenNxt Nepal)',
    titleNp: 'एप्पल आइफोन १५ प्रो म्याक्स २५६ जिबी',
    category: 'electronic-devices',
    subcategory: 'Smartphones',
    brand: 'Apple',
    price: 198900,
    originalPrice: 215000,
    discountPercent: 7,
    rating: 5.0,
    reviewCount: 145,
    images: [
      'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80'
    ],
    inStock: true,
    stockCount: 6,
    isDarazMall: true,
    isFlashSale: false,
    isFreeDelivery: true,
    soldCount: 310,
    warranty: '1 Year Apple International & GenNxt Nepal Warranty + 1 Year Breakage Insurance',
    specs: {
      'Chipset': 'A17 Pro chip with 6-core GPU (Console Gaming)',
      'Chassis': 'Aerospace-grade Natural Titanium design',
      'Camera': '48MP Main + 5x Telephoto 120mm Optical Zoom',
      'Port': 'USB-C with USB 3 speeds up to 10Gbps'
    },
    description: 'Forged in titanium and featuring the groundbreaking A17 Pro chip, a customizable Action button, and the most powerful iPhone camera system ever.',
    features: [
      'Strong and lightweight titanium design with textured matte glass back',
      '5x optical zoom with the longest optical zoom of any iPhone',
      'Action button gives quick access to your favorite feature',
      'All-day battery life with up to 29 hours video playback'
    ],
    tags: ['iphone', 'apple', 'smartphone', 'flagship', 'pro max'],
    emiAvailable: true,
    minEmiPerMonth: 16575
  },
  {
    id: 'audio-boat-airdopes',
    title: 'boAt Airdopes 141 True Wireless Earbuds with 42H Playtime & ENx Tech',
    titleNp: 'बोट एयरडोप्स वायरलेस इयरबड्स',
    category: 'electronic-accessories',
    subcategory: 'Audio & Headphones',
    brand: 'boAt',
    price: 2199,
    originalPrice: 4499,
    discountPercent: 51,
    rating: 4.7,
    reviewCount: 1240,
    images: [
      'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=800&q=80'
    ],
    inStock: true,
    stockCount: 85,
    isDarazMall: true,
    isFlashSale: true,
    isFreeDelivery: true,
    soldCount: 5400,
    warranty: '1 Year boAt Nepal Brand Warranty',
    specs: {
      'Playtime': 'Up to 42 Hours combined battery',
      'Drivers': '8mm dynamic drivers with boAt Signature Sound',
      'Microphone': 'Quad Mics with ENx Environmental Noise Cancellation',
      'Water Resistance': 'IPX4 Sweat & Splash Resistant'
    },
    description: 'Nepal’s most popular TWS earbuds with beast mode ultra-low latency for gaming and instant wake n pair technology.',
    features: [
      'ASAP Fast charge: 5 mins charge gives 75 mins playtime',
      'Beast Mode 80ms low latency for BGMI and PUBG',
      'Smooth touch controls for tracks and calls',
      'Type-C fast charging port'
    ],
    tags: ['earbuds', 'tws', 'boat', 'wireless audio', 'flash sale'],
    emiAvailable: false
  },

  // --- ACCESSORIES FOR APPLIANCES (CROSS-SELL & RECOMMENDATIONS) ---
  {
    id: 'acc-refrigerator-stand-trolley',
    title: 'Heavy Duty Adjustable Trolley Stand for Refrigerators & Washing Machines (Nepal Made)',
    titleNp: 'फ्रिज र वासिङ मेसिनको हेभी ड्युटी स्ट्यान्ड ट्रली',
    category: 'appliances',
    subcategory: 'Kitchen Appliances',
    brand: 'Duramount',
    price: 1850,
    originalPrice: 2800,
    discountPercent: 34,
    rating: 4.7,
    reviewCount: 380,
    images: [
      'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=800&q=80'
    ],
    inStock: true,
    stockCount: 50,
    isDarazMall: false,
    isFlashSale: true,
    isFreeDelivery: false,
    soldCount: 1100,
    warranty: '2 Years Frame Warranty',
    specs: {
      'Weight Capacity': 'Up to 300 Kg load',
      'Compatibility': 'Fits all single door/double door fridges & 6-9kg washing machines',
      'Material': 'Thick powder-coated iron with 360 lockable caster wheels',
      'Elevation': 'Protects base from water floor rust'
    },
    description: 'Essential accessory for every Nepali household to prevent floor moisture rusting and easily move heavy fridges and washing machines for cleaning.',
    features: [
      'Adjustable size from 45cm x 45cm up to 70cm x 70cm',
      'Lockable rubber wheels reduce spin vibrations',
      'Rust-proof powder coat finish'
    ],
    tags: ['stand', 'trolley', 'refrigerator accessory', 'washing machine stand'],
    emiAvailable: false
  },
  {
    id: 'acc-voltage-stabilizer-vguard',
    title: 'V-Guard VG 50 Voltage Stabilizer for Refrigerators up to 300L (Nepal Grid Safe)',
    titleNp: 'भि-गार्ड डिजिटल भोल्टेज स्टेबलाइजर',
    category: 'appliances',
    subcategory: 'TV & Home Appliances',
    brand: 'V-Guard',
    price: 2490,
    originalPrice: 3200,
    discountPercent: 22,
    rating: 4.8,
    reviewCount: 420,
    images: [
      'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80'
    ],
    inStock: true,
    stockCount: 40,
    isDarazMall: true,
    isFlashSale: false,
    isFreeDelivery: true,
    soldCount: 1350,
    warranty: '3 Years Comprehensive Warranty',
    specs: {
      'Input Voltage Range': '130V - 290V wide protection',
      'Capacity': '2.0 Amp',
      'Time Delay': 'Initial 3-minute delay protects compressor',
      'Cabinet': 'High quality fire-retardant ABS casing'
    },
    description: 'Safeguard your expensive refrigerator compressor against Nepal power surges, low voltage drops, and sudden grid spikes.',
    features: [
      'Intelligent Time Delay System (ITDS) protects compressor',
      'High/Low voltage cut-off protection',
      'Digital LED status indicators'
    ],
    tags: ['stabilizer', 'vguard', 'power protection', 'refrigerator accessory'],
    emiAvailable: false
  },
  {
    id: 'acc-anti-vibration-pads',
    title: 'Universal Anti-Vibration Rubber Foot Pads for Washing Machines (Set of 4)',
    titleNp: 'वासिङ मेसिन कम्पन रोक्ने रबर प्याड (४ वटा)',
    category: 'appliances',
    subcategory: 'Washing Machines',
    brand: 'CleanTech',
    price: 499,
    originalPrice: 999,
    discountPercent: 50,
    rating: 4.6,
    reviewCount: 560,
    images: [
      'https://images.unsplash.com/photo-1582735689369-4fe89db7114c?auto=format&fit=crop&w=800&q=80'
    ],
    inStock: true,
    stockCount: 120,
    isDarazMall: false,
    isFlashSale: true,
    isFreeDelivery: false,
    soldCount: 2900,
    warranty: '6 Months Replacement',
    specs: {
      'Quantity': '4 Pieces heavy suction pads',
      'Material': 'Industrial TPU resin + rubber',
      'Noise Reduction': 'Reduces machine shaking and floor noise by 85%'
    },
    description: 'Stops your washing machine from walking across the floor during heavy spin cycles and dampens loud vibrations in Nepali apartment floors.',
    features: [
      'Suction cup grip holds firm on tile, marble, and concrete',
      'Lifts machine 4cm off ground for easy mop cleaning',
      'Dampens high RPM spin noises'
    ],
    tags: ['pads', 'vibration', 'washing machine accessory', 'budget item'],
    emiAvailable: false
  },

  // --- NEPALI SPECIALTIES & FASHION ---
  {
    id: 'fashion-goldstar-shoes',
    title: 'Goldstar Men Classic Sneaker 033 (Genuine Original Nepali Made)',
    titleNp: 'गोल्डस्टार क्लासिक ओरिजिनल स्निकर जुत्ता',
    category: 'fashion',
    subcategory: 'Shoes & Footwear',
    brand: 'Goldstar',
    price: 1250,
    originalPrice: 1550,
    discountPercent: 19,
    rating: 4.8,
    reviewCount: 920,
    images: [
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80'
    ],
    inStock: true,
    stockCount: 70,
    isDarazMall: true,
    isFlashSale: true,
    isFreeDelivery: true,
    soldCount: 3800,
    warranty: '6 Months Sole Warranty',
    specs: {
      'Upper Material': 'Breathable canvas and PU mesh',
      'Sole': 'Anti-skid vulcanized pure rubber',
      'Origin': 'Proudly Manufactured in Nepal'
    },
    description: 'Nepal’s beloved national footwear brand! Unbeatable comfort, extreme durability for rough roads, and classic style.',
    features: [
      '100% Original Goldstar verified badge',
      'High grip rubber sole for hiking and daily wear',
      'Lightweight and washable'
    ],
    tags: ['goldstar', 'shoes', 'nepali brand', 'sneakers', 'fashion'],
    emiAvailable: false
  },
  {
    id: 'grocery-nepali-tea',
    title: 'Tokla Gold Premium Orthodox CTC Nepali Tea Blend (1 Kg Family Pack)',
    titleNp: 'टोक्ला गोल्ड प्रिमियम नेपाली चियापत्ती १ केजी',
    category: 'groceries-pets',
    subcategory: 'Beverages & Tea',
    brand: 'Tokla',
    price: 680,
    originalPrice: 850,
    discountPercent: 20,
    rating: 4.9,
    reviewCount: 640,
    images: [
      'https://images.unsplash.com/photo-1597481499750-3e6b22637e12?auto=format&fit=crop&w=800&q=80'
    ],
    inStock: true,
    stockCount: 90,
    isDarazMall: true,
    isFlashSale: false,
    isFreeDelivery: false,
    soldCount: 2100,
    warranty: 'Freshness Guaranteed (18 Months Shelf Life)',
    specs: {
      'Estate': 'Direct from Ilam & Jhapa tea gardens',
      'Roast': 'Rich golden CTC liquor with aromatic orthodox flavor',
      'Net Weight': '1000 Grams'
    },
    description: 'Wake up to the true authentic taste of eastern Nepal high hill tea estates. Rich color, strong aroma, and unmatched taste with milk or black.',
    features: [
      'Freshly harvested from tea gardens of Ilam',
      'Aroma-locked multi-layer silver foil pouch',
      'Rich malt flavor'
    ],
    tags: ['tea', 'tokla', 'nepali tea', 'ilam tea', 'grocery'],
    emiAvailable: false
  }
];

export const MOCK_REVIEWS = [
  {
    id: 'rev-1',
    userName: 'Ramesh Sharma (Kathmandu)',
    rating: 5,
    date: '3 days ago',
    comment: 'Ordered the Samsung Inverter Fridge during the Daraz flash sale. Delivery arrived in Baneshwor the very next day! Installation team was very polite and tested cooling on the spot. eSewa payment was instant. 10/10 service!',
    verifiedPurchase: true,
    helpfulCount: 38
  },
  {
    id: 'rev-2',
    userName: 'Pooja Shrestha (Lalitpur, Patan)',
    rating: 5,
    date: '1 week ago',
    comment: 'LG Front Load Washing machine is extremely silent! Clothes come out almost 90% dry and fresh. Very happy with Daraz Nepal warranty and genuine invoice.',
    verifiedPurchase: true,
    helpfulCount: 24
  },
  {
    id: 'rev-3',
    userName: 'Bikash Gurung (Pokhara)',
    rating: 4,
    date: '2 weeks ago',
    comment: 'Delivered to Pokhara Lakeside in 3 days. Packed in original box with wooden pallet. Works nicely on our low water pressure.',
    verifiedPurchase: true,
    helpfulCount: 15
  }
];

export const OFFICIAL_BRANDS = [
  { name: 'Samsung Nepal', logo: 'SAMSUNG', verified: true, discountText: 'Up to 35% Off' },
  { name: 'LG Official Store', logo: 'LG', verified: true, discountText: 'Life\'s Good Deals' },
  { name: 'CG Digital', logo: 'CG', verified: true, discountText: 'Nepal Pride 40% Off' },
  { name: 'Whirlpool Nepal', logo: 'WHIRLPOOL', verified: true, discountText: 'Everyday Care' },
  { name: 'Baltra Nepal', logo: 'BALTRA', verified: true, discountText: 'Home & Kitchen' },
  { name: 'Xiaomi Nepal', logo: 'XIAOMI', verified: true, discountText: 'Redmi Mega Fest' },
  { name: 'Goldstar Nepal', logo: 'GOLDSTAR', verified: true, discountText: 'Pride of Nepal' },
  { name: 'Philips Electronics', logo: 'PHILIPS', verified: true, discountText: 'Healthy Living' }
];

export const PROMO_VOUCHERS = [
  { code: 'DARAZNEW150', title: 'New Customer Welcome Voucher', minSpend: 1000, discount: 150, description: 'Rs. 150 OFF on first purchase' },
  { code: 'APPLIANCE2000', title: 'Home Appliance Mahotsav', minSpend: 25000, discount: 2000, description: 'Rs. 2,000 OFF on Fridges & Washing Machines' },
  { code: 'ESEWAPAY', title: 'eSewa Digital Cashback', minSpend: 5000, discount: 500, description: 'Flat Rs. 500 OFF with eSewa Payment' },
  { code: 'KHALTI500', title: 'Khalti Bonanza', minSpend: 5000, discount: 500, description: 'Flat Rs. 500 OFF with Khalti wallet' }
];

export const initialProducts = PRODUCTS;

