import React, { useState } from 'react';
import {
  TrendingUp,
  Package,
  ShoppingCart,
  AlertTriangle,
  Plus,
  Edit2,
  Trash2,
  RefreshCw,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  Shield,
  Truck,
  DollarSign,
  BarChart3,
  Layers,
  Sparkles,
  Download,
  X,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Product, OrderStatusType } from '../types';

export const AdminPanel: React.FC = () => {
  const {
    products,
    addProduct,
    updateProduct,
    deleteProduct,
    updateStock,
    setStockExact,
    orders,
    updateOrderStatus,
    formatPrice,
    t,
    syncQueue,
    triggerCloudSync,
    isSyncing,
    setActiveTrackingOrder,
    setActiveTab,
    currentUser,
    loginAdminWithGmail,
    setIsAuthModalOpen,
  } = useApp();

  const [adminEmailInput, setAdminEmailInput] = useState('titonhossain55@gmail.com');
  const [activeAdminTab, setActiveAdminTab] = useState<'analytics' | 'inventory' | 'orders' | 'sync'>('analytics');
  const [searchInventory, setSearchInventory] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [showLowStockOnly, setShowLowStockOnly] = useState(false);

  // New / Edit Product Modal state
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isNewProductModalOpen, setIsNewProductModalOpen] = useState(false);

  const [newProdName, setNewProdName] = useState('');
  const [newProdSku, setNewProdSku] = useState('');
  const [newProdBrand, setNewProdBrand] = useState('ApexAuto');
  const [newProdCategory, setNewProdCategory] = useState('electronics');
  const [newProdPrice, setNewProdPrice] = useState(99.99);
  const [newProdStock, setNewProdStock] = useState(25);
  const [newProdDesc, setNewProdDesc] = useState('');
  const [newProdImg, setNewProdImg] = useState('https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80');

  // --- KPI Metrics ---
  const totalRevenue = orders.reduce((sum, o) => sum + (o.paymentStatus === 'paid' ? o.total : o.total), 0);
  const totalOrdersCount = orders.length;
  const averageOrderValue = totalOrdersCount > 0 ? totalRevenue / totalOrdersCount : 0;
  const lowStockCount = products.filter((p) => p.stock <= 10).length;

  // --- Filtering Inventory ---
  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchInventory.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchInventory.toLowerCase()) ||
      p.brand.toLowerCase().includes(searchInventory.toLowerCase());
    const matchesCat = filterCategory === 'all' || p.category === filterCategory;
    const matchesLowStock = !showLowStockOnly || p.stock <= 10;
    return matchesSearch && matchesCat && matchesLowStock;
  });

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProdName.trim() || !newProdSku.trim()) return;

    if (editingProduct) {
      updateProduct({
        ...editingProduct,
        name: newProdName,
        sku: newProdSku,
        brand: newProdBrand,
        category: newProdCategory,
        price: Number(newProdPrice),
        stock: Number(newProdStock),
        description: newProdDesc || editingProduct.description,
        images: [newProdImg],
      });
      setEditingProduct(null);
    } else {
      addProduct({
        sku: newProdSku,
        name: newProdName,
        brand: newProdBrand,
        category: newProdCategory,
        price: Number(newProdPrice),
        stock: Number(newProdStock),
        rating: 5.0,
        reviewsCount: 1,
        images: [newProdImg],
        shortDesc: newProdDesc,
        description: newProdDesc || `${newProdName} by ${newProdBrand}.`,
        features: ['Precision OEM fitment', 'Durable high-grade construction', 'Plug-and-play setup'],
        specs: [{ name: 'Compatibility', value: 'Universal / OEM Standard' }],
        compatibility: { makes: [], models: [], years: [], universal: true },
        warrantyYears: 2,
        tags: [newProdCategory, 'Accessories'],
        installationDifficulty: 'Easy (DIY)',
      });
      setIsNewProductModalOpen(false);
    }

    // Reset fields
    setNewProdName('');
    setNewProdSku('');
    setNewProdPrice(99.99);
    setNewProdStock(25);
    setNewProdDesc('');
  };

  const handleOpenEdit = (p: Product) => {
    setEditingProduct(p);
    setNewProdName(p.name);
    setNewProdSku(p.sku);
    setNewProdBrand(p.brand);
    setNewProdCategory(p.category);
    setNewProdPrice(p.price);
    setNewProdStock(p.stock);
    setNewProdDesc(p.shortDesc);
    setNewProdImg(p.images[0]);
    setIsNewProductModalOpen(true);
  };

  const handleExportCSV = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      ['SKU,Name,Category,Price,Stock,Rating'].join(',') +
      '\n' +
      products.map((p) => `"${p.sku}","${p.name}","${p.category}",${p.price},${p.stock},${p.rating}`).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `apexauto_inventory_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (currentUser.role !== 'admin') {
    return (
      <div className="max-w-xl mx-auto py-12 px-4 animate-in fade-in">
        <div className="bg-neutral-900 rounded-3xl p-8 border border-neutral-800 shadow-2xl text-center space-y-6">
          <div className="w-16 h-16 rounded-3xl bg-red-500/10 border border-red-500/30 text-red-400 flex items-center justify-center mx-auto shadow-lg shadow-red-500/10">
            <Shield className="w-8 h-8" />
          </div>
          <div>
            <span className="bg-red-500/20 text-red-400 text-xs font-black uppercase px-2.5 py-1 rounded-full border border-red-500/30">
              Admin Access Restricted
            </span>
            <h2 className="text-2xl font-black text-white mt-3 font-display">
              Administrator Login Required
            </h2>
            <p className="text-xs text-neutral-400 mt-2 max-w-md mx-auto leading-relaxed">
              Store inventory adjustments, analytics, pricing, and order fulfillment console are strictly restricted to authenticated Gmail administrator accounts.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-neutral-950 border border-neutral-800 text-left space-y-3.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-neutral-300">Admin Gmail Account</span>
              <span className="text-[11px] text-amber-400 font-semibold">Google Workspace</span>
            </div>
            <div className="relative">
              <input
                type="email"
                value={adminEmailInput}
                onChange={(e) => setAdminEmailInput(e.target.value)}
                placeholder="titonhossain55@gmail.com"
                className="w-full px-3.5 py-2.5 text-xs font-semibold rounded-xl border border-neutral-700 bg-neutral-900 text-white focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
            <button
              onClick={() => loginAdminWithGmail(adminEmailInput)}
              className="w-full py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-black text-xs shadow-lg shadow-red-600/30 flex items-center justify-center gap-2 transition-all active:scale-98"
            >
              <Shield className="w-4 h-4 text-amber-300" />
              <span>Log in with Gmail Admin</span>
            </button>
          </div>

          <div className="flex items-center justify-center gap-4 text-xs">
            <button
              onClick={() => setActiveTab('store')}
              className="text-neutral-400 hover:text-white font-semibold transition-colors"
            >
              ← Return to Customer Store
            </button>
            <span className="text-neutral-600">•</span>
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="text-amber-400 hover:underline font-bold"
            >
              Customer Phone OTP Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-300 text-neutral-200">
      {/* Top Admin Header */}
      <div className="bg-neutral-900 rounded-3xl p-6 sm:p-8 text-white border border-neutral-800 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-lg shadow-amber-500/10">
            <Shield className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-black font-display tracking-tight text-white">
                ApexAuto Admin Studio
              </h1>
              <span className="bg-amber-500/20 text-amber-300 text-xs font-bold px-2 py-0.5 rounded border border-amber-500/30">
                Live Production
              </span>
            </div>
            <p className="text-xs sm:text-sm text-neutral-400 mt-1">
              Real-time inventory management, sales forecasting, order dispatching, and cloud synchronization.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleExportCSV}
            className="px-4 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 font-bold text-xs flex items-center gap-2 border border-neutral-700 transition-colors"
          >
            <Download className="w-4 h-4 text-neutral-400" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={() => setActiveTab('store')}
            className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-black text-xs shadow-md shadow-amber-500/20 flex items-center gap-2 transition-transform active:scale-98"
          >
            <ShoppingCart className="w-4 h-4" />
            <span>Back to Store</span>
          </button>
        </div>
      </div>

      {/* Admin Subtabs Navigation */}
      <div className="flex items-center gap-2 border-b border-neutral-800 pb-3 overflow-x-auto no-scrollbar">
        {[
          { id: 'analytics', label: t('adminAnalytics'), icon: BarChart3 },
          { id: 'inventory', label: t('adminInventory'), icon: Layers, badge: lowStockCount },
          { id: 'orders', label: t('adminOrders'), icon: Package, badge: orders.length },
          { id: 'sync', label: 'Cloud Sync Engine', icon: RefreshCw, badge: syncQueue.length },
        ].map((tab) => {
          const Icon = tab.icon;
          const isSelected = activeAdminTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveAdminTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                isSelected
                  ? 'bg-amber-500 text-neutral-950 font-black shadow-sm'
                  : 'text-neutral-400 hover:bg-neutral-800 hover:text-white'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
              {tab.badge !== undefined && tab.badge > 0 && (
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                    isSelected
                      ? 'bg-neutral-950 text-amber-400'
                      : 'bg-neutral-800 text-neutral-300'
                  }`}
                >
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* TAB 1: Sales Analytics */}
      {activeAdminTab === 'analytics' && (
        <div className="space-y-8 animate-in fade-in duration-200">
          {/* 4 KPI Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-neutral-900 border border-neutral-800 shadow-sm">
              <div className="flex items-center justify-between text-neutral-400 text-xs font-bold">
                <span>{t('totalRevenue')}</span>
                <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
                  <DollarSign className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-black text-white font-display mt-2">
                {formatPrice(totalRevenue)}
              </div>
              <div className="flex items-center gap-1 text-[11px] text-emerald-400 font-semibold mt-1">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>+24.8% vs last month</span>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-neutral-900 border border-neutral-800 shadow-sm">
              <div className="flex items-center justify-between text-neutral-400 text-xs font-bold">
                <span>{t('totalOrders')}</span>
                <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center border border-amber-500/20">
                  <ShoppingCart className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-black text-white font-display mt-2">
                {totalOrdersCount}
              </div>
              <div className="flex items-center gap-1 text-[11px] text-emerald-400 font-semibold mt-1">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>98.2% fulfillment rate</span>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-neutral-900 border border-neutral-800 shadow-sm">
              <div className="flex items-center justify-between text-neutral-400 text-xs font-bold">
                <span>{t('averageOrderValue')}</span>
                <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center border border-amber-500/20">
                  <BarChart3 className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-black text-white font-display mt-2">
                {formatPrice(averageOrderValue)}
              </div>
              <div className="text-[11px] text-neutral-400 mt-1">
                Based on active checkout sessions
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-neutral-900 border border-neutral-800 shadow-sm">
              <div className="flex items-center justify-between text-neutral-400 text-xs font-bold">
                <span>{t('lowStockAlerts')}</span>
                <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center border border-amber-500/20">
                  <AlertTriangle className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-black text-white font-display mt-2">
                {lowStockCount} SKUs
              </div>
              <div className="text-[11px] text-amber-400 font-semibold mt-1">
                Requires warehouse replenishment
              </div>
            </div>
          </div>

          {/* Revenue Trend Visual Bar Chart */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 p-6 rounded-3xl bg-neutral-900 border border-neutral-800 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-base text-white font-display">
                    Monthly Sales & Revenue Velocity
                  </h3>
                  <p className="text-xs text-neutral-400">
                    Gross revenue across Card, COD, and Mobile wallets
                  </p>
                </div>
                <span className="text-xs font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-800 px-2.5 py-1 rounded-lg">
                  +31% YoY
                </span>
              </div>

              {/* Responsive SVG Chart */}
              <div className="h-64 flex items-end justify-between gap-2 pt-8 pb-4 border-b border-neutral-800">
                {[
                  { month: 'Mar', rev: 14200, height: '45%' },
                  { month: 'Apr', rev: 18900, height: '60%' },
                  { month: 'May', rev: 22400, height: '70%' },
                  { month: 'Jun', rev: 28100, height: '85%' },
                  { month: 'Jul', rev: 26300, height: '80%' },
                  { month: 'Aug', rev: 34500, height: '100%' },
                  { month: 'Sep (Est)', rev: 38200, height: '95%' },
                ].map((bar, idx) => (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
                    <div className="opacity-0 group-hover:opacity-100 text-[10px] font-mono font-bold bg-neutral-950 border border-neutral-800 text-amber-400 px-1.5 py-0.5 rounded transition-opacity">
                      ${bar.rev.toLocaleString()}
                    </div>
                    <div
                      className="w-full max-w-[42px] bg-gradient-to-t from-amber-600 to-amber-400 rounded-t-xl transition-all group-hover:brightness-110"
                      style={{ height: bar.height }}
                    />
                    <span className="text-[11px] font-semibold text-neutral-400">
                      {bar.month}
                    </span>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between text-xs text-neutral-400">
                <span>Highest grossing category: <strong className="text-white">Electronics & Dashcams</strong></span>
                <span>Peak order hours: <strong className="text-white">6:00 PM – 10:00 PM</strong></span>
              </div>
            </div>

            {/* Top Selling Accessories Ranking */}
            <div className="p-6 rounded-3xl bg-neutral-900 border border-neutral-800 shadow-sm space-y-4">
              <h3 className="font-bold text-base text-white font-display">
                {t('topSelling')}
              </h3>

              <div className="divide-y divide-neutral-800">
                {products.slice(0, 5).map((p, idx) => (
                  <div key={p.id} className="py-3 flex items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-2.5 overflow-hidden">
                      <span className="font-mono font-bold text-xs text-amber-400 w-4">
                        0{idx + 1}
                      </span>
                      <img
                        src={p.images[0]}
                        alt=""
                        className="w-9 h-9 rounded-lg object-cover bg-neutral-800 border border-neutral-700 shrink-0"
                        referrerPolicy="no-referrer"
                      />
                      <div className="truncate">
                        <div className="font-bold text-white truncate">
                          {p.name}
                        </div>
                        <div className="text-[10px] text-neutral-400">
                          {p.stock} units left • ★ {p.rating}
                        </div>
                      </div>
                    </div>

                    <div className="font-black text-white shrink-0 font-display">
                      {formatPrice(p.price)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Live Inventory Management */}
      {activeAdminTab === 'inventory' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Controls bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3 flex-1">
              <div className="relative flex-1 max-w-sm">
                <Search className="w-4 h-4 text-neutral-500 absolute left-3 top-3" />
                <input
                  type="text"
                  value={searchInventory}
                  onChange={(e) => setSearchInventory(e.target.value)}
                  placeholder="Filter by Name, SKU, Brand..."
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-neutral-700 bg-neutral-800 text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="px-3 py-2 text-xs rounded-xl border border-neutral-700 bg-neutral-800 text-white font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                <option value="all">All Categories</option>
                <option value="electronics">Electronics</option>
                <option value="lighting">Lighting</option>
                <option value="interior">Interior</option>
                <option value="safety">Safety</option>
                <option value="care">Car Care</option>
                <option value="wheels">Wheels & Racks</option>
              </select>

              <button
                onClick={() => setShowLowStockOnly(!showLowStockOnly)}
                className={`px-3 py-2 rounded-xl text-xs font-bold transition-colors ${
                  showLowStockOnly
                    ? 'bg-amber-500 text-neutral-950 font-black'
                    : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
                }`}
              >
                Low Stock Only
              </button>
            </div>

            <button
              onClick={() => {
                setEditingProduct(null);
                setNewProdName('');
                setNewProdSku(`APX-${Math.floor(1000 + Math.random() * 9000)}`);
                setNewProdPrice(89.99);
                setNewProdStock(30);
                setIsNewProductModalOpen(true);
              }}
              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-black text-xs shadow-md shadow-amber-500/20 flex items-center justify-center gap-1.5 transition-transform active:scale-98"
            >
              <Plus className="w-4 h-4" />
              <span>{t('addProduct')}</span>
            </button>
          </div>

          {/* Real-Time Inventory Table */}
          <div className="rounded-3xl border border-neutral-800 bg-neutral-900 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-neutral-950 text-neutral-400 font-bold border-b border-neutral-800">
                  <tr>
                    <th className="p-4">Accessory / SKU</th>
                    <th className="p-4">Category</th>
                    <th className="p-4">Price</th>
                    <th className="p-4">Live Stock</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Quick Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-800">
                  {filteredProducts.map((p) => (
                    <tr key={p.id} className="hover:bg-neutral-800/40 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={p.images[0]}
                            alt=""
                            className="w-10 h-10 rounded-xl object-cover bg-neutral-800 border border-neutral-700 shrink-0"
                            referrerPolicy="no-referrer"
                          />
                          <div>
                            <div className="font-bold text-white line-clamp-1">
                              {p.name}
                            </div>
                            <div className="text-[10px] font-mono text-neutral-400">
                              SKU: {p.sku} • {p.brand}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="p-4 capitalize font-semibold text-neutral-300">
                        {p.category}
                      </td>

                      <td className="p-4 font-bold text-white font-display text-sm">
                        {formatPrice(p.price)}
                      </td>

                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <span
                            className={`font-mono font-bold text-sm ${
                              p.stock <= 5
                                ? 'text-red-400'
                                : p.stock <= 15
                                ? 'text-amber-400'
                                : 'text-white'
                            }`}
                          >
                            {p.stock}
                          </span>
                          <button
                            onClick={() => updateStock(p.id, 10)}
                            className="px-2 py-0.5 rounded bg-neutral-800 hover:bg-neutral-700 text-[10px] font-bold text-neutral-200 border border-neutral-700"
                            title="Add 10 units"
                          >
                            +10
                          </button>
                        </div>
                      </td>

                      <td className="p-4">
                        {p.stock <= 0 ? (
                          <span className="bg-red-950 text-red-400 border border-red-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                            Out of Stock
                          </span>
                        ) : p.stock <= 10 ? (
                          <span className="bg-amber-950 text-amber-400 border border-amber-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                            Low Stock Alert
                          </span>
                        ) : (
                          <span className="bg-emerald-950 text-emerald-400 border border-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                            Healthy
                          </span>
                        )}
                      </td>

                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleOpenEdit(p)}
                            className="p-1.5 text-neutral-400 hover:text-amber-400 rounded-lg hover:bg-neutral-800 transition-colors"
                            title="Edit Product"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => deleteProduct(p.id)}
                            className="p-1.5 text-neutral-400 hover:text-red-400 rounded-lg hover:bg-neutral-800 transition-colors"
                            title="Delete Product"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: Order Processing */}
      {activeAdminTab === 'orders' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="p-4 rounded-2xl bg-neutral-900 border border-neutral-800 flex items-center justify-between text-xs text-amber-300">
            <span>
              💡 Status changes instantly update customer live tracker and send automatic Web Push notifications.
            </span>
          </div>

          <div className="space-y-4">
            {orders.map((ord) => (
              <div
                key={ord.id}
                className="p-5 rounded-3xl bg-neutral-900 border border-neutral-800 shadow-sm space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-neutral-800 pb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-white">
                        Order #{ord.orderNumber}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase border ${
                          ord.status === 'delivered'
                            ? 'bg-emerald-950 text-emerald-300 border-emerald-800'
                            : 'bg-amber-950 text-amber-300 border-amber-800'
                        }`}
                      >
                        {ord.status.replace(/_/g, ' ')}
                      </span>
                    </div>
                    <div className="text-xs text-neutral-400">
                      Customer: {ord.customer.fullName} ({ord.customer.phone}) • {new Date(ord.createdAt).toLocaleString()}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-base font-black text-amber-400 font-display">
                      {formatPrice(ord.total)}
                    </span>
                    <button
                      onClick={() => setActiveTrackingOrder(ord)}
                      className="px-3 py-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-bold transition-colors border border-neutral-700"
                    >
                      View Map & Dispatch
                    </button>
                  </div>
                </div>

                {/* Status Switcher Buttons */}
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-bold text-neutral-400 mr-1">Update Status:</span>
                  {(['placed', 'confirmed', 'processing', 'dispatched', 'out_for_delivery', 'delivered'] as OrderStatusType[]).map((st) => (
                    <button
                      key={st}
                      onClick={() => updateOrderStatus(ord.id, st)}
                      className={`px-3 py-1 rounded-lg text-xs font-bold capitalize transition-colors ${
                        ord.status === st
                          ? 'bg-amber-500 text-neutral-950 font-black shadow-sm'
                          : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700 border border-neutral-700'
                      }`}
                    >
                      {st.replace(/_/g, ' ')}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: Cloud Sync Engine Monitor */}
      {activeAdminTab === 'sync' && (
        <div className="p-6 rounded-3xl bg-neutral-900 border border-neutral-800 shadow-sm space-y-6 animate-in fade-in duration-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-base text-white font-display">
                Cloud Synchronization Queue
              </h3>
              <p className="text-xs text-neutral-400">
                Queued offline mutations automatically synchronized with ApexAuto Cloud.
              </p>
            </div>

            <button
              onClick={triggerCloudSync}
              disabled={isSyncing || syncQueue.length === 0}
              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-black text-xs shadow-md shadow-amber-500/20 disabled:opacity-50 flex items-center gap-2 transition-transform active:scale-98"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
              <span>{isSyncing ? 'Syncing...' : 'Force Cloud Sync'}</span>
            </button>
          </div>

          <div className="space-y-3">
            {syncQueue.length === 0 ? (
              <div className="p-8 text-center rounded-2xl bg-emerald-950/20 border border-emerald-800/50">
                <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
                <h4 className="font-bold text-sm text-emerald-300">
                  Cloud State 100% Synchronized
                </h4>
                <p className="text-xs text-emerald-400 mt-1">
                  All local inventory changes, reviews, and customer orders are in sync with cloud database.
                </p>
              </div>
            ) : (
              syncQueue.map((item) => (
                <div
                  key={item.id}
                  className="p-3.5 rounded-2xl bg-neutral-800/60 border border-neutral-700 flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-3">
                    <span className="bg-amber-950 text-amber-400 border border-amber-800 text-[10px] font-mono font-bold px-2 py-0.5 rounded">
                      {item.action}
                    </span>
                    <span className="font-mono text-neutral-400">ID: {item.id}</span>
                  </div>
                  <span className="text-[11px] text-neutral-400">
                    {new Date(item.timestamp).toLocaleTimeString()}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Add / Edit Product Modal */}
      {isNewProductModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-neutral-900 rounded-3xl shadow-2xl border border-neutral-800 overflow-hidden text-neutral-200">
            <div className="p-5 border-b border-neutral-800 flex items-center justify-between bg-neutral-950">
              <h3 className="font-bold text-base text-white font-display">
                {editingProduct ? 'Edit Accessory Product' : 'Add New Car Accessory'}
              </h3>
              <button
                onClick={() => setIsNewProductModalOpen(false)}
                className="p-2 text-neutral-400 hover:text-white rounded-xl hover:bg-neutral-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-neutral-300 mb-1">
                  Product Name *
                </label>
                <input
                  type="text"
                  required
                  value={newProdName}
                  onChange={(e) => setNewProdName(e.target.value)}
                  placeholder="e.g. 4K Ultra Dashcam with Night Vision"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-700 bg-neutral-800 text-white font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-neutral-300 mb-1">
                    SKU Code *
                  </label>
                  <input
                    type="text"
                    required
                    value={newProdSku}
                    onChange={(e) => setNewProdSku(e.target.value)}
                    className="w-full px-3 py-2 text-xs font-mono rounded-xl border border-neutral-700 bg-neutral-800 text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-300 mb-1">
                    Category
                  </label>
                  <select
                    value={newProdCategory}
                    onChange={(e) => setNewProdCategory(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-700 bg-neutral-800 text-white font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500"
                  >
                    <option value="electronics">Electronics</option>
                    <option value="lighting">Lighting</option>
                    <option value="interior">Interior</option>
                    <option value="safety">Safety</option>
                    <option value="care">Car Care</option>
                    <option value="wheels">Wheels & Racks</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-neutral-300 mb-1">
                    Price ($ USD) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={newProdPrice}
                    onChange={(e) => setNewProdPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs font-bold rounded-xl border border-neutral-700 bg-neutral-800 text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-300 mb-1">
                    Initial Stock Level *
                  </label>
                  <input
                    type="number"
                    required
                    value={newProdStock}
                    onChange={(e) => setNewProdStock(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs font-bold rounded-xl border border-neutral-700 bg-neutral-800 text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-300 mb-1">
                  Description / Bullet Points
                </label>
                <textarea
                  rows={2}
                  value={newProdDesc}
                  onChange={(e) => setNewProdDesc(e.target.value)}
                  placeholder="Key features and vehicle fitment instructions..."
                  className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-700 bg-neutral-800 text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsNewProductModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-neutral-400 hover:text-white rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-black text-xs shadow-md shadow-amber-500/20 transition-transform active:scale-98"
                >
                  Save to Inventory
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
