import React from 'react';
import { ShoppingCart, Star, Check, Sparkles, AlertCircle, Wrench, Shield, Eye } from 'lucide-react';
import { Product } from '../types';
import { useApp } from '../context/AppContext';

export const ProductCard: React.FC<{ product: Product }> = ({ product }) => {
  const {
    t,
    formatPrice,
    addToCart,
    isProductCompatible,
    activeVehicle,
    setSelectedProductDetail,
    setIsCartDrawerOpen,
  } = useApp();

  const isCompatible = isProductCompatible(product);
  const discountPercent = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product, 1);
    setIsCartDrawerOpen(true);
  };

  return (
    <div
      id={`product-card-${product.id}`}
      onClick={() => setSelectedProductDetail(product)}
      className="group relative bg-neutral-900 rounded-2xl border border-neutral-800 hover:border-amber-500/60 shadow-md hover:shadow-2xl hover:shadow-amber-500/5 transition-all duration-300 flex flex-col overflow-hidden cursor-pointer"
    >
      {/* Image Container */}
      <div className="relative aspect-[4/3] bg-neutral-950 overflow-hidden">
        <img
          src={product.images[0]}
          alt={product.name}
          className="w-full h-full object-cover object-center group-hover:scale-108 transition-transform duration-500 opacity-95 group-hover:opacity-100"
          loading="lazy"
          referrerPolicy="no-referrer"
        />

        {/* Badges Overlay */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5 z-10">
          {discountPercent > 0 && (
            <span className="bg-amber-500 text-neutral-950 text-[11px] font-black px-2 py-0.5 rounded-md shadow-md">
              -{discountPercent}% OFF
            </span>
          )}
          {product.isBestSeller && (
            <span className="bg-neutral-950/90 border border-amber-500/40 text-amber-400 text-[10px] font-extrabold px-2 py-0.5 rounded-md shadow-sm uppercase tracking-wider backdrop-blur-xs">
              ★ Best Seller
            </span>
          )}
        </div>

        {/* Quick View Hover Icon */}
        <div className="absolute inset-0 bg-neutral-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none backdrop-blur-[2px]">
          <span className="bg-neutral-900/90 text-white border border-neutral-700 px-3 py-1.5 rounded-xl font-bold text-xs shadow-lg flex items-center gap-1.5 backdrop-blur-md">
            <Eye className="w-3.5 h-3.5 text-amber-400" />
            Quick View
          </span>
        </div>

        {/* Stock Level Warning Badge */}
        {product.stock <= 5 && product.stock > 0 && (
          <div className="absolute bottom-2 left-2 bg-neutral-950/90 border border-amber-500/30 backdrop-blur-xs text-amber-300 text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1">
            <AlertCircle className="w-3 h-3 text-amber-400" />
            {t('onlyLeft', { count: product.stock })}
          </div>
        )}
        {product.stock === 0 && (
          <div className="absolute inset-0 bg-neutral-950/85 backdrop-blur-xs flex items-center justify-center">
            <span className="bg-neutral-800 border border-neutral-700 text-neutral-300 font-bold text-xs uppercase px-3 py-1 rounded-lg">
              {t('outOfStock')}
            </span>
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Compatibility Status Pill */}
          <div className="mb-2">
            {activeVehicle ? (
              isCompatible ? (
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded-md border border-emerald-800/80">
                  <Check className="w-3 h-3 text-emerald-400" />
                  {t('fitsVehicle')}
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-neutral-400 bg-neutral-800 px-2 py-0.5 rounded-md border border-neutral-700">
                  Universal / Other models
                </span>
              )
            ) : product.compatibility.universal ? (
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-neutral-300 bg-neutral-800 px-2 py-0.5 rounded-md border border-neutral-700/80">
                {t('universalFit')}
              </span>
            ) : (
              <span className="text-[11px] font-medium text-neutral-400 capitalize">
                {product.brand}
              </span>
            )}
          </div>

          {/* Product Title */}
          <h3 className="font-bold text-sm sm:text-base text-white leading-snug line-clamp-2 group-hover:text-amber-400 transition-colors">
            {product.name}
          </h3>

          {/* Ratings & Reviews */}
          <div className="flex items-center gap-1.5 mt-2">
            <div className="flex items-center text-amber-400">
              <Star className="w-3.5 h-3.5 fill-current" />
            </div>
            <span className="text-xs font-bold text-white">
              {product.rating}
            </span>
            <span className="text-xs text-neutral-400">
              ({product.reviewsCount})
            </span>
            <span className="text-neutral-700">•</span>
            <span className="text-[11px] text-neutral-400 font-medium">
              {product.installationDifficulty.split(' ')[0]}
            </span>
          </div>
        </div>

        {/* Pricing & Add to Cart */}
        <div className="mt-4 pt-3 border-t border-neutral-800 flex items-center justify-between gap-2">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-lg sm:text-xl font-black text-amber-400 font-display tracking-tight">
                {formatPrice(product.price)}
              </span>
              {product.originalPrice && (
                <span className="text-xs text-neutral-500 line-through">
                  {formatPrice(product.originalPrice)}
                </span>
              )}
            </div>
            <div className="text-[10px] text-emerald-400 font-semibold">
              {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
            </div>
          </div>

          <button
            id={`quick-add-${product.id}`}
            onClick={handleQuickAdd}
            disabled={product.stock <= 0}
            className={`p-2.5 rounded-xl flex items-center justify-center transition-all ${
              product.stock > 0
                ? 'bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold shadow-md shadow-amber-500/20 active:scale-95'
                : 'bg-neutral-800 text-neutral-600 cursor-not-allowed border border-neutral-700'
            }`}
            title="Add to Shopping Cart"
          >
            <ShoppingCart className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
