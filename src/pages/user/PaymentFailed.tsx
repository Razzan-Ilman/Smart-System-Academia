import React, { useState, useEffect } from 'react';
import { X, CreditCard, Wallet, Building2, QrCode } from 'lucide-react';
import PopupPayment from '../../components/user/PopupPayment';

const PaymentFailed = () => {
  const [showAnimation, setShowAnimation] = useState(false);
  const [openPopup, setOpenPopup] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState('');

  // Payment methods data
  const paymentMethods = [
    {
      id: "qris",
      name: "QRIS",
      category: "instant",
      logo: "https://upload.wikimedia.org/wikipedia/commons/7/72/QRIS_logo.svg",
      icon: <QrCode className="w-8 h-8 text-gray-600" />
    },
    {
      id: "gopay",
      name: "GoPay",
      category: "instant",
      logo: "https://upload.wikimedia.org/wikipedia/commons/8/86/GoPay_logo.svg",
      icon: <Wallet className="w-8 h-8 text-gray-600" />
    },
    {
      id: "bca",
      name: "BCA Virtual Account",
      category: "va",
      logo: "https://upload.wikimedia.org/wikipedia/commons/5/5c/Bank_Central_Asia.svg",
      icon: <Building2 className="w-8 h-8 text-gray-600" />
    },
    {
      id: "credit-card",
      name: "Credit Card",
      category: "card",
      logo: "",
      icon: <CreditCard className="w-8 h-8 text-gray-600" />
    }
  ];

  useEffect(() => {
    setShowAnimation(true);
  }, []);

  const handleMethodSelect = (methodId) => {
    setSelectedPayment(methodId);
  };

  const handleConfirm = () => {
    if (!selectedPayment) {
      alert('Mohon pilih metode pembayaran');
      return;
    }

    // Navigate based on selected payment method
    switch (selectedPayment) {
      case 'qris':
        window.location.href = '/qris';
        break;
      case 'gopay':
        window.location.href = '/gopay';
        break;
      case 'bca':
        window.location.href = '/virtual-account';
        break;
      default:
        alert('Metode pembayaran tidak tersedia');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-pink-50 relative overflow-hidden p-4 flex items-center justify-center">
      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-red-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-orange-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse" style={{animationDelay: '1s'}}></div>

      {/* Main Content */}
      <div className="relative z-10 max-w-2xl w-full">
        {/* Failed Animation */}
        <div className={`text-center mb-8 transition-all duration-700 ${showAnimation ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10'}`}>
          {/* Animated Failed Icon */}
          <div className="relative inline-block mb-6">
            {/* Animated rings */}
            <div className="absolute inset-0 animate-ping">
              <div className="w-32 h-32 rounded-full bg-red-400 opacity-20"></div>
            </div>
            <div className="absolute inset-0 animate-pulse" style={{animationDelay: '0.3s'}}>
              <div className="w-32 h-32 rounded-full bg-red-300 opacity-30"></div>
            </div>
            
            {/* Failed circle with X */}
            <div className="relative w-32 h-32 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center shadow-2xl">
              <X className="w-16 h-16 text-white animate-pulse" />
            </div>
          </div>

          <h1 className="text-4xl font-bold text-gray-800 mb-2">Payment Failed</h1>
          <p className="text-gray-600 max-w-md mx-auto">
            Sorry, your payment could not be processed at this time. Please check your payment method or try again in a few moments.
          </p>
        </div>

        {/* Payment Methods Card */}
        <div className={`bg-white rounded-3xl shadow-2xl overflow-hidden transition-all duration-700 delay-300 ${showAnimation ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="p-8">
            <h2 className="text-xl font-bold text-gray-800 mb-6 text-center">
              Change Payment Method
            </h2>

            {/* Payment Method Options */}
            <div className="space-y-3 mb-6">
              {paymentMethods.map((method) => (
                <button
                  key={method.id}
                  onClick={() => handleMethodSelect(method.id)}
                  className={`w-full p-4 rounded-xl border-2 transition-all flex items-center gap-4 hover:shadow-md ${
                    selectedPayment === method.id
                      ? 'border-purple-500 bg-purple-50'
                      : 'border-gray-200 hover:border-purple-300'
                  }`}
                >
                  <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    {method.logo ? (
                      <img 
                        src={method.logo} 
                        alt={method.name}
                        className="w-8 h-8 object-contain"
                      />
                    ) : (
                      method.icon
                    )}
                  </div>
                  <div className="flex-1 text-left">
                    <p className="font-semibold text-gray-800">{method.name}</p>
                    <p className="text-xs text-gray-500 uppercase">{method.category}</p>
                  </div>
                  {selectedPayment === method.id && (
                    <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                  )}
                </button>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                onClick={handleConfirm}
                disabled={!selectedPayment}
                className={`w-full py-4 rounded-xl font-bold text-lg transition-all transform hover:scale-[1.02] ${
                  selectedPayment
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg hover:shadow-xl'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                Continue with Selected Method
              </button>

              <button
                onClick={() => setOpenPopup(true)}
                className="w-full py-4 border-2 border-purple-600 text-purple-600 rounded-xl font-semibold hover:bg-purple-50 transition-all"
              >
                View All Payment Methods
              </button>

              <button
                onClick={() => window.location.href = '/payment'}
                className="w-full py-3 text-gray-600 hover:text-gray-800 font-medium transition-all"
              >
                Back to Checkout
              </button>
            </div>

            {/* Help Text */}
            <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-200">
              <p className="text-sm text-gray-700 text-center">
                💡 <span className="font-semibold">Need help?</span> Contact our support team if the problem persists.
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
          setOpenPopup(false);
        }}
        onConfirm={() => {
          setOpenPopup(false);
          handleConfirm();
        }}
      />
    </div>
  );
};

export default PaymentFailed;