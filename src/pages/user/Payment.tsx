import { useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect, useMemo } from 'react';
import { ShoppingCart, CreditCard, User, Mail, Phone, Plus, ChevronRight, AlertCircle } from 'lucide-react';
import Navbar from '../../components/user/Navbar';
import PopupPayment from '../../components/user/PopupPayment';
import { toast } from 'sonner';
import { createTransaction as apiCreateTransaction } from '../../services/transactionService';
import { authService } from '../../services/adminService';
import { paymentMethods } from '../../constants/paymentMethods';


const Payment = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [openPopup, setOpenPopup] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [agreeMarketing, setAgreeMarketing] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Initialize
  useEffect(() => {
    // Fetch user profile to pre-fill form
    const fetchUserProfile = async () => {
      try {
        const user = await authService.getUserProfile();
        if (user) {
          setBuyerInfo(prev => ({
            ...prev,
            name: user.name || prev.name,
            email: user.email || prev.email,
            phone: user.phone || user.phoneNumber || prev.phone
          }));
        }
      } catch (error) {
        console.log('User not logged in or failed to fetch profile', error);
        // Try local storage fallback directly if API failed
        const localUser = authService.getUserData();
        if (localUser) {
          setBuyerInfo(prev => ({
            ...prev,
            name: localUser.name || prev.name,
            email: localUser.email || prev.email,
            phone: localUser.phone || (localUser as any).phoneNumber || prev.phone
          }));
        }
      }
    };
    fetchUserProfile();
  }, []);

  // Get dynamic data from DetailProduk
  const rawLocationState = location.state || {};

  // Memoize localStorage helper to avoid recreating function
  const getStoredCheckout = useMemo(() => {
    return () => {
      try {
        return JSON.parse(localStorage.getItem('checkout_state') || 'null');
      } catch (e) {
        return null;
      }
    };
  }, []);

  const storedCheckout = getStoredCheckout();
  const stateData = { ...(storedCheckout || {}), ...(rawLocationState || {}) };

  // Persist latest location state to localStorage so other flows (e.g., failed -> back) can recover product data
  useEffect(() => {
    if (rawLocationState && Object.keys(rawLocationState).length) {
      try {
        const merged = { ...(getStoredCheckout() || {}), ...rawLocationState };
        localStorage.setItem('checkout_state', JSON.stringify(merged));
      } catch (e) {
        // ignore storage errors
      }
    }
  }, [rawLocationState, getStoredCheckout]);

  // Sanitize product name (remove HTML entities and decode)
  const sanitizeProductName = (name: string) => {
    if (!name) return 'Judul Produk';

    // Check if it looks like base64 or encoded string (contains +, /, =, etc.)
    // Pattern: starts with / or contains many special chars
    if (name.startsWith('/') || /^[A-Za-z0-9+/=]+$/.test(name) && name.length > 20) {
      console.warn('Product name appears to be encoded, replacing with default');
      return 'Judul Produk';
    }

    // Create a temporary div to decode HTML entities
    const temp = document.createElement('div');
    temp.innerHTML = name;
    const decoded = temp.textContent || temp.innerText || name;

    // Remove any remaining special characters or encoded strings
    const cleaned = decoded.replace(/[^\w\s\-.,()]/gi, '').trim();

    return cleaned || 'Judul Produk';
  };

  // ================= DATA CART =================
  const cartItems = stateData.items || [
    {
      id: 1,
      name: sanitizeProductName(stateData.productName) || 'Judul Produk',
      category: stateData.productCategory && stateData.productCategory !== 'undefined' ? stateData.productCategory : 'Produk',
      price: stateData.basePrice || 150000,
      image: stateData.productImage || '👗',
      quantity: 1
    }
  ];

  const addOns = stateData.addOns || [];

  const [buyerInfo, setBuyerInfo] = useState({
    email: '',
    name: '',
    phone: ''
  });

  const [errors, setErrors] = useState({
    email: '',
    name: '',
    phone: ''
  });

  // Validation Logic
  const validateForm = () => {
    let newErrors = { email: '', name: '', phone: '' };
    let isValid = true;

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!buyerInfo.email) {
      newErrors.email = 'Email wajib diisi';
      isValid = false;
    } else if (!emailRegex.test(buyerInfo.email)) {
      newErrors.email = 'Format email tidak valid';
      isValid = false;
    }

    // Name validation
    if (!buyerInfo.name) {
      newErrors.name = 'Nama lengkap wajib diisi';
      isValid = false;
    } else if (buyerInfo.name.length < 3) {
      newErrors.name = 'Nama harus minimal 3 karakter';
      isValid = false;
    }

    // Phone validation (Indonesian format)
    const phoneRegex = /^(?:\+62|62|0)8[1-9][0-9]{6,10}$/;
    if (!buyerInfo.phone) {
      newErrors.phone = 'Nomor telepon wajib diisi';
      isValid = false;
    } else if (!phoneRegex.test(buyerInfo.phone)) {
      newErrors.phone = 'Format nomor telepon tidak valid';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };



  // ================= CALCULATION =================
  const calculateSubtotal = () =>
    cartItems.reduce((sum: number, item: any) => sum + (Number(item.price) || 0) * (Number(item.quantity) || 1), 0);

  const calculateAddOns = () =>
    addOns.reduce((sum: number, a: any) => sum + (Number(a.price) || 0), 0);

  const discount = 0;

  const totalPrice =
    calculateSubtotal() + calculateAddOns() - discount;

  const formatRupiah = (value: number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(value);

  // ================= API TRANSACTION HANDLER =================
  const createTransaction = async () => {
    setIsProcessing(true);

    try {
      const payload = {
        name: buyerInfo.name,
        email: buyerInfo.email,
        phone_number: buyerInfo.phone,
        payment_type: selectedPayment,
        product_id: stateData.productId,
        add_ons_ids: stateData.selectedAddOnsIds || []
      };

      const result = await apiCreateTransaction(payload);

      // Success - Use trx_id from API response for order tracking
      const orderId = result.data?.trx_id || result.data?.order_id || result.trx_id || result.order_id || `ORD-${Date.now()}`;

      if (selectedPayment === "qris") {
        navigate("/qris", {
          state: {
            ...stateData, // Pass original product data
            amount: totalPrice,
            email: buyerInfo.email,
            name: buyerInfo.name,
            phone: buyerInfo.phone,
            orderId: orderId,
            items: cartItems,
            transactionData: result.data || result,
            productLink: stateData.productLink
          }
        });
        return;
      }

      const virtualAccountMethods = [
        "bca", "mandiri", "bri", "permata", "bsi", "bni",
        "cimb", "mandiri_va", "muamalat", "sinarmas", "bnc", "maybank"
      ];

      const minimarketMethods = ["indomaret", "alfamart"];

      if (virtualAccountMethods.includes(selectedPayment)) {
        navigate("/virtual-account", {
          state: {
            ...stateData, // Pass original product data
            amount: totalPrice,
            email: buyerInfo.email,
            name: buyerInfo.name,
            phone: buyerInfo.phone,
            orderId: orderId,
            paymentMethod: selectedPayment,
            items: cartItems,
            transactionData: result.data || result,
            productLink: stateData.productLink
          }
        });
        return;
      }

      if (minimarketMethods.includes(selectedPayment)) {
        navigate("/minimarket-payment", {
          state: {
            ...stateData, // Pass original product data
            amount: totalPrice,
            email: buyerInfo.email,
            name: buyerInfo.name,
            phone: buyerInfo.phone,
            orderId: orderId,
            paymentMethod: selectedPayment,
            items: cartItems,
            transactionData: result.data || result,
            productLink: stateData.productLink
          }
        });
        return;
      }

      toast.error("Metode pembayaran ini belum tersedia");

    } catch (error: any) {
      console.error('Transaction error:', error);
      const errorMsg = error.response?.data?.message || error.message || 'Gagal membuat transaksi. Silakan coba lagi.';
      toast.error(errorMsg);
    } finally {
      setIsProcessing(false);
    }
  };

  // ================= CHECKOUT HANDLER =================
  const handleCheckout = () => {
    if (!validateForm()) {
      toast.error('Mohon lengkapi informasi pembeli dengan benar');
      return;
    }

    if (!selectedPayment) {
      toast.error('Mohon pilih metode pembayaran');
      return;
    }

    if (!agreeTerms) {
      toast.error('Mohon setujui syarat dan ketentuan');
      return;
    }

    if (!stateData.productId) {
      toast.error('Data produk tidak valid. Silakan kembali ke halaman produk.');
      return;
    }

    // Call API to create transaction
    createTransaction();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-100 relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse" style={{ animationDelay: '1s' }}></div>

      <Navbar />

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-6">

          {/* DESKTOP: Left Column - Buyer Info & Payment */}
          {/* MOBILE: Bottom Section */}
          <div className="space-y-6 order-2 lg:order-1">
            {/* MOBILE ONLY: Payment Detail Summary */}
            <div className="lg:hidden bg-white rounded-2xl shadow-lg p-4">
              <h3 className="font-semibold text-sm text-gray-800 mb-3">PAYMENT DETAIL</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-gray-700">
                  <span>Subtotal</span>
                  <span className="font-semibold">{formatRupiah(calculateSubtotal())}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-gray-700">
                    <span>Discount</span>
                    <span className="font-semibold text-green-600">-{formatRupiah(discount)}</span>
                  </div>
                )}
                {addOns.length > 0 && (
                  <div className="flex justify-between text-gray-700">
                    <span>Add-Ons</span>
                    <span className="font-semibold">{formatRupiah(calculateAddOns())}</span>
                  </div>
                )}

                <div className="flex justify-between items-center pt-2">
                  <span className="font-bold text-gray-800">TOTAL</span>
                  <span className="text-base font-bold text-purple-600">
                    {formatRupiah(totalPrice)}
                  </span>
                </div>
              </div>
            </div>

            {/* Buyer Information */}
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl p-4 lg:p-8 border border-gray-100">
              <h2 className="text-lg lg:text-2xl font-bold text-gray-800 mb-4 lg:mb-6">Informasi Pembeli:</h2>

              <div className="space-y-4 lg:space-y-6">
                <div>
                  <label className="block text-xs lg:text-sm font-semibold text-gray-700 mb-1 lg:mb-2 flex items-center gap-2">
                    <Mail className="w-4 h-4 text-gray-400" />
                    Email
                  </label>
                  <input
                    type="email"
                    value={buyerInfo.email}
                    onChange={(e) => {
                      setBuyerInfo({ ...buyerInfo, email: e.target.value });
                      if (errors.email) setErrors({ ...errors, email: '' });
                    }}
                    className={`w-full px-3 lg:px-4 py-2 lg:py-3 text-sm rounded-xl border-2 outline-none transition-all ${errors.email
                      ? 'border-red-300 bg-red-50 focus:border-red-400 focus:ring-4 focus:ring-red-100'
                      : 'border-gray-100 bg-gray-50 focus:border-purple-400 focus:ring-4 focus:ring-purple-100'
                      }`}
                    placeholder="contoh@email.com"
                  />
                  {errors.email && (
                    <p className="mt-1.5 text-[11px] text-red-500 font-medium flex items-center gap-1.5 ml-1">
                      <AlertCircle className="w-3 h-3" /> {errors.email}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-xs lg:text-sm font-semibold text-gray-700 mb-1 lg:mb-2 flex items-center gap-2">
                    <User className="w-4 h-4 text-gray-400" />
                    Nama Lengkap
                  </label>
                  <input
                    type="text"
                    value={buyerInfo.name}
                    onChange={(e) => {
                      setBuyerInfo({ ...buyerInfo, name: e.target.value });
                      if (errors.name) setErrors({ ...errors, name: '' });
                    }}
                    className={`w-full px-3 lg:px-4 py-2 lg:py-3 text-sm rounded-xl border-2 outline-none transition-all ${errors.name
                      ? 'border-red-300 bg-red-50 focus:border-red-400 focus:ring-4 focus:ring-red-100'
                      : 'border-gray-100 bg-gray-50 focus:border-purple-400 focus:ring-4 focus:ring-purple-100'
                      }`}
                    placeholder="Nama lengkap Anda"
                  />
                  {errors.name && (
                    <p className="mt-1.5 text-[11px] text-red-500 font-medium flex items-center gap-1.5 ml-1">
                      <AlertCircle className="w-3 h-3" /> {errors.name}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-xs lg:text-sm font-semibold text-gray-700 mb-1 lg:mb-2 flex items-center gap-2">
                    <Phone className="w-4 h-4 text-gray-400" />
                    No. Telpon (WhatsApp)
                  </label>
                  <input
                    type="tel"
                    value={buyerInfo.phone}
                    onChange={(e) => {
                      setBuyerInfo({ ...buyerInfo, phone: e.target.value });
                      if (errors.phone) setErrors({ ...errors, phone: '' });
                    }}
                    className={`w-full px-3 lg:px-4 py-2 lg:py-3 text-sm rounded-xl border-2 outline-none transition-all ${errors.phone
                      ? 'border-red-300 bg-red-50 focus:border-red-400 focus:ring-4 focus:ring-red-100'
                      : 'border-gray-100 bg-gray-50 focus:border-purple-400 focus:ring-4 focus:ring-purple-100'
                      }`}
                    placeholder="08xxxxxxxxxx"
                  />
                  {errors.phone && (
                    <p className="mt-1.5 text-[11px] text-red-500 font-medium flex items-center gap-1.5 ml-1">
                      <AlertCircle className="w-3 h-3" /> {errors.phone}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* PAYMENT PICKER - Desktop Style */}
            <div className="hidden lg:block bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl p-8 border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <CreditCard className="w-6 h-6 text-purple-600" />
                  <h3 className="text-xl font-bold text-gray-800">
                    Metode Pembayaran
                  </h3>
                </div>
              </div>

              {/* Selected Method Display */}
              {selectedPayment ? (
                <div className="flex items-center p-4 rounded-xl border-2 border-purple-500 bg-purple-50 mb-4 transition-all shadow-sm">
                  <div className="w-12 h-8 flex items-center justify-center mr-4 bg-white rounded-lg border border-gray-100 p-1">
                    <img
                      src={paymentMethods.find((m) => m.id === selectedPayment)?.logo}
                      alt="Selected"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <span className="font-semibold text-gray-700 flex-1">
                    {paymentMethods.find((m) => m.id === selectedPayment)?.name}
                  </span>
                  <div className="bg-purple-600 text-white text-xs px-2 py-1 rounded-full font-medium">
                    Terpilih
                  </div>
                </div>
              ) : (
                <div className="p-6 text-center border-2 border-dashed border-gray-200 rounded-xl mb-4 bg-gray-50/50">
                  <p className="text-gray-400 text-sm font-medium">Belum ada metode pembayaran yang dipilih</p>
                </div>
              )}

              {/* Open Popup Button */}
              <button
                onClick={() => setOpenPopup(true)}
                className={`w-full py-3 text-sm font-semibold rounded-xl transition-all border ${selectedPayment
                  ? "text-purple-600 bg-white border-purple-200 hover:bg-purple-50 hover:border-purple-300"
                  : "text-white bg-purple-600 hover:bg-purple-700 border-transparent shadow-lg shadow-purple-200"
                  }`}
              >
                {selectedPayment ? "Ganti Metode Pembayaran" : "Pilih Metode Pembayaran"}
              </button>
            </div>

            {/* PAYMENT PICKER - Mobile Style */}
            <button
              onClick={() => setOpenPopup(true)}
              className="lg:hidden w-full bg-white rounded-2xl shadow-lg p-4 flex items-center justify-between hover:bg-gray-50 transition"
            >
              <span className="text-sm font-semibold text-gray-800">
                {selectedPayment
                  ? paymentMethods.find(m => m.id === selectedPayment)?.name
                  : 'Metode Pembayaran'}
              </span>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </button>

            {/* Terms & Conditions */}
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl p-4 lg:p-8 border border-gray-100">
              <div className="space-y-3 lg:space-y-4">
                <label className="flex items-start gap-2 lg:gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                    className="mt-0.5 lg:mt-1 w-4 h-4 lg:w-5 lg:h-5 rounded border-2 border-gray-300 text-purple-600 focus:ring-2 focus:ring-purple-500 cursor-pointer flex-shrink-0"
                  />
                  <span className="text-xs lg:text-sm text-gray-700 group-hover:text-gray-900">
                    I agree to the <span className="font-semibold text-purple-600 underline">Terms of Use</span>
                  </span>
                </label>

                <label className="flex items-start gap-2 lg:gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={agreeMarketing}
                    onChange={(e) => setAgreeMarketing(e.target.checked)}
                    className="mt-0.5 lg:mt-1 w-4 h-4 lg:w-5 lg:h-5 rounded border-2 border-gray-300 text-purple-600 focus:ring-2 focus:ring-purple-500 cursor-pointer flex-shrink-0"
                  />
                  <span className="text-xs lg:text-sm text-gray-700 group-hover:text-gray-900">
                    I agree that my email and phone number may be used to receive newsletters or marketing messages, which I can unsubscribe from at any time.
                  </span>
                </label>
              </div>
            </div>

            {/* Checkout Button */}
            <button
              onClick={handleCheckout}
              disabled={!agreeTerms || !selectedPayment || isProcessing}
              className={`w-full py-4 lg:py-5 rounded-2xl font-bold text-base lg:text-lg shadow-xl transition-all transform hover:scale-[1.02] ${agreeTerms && selectedPayment && !isProcessing
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:shadow-2xl'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
            >
              {isProcessing ? 'Memproses...' : 'Checkout'}
            </button>
          </div>

          {/* DESKTOP: Right Column - Order Summary */}
          {/* MOBILE: Top Section */}
          <div className="space-y-6 order-1 lg:order-2">
            {/* Cart Items */}
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl overflow-hidden border border-gray-100">
              <div className="bg-gradient-to-r from-pink-400 to-purple-500 p-4 lg:p-6">
                <div className="flex items-center gap-3 text-white">
                  <ShoppingCart className="w-5 h-5 lg:w-6 lg:h-6" />
                  <h2 className="text-lg lg:text-xl font-bold">Your Cart</h2>
                </div>
              </div>

              <div className="p-4 lg:p-6 space-y-4">
                {cartItems.map((item: any) => (
                  <div key={item.id} className="flex gap-3 lg:gap-4 p-3 lg:p-4 rounded-2xl bg-gradient-to-br from-pink-50 to-purple-50 border border-pink-100">
                    <div className="w-16 h-16 lg:w-20 lg:h-20 bg-white rounded-xl flex items-center justify-center text-3xl lg:text-4xl shadow-sm overflow-hidden">
                      {(item.image && (item.image.startsWith('http') || item.image.startsWith('data:') || item.image.startsWith('/'))) ? (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                            e.currentTarget.parentElement!.innerText = '👗';
                          }}
                        />
                      ) : (
                        <span>{item.image}</span>
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-sm lg:text-base text-gray-800">
                        {sanitizeProductName(item.name)}
                      </h3>
                      <p className="text-xs lg:text-sm text-gray-600">
                        {sanitizeProductName(item.category)}
                      </p>
                      <p className="text-base lg:text-lg font-bold text-purple-600 mt-1">
                        {formatRupiah(item.price)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Add-ons */}
            {addOns.length > 0 && (
              <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl p-4 lg:p-6 border border-gray-100">
                <h3 className="font-semibold text-sm lg:text-base text-gray-800 mb-4 flex items-center gap-2">
                  <Plus className="w-5 h-5 text-purple-600" />
                  List Add-ons
                </h3>
                <div className="space-y-3">
                  {addOns.map((addon: any) => (
                    <div key={addon.id} className="flex justify-between items-center text-xs lg:text-sm p-3 rounded-lg bg-gray-50 border border-gray-100">
                      <span className="text-gray-700">{addon.name}</span>
                      <span className="font-semibold text-gray-800">{formatRupiah(addon.price)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Price Summary - Desktop Only */}
            <div className="hidden lg:block bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl p-6 border border-gray-100">
              <div className="space-y-3">
                <div className="flex justify-between text-gray-700">
                  <span>Subtotal:</span>
                  <span className="font-semibold">{formatRupiah(calculateSubtotal())}</span>
                </div>
                {addOns.length > 0 && (
                  <div className="flex justify-between text-gray-700">
                    <span>Add-Ons:</span>
                    <span className="font-semibold">{formatRupiah(calculateAddOns())}</span>
                  </div>
                )}
                {discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount:</span>
                    <span className="font-semibold">-{formatRupiah(discount)}</span>
                  </div>
                )}

                <div className="border-t-2 border-gray-200 pt-3 mt-3">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-gray-800">TOTAL</span>
                    <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                      {formatRupiah(totalPrice)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* POPUP PAYMENT */}
      <PopupPayment
        open={openPopup}
        onClose={() => setOpenPopup(false)}
        methods={paymentMethods}
        selected={selectedPayment}
        onSelect={setSelectedPayment}
        onConfirm={() => setOpenPopup(false)}
      />
    </div>
  );
};

export default Payment;