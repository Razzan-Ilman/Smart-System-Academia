import React, { useState } from 'react';
import Navbar from '../../components/user/Navbar';
import PopupPayment from "../../components/user/PopupPayment";
import { ShoppingCart, CreditCard, Wallet, QrCode, ArrowLeft, CheckCircle2, User, Mail, Phone, Plus, Minus, Trash2, Package } from 'lucide-react';

const Payment = () => {
    const [openPopup, setOpenPopup] = useState(false);
    const [selectedPayment, setSelectedPayment] = useState('');
    const [agreeTerms, setAgreeTerms] = useState(false);
    const [agreeMarketing, setAgreeMarketing] = useState(false);
  
  // Mock data
  const [cartItems] = useState([
    {
      id: 1,
      name: 'Judul Produk',
      category: 'Kilas Produk',
      price: 150000,
      image: '👗',
      quantity: 1
    },
    {
      id: 2,
      name: 'Judul Produk',
      category: 'Kilas Produk',
      price: 200000,
      image: '👔',
      quantity: 1
    }
  ]);

  const [addOns] = useState([
    { id: 1, name: 'Gift Wrapping Premium', price: 25000, selected: true },
    { id: 2, name: 'Express Shipping', price: 35000, selected: true },
    { id: 3, name: 'Insurance Protection', price: 15000, selected: true }
  ]);

  const [buyerInfo, setBuyerInfo] = useState({
    email: '',
    name: '',
    phone: ''
  });

  const calculateSubtotal = () => {
    return cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  const calculateAddOns = () => {
    return addOns.filter(a => a.selected).reduce((sum, a) => sum + a.price, 0);
  };

  const discount = 50000;
  const convenienceFee = 5000;
  const totalPrice = calculateSubtotal() + calculateAddOns() - discount + convenienceFee;

  const formatRupiah = (value) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(value);
  };

  const paymentMethods = [
    { id: 'bank', name: 'Transfer Bank', icon: <CreditCard className="w-5 h-5" />, description: 'BCA, Mandiri, BNI' },
    { id: 'ewallet', name: 'E-Wallet', icon: <Wallet className="w-5 h-5" />, description: 'GoPay, OVO, Dana' },
    { id: 'qris', name: 'QRIS', icon: <QrCode className="w-5 h-5" />, description: 'Scan & Pay' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-100 relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse" style={{animationDelay: '1s'}}></div>
      
        <Navbar />

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Left Column - Buyer Info & Payment */}
          <div className="space-y-6">
            {/* Buyer Information */}
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl p-8 border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Informasi Pembeli:</h2>
              
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <Mail className="w-4 h-4 inline mr-2" />
                    Email:
                  </label>
                  <input
                    type="email"
                    value={buyerInfo.email}
                    onChange={(e) => setBuyerInfo({...buyerInfo, email: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-400 focus:ring-4 focus:ring-purple-100 outline-none transition-all"
                    placeholder="contoh@email.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <User className="w-4 h-4 inline mr-2" />
                    Name:
                  </label>
                  <input
                    type="text"
                    value={buyerInfo.name}
                    onChange={(e) => setBuyerInfo({...buyerInfo, name: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-400 focus:ring-4 focus:ring-purple-100 outline-none transition-all"
                    placeholder="Nama lengkap"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <Phone className="w-4 h-4 inline mr-2" />
                    No.Telpon:
                  </label>
                  <input
                    type="tel"
                    value={buyerInfo.phone}
                    onChange={(e) => setBuyerInfo({...buyerInfo, phone: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-400 focus:ring-4 focus:ring-purple-100 outline-none transition-all"
                    placeholder="08123456789"
                  />
                </div>
              </div>
            </div>

{/* PAYMENT PICKER TRIGGER */}
<div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl p-8 border border-gray-100">

  <div className="flex items-center justify-between">
    <div className="flex items-center gap-3">
      <CreditCard className="w-6 h-6 text-purple-600" />
      <h3 className="text-xl font-bold text-gray-800">
        Metode Pembayaran
      </h3>
    </div>

    <button
      onClick={() => setOpenPopup(true)}
      className="px-4 py-2 bg-purple-100 text-purple-700 rounded-xl hover:bg-purple-200 transition"
    >
      Pilih
    </button>
  </div>

  {selectedPayment && (
    <div className="mt-4 p-4 rounded-xl bg-purple-50 border border-purple-200 flex items-center justify-between">
      <span className="font-semibold text-purple-700">
        {
          paymentMethods.find(m => m.id === selectedPayment)?.name
        }
      </span>

      <CheckCircle2 className="text-purple-600" />
    </div>
  )}

</div>

            {/* Terms & Conditions */}
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl p-8 border border-gray-100">
              <div className="space-y-4">
                <label className="flex items-start gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                    className="mt-1 w-5 h-5 rounded border-2 border-gray-300 text-purple-600 focus:ring-2 focus:ring-purple-500 cursor-pointer"
                  />
                  <span className="text-sm text-gray-700 group-hover:text-gray-900">
                    I agree to the <span className="font-semibold text-purple-600 underline">Terms of Use</span>
                  </span>
                </label>

                <label className="flex items-start gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={agreeMarketing}
                    onChange={(e) => setAgreeMarketing(e.target.checked)}
                    className="mt-1 w-5 h-5 rounded border-2 border-gray-300 text-purple-600 focus:ring-2 focus:ring-purple-500 cursor-pointer"
                  />
                  <span className="text-sm text-gray-700 group-hover:text-gray-900">
                    I agree that my email and phone number may be used to receive newsletters or marketing messages, which I can unsubscribe from at any time.
                  </span>
                </label>
              </div>
            </div>
          </div>

          {/* Right Column - Order Summary */}
          <div className="space-y-6">
            {/* Cart Items */}
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl overflow-hidden border border-gray-100">
              <div className="bg-gradient-to-r from-pink-400 to-purple-500 p-6">
                <div className="flex items-center gap-3 text-white">
                  <ShoppingCart className="w-6 h-6" />
                  <h2 className="text-xl font-bold">Your Cart</h2>
                </div>
              </div>

              <div className="p-6 space-y-4">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex gap-4 p-4 rounded-2xl bg-gradient-to-br from-pink-50 to-purple-50 border border-pink-100">
                    <div className="w-20 h-20 bg-white rounded-xl flex items-center justify-center text-4xl shadow-sm">
                      {item.image}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800">{item.name}</h3>
                      <p className="text-sm text-gray-600">{item.category}</p>
                      <p className="text-lg font-bold text-purple-600 mt-1">
                        {formatRupiah(item.price)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Add-ons */}
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl p-6 border border-gray-100">
              <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Plus className="w-5 h-5 text-purple-600" />
                List Add-ons
              </h3>
              <div className="space-y-3">
                {addOns.map((addon) => (
                  <div key={addon.id} className="flex justify-between items-center text-sm p-3 rounded-lg bg-gray-50 border border-gray-100">
                    <span className="text-gray-700">{addon.name}</span>
                    <span className="font-semibold text-gray-800">{formatRupiah(addon.price)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Price Summary */}
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl p-6 border border-gray-100">
              <div className="space-y-3">
                <div className="flex justify-between text-gray-700">
                  <span>Subtotal:</span>
                  <span className="font-semibold">{formatRupiah(calculateSubtotal())}</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Add-Ons:</span>
                  <span className="font-semibold">{formatRupiah(calculateAddOns())}</span>
                </div>
                <div className="flex justify-between text-green-600">
                  <span>Discount:</span>
                  <span className="font-semibold">-{formatRupiah(discount)}</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Convenience fee:</span>
                  <span className="font-semibold">{formatRupiah(convenienceFee)}</span>
                </div>
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

            {/* Checkout Button */}
            <button
              disabled={!agreeTerms || !selectedPayment}
              className={`w-full py-5 rounded-2xl font-bold text-lg shadow-xl transition-all transform hover:scale-[1.02] ${
                agreeTerms && selectedPayment
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:shadow-2xl'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              Checkout
            </button>
          </div>
        </div>
      </div>
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