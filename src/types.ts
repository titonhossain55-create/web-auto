export type PaymentMethodType = 'credit_card' | 'cod' | 'upi' | 'apple_pay' | 'google_pay' | 'paypal';
export type OrderStatusType = 'placed' | 'confirmed' | 'processing' | 'dispatched' | 'out_for_delivery' | 'delivered' | 'cancelled';
export type PaymentStatusType = 'pending' | 'paid' | 'failed' | 'refunded';

export interface VehicleCompatibility {
  makes: string[];
  models: string[];
  years: number[];
  universal?: boolean;
}

export interface ProductSpec {
  name: string;
  value: string;
}

export interface Review {
  id: string;
  productId: string;
  userName: string;
  userAvatar: string;
  rating: number;
  date: string;
  comment: string;
  verifiedPurchase: boolean;
  vehicleModel?: string;
  helpfulCount: number;
}

export interface Product {
  id: string;
  sku: string;
  name: string;
  brand: string;
  category: string;
  price: number;
  originalPrice?: number;
  stock: number;
  rating: number;
  reviewsCount: number;
  images: string[];
  description: string;
  shortDesc: string;
  features: string[];
  specs: ProductSpec[];
  compatibility: VehicleCompatibility;
  isBestSeller?: boolean;
  isNew?: boolean;
  isFeatured?: boolean;
  warrantyYears: number;
  tags: string[];
  installationDifficulty: 'Easy (DIY)' | 'Moderate (30 mins)' | 'Advanced (Pro recommended)';
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedOption?: string;
}

export interface ShippingAddress {
  fullName: string;
  email: string;
  phone: string;
  street: string;
  apartment?: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  deliveryNotes?: string;
}

export interface TrackingStep {
  status: OrderStatusType;
  title: string;
  description: string;
  timestamp: string;
  location: string;
  completed: boolean;
}

export interface DeliveryDriver {
  name: string;
  phone: string;
  photo: string;
  vehicle: string;
  licensePlate: string;
  rating: number;
  etaMinutes: number;
  currentLocationName: string;
  lat: number;
  lng: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  createdAt: string;
  customer: ShippingAddress;
  items: CartItem[];
  subtotal: number;
  shippingFee: number;
  tax: number;
  discount: number;
  total: number;
  paymentMethod: PaymentMethodType;
  paymentStatus: PaymentStatusType;
  status: OrderStatusType;
  trackingNumber: string;
  estimatedDelivery: string;
  trackingTimeline: TrackingStep[];
  driver?: DeliveryDriver;
  vehicleDetails?: {
    make: string;
    model: string;
    year: number;
  };
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar: string;
  role: 'customer' | 'admin';
  provider: 'phone_otp' | 'google' | 'gmail' | 'apple' | 'facebook' | 'github' | 'email';
  savedVehicles: {
    id: string;
    make: string;
    model: string;
    year: number;
    nickname?: string;
  }[];
  addresses: ShippingAddress[];
}

export interface PushNotification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  type: 'order' | 'stock' | 'promo' | 'system' | 'sync';
  orderId?: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'agent' | 'bot';
  senderName: string;
  senderAvatar?: string;
  text: string;
  timestamp: string;
  productSuggestion?: Product;
  orderStatusLookup?: Order;
}

export interface SyncQueueAction {
  id: string;
  timestamp: string;
  action: 'CREATE_ORDER' | 'UPDATE_STOCK' | 'ADD_PRODUCT' | 'EDIT_PRODUCT' | 'DELETE_PRODUCT' | 'ADD_REVIEW';
  payload: any;
  status: 'pending' | 'synced' | 'failed';
  retries: number;
}

export type SupportedLanguage = 'en' | 'hi' | 'es' | 'fr' | 'de' | 'ar' | 'ja' | 'bn';

export interface PromoCoupon {
  id: string;
  code: string;
  discountPercent: number;
  minOrderValue: number;
  description: string;
  isActive: boolean;
}

export interface StoreSettings {
  storeName: string;
  announcementText: string;
  announcementActive: boolean;
  freeShippingThreshold: number;
  standardShippingFee: number;
  taxRatePercent: number;
  supportPhone: string;
  supportEmail: string;
  defaultCourier: string;
}

export interface LanguageConfig {
  code: SupportedLanguage;
  name: string;
  nativeName: string;
  flag: string;
  dir: 'ltr' | 'rtl';
  currency: string;
  currencySymbol: string;
  currencyRate: number; // relative to USD
}
