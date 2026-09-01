import React, { useState, useRef, useEffect } from 'react';
import {
  Car,
  Search,
  ShoppingCart,
  Bell,
  Sun,
  Moon,
  Globe,
  Wifi,
  WifiOff,
  User,
  Shield,
  Clock,
  ChevronDown,
  X,
  Sparkles,
  Package,
  Wrench,
  Compass,
  CheckCircle2,
  RefreshCw,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { LANGUAGES } from '../i18n/translations';
import { SupportedLanguage } from '../types';

export const Navbar: React.FC<{
  onOpenOrders?: () => void;
  onSearchChange?: (q: string) => void;
  searchQuery?: string;
  selectedCategory?: string;
  onSelectCategory?: (cat: string) => void;
}> = ({ onOpenOrders, onSearchChange, searchQuery: propSearchQuery, selectedCategory: propSelectedCategory, onSelectCategory: propOnSelectCategory }) => {
  const {
    t,
    cartCount,
    setIsCartDrawerOpen,
    activeVehicle,
    setIsVehicleModalOpen,
    isDarkMode,
    toggleDarkMode,
    currentLanguage,
    setLanguage,
    isOnline,
    isSimulatedOffline,
    toggleSimulatedOffline,
    syncQueue,
    triggerCloudSync,
    isSyncing,
    notifications,
    unreadNotificationsCount,
    markAllNotificationsAsRead,
    markNotificationAsRead,
    currentUser,
    setIsAuthModalOpen,
    isAdminOpen,
    setIsAdminOpen,
    activeTab,
    setActiveTab,
    orders,
    setActiveTrackingOrder,
    searchQuery: contextSearchQuery,
    setSearchQuery,
    selectedCategory: contextSelectedCategory,
    setSelectedCategory,
  } = useApp();

  const searchQuery = propSearchQuery !== undefined ? propSearchQuery : contextSearchQuery;
  const handleSearchChange = onSearchChange || setSearchQuery;
  const selectedCategory = propSelectedCategory !== undefined ? propSelectedCategory : contextSelectedCategory;
  const handleSelectCategory = propOnSelectCategory || setSelectedCategory;

  const [isLangOpen, setIsLangOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const langRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);
  const userRef = useRef<HTMLDivElement>(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setIsLangOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setIsNotifOpen(false);
      }
      if (userRef.current && !userRef.current.contains(e.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-40 bg-neutral-900/95 backdrop-blur-md border-b border-neutral-800 shadow-xl transition-colors duration-200 text-neutral-200">
      {/* Top Banner: Guaranteed Fit & Offline Sync notice */}
      <div className="bg-neutral-950 text-neutral-400 text-xs font-medium py-1.5 px-4 border-b border-neutral-800/80">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3 overflow-hidden">
            <span className="hidden sm:inline-flex items-center gap-1.5 text-amber-400 font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              {t('freeShippingBadge')}
            </span>
            <span className="hidden md:inline text-neutral-600">•</span>
            <span className="text-neutral-400 truncate">
              {t('warrantyBadge', { years: 3 })} & {t('easyReturns')}
            </span>
          </div>

          <div className="flex items-center gap-3 text-xs">
            {/* Offline Simulation Switcher */}
            <button
              id="offline-toggle-btn"
              onClick={toggleSimulatedOffline}
              title={isOnline ? 'Click to simulate offline network' : 'Click to restore online network'}
              className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold transition-all ${
                isOnline
                  ? 'bg-neutral-800 text-neutral-200 hover:bg-neutral-700 border border-neutral-700'
                  : 'bg-amber-950/80 text-amber-300 hover:bg-amber-900 border border-amber-700/60 animate-pulse'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-500' : 'bg-amber-400'}`}></span>
              <span>{isOnline ? 'ONLINE' : 'OFFLINE MODE'}</span>
              {syncQueue.length > 0 && (
                <span className="bg-amber-500 text-neutral-950 text-[10px] font-bold px-1 rounded-full">
                  {syncQueue.length}
                </span>
              )}
            </button>

            {/* Quick admin switch badge for convenience */}
            <button
              id="admin-quick-toggle"
              onClick={() => {
                if (activeTab === 'admin') {
                  setActiveTab('store');
                } else {
                  setActiveTab('admin');
                }
              }}
              className={`hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[11px] font-bold transition-colors ${
                activeTab === 'admin'
                  ? 'bg-amber-500 text-neutral-950 shadow-sm'
                  : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700 hover:text-white border border-neutral-700'
              }`}
            >
              <Shield className="w-3 h-3 text-amber-400" />
              <span>{activeTab === 'admin' ? 'Store Front' : 'Admin Panel'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18 gap-3 sm:gap-6">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              id="nav-logo-btn"
              onClick={() => {
                setActiveTab('store');
                handleSelectCategory('all');
              }}
              className="flex items-center gap-2.5 text-left group focus:outline-none"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-600 via-amber-500 to-yellow-400 flex items-center justify-center text-neutral-950 shadow-md shadow-amber-500/20 group-hover:scale-105 transition-transform duration-200 font-bold">
                <Car className="w-5 h-5 stroke-[2.5]" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xl sm:text-2xl font-black tracking-tight text-white font-display">
                    APEX<span className="text-amber-500">AUTO</span>
                  </span>
                  <span className="bg-amber-500/20 text-amber-400 text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded border border-amber-500/30 tracking-wider">
                    ELITE
                  </span>
                </div>
                <p className="text-[11px] text-neutral-400 hidden sm:block -mt-1 font-medium">
                  {t('tagline')}
                </p>
              </div>
            </button>
          </div>

          {/* Vehicle Selector Pill */}
          <div className="hidden lg:flex items-center">
            <button
              id="nav-vehicle-selector-btn"
              onClick={() => setIsVehicleModalOpen(true)}
              className={`group flex items-center gap-2.5 px-3.5 py-2 rounded-xl border transition-all text-xs font-semibold ${
                activeVehicle
                  ? 'bg-neutral-800/90 border-amber-500/40 text-neutral-200 hover:border-amber-500 shadow-xs'
                  : 'bg-neutral-800 border-neutral-700 text-neutral-300 hover:border-neutral-600'
              }`}
            >
              <div
                className={`w-6 h-6 rounded-lg flex items-center justify-center ${
                  activeVehicle
                    ? 'bg-amber-500 text-neutral-950'
                    : 'bg-neutral-700 text-neutral-300'
                }`}
              >
                <Wrench className="w-3.5 h-3.5" />
              </div>
              <div className="text-left">
                <div className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider leading-none">
                  {activeVehicle ? t('guaranteedFit') : t('selectVehicle')}
                </div>
                <div className="font-bold text-xs truncate max-w-[160px] text-white">
                  {activeVehicle
                    ? `${activeVehicle.year} ${activeVehicle.make} ${activeVehicle.model}`
                    : 'Add Car for Fitment'}
                </div>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-neutral-400 group-hover:translate-y-0.5 transition-transform" />
            </button>
          </div>

          {/* Search Input Bar */}
          <div className="flex-1 max-w-xl relative">
            <div
              className={`relative flex items-center rounded-xl border transition-all ${
                isSearchFocused
                  ? 'border-amber-500 ring-2 ring-amber-500/20 bg-neutral-800'
                  : 'border-neutral-700 bg-neutral-800/80 hover:border-neutral-600'
              }`}
            >
              <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 shrink-0 pointer-events-none" />
              <input
                id="search-accessories-input"
                type="text"
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setIsSearchFocused(false)}
                placeholder={t('searchPlaceholder')}
                className="w-full pl-10 pr-9 py-2 text-xs sm:text-sm bg-transparent text-white placeholder-neutral-400 focus:outline-none"
              />
              {searchQuery && (
                <button
                  onClick={() => handleSearchChange('')}
                  className="absolute right-3 p-0.5 text-neutral-400 hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Action Icons: Language, Dark Mode, Notifications, Orders, Cart */}
          <div className="flex items-center gap-1.5 sm:gap-2.5">
            {/* Vehicle Mobile Button */}
            <button
              onClick={() => setIsVehicleModalOpen(true)}
              className="lg:hidden p-2 rounded-xl text-neutral-300 hover:bg-neutral-800 relative"
              title={activeVehicle ? `${activeVehicle.year} ${activeVehicle.make} ${activeVehicle.model}` : 'Select Vehicle'}
            >
              <Car className="w-5 h-5" />
              {activeVehicle && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-amber-500 rounded-full ring-2 ring-neutral-900" />
              )}
            </button>

            {/* Language Selector Dropdown */}
            <div className="relative" ref={langRef}>
              <button
                id="language-dropdown-btn"
                onClick={() => setIsLangOpen(!isLangOpen)}
                className="flex items-center gap-1 px-2.5 py-2 rounded-xl text-xs font-semibold text-neutral-300 hover:bg-neutral-800 transition-colors border border-transparent hover:border-neutral-700"
                title="Change Language & Currency"
              >
                <span className="text-base leading-none">{LANGUAGES[currentLanguage].flag}</span>
                <span className="hidden md:inline uppercase font-bold text-xs">
                  {LANGUAGES[currentLanguage].code}
                </span>
                <ChevronDown className="w-3 h-3 text-neutral-400" />
              </button>

              {isLangOpen && (
                <div className="absolute right-0 mt-2 w-52 bg-neutral-900 rounded-2xl shadow-2xl border border-neutral-800 py-1.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="px-3 py-1.5 text-[11px] font-bold text-neutral-400 uppercase tracking-wider border-b border-neutral-800">
                    {t('language')} & Currency
                  </div>
                  {(Object.keys(LANGUAGES) as SupportedLanguage[]).map((langKey) => {
                    const lang = LANGUAGES[langKey];
                    const isSelected = currentLanguage === langKey;
                    return (
                      <button
                        key={langKey}
                        onClick={() => {
                          setLanguage(langKey);
                          setIsLangOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-3 py-2 text-xs font-medium transition-colors ${
                          isSelected
                            ? 'bg-amber-500/10 text-amber-400 font-bold'
                            : 'text-neutral-300 hover:bg-neutral-800'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <span className="text-lg leading-none">{lang.flag}</span>
                          <div className="text-left">
                            <div>{lang.nativeName}</div>
                            <div className="text-[10px] text-neutral-400">{lang.name}</div>
                          </div>
                        </div>
                        <span className="text-xs font-mono font-bold bg-neutral-800 px-1.5 py-0.5 rounded text-neutral-300">
                          {lang.currency} ({lang.currencySymbol})
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Push Notifications Bell Dropdown */}
            <div className="relative" ref={notifRef}>
              <button
                id="notifications-bell-btn"
                onClick={() => setIsNotifOpen(!isNotifOpen)}
                className="p-2 rounded-xl text-neutral-300 hover:bg-neutral-800 transition-colors relative"
                title="Notifications & Tracking Alerts"
              >
                <Bell className="w-5 h-5" />
                {unreadNotificationsCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-amber-500 text-[10px] font-black text-neutral-950 ring-2 ring-neutral-900 animate-pulse">
                    {unreadNotificationsCount}
                  </span>
                )}
              </button>

              {isNotifOpen && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-neutral-900 rounded-2xl shadow-2xl border border-neutral-800 overflow-hidden z-50">
                  <div className="p-3.5 bg-neutral-800/80 border-b border-neutral-700/60 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Bell className="w-4 h-4 text-amber-500" />
                      <span className="font-bold text-sm text-white">
                        {t('notifications')}
                      </span>
                      {unreadNotificationsCount > 0 && (
                        <span className="bg-amber-500/20 text-amber-400 text-xs px-1.5 py-0.5 rounded-full font-bold">
                          {unreadNotificationsCount} new
                        </span>
                      )}
                    </div>
                    {unreadNotificationsCount > 0 && (
                      <button
                        onClick={markAllNotificationsAsRead}
                        className="text-xs font-semibold text-amber-400 hover:underline"
                      >
                        {t('markAllRead')}
                      </button>
                    )}
                  </div>

                  <div className="max-h-80 overflow-y-auto divide-y divide-neutral-800">
                    {notifications.length === 0 ? (
                      <div className="p-6 text-center text-xs text-neutral-400">
                        {t('noNotifications')}
                      </div>
                    ) : (
                      notifications.slice(0, 6).map((notif) => (
                        <div
                          key={notif.id}
                          onClick={() => {
                            markNotificationAsRead(notif.id);
                            if (notif.orderId) {
                              const ord = orders.find((o) => o.id === notif.orderId);
                              if (ord) {
                                setActiveTrackingOrder(ord);
                                setIsNotifOpen(false);
                              }
                            }
                          }}
                          className={`p-3.5 text-left transition-colors cursor-pointer hover:bg-neutral-800/60 ${
                            !notif.read ? 'bg-amber-500/5' : ''
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <h4 className="text-xs font-bold text-white leading-snug">
                              {notif.title}
                            </h4>
                            <span className="text-[10px] text-neutral-400 shrink-0">
                              {new Date(notif.timestamp).toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </span>
                          </div>
                          <p className="text-xs text-neutral-300 mt-1 leading-relaxed">
                            {notif.message}
                          </p>
                          {notif.orderId && (
                            <span className="inline-flex items-center gap-1 mt-2 text-[11px] font-semibold text-amber-400 hover:underline">
                              <Package className="w-3 h-3" />
                              {t('trackOrderBtn')} →
                            </span>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* My Orders / Tracking Button */}
            <button
              id="my-orders-nav-btn"
              onClick={() => {
                if (onOpenOrders) {
                  onOpenOrders();
                } else if (orders.length > 0) {
                  setActiveTrackingOrder(orders[0]);
                } else {
                  setActiveTab('orders');
                }
              }}
              className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-neutral-300 hover:bg-neutral-800 transition-colors border border-neutral-700"
              title="Track Active Orders"
            >
              <Package className="w-4 h-4 text-amber-500" />
              <span>Track Orders</span>
              {orders.length > 0 && (
                <span className="bg-neutral-700 text-neutral-200 text-[10px] font-bold px-1.5 py-0.2 rounded-full">
                  {orders.length}
                </span>
              )}
            </button>

            {/* Cart Button */}
            <button
              id="cart-drawer-trigger-btn"
              onClick={() => setIsCartDrawerOpen(true)}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 transition-all font-black text-xs shadow-lg shadow-amber-500/20 hover:scale-[1.02]"
              title="View Cart & Checkout"
            >
              <div className="relative">
                <ShoppingCart className="w-4 h-4" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2.5 bg-neutral-950 text-amber-400 text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center ring-2 ring-amber-500 animate-bounce">
                    {cartCount}
                  </span>
                )}
              </div>
              <span className="hidden sm:inline font-black">Cart</span>
            </button>

            {/* User Account / Auth Menu */}
            <div className="relative" ref={userRef}>
              <button
                id="user-account-menu-btn"
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center gap-1.5 p-1 rounded-xl hover:bg-neutral-800 transition-colors"
                title={currentUser.name || 'Account'}
              >
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-8 h-8 rounded-lg object-cover ring-1 ring-neutral-700"
                  referrerPolicy="no-referrer"
                />
              </button>

              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-neutral-900 rounded-2xl shadow-2xl border border-neutral-800 py-2 z-50">
                  <div className="px-4 py-2.5 border-b border-neutral-800">
                    <div className="font-bold text-sm text-white truncate">
                      {currentUser.name}
                    </div>
                    <div className="text-xs text-neutral-400 truncate">{currentUser.email}</div>
                    <div className="mt-2 flex items-center gap-1.5">
                      <span className="bg-neutral-800 text-neutral-300 text-[10px] uppercase font-bold px-2 py-0.5 rounded border border-neutral-700">
                        {currentUser.role === 'admin' ? '🛡️ Administrator' : '🏎️ VIP Customer'}
                      </span>
                      <span className="bg-amber-500/20 text-amber-400 text-[10px] font-bold px-1.5 py-0.5 rounded capitalize">
                        {currentUser.provider}
                      </span>
                    </div>
                  </div>

                  <div className="py-1">
                    <button
                      onClick={() => {
                        setActiveTab('admin');
                        setIsUserMenuOpen(false);
                      }}
                      className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-neutral-300 hover:bg-neutral-800"
                    >
                      <Shield className="w-4 h-4 text-amber-500" />
                      <span>{t('adminDashboard')}</span>
                    </button>

                    <button
                      onClick={() => {
                        setIsVehicleModalOpen(true);
                        setIsUserMenuOpen(false);
                      }}
                      className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-neutral-300 hover:bg-neutral-800"
                    >
                      <Car className="w-4 h-4 text-amber-500" />
                      <span>{t('myVehicles')} ({currentUser.savedVehicles.length})</span>
                    </button>

                    <button
                      onClick={() => {
                        if (orders.length > 0) setActiveTrackingOrder(orders[0]);
                        setIsUserMenuOpen(false);
                      }}
                      className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-neutral-300 hover:bg-neutral-800"
                    >
                      <Package className="w-4 h-4 text-amber-500" />
                      <span>Track Orders ({orders.length})</span>
                    </button>

                    <div className="border-t border-neutral-800 my-1"></div>

                    <button
                      onClick={() => {
                        setIsAuthModalOpen(true);
                        setIsUserMenuOpen(false);
                      }}
                      className="w-full flex items-center justify-between px-4 py-2 text-xs font-semibold text-amber-400 hover:bg-neutral-800"
                    >
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-amber-500" />
                        <span>Phone OTP / Admin Login</span>
                      </div>
                      <span className="text-[10px] bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded font-mono">
                        NEW
                      </span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Secondary Category Navigation Bar */}
        <div className="flex items-center gap-1.5 py-2.5 overflow-x-auto no-scrollbar border-t border-neutral-800/60 text-xs">
          {[
            { id: 'all', label: t('categories.all'), icon: Compass },
            { id: 'electronics', label: t('categories.electronics'), icon: Sparkles },
            { id: 'lighting', label: t('categories.lighting'), icon: Sun },
            { id: 'interior', label: t('categories.interior'), icon: Car },
            { id: 'safety', label: t('categories.safety'), icon: Shield },
            { id: 'care', label: t('categories.care'), icon: RefreshCw },
            { id: 'wheels', label: t('categories.wheels'), icon: Wrench },
            { id: 'performance', label: t('categories.performance'), icon: Sparkles },
          ].map((cat) => {
            const Icon = cat.icon;
            const isSelected = selectedCategory === cat.id && activeTab === 'store';
            return (
              <button
                key={cat.id}
                onClick={() => {
                  setActiveTab('store');
                  handleSelectCategory(cat.id);
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg whitespace-nowrap font-bold transition-all ${
                  isSelected
                    ? 'bg-amber-500 text-neutral-950 shadow-md'
                    : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
