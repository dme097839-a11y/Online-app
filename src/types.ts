export interface Product {
  id: string;
  title: string;
  titleNp?: string;
  category: string;
  subcategory: string;
  brand: string;
  price: number;
  originalPrice: number;
  discountPercent: number;
  rating: number;
  reviewCount: number;
  images: string[];
  inStock: boolean;
  stockCount: number;
  isDarazMall?: boolean;
  isFlashSale?: boolean;
  isFreeDelivery?: boolean;
  soldCount?: number;
  warranty: string;
  specs: Record<string, string>;
  description: string;
  features: string[];
  tags: string[];
  emiAvailable?: boolean;
  minEmiPerMonth?: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedColor?: string;
  selectedVariant?: string;
}

export interface ShippingAddress {
  fullName: string;
  phoneNumber: string;
  province: string;
  city: string;
  zone: string;
  streetAddress: string;
  landmark?: string;
  addressType: 'home' | 'office';
  deliveryOption?: 'standard' | 'express' | 'collection_point';
  collectionPointName?: string;
}

// Strictly requested: Removed ConnectIPS, EMI, and Debit/Credit Card.
// Remaining options: eSewa, Khalti, IME Pay, Bank/Fonepay QR, and Cash on Delivery.
export type PaymentMethodType = 
  | 'esewa' 
  | 'khalti' 
  | 'ime_pay' 
  | 'bank_qr'
  | 'cod';

export interface Order {
  id: string;
  trackingNumber: string;
  createdAt: string;
  customerId?: string;
  customerEmail?: string;
  customerName?: string;
  customerPhone?: string;
  items: CartItem[];
  shippingAddress: ShippingAddress;
  paymentMethod: PaymentMethodType;
  subtotal: number;
  deliveryFee: number;
  discount: number;
  total: number;
  status: 'placed' | 'confirmed' | 'packed' | 'shipped' | 'out_for_delivery' | 'delivered' | 'cancelled';
  paymentStatus: 'paid' | 'pending' | 'verified' | 'failed';
  estimatedDelivery: string;
  deliveryOption?: 'standard' | 'express' | 'collection_point';
  collectionPointName?: string;
  transactionId?: string;
  paymentSlipUrl?: string; // QR payment receipt screenshot / slip
  adminNotes?: string;
}

export interface GatewayInfo {
  active: boolean;
  accountName: string;
  accountNumber: string;
  qrCodeUrl: string;
  instructions: string;
}

export interface BankGatewayInfo extends GatewayInfo {
  bankName: string;
}

export interface PaymentGatewaysConfig {
  esewa: GatewayInfo;
  khalti: GatewayInfo;
  ime_pay: GatewayInfo;
  bank_qr: BankGatewayInfo;
  cod: {
    active: boolean;
    instructions: string;
  };
}

export interface RecommendationCriteria {
  category?: string;
  budgetMax?: number;
  familySize?: string;
  priorityFeature?: string;
  query?: string;
}

export interface AIRecommendationResult {
  products: Product[];
  explanation: string;
  suggestedAccessories?: Product[];
}

export interface UserProfile {
  uid: string;
  email: string;
  username?: string;
  displayName: string;
  phoneNumber?: string;
  role: 'customer' | 'admin';
  passwordHash?: string;
  createdAt?: string;
}
