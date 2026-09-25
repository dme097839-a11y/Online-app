export interface CategoryItem {
  id: string;
  name: string;
  nameNp: string;
  icon: string;
  subcategories: string[];
  bannerImage?: string;
}

export const CATEGORIES: CategoryItem[] = [
  {
    id: 'appliances',
    name: 'TV & Home Appliances',
    nameNp: 'टिभी र घरायसी उपकरण',
    icon: 'Refrigerator',
    subcategories: [
      'Refrigerators & Freezers',
      'Washing Machines',
      'Microwaves & Ovens',
      'Air Conditioners',
      'Vacuum Cleaners',
      'Water Purifiers',
      'Kitchen Appliances'
    ],
    bannerImage: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1200&q=80'
  },
  {
    id: 'electronic-devices',
    name: 'Electronic Devices',
    nameNp: 'विद्युतीय उपकरणहरू',
    icon: 'Smartphone',
    subcategories: [
      'Smartphones',
      'Laptops & Computers',
      'Tablets',
      'Smart Watches',
      'Security Cameras'
    ]
  },
  {
    id: 'electronic-accessories',
    name: 'Electronic Accessories',
    nameNp: 'इलेक्ट्रोनिक सामानहरू',
    icon: 'Headphones',
    subcategories: [
      'Audio & Headphones',
      'Mobile Accessories',
      'Power Banks & Chargers',
      'Storage Devices',
      'Computer Accessories'
    ]
  },
  {
    id: 'home-lifestyle',
    name: 'Home & Lifestyle',
    nameNp: 'घर तथा जीवनशैली',
    icon: 'Home',
    subcategories: [
      'Furniture',
      'Bedding & Bath',
      'Kitchen & Dining',
      'Home Decor',
      'Lighting & Electrical'
    ]
  },
  {
    id: 'fashion',
    name: "Fashion & Apparel",
    nameNp: 'फेसन र लत्ताकपडा',
    icon: 'Shirt',
    subcategories: [
      "Men's Clothing",
      "Women's Clothing",
      "Traditional Nepali Wear",
      'Shoes & Footwear',
      'Bags & Luggage'
    ]
  },
  {
    id: 'groceries-pets',
    name: 'Groceries & Daily Needs',
    nameNp: 'खाद्यान्न तथा दैनिक सामान',
    icon: 'ShoppingBag',
    subcategories: [
      'Beverages & Tea',
      'Cooking Essentials',
      'Snacks & Confectionery',
      'Organic Nepali Spices',
      'Pet Supplies'
    ]
  },
  {
    id: 'health-beauty',
    name: 'Health & Beauty',
    nameNp: 'स्वास्थ्य र सौन्दर्य',
    icon: 'Sparkles',
    subcategories: [
      'Skin Care',
      'Hair Care',
      'Ayurvedic & Herbal',
      'Fragrances & Perfumes',
      'Personal Care'
    ]
  },
  {
    id: 'sports-automotive',
    name: 'Sports & Motors',
    nameNp: 'खेलकुद र सवारी सामान',
    icon: 'Bike',
    subcategories: [
      'Motorcycle Gear & Helmets',
      'Car Accessories',
      'Fitness Equipment',
      'Outdoor & Camping'
    ]
  }
];

export const NEPAL_CITIES = [
  { province: 'Bagmati Province', city: 'Kathmandu', areas: ['New Road', 'Thamel', 'Baneshwor', 'Koteshwor', 'Kalanki', 'Maharajgunj', 'Chabahil', 'Boudha'], deliveryTime: '24-48 Hours', baseFee: 65 },
  { province: 'Bagmati Province', city: 'Lalitpur', areas: ['Patan Durbar', 'Jawalakhel', 'Kumaripati', 'Pulchowk', 'Satdobato', 'Imadol'], deliveryTime: '24-48 Hours', baseFee: 65 },
  { province: 'Bagmati Province', city: 'Bhaktapur', areas: ['Suryabinayak', 'Thimi', 'Kamalbinayak', 'Byasi', 'Sallaghari'], deliveryTime: '24-48 Hours', baseFee: 75 },
  { province: 'Gandaki Province', city: 'Pokhara', areas: ['Lakeside', 'Mahendrapool', 'Chipledhunga', 'Prithvi Chowk', 'Birauta'], deliveryTime: '2-3 Days', baseFee: 110 },
  { province: 'Koshi Province', city: 'Biratnagar', areas: ['Main Road', 'Traffic Chowk', 'Bargachhi', 'Tinpaini'], deliveryTime: '3-4 Days', baseFee: 120 },
  { province: 'Lumbini Province', city: 'Butwal', areas: ['Traffic Chowk', 'Amarpath', 'Milanchowk', 'Golpark'], deliveryTime: '3-4 Days', baseFee: 120 },
  { province: 'Bagmati Province', city: 'Chitwan', areas: ['Narayangarh', 'Bharatpur Height', 'Chaubiskothi', 'Ratnanagar'], deliveryTime: '2-3 Days', baseFee: 110 },
  { province: 'Koshi Province', city: 'Dharan', areas: ['Bhanu Chowk', 'Chatara Line', 'Putali Line'], deliveryTime: '3-4 Days', baseFee: 120 },
  { province: 'Lumbini Province', city: 'Nepalgunj', areas: ['Dhamboji Chowk', 'Tribhuvan Chowk', 'Surkhet Road'], deliveryTime: '4-5 Days', baseFee: 135 }
];
