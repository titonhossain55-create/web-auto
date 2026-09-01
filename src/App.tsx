import React, { useState, useMemo } from 'react';
import {
  Car,
  Filter,
  SlidersHorizontal,
  Search,
  Sparkles,
  Check,
  ShieldCheck,
  Truck,
  RotateCcw,
  Zap,
  ArrowUpDown,
  Tag,
  HelpCircle,
  Package,
  Layers,
  Wrench,
  Smartphone,
  Flame,
  Radio,
  SunMedium,
  HeartHandshake,
} from 'lucide-react';
import { useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { HeroBanner } from './components/HeroBanner';
import { ProductCard } from './components/ProductCard';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { OrderTrackerModal } from './components/OrderTrackerModal';
import { VehicleSelectorModal } from './components/VehicleSelectorModal';
import { AdminPanel } from './components/AdminPanel';
import { CustomerSupportChat } from './components/CustomerSupportChat';
import { AuthModal } from './components/AuthModal';
import { MyOrdersModal } from './components/MyOrdersModal';
import { CATEGORIES } from './data/mockProducts';

export function App() {
  const {
    products,
    activeTab,
    setActiveTab,
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    setSearchQuery,
    fitmentFilterOnly,
    setFitmentFilterOnly,
    activeVehicle,
    isProductCompatible,
    t,
    formatPrice,
    setIsVehicleModalOpen,
    notifications,
    setIsChatOpen,
  } = useApp();

  const [sortBy, setSortBy] = useState<'featured' | 'price_asc' | 'price_desc' | 'rating' | 'bestseller'>('featured');
  const [isMyOrdersOpen, setIsMyOrdersOpen] = useState(false);

  // Filter & Sort Logic
  const filteredProducts = useMemo(() => {
    return products
      .filter((product) => {
        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matches =
            product.name.toLowerCase().includes(q) ||
            product.brand.toLowerCase().includes(q) ||
            product.shortDesc.toLowerCase().includes(q) ||
            product.tags.some((t) => t.toLowerCase().includes(q));
          if (!matches) return false;
        }

        // Category filter
        if (selectedCategory !== 'all' && product.category !== selectedCategory) {
          return false;
        }

        // Fitment filter
        if (fitmentFilterOnly && activeVehicle) {
          if (!isProductCompatible(product)) {
            return false;
          }
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price_asc') return a.price - b.price;
        if (sortBy === 'price_desc') return b.price - a.price;
        if (sortBy === 'rating') return b.rating - a.rating;
        if (sortBy === 'bestseller') return (b.isBestSeller ? 1 : 0) - (a.isBestSeller ? 1 : 0);
        return 0;
      });
  }, [products, searchQuery, selectedCategory, fitmentFilterOnly, activeVehicle, sortBy, isProductCompatible]);

  const handleScrollToProducts = () => {
    const el = document.getElementById('catalog-section');
    el?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-200 flex flex-col font-sans transition-colors duration-200">
      {/* Top Navbar */}
      <Navbar onOpenOrders={() => setIsMyOrdersOpen(true)} />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {activeTab === 'admin' ? (
          <AdminPanel />
        ) : (
          <div>
            {/* Hero Cockpit Banner */}
            <HeroBanner onExploreClick={handleScrollToProducts} />

            {/* Catalog Section Header & Fitment Bar */}
            <div id="catalog-section" className="space-y-6 pt-2">
              {/* Category Pills Bar */}
              <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
                {CATEGORIES.map((cat) => {
                  const isSelected = selectedCategory === cat.id;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 shrink-0 ${
                        isSelected
                          ? 'bg-amber-500 text-neutral-950 font-black shadow-lg shadow-amber-500/20'
                          : 'bg-neutral-900 text-neutral-400 hover:text-white hover:bg-neutral-800 border border-neutral-800'
                      }`}
                    >
                      <span>{cat.name}</span>
                    </button>
                  );
                })}
              </div>

              {/* Filter Controls Bar */}
              <div className="p-4 rounded-2xl bg-neutral-900 border border-neutral-800 shadow-xl flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
                {/* Vehicle Fitment Switch & Count */}
                <div className="flex flex-wrap items-center gap-3">
                  {activeVehicle ? (
                    <button
                      id="fitment-toggle-btn"
                      onClick={() => setFitmentFilterOnly(!fitmentFilterOnly)}
                      className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 border ${
                        fitmentFilterOnly
                          ? 'bg-green-950 text-green-400 border-green-800/80 shadow-md shadow-green-950/40'
                          : 'bg-neutral-800 text-neutral-300 border-neutral-700 hover:text-white hover:border-neutral-600'
                      }`}
                    >
                      <Car className="w-3.5 h-3.5" />
                      <span>
                        {fitmentFilterOnly
                          ? `Showing parts for ${activeVehicle.make} ${activeVehicle.model}`
                          : `Filter for ${activeVehicle.make} ${activeVehicle.model}`}
                      </span>
                    </button>
                  ) : (
                    <button
                      onClick={() => setIsVehicleModalOpen(true)}
                      className="px-3.5 py-2 rounded-xl text-xs font-bold bg-neutral-800 text-neutral-300 hover:bg-neutral-700 hover:text-white border border-neutral-700 flex items-center gap-1.5 transition-colors"
                    >
                      <Car className="w-3.5 h-3.5 text-amber-500" />
                      <span>{t('selectVehicle')} for guaranteed fitment</span>
                    </button>
                  )}

                  <span className="text-xs text-neutral-400">
                    Showing <strong className="text-white">{filteredProducts.length}</strong> premium accessories
                  </span>
                </div>

                {/* Sort Dropdown */}
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-neutral-400 flex items-center gap-1">
                    <ArrowUpDown className="w-3.5 h-3.5 text-amber-500" />
                    Sort by:
                  </span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="px-3 py-1.5 text-xs font-bold rounded-xl border border-neutral-700 bg-neutral-800 text-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  >
                    <option value="featured">Featured & Trending</option>
                    <option value="bestseller">Best Sellers First</option>
                    <option value="rating">Highest Customer Rating</option>
                    <option value="price_asc">Price: Low to High</option>
                    <option value="price_desc">Price: High to Low</option>
                  </select>
                </div>
              </div>

              {/* Products Grid */}
              {filteredProducts.length === 0 ? (
                <div className="py-16 text-center rounded-3xl bg-neutral-900 border border-neutral-800 p-8 space-y-3 shadow-xl">
                  <div className="w-16 h-16 rounded-full bg-neutral-800 flex items-center justify-center mx-auto text-neutral-400">
                    <Search className="w-8 h-8" />
                  </div>
                  <h3 className="text-base font-bold text-white">
                    No matching accessories found
                  </h3>
                  <p className="text-xs text-neutral-400 max-w-sm mx-auto">
                    Try clearing your search query or vehicle fitment filter to see universal car products.
                  </p>
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedCategory('all');
                      setFitmentFilterOnly(false);
                    }}
                    className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs shadow-md transition-colors"
                  >
                    Reset Filters
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6">
                  {filteredProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-16 bg-neutral-900 border-t border-neutral-800 py-12 text-neutral-400 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 font-display font-black text-base text-white tracking-wider">
              <span className="w-6 h-6 rounded-lg bg-amber-500 text-neutral-950 font-black flex items-center justify-center text-xs">
                ▲
              </span>
              <span>
                APEX<span className="text-amber-500">AUTO</span>
              </span>
            </div>
            <p className="mt-3 text-xs leading-relaxed text-neutral-400">
              International high-performance car accessories, 4K Dash Cams, Ambient RGB Kits, and Diagnostic Tools with guaranteed vehicle fitment.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-white uppercase tracking-wider mb-3">
              Payment & Security
            </h4>
            <ul className="space-y-1.5 text-neutral-400">
              <li>• Cash on Delivery (COD) with Doorstep Inspection</li>
              <li>• Visa, Mastercard, Amex, Discover 256-Bit SSL</li>
              <li>• Apple Pay, Google Pay, PayPal Biometric</li>
              <li>• Offline-Ready Order Queue Engine</li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white uppercase tracking-wider mb-3">
              Customer Guarantee
            </h4>
            <ul className="space-y-1.5 text-neutral-400">
              <li>• 30-Day Hassle-Free Returns</li>
              <li>• 2 to 3-Year Extended Manufacturer Warranty</li>
              <li>• Free Shipping on Orders over $50</li>
              <li>• 24/7 AI Automotive Master Tech Chat</li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white uppercase tracking-wider mb-3">
              Admin & Dispatch
            </h4>
            <p className="text-xs leading-relaxed text-neutral-400 mb-3">
              Access real-time stock control, sales analytics, and automated push notification dispatch.
            </p>
            <button
              id="footer-admin-btn"
              onClick={() => setActiveTab(activeTab === 'admin' ? 'store' : 'admin')}
              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs shadow-md transition-colors"
            >
              {activeTab === 'admin' ? 'Exit Admin Studio' : 'Launch Admin Studio'}
            </button>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 pt-6 border-t border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-neutral-400">
          <div>
            © {new Date().getFullYear()} ApexAuto Performance Inc. All rights reserved.
          </div>
          <div className="flex items-center gap-4">
            <span className="text-amber-500">Guaranteed OEM Fitment</span>
            <span>•</span>
            <span>Real-time GPS Order Tracking</span>
            <span>•</span>
            <span>Multi-Language & Currency</span>
          </div>
        </div>
      </footer>

      {/* Modals & Slide-ins */}
      <VehicleSelectorModal />
      <ProductDetailModal />
      <CartDrawer />
      <CheckoutModal />
      <OrderTrackerModal />
      <AuthModal />
      <MyOrdersModal
        isOpen={isMyOrdersOpen}
        onClose={() => setIsMyOrdersOpen(false)}
      />
      <CustomerSupportChat />
    </div>
  );
}

export default App;
