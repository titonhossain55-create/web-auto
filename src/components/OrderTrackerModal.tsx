import React, { useState, useEffect } from 'react';
import {
  X,
  Package,
  Truck,
  CheckCircle2,
  Clock,
  Phone,
  Navigation,
  MapPin,
  Shield,
  Car,
  AlertCircle,
  Play,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { OrderStatusType } from '../types';

export const OrderTrackerModal: React.FC = () => {
  const {
    activeTrackingOrder,
    setActiveTrackingOrder,
    updateOrderStatus,
    t,
    formatPrice,
    orders,
  } = useApp();

  const [etaSeconds, setEtaSeconds] = useState(18 * 60);

  // Sync with current version in orders state
  const currentOrder = orders.find((o) => o.id === activeTrackingOrder?.id) || activeTrackingOrder;

  // Countdown timer simulation for live ETA
  useEffect(() => {
    if (!currentOrder || currentOrder.status === 'delivered') return;
    const interval = setInterval(() => {
      setEtaSeconds((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [currentOrder]);

  if (!currentOrder) return null;

  const formatEta = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs < 10 ? '0' : ''}${secs}s`;
  };

  const statusOrderList: OrderStatusType[] = [
    'placed',
    'confirmed',
    'processing',
    'dispatched',
    'out_for_delivery',
    'delivered',
  ];

  const currentStatusIdx = statusOrderList.indexOf(currentOrder.status);

  const handleSimulateNextStep = () => {
    if (currentStatusIdx < statusOrderList.length - 1) {
      const nextStatus = statusOrderList[currentStatusIdx + 1];
      updateOrderStatus(currentOrder.id, nextStatus);
    }
  };

  const handleResetOrder = () => {
    updateOrderStatus(currentOrder.id, 'placed');
    setEtaSeconds(25 * 60);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 bg-black/80 backdrop-blur-xs animate-in fade-in duration-200 overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-neutral-900 rounded-3xl shadow-2xl border border-neutral-800 overflow-hidden my-auto max-h-[92vh] flex flex-col text-neutral-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-neutral-800 flex items-center justify-between bg-neutral-950 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold text-white font-display">
                  {t('orderTrackingTitle')}
                </h3>
                <span className="bg-amber-950 text-amber-400 border border-amber-800 text-[11px] font-mono font-bold px-2 py-0.5 rounded-full">
                  #{currentOrder.orderNumber}
                </span>
              </div>
              <p className="text-xs text-neutral-400">
                Carrier: FedEx Ground • Tracking #{currentOrder.trackingNumber}
              </p>
            </div>
          </div>

          <button
            onClick={() => setActiveTrackingOrder(null)}
            className="p-2 text-neutral-400 hover:text-white rounded-xl hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Live Delivery Status Ribbon & ETA */}
          <div className="p-5 rounded-2xl bg-neutral-950 text-white shadow-lg border border-neutral-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="text-[11px] uppercase tracking-wider text-amber-400 font-bold mb-1 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
                {t('liveStatus')}
              </div>
              <div className="text-xl sm:text-2xl font-black font-display capitalize">
                {currentOrder.status.replace(/_/g, ' ')}
              </div>
              <div className="text-xs text-neutral-400 mt-1">
                {currentOrder.status === 'delivered'
                  ? '✓ Package safely delivered & signed at doorstep'
                  : `Driver ${currentOrder.driver?.name || 'James'} is en route to ${currentOrder.customer.city}`}
              </div>
            </div>

            {currentOrder.status !== 'delivered' && (
              <div className="bg-neutral-900 px-4 py-3 rounded-2xl border border-neutral-800 text-right shrink-0">
                <div className="text-[10px] uppercase font-bold text-neutral-400">
                  {t('estimatedEta')}
                </div>
                <div className="text-xl font-mono font-black text-amber-400">
                  {formatEta(etaSeconds)}
                </div>
                <div className="text-[10px] text-neutral-500">Live Traffic Calculated</div>
              </div>
            )}
          </div>

          {/* Simulated Interactive GPS Map */}
          <div className="relative h-60 rounded-3xl overflow-hidden bg-neutral-950 border border-neutral-800 shadow-inner flex items-center justify-center">
            {/* Map Grid Background Simulation */}
            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px]" />

            {/* Road lines simulation */}
            <svg className="absolute inset-0 w-full h-full stroke-neutral-700/60" strokeWidth="3" fill="none">
              <path d="M 50 180 Q 200 40 400 120 T 750 80" strokeDasharray="6 6" />
              <path d="M 120 220 C 300 180 500 240 700 150" strokeWidth="2" stroke="rgba(245, 158, 11, 0.4)" />
            </svg>

            {/* Destination Marker */}
            <div className="absolute top-12 right-16 sm:right-24 flex flex-col items-center">
              <div className="w-9 h-9 rounded-2xl bg-emerald-500 text-neutral-950 font-bold flex items-center justify-center shadow-lg shadow-emerald-500/40">
                <MapPin className="w-5 h-5 text-neutral-950" />
              </div>
              <span className="bg-neutral-900 border border-neutral-700 text-white text-[10px] font-bold px-2 py-0.5 rounded-md mt-1 backdrop-blur-xs">
                Your House ({currentOrder.customer.city})
              </span>
            </div>

            {/* Live Courier Vehicle Marker */}
            <div className="absolute top-28 left-24 sm:left-48 flex flex-col items-center animate-bounce duration-1000">
              <div className="w-10 h-10 rounded-2xl bg-amber-500 text-neutral-950 flex items-center justify-center shadow-xl shadow-amber-500/30 ring-4 ring-amber-500/20">
                <Truck className="w-5 h-5 text-neutral-950" />
              </div>
              <span className="bg-amber-500 text-neutral-950 text-[10px] font-black px-2 py-0.5 rounded-md mt-1 shadow-sm">
                Apex Courier • 2.1 mi
              </span>
            </div>

            {/* Simulated Live Compass / GPS HUD */}
            <div className="absolute bottom-3 left-3 bg-neutral-900/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-neutral-700 text-[10px] font-mono text-neutral-300 flex items-center gap-2">
              <Navigation className="w-3 h-3 text-amber-500 animate-spin" />
              <span>GPS: 44.0521° N, 123.0868° W • Speed: 32 MPH</span>
            </div>
          </div>

          {/* Driver Information Card */}
          {currentOrder.driver && (
            <div className="p-4 rounded-2xl bg-neutral-800/60 border border-neutral-700 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <img
                  src={currentOrder.driver.photo}
                  alt={currentOrder.driver.name}
                  className="w-12 h-12 rounded-2xl object-cover ring-2 ring-amber-500/30"
                  referrerPolicy="no-referrer"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-sm text-white">
                      {currentOrder.driver.name}
                    </h4>
                    <span className="bg-amber-950 text-amber-300 border border-amber-800 text-[10px] font-bold px-1.5 py-0.2 rounded">
                      ★ {currentOrder.driver.rating}
                    </span>
                  </div>
                  <div className="text-xs text-neutral-400">
                    Vehicle: {currentOrder.driver.vehicle} ({currentOrder.driver.licensePlate})
                  </div>
                </div>
              </div>

              <a
                href={`tel:${currentOrder.driver.phone}`}
                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-black text-xs flex items-center gap-1.5 shadow-sm transition-transform active:scale-98"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Call Driver</span>
              </a>
            </div>
          )}

          {/* Stepper Timeline */}
          <div className="space-y-4">
            <h4 className="font-bold text-xs uppercase tracking-wider text-neutral-400">
              Shipment Journey & Audit Log
            </h4>

            <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-neutral-800">
              {currentOrder.trackingTimeline.map((step, idx) => (
                <div key={idx} className="relative flex items-start gap-4">
                  <div
                    className={`absolute -left-6 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ring-4 ring-neutral-900 ${
                      step.completed
                        ? 'bg-amber-500 text-neutral-950 font-black'
                        : 'bg-neutral-800 text-neutral-500'
                    }`}
                  >
                    {step.completed ? '✓' : idx + 1}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h5
                        className={`font-bold text-xs ${
                          step.completed
                            ? 'text-white'
                            : 'text-neutral-500'
                        }`}
                      >
                        {step.title}
                      </h5>
                      <span className="text-[11px] font-mono text-neutral-400">
                        {step.timestamp}
                      </span>
                    </div>
                    <p className="text-xs text-neutral-400 mt-0.5">
                      {step.description}
                    </p>
                    <span className="text-[10px] text-neutral-500">
                      📍 {step.location}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Items in Package */}
          <div className="p-4 rounded-2xl bg-neutral-800/40 border border-neutral-800 space-y-3">
            <h4 className="font-bold text-xs uppercase tracking-wider text-neutral-400">
              Accessories in this Shipment ({currentOrder.items.length})
            </h4>

            <div className="divide-y divide-neutral-800">
              {currentOrder.items.map((item, idx) => (
                <div key={idx} className="py-2.5 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <img
                      src={item.product.images[0]}
                      alt=""
                      className="w-10 h-10 rounded-lg object-cover bg-neutral-800 border border-neutral-700"
                      referrerPolicy="no-referrer"
                    />
                    <div>
                      <div className="font-bold text-white">
                        {item.product.name}
                      </div>
                      <div className="text-[10px] text-neutral-400">
                        Qty: {item.quantity} • SKU: {item.product.sku}
                      </div>
                    </div>
                  </div>

                  <div className="font-bold text-amber-400 font-display">
                    {formatPrice(item.product.price * item.quantity)}
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-2 border-t border-neutral-800 flex justify-between font-bold text-xs text-white">
              <span>Paid via {currentOrder.paymentMethod.toUpperCase()}</span>
              <span className="text-amber-400">Total: {formatPrice(currentOrder.total)}</span>
            </div>
          </div>

          {/* Interactive Simulation Helper Controls */}
          <div className="p-4 rounded-2xl bg-neutral-950 border border-dashed border-neutral-800 flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span className="font-semibold text-neutral-300">
                Testing Demo Controls:
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleSimulateNextStep}
                disabled={currentStatusIdx >= statusOrderList.length - 1}
                className="px-3 py-1.5 rounded-xl bg-amber-500 text-neutral-950 font-black hover:bg-amber-400 disabled:opacity-50 flex items-center gap-1 transition-transform active:scale-98"
              >
                <Play className="w-3 h-3 fill-current" />
                <span>Advance Delivery Step</span>
              </button>

              <button
                onClick={handleResetOrder}
                className="p-1.5 rounded-xl text-neutral-400 hover:text-white"
                title="Reset order status to placed"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
