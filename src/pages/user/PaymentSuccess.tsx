import React, { useState, useEffect } from 'react';
import { CheckCircle2, Copy, Download, Home } from 'lucide-react';

const PaymentSuccess = () => {
  const [copied, setCopied] = useState(false);
  const [showAnimation, setShowAnimation] = useState(false);

  // Sample data - in real app, get from props or context
  const orderNumber = 'ORD-1768804250238';
  const totalAmount = 380000;
  const buyerEmail = 'zaidan@gmail.com';
  
  const cartItems = [
    {
      id: 1,
      name: 'Nama Produk',
      image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200',
      price: 150000,
      quantity: 1
    },
    {
      id: 2,
      name: 'Nama Produk',
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200',
      price: 230000,
      quantity: 1
    }
  ];

  const downloadLink = `https://youtu.be/ks4uigFnG-U?si=Vmx2TKk_WZa8p_rx`;

  useEffect(() => {
    setShowAnimation(true);
  }, []);

  const formatRupiah = (value) =>
    new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(value);

  const handleCopy = () => {
    navigator.clipboard.writeText(downloadLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-100 to-blue-100 relative overflow-hidden p-4">
      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse" style={{animationDelay: '1s'}}></div>

      {/* Main Content */}
      <div className="relative z-10 max-w-2xl mx-auto py-12">
        {/* Success Animation */}
        <div className={`text-center mb-8 transition-all duration-700 ${showAnimation ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10'}`}>
          {/* Animated Success Icon */}
          <div className="relative inline-block mb-6">
            {/* Animated rings */}
            <div className="absolute inset-0 animate-ping">
              <div className="w-32 h-32 rounded-full bg-green-400 opacity-20"></div>
            </div>
            <div className="absolute inset-0 animate-pulse" style={{animationDelay: '0.3s'}}>
              <div className="w-32 h-32 rounded-full bg-green-300 opacity-30"></div>
            </div>
            
            {/* Success circle with checkmark */}
            <div className="relative w-32 h-32 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center shadow-2xl">
              <CheckCircle2 className="w-16 h-16 text-white animate-bounce" style={{animationDuration: '1s'}} />
            </div>
          </div>

          <h1 className="text-4xl font-bold text-gray-800 mb-2">Success</h1>
          <p className="text-lg text-gray-600">Thank you for your purchase</p>
        </div>

        {/* Purchase Details Card */}
        <div className={`bg-white rounded-3xl shadow-2xl overflow-hidden transition-all duration-700 delay-300 ${showAnimation ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="p-8">
            {/* Cart Items */}
            <div className="space-y-4 mb-6">
              {cartItems.map((item) => (
                <div key={item.id} className="flex gap-4 items-center">
                  <div className="w-20 h-20 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0">
                    <img 
                      src={item.image} 
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800 mb-1">{item.name}</h3>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-800">{formatRupiah(item.price)}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Total */}
            <div className="border-t border-gray-200 pt-4 mb-6">
              <div className="flex justify-between items-center">
                <span className="text-lg font-bold text-gray-800">Total</span>
                <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  {formatRupiah(totalAmount)}
                </span>
              </div>
            </div>

            {/* Download Link */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-200">
              <h3 className="font-bold text-gray-800 mb-3">Here is Link Your Purchase:</h3>
              
              <div className="bg-white rounded-xl p-4 border-2 border-dashed border-green-300">
                <div className="flex items-center gap-3">
                  <div className="flex-1 overflow-hidden">
                    <p className="text-green-600 font-medium break-all text-sm">
                      {downloadLink}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">Add-On Link</p>
                  </div>
                  <button
                    onClick={handleCopy}
                    className="flex items-center gap-2 px-4 py-2 bg-white border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition-all flex-shrink-0"
                  >
                    {copied ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-green-600" />
                        <span className="text-sm font-medium text-green-600">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4 text-gray-600" />
                        <span className="text-sm font-medium text-gray-700">Copy</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-6 space-y-3">
              <button
                onClick={() => window.open(downloadLink, '_blank')}
                className="w-full py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all transform hover:scale-[1.02] flex items-center justify-center gap-2"
              >
                <Download className="w-5 h-5" />
                Open Download Link
              </button>
              
              <button
                onClick={() => window.location.href = '/'}
                className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all transform hover:scale-[1.02] flex items-center justify-center gap-2"
              >
                <Home className="w-5 h-5" />
                Back to Home
              </button>
            </div>

            {/* Email Notification */}
            {buyerEmail && (
              <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-200">
                <p className="text-sm text-gray-700 text-center">
                  📧 Receipt has been sent to <span className="font-semibold text-blue-600">{buyerEmail}</span>
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Confetti Effect */}
        {showAnimation && (
          <div className="fixed inset-0 pointer-events-none overflow-hidden z-50">
            {Array.from({length: 50}).map((_, i) => (
              <div
                key={i}
                className="absolute animate-confetti"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: '-10%',
                  animationDelay: `${Math.random() * 2}s`,
                  animationDuration: `${3 + Math.random() * 2}s`
                }}
              >
                <div 
                  className="w-3 h-3 rounded-full"
                  style={{
                    backgroundColor: ['#f97316', '#ec4899', '#8b5cf6', '#10b981', '#3b82f6'][Math.floor(Math.random() * 5)]
                  }}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      <style>{`
        @keyframes confetti {
          0% {
            transform: translateY(0) rotateZ(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotateZ(720deg);
            opacity: 0;
          }
        }
        .animate-confetti {
          animation: confetti linear forwards;
        }
      `}</style>
    </div>
  );
};

export default PaymentSuccess;