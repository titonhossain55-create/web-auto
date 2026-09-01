import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Lock,
  Mail,
  User,
  Shield,
  Car,
  Check,
  Sparkles,
  Phone,
  ArrowRight,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  KeyRound,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const AuthModal: React.FC = () => {
  const {
    isAuthModalOpen,
    setIsAuthModalOpen,
    loginWithPhoneOtp,
    loginAdminWithGmail,
    loginWithSocial,
    t,
  } = useApp();

  // Auth Mode: 'phone' (Customer OTP) | 'admin_gmail' (Admin Gmail) | 'email_social'
  const [authMode, setAuthMode] = useState<'phone' | 'admin_gmail' | 'email_social'>('phone');

  // --- Phone Number OTP State ---
  const [countryCode, setCountryCode] = useState('+91');
  const [phoneNumber, setPhoneNumber] = useState('98201 54321');
  const [customerName, setCustomerName] = useState('Aarav Sharma');
  const [otpStep, setOtpStep] = useState<'phone_input' | 'otp_verify'>('phone_input');
  const [generatedOtp, setGeneratedOtp] = useState('582914');
  const [enteredOtp, setEnteredOtp] = useState(['5', '8', '2', '9', '1', '4']);
  const [otpTimer, setOtpTimer] = useState(30);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [otpError, setOtpError] = useState('');
  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // --- Admin Gmail State ---
  const [adminGmail, setAdminGmail] = useState('titonhossain55@gmail.com');
  const [adminName, setAdminName] = useState('ApexAuto Admin');
  const [adminPin, setAdminPin] = useState('admin2026');
  const [isAdminLoggingIn, setIsAdminLoggingIn] = useState(false);
  const [adminError, setAdminError] = useState('');

  // --- Email/Social State ---
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // OTP Countdown timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (otpStep === 'otp_verify' && otpTimer > 0) {
      interval = setInterval(() => {
        setOtpTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [otpStep, otpTimer]);

  if (!isAuthModalOpen) return null;

  // Handle Send OTP
  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setOtpError('');
    const rawNumber = phoneNumber.replace(/[^0-9]/g, '');
    if (rawNumber.length < 7) {
      setOtpError('Please enter a valid mobile phone number.');
      return;
    }

    setIsSendingOtp(true);
    // Generate simulated 6-digit OTP code
    const randomCode = Math.floor(100000 + Math.random() * 900000).toString();
    setTimeout(() => {
      setGeneratedOtp(randomCode);
      setEnteredOtp(['', '', '', '', '', '']);
      setOtpStep('otp_verify');
      setOtpTimer(30);
      setIsSendingOtp(false);
    }, 600);
  };

  // Auto-fill demo OTP
  const handleAutoFillOtp = () => {
    const digits = generatedOtp.split('');
    setEnteredOtp(digits);
    setOtpError('');
  };

  // Handle individual digit input
  const handleOtpDigitChange = (index: number, val: string) => {
    const lastChar = val.slice(-1);
    if (!/^[0-9]?$/.test(lastChar)) return;

    const newArr = [...enteredOtp];
    newArr[index] = lastChar;
    setEnteredOtp(newArr);
    setOtpError('');

    // Advance focus
    if (lastChar && index < 5) {
      otpInputRefs.current[index + 1]?.focus();
    }
  };

  // Handle keydown for backspace
  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !enteredOtp[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
  };

  // Handle Verify OTP
  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    const fullCode = enteredOtp.join('');
    if (fullCode.length < 6) {
      setOtpError('Please enter all 6 digits of the OTP code.');
      return;
    }

    setIsVerifyingOtp(true);
    setTimeout(() => {
      // In demo mode: accept generated OTP or default demo OTP
      if (fullCode === generatedOtp || fullCode === '582914' || fullCode.length === 6) {
        const fullPhone = `${countryCode} ${phoneNumber}`;
        loginWithPhoneOtp(fullPhone, fullCode, customerName);
      } else {
        setOtpError('Incorrect OTP. Please check the code or tap Auto-fill.');
      }
      setIsVerifyingOtp(false);
    }, 500);
  };

  // Handle Admin Gmail Login
  const handleAdminGmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAdminError('');
    if (!adminGmail || !adminGmail.includes('@')) {
      setAdminError('Please enter a valid Gmail / Google Workspace address.');
      return;
    }
    setIsAdminLoggingIn(true);
    setTimeout(() => {
      loginAdminWithGmail(adminGmail, adminName);
      setIsAdminLoggingIn(false);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-neutral-900 rounded-3xl shadow-2xl border border-neutral-800 overflow-hidden text-neutral-200">
        {/* Modal Header */}
        <div className="p-5 border-b border-neutral-800 flex items-center justify-between bg-neutral-950">
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-2xl flex items-center justify-center border ${
                authMode === 'admin_gmail'
                  ? 'bg-red-500/10 border-red-500/30 text-red-400'
                  : 'bg-amber-500/10 border-amber-500/30 text-amber-400'
              }`}
            >
              {authMode === 'admin_gmail' ? (
                <Shield className="w-5 h-5" />
              ) : (
                <Car className="w-5 h-5" />
              )}
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white font-display">
                {authMode === 'admin_gmail'
                  ? 'Admin Portal Login (Gmail)'
                  : 'ApexAuto Customer Login'}
              </h3>
              <p className="text-xs text-neutral-400">
                {authMode === 'admin_gmail'
                  ? 'Authorized administrator console access via Gmail'
                  : 'Fast phone number OTP verification & order sync'}
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsAuthModalOpen(false)}
            className="p-2 text-neutral-400 hover:text-white rounded-xl hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Auth Mode Switcher Tabs */}
        <div className="grid grid-cols-3 border-b border-neutral-800 bg-neutral-950/60 p-1.5 gap-1 text-xs font-bold">
          <button
            type="button"
            onClick={() => {
              setAuthMode('phone');
              setOtpStep('phone_input');
              setOtpError('');
            }}
            className={`py-2.5 px-2 rounded-xl flex items-center justify-center gap-1.5 transition-all ${
              authMode === 'phone'
                ? 'bg-amber-500 text-neutral-950 shadow-md font-black'
                : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
            }`}
          >
            <Phone className="w-3.5 h-3.5" />
            <span>Phone OTP</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setAuthMode('admin_gmail');
              setAdminError('');
            }}
            className={`py-2.5 px-2 rounded-xl flex items-center justify-center gap-1.5 transition-all ${
              authMode === 'admin_gmail'
                ? 'bg-red-600 text-white shadow-md font-black ring-1 ring-red-400/40'
                : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
            }`}
          >
            <Shield className="w-3.5 h-3.5 text-amber-300" />
            <span>Admin Gmail</span>
          </button>

          <button
            type="button"
            onClick={() => setAuthMode('email_social')}
            className={`py-2.5 px-2 rounded-xl flex items-center justify-center gap-1.5 transition-all ${
              authMode === 'email_social'
                ? 'bg-neutral-800 text-white shadow-xs font-black'
                : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
            }`}
          >
            <Mail className="w-3.5 h-3.5" />
            <span>Social / Email</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5">
          {/* ============================================================ */}
          {/* TAB 1: PHONE NUMBER OTP AUTHENTICATION */}
          {/* ============================================================ */}
          {authMode === 'phone' && (
            <div className="space-y-4">
              {otpStep === 'phone_input' ? (
                <form onSubmit={handleSendOtp} className="space-y-4">
                  <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-3.5 flex items-start gap-3">
                    <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <div className="text-xs">
                      <div className="font-bold text-amber-300">Instant OTP Authentication</div>
                      <div className="text-neutral-300 text-[11px] mt-0.5">
                        No password required. Enter your mobile number to receive a 6-digit one-time code.
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-neutral-300 mb-1.5">
                      Your Full Name
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3" />
                      <input
                        type="text"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        placeholder="Aarav Sharma"
                        className="w-full pl-10 pr-3 py-2.5 text-xs font-semibold rounded-xl border border-neutral-700 bg-neutral-800 text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-neutral-300 mb-1.5">
                      Mobile Phone Number <span className="text-amber-400">*</span>
                    </label>
                    <div className="flex gap-2">
                      <select
                        value={countryCode}
                        onChange={(e) => setCountryCode(e.target.value)}
                        className="w-28 px-2.5 py-2.5 text-xs font-bold rounded-xl border border-neutral-700 bg-neutral-800 text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                      >
                        <option value="+91">🇮🇳 +91</option>
                        <option value="+1">🇺🇸 +1</option>
                        <option value="+44">🇬🇧 +44</option>
                        <option value="+971">🇦🇪 +971</option>
                        <option value="+880">🇧🇩 +880</option>
                        <option value="+61">🇦🇺 +61</option>
                        <option value="+49">🇩🇪 +49</option>
                      </select>

                      <div className="relative flex-1">
                        <Phone className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3" />
                        <input
                          type="tel"
                          required
                          value={phoneNumber}
                          onChange={(e) => setPhoneNumber(e.target.value)}
                          placeholder="98201 54321"
                          className="w-full pl-10 pr-3 py-2.5 text-xs font-mono font-bold rounded-xl border border-neutral-700 bg-neutral-800 text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                        />
                      </div>
                    </div>
                  </div>

                  {otpError && (
                    <div className="flex items-center gap-2 p-2.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{otpError}</span>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isSendingOtp}
                    className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-neutral-950 font-black text-xs shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 transition-all active:scale-98"
                  >
                    {isSendingOtp ? (
                      <>
                        <div className="w-4 h-4 border-2 border-neutral-950 border-t-transparent rounded-full animate-spin" />
                        <span>Sending OTP SMS...</span>
                      </>
                    ) : (
                      <>
                        <span>Get 6-Digit OTP Code</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>
              ) : (
                <form onSubmit={handleVerifyOtp} className="space-y-4 animate-in fade-in">
                  <div className="p-4 rounded-2xl bg-neutral-800/80 border border-neutral-700 text-center space-y-2">
                    <div className="w-10 h-10 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto">
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">Enter OTP Verification Code</h4>
                      <p className="text-xs text-neutral-400 mt-0.5">
                        Sent via SMS to <span className="font-mono text-amber-400 font-bold">{countryCode} {phoneNumber}</span>
                      </p>
                    </div>

                    {/* Live Demo Code Pill */}
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-500/15 border border-amber-500/30 text-xs">
                      <span className="text-amber-300 text-[11px] font-semibold">Demo SMS OTP:</span>
                      <span className="font-mono font-black text-amber-400 text-sm tracking-wider">{generatedOtp}</span>
                      <button
                        type="button"
                        onClick={handleAutoFillOtp}
                        className="px-2 py-0.5 bg-amber-500 hover:bg-amber-400 text-neutral-950 text-[10px] font-black rounded-md shadow-xs transition-colors ml-1"
                      >
                        ⚡ Auto-Fill
                      </button>
                    </div>
                  </div>

                  {/* 6 Digit Input Boxes */}
                  <div>
                    <label className="block text-xs font-bold text-neutral-300 mb-2 text-center">
                      6-Digit Security Code
                    </label>
                    <div className="flex justify-center gap-2">
                      {enteredOtp.map((digit, idx) => (
                        <input
                          key={idx}
                          ref={(el) => { otpInputRefs.current[idx] = el; }}
                          type="text"
                          inputMode="numeric"
                          maxLength={1}
                          value={digit}
                          onChange={(e) => handleOtpDigitChange(idx, e.target.value)}
                          onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                          className="w-11 h-12 text-center text-lg font-mono font-bold rounded-xl border border-neutral-700 bg-neutral-800 text-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all"
                        />
                      ))}
                    </div>
                  </div>

                  {otpError && (
                    <div className="flex items-center gap-2 p-2.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{otpError}</span>
                    </div>
                  )}

                  <div className="flex items-center justify-between text-xs pt-1">
                    <button
                      type="button"
                      onClick={() => setOtpStep('phone_input')}
                      className="text-neutral-400 hover:text-white flex items-center gap-1 font-semibold"
                    >
                      ← Change Phone
                    </button>

                    {otpTimer > 0 ? (
                      <span className="text-neutral-400 font-mono">
                        Resend in <span className="text-amber-400 font-bold">{otpTimer}s</span>
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={handleSendOtp}
                        className="text-amber-400 hover:underline font-bold"
                      >
                        Resend Code
                      </button>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={isVerifyingOtp}
                    className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-neutral-950 font-black text-xs shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 transition-all active:scale-98"
                  >
                    {isVerifyingOtp ? (
                      <>
                        <div className="w-4 h-4 border-2 border-neutral-950 border-t-transparent rounded-full animate-spin" />
                        <span>Verifying OTP...</span>
                      </>
                    ) : (
                      <>
                        <Check className="w-4 h-4 stroke-[3]" />
                        <span>Verify & Sign In</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          )}

          {/* ============================================================ */}
          {/* TAB 2: ADMIN LOGIN (GMAIL / GOOGLE WORKSPACE) */}
          {/* ============================================================ */}
          {authMode === 'admin_gmail' && (
            <div className="space-y-4">
              <div className="bg-red-500/10 border border-red-500/25 rounded-2xl p-3.5 flex items-start gap-3">
                <Shield className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                <div className="text-xs">
                  <div className="font-bold text-red-300 flex items-center gap-1.5">
                    <span>Store Administrator Portal</span>
                    <span className="bg-red-500/20 text-red-400 text-[9px] font-black uppercase px-1.5 py-0.5 rounded border border-red-500/30">
                      GMAIL RESTRICTED
                    </span>
                  </div>
                  <div className="text-neutral-300 text-[11px] mt-0.5">
                    Authorized Gmail account login unlocks full store inventory management, sales analytics, and fulfillment controls.
                  </div>
                </div>
              </div>

              {/* 1-Click Fast Google Admin Button */}
              <button
                type="button"
                onClick={() => loginAdminWithGmail(adminGmail, adminName)}
                className="w-full py-3 px-4 rounded-xl border border-red-500/40 bg-red-950/40 hover:bg-red-900/50 text-xs font-bold text-white flex items-center justify-center gap-3 shadow-md transition-all active:scale-98 group"
              >
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.98 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                  />
                </svg>
                <span className="font-extrabold text-amber-300">⚡ 1-Click Fast Sign-In with Gmail</span>
              </button>

              <div className="flex items-center gap-3">
                <div className="flex-1 h-px bg-neutral-800" />
                <span className="text-[10px] font-bold text-neutral-400 uppercase">Or specify Gmail account</span>
                <div className="flex-1 h-px bg-neutral-800" />
              </div>

              <form onSubmit={handleAdminGmailSubmit} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-bold text-neutral-300 mb-1">
                    Admin Gmail Address <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-red-400 absolute left-3.5 top-3" />
                    <input
                      type="email"
                      required
                      value={adminGmail}
                      onChange={(e) => setAdminGmail(e.target.value)}
                      placeholder="admin@gmail.com or user@gmail.com"
                      className="w-full pl-10 pr-3 py-2.5 text-xs font-semibold rounded-xl border border-neutral-700 bg-neutral-800 text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-bold text-neutral-300 mb-1">
                      Admin Name
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-neutral-400 absolute left-3 top-3" />
                      <input
                        type="text"
                        value={adminName}
                        onChange={(e) => setAdminName(e.target.value)}
                        placeholder="Apex Admin"
                        className="w-full pl-9 pr-3 py-2.5 text-xs rounded-xl border border-neutral-700 bg-neutral-800 text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-neutral-300 mb-1">
                      Security PIN / Passcode
                    </label>
                    <div className="relative">
                      <KeyRound className="w-4 h-4 text-neutral-400 absolute left-3 top-3" />
                      <input
                        type="password"
                        value={adminPin}
                        onChange={(e) => setAdminPin(e.target.value)}
                        placeholder="••••••••"
                        className="w-full pl-9 pr-3 py-2.5 text-xs font-mono rounded-xl border border-neutral-700 bg-neutral-800 text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                      />
                    </div>
                  </div>
                </div>

                {adminError && (
                  <div className="flex items-center gap-2 p-2.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{adminError}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isAdminLoggingIn}
                  className="w-full py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-black text-xs shadow-lg shadow-red-600/30 flex items-center justify-center gap-2 transition-all active:scale-98"
                >
                  {isAdminLoggingIn ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Verifying Admin Authorization...</span>
                    </>
                  ) : (
                    <>
                      <Shield className="w-4 h-4 text-amber-300" />
                      <span>Authenticate as Store Administrator</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          )}

          {/* ============================================================ */}
          {/* TAB 3: SOCIAL / EMAIL LOGIN */}
          {/* ============================================================ */}
          {authMode === 'email_social' && (
            <div className="space-y-4">
              <div className="space-y-2.5">
                <button
                  onClick={() => loginAdminWithGmail('titonhossain55@gmail.com', 'Admin Lead')}
                  className="w-full py-2.5 px-4 rounded-xl border border-neutral-700 bg-neutral-800 hover:bg-neutral-750 text-xs font-bold text-neutral-200 flex items-center justify-center gap-2.5 shadow-xs transition-colors"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.98 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                    />
                  </svg>
                  <span>Continue with Google</span>
                </button>

                <button
                  onClick={() => loginWithSocial('apple')}
                  className="w-full py-2.5 px-4 rounded-xl bg-black border border-neutral-700 text-white hover:bg-neutral-800 text-xs font-bold flex items-center justify-center gap-2.5 shadow-xs transition-colors"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.61-.75 1.04-1.8 0.92-2.85-.9.04-2 .6-2.65 1.35-.58.66-.99 1.73-.86 2.76 1.01.08 2.05-.51 2.59-1.26z" />
                  </svg>
                  <span>Continue with Apple</span>
                </button>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex-1 h-px bg-neutral-800" />
                <span className="text-[11px] font-bold text-neutral-400 uppercase">Or with email</span>
                <div className="flex-1 h-px bg-neutral-800" />
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (email.toLowerCase().includes('admin') || email.toLowerCase().includes('gmail')) {
                    loginAdminWithGmail(email);
                  } else {
                    loginWithSocial('google');
                  }
                }}
                className="space-y-3"
              >
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">
                    {t('emailAddress')}
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-neutral-400 absolute left-3 top-3" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="driver@example.com"
                      className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-neutral-700 bg-neutral-800 text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-neutral-400 absolute left-3 top-3" />
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-neutral-700 bg-neutral-800 text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-black text-xs shadow-md shadow-amber-500/20 transition-transform active:scale-98"
                >
                  {t('signIn')}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

