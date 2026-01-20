import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart, CreditCard, CheckCircle2, User, Mail, Phone, Plus, Menu, ChevronRight } from 'lucide-react';
import Navbar from '../../components/user/Navbar';

// Mock PopupPayment Component
type PaymentMethod = {
  id: string;
  name: string;
  category?: string;
  logo: string;
};

interface PopupPaymentProps {
  open: boolean;
  onClose: () => void;
  methods: PaymentMethod[];
  selected: string;
  onSelect: (id: string) => void;
  onConfirm: () => void;
}

const PopupPayment: React.FC<PopupPaymentProps> = ({ open, onClose, methods, selected, onSelect, onConfirm }) => {
  if (!open) return null;
  
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl w-full max-w-md p-6">
        <h2 className="text-xl font-bold mb-4">Pilih Metode Pembayaran</h2>
        <div className="space-y-3">
          {methods.map((method) => (
            <button
              key={method.id}
              onClick={() => onSelect(method.id)}
              className={`w-full p-4 rounded-xl border-2 flex items-center gap-3 transition ${
                selected === method.id
                  ? 'border-purple-500 bg-purple-50'
                  : 'border-gray-200 hover:border-purple-300'
              }`}
            >
              <img src={method.logo} alt={method.name} className="h-8 object-contain" />
              <span className="flex-1 text-left font-semibold">{method.name}</span>
              {selected === method.id && <CheckCircle2 className="text-purple-600" />}
            </button>
          ))}
        </div>
        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-xl border-2 border-gray-300 font-semibold hover:bg-gray-50"
          >
            Batal
          </button>
          <button
            onClick={onConfirm}
            disabled={!selected}
            className={`flex-1 py-3 rounded-xl font-semibold ${
              selected
                ? 'bg-purple-600 text-white hover:bg-purple-700'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            Konfirmasi
          </button>
        </div>
      </div>
    </div>
  );
};

const Payment = () => {
  const [openPopup, setOpenPopup] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [agreeMarketing, setAgreeMarketing] = useState(false);

  // ================= DATA CART =================
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

  // ================= PAYMENT METHODS =================
  const paymentMethods = [
    {
      id: "qris",
      name: "QRIS",
      category: "instant",
      logo: "https://upload.wikimedia.org/wikipedia/commons/7/72/QRIS_logo.svg",
    },
    {
      id: "gopay",
      name: "GoPay",
      category: "instant",
      logo: "https://upload.wikimedia.org/wikipedia/commons/8/86/GoPay_logo.svg",
    },
    {
      id: "bca",
      name: "BCA Virtual Account",
      category: "va",
      logo: "https://upload.wikimedia.org/wikipedia/commons/5/5c/Bank_Central_Asia.svg",
    },
  ];

  // ================= CALCULATION =================
  const calculateSubtotal = () =>
    cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const calculateAddOns = () =>
    addOns.filter(a => a.selected).reduce((sum, a) => sum + a.price, 0);

  const discount = 50000;
  const convenienceFee = 5000;

  const totalPrice =
    calculateSubtotal() + calculateAddOns() - discount + convenienceFee;

  const formatRupiah = (value) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(value);

  // ================= CHECKOUT HANDLER =================
const navigate = useNavigate();   // ← TAMBAH INI DI ATAS COMPONENT

const handleCheckout = () => {
  if (!buyerInfo.email || !buyerInfo.name || !buyerInfo.phone) {
    alert('Mohon lengkapi semua informasi pembeli');
    return;
  }

  if (!agreeTerms) {
    alert('Mohon setujui syarat dan ketentuan');
    return;
  }

  if (!selectedPayment) {
    alert('Mohon pilih metode pembayaran');
    return;
  }

  // ========== INI BAGIAN PENTING ==========
  if (selectedPayment === "qris") {
    navigate("/qris", {
      state: {
        amount: totalPrice,
        email: buyerInfo.email,
        name: buyerInfo.name,
        phone: buyerInfo.phone,
        orderId: `ORD-${Date.now()}`
      }
    });
    return;
  }

  alert("Metode lain belum diintegrasikan");
};

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-100 relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse" style={{animationDelay: '1s'}}></div>
      
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
                <div className="flex justify-between text-gray-700">
                  <span>Discount</span>
                  <span className="font-semibold text-green-600">-{formatRupiah(discount)}</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Add-Ons</span>
                  <span className="font-semibold">{formatRupiah(calculateAddOns())}</span>
                </div>
                <div className="flex justify-between text-gray-700 pb-2 border-b border-gray-200">
                  <span>Convenience fee</span>
                  <span className="font-semibold">{formatRupiah(convenienceFee)}</span>
                </div>
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
              
              <div className="space-y-3 lg:space-y-5">
                <div>
                  <label className="block text-xs lg:text-sm font-semibold text-gray-700 mb-1 lg:mb-2">
                    <Mail className="w-4 h-4 inline mr-2 hidden lg:inline" />
                    Email:
                  </label>
                  <input
                    type="email"
                    value={buyerInfo.email}
                    onChange={(e) => setBuyerInfo({...buyerInfo, email: e.target.value})}
                    className="w-full px-3 lg:px-4 py-2 lg:py-3 text-sm rounded-xl border-2 border-gray-200 focus:border-purple-400 focus:ring-4 focus:ring-purple-100 outline-none transition-all"
                    placeholder="contoh@email.com"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs lg:text-sm font-semibold text-gray-700 mb-1 lg:mb-2">
                    <User className="w-4 h-4 inline mr-2 hidden lg:inline" />
                    Name:
                  </label>
                  <input
                    type="text"
                    value={buyerInfo.name}
                    onChange={(e) => setBuyerInfo({...buyerInfo, name: e.target.value})}
                    className="w-full px-3 lg:px-4 py-2 lg:py-3 text-sm rounded-xl border-2 border-gray-200 focus:border-purple-400 focus:ring-4 focus:ring-purple-100 outline-none transition-all"
                    placeholder="Nama lengkap"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs lg:text-sm font-semibold text-gray-700 mb-1 lg:mb-2">
                    <Phone className="w-4 h-4 inline mr-2 hidden lg:inline" />
                    No.Telpon:
                  </label>
                  <input
                    type="tel"
                    value={buyerInfo.phone}
                    onChange={(e) => setBuyerInfo({...buyerInfo, phone: e.target.value})}
                    className="w-full px-3 lg:px-4 py-2 lg:py-3 text-sm rounded-xl border-2 border-gray-200 focus:border-purple-400 focus:ring-4 focus:ring-purple-100 outline-none transition-all"
                    placeholder="08123456789"
                    required
                  />
                </div>
              </div>
            </div>

            {/* PAYMENT PICKER - Desktop Style */}
            <div className="hidden lg:block bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl p-8 border border-gray-100">
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
                <div className="mt-4 p-4 rounded-xl bg-purple-50 border border-purple-200 flex items-center gap-3">
                  <img 
                    src={paymentMethods.find(m => m.id === selectedPayment)?.logo} 
                    alt={paymentMethods.find(m => m.id === selectedPayment)?.name}
                    className="h-6 object-contain"
                  />
                  <span className="font-semibold text-purple-700 flex-1">
                    {paymentMethods.find(m => m.id === selectedPayment)?.name}
                  </span>
                  <CheckCircle2 className="text-purple-600" />
                </div>
              )}
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
              disabled={!agreeTerms || !selectedPayment}
              className={`w-full py-4 lg:py-5 rounded-2xl font-bold text-base lg:text-lg shadow-xl transition-all transform hover:scale-[1.02] ${
                agreeTerms && selectedPayment
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:shadow-2xl'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              Checkout
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
                {cartItems.map((item) => (
                  <div key={item.id} className="flex gap-3 lg:gap-4 p-3 lg:p-4 rounded-2xl bg-gradient-to-br from-pink-50 to-purple-50 border border-pink-100">
                    <div className="w-16 h-16 lg:w-20 lg:h-20 bg-white rounded-xl flex items-center justify-center text-3xl lg:text-4xl shadow-sm">
                      {item.image}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-sm lg:text-base text-gray-800">{item.name}</h3>
                      <p className="text-xs lg:text-sm text-gray-600">{item.category}</p>
                      <p className="text-base lg:text-lg font-bold text-purple-600 mt-1">
                        {formatRupiah(item.price)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Add-ons */}
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl p-4 lg:p-6 border border-gray-100">
              <h3 className="font-semibold text-sm lg:text-base text-gray-800 mb-4 flex items-center gap-2">
                <Plus className="w-5 h-5 text-purple-600" />
                List Add-ons
              </h3>
              <div className="space-y-3">
                {addOns.map((addon) => (
                  <div key={addon.id} className="flex justify-between items-center text-xs lg:text-sm p-3 rounded-lg bg-gray-50 border border-gray-100">
                    <span className="text-gray-700">{addon.name}</span>
                    <span className="font-semibold text-gray-800">{formatRupiah(addon.price)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Price Summary - Desktop Only */}
            <div className="hidden lg:block bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl p-6 border border-gray-100">
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