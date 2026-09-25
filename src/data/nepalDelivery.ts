export interface NepalCityInfo {
  city: string;
  province: string;
  deliveryTime: string;
  baseFee: number;
  expressAvailable: boolean;
  hubPickupAvailable: boolean;
  collectionHubName: string;
  popularAreas: string[];
}

export interface NepalProvinceInfo {
  id: string;
  name: string;
  nameNp: string;
  capital: string;
  cities: NepalCityInfo[];
  standardDeliveryDays: string;
  baseDeliveryFee: number;
  expressDeliveryDays?: string;
  expressFee?: number;
  codAvailable: boolean;
}

export const NEPAL_PROVINCES: NepalProvinceInfo[] = [
  {
    id: 'bagmati',
    name: 'Bagmati Province',
    nameNp: 'बागमती प्रदेश',
    capital: 'Hetauda',
    standardDeliveryDays: '1 - 2 Business Days',
    baseDeliveryFee: 75,
    expressDeliveryDays: 'Same-Day / 24 Hours',
    expressFee: 140,
    codAvailable: true,
    cities: [
      {
        city: 'Kathmandu',
        province: 'Bagmati Province',
        deliveryTime: '24-48 Hours',
        baseFee: 65,
        expressAvailable: true,
        hubPickupAvailable: true,
        collectionHubName: 'Daraz DEX Central Hub - Thamel / Baneshwor',
        popularAreas: ['New Road', 'Thamel', 'Baneshwor', 'Koteshwor', 'Kalanki', 'Maharajgunj', 'Chabahil', 'Boudha', 'Balaju']
      },
      {
        city: 'Lalitpur',
        province: 'Bagmati Province',
        deliveryTime: '24-48 Hours',
        baseFee: 65,
        expressAvailable: true,
        hubPickupAvailable: true,
        collectionHubName: 'Daraz DEX Hub - Jawalakhel / Kumaripati',
        popularAreas: ['Patan Durbar', 'Jawalakhel', 'Kumaripati', 'Pulchowk', 'Satdobato', 'Imadol', 'Bhaisepati']
      },
      {
        city: 'Bhaktapur',
        province: 'Bagmati Province',
        deliveryTime: '24-48 Hours',
        baseFee: 70,
        expressAvailable: true,
        hubPickupAvailable: true,
        collectionHubName: 'Daraz DEX Hub - Suryabinayak',
        popularAreas: ['Suryabinayak', 'Thimi', 'Kamalbinayak', 'Byasi', 'Sallaghari', 'Duwakot']
      },
      {
        city: 'Chitwan (Bharatpur / Narayangarh)',
        province: 'Bagmati Province',
        deliveryTime: '2-3 Business Days',
        baseFee: 110,
        expressAvailable: true,
        hubPickupAvailable: true,
        collectionHubName: 'Daraz DEX Hub - Narayangarh Lions Chowk',
        popularAreas: ['Narayangarh', 'Bharatpur Height', 'Chaubiskothi', 'Ratnanagar', 'Tandi']
      },
      {
        city: 'Hetauda',
        province: 'Bagmati Province',
        deliveryTime: '2-3 Business Days',
        baseFee: 110,
        expressAvailable: false,
        hubPickupAvailable: true,
        collectionHubName: 'Daraz DEX Hub - Main Road Hetauda',
        popularAreas: ['Bhudhadan Chowk', 'Kantirajpath', 'Huprachaur']
      },
      {
        city: 'Banepa / Dhulikhel',
        province: 'Bagmati Province',
        deliveryTime: '2-3 Business Days',
        baseFee: 95,
        expressAvailable: false,
        hubPickupAvailable: true,
        collectionHubName: 'Daraz DEX Hub - Chardobato Banepa',
        popularAreas: ['Chardobato', 'Tin Dobato', 'Dhulikhel Chowk', 'Panauti']
      },
      {
        city: 'Nuwakot (Bidur / Battar)',
        province: 'Bagmati Province',
        deliveryTime: '3-4 Business Days',
        baseFee: 130,
        expressAvailable: false,
        hubPickupAvailable: false,
        collectionHubName: 'Bidur DEX Delivery Partner',
        popularAreas: ['Battar Bazaar', 'Bidur Municipality', 'Pipaltar']
      }
    ]
  },
  {
    id: 'gandaki',
    name: 'Gandaki Province',
    nameNp: 'गण्डकी प्रदेश',
    capital: 'Pokhara',
    standardDeliveryDays: '2 - 3 Business Days',
    baseDeliveryFee: 115,
    expressDeliveryDays: 'Next-Day Express (24-36 hrs)',
    expressFee: 160,
    codAvailable: true,
    cities: [
      {
        city: 'Pokhara',
        province: 'Gandaki Province',
        deliveryTime: '2-3 Days',
        baseFee: 110,
        expressAvailable: true,
        hubPickupAvailable: true,
        collectionHubName: 'Daraz DEX Central Hub - Chipledhunga / Mahendrapool',
        popularAreas: ['Lakeside', 'Mahendrapool', 'Chipledhunga', 'Prithvi Chowk', 'Birauta', 'Bagar', 'Rambazar']
      },
      {
        city: 'Damauli (Tanahun)',
        province: 'Gandaki Province',
        deliveryTime: '3-4 Days',
        baseFee: 125,
        expressAvailable: false,
        hubPickupAvailable: true,
        collectionHubName: 'Damauli DEX Station',
        popularAreas: ['Main Bazaar', 'Traffic Chowk', 'Vyas']
      },
      {
        city: 'Baglung',
        province: 'Gandaki Province',
        deliveryTime: '3-5 Days',
        baseFee: 140,
        expressAvailable: false,
        hubPickupAvailable: false,
        collectionHubName: 'Baglung Logistics Point',
        popularAreas: ['Baglung Bazaar', 'Traffic Chowk']
      },
      {
        city: 'Gorkha',
        province: 'Gandaki Province',
        deliveryTime: '3-4 Days',
        baseFee: 135,
        expressAvailable: false,
        hubPickupAvailable: false,
        collectionHubName: 'Gorkha Bazaar DEX Point',
        popularAreas: ['Haramtari', 'Old Bus Park', 'Shaktichowk']
      },
      {
        city: 'Kawasoti (Nawalpur)',
        province: 'Gandaki Province',
        deliveryTime: '2-3 Days',
        baseFee: 120,
        expressAvailable: false,
        hubPickupAvailable: true,
        collectionHubName: 'Kawasoti DEX Point',
        popularAreas: ['Thana Chowk', 'Danda', 'Sabha Griha Chowk']
      }
    ]
  },
  {
    id: 'koshi',
    name: 'Koshi Province',
    nameNp: 'कोशी प्रदेश',
    capital: 'Biratnagar',
    standardDeliveryDays: '3 - 4 Business Days',
    baseDeliveryFee: 120,
    expressDeliveryDays: '2 Business Days',
    expressFee: 170,
    codAvailable: true,
    cities: [
      {
        city: 'Biratnagar',
        province: 'Koshi Province',
        deliveryTime: '2-3 Days',
        baseFee: 115,
        expressAvailable: true,
        hubPickupAvailable: true,
        collectionHubName: 'Daraz DEX Hub - Main Road Traffic Chowk',
        popularAreas: ['Main Road', 'Traffic Chowk', 'Bargachhi', 'Tinpaini', 'Rani']
      },
      {
        city: 'Dharan',
        province: 'Koshi Province',
        deliveryTime: '3-4 Days',
        baseFee: 120,
        expressAvailable: false,
        hubPickupAvailable: true,
        collectionHubName: 'Daraz DEX Hub - Bhanu Chowk',
        popularAreas: ['Bhanu Chowk', 'Chatara Line', 'Putali Line', 'Ghoda Line']
      },
      {
        city: 'Itahari',
        province: 'Koshi Province',
        deliveryTime: '3-4 Days',
        baseFee: 120,
        expressAvailable: false,
        hubPickupAvailable: true,
        collectionHubName: 'Itahari Main Chowk Hub',
        popularAreas: ['Main Chowk', 'Sangeet Chowk', 'Tengra']
      },
      {
        city: 'Birtamod (Jhapa)',
        province: 'Koshi Province',
        deliveryTime: '3-4 Days',
        baseFee: 125,
        expressAvailable: false,
        hubPickupAvailable: true,
        collectionHubName: 'Daraz DEX Hub - Birtamod Muktichowk',
        popularAreas: ['Muktichowk', 'Bhadrapur Road', 'Sanischare Road']
      },
      {
        city: 'Damak',
        province: 'Koshi Province',
        deliveryTime: '3-4 Days',
        baseFee: 125,
        expressAvailable: false,
        hubPickupAvailable: true,
        collectionHubName: 'Damak DEX Point',
        popularAreas: ['Ganatantra Chowk', 'Thana Chowk']
      },
      {
        city: 'Ilam',
        province: 'Koshi Province',
        deliveryTime: '4-5 Days',
        baseFee: 145,
        expressAvailable: false,
        hubPickupAvailable: false,
        collectionHubName: 'Ilam Logistics Center',
        popularAreas: ['Ilam Bazaar', 'Chowk Bazaar']
      }
    ]
  },
  {
    id: 'madhesh',
    name: 'Madhesh Province',
    nameNp: 'मधेश प्रदेश',
    capital: 'Janakpur',
    standardDeliveryDays: '2 - 4 Business Days',
    baseDeliveryFee: 120,
    expressDeliveryDays: '2 Business Days',
    expressFee: 170,
    codAvailable: true,
    cities: [
      {
        city: 'Birgunj',
        province: 'Madhesh Province',
        deliveryTime: '2-3 Days',
        baseFee: 115,
        expressAvailable: true,
        hubPickupAvailable: true,
        collectionHubName: 'Daraz DEX Hub - Ghantaghar Birgunj',
        popularAreas: ['Ghantaghar', 'Adarshanagar', 'Maisthan', 'Murli Chowk']
      },
      {
        city: 'Janakpur',
        province: 'Madhesh Province',
        deliveryTime: '3-4 Days',
        baseFee: 120,
        expressAvailable: false,
        hubPickupAvailable: true,
        collectionHubName: 'Daraz DEX Hub - Ramanand Chowk',
        popularAreas: ['Ramanand Chowk', 'Bhanu Chowk', 'Janaki Mandir Area', 'Shiva Chowk']
      },
      {
        city: 'Lahan (Siraha)',
        province: 'Madhesh Province',
        deliveryTime: '3-4 Days',
        baseFee: 130,
        expressAvailable: false,
        hubPickupAvailable: true,
        collectionHubName: 'Lahan DEX Point',
        popularAreas: ['Hospital Chowk', 'Shahid Chowk']
      },
      {
        city: 'Rajbiraj (Saptari)',
        province: 'Madhesh Province',
        deliveryTime: '3-4 Days',
        baseFee: 130,
        expressAvailable: false,
        hubPickupAvailable: true,
        collectionHubName: 'Rajbiraj DEX Station',
        popularAreas: ['Netaji Chowk', 'Tribhuvan Chowk']
      },
      {
        city: 'Gaur / Kalaiya',
        province: 'Madhesh Province',
        deliveryTime: '3-5 Days',
        baseFee: 140,
        expressAvailable: false,
        hubPickupAvailable: false,
        collectionHubName: 'Kalaiya Logistics Desk',
        popularAreas: ['Bharat Chowk', 'Main Bazaar']
      }
    ]
  },
  {
    id: 'lumbini',
    name: 'Lumbini Province',
    nameNp: 'लुम्बिनी प्रदेश',
    capital: 'Deukhuri (Dang)',
    standardDeliveryDays: '3 - 4 Business Days',
    baseDeliveryFee: 125,
    expressDeliveryDays: '2 Business Days',
    expressFee: 175,
    codAvailable: true,
    cities: [
      {
        city: 'Butwal',
        province: 'Lumbini Province',
        deliveryTime: '2-3 Days',
        baseFee: 115,
        expressAvailable: true,
        hubPickupAvailable: true,
        collectionHubName: 'Daraz DEX Central Hub - Traffic Chowk / Amarpath',
        popularAreas: ['Traffic Chowk', 'Amarpath', 'Milanchowk', 'Golpark', 'Kalikanagar']
      },
      {
        city: 'Bhairahawa (Siddharthanagar)',
        province: 'Lumbini Province',
        deliveryTime: '2-3 Days',
        baseFee: 115,
        expressAvailable: true,
        hubPickupAvailable: true,
        collectionHubName: 'Daraz DEX Hub - Bank Road Bhairahawa',
        popularAreas: ['Bank Road', 'Buddha Chowk', 'Devkota Chowk', 'Belahiya']
      },
      {
        city: 'Nepalgunj',
        province: 'Lumbini Province',
        deliveryTime: '3-4 Days',
        baseFee: 125,
        expressAvailable: false,
        hubPickupAvailable: true,
        collectionHubName: 'Daraz DEX Hub - Dhamboji Chowk',
        popularAreas: ['Dhamboji Chowk', 'Tribhuvan Chowk', 'Surkhet Road', 'BP Chowk']
      },
      {
        city: 'Dang (Ghorahi / Tulsipur)',
        province: 'Lumbini Province',
        deliveryTime: '3-5 Days',
        baseFee: 135,
        expressAvailable: false,
        hubPickupAvailable: true,
        collectionHubName: 'Ghorahi DEX Delivery Point',
        popularAreas: ['Traffic Chowk Ghorahi', 'BP Chowk Tulsipur']
      },
      {
        city: 'Kohalpur (Banke)',
        province: 'Lumbini Province',
        deliveryTime: '3-4 Days',
        baseFee: 130,
        expressAvailable: false,
        hubPickupAvailable: true,
        collectionHubName: 'Kohalpur Crossroad Hub',
        popularAreas: ['Kohalpur Chowk', 'High School Area']
      },
      {
        city: 'Palpa (Tansen)',
        province: 'Lumbini Province',
        deliveryTime: '3-5 Days',
        baseFee: 140,
        expressAvailable: false,
        hubPickupAvailable: false,
        collectionHubName: 'Tansen Logistics Point',
        popularAreas: ['Shitalpati', 'Ason Chowk']
      }
    ]
  },
  {
    id: 'karnali',
    name: 'Karnali Province',
    nameNp: 'कर्णाली प्रदेश',
    capital: 'Birendranagar (Surkhet)',
    standardDeliveryDays: '4 - 6 Business Days',
    baseDeliveryFee: 150,
    codAvailable: true,
    cities: [
      {
        city: 'Birendranagar (Surkhet)',
        province: 'Karnali Province',
        deliveryTime: '3-4 Days',
        baseFee: 135,
        expressAvailable: false,
        hubPickupAvailable: true,
        collectionHubName: 'Daraz DEX Hub - Mangalgadhi Chowk Surkhet',
        popularAreas: ['Mangalgadhi Chowk', 'Birendra Chowk', 'Airport Road']
      },
      {
        city: 'Jumla (Khalanga)',
        province: 'Karnali Province',
        deliveryTime: '5-7 Days',
        baseFee: 190,
        expressAvailable: false,
        hubPickupAvailable: false,
        collectionHubName: 'Jumla Regional Drop Hub',
        popularAreas: ['Khalanga Bazaar', 'Chandannath']
      },
      {
        city: 'Dailekh',
        province: 'Karnali Province',
        deliveryTime: '4-6 Days',
        baseFee: 165,
        expressAvailable: false,
        hubPickupAvailable: false,
        collectionHubName: 'Dailekh Bazaar Logistics Desk',
        popularAreas: ['Devkota Chowk', 'Purano Bazaar']
      },
      {
        city: 'Salyan (Khalanga)',
        province: 'Karnali Province',
        deliveryTime: '4-6 Days',
        baseFee: 160,
        expressAvailable: false,
        hubPickupAvailable: false,
        collectionHubName: 'Salyan Delivery Service',
        popularAreas: ['Luham', 'Sreenagar', 'Khalanga']
      }
    ]
  },
  {
    id: 'sudurpashchim',
    name: 'Sudurpashchim Province',
    nameNp: 'सुदूरपश्चिम प्रदेश',
    capital: 'Godawari / Dhangadhi',
    standardDeliveryDays: '3 - 5 Business Days',
    baseDeliveryFee: 140,
    expressDeliveryDays: '2-3 Business Days',
    expressFee: 190,
    codAvailable: true,
    cities: [
      {
        city: 'Dhangadhi (Kailali)',
        province: 'Sudurpashchim Province',
        deliveryTime: '3-4 Days',
        baseFee: 130,
        expressAvailable: true,
        hubPickupAvailable: true,
        collectionHubName: 'Daraz DEX Hub - Main Road Dhangadhi Chowk',
        popularAreas: ['Main Road', 'Chauraha', 'Traffic Chowk', 'Campus Road', 'Hasanpur']
      },
      {
        city: 'Mahendranagar (Bhimdatta, Kanchanpur)',
        province: 'Sudurpashchim Province',
        deliveryTime: '3-4 Days',
        baseFee: 135,
        expressAvailable: false,
        hubPickupAvailable: true,
        collectionHubName: 'Daraz DEX Hub - Traffic Chowk Mahendranagar',
        popularAreas: ['Traffic Chowk', 'Galli No. 1 - 4', 'Airport Road']
      },
      {
        city: 'Tikapur (Kailali)',
        province: 'Sudurpashchim Province',
        deliveryTime: '4-5 Days',
        baseFee: 140,
        expressAvailable: false,
        hubPickupAvailable: true,
        collectionHubName: 'Tikapur DEX Point',
        popularAreas: ['Block A & B', 'Main Bazaar']
      },
      {
        city: 'Attariya (Kailali)',
        province: 'Sudurpashchim Province',
        deliveryTime: '3-4 Days',
        baseFee: 130,
        expressAvailable: false,
        hubPickupAvailable: true,
        collectionHubName: 'Attariya Chowk Hub',
        popularAreas: ['Attariya Chowk', 'Mahendra Highway Link']
      },
      {
        city: 'Dadeldhura',
        province: 'Sudurpashchim Province',
        deliveryTime: '5-6 Days',
        baseFee: 170,
        expressAvailable: false,
        hubPickupAvailable: false,
        collectionHubName: 'Dadeldhura Mountain Hub',
        popularAreas: ['Baghbazaar', 'Tuphandada', 'Kirtipur']
      }
    ]
  }
];

// Helper to get all cities flat
export const ALL_NEPAL_CITIES: NepalCityInfo[] = NEPAL_PROVINCES.flatMap(p => p.cities);

// Helper to find province by name
export function getProvinceByName(name: string): NepalProvinceInfo | undefined {
  return NEPAL_PROVINCES.find(p => p.name.toLowerCase() === name.toLowerCase());
}

// Helper to find city by name
export function getCityByName(cityName: string): NepalCityInfo | undefined {
  return ALL_NEPAL_CITIES.find(c => c.city.toLowerCase() === cityName.toLowerCase() || c.city.toLowerCase().startsWith(cityName.toLowerCase()));
}

// Delivery Options definition
export type DeliveryOptionType = 'standard' | 'express' | 'collection_point';

export interface DeliveryOptionConfig {
  id: DeliveryOptionType;
  title: string;
  titleNp: string;
  badge: string;
  icon: string;
  description: string;
  descriptionNp: string;
}

export const DELIVERY_OPTIONS_LIST: DeliveryOptionConfig[] = [
  {
    id: 'standard',
    title: 'Standard Doorstep Delivery (DEX)',
    titleNp: 'साधारण घरदैलो डेलिभरी (DEX)',
    badge: 'FREE over Rs. 2,500',
    icon: 'Truck',
    description: 'Delivered directly to your door anywhere across all 7 provinces of Nepal.',
    descriptionNp: 'नेपालका सबै ७ वटै प्रदेशमा सिधै तपाईंको घरदैलोसम्म सुरक्षित डेलिभरी।'
  },
  {
    id: 'express',
    title: 'Fast Track Express Delivery',
    titleNp: 'फास्ट ट्र्याक एक्सप्रेस डेलिभरी',
    badge: '12 - 24 Hours',
    icon: 'Zap',
    description: 'Priority courier dispatch for urgent orders within Kathmandu Valley, Pokhara, Chitwan, & Biratnagar.',
    descriptionNp: 'काठमाडौँ उपत्यका, पोखरा, चितवन र विराटनगरका लागि द्रुत डेलिभरी।'
  },
  {
    id: 'collection_point',
    title: 'Daraz Collection Point / DEX Hub Pickup',
    titleNp: 'दराज कलेक्सन प्वाइन्ट / हब पिकअप',
    badge: 'Lowest Fee / FREE',
    icon: 'Building2',
    description: 'Collect your parcel conveniently from the nearest official Daraz DEX Hub & save on delivery charges.',
    descriptionNp: 'नजिकैको आधिकारिक दराज हबबाट आफ्नै अनुकूल समयमा सामान लिनुहोस् र डेलिभरी शुल्क बचत गर्नुहोस्।'
  }
];
