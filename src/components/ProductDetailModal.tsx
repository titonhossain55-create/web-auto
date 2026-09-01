import React, { useState } from 'react';
import {
  X,
  Star,
  ShieldCheck,
  Truck,
  RotateCcw,
  Wrench,
  Check,
  ShoppingCart,
  Zap,
  Plus,
  Minus,
  Sparkles,
  Car,
  MessageSquare,
  ThumbsUp,
  Share2,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { VEHICLE_MAKES, VEHICLE_MODELS } from '../data/mockProducts';

export const ProductDetailModal: React.FC = () => {
  const {
    selectedProductDetail,
    setSelectedProductDetail,
    t,
    formatPrice,
    addToCart,
    isProductCompatible,
    activeVehicle,
    setIsCartDrawerOpen,
    setIsCheckoutModalOpen,
    reviews,
    addReview,
    currentUser,
  } = useApp();

  const [selectedImageIdx, setSelectedImageIdx] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'overview' | 'specs' | 'reviews' | 'fitment'>('overview');

  // Custom Fitment Check Tool state
  const [checkMake, setCheckMake] = useState<string>('Mahindra');
  const [checkModel, setCheckModel] = useState<string>('Thar');
  const [fitmentChecked, setFitmentChecked] = useState<boolean | null>(null);

  // Review form state
  const [newRating, setNewRating] = useState<number>(5);
  const [newComment, setNewComment] = useState<string>('');
  const [newVehicleModel, setNewVehicleModel] = useState<string>('2024 Mahindra Thar');

  if (!selectedProductDetail) return null;

  const product = selectedProductDetail;
  const isCompatible = isProductCompatible(product);
  const productReviews = reviews.filter((r) => r.productId === product.id);

  const discountPercent = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setIsCartDrawerOpen(true);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity);
    setSelectedProductDetail(null);
    setIsCheckoutModalOpen(true);
  };

  const handleRunFitmentCheck = (e: React.FormEvent) => {
    e.preventDefault();
    if (product.compatibility.universal) {
      setFitmentChecked(true);
      return;
    }
    const makeMatch =
      product.compatibility.makes.length === 0 ||
      product.compatibility.makes.some((m) => m.toLowerCase() === checkMake.toLowerCase());
    const modelMatch =
      product.compatibility.models.length === 0 ||
      product.compatibility.models.some((m) => m.toLowerCase() === checkModel.toLowerCase());
    setFitmentChecked(makeMatch && modelMatch);
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    addReview({
      productId: product.id,
      userName: currentUser.name || 'Verified Customer',
      userAvatar: currentUser.avatar,
      rating: newRating,
      comment: newComment.trim(),
      verifiedPurchase: true,
      vehicleModel: newVehicleModel.trim() || undefined,
      helpfulCount: 0,
    });
    setNewComment('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 bg-black/80 backdrop-blur-xs animate-in fade-in duration-200 overflow-y-auto">
      <div className="relative w-full max-w-5xl bg-neutral-900 rounded-3xl shadow-2xl border border-neutral-800 overflow-hidden my-auto max-h-[92vh] flex flex-col text-neutral-200">
        {/* Header with Close */}
        <div className="px-6 py-4 border-b border-neutral-800 flex items-center justify-between bg-neutral-950 shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-neutral-400 uppercase">
              SKU: {product.sku}
            </span>
            <span className="text-neutral-700">•</span>
            <span className="text-xs font-bold text-amber-400 capitalize">
              {product.category}
            </span>
          </div>

          <button
            id="close-product-detail-btn"
            onClick={() => setSelectedProductDetail(null)}
            className="p-2 text-neutral-400 hover:text-white rounded-xl hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Content */}
        <div className="overflow-y-auto p-6 space-y-8 flex-1">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left: Gallery Images (5 cols) */}
            <div className="lg:col-span-5 space-y-3">
              <div className="relative aspect-[4/3] rounded-2xl bg-neutral-950 overflow-hidden border border-neutral-800 shadow-sm">
                <img
                  src={product.images[selectedImageIdx] || product.images[0]}
                  alt={product.name}
                  className="w-full h-full object-cover object-center"
                  referrerPolicy="no-referrer"
                />
                {discountPercent > 0 && (
                  <span className="absolute top-3 left-3 bg-amber-500 text-neutral-950 text-xs font-black px-2.5 py-1 rounded-lg shadow-sm">
                    SAVE {discountPercent}%
                  </span>
                )}
              </div>

              {/* Thumbnails */}
              {product.images.length > 1 && (
                <div className="flex items-center gap-2.5">
                  {product.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImageIdx(idx)}
                      className={`relative w-16 h-16 rounded-xl overflow-hidden border-2 transition-all ${
                        selectedImageIdx === idx
                          ? 'border-amber-500 ring-2 ring-amber-500/20'
                          : 'border-neutral-800 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    </button>
                  ))}
                </div>
              )}

              {/* Fitment Banner */}
              <div
                className={`p-4 rounded-2xl border flex items-start gap-3 ${
                  isCompatible
                    ? 'bg-emerald-950/40 border-emerald-800 text-emerald-300'
                    : 'bg-neutral-800/80 border-neutral-700 text-neutral-200'
                }`}
              >
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                    isCompatible ? 'bg-emerald-600 text-white' : 'bg-neutral-700 text-neutral-300'
                  }`}
                >
                  <Car className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-xs">
                    {activeVehicle
                      ? isCompatible
                        ? `Guaranteed Fit for your ${activeVehicle.year} ${activeVehicle.make} ${activeVehicle.model}`
                        : `May require universal adapter for ${activeVehicle.make} ${activeVehicle.model}`
                      : product.compatibility.universal
                      ? 'Universal 100% Fitment (All Vehicles)'
                      : 'Vehicle-Specific Direct OEM Replacement'}
                  </div>
                  <div className="text-[11px] opacity-80 mt-0.5">
                    Tested for plug-and-play installation without cutting OEM harnesses or dashboard drilling.
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Product Details & Purchase Form (7 cols) */}
            <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                    {product.brand}
                  </span>
                  <span className="text-neutral-700">•</span>
                  <div className="flex items-center text-amber-400">
                    <Star className="w-4 h-4 fill-current" />
                  </div>
                  <span className="text-xs font-bold text-white">
                    {product.rating} / 5.0
                  </span>
                  <span className="text-xs text-neutral-400">
                    ({product.reviewsCount} verified reviews)
                  </span>
                </div>

                <h1 className="text-xl sm:text-2xl font-black text-white font-display leading-tight">
                  {product.name}
                </h1>

                <p className="text-xs sm:text-sm text-neutral-300 mt-3 leading-relaxed">
                  {product.shortDesc}
                </p>

                {/* Price Display */}
                <div className="mt-4 p-4 rounded-2xl bg-neutral-800/60 border border-neutral-700/60 flex items-center justify-between">
                  <div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl sm:text-3xl font-black text-amber-400 font-display">
                        {formatPrice(product.price)}
                      </span>
                      {product.originalPrice && (
                        <span className="text-sm text-neutral-500 line-through">
                          {formatPrice(product.originalPrice)}
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-emerald-400 font-semibold mt-0.5">
                      {product.stock > 0
                        ? `✓ In Stock (${product.stock} units ready in warehouse)`
                        : 'Out of Stock'}
                    </div>
                  </div>

                  <div className="text-right text-xs text-neutral-400">
                    <div>{t('warrantyBadge', { years: product.warrantyYears })}</div>
                    <div className="font-semibold text-neutral-300">
                      Difficulty: {product.installationDifficulty}
                    </div>
                  </div>
                </div>

                {/* Quantity & CTA buttons */}
                <div className="mt-6 space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center border border-neutral-700 rounded-xl bg-neutral-800 p-1">
                      <button
                        onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                        className="p-1.5 rounded-lg hover:bg-neutral-700 text-neutral-300"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="w-10 text-center font-bold text-xs text-white">
                        {quantity}
                      </span>
                      <button
                        onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                        className="p-1.5 rounded-lg hover:bg-neutral-700 text-neutral-300"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <button
                      id="modal-add-to-cart-btn"
                      onClick={handleAddToCart}
                      disabled={product.stock <= 0}
                      className="flex-1 py-3 px-5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white font-bold text-xs sm:text-sm border border-neutral-700 shadow-sm flex items-center justify-center gap-2 transition-colors active:scale-98"
                    >
                      <ShoppingCart className="w-4 h-4" />
                      <span>{t('addToCart')}</span>
                    </button>

                    <button
                      id="modal-buy-now-btn"
                      onClick={handleBuyNow}
                      disabled={product.stock <= 0}
                      className="py-3 px-6 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-black text-xs sm:text-sm shadow-md shadow-amber-500/20 flex items-center justify-center gap-1.5 transition-transform active:scale-98"
                    >
                      <Zap className="w-4 h-4 fill-current" />
                      <span>{t('buyNow')}</span>
                    </button>
                  </div>
                </div>

                {/* Trust Highlights */}
                <div className="grid grid-cols-3 gap-2 mt-6 pt-5 border-t border-neutral-800 text-[11px] text-neutral-400">
                  <div className="flex items-center gap-1.5">
                    <Truck className="w-4 h-4 text-neutral-400" />
                    <span>Free Shipping &gt;$50</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>COD & Card Accepted</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <RotateCcw className="w-4 h-4 text-amber-400" />
                    <span>30-Day Money Back</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Tab Navigation: Overview, Specs, Fitment Tool, Reviews */}
          <div className="border-t border-neutral-800 pt-6">
            <div className="flex items-center gap-2 border-b border-neutral-800 pb-3 overflow-x-auto no-scrollbar">
              {[
                { id: 'overview', label: 'Key Features & Overview' },
                { id: 'specs', label: 'Technical Specifications' },
                { id: 'fitment', label: 'Vehicle Fitment Checker' },
                { id: 'reviews', label: `Customer Reviews (${productReviews.length})` },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'bg-amber-500 text-neutral-950 font-black shadow-xs'
                      : 'text-neutral-400 hover:bg-neutral-800 hover:text-white'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab 1: Overview */}
            {activeTab === 'overview' && (
              <div className="py-5 space-y-4 text-xs sm:text-sm text-neutral-300">
                <p className="leading-relaxed">{product.description}</p>
                <div className="pt-2">
                  <h4 className="font-bold text-xs uppercase tracking-wider text-white mb-3">
                    Engineered Highlights & Performance:
                  </h4>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                    {product.features.map((feat, idx) => (
                      <li
                        key={idx}
                        className="flex items-start gap-2 p-2.5 rounded-xl bg-neutral-800/60 border border-neutral-800"
                      >
                        <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span className="text-xs text-neutral-200">{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* Tab 2: Technical Specifications */}
            {activeTab === 'specs' && (
              <div className="py-5">
                <div className="max-w-2xl divide-y divide-neutral-800 rounded-2xl border border-neutral-800 overflow-hidden">
                  {product.specs.map((spec, idx) => (
                    <div
                      key={idx}
                      className={`grid grid-cols-3 p-3.5 text-xs ${
                        idx % 2 === 0 ? 'bg-neutral-800/40' : 'bg-neutral-900'
                      }`}
                    >
                      <div className="font-bold text-neutral-400">{spec.name}</div>
                      <div className="col-span-2 font-semibold text-white">
                        {spec.value}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tab 3: Fitment Checker */}
            {activeTab === 'fitment' && (
              <div className="py-5 max-w-xl space-y-4">
                <div className="p-4 rounded-2xl bg-neutral-800/50 border border-neutral-700">
                  <h4 className="font-bold text-sm text-white mb-1">
                    Check Compatibility with Any Vehicle
                  </h4>
                  <p className="text-xs text-neutral-400 mb-4">
                    Select your vehicle make and model to verify pinouts, bracket sizing, and dimensions.
                  </p>

                  <form onSubmit={handleRunFitmentCheck} className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-neutral-400 mb-1">
                          Make
                        </label>
                        <select
                          value={checkMake}
                          onChange={(e) => {
                            setCheckMake(e.target.value);
                            setFitmentChecked(null);
                          }}
                          className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-700 bg-neutral-800 text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                        >
                          {VEHICLE_MAKES.map((mk) => (
                            <option key={mk} value={mk}>
                              {mk}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-neutral-400 mb-1">
                          Model
                        </label>
                        <select
                          value={checkModel}
                          onChange={(e) => {
                            setCheckModel(e.target.value);
                            setFitmentChecked(null);
                          }}
                          className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-700 bg-neutral-800 text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                        >
                          {(VEHICLE_MODELS[checkMake] || ['Standard']).map((mdl) => (
                            <option key={mdl} value={mdl}>
                              {mdl}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-black text-xs flex items-center justify-center gap-1.5 transition-transform active:scale-98"
                    >
                      <Wrench className="w-3.5 h-3.5" />
                      Verify Compatibility
                    </button>
                  </form>

                  {fitmentChecked !== null && (
                    <div
                      className={`mt-4 p-3 rounded-xl border text-xs font-semibold flex items-center gap-2 ${
                        fitmentChecked
                          ? 'bg-emerald-950/40 border-emerald-800 text-emerald-300'
                          : 'bg-amber-950/40 border-amber-800 text-amber-300'
                      }`}
                    >
                      {fitmentChecked ? (
                        <>
                          <Check className="w-4 h-4 text-emerald-400" />
                          <span>100% Guaranteed Direct Fit for {checkMake} {checkModel}</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4 text-amber-400" />
                          <span>Universal fit with standard installation brackets included.</span>
                        </>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Tab 4: Verified Customer Reviews */}
            {activeTab === 'reviews' && (
              <div className="py-5 space-y-6">
                {/* Review Form */}
                <div className="p-4 rounded-2xl bg-neutral-800/50 border border-neutral-700">
                  <h4 className="font-bold text-sm text-white mb-2">
                    {t('writeReview')}
                  </h4>
                  <form onSubmit={handleReviewSubmit} className="space-y-3">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setNewRating(star)}
                            className="p-1"
                          >
                            <Star
                              className={`w-5 h-5 ${
                                star <= newRating
                                  ? 'text-amber-400 fill-current'
                                  : 'text-neutral-600'
                              }`}
                            />
                          </button>
                        ))}
                      </div>

                      <input
                        type="text"
                        value={newVehicleModel}
                        onChange={(e) => setNewVehicleModel(e.target.value)}
                        placeholder="Your Vehicle (e.g. 2024 Honda Civic)"
                        className="flex-1 px-3 py-1.5 text-xs rounded-xl border border-neutral-700 bg-neutral-800 text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                      />
                    </div>

                    <textarea
                      rows={3}
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Share your experience (clarity, installation, durability, fitment)..."
                      className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-700 bg-neutral-800 text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />

                    <button
                      type="submit"
                      className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-black text-xs shadow-sm transition-transform active:scale-98"
                    >
                      Publish Review
                    </button>
                  </form>
                </div>

                {/* Reviews List */}
                <div className="space-y-4">
                  {productReviews.length === 0 ? (
                    <div className="p-6 text-center text-xs text-neutral-400">
                      No customer reviews yet. Be the first to review!
                    </div>
                  ) : (
                    productReviews.map((rev) => (
                      <div
                        key={rev.id}
                        className="p-4 rounded-2xl border border-neutral-800 bg-neutral-900 space-y-2 shadow-xs"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2.5">
                            <img
                              src={rev.userAvatar}
                              alt=""
                              className="w-8 h-8 rounded-full object-cover border border-neutral-700"
                              referrerPolicy="no-referrer"
                            />
                            <div>
                              <div className="flex items-center gap-1.5">
                                <span className="font-bold text-xs text-white">
                                  {rev.userName}
                                </span>
                                {rev.verifiedPurchase && (
                                  <span className="bg-emerald-950 text-emerald-300 border border-emerald-800 text-[10px] font-bold px-1.5 py-0.2 rounded">
                                    ✓ Verified Buyer
                                  </span>
                                )}
                              </div>
                              {rev.vehicleModel && (
                                <div className="text-[10px] text-neutral-400">
                                  Installed on: <strong>{rev.vehicleModel}</strong>
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center gap-1 text-amber-400">
                            {Array.from({ length: rev.rating }).map((_, i) => (
                              <Star key={i} className="w-3.5 h-3.5 fill-current" />
                            ))}
                          </div>
                        </div>

                        <p className="text-xs text-neutral-300 leading-relaxed pt-1">
                          {rev.comment}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
