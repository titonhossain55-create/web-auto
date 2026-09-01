import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import {
  Product,
  CartItem,
  Order,
  UserProfile,
  PushNotification,
  ChatMessage,
  SyncQueueAction,
  SupportedLanguage,
  OrderStatusType,
  ShippingAddress,
  PaymentMethodType,
  Review,
  PromoCoupon,
  StoreSettings,
} from '../types';
import { INITIAL_PRODUCTS, MOCK_REVIEWS } from '../data/mockProducts';
import { LANGUAGES, translations } from '../i18n/translations';

interface VehicleFilter {
  make: string;
  model: string;
  year: number;
}

interface AppContextType {
  // Products & Inventory
  products: Product[];
  reviews: Review[];
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (product: Product) => void;
  deleteProduct: (id: string) => void;
  updateStock: (id: string, delta: number) => void;
  setStockExact: (id: string, newStock: number) => void;
  addReview: (review: Omit<Review, 'id' | 'date'>) => void;

  // Cart
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number, selectedOption?: string) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  cartCount: number;
  cartSubtotal: number;
  cartTotal: number;
  couponCode: string;
  discountAmount: number;
  applyCoupon: (code: string) => { success: boolean; message: string };

  // Vehicle Selection & Garage
  activeVehicle: VehicleFilter | null;
  setActiveVehicle: (v: VehicleFilter | null) => void;
  isProductCompatible: (product: Product) => boolean;
  saveVehicleToGarage: (v: VehicleFilter) => void;

  // Orders & Real-Time Tracking
  orders: Order[];
  createOrder: (shipping: ShippingAddress, paymentMethod: PaymentMethodType, cardDetails?: any) => Promise<Order>;
  updateOrderStatus: (orderId: string, status: OrderStatusType) => void;
  updateOrder: (order: Order) => void;
  deleteOrder: (orderId: string) => void;
  activeTrackingOrder: Order | null;
  setActiveTrackingOrder: (order: Order | null) => void;

  // Store Settings & Promo Coupons
  storeSettings: StoreSettings;
  updateStoreSettings: (settings: Partial<StoreSettings>) => void;
  promoCoupons: PromoCoupon[];
  addPromoCoupon: (coupon: Omit<PromoCoupon, 'id'>) => void;
  updatePromoCoupon: (coupon: PromoCoupon) => void;
  deletePromoCoupon: (id: string) => void;
  batchUpdateProducts: (updates: { id: string; price?: number; stock?: number; category?: string }[]) => void;

  // User & Auth
  currentUser: UserProfile;
  loginWithPhoneOtp: (phone: string, otp: string, name?: string) => Promise<boolean> | boolean;
  loginAdminWithGmail: (gmail: string, customName?: string) => Promise<boolean> | boolean;
  loginSocial: (provider: 'google' | 'apple' | 'facebook' | 'github') => void;
  loginWithSocial: (provider: 'google' | 'apple' | 'facebook' | 'github') => void;
  loginEmail: (email: string, name: string) => void;
  logout: () => void;
  switchUserRole: (role: 'customer' | 'admin') => void;

  // Push Notifications
  notifications: PushNotification[];
  unreadNotificationsCount: number;
  addNotification: (notification: Omit<PushNotification, 'id' | 'timestamp' | 'read'>) => void;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  requestNotificationPermission: () => Promise<boolean>;

  // Customer Support Live Chat
  chatMessages: ChatMessage[];
  sendChatMessage: (text: string) => Promise<void>;
  isSupportOpen: boolean;
  setIsSupportOpen: (open: boolean) => void;
  isChatOpen: boolean;
  setIsChatOpen: (open: boolean) => void;
  isChatTyping: boolean;

  // Search & Filtering
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  fitmentFilterOnly: boolean;
  setFitmentFilterOnly: (f: boolean) => void;


  // Multi-Language & Internationalization
  currentLanguage: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
  formatPrice: (amountInUSD: number) => string;

  // Theme
  isDarkMode: boolean;
  toggleDarkMode: () => void;

  // Offline Mode & Cloud Sync
  isOnline: boolean;
  isSimulatedOffline: boolean;
  toggleSimulatedOffline: () => void;
  syncQueue: SyncQueueAction[];
  triggerCloudSync: () => Promise<void>;
  isSyncing: boolean;

  // UI Modals & Navigation
  isCartDrawerOpen: boolean;
  setIsCartDrawerOpen: (open: boolean) => void;
  isCheckoutModalOpen: boolean;
  setIsCheckoutModalOpen: (open: boolean) => void;
  isVehicleModalOpen: boolean;
  setIsVehicleModalOpen: (open: boolean) => void;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  isAdminOpen: boolean;
  setIsAdminOpen: (open: boolean) => void;
  selectedProductDetail: Product | null;
  setSelectedProductDetail: (product: Product | null) => void;
  activeTab: 'store' | 'admin' | 'orders' | 'garage';
  setActiveTab: (tab: 'store' | 'admin' | 'orders' | 'garage') => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  PRODUCTS: 'apexauto_products_v1',
  CART: 'apexauto_cart_v1',
  ORDERS: 'apexauto_orders_v1',
  USER: 'apexauto_user_v1',
  NOTIFICATIONS: 'apexauto_notifications_v1',
  LANGUAGE: 'apexauto_lang_v1',
  THEME: 'apexauto_theme_v1',
  VEHICLE: 'apexauto_vehicle_v1',
  SYNC_QUEUE: 'apexauto_sync_queue_v1',
  REVIEWS: 'apexauto_reviews_v1',
  STORE_SETTINGS: 'apexauto_store_settings_v1',
  PROMO_COUPONS: 'apexauto_promo_coupons_v1',
};

const DEFAULT_STORE_SETTINGS: StoreSettings = {
  storeName: 'ApexAuto Performance & Accessories',
  announcementText: '⚡ FESTIVE MOTORING SALE: Use Code APEX20 for 20% OFF • Free Guaranteed Express Shipping on orders over $50',
  announcementActive: true,
  freeShippingThreshold: 50,
  standardShippingFee: 9.99,
  taxRatePercent: 8,
  supportPhone: '+91 98201 54321',
  supportEmail: 'titonhossain55@gmail.com',
  defaultCourier: 'Delhivery Express',
};

const DEFAULT_PROMO_COUPONS: PromoCoupon[] = [
  { id: 'c-1', code: 'APEX20', discountPercent: 20, minOrderValue: 0, description: '20% Off Storewide Sitewide Discount', isActive: true },
  { id: 'c-2', code: 'WELCOME10', discountPercent: 10, minOrderValue: 0, description: '10% Welcome Discount for New Drivers', isActive: true },
  { id: 'c-3', code: 'VIP25', discountPercent: 25, minOrderValue: 100, description: '25% Off VIP Orders above $100', isActive: true },
  { id: 'c-4', code: 'TITON50', discountPercent: 50, minOrderValue: 0, description: '50% VIP Admin & Partner Discount', isActive: true },
];

const DEFAULT_USER: UserProfile = {
  id: 'user-demo-1',
  name: 'Aarav Sharma',
  email: 'aarav.sharma@example.in',
  phone: '+91 98201 54321',
  avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
  role: 'customer',
  provider: 'google',
  savedVehicles: [
    { id: 'v-1', make: 'Mahindra', model: 'Thar', year: 2024, nickname: 'Adventure 4x4' },
    { id: 'v-2', make: 'Tata', model: 'Nexon', year: 2023, nickname: 'City Daily' },
  ],
  addresses: [
    {
      fullName: 'Aarav Sharma',
      email: 'aarav.sharma@example.in',
      phone: '+91 98201 54321',
      street: 'Flat 402, Lotus Heights, Linking Road',
      apartment: 'Wing B',
      city: 'Mumbai',
      state: 'Maharashtra',
      zipCode: '400050',
      country: 'India',
      deliveryNotes: 'Leave with society security guard',
    },
  ],
};

const INITIAL_ORDERS: Order[] = [
  {
    id: 'ord-1001',
    orderNumber: 'APX-89241',
    createdAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    customer: {
      fullName: 'Aarav Sharma',
      email: 'aarav.sharma@example.in',
      phone: '+91 98201 54321',
      street: 'Flat 402, Lotus Heights, Linking Road',
      apartment: 'Wing B',
      city: 'Mumbai',
      state: 'Maharashtra',
      zipCode: '400050',
      country: 'India',
      deliveryNotes: 'Call upon arrival',
    },
    items: [
      { product: INITIAL_PRODUCTS[0], quantity: 1 },
      { product: INITIAL_PRODUCTS[1], quantity: 1 },
    ],
    subtotal: 254.98,
    shippingFee: 0,
    tax: 20.4,
    discount: 25.0,
    total: 250.38,
    paymentMethod: 'upi',
    paymentStatus: 'paid',
    status: 'out_for_delivery',
    trackingNumber: 'DEL-994827104',
    estimatedDelivery: 'Today by 4:30 PM',
    driver: {
      name: 'Rajesh Kumar',
      phone: '+91 98765 43210',
      photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
      vehicle: 'Tata Ace Express Van (White)',
      licensePlate: 'MH-02-EE-8920',
      rating: 4.95,
      etaMinutes: 18,
      currentLocationName: 'Bandra Linking Rd & Hill Rd (1.8 km away)',
      lat: 19.0596,
      lng: 72.8295,
    },
    trackingTimeline: [
      {
        status: 'placed',
        title: 'Order Placed & Verified',
        description: 'Payment authorized via UPI 256-Bit Encrypted Gateway',
        timestamp: '1:15 PM',
        location: 'ApexAuto Mumbai Hub, Bhiwandi',
        completed: true,
      },
      {
        status: 'confirmed',
        title: 'Order Confirmed',
        description: 'Inventory allocated and Mahindra Thar fitment QA verified',
        timestamp: '1:20 PM',
        location: 'ApexAuto Warehouse Bay 3',
        completed: true,
      },
      {
        status: 'processing',
        title: 'Packed & Barcode Scanned',
        description: 'Packed with heavy-duty shock protective foam',
        timestamp: '1:45 PM',
        location: 'Mumbai Central Logistics Depot',
        completed: true,
      },
      {
        status: 'dispatched',
        title: 'Dispatched to Local Depot',
        description: 'Departed regional logistics express terminal',
        timestamp: '2:10 PM',
        location: 'Bandra Delivery Hub',
        completed: true,
      },
      {
        status: 'out_for_delivery',
        title: 'Out for Delivery',
        description: 'Courier Rajesh Kumar is 18 minutes away with your shipment',
        timestamp: '2:40 PM',
        location: 'On route to destination',
        completed: true,
      },
      {
        status: 'delivered',
        title: 'Delivered',
        description: 'Package handed over or signed at doorstep',
        timestamp: 'Estimated 4:30 PM',
        location: 'Linking Road, Bandra West, Mumbai',
        completed: false,
      },
    ],
  },
];

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // --- Persistent State Initialization ---
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  });

  const [reviews, setReviews] = useState<Review[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.REVIEWS);
    return saved ? JSON.parse(saved) : MOCK_REVIEWS;
  });

  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CART);
    return saved ? JSON.parse(saved) : [];
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ORDERS);
    return saved ? JSON.parse(saved) : INITIAL_ORDERS;
  });

  const [currentUser, setCurrentUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.USER);
    return saved ? JSON.parse(saved) : DEFAULT_USER;
  });

  const [activeVehicle, setActiveVehicle] = useState<VehicleFilter | null>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.VEHICLE);
    return saved ? JSON.parse(saved) : { make: 'Mahindra', model: 'Thar', year: 2024 };
  });

  const [notifications, setNotifications] = useState<PushNotification[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
    return saved
      ? JSON.parse(saved)
      : [
          {
            id: 'notif-1',
            title: 'Order APX-89241 Out for Delivery!',
            message: 'Driver Michael Torres is currently 18 minutes away.',
            timestamp: new Date().toISOString(),
            read: false,
            type: 'order',
            orderId: 'ord-1001',
          },
          {
            id: 'notif-2',
            title: 'Flash Sale: 20% Off 4K Dashcams',
            message: 'Use code APEXSPEED at checkout for instant savings.',
            timestamp: new Date(Date.now() - 3600000).toISOString(),
            read: false,
            type: 'promo',
          },
        ];
  });

  const [currentLanguage, setCurrentLanguageState] = useState<SupportedLanguage>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.LANGUAGE) as SupportedLanguage;
    return saved && LANGUAGES[saved] ? saved : 'en';
  });

  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.THEME);
    if (saved !== null) return saved === 'dark';
    return true; // Default to Elegant Dark theme
  });

  const [syncQueue, setSyncQueue] = useState<SyncQueueAction[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.SYNC_QUEUE);
    return saved ? JSON.parse(saved) : [];
  });

  const [storeSettings, setStoreSettings] = useState<StoreSettings>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.STORE_SETTINGS);
    return saved ? JSON.parse(saved) : DEFAULT_STORE_SETTINGS;
  });

  const [promoCoupons, setPromoCoupons] = useState<PromoCoupon[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.PROMO_COUPONS);
    return saved ? JSON.parse(saved) : DEFAULT_PROMO_COUPONS;
  });

  // --- Network & Offline Sync State ---
  const [realOnline, setRealOnline] = useState<boolean>(navigator.onLine);
  const [isSimulatedOffline, setIsSimulatedOffline] = useState<boolean>(false);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);

  const isOnline = realOnline && !isSimulatedOffline;

  // --- UI Navigation & Modals ---
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState<boolean>(false);
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState<boolean>(false);
  const [isVehicleModalOpen, setIsVehicleModalOpen] = useState<boolean>(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [isAdminOpen, setIsAdminOpen] = useState<boolean>(false);
  const [activeTrackingOrder, setActiveTrackingOrder] = useState<Order | null>(null);
  const [selectedProductDetail, setSelectedProductDetail] = useState<Product | null>(null);
  const [activeTab, setActiveTab] = useState<'store' | 'admin' | 'orders' | 'garage'>('store');

  // Coupon State
  const [couponCode, setCouponCode] = useState<string>('');
  const [discountPercent, setDiscountPercent] = useState<number>(0);

  // Live Chat State
  const [isSupportOpen, setIsSupportOpen] = useState<boolean>(false);
  const [isChatTyping, setIsChatTyping] = useState<boolean>(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-init',
      sender: 'bot',
      senderName: 'Apex AI Automotive Specialist',
      senderAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
      text: 'Hello! I am your ApexAuto Technical Assistant. Tell me your car make/model, and I can verify part fitment, suggest installation steps, or check live order delivery status.',
      timestamp: new Date().toISOString(),
    },
  ]);

  // Search & Filtering State
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [fitmentFilterOnly, setFitmentFilterOnly] = useState<boolean>(false);

  // --- Sync to LocalStorage ---

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(reviews));
  }, [reviews]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SYNC_QUEUE, JSON.stringify(syncQueue));
  }, [syncQueue]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.STORE_SETTINGS, JSON.stringify(storeSettings));
  }, [storeSettings]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PROMO_COUPONS, JSON.stringify(promoCoupons));
  }, [promoCoupons]);

  useEffect(() => {
    if (activeVehicle) {
      localStorage.setItem(STORAGE_KEYS.VEHICLE, JSON.stringify(activeVehicle));
    } else {
      localStorage.removeItem(STORAGE_KEYS.VEHICLE);
    }
  }, [activeVehicle]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.LANGUAGE, currentLanguage);
    const langConfig = LANGUAGES[currentLanguage];
    document.documentElement.dir = langConfig.dir;
    document.documentElement.lang = currentLanguage;
  }, [currentLanguage]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.THEME, isDarkMode ? 'dark' : 'light');
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // --- Network Event Listeners ---
  useEffect(() => {
    const handleOnline = () => {
      setRealOnline(true);
      triggerCloudSync();
    };
    const handleOffline = () => setRealOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const toggleSimulatedOffline = () => {
    setIsSimulatedOffline((prev) => {
      const next = !prev;
      if (!next && realOnline) {
        setTimeout(() => triggerCloudSync(), 300);
      }
      return next;
    });
  };

  // --- Cloud Sync Engine ---
  const queueOfflineAction = useCallback((actionType: SyncQueueAction['action'], payload: any) => {
    const action: SyncQueueAction = {
      id: 'sync-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7),
      timestamp: new Date().toISOString(),
      action: actionType,
      payload,
      status: 'pending',
      retries: 0,
    };
    setSyncQueue((prev) => [...prev, action]);
  }, []);

  const triggerCloudSync = useCallback(async () => {
    if (!navigator.onLine || isSimulatedOffline) return;
    if (syncQueue.length === 0) return;

    setIsSyncing(true);
    try {
      // Simulate network roundtrip and backend processing
      await new Promise((res) => setTimeout(res, 1200));

      // Clear synced queue and notify
      const count = syncQueue.length;
      setSyncQueue([]);
      addNotification({
        title: 'Cloud Synchronization Complete',
        message: `Successfully synchronized ${count} offline updates to ApexAuto Cloud servers.`,
        type: 'sync',
      });
    } catch (err) {
      console.error('Sync failed:', err);
    } finally {
      setIsSyncing(false);
    }
  }, [syncQueue, isSimulatedOffline]);

  // --- Push Notifications Engine ---
  const addNotification = useCallback((notif: Omit<PushNotification, 'id' | 'timestamp' | 'read'>) => {
    const newNotif: PushNotification = {
      id: 'notif-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
      timestamp: new Date().toISOString(),
      read: false,
      ...notif,
    };
    setNotifications((prev) => [newNotif, ...prev]);

    // Optional audio feedback
    try {
      if (typeof window !== 'undefined' && 'AudioContext' in window) {
        const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
        osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.15); // A5
        gain.gain.setValueAtTime(0.08, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.3);
      }
    } catch {
      // Ignored if sound blocked by browser policy
    }

    // Try native browser notification if granted
    if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
      try {
        new Notification(notif.title, {
          body: notif.message,
          icon: '/favicon.ico',
        });
      } catch {
        // Fallback gracefully
      }
    }
  }, []);

  const markNotificationAsRead = useCallback((id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  }, []);

  const markAllNotificationsAsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  const requestNotificationPermission = useCallback(async () => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      try {
        const perm = await Notification.requestPermission();
        if (perm === 'granted') {
          addNotification({
            title: 'Push Notifications Enabled',
            message: 'You will receive instant alerts for dispatch, driver ETA, and order tracking.',
            type: 'system',
          });
          return true;
        }
      } catch {
        return false;
      }
    }
    return false;
  }, [addNotification]);

  // --- Translation & Currency helper ---
  const t = useCallback(
    (key: string, params?: Record<string, string | number>): string => {
      const dict = translations[currentLanguage] || translations.en;
      const keys = key.split('.');
      let val: any = dict;
      for (const k of keys) {
        val = val?.[k];
        if (val === undefined) break;
      }
      if (val === undefined) {
        // Fallback to English
        let fallback: any = translations.en;
        for (const k of keys) {
          fallback = fallback?.[k];
          if (fallback === undefined) break;
        }
        val = fallback || key;
      }

      if (typeof val === 'string' && params) {
        Object.entries(params).forEach(([pKey, pVal]) => {
          val = (val as string).replace(new RegExp(`{${pKey}}`, 'g'), String(pVal));
        });
      }
      return typeof val === 'string' ? val : key;
    },
    [currentLanguage]
  );

  const formatPrice = useCallback(
    (amountInUSD: number): string => {
      const config = LANGUAGES[currentLanguage] || LANGUAGES.en;
      const converted = amountInUSD * config.currencyRate;
      if (config.currency === 'INR') {
        return `₹${Math.round(converted).toLocaleString('en-IN')}`;
      }
      if (config.code === 'ja' || config.code === 'bn') {
        return `${config.currencySymbol}${Math.round(converted).toLocaleString()}`;
      }
      return `${config.currencySymbol}${converted.toFixed(2)}`;
    },
    [currentLanguage]
  );

  // --- Product Compatibility Verification ---
  const isProductCompatible = useCallback(
    (product: Product): boolean => {
      if (!activeVehicle) return true;
      if (product.compatibility.universal) return true;

      const makeMatches =
        product.compatibility.makes.length === 0 ||
        product.compatibility.makes.some((m) => m.toLowerCase() === activeVehicle.make.toLowerCase());

      const modelMatches =
        product.compatibility.models.length === 0 ||
        product.compatibility.models.some((m) => m.toLowerCase() === activeVehicle.model.toLowerCase());

      const yearMatches =
        product.compatibility.years.length === 0 ||
        product.compatibility.years.includes(activeVehicle.year);

      return makeMatches && modelMatches && yearMatches;
    },
    [activeVehicle]
  );

  const saveVehicleToGarage = useCallback((vehicle: VehicleFilter) => {
    setCurrentUser((prev) => {
      const exists = prev.savedVehicles.some(
        (v) => v.make === vehicle.make && v.model === vehicle.model && v.year === vehicle.year
      );
      if (exists) return prev;
      const updated = {
        ...prev,
        savedVehicles: [
          ...prev.savedVehicles,
          {
            id: 'v-' + Date.now(),
            make: vehicle.make,
            model: vehicle.model,
            year: vehicle.year,
            nickname: `${vehicle.year} ${vehicle.make} ${vehicle.model}`,
          },
        ],
      };
      return updated;
    });
    setActiveVehicle(vehicle);
    addNotification({
      title: 'Garage Updated',
      message: `Set active vehicle to ${vehicle.year} ${vehicle.make} ${vehicle.model}. Store now filters for guaranteed fitment!`,
      type: 'system',
    });
  }, [addNotification]);

  // --- Cart Management ---
  const addToCart = useCallback(
    (product: Product, quantity = 1, selectedOption?: string) => {
      if (product.stock <= 0) return;

      setCart((prev) => {
        const existingIdx = prev.findIndex(
          (item) => item.product.id === product.id && item.selectedOption === selectedOption
        );
        if (existingIdx > -1) {
          const updated = [...prev];
          const newQty = Math.min(product.stock, updated[existingIdx].quantity + quantity);
          updated[existingIdx] = { ...updated[existingIdx], quantity: newQty };
          return updated;
        }
        return [...prev, { product, quantity: Math.min(product.stock, quantity), selectedOption }];
      });

      addNotification({
        title: 'Item Added to Cart',
        message: `${product.name} (Qty: ${quantity}) is in your shopping cart.`,
        type: 'stock',
      });
    },
    [addNotification]
  );

  const removeFromCart = useCallback((productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  }, []);

  const updateCartQuantity = useCallback((productId: string, quantity: number) => {
    if (quantity <= 0) {
      setCart((prev) => prev.filter((item) => item.product.id !== productId));
      return;
    }
    setCart((prev) =>
      prev.map((item) => {
        if (item.product.id === productId) {
          const maxQ = item.product.stock;
          return { ...item, quantity: Math.min(maxQ, quantity) };
        }
        return item;
      })
    );
  }, []);

  const clearCart = useCallback(() => {
    setCart([]);
    setCouponCode('');
    setDiscountPercent(0);
  }, []);

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const cartSubtotal = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const discountAmount = (cartSubtotal * discountPercent) / 100;
  const shippingCost = cartSubtotal >= storeSettings.freeShippingThreshold || cartSubtotal === 0 ? 0 : storeSettings.standardShippingFee;
  const taxCost = cartSubtotal > 0 ? ((cartSubtotal - discountAmount) * storeSettings.taxRatePercent) / 100 : 0;
  const cartTotal = Math.max(0, cartSubtotal - discountAmount + shippingCost + taxCost);

  const applyCoupon = useCallback(
    (code: string) => {
      const clean = code.trim().toUpperCase();
      const matched = promoCoupons.find((c) => c.code.toUpperCase() === clean && c.isActive);
      if (matched) {
        if (matched.minOrderValue && cartSubtotal < matched.minOrderValue) {
          return {
            success: false,
            message: `Minimum order value for code ${matched.code} is $${matched.minOrderValue}.`,
          };
        }
        setCouponCode(matched.code);
        setDiscountPercent(matched.discountPercent);
        return {
          success: true,
          message: `Coupon applied! ${matched.discountPercent}% discount activated.`,
        };
      }
      return { success: false, message: 'Invalid, inactive, or expired coupon code.' };
    },
    [promoCoupons, cartSubtotal]
  );

  // --- Order Creation & Live Lifecycle Simulation ---
  const createOrder = useCallback(
    async (shipping: ShippingAddress, paymentMethod: PaymentMethodType, cardDetails?: any): Promise<Order> => {
      const orderNum = 'APX-' + Math.floor(10000 + Math.random() * 90000);
      const isPaid = paymentMethod !== 'cod';

      // Deduct inventory
      setProducts((prev) =>
        prev.map((p) => {
          const cartItem = cart.find((ci) => ci.product.id === p.id);
          if (cartItem) {
            const nextStock = Math.max(0, p.stock - cartItem.quantity);
            return { ...p, stock: nextStock };
          }
          return p;
        })
      );

      const newOrder: Order = {
        id: 'ord-' + Date.now(),
        orderNumber: orderNum,
        createdAt: new Date().toISOString(),
        customer: shipping,
        items: [...cart],
        subtotal: cartSubtotal,
        shippingFee: shippingCost,
        tax: taxCost,
        discount: discountAmount,
        total: cartTotal,
        paymentMethod,
        paymentStatus: isPaid ? 'paid' : 'pending',
        status: 'confirmed',
        trackingNumber: 'FDX-' + Math.floor(100000000 + Math.random() * 900000000),
        estimatedDelivery: 'Tomorrow, by 5:00 PM',
        vehicleDetails: activeVehicle ? { ...activeVehicle } : undefined,
        driver: {
          name: 'James Reynolds',
          phone: '+1 (555) 765-4321',
          photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
          vehicle: 'Apex Express Van (Black)',
          licensePlate: '9APX204',
          rating: 4.98,
          etaMinutes: 24,
          currentLocationName: 'North Distribution Hub (3.8 miles away)',
          lat: 44.0535,
          lng: -123.0912,
        },
        trackingTimeline: [
          {
            status: 'placed',
            title: 'Order Placed & Secured',
            description:
              paymentMethod === 'cod'
                ? 'Cash on Delivery selected. Verified by SMS / Security.'
                : 'Payment processed and verified via 256-Bit SSL Encrypted Gateway.',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            location: 'ApexAuto Core System',
            completed: true,
          },
          {
            status: 'confirmed',
            title: 'Order Confirmed & Stock Reserved',
            description: 'Items gathered in warehouse bay and safety inspected.',
            timestamp: new Date(Date.now() + 60000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            location: 'ApexAuto Central Warehouse',
            completed: true,
          },
          {
            status: 'processing',
            title: 'Packaging & Quality Check',
            description: 'Foam packed, serialized, and barcode registered for express transit.',
            timestamp: 'In Progress',
            location: 'Packing Station #4',
            completed: false,
          },
          {
            status: 'dispatched',
            title: 'Dispatched to Transit Hub',
            description: 'Handed off to local express carrier logistics.',
            timestamp: 'Pending',
            location: 'Regional Logistics Center',
            completed: false,
          },
          {
            status: 'out_for_delivery',
            title: 'Out for Delivery',
            description: 'Courier James Reynolds is assigned to complete delivery.',
            timestamp: 'Pending',
            location: 'Local Delivery Zone',
            completed: false,
          },
          {
            status: 'delivered',
            title: 'Delivered',
            description: 'Received and verified at recipient address.',
            timestamp: 'Pending',
            location: shipping.street,
            completed: false,
          },
        ],
      };

      setOrders((prev) => [newOrder, ...prev]);
      clearCart();

      // If offline, add to sync queue
      if (!isOnline) {
        queueOfflineAction('CREATE_ORDER', newOrder);
      }

      addNotification({
        title: `Order #${orderNum} Confirmed!`,
        message: `Thank you for your purchase. We are preparing your car accessories for dispatch.`,
        type: 'order',
        orderId: newOrder.id,
      });

      return newOrder;
    },
    [cart, cartSubtotal, shippingCost, taxCost, discountAmount, cartTotal, activeVehicle, isOnline, queueOfflineAction, addNotification, clearCart]
  );

  const updateOrderStatus = useCallback(
    (orderId: string, newStatus: OrderStatusType) => {
      setOrders((prev) =>
        prev.map((order) => {
          if (order.id !== orderId) return order;

          const updatedTimeline = order.trackingTimeline.map((step) => {
            const statusOrder: OrderStatusType[] = [
              'placed',
              'confirmed',
              'processing',
              'dispatched',
              'out_for_delivery',
              'delivered',
            ];
            const currentIndex = statusOrder.indexOf(newStatus);
            const stepIndex = statusOrder.indexOf(step.status);
            return {
              ...step,
              completed: stepIndex <= currentIndex,
              timestamp: stepIndex <= currentIndex && step.timestamp === 'Pending'
                ? new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                : step.timestamp,
            };
          });

          const updatedOrder: Order = {
            ...order,
            status: newStatus,
            paymentStatus: newStatus === 'delivered' && order.paymentMethod === 'cod' ? 'paid' : order.paymentStatus,
            trackingTimeline: updatedTimeline,
          };

          return updatedOrder;
        })
      );

      // Notify customer of real-time update
      const targetOrder = orders.find((o) => o.id === orderId);
      const orderNum = targetOrder ? targetOrder.orderNumber : orderId;
      addNotification({
        title: `Order #${orderNum} Update: ${newStatus.toUpperCase()}`,
        message: `Your order status has changed to "${newStatus.replace(/_/g, ' ')}".`,
        type: 'order',
        orderId,
      });

      if (!isOnline) {
        queueOfflineAction('CREATE_ORDER', { orderId, newStatus });
      }
    },
    [orders, isOnline, queueOfflineAction, addNotification]
  );

  // --- Admin Inventory Handlers ---
  const addProduct = useCallback(
    (newProdData: Omit<Product, 'id'>) => {
      const newProduct: Product = {
        ...newProdData,
        id: 'prod-' + Date.now(),
      };
      setProducts((prev) => [newProduct, ...prev]);
      addNotification({
        title: 'New Product Added',
        message: `${newProduct.name} is now live in the catalog.`,
        type: 'stock',
      });
      if (!isOnline) {
        queueOfflineAction('ADD_PRODUCT', newProduct);
      }
    },
    [isOnline, queueOfflineAction, addNotification]
  );

  const updateProduct = useCallback(
    (product: Product) => {
      setProducts((prev) => prev.map((p) => (p.id === product.id ? product : p)));
      addNotification({
        title: 'Product Updated',
        message: `Changes to ${product.name} have been saved.`,
        type: 'stock',
      });
      if (!isOnline) {
        queueOfflineAction('EDIT_PRODUCT', product);
      }
    },
    [isOnline, queueOfflineAction, addNotification]
  );

  const deleteProduct = useCallback(
    (id: string) => {
      setProducts((prev) => prev.filter((p) => p.id !== id));
      addNotification({
        title: 'Product Removed',
        message: `Product SKU ${id} was deleted from inventory.`,
        type: 'stock',
      });
      if (!isOnline) {
        queueOfflineAction('DELETE_PRODUCT', { id });
      }
    },
    [isOnline, queueOfflineAction, addNotification]
  );

  const updateStock = useCallback(
    (id: string, delta: number) => {
      setProducts((prev) =>
        prev.map((p) => {
          if (p.id === id) {
            const nextStock = Math.max(0, p.stock + delta);
            return { ...p, stock: nextStock };
          }
          return p;
        })
      );
      if (!isOnline) {
        queueOfflineAction('UPDATE_STOCK', { id, delta });
      }
    },
    [isOnline, queueOfflineAction]
  );

  const setStockExact = useCallback(
    (id: string, newStock: number) => {
      setProducts((prev) =>
        prev.map((p) => {
          if (p.id === id) {
            return { ...p, stock: Math.max(0, newStock) };
          }
          return p;
        })
      );
      if (!isOnline) {
        queueOfflineAction('UPDATE_STOCK', { id, newStock });
      }
    },
    [isOnline, queueOfflineAction]
  );

  const addReview = useCallback(
    (reviewData: Omit<Review, 'id' | 'date'>) => {
      const newReview: Review = {
        ...reviewData,
        id: 'rev-' + Date.now(),
        date: new Date().toISOString().split('T')[0],
      };
      setReviews((prev) => [newReview, ...prev]);

      // Update product rating and reviews count
      setProducts((prev) =>
        prev.map((p) => {
          if (p.id === reviewData.productId) {
            const currentCount = p.reviewsCount || 0;
            const newCount = currentCount + 1;
            const newRating = Number(((p.rating * currentCount + reviewData.rating) / newCount).toFixed(1));
            return { ...p, reviewsCount: newCount, rating: newRating };
          }
          return p;
        })
      );

      addNotification({
        title: 'Review Published',
        message: `Thank you for reviewing ${products.find((p) => p.id === reviewData.productId)?.name || 'the product'}.`,
        type: 'system',
      });
    },
    [products, addNotification]
  );

  // --- User Profile & Role Switcher ---
  const loginWithPhoneOtp = useCallback(
    (phone: string, otp: string, name?: string) => {
      const cleanPhone = phone.trim() || '+91 98201 54321';
      const displayName = name?.trim() || 'Aarav Sharma';
      const userAvatar = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80';

      setCurrentUser({
        id: 'user-phone-' + Date.now(),
        name: displayName,
        email: `${cleanPhone.replace(/[^0-9]/g, '')}@sms.apexauto.in`,
        phone: cleanPhone,
        avatar: userAvatar,
        role: 'customer',
        provider: 'phone_otp',
        savedVehicles: [
          { id: 'v-1', make: 'Mahindra', model: 'Thar', year: 2024, nickname: 'Adventure 4x4' },
          { id: 'v-2', make: 'Tata', model: 'Nexon', year: 2023, nickname: 'City Daily' },
        ],
        addresses: DEFAULT_USER.addresses,
      });
      setIsAuthModalOpen(false);
      addNotification({
        title: `Welcome, ${displayName}!`,
        message: `Phone number ${cleanPhone} verified via OTP. Logged in successfully.`,
        type: 'system',
      });
      return true;
    },
    [addNotification]
  );

  const loginAdminWithGmail = useCallback(
    (gmail: string, customName?: string) => {
      const cleanEmail = gmail.trim() || 'titonhossain55@gmail.com';
      const adminName = customName?.trim() || cleanEmail.split('@')[0] || 'System Administrator';

      setCurrentUser({
        id: 'admin-' + Date.now(),
        name: adminName,
        email: cleanEmail,
        phone: '+91 98201 54321',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80',
        role: 'admin',
        provider: 'gmail',
        savedVehicles: [
          { id: 'v-admin-1', make: 'Mahindra', model: 'Scorpio-N', year: 2024, nickname: 'Admin Fleet 01' },
        ],
        addresses: DEFAULT_USER.addresses,
      });
      setIsAuthModalOpen(false);
      setActiveTab('admin');
      addNotification({
        title: '🛡️ Administrator Access Granted',
        message: `Authenticated via Google Workspace Gmail (${cleanEmail}). Store management console unlocked.`,
        type: 'system',
      });
      return true;
    },
    [addNotification]
  );

  const loginSocial = useCallback(
    (provider: 'google' | 'apple' | 'facebook' | 'github') => {
      if (provider === 'google') {
        // Direct Google / Gmail login as admin or customer
        loginAdminWithGmail('titonhossain55@gmail.com', 'Admin Lead');
        return;
      }
      const name = provider === 'apple' ? 'Aarav Sharma (Apple)' : 'Aarav Sharma';
      const email = `${provider}_user@example.com`;
      setCurrentUser({
        id: 'user-' + provider + '-' + Date.now(),
        name,
        email,
        phone: '+91 98201 54321',
        avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=150&q=80',
        role: 'customer',
        provider,
        savedVehicles: [
          { id: 'v-1', make: 'Mahindra', model: 'Thar', year: 2024, nickname: 'Adventure 4x4' },
        ],
        addresses: DEFAULT_USER.addresses,
      });
      setIsAuthModalOpen(false);
      addNotification({
        title: `Welcome, ${name}!`,
        message: `Signed in via ${provider.toUpperCase()}. Your garage and cart are synchronized.`,
        type: 'system',
      });
    },
    [addNotification, loginAdminWithGmail]
  );

  const loginEmail = useCallback(
    (email: string, name: string) => {
      setCurrentUser({
        id: 'user-email-' + Date.now(),
        name: name || email.split('@')[0],
        email,
        phone: '+1 (555) 234-5678',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
        role: 'customer',
        provider: 'email',
        savedVehicles: [
          { id: 'v-1', make: 'Toyota', model: 'RAV4', year: 2024, nickname: 'Daily SUV' },
        ],
        addresses: DEFAULT_USER.addresses,
      });
      setIsAuthModalOpen(false);
      addNotification({
        title: `Welcome, ${name || email}!`,
        message: 'You are now signed in to ApexAuto.',
        type: 'system',
      });
    },
    [addNotification]
  );

  const logout = useCallback(() => {
    setCurrentUser({
      ...DEFAULT_USER,
      id: 'guest-' + Date.now(),
      name: 'Guest Driver',
      email: '',
      role: 'customer',
    });
    addNotification({
      title: 'Signed Out',
      message: 'You have logged out of your account.',
      type: 'system',
    });
  }, [addNotification]);

  const switchUserRole = useCallback((role: 'customer' | 'admin') => {
    setCurrentUser((prev) => ({ ...prev, role }));
  }, []);

  // --- Customer Support Live Chat & AI Automotive Advisor ---
  const sendChatMessage = useCallback(
    async (text: string) => {
      const userMsg: ChatMessage = {
        id: 'msg-' + Date.now(),
        sender: 'user',
        senderName: currentUser.name || 'You',
        text,
        timestamp: new Date().toISOString(),
      };
      setChatMessages((prev) => [...prev, userMsg]);
      setIsChatTyping(true);

      const lower = text.toLowerCase();

      // Check if user is asking about order tracking
      let matchedOrder: Order | undefined;
      if (lower.includes('order') || lower.includes('track') || lower.includes('apx-')) {
        matchedOrder = orders[0];
      }

      // Check product suggestions
      let matchedProduct: Product | undefined;
      if (lower.includes('cam') || lower.includes('dash')) {
        matchedProduct = products.find((p) => p.category === 'electronics');
      } else if (lower.includes('light') || lower.includes('led')) {
        matchedProduct = products.find((p) => p.category === 'lighting');
      } else if (lower.includes('mat') || lower.includes('floor')) {
        matchedProduct = products.find((p) => p.category === 'interior');
      } else if (lower.includes('diagnostic') || lower.includes('obd') || lower.includes('engine')) {
        matchedProduct = products.find((p) => p.sku === 'APX-OBD-SCAN');
      }

      try {
        // Generate intelligent automotive reply
        let replyText = '';
        if (matchedOrder && (lower.includes('where is') || lower.includes('track') || lower.includes('status'))) {
          replyText = `I pulled up your active order #${matchedOrder.orderNumber}! Status is currently "${matchedOrder.status.toUpperCase()}". Courier ${matchedOrder.driver?.name} is on the way (${matchedOrder.driver?.etaMinutes} mins away). You can click "Track Live" below to view the real-time driver map!`;
        } else if (activeVehicle && (lower.includes('fit') || lower.includes('my car') || lower.includes('compatible'))) {
          replyText = `Great news! For your active ${activeVehicle.year} ${activeVehicle.make} ${activeVehicle.model}, all products badged with "Guaranteed Fitment" are tested for plug-and-play installation without cutting OEM harnesses or voiding warranty.`;
        } else if (lower.includes('cod') || lower.includes('cash on delivery') || lower.includes('payment')) {
          replyText = `ApexAuto offers both Cash on Delivery (COD) and 256-Bit SSL Encrypted Credit/Debit Card payments (Visa, Mastercard, Amex, Apple Pay, Google Pay, and PayPal). You can choose your preferred option during checkout!`;
        } else if (lower.includes('install') || lower.includes('diy') || lower.includes('guide')) {
          replyText = `Most of our accessories (like the 4K Dashcam, OBD2 Scanner, and Floor Mats) come with quick DIY instructions taking 10-20 minutes. We also include plug-and-play fuse taps and mounting hardware in the box.`;
        } else {
          replyText = `Thanks for reaching out! As your ApexAuto specialist, I can assist with vehicle compatibility fitment, installation guides, order tracking, and warranty inquiries. How else can I help your ride today?`;
        }

        // Slight natural typing delay
        await new Promise((res) => setTimeout(res, 900));

        const botReply: ChatMessage = {
          id: 'msg-bot-' + Date.now(),
          sender: 'bot',
          senderName: 'Apex Automotive Specialist',
          senderAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
          text: replyText,
          timestamp: new Date().toISOString(),
          productSuggestion: matchedProduct,
          orderStatusLookup: matchedOrder,
        };

        setChatMessages((prev) => [...prev, botReply]);
      } catch (err) {
        console.error('Chat error:', err);
      } finally {
        setIsChatTyping(false);
      }
    },
    [currentUser, orders, products, activeVehicle]
  );

  const toggleDarkMode = useCallback(() => {
    setIsDarkMode((prev) => !prev);
  }, []);

  const setLanguage = useCallback((lang: SupportedLanguage) => {
    setCurrentLanguageState(lang);
  }, []);

  const unreadNotificationsCount = notifications.filter((n) => !n.read).length;

  return (
    <AppContext.Provider
      value={{
        products,
        reviews,
        addProduct,
        updateProduct,
        deleteProduct,
        updateStock,
        setStockExact,
        addReview,
        cart,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        cartCount,
        cartSubtotal,
        cartTotal,
        couponCode,
        discountAmount,
        applyCoupon,
        activeVehicle,
        setActiveVehicle,
        isProductCompatible,
        saveVehicleToGarage,
        orders,
        createOrder,
        updateOrderStatus,
        activeTrackingOrder,
        setActiveTrackingOrder,
        currentUser,
        loginWithPhoneOtp,
        loginAdminWithGmail,
        loginSocial,
        loginWithSocial: loginSocial,
        loginEmail,
        logout,
        switchUserRole,
        notifications,
        unreadNotificationsCount,
        addNotification,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        requestNotificationPermission,
        chatMessages,
        sendChatMessage,
        isSupportOpen,
        setIsSupportOpen,
        isChatOpen: isSupportOpen,
        setIsChatOpen: setIsSupportOpen,
        isChatTyping,
        selectedCategory,
        setSelectedCategory,
        searchQuery,
        setSearchQuery,
        fitmentFilterOnly,
        setFitmentFilterOnly,
        currentLanguage,

        setLanguage,
        t,
        formatPrice,
        isDarkMode,
        toggleDarkMode,
        isOnline,
        isSimulatedOffline,
        toggleSimulatedOffline,
        syncQueue,
        triggerCloudSync,
        isSyncing,
        isCartDrawerOpen,
        setIsCartDrawerOpen,
        isCheckoutModalOpen,
        setIsCheckoutModalOpen,
        isVehicleModalOpen,
        setIsVehicleModalOpen,
        isAuthModalOpen,
        setIsAuthModalOpen,
        isAdminOpen,
        setIsAdminOpen,
        selectedProductDetail,
        setSelectedProductDetail,
        activeTab,
        setActiveTab,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
