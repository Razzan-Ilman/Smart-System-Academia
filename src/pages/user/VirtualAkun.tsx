import { useState, useEffect, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Copy, Check, Clock, Building2, AlertCircle, RefreshCw, CheckCircle2 } from 'lucide-react';
import Navbar from '../../components/user/Navbar';
import { checkPaymentStatus as checkPaymentAPI } from '../../services/transactionService';
import { toast } from 'sonner';

const VirtualAccount = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);
  const [timeLeft, setTimeLeft] = useState(24 * 60 * 60);
  const [isChecking, setIsChecking] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState('pending');

  // Data dari payment page
  const { amount, email, name, phone, orderId, paymentMethod, transactionData } = location.state || {};

  // ✅ Get real VA Number from transaction data
  const vaNumber = useMemo(() => {
    if (transactionData) {
      const realVA =
        transactionData.virtual_account ||
        transactionData.va_number ||
        transactionData.payment_code ||
        transactionData.bill_key ||
        transactionData.biller_code ||
        transactionData.payment_data?.va_number ||
        transactionData.payment_data?.account_number;

      if (realVA) return realVA;
    }

    // Fallback jika tidak ada data VA (seharusnya tidak terjadi di production)
    if (!orderId) {
      return `8808${Math.floor(Math.random() * 10000000000000).toString().padStart(13, '0')}`;
    }
    const timestamp = orderId.split('-')[1] || Date.now().toString();
    const vaDigits = timestamp.slice(-13).padStart(13, '0');
    return `8808${vaDigits}`;
  }, [orderId, transactionData]);

  // Bank info
  const bankInfo = {
    bca: {
      name: 'BCA',
      color: 'from-blue-600 to-blue-700',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/Bank_Central_Asia.svg/320px-Bank_Central_Asia.svg.png'
    },
    mandiri: {
      name: 'Bank Mandiri',
      color: 'from-yellow-500 to-orange-600',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ad/Bank_Mandiri_logo_2016.svg/320px-Bank_Mandiri_logo_2016.svg.png'
    },
    bri: {
      name: 'BRI',
      color: 'from-blue-500 to-blue-600',
      logo: '/payment/BRI.jpeg'
    },
    bni: {
      name: 'BNI',
      color: 'from-orange-500 to-orange-600',
      logo: 'https://upload.wikimedia.org/wikipedia/id/thumb/5/55/BNI_logo.svg/320px-BNI_logo.svg.png'
    },
    permata: {
      name: 'Permata Bank',
      color: 'from-green-600 to-green-700',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/Bank_Permata_logo.svg/320px-Bank_Permata_logo.svg.png'
    },
    bsi: {
      name: 'Bank Syariah Indonesia',
      color: 'from-teal-600 to-teal-700',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a0/Bank_Syariah_Indonesia.svg/320px-Bank_Syariah_Indonesia.svg.png'
    },
    cimb: {
      name: 'CIMB Niaga',
      color: 'from-red-600 to-red-700',
      logo: '/payment/CIMB_Niaga.jpeg'
    },
    sinarmas: {
      name: 'Bank Sinarmas',
      color: 'from-red-500 to-red-600',
      logo: '/payment/Bank_Sinarmas.jpeg'
    },
    muamalat: {
      name: 'Bank Muamalat',
      color: 'from-purple-700 to-purple-800',
      logo: '/payment/Bank_Muamalat.jpeg'
    },
    bnc: {
      name: 'Bank Neo Commerce',
      color: 'from-yellow-400 to-yellow-500',
      logo: '/payment/Bank_Neo_Commerce.jpeg'
    },
    maybank: {
      name: 'Maybank',
      color: 'from-yellow-500 to-yellow-600',
      logo: '/payment/MayBank.jpeg'
    },
    indomaret: {
      name: 'Indomaret',
      color: 'from-blue-600 to-red-600',
      logo: '/payment/Indomaret.jpeg'
    },
    alfamart: {
      name: 'Alfamart',
      color: 'from-red-600 to-red-700',
      logo: '/payment/Alfamart.jpeg'
    },
    default: {
      name: 'Virtual Account',
      color: 'from-purple-600 to-pink-600',
      logo: ''
    }
  };

  const currentBank = bankInfo[paymentMethod as keyof typeof bankInfo] || bankInfo.default;

  // ✅ Timer countdown
  useEffect(() => {
    let initialSeconds = 24 * 60 * 60;

    if (transactionData) {
      const expiryString =
        transactionData.expiry_time ||
        transactionData.expired_at ||
        transactionData.expiry_date ||
        transactionData.payment_data?.expiry_time;

      if (expiryString) {
        const expiryDate = new Date(expiryString).getTime();
        const now = new Date().getTime();
        const diff = Math.floor((expiryDate - now) / 1000);
        if (diff > 0) initialSeconds = diff;
      }
    }

    setTimeLeft(initialSeconds);

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 0) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [transactionData]);

  // Format helpers
  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const formatRupiah = (value: number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(value);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success('Disalin ke clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  // ✅ CHECK PAYMENT STATUS (menggunakan endpoint backend proxy)
  const checkPaymentStatus = async () => {
    if (isChecking || !orderId) return;

    setIsChecking(true);
    setPaymentStatus('checking');

    try {
      // ✅ Gunakan checkPaymentAPI dari service (yang sudah mengarah ke backend proxy)
      const result = await checkPaymentAPI(orderId);

      // ✅ Normalisasi status dari berbagai kemungkinan response
      const status =
        result?.data?.payment_status ||
        result?.data?.status ||
        result?.payment_status ||
        result?.status;

      const statusLower = (status || '').toLowerCase();

      if (['paid', 'success', 'settlement', 'completed'].includes(statusLower)) {
        setPaymentStatus('success');
        toast.success('Pembayaran berhasil! 🎉');

        setTimeout(() => {
          navigate('/payment-success', {
            state: {
              orderId,
              amount,
              paymentMethod: currentBank.name,
              vaNumber,
              name,
              email,
              items: location.state?.items || []
            }
          });
        }, 2000);
      } else if (['failed', 'expired', 'cancel', 'cancelled', 'expire'].includes(statusLower)) {
        setPaymentStatus('failed');
        toast.error('Pembayaran gagal atau kadaluarsa ❌');


        setTimeout(() => {
          navigate('/payment-failed', {
            state: {
              ...location.state, // Preserve original state
              orderId,
              amount,
              paymentMethod: currentBank.name,
              reason: 'Pembayaran gagal atau expired'
            }
          });
        }, 2000);
      } else {
        // Status masih pending
        setPaymentStatus('pending');
      }
    } catch (error: any) {
      console.error('❌ Check status error:', error);
      setPaymentStatus('pending');

      // Hanya tampilkan error jika bukan auto-check
      if (document.activeElement?.id === 'btn-check-status') {
        const errorMsg = error.response?.data?.message || 'Gagal memeriksa status pembayaran';
        toast.error(errorMsg);
      }
    } finally {
      setIsChecking(false);
    }
  };

  // ✅ Auto-poll every 5 seconds (hanya jika status pending)
  useEffect(() => {
    if (paymentStatus !== 'pending' || !orderId) return;

    // Initial check setelah 3 detik
    const timeout = setTimeout(() => {
      checkPaymentStatus();

      // Lalu polling setiap 5 detik
      const interval = setInterval(() => {
        checkPaymentStatus();
      }, 5000);

      return () => clearInterval(interval);
    }, 3000);

    return () => clearTimeout(timeout);
  }, [paymentStatus, orderId]);

  const handleCancelPayment = () => {
    setShowCancelModal(false);
    toast.info('Pembayaran dibatalkan');
    // Navigate back with original state to preserve product info
    navigate('/payment', {
      replace: true,
      state: location.state
    });
  };

  // ✅ Redirect jika tidak ada data
  useEffect(() => {
    if (!orderId || !amount) {
      toast.error('Data pembayaran tidak valid');
      // Preserve original checkout state when redirecting back
      navigate('/payment', { replace: true, state: location.state });
    }
  }, [orderId, amount, navigate, location.state]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-100 relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse" style={{ animationDelay: '1s' }}></div>

      <Navbar />

      {/* Main Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 py-8">
        {/* Status Badge */}
        <div className="mb-4 flex justify-center">
          {paymentStatus === 'pending' && (
            <div className="inline-flex items-center gap-2 px-6 py-3 bg-yellow-100 border-2 border-yellow-400 text-yellow-800 rounded-full font-bold shadow-lg">
              <div className="w-3 h-3 bg-yellow-500 rounded-full animate-pulse"></div>
              🟡 MENUNGGU PEMBAYARAN
            </div>
          )}
          {paymentStatus === 'success' && (
            <div className="inline-flex items-center gap-2 px-6 py-3 bg-green-100 border-2 border-green-400 text-green-800 rounded-full font-bold shadow-lg">
              <CheckCircle2 className="w-5 h-5" />
              🟢 PEMBAYARAN BERHASIL
            </div>
          )}
          {paymentStatus === 'failed' && (
            <div className="inline-flex items-center gap-2 px-6 py-3 bg-red-100 border-2 border-red-400 text-red-800 rounded-full font-bold shadow-lg">
              <AlertCircle className="w-5 h-5" />
              🔴 PEMBAYARAN KADALUARSA
            </div>
          )}
          {paymentStatus === 'checking' && (
            <div className="inline-flex items-center gap-2 px-6 py-3 bg-blue-100 border-2 border-blue-400 text-blue-800 rounded-full font-bold shadow-lg">
              <RefreshCw className="w-4 h-4 animate-spin" />
              Memeriksa Status...
            </div>
          )}
        </div>

        {/* Timer Warning */}
        <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-2xl p-4 mb-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Clock className="w-6 h-6" />
              <div>
                <p className="font-semibold">Selesaikan Pembayaran Dalam:</p>
                <p className="text-sm opacity-90">Pesanan akan otomatis dibatalkan jika waktu habis</p>
              </div>
            </div>
            <div className="text-3xl font-bold tabular-nums">
              {formatTime(timeLeft)}
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Virtual Account Info */}
          <div className="space-y-6">
            {/* Bank Card */}
            <div className={`bg-gradient-to-br ${currentBank.color} rounded-3xl shadow-2xl p-8 text-white relative overflow-hidden`}>
              <div className="absolute top-0 right-0 w-40 h-40 bg-white opacity-10 rounded-full -mr-20 -mt-20"></div>
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-white opacity-10 rounded-full -ml-16 -mb-16"></div>

              <div className="relative z-10">
                <div className="flex items-center justify-between mb-8">
                  <Building2 className="w-8 h-8" />
                  {currentBank.logo && (
                    <img src={currentBank.logo} alt={currentBank.name} className="h-8 object-contain bg-white px-3 py-1 rounded" />
                  )}
                </div>

                <div className="mb-6">
                  <p className="text-sm opacity-80 mb-2">Virtual Account Number</p>
                  <div className="flex items-center justify-between bg-white/20 backdrop-blur-sm rounded-xl p-4">
                    <p className="text-2xl font-bold tracking-wider">{vaNumber}</p>
                    <button
                      onClick={() => copyToClipboard(vaNumber)}
                      className="ml-4 p-2 bg-white/20 hover:bg-white/30 rounded-lg transition"
                      aria-label="Copy VA Number"
                    >
                      {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <div>
                  <p className="text-sm opacity-80 mb-2">Total Pembayaran</p>
                  <p className="text-3xl font-bold">{formatRupiah(amount)}</p>
                </div>
              </div>
            </div>

            {/* Payment Instructions */}
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl p-6 border border-gray-100">
              <h3 className="font-bold text-lg text-gray-800 mb-4">Cara Pembayaran</h3>

              <div className="space-y-3">
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                    <span className="text-purple-600 font-bold text-sm">1</span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">Pilih Transfer Bank</p>
                    <p className="text-sm text-gray-600">Buka aplikasi m-banking atau datang ke ATM {currentBank.name}</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                    <span className="text-purple-600 font-bold text-sm">2</span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">Masukkan Nomor VA</p>
                    <p className="text-sm text-gray-600">Salin dan masukkan nomor Virtual Account di atas</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                    <span className="text-purple-600 font-bold text-sm">3</span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">Konfirmasi Pembayaran</p>
                    <p className="text-sm text-gray-600">Periksa detail dan konfirmasi pembayaran sebesar {formatRupiah(amount)}</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                    <span className="text-purple-600 font-bold text-sm">4</span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">Selesai</p>
                    <p className="text-sm text-gray-600">Pembayaran akan dikonfirmasi otomatis dalam beberapa menit</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Order Details */}
          <div className="space-y-6">
            {/* Order Info */}
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl p-6 border border-gray-100">
              <h3 className="font-bold text-lg text-gray-800 mb-4">Detail Pesanan</h3>

              <div className="space-y-3">
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600 text-sm">Order ID</span>
                  <span className="font-semibold text-gray-800 text-sm">{orderId}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600 text-sm">Nama</span>
                  <span className="font-semibold text-gray-800 text-sm">{name}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600 text-sm">Email</span>
                  <span className="font-semibold text-gray-800 text-sm">{email}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600 text-sm">No. Telepon</span>
                  <span className="font-semibold text-gray-800 text-sm">{phone}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-gray-600 text-sm">Metode Pembayaran</span>
                  <span className="font-semibold text-gray-800 text-sm">Virtual Account – {currentBank.name}</span>
                </div>
              </div>
            </div>

            {/* Manual Check Button */}
            <button
              id="btn-check-status"
              onClick={checkPaymentStatus}
              disabled={isChecking || paymentStatus === 'success'}
              className="w-full py-4 rounded-2xl font-semibold bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg"
            >
              <RefreshCw className={`w-5 h-5 ${isChecking ? 'animate-spin' : ''}`} />
              {isChecking ? 'Memeriksa...' : 'Cek Status Pembayaran'}
            </button>

            {/* Auto Check Info */}
            <div className="bg-purple-50 border-2 border-purple-200 rounded-2xl p-6 text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <RefreshCw className={`w-5 h-5 text-purple-600 ${paymentStatus === 'pending' ? 'animate-spin' : ''}`} />
                <p className="font-semibold text-purple-900">Pembaruan Otomatis</p>
              </div>
              {paymentStatus === 'pending' && (
                <p className="text-sm text-purple-700">
                  Status diperbarui otomatis setiap 5 detik
                </p>
              )}
              {paymentStatus === 'success' && (
                <p className="text-sm text-green-700 font-semibold">
                  ✓ Pembayaran berhasil dikonfirmasi
                </p>
              )}
            </div>

            {/* Cancel Button */}
            <button
              onClick={() => setShowCancelModal(true)}
              disabled={paymentStatus === 'success' || paymentStatus === 'checking'}
              className="w-full py-4 rounded-2xl font-semibold text-gray-600 bg-white border-2 border-gray-200 hover:border-red-300 hover:bg-red-50 hover:text-red-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Batalkan Pembayaran
            </button>

            {/* Important Notes */}
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
              <div className="flex gap-3">
                <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-amber-900 text-sm mb-2">Penting!</p>
                  <ul className="text-sm text-amber-800 space-y-1 list-disc list-inside">
                    <li>Transfer sesuai nominal yang tertera</li>
                    <li>Sistem mendeteksi pembayaran otomatis</li>
                    <li>Simpan bukti transfer</li>
                    <li>Jika 10 menit belum update, hubungi admin</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Cancel Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Batalkan Pembayaran?</h3>
              <p className="text-gray-600 mb-6">
                Nomor Virtual Account akan hangus dan Anda harus membuat pesanan baru.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowCancelModal(false)}
                  className="flex-1 py-3 rounded-xl font-semibold bg-gray-100 text-gray-700 hover:bg-gray-200 transition-all"
                >
                  Tidak
                </button>
                <button
                  onClick={handleCancelPayment}
                  className="flex-1 py-3 rounded-xl font-semibold bg-red-600 text-white hover:bg-red-700 transition-all"
                >
                  Ya, Batalkan
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VirtualAccount;