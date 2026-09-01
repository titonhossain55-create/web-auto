import React from 'react';
import {
  X,
  Package,
  Truck,
  CheckCircle2,
  Clock,
  ChevronRight,
  Receipt,
  FileText,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Order } from '../types';

export const MyOrdersModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose,
}) => {
  const { orders, setActiveTrackingOrder, formatPrice, t } = useApp();

  if (!isOpen) return null;

  const handleTrack = (order: Order) => {
    onClose();
    setActiveTrackingOrder(order);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-3xl bg-neutral-900 rounded-3xl shadow-2xl border border-neutral-800 overflow-hidden max-h-[85vh] flex flex-col text-neutral-200">
        {/* Header */}
        <div className="p-6 border-b border-neutral-800 flex items-center justify-between bg-neutral-950">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white font-display">
                {t('myOrders')}
              </h3>
              <p className="text-xs text-neutral-400">
                Track live package dispatches and past purchase history
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-neutral-400 hover:text-white rounded-xl hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          {orders.length === 0 ? (
            <div className="py-12 text-center text-xs text-neutral-400 space-y-2">
              <Package className="w-8 h-8 mx-auto text-neutral-600" />
              <p>You have not placed any orders yet.</p>
            </div>
          ) : (
            orders.map((ord) => (
              <div
                key={ord.id}
                className="p-5 rounded-2xl border border-neutral-800 bg-neutral-950 space-y-4 shadow-xs"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-neutral-850 pb-3">
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
                    <div className="text-xs text-neutral-400 mt-0.5">
                      Placed on {new Date(ord.createdAt).toLocaleDateString()} • {ord.paymentMethod.toUpperCase()}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-base font-black text-amber-400 font-display">
                      {formatPrice(ord.total)}
                    </span>
                    <button
                      onClick={() => handleTrack(ord)}
                      className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-black text-xs shadow-md shadow-amber-500/20 flex items-center gap-1.5 transition-transform active:scale-98"
                    >
                      <Truck className="w-3.5 h-3.5" />
                      <span>{t('trackOrder')}</span>
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {ord.items.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center gap-3 text-xs"
                    >
                      <img
                        src={item.product.images[0]}
                        alt=""
                        className="w-10 h-10 rounded-lg object-cover bg-neutral-800 shrink-0 border border-neutral-700"
                        referrerPolicy="no-referrer"
                      />
                      <div className="truncate">
                        <div className="font-bold text-white truncate">
                          {item.product.name}
                        </div>
                        <div className="text-[10px] text-neutral-400">
                          Qty: {item.quantity} • {formatPrice(item.product.price)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
