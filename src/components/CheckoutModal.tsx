import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  CreditCard,
  Banknote,
  ShieldCheck,
  Lock,
  Truck,
  CheckCircle2,
  AlertCircle,
  Car,
  ChevronRight,
  ArrowLeft,
  Smartphone,
  Wallet,
  Sparkles,
  MapPin,
  Loader2,
  Check,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useApp } from '../context/AppContext';
import { PaymentMethodType, ShippingAddress } from '../types';
import { lookupPostalCode, POPULAR_PIN_SUGGESTIONS, PostalLookupResult } from '../utils/postalCodeLookup';

export const CheckoutModal: React.FC = () => {
  const {
    isCheckoutModalOpen,
    setIsCheckoutModalOpen,
    cart,
    cartSubtotal,
    cartTotal,
    discountAmount,
    couponCode,
    currentUser,
    activeVehicle,
    createOrder,
    setActiveTrackingOrder,
    t,
    formatPrice,
    isOnline,
  } = useApp();

  const [step, setStep] = useState<'shipping' | 'payment' | 'processing'>('shipping');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodType>('upi');
  const [upiId, setUpiId] = useState('aarav@okhdfcbank');
  const [selectedUpiApp, setSelectedUpiApp] = useState<'gpay' | 'phonepe' | 'paytm' | 'bhim'>('gpay');

  // Shipping Form State
  const [shippingData, setShippingData] = useState<ShippingAddress>(() => {
    const defaultAddr = currentUser.addresses[0] || {
      fullName: currentUser.name || 'Aarav Sharma',
      email: currentUser.email || 'aarav.sharma@example.in',
      phone: currentUser.phone || '+91 98201 54321',
      street: 'Flat 402, Lotus Heights, Linking Road',
      apartment: 'Wing B',
      city: 'Mumbai',
      state: 'Maharashtra',
      zipCode: '400050',
      country: 'India',
      deliveryNotes: 'Leave with society security guard',
    };
    return defaultAddr;
  });

  // Postal Code Autofill State
  const [isLookingUpPostal, setIsLookingUpPostal] = useState(false);
  const [postalAutofillNotice, setPostalAutofillNotice] = useState<PostalLookupResult | null>(null);
  const [postalAutofillHighlight, setPostalAutofillHighlight] = useState(false);
  const lastLookedUpZip = useRef<string>('');

  // Automatically lookup postal code when user enters 5 or 6 alphanumeric characters
  useEffect(() => {
    const cleanZip = shippingData.zipCode.trim().replace(/\s+/g, '');
    if (cleanZip.length < 5) {
      setPostalAutofillNotice(null);
      return;
    }
    if (cleanZip === lastLookedUpZip.current) return;

    let isMounted = true;
    const timer = setTimeout(async () => {
      setIsLookingUpPostal(true);
      try {
        const result = await lookupPostalCode(cleanZip, shippingData.country);
        if (isMounted && result) {
          lastLookedUpZip.current = cleanZip;
          setPostalAutofillNotice(result);
          setShippingData((prev) => ({
            ...prev,
            city: result.city,
            state: result.state,
            country: result.country || prev.country || 'India',
          }));
          setPostalAutofillHighlight(true);
          setTimeout(() => setPostalAutofillHighlight(false), 2500);
        }
      } catch (err) {
        console.error('Postal lookup error:', err);
      } finally {
        if (isMounted) setIsLookingUpPostal(false);
      }
    }, 250);

    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [shippingData.zipCode, shippingData.country]);

  const handleApplyPinPreset = async (pin: string) => {
    setShippingData((prev) => ({ ...prev, zipCode: pin }));
    setIsLookingUpPostal(true);
    const result = await lookupPostalCode(pin);
    setIsLookingUpPostal(false);
    if (result) {
      lastLookedUpZip.current = pin;
      setPostalAutofillNotice(result);
      setShippingData((prev) => ({
        ...prev,
        city: result.city,
        state: result.state,
        country: result.country || 'India',
      }));
      setPostalAutofillHighlight(true);
      setTimeout(() => setPostalAutofillHighlight(false), 2500);
    }
  };

  // Credit Card Form State & Interactive Card Visualizer
  const [cardNumber, setCardNumber] = useState('4532 8900 1234 5678');
  const [cardHolder, setCardHolder] = useState('ALEX VANCE');
  const [cardExpiry, setCardExpiry] = useState('08/29');
  const [cardCvc, setCardCvc] = useState('892');
  const [isCardFlipped, setIsCardFlipped] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [cardError, setCardError] = useState('');

  if (!isCheckoutModalOpen) return null;

  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!shippingData.fullName || !shippingData.street || !shippingData.city || !shippingData.phone) {
      alert('Please fill out all required shipping fields.');
      return;
    }
    setStep('payment');
  };

  const handleFormatCardNumber = (val: string) => {
    const clean = val.replace(/\D/g, '').substring(0, 16);
    const formatted = clean.replace(/(\d{4})(?=\d)/g, '$1 ');
    setCardNumber(formatted);
  };

  const handleFormatExpiry = (val: string) => {
    const clean = val.replace(/\D/g, '').substring(0, 4);
    if (clean.length >= 2) {
      setCardExpiry(`${clean.substring(0, 2)}/${clean.substring(2, 4)}`);
    } else {
      setCardExpiry(clean);
    }
  };

  const handleFinalPlaceOrder = async () => {
    // Basic Luhn validation simulation for card
    if (paymentMethod === 'credit_card') {
      const cleanDigits = cardNumber.replace(/\s/g, '');
      if (cleanDigits.length < 15) {
        setCardError('Please enter a valid 16-digit credit/debit card number.');
        return;
      }
    }

    setIsProcessing(true);
    setStep('processing');

    try {
      // Simulate bank SSL 3D secure authorization
      await new Promise((res) => setTimeout(res, 1400));

      const newOrder = await createOrder(shippingData, paymentMethod, {
        cardNumber: cardNumber.slice(-4),
        cardHolder,
      });

      // Fire victory confetti
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch {
        // Ignored if canvas blocked
      }

      setIsProcessing(false);
      setIsCheckoutModalOpen(false);
      setActiveTrackingOrder(newOrder);
    } catch (err) {
      console.error('Checkout error:', err);
      setIsProcessing(false);
      setStep('payment');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 bg-black/80 backdrop-blur-xs animate-in fade-in duration-200 overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-neutral-900 text-neutral-200 rounded-3xl shadow-2xl border border-neutral-800 overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-neutral-800 flex items-center justify-between bg-neutral-950 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white font-display">
                {t('checkoutTitle')}
              </h3>
              <p className="text-xs text-neutral-400 flex items-center gap-1">
                <Lock className="w-3 h-3 text-emerald-400" />
                256-Bit SSL Encrypted & PCI-DSS Compliant Gateway
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsCheckoutModalOpen(false)}
            className="p-2 text-neutral-400 hover:text-white rounded-xl hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Offline Warning Banner if disconnected */}
        {!isOnline && (
          <div className="px-6 py-2.5 bg-amber-500/15 border-b border-amber-500/30 text-amber-300 text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
            <span>
              {t('offlineNotice')} Your order will be stored offline and automatically transmitted when online.
            </span>
          </div>
        )}

        {/* Multi-Step Stepper Header */}
        <div className="px-6 py-3 bg-neutral-950/60 border-b border-neutral-800 flex items-center justify-between text-xs font-bold">
          <div className="flex items-center gap-2">
            <span
              className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-black ${
                step === 'shipping'
                  ? 'bg-amber-500 text-neutral-950'
                  : 'bg-emerald-500 text-neutral-950'
              }`}
            >
              1
            </span>
            <span className={step === 'shipping' ? 'text-amber-400' : 'text-neutral-400'}>
              Shipping Address
            </span>
          </div>

          <div className="w-12 h-0.5 bg-neutral-800 hidden sm:block" />

          <div className="flex items-center gap-2">
            <span
              className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-black ${
                step === 'payment'
                  ? 'bg-amber-500 text-neutral-950'
                  : step === 'processing'
                  ? 'bg-emerald-500 text-neutral-950'
                  : 'bg-neutral-800 text-neutral-400'
              }`}
            >
              2
            </span>
            <span className={step === 'payment' ? 'text-amber-400' : 'text-neutral-400'}>
              Payment & Verification
            </span>
          </div>

          <div className="w-12 h-0.5 bg-neutral-800 hidden sm:block" />

          <div className="flex items-center gap-2">
            <span
              className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-black ${
                step === 'processing'
                  ? 'bg-amber-500 text-neutral-950 animate-pulse'
                  : 'bg-neutral-800 text-neutral-400'
              }`}
            >
              3
            </span>
            <span className={step === 'processing' ? 'text-amber-400' : 'text-neutral-400'}>
              Confirmation
            </span>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto flex-1">
          {step === 'processing' ? (
            <div className="py-16 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-amber-500/10 text-amber-400 flex items-center justify-center mx-auto animate-spin border border-amber-500/30">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-white font-display">
                {t('processingOrder')}
              </h3>
              <p className="text-xs text-neutral-400 max-w-sm mx-auto">
                Authorizing payment token, locking inventory in warehouse bay, and assigning local dispatch carrier...
              </p>
            </div>
          ) : step === 'shipping' ? (
            /* Step 1: Shipping Form */
            <form onSubmit={handleShippingSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-neutral-300 mb-1">
                    {t('fullName')} *
                  </label>
                  <input
                    type="text"
                    required
                    value={shippingData.fullName}
                    onChange={(e) => setShippingData({ ...shippingData, fullName: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-neutral-700 bg-neutral-800 text-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-300 mb-1">
                    {t('phoneNumber')} *
                  </label>
                  <input
                    type="tel"
                    required
                    value={shippingData.phone}
                    onChange={(e) => setShippingData({ ...shippingData, phone: e.target.value })}
                    placeholder="+1 (555) 000-0000"
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-neutral-700 bg-neutral-800 text-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-300 mb-1">
                    {t('emailAddress')} *
                  </label>
                  <input
                    type="email"
                    required
                    value={shippingData.email}
                    onChange={(e) => setShippingData({ ...shippingData, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-neutral-700 bg-neutral-800 text-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-300 mb-1">
                    {t('country')} *
                  </label>
                  <input
                    type="text"
                    required
                    value={shippingData.country}
                    onChange={(e) => setShippingData({ ...shippingData, country: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-neutral-700 bg-neutral-800 text-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-neutral-300 mb-1">
                    {t('streetAddress')} *
                  </label>
                  <input
                    type="text"
                    required
                    value={shippingData.street}
                    onChange={(e) => setShippingData({ ...shippingData, street: e.target.value })}
                    placeholder="House number and street name"
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-neutral-700 bg-neutral-800 text-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-300 mb-1">
                    Apartment / Suite / Gate (Optional)
                  </label>
                  <input
                    type="text"
                    value={shippingData.apartment || ''}
                    onChange={(e) => setShippingData({ ...shippingData, apartment: e.target.value })}
                    placeholder="Apt 4B"
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-neutral-700 bg-neutral-800 text-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>

                {/* Postal / PIN Code with Smart Autofill */}
                <div className="sm:col-span-2 bg-neutral-950/80 border border-neutral-800 p-3.5 rounded-2xl space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <label className="text-xs font-bold text-neutral-200 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-amber-400" />
                      <span>{t('zipCode')} (PIN / ZIP Code) *</span>
                      <span className="text-[10px] bg-amber-500/20 text-amber-300 font-extrabold px-1.5 py-0.5 rounded border border-amber-500/30">
                        ⚡ AUTOFILLS CITY & STATE
                      </span>
                    </label>

                    {isLookingUpPostal && (
                      <div className="flex items-center gap-1.5 text-xs text-amber-400 font-semibold animate-pulse">
                        <Loader2 className="w-3 h-3 animate-spin" />
                        <span>Detecting City & State...</span>
                      </div>
                    )}
                  </div>

                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={shippingData.zipCode}
                      onChange={(e) => setShippingData({ ...shippingData, zipCode: e.target.value })}
                      placeholder="e.g. 400050, 110001, 560001, 97477"
                      className="w-full pl-3.5 pr-10 py-2.5 text-xs font-mono font-bold rounded-xl border border-neutral-700 bg-neutral-800 text-white focus:ring-2 focus:ring-amber-500 focus:outline-none tracking-wider"
                    />
                    {isLookingUpPostal ? (
                      <div className="absolute right-3 top-3 text-amber-400">
                        <Loader2 className="w-4 h-4 animate-spin" />
                      </div>
                    ) : postalAutofillNotice ? (
                      <div className="absolute right-3 top-3 text-emerald-400" title="City & State successfully autofilled">
                        <CheckCircle2 className="w-4 h-4" />
                      </div>
                    ) : null}
                  </div>

                  {/* Postal code quick preset chips */}
                  <div className="flex flex-wrap items-center gap-1.5 text-xs">
                    <span className="text-[11px] text-neutral-400 font-semibold">Quick Try:</span>
                    {POPULAR_PIN_SUGGESTIONS.map((preset) => (
                      <button
                        key={preset.pin}
                        type="button"
                        onClick={() => handleApplyPinPreset(preset.pin)}
                        className={`text-[11px] px-2 py-0.5 rounded-lg border font-mono transition-all ${
                          shippingData.zipCode === preset.pin
                            ? 'bg-amber-500 text-neutral-950 border-amber-400 font-black'
                            : 'bg-neutral-850 hover:bg-neutral-800 text-neutral-300 border-neutral-700'
                        }`}
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>

                  {/* Autofill confirmation banner */}
                  {postalAutofillNotice && (
                    <div className="flex items-center gap-2 p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs animate-in fade-in">
                      <Sparkles className="w-3.5 h-3.5 shrink-0 text-emerald-400" />
                      <span>
                        Autofilled: <strong className="text-white">{postalAutofillNotice.city}</strong>, <strong className="text-white">{postalAutofillNotice.state}</strong>
                        {postalAutofillNotice.district ? ` • ${postalAutofillNotice.district}` : ''}
                      </span>
                    </div>
                  )}
                </div>

                {/* City & State fields */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-bold text-neutral-300">
                      {t('city')} *
                    </label>
                    {postalAutofillNotice && (
                      <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-0.5">
                        <Check className="w-3 h-3 stroke-[3]" /> Autofilled
                      </span>
                    )}
                  </div>
                  <input
                    type="text"
                    required
                    value={shippingData.city}
                    onChange={(e) => setShippingData({ ...shippingData, city: e.target.value })}
                    className={`w-full px-3.5 py-2.5 text-xs rounded-xl border bg-neutral-800 text-white focus:ring-2 focus:ring-amber-500 focus:outline-none transition-all ${
                      postalAutofillHighlight
                        ? 'border-emerald-500 ring-2 ring-emerald-500/30'
                        : 'border-neutral-700'
                    }`}
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-bold text-neutral-300">
                      {t('state')} *
                    </label>
                    {postalAutofillNotice && (
                      <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-0.5">
                        <Check className="w-3 h-3 stroke-[3]" /> Autofilled
                      </span>
                    )}
                  </div>
                  <input
                    type="text"
                    required
                    value={shippingData.state}
                    onChange={(e) => setShippingData({ ...shippingData, state: e.target.value })}
                    className={`w-full px-3.5 py-2.5 text-xs rounded-xl border bg-neutral-800 text-white focus:ring-2 focus:ring-amber-500 focus:outline-none transition-all ${
                      postalAutofillHighlight
                        ? 'border-emerald-500 ring-2 ring-emerald-500/30'
                        : 'border-neutral-700'
                    }`}
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-neutral-300 mb-1">
                    {t('deliveryNotes')}
                  </label>
                  <input
                    type="text"
                    value={shippingData.deliveryNotes || ''}
                    onChange={(e) => setShippingData({ ...shippingData, deliveryNotes: e.target.value })}
                    placeholder="Gate code, drop at side door, ring bell..."
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-neutral-700 bg-neutral-800 text-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end">
                <button
                  id="checkout-next-to-payment-btn"
                  type="submit"
                  className="px-6 py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-black text-xs sm:text-sm shadow-xl shadow-amber-500/20 flex items-center gap-2 transition-transform active:scale-98"
                >
                  <span>Continue to Payment Method</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          ) : (
            /* Step 2: Payment Gateway */
            <div className="space-y-6">
              {/* Payment Method Selector Tabs */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-3">
                  {t('paymentMethod')}
                </label>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {[
                    { id: 'upi', label: 'UPI / GPay / PhonePe', icon: Smartphone },
                    { id: 'credit_card', label: 'Card / EMI', icon: CreditCard },
                    { id: 'cod', label: 'Cash on Delivery', icon: Banknote },
                    { id: 'paypal', label: 'NetBanking / Wallet', icon: Wallet },
                  ].map((pm) => {
                    const Icon = pm.icon;
                    const isSelected = paymentMethod === pm.id;
                    return (
                      <button
                        key={pm.id}
                        type="button"
                        onClick={() => setPaymentMethod(pm.id as any)}
                        className={`p-3 rounded-2xl border text-left transition-all flex flex-col justify-between gap-2 ${
                          isSelected
                            ? 'bg-amber-500/10 border-amber-500 text-amber-400 ring-2 ring-amber-500/20'
                            : 'bg-neutral-800/80 border-neutral-700 text-neutral-300 hover:border-neutral-600'
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                        <span className="font-bold text-xs leading-snug">{pm.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* UPI Payment Flow */}
              {paymentMethod === 'upi' && (
                <div className="space-y-4 p-5 rounded-2xl bg-neutral-900/90 border border-neutral-800">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-400 border border-amber-500/20">
                        <Smartphone className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-white uppercase tracking-wider">Instant UPI Payment</h4>
                        <p className="text-[11px] text-neutral-400">Zero surcharge • Direct bank debit via NPCI UPI 2.0</p>
                      </div>
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold">
                      INSTANT VERIFIED
                    </span>
                  </div>

                  <div className="grid grid-cols-4 gap-2 pt-2">
                    {[
                      { id: 'gpay', name: 'Google Pay', icon: '⚡' },
                      { id: 'phonepe', name: 'PhonePe', icon: '🟣' },
                      { id: 'paytm', name: 'Paytm UPI', icon: '🔵' },
                      { id: 'bhim', name: 'BHIM / Any UPI', icon: '🇮🇳' },
                    ].map((app) => (
                      <button
                        key={app.id}
                        type="button"
                        onClick={() => setSelectedUpiApp(app.id as any)}
                        className={`p-3 rounded-xl border text-center transition-all ${
                          selectedUpiApp === app.id
                            ? 'bg-amber-500/20 border-amber-500 text-amber-300 font-bold ring-1 ring-amber-500'
                            : 'bg-neutral-800 border-neutral-700 text-neutral-300 hover:border-neutral-600'
                        }`}
                      >
                        <div className="text-lg mb-1">{app.icon}</div>
                        <div className="text-[11px] font-semibold">{app.name}</div>
                      </button>
                    ))}
                  </div>

                  <div className="pt-2">
                    <label className="block text-xs font-bold text-neutral-300 mb-1.5">
                      Virtual Payment Address (UPI ID)
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={upiId}
                        onChange={(e) => setUpiId(e.target.value)}
                        placeholder="mobile@upi or yourname@oksbi"
                        className="flex-1 px-3.5 py-2.5 text-xs font-mono font-bold rounded-xl border border-neutral-700 bg-neutral-800 text-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
                      />
                      <button
                        type="button"
                        className="px-4 py-2.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-bold rounded-xl border border-neutral-700 transition-colors"
                      >
                        Verify VPA
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Credit Card Form & Visual Card */}
              {paymentMethod === 'credit_card' && (
                <div className="space-y-6">
                  {/* Interactive 3D Card Visualizer */}
                  <div className="flex justify-center">
                    <div
                      onClick={() => setIsCardFlipped(!isCardFlipped)}
                      className="cursor-pointer select-none perspective-1000 w-full max-w-sm h-48 rounded-2xl bg-gradient-to-tr from-neutral-950 via-neutral-900 to-amber-950/60 text-white p-5 shadow-2xl border border-neutral-700/80 flex flex-col justify-between relative overflow-hidden transition-transform duration-300 hover:scale-102"
                    >
                      {/* Background light streak */}
                      <div className="absolute -right-10 -bottom-10 w-44 h-44 bg-amber-500/15 rounded-full blur-2xl pointer-events-none" />

                      <div className="flex items-center justify-between z-10">
                        <div className="flex items-center gap-1.5 font-black text-sm font-display tracking-wider">
                          APEX<span className="text-amber-500">PAY</span>
                        </div>
                        <div className="text-[10px] font-mono tracking-widest text-neutral-400 uppercase">
                          256-BIT ENCRYPTED
                        </div>
                      </div>

                      <div className="my-auto z-10">
                        <div className="text-lg sm:text-xl font-mono tracking-[0.2em] font-bold text-neutral-100">
                          {cardNumber || '•••• •••• •••• ••••'}
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-xs z-10">
                        <div>
                          <div className="text-[9px] uppercase tracking-wider text-neutral-400">
                            Cardholder
                          </div>
                          <div className="font-bold uppercase truncate max-w-[170px] text-amber-200">
                            {cardHolder || 'ALEX VANCE'}
                          </div>
                        </div>

                        <div className="text-right">
                          <div className="text-[9px] uppercase tracking-wider text-neutral-400">
                            Expires
                          </div>
                          <div className="font-bold font-mono text-amber-200">{cardExpiry || 'MM/YY'}</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Card Form Inputs */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-bold text-neutral-300 mb-1">
                        {t('cardNumber')}
                      </label>
                      <input
                        type="text"
                        value={cardNumber}
                        onChange={(e) => handleFormatCardNumber(e.target.value)}
                        placeholder="4532 8900 1234 5678"
                        className="w-full px-3.5 py-2.5 text-xs font-mono font-bold rounded-xl border border-neutral-700 bg-neutral-800 text-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-neutral-300 mb-1">
                        {t('cardHolder')}
                      </label>
                      <input
                        type="text"
                        value={cardHolder}
                        onChange={(e) => setCardHolder(e.target.value.toUpperCase())}
                        placeholder="NAME ON CARD"
                        className="w-full px-3.5 py-2.5 text-xs font-bold rounded-xl border border-neutral-700 bg-neutral-800 text-white focus:ring-2 focus:ring-amber-500 focus:outline-none uppercase"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-xs font-bold text-neutral-300 mb-1">
                          {t('cardExpiry')}
                        </label>
                        <input
                          type="text"
                          value={cardExpiry}
                          onChange={(e) => handleFormatExpiry(e.target.value)}
                          placeholder="MM/YY"
                          className="w-full px-3.5 py-2.5 text-xs font-mono font-bold rounded-xl border border-neutral-700 bg-neutral-800 text-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-neutral-300 mb-1">
                          {t('cardCvc')}
                        </label>
                        <input
                          type="password"
                          maxLength={4}
                          value={cardCvc}
                          onChange={(e) => setCardCvc(e.target.value.replace(/\D/g, ''))}
                          placeholder="CVC"
                          className="w-full px-3.5 py-2.5 text-xs font-mono font-bold rounded-xl border border-neutral-700 bg-neutral-800 text-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  {cardError && (
                    <div className="p-3 rounded-xl bg-red-950/80 text-red-300 border border-red-800 text-xs font-semibold flex items-center gap-2">
                      <AlertCircle className="w-4 h-4" />
                      <span>{cardError}</span>
                    </div>
                  )}
                </div>
              )}

              {/* Cash On Delivery (COD) Notice */}
              {paymentMethod === 'cod' && (
                <div className="p-5 rounded-2xl bg-neutral-800/80 border border-neutral-700 space-y-3">
                  <div className="flex items-center gap-2.5 text-emerald-400 font-bold text-sm">
                    <Banknote className="w-5 h-5 text-emerald-400" />
                    <span>Cash on Delivery (Doorstep Verification)</span>
                  </div>
                  <p className="text-xs text-neutral-300 leading-relaxed">
                    {t('codNotice')} Our express driver will present the sealed car accessories package for inspection before collecting exact cash amount ({formatPrice(cartTotal)}).
                  </p>
                  <div className="flex items-center gap-2 text-xs text-emerald-400 font-semibold">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Zero upfront charge required • SMS dispatch alert provided</span>
                  </div>
                </div>
              )}

              {/* Apple Pay / Google Pay / PayPal Notice */}
              {(paymentMethod === 'apple_pay' || paymentMethod === 'paypal') && (
                <div className="p-5 rounded-2xl bg-neutral-800/80 border border-neutral-700 space-y-2 text-center">
                  <div className="w-10 h-10 rounded-full bg-neutral-900 text-white border border-neutral-700 flex items-center justify-center mx-auto">
                    {paymentMethod === 'apple_pay' ? (
                      <Smartphone className="w-5 h-5 text-amber-400" />
                    ) : (
                      <Wallet className="w-5 h-5 text-amber-400" />
                    )}
                  </div>
                  <h4 className="font-bold text-sm text-white capitalize">
                    {paymentMethod.replace('_', ' ')} Biometric Checkout
                  </h4>
                  <p className="text-xs text-neutral-400 max-w-sm mx-auto">
                    Clicking &quot;Place Order Now&quot; will invoke the secure payment token flow linked to your verified account.
                  </p>
                </div>
              )}

              {/* Order Total Overview Bar */}
              <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 flex items-center justify-between">
                <div>
                  <div className="text-xs text-neutral-400">
                    Total Amount Due
                  </div>
                  <div className="text-2xl font-black text-amber-400 font-display">
                    {formatPrice(cartTotal)}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setStep('shipping')}
                    className="px-4 py-2.5 text-xs font-bold text-neutral-300 hover:bg-neutral-800 rounded-xl flex items-center gap-1.5 transition-colors"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Back</span>
                  </button>

                  <button
                    id="place-order-final-btn"
                    type="button"
                    onClick={handleFinalPlaceOrder}
                    disabled={isProcessing}
                    className="px-6 py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-black text-xs sm:text-sm shadow-xl shadow-amber-500/20 flex items-center gap-2 transition-transform active:scale-98"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    <span>{t('placeOrder')}</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
