import React, { useState } from 'react';
import {
  X,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ShoppingCart,
  Sparkles,
  Tag,
  ShieldCheck,
  Truck,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const CartDrawer: React.FC = () => {
  const {
    isCartDrawerOpen,
    setIsCartDrawerOpen,
    cart,
    removeFromCart,
    updateCartQuantity,
    cartSubtotal,
    cartTotal,
    discountAmount,
    couponCode,
    applyCoupon,
    t,
    formatPrice,
    setIsCheckoutModalOpen,
  } = useApp();

  const [inputCoupon, setInputCoupon] = useState('');
  const [couponMsg, setCouponMsg] = useState<{ success: boolean; message: string } | null>(null);

  if (!isCartDrawerOpen) return null;

  const freeShippingThreshold = 50.0;
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - cartSubtotal);
  const freeShippingProgress = Math.min(100, (cartSubtotal / freeShippingThreshold) * 100);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputCoupon.trim()) return;
    const res = applyCoupon(inputCoupon);
    setCouponMsg(res);
    if (res.success) {
      setInputCoupon('');
    }
  };

  const handleProceedCheckout = () => {
    setIsCartDrawerOpen(false);
    setIsCheckoutModalOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="absolute inset-0" onClick={() => setIsCartDrawerOpen(false)} />

      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-neutral-900 shadow-2xl border-l border-neutral-800 flex flex-col text-neutral-200">
          {/* Header */}
          <div className="p-5 border-b border-neutral-800 flex items-center justify-between bg-neutral-950">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center border border-amber-500/20">
                <ShoppingCart className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-base text-white font-display">
                  {t('cartTitle')}
                </h3>
                <p className="text-xs text-neutral-400">
                  {cart.length} unique accessories
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsCartDrawerOpen(false)}
              className="p-2 text-neutral-400 hover:text-white rounded-xl hover:bg-neutral-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress Bar */}
          <div className="p-4 bg-neutral-950/60 border-b border-neutral-800 text-xs">
            <div className="flex items-center justify-between mb-1.5 font-semibold text-neutral-200">
              <span className="flex items-center gap-1.5 text-amber-400">
                <Truck className="w-3.5 h-3.5" />
                {remainingForFreeShipping > 0
                  ? `Add ${formatPrice(remainingForFreeShipping)} more for FREE Fast Shipping`
                  : '🎉 You qualified for FREE Fast Shipping!'}
              </span>
              <span className="text-neutral-400">{Math.round(freeShippingProgress)}%</span>
            </div>
            <div className="w-full h-1.5 bg-neutral-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-amber-500 transition-all duration-500 rounded-full"
                style={{ width: `${freeShippingProgress}%` }}
              />
            </div>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3">
                <div className="w-16 h-16 rounded-full bg-neutral-800 flex items-center justify-center text-neutral-400">
                  <ShoppingCart className="w-8 h-8" />
                </div>
                <h4 className="font-bold text-base text-white">
                  {t('cartEmpty')}
                </h4>
                <p className="text-xs text-neutral-400 max-w-xs">
                  Your cart is currently empty. Explore our 4K Dashcams, Ambient LED kits, and custom accessories!
                </p>
                <button
                  onClick={() => setIsCartDrawerOpen(false)}
                  className="mt-2 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-black text-xs shadow-md shadow-amber-500/20"
                >
                  {t('startShopping')}
                </button>
              </div>
            ) : (
              cart.map((item) => (
                <div
                  key={item.product.id}
                  className="p-3 rounded-2xl border border-neutral-800 bg-neutral-950/60 flex gap-3 shadow-sm hover:border-neutral-700 transition-colors"
                >
                  <img
                    src={item.product.images[0]}
                    alt={item.product.name}
                    className="w-18 h-18 rounded-xl object-cover bg-neutral-900 shrink-0 border border-neutral-800"
                    referrerPolicy="no-referrer"
                  />

                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-1">
                        <h4 className="font-bold text-xs text-white line-clamp-2 leading-snug">
                          {item.product.name}
                        </h4>
                        <button
                          onClick={() => removeFromCart(item.product.id)}
                          className="text-neutral-500 hover:text-red-400 p-1 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <div className="text-[10px] text-neutral-500 mt-0.5">
                        SKU: {item.product.sku}
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center border border-neutral-800 rounded-lg bg-neutral-900 p-0.5">
                        <button
                          onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)}
                          className="p-1 text-neutral-400 hover:bg-neutral-800 hover:text-white rounded"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-7 text-center font-bold text-xs text-white">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)}
                          className="p-1 text-neutral-400 hover:bg-neutral-800 hover:text-white rounded"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <div className="font-black text-sm text-white font-display">
                        {formatPrice(item.product.price * item.quantity)}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer & Checkout Action */}
          {cart.length > 0 && (
            <div className="p-5 border-t border-neutral-800 bg-neutral-950 space-y-4">
              {/* Coupon Form */}
              <form onSubmit={handleApplyCoupon} className="flex gap-2">
                <div className="relative flex-1">
                  <Tag className="w-3.5 h-3.5 text-neutral-500 absolute left-3 top-3 pointer-events-none" />
                  <input
                    type="text"
                    value={inputCoupon}
                    onChange={(e) => setInputCoupon(e.target.value)}
                    placeholder="Coupon (e.g. APEXSPEED)"
                    className="w-full pl-8 pr-3 py-2 text-xs font-semibold rounded-xl border border-neutral-800 bg-neutral-900 text-white focus:outline-none focus:ring-2 focus:ring-amber-500 uppercase"
                  />
                </div>
                <button
                  type="submit"
                  className="px-4 py-2 bg-neutral-800 text-white rounded-xl font-bold text-xs hover:bg-neutral-700 border border-neutral-700"
                >
                  Apply
                </button>
              </form>

              {couponMsg && (
                <div
                  className={`text-[11px] font-semibold px-2.5 py-1 rounded-lg ${
                    couponMsg.success
                      ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-800'
                      : 'bg-red-950/80 text-red-300 border border-red-800'
                  }`}
                >
                  {couponMsg.message}
                </div>
              )}

              {/* Cost Summary Breakdown */}
              <div className="space-y-1.5 text-xs text-neutral-400">
                <div className="flex justify-between">
                  <span>{t('subtotal')}</span>
                  <span className="font-semibold text-white">
                    {formatPrice(cartSubtotal)}
                  </span>
                </div>

                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-400 font-semibold">
                    <span>Discount ({couponCode})</span>
                    <span>-{formatPrice(discountAmount)}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>{t('shipping')}</span>
                  <span className="font-semibold text-white">
                    {remainingForFreeShipping === 0 ? (
                      <strong className="text-emerald-400 uppercase">
                        {t('free')}
                      </strong>
                    ) : (
                      formatPrice(9.99)
                    )}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span>{t('tax')}</span>
                  <span className="font-semibold text-white">
                    {formatPrice((cartSubtotal - discountAmount) * 0.08)}
                  </span>
                </div>

                <div className="border-t border-neutral-800 pt-2 flex justify-between text-sm font-black text-white">
                  <span>{t('total')}</span>
                  <span className="text-base text-amber-400 font-display">
                    {formatPrice(cartTotal)}
                  </span>
                </div>
              </div>

              {/* Checkout Button */}
              <button
                id="cart-proceed-checkout-btn"
                onClick={handleProceedCheckout}
                className="w-full py-3.5 px-5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-black text-sm shadow-xl shadow-amber-500/20 flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-98"
              >
                <span>{t('checkout')}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="flex items-center justify-center gap-2 text-[10px] text-neutral-500">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                <span>256-Bit SSL Encrypted • COD or Credit Card</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
