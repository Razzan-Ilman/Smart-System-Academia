import React, { useState, useEffect } from 'react';
import { X, QrCode, Wallet, Building2, CreditCard, CheckCircle2 } from 'lucide-react';
import PopupPayment from '../../components/user/PopupPayment';
import { useNavigate, useLocation } from 'react-router-dom';
import { paymentMethods, type PaymentMethodType } from '../../constants/paymentMethods';
import { createTransaction as apiCreateTransaction } from '../../services/transactionService';
import { toast } from 'sonner';

const PaymentFailed = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showAnimation, setShowAnimation] = useState(false);
  const [openPopup, setOpenPopup] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState('');
  const [recommendedMethods, setRecommendedMethods] = useState<PaymentMethodType[]>([]);

  // Initialize random recommendations on mount
  useEffect(() => {
    setShowAnimation(true);
    const shuffled = [...paymentMethods].sort(() => 0.5 - Math.random());
    setRecommendedMethods(shuffled.slice(0, 4));
  }, []);

  const handleMethodSelect = (methodId: string) => {
    setSelectedPayment(methodId);
  };

  const handleConfirm = async () => {
    if (!selectedPayment) {
      toast.error('Mohon pilih metode pembayaran');
      return;
    }

    // Reuse existing data if available, otherwise just redirect
    // Ideally we would trigger a new transaction or update the existing one here
    // For now, we mimic the logic from Payment.tsx to navigate to the correct page

    // Determine category
    const method = paymentMethods.find(m => m.id === selectedPayment);
    if (!method) return;

    if (selectedPayment === 'qris') {
      navigate('/qris', { state: { ...location.state, paymentMethod: 'qris' } });
    } else if (method.category === 'Virtual Account' || ['bca', 'mandiri', 'bri', 'permata', 'bsi', 'bni', 'cimb', 'mandiri_va', 'muamalat', 'sinarmas', 'bnc', 'maybank'].includes(selectedPayment)) {
      navigate('/virtual-account', { state: { ...location.state, paymentMethod: selectedPayment } });
    } else if (['indomaret', 'alfamart'].includes(selectedPayment)) {
      navigate('/minimarket-payment', { state: { ...location.state, paymentMethod: selectedPayment } });
    } else {
      toast.error('Metode pembayaran ini sedang dalam pemeliharaan');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-pink-50 relative overflow-hidden p-4 flex items-center justify-center">
      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-red-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-orange-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse" style={{ animationDelay: '1s' }}></div>

      {/* Main Content */}
      <div className="relative z-10 max-w-2xl w-full">
        {/* Failed Animation */}
        <div className={`text-center mb-8 transition-all duration-700 ${showAnimation ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10'}`}>
          {/* Animated Failed Icon */}
          <div className="relative inline-block mb-6">
            <div className="absolute inset-0 animate-ping">
              <div className="w-32 h-32 rounded-full bg-red-400 opacity-20"></div>
            </div>
            <div className="absolute inset-0 animate-pulse" style={{ animationDelay: '0.3s' }}>
              <div className="w-32 h-32 rounded-full bg-red-300 opacity-30"></div>
            </div>

            <div className="relative w-32 h-32 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center shadow-2xl">
              <X className="w-16 h-16 text-white animate-pulse" />
            </div>
          </div>

          <h1 className="text-4xl font-bold text-gray-800 mb-2">Payment Failed</h1>
          <p className="text-gray-600 max-w-md mx-auto">
            Maaf, pembayaran Anda tidak dapat diproses saat ini. Silakan pilih metode pembayaran lain atau coba lagi nanti.
          </p>
        </div>

        {/* Payment Methods Card */}
        <div className={`bg-white rounded-3xl shadow-2xl overflow-hidden transition-all duration-700 delay-300 ${showAnimation ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="p-8">
            <h2 className="text-xl font-bold text-gray-800 mb-6 text-center">
              Ganti Metode Pembayaran
            </h2>

            {/* Payment Method Options (Random 4) */}
            <div className="space-y-3 mb-6">
              {recommendedMethods.map((method) => (
                <div
                  key={method.id}
                  onClick={() => handleMethodSelect(method.id)}
                  className={`w-full p-4 rounded-xl border-2 transition-all flex items-center gap-4 cursor-pointer hover:shadow-md ${selectedPayment === method.id
                    ? 'border-purple-500 bg-purple-50'
                    : 'border-gray-200 hover:border-purple-300 bg-white'
                    }`}
                >
                  <div className="w-12 h-10 bg-white border border-gray-100 rounded-lg flex items-center justify-center flex-shrink-0 p-1">
                    <img
                      src={method.logo}
                      alt={method.name}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="font-semibold text-gray-800 text-sm">{method.name}</p>
                    <p className="text-xs text-gray-500 uppercase">{method.category}</p>
                  </div>
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${selectedPayment === method.id ? 'border-purple-600' : 'border-gray-300'}`}>
                    {selectedPayment === method.id && <div className="w-2.5 h-2.5 rounded-full bg-purple-600" />}
                  </div>
                </div>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                onClick={handleConfirm}
                disabled={!selectedPayment}
                className={`w-full py-4 rounded-xl font-bold text-lg transition-all transform hover:scale-[1.02] ${selectedPayment
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg hover:shadow-xl'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
              >
                Lanjut dengan Metode Dipilih
              </button>

              <button
                onClick={() => setOpenPopup(true)}
                className="w-full py-4 border-2 border-purple-600 text-purple-600 rounded-xl font-semibold hover:bg-purple-50 transition-all"
              >
                Lihat Semua Metode Pembayaran
              </button>

              <button
                onClick={() => {
                  // Try to merge stored checkout with current state (current state can contain order info only)
                  const stored = (() => {
                    try {
                      return JSON.parse(localStorage.getItem('checkout_state') || 'null');
                    } catch {
                      return null;
                    }
                  })();
                  const gotoState = { ...(stored || {}), ...(location.state || {}) };
                  navigate('/payment', { state: gotoState });
                }}
                className="w-full py-3 text-gray-600 hover:text-gray-800 font-medium transition-all"
              >
                Kembali ke Checkout
              </button>
            </div>

            {/* Help Text */}
            <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-200">
              <p className="text-sm text-gray-700 text-center">
                💡 <span className="font-semibold">Butuh bantuan?</span> Hubungi tim support kami jika masalah berlanjut.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Popup Payment Modal */}
      <PopupPayment
        open={openPopup}
        onClose={() => setOpenPopup(false)}
        methods={paymentMethods}
        selected={selectedPayment}
        onSelect={(id) => {
          setSelectedPayment(id);
          // Optional: Auto confirm on selection from popup or just close? 
          // Default behavior usually is select then confirm. 
          // Keeping consistent with Payment.tsx: Select updates state, confirm is manual or separate.
          // But here let's just update selection.
        }}
        onConfirm={() => {
          setOpenPopup(false);
          // If user clicked confirm in popup, usually means they want to proceed.
          // But PopupPayment props might just be pure selection.
          // Checking PopupPayment implementation: it has onConfirm prop which is called by its button.
          // So typically:
          handleConfirm();
        }}
      />
    </div>
  );
};

export default PaymentFailed;