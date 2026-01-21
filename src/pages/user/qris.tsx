import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'sonner';
import Navbar from '../../components/user/Navbar';
import { QrCode, CheckCircle2, Clock, Copy, ArrowLeft, RefreshCw, AlertCircle } from 'lucide-react';

const QRISPayment = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Get data from location state or URL params
  const searchParams = new URLSearchParams(location.search);
  const stateData = location.state || {};

  const [paymentStatus, setPaymentStatus] = useState('pending');
  const [timeLeft, setTimeLeft] = useState(15 * 60); // 15 minutes in seconds
  const [copied, setCopied] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);

  // Get payment data
  const totalAmount = stateData.amount || parseInt(searchParams.get('amount') || '425000');
  const orderNumber = stateData.orderId || searchParams.get('orderId') || `ORD-${Date.now()}`;
  const buyerEmail = stateData.email || searchParams.get('email') || '';
  const buyerName = stateData.name || searchParams.get('name') || '';
  const buyerPhone = stateData.phone || searchParams.get('phone') || '';

  // Countdown timer
  useEffect(() => {
    if (timeLeft <= 0) {
      // Timer expired - redirect to payment failed
      toast.error('Waktu pembayaran telah habis!');
      setTimeout(() => {
        navigate('/payment-failed', {
          state: {
            orderId: orderNumber,
            amount: totalAmount,
            email: buyerEmail,
            name: buyerName,
            phone: buyerPhone,
            reason: 'Waktu pembayaran habis'
          }
        });
      }, 2000);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, navigate, orderNumber, totalAmount, buyerEmail, buyerName, buyerPhone]);

  // Format time
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Format Rupiah
  const formatRupiah = (value: number): string =>
    new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(value);

  // Copy to clipboard
  const handleCopy = () => {
    navigator.clipboard.writeText(orderNumber);
    setCopied(true);
    toast.success('Nomor pesanan berhasil disalin!');
    setTimeout(() => setCopied(false), 2000);
  };

  // Handle back navigation
  const handleBack = () => {
    if (confirm('Apakah Anda yakin ingin membatalkan pembayaran?')) {
      navigate('/payment');
    }
  };

  // Check payment status
  const checkPaymentStatus = () => {
    setPaymentStatus('checking');

    // Simulate API call - replace with actual API
    setTimeout(() => {
      const isSuccess = true;

      if (isSuccess) {
        setPaymentStatus('success');
        setTimeout(() => {
          navigate('/payment-success', {
            state: {
              orderId: orderNumber,
              amount: totalAmount,
              email: buyerEmail,
              name: buyerName,
              phone: buyerPhone,
              items: stateData.items || []
            }
          });
        }, 2000);
      } else {
        setPaymentStatus('failed');
        setTimeout(() => {
          navigate('/payment-failed', {
            state: {
              orderId: orderNumber,
              amount: totalAmount,
              email: buyerEmail,
              name: buyerName,
              phone: buyerPhone
            }
          });
        }, 2000);
      }
    }, 2000);
  };

  const handleCancelPayment = () => {
    setShowCancelModal(false);
    navigate('/payment', { replace: true });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse" style={{ animationDelay: '1s' }}></div>

      {/* Header */}
      <Navbar />

      {/* Main Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden border border-gray-100">

          {/* QRIS Header */}
          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-8 text-center relative">
            {/* Back Button */}
            <button
              onClick={handleBack}
              className="absolute left-4 top-4 p-2 bg-white/20 hover:bg-white/30 rounded-full transition-all transform hover:scale-110"
              title="Kembali"
            >
              <ArrowLeft className="w-5 h-5 text-white" />
            </button>

            <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-full mb-4">
              <QrCode className="w-8 h-8 text-purple-600" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Pembayaran QRIS</h1>
            <p className="text-purple-100">Pindai kode QR untuk melakukan pembayaran</p>
          </div>

          {/* Timer */}
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-b border-orange-100 p-4">
            <div className="flex items-center justify-center gap-2 text-orange-700">
              <Clock className="w-5 h-5" />
              <span className="font-semibold">Selesaikan pembayaran dalam:</span>
              <span className="text-2xl font-bold">{formatTime(timeLeft)}</span>
            </div>
          </div>

          {/* QR Code Section */}
          <div className="p-8">
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-8 mb-6 flex justify-center">
              <div className="bg-white rounded-xl p-6 shadow-lg">
                {/* QR Code SVG */}
                <div className="w-64 h-64 bg-white flex items-center justify-center border-4 border-gray-200 rounded-lg">
                  <svg width="256" height="256" viewBox="0 0 256 256">
                    <rect width="256" height="256" fill="white" />
                    <g fill="black">
                      {/* Top-left corner */}
                      <rect x="20" y="20" width="60" height="60" />
                      <rect x="30" y="30" width="40" height="40" fill="white" />
                      <rect x="40" y="40" width="20" height="20" />

                      {/* Top-right corner */}
                      <rect x="176" y="20" width="60" height="60" />
                      <rect x="186" y="30" width="40" height="40" fill="white" />
                      <rect x="196" y="40" width="20" height="20" />

                      {/* Bottom-left corner */}
                      <rect x="20" y="176" width="60" height="60" />
                      <rect x="30" y="186" width="40" height="40" fill="white" />
                      <rect x="40" y="196" width="20" height="20" />

                      {/* Random pattern for demo */}
                      {Array.from({ length: 100 }).map((_, i) => {
                        const x = 20 + (i % 10) * 20;
                        const y = 100 + Math.floor(i / 10) * 10;
                        return Math.random() > 0.5 ? <rect key={i} x={x} y={y} width="8" height="8" /> : null;
                      })}
                    </g>
                  </svg>
                </div>

                <div className="text-center mt-4">
                  <p className="text-sm text-gray-600 mb-2">Nomor Pesanan</p>
                  <div className="flex items-center justify-center gap-2 bg-gray-50 px-4 py-2 rounded-lg">
                    <code className="font-mono font-semibold text-gray-800">{orderNumber}</code>
                    <button
                      onClick={handleCopy}
                      className="p-1 hover:bg-gray-200 rounded transition"
                      title="Copy order number"
                    >
                      {copied ? (
                        <CheckCircle2 className="w-4 h-4 text-green-600" />
                      ) : (
                        <Copy className="w-4 h-4 text-gray-600" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Amount */}
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6 mb-6 border border-purple-100">
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-2">Total Pembayaran</p>
                <p className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  {formatRupiah(totalAmount)}
                </p>
              </div>
            </div>

            {/* Buyer Info (if available) */}
            {buyerName && (
              <div className="bg-gray-50 rounded-2xl p-4 mb-6 border border-gray-200">
                <h3 className="text-sm font-semibold text-gray-600 mb-2">Informasi Pembeli:</h3>
                <div className="space-y-1 text-sm text-gray-700">
                  <p><span className="font-medium">Nama:</span> {buyerName}</p>
                  {buyerEmail && <p><span className="font-medium">Email:</span> {buyerEmail}</p>}
                  {buyerPhone && <p><span className="font-medium">Telepon:</span> {buyerPhone}</p>}
                </div>
              </div>
            )}

            {/* Instructions */}
            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6 mb-6">
              <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                <QrCode className="w-5 h-5 text-blue-600" />
                Cara Pembayaran:
              </h3>
              <ol className="space-y-2 text-sm text-gray-700">
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">1</span>
                  <span>Buka aplikasi e-wallet atau mobile banking yang mendukung QRIS</span>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">2</span>
                  <span>Pilih menu "Scan QR" atau "Bayar dengan QRIS"</span>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">3</span>
                  <span>Pindai kode QR di atas</span>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">4</span>
                  <span>Pastikan nominal pembayaran sesuai dan konfirmasi</span>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">5</span>
                  <span>Klik tombol "Cek Status Pembayaran" setelah melakukan pembayaran</span>
                </li>
              </ol>
            </div>

            {/* Check Payment Button */}
            <button
              onClick={checkPaymentStatus}
              disabled={paymentStatus === 'checking' || paymentStatus === 'success'}
              className={`w-full py-4 rounded-xl font-bold text-lg transition-all transform hover:scale-[1.02] flex items-center justify-center gap-2 ${paymentStatus === 'checking'
                ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                : paymentStatus === 'success'
                  ? 'bg-green-500 text-white'
                  : 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-xl hover:shadow-2xl'
                }`}
            >
              {paymentStatus === 'checking' ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  Mengecek Pembayaran...
                </>
              ) : paymentStatus === 'success' ? (
                <>
                  <CheckCircle2 className="w-5 h-5" />
                  Pembayaran Berhasil!
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-5 h-5" />
                  Cek Status Pembayaran
                </>
              )}
            </button>

            {/* Cancel Payment Button */}
            <button
              onClick={() => setShowCancelModal(true)}
              disabled={paymentStatus === 'checking' || paymentStatus === 'success'}
              className="w-full py-4 rounded-2xl font-semibold text-gray-600 bg-white border-2 border-gray-200 hover:border-red-300 hover:bg-red-50 hover:text-red-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Batalkan Pembayaran
            </button>

            {/* Success Message */}
            {paymentStatus === 'success' && (
              <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-xl text-center">
                <p className="text-green-700 font-medium">
                  Pembayaran Anda telah berhasil diverifikasi! Redirecting...
                </p>
              </div>
            )}

            {/* Warning */}
            <div className="mt-6 text-center text-sm text-gray-500">
              <p>⚠️ Jangan tutup halaman ini sebelum pembayaran selesai</p>
            </div>
          </div>
        </div>
      </div>

      {/* Cancel Confirmation Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Batalkan Pembayaran?</h3>
              <p className="text-gray-600 mb-6">
                Apakah Anda yakin ingin membatalkan pembayaran ini? Kode QR akan hangus dan Anda harus membuat pesanan baru.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowCancelModal(false)}
                  className="flex-1 py-3 rounded-xl font-semibold bg-gray-100 text-gray-700 hover:bg-gray-200 transition-all"
                >
                  Tidak, Lanjutkan
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

export default QRISPayment;