import React from 'react';
import { Car, ShieldCheck, Zap, Truck, RotateCcw, ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const HeroBanner: React.FC<{ onExploreClick: () => void }> = ({ onExploreClick }) => {
  const { t, activeVehicle, setIsVehicleModalOpen, formatPrice } = useApp();

  return (
    <div className="relative overflow-hidden rounded-3xl bg-neutral-900 text-white mb-8 shadow-2xl border border-neutral-800">
      {/* Background Graphic & Car Lighting Elements */}
      <div className="absolute inset-0 bg-gradient-to-r from-neutral-950 via-neutral-900/95 to-neutral-950/80 z-10" />
      <img
        src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1600&q=80"
        alt="High performance car cockpit"
        className="absolute inset-0 w-full h-full object-cover object-center opacity-25 mix-blend-luminosity scale-105 transform hover:scale-100 transition-transform duration-1000"
      />

      <div className="relative z-20 px-6 py-10 sm:px-10 sm:py-14 max-w-4xl">
        {/* Active Vehicle Fitment Ribbon */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold mb-4 backdrop-blur-md">
          <Sparkles className="w-3.5 h-3.5" />
          {activeVehicle ? (
            <span>
              Configured for: <strong className="text-white">{activeVehicle.year} {activeVehicle.make} {activeVehicle.model}</strong>
            </span>
          ) : (
            <span>Guaranteed Fitment Engine • 100% Tested Car Accessories</span>
          )}
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white font-display leading-[1.1] mb-4">
          Upgrade Your Cockpit. <br />
          <span className="bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-500 bg-clip-text text-transparent">
            Precision Performance & Luxury.
          </span>
        </h1>

        <p className="text-sm sm:text-base text-neutral-300 max-w-2xl leading-relaxed mb-6 font-normal">
          Direct OEM fit 4K Dash Cams, Ambient RGB Lighting, Laser Floor Mats, Fast Wireless MagSafe Chargers, and Smart Diagnostic OBD2 Scanners with instant dispatch.
        </p>

        {/* Action CTAs */}
        <div className="flex flex-wrap items-center gap-3.5 mb-8">
          <button
            id="hero-explore-btn"
            onClick={onExploreClick}
            className="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-black text-xs sm:text-sm shadow-xl shadow-amber-500/20 flex items-center gap-2 transition-all hover:scale-105 active:scale-95"
          >
            <span>{t('startShopping')}</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            id="hero-select-vehicle-btn"
            onClick={() => setIsVehicleModalOpen(true)}
            className="px-5 py-3 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 hover:text-white font-bold text-xs sm:text-sm border border-neutral-700 flex items-center gap-2 transition-all"
          >
            <Car className="w-4 h-4 text-amber-400" />
            <span>{activeVehicle ? 'Change Vehicle' : t('selectVehicle')}</span>
          </button>
        </div>

        {/* Trust Badges */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 border-t border-neutral-800 text-xs text-neutral-300">
          <div className="flex items-center gap-2">
            <Truck className="w-4 h-4 text-amber-400 shrink-0" />
            <div>
              <div className="font-bold text-white">Free Fast Shipping</div>
              <div className="text-[11px] text-neutral-400">On all orders over ₹999</div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-green-400 shrink-0" />
            <div>
              <div className="font-bold text-white">UPI, COD & Cards</div>
              <div className="text-[11px] text-neutral-400">256-Bit SSL Protected</div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <RotateCcw className="w-4 h-4 text-amber-400 shrink-0" />
            <div>
              <div className="font-bold text-white">30-Day Returns</div>
              <div className="text-[11px] text-neutral-400">Hassle-free guarantee</div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
            <div>
              <div className="font-bold text-white">Guaranteed Fit</div>
              <div className="text-[11px] text-neutral-400">Laser-verified parts</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
