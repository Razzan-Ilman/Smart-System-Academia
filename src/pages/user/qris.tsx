import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'sonner';
import Navbar from '../../components/user/Navbar';
import { QrCode, CheckCircle2, Clock, Copy, ArrowLeft, RefreshCw, AlertCircle } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import axios from 'axios';

const QRISPayment = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Get data from location state or URL params
  const searchParams = new URLSearchParams(location.search);
  const stateData = location.state || {};

  const [paymentStatus, setPaymentStatus] = useState('pending');
  const [timeLeft, setTimeLeft] = useState(5 * 60); // 5 minutes in seconds
  const [copied, setCopied] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [referenceNo, setReferenceNo] = useState('');

  // Get payment data
  const totalAmount = stateData.amount || parseInt(searchParams.get('amount') || '425000');

  // Display ID (UI) - prioritize string ID
  const orderNumber = stateData.transactionData?.trx_id || stateData.orderId || searchParams.get('orderId') || `ORD-${Date.now()}`;

  const buyerEmail = stateData.email || searchParams.get('email') || '';
  const buyerName = stateData.name || searchParams.get('name') || '';
  const buyerPhone = stateData.phone || searchParams.get('phone') || '';

  // Get QR code data from API response - check all possible field names
  const transactionData = stateData.transactionData || {};

  // Debug log to identify data structure
  useEffect(() => {
    if (transactionData && Object.keys(transactionData).length > 0) {
      console.log('📦 QRIS Transaction Data:', transactionData);
    }
  }, [transactionData]);

  const rawQrValue = transactionData.payment_trx ||
    transactionData.qr_url ||
    transactionData.qris_url ||
    transactionData.QrUrl ||
    transactionData.qr_code ||
    transactionData.qrcode ||
    transactionData.qr_image ||
    transactionData.qr_string ||
    transactionData.qris_string ||
    transactionData.QrString ||
    transactionData.qr_data ||
    transactionData.qris_data || "";

  const isUrl = typeof rawQrValue === 'string' && (rawQrValue.startsWith('http') || rawQrValue.startsWith('data:image'));
  const qrCodeUrl = isUrl ? rawQrValue : null;
  const qrCodeString = !isUrl ? rawQrValue : null;

  // Countdown timer
  useEffect(() => {
    if (timeLeft <= 0) {
      toast.error('Waktu pembayaran telah habis!');
      setTimeout(() => {
        navigate('/payment-failed', {
          replace: true,
          state: {
            ...location.state,
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
  }, [timeLeft, navigate, orderNumber, totalAmount, buyerEmail, buyerName, buyerPhone, location.state]);

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

  const handleCopy = () => {
    navigator.clipboard.writeText(orderNumber);
    setCopied(true);
    toast.success('Nomor pesanan berhasil disalin!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleBack = () => {
    if (confirm('Apakah Anda yakin ingin membatalkan pembayaran?')) {
      navigate('/payment', { state: location.state });
    }
  };

  // ✅ UPDATED: Check Payment Status menggunakan endpoint baru
  const checkPaymentStatusAPI = async () => {
    if (isChecking) return;

    setIsChecking(true);
    setPaymentStatus('checking');

    try {
      console.log('📤 Checking payment status for trxId:', orderNumber);

      // ✅ Call API endpoint yang benar
      const response = await axios.get(
        `https://ssa-payment.lskk.co.id/api/v1/transaksi/check-payment/${orderNumber}`
      );

      console.log('📥 Payment Status Response:', response.data);
      console.log('🔍 Full Response:', JSON.stringify(response.data, null, 2));

      const result = response.data;

      // ✅ Normalisasi status dari berbagai kemungkinan field
      const rawStatus = 
        result?.data?.payment_status ||
        result?.data?.status ||
        result?.payment_status ||
        result?.status ||
        '';

      const status = String(rawStatus).toLowerCase();

      console.log('🔍 Payment Status:', status);
      console.log('🔍 Raw Status:', rawStatus);

      // ✅ Cek status pembayaran
      if (status === 'paid' || status === 'success' || status === 'settlement' || status === 'completed') {
        setPaymentStatus('success');
        toast.success('Pembayaran terkonfirmasi! 🎉');
        
        setTimeout(() => {
          navigate('/payment-success', {
            replace: true,
            state: {
              ...location.state,
              orderId: orderNumber,
              amount: totalAmount,
              email: buyerEmail,
              name: buyerName,
              phone: buyerPhone,
              items: stateData.items || [],
              transactionData: result.data || transactionData,
              productLink: stateData.productLink
            }
          });
        }, 2000);
      } else if (status === 'pending' || status === 'waiting' || status === 'unpaid' || status === '') {
        // Status masih pending
        toast.info('Pembayaran belum terdeteksi. Pastikan Anda sudah scan QRIS dan menyelesaikan pembayaran.');
        setPaymentStatus('pending');
      } else if (status === 'failed' || status === 'expired' || status === 'cancelled' || status === 'cancel') {
        // Status gagal/expired
        toast.error('Pembayaran gagal atau kadaluarsa');
        setPaymentStatus('pending');
        
        setTimeout(() => {
          navigate('/payment-failed', {
            replace: true,
            state: {
              ...location.state,
              orderId: orderNumber,
              amount: totalAmount,
              email: buyerEmail,
              name: buyerName,
              phone: buyerPhone,
              reason: 'Pembayaran gagal atau expired'
            }
          });
        }, 2000);
      } else {
        // Status tidak dikenali
        console.warn('⚠️ Unknown payment status:', rawStatus);
        toast.warning(`Status pembayaran: ${rawStatus}`);
        setPaymentStatus('pending');
      }
    } catch (error: any) {
      console.error('❌ Error checking payment status:', error);
      
      const errorMessage = 
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        'Gagal memeriksa status pembayaran';

      toast.error(errorMessage);
      setPaymentStatus('pending');
    } finally {
      setIsChecking(false);
    }
  };

  const handleCancelPayment = () => {
    setShowCancelModal(false);
    navigate('/payment', { replace: true, state: location.state });
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

          {/* Unified Payment Ticket Section */}
          <div className="p-4 md:p-8 flex flex-col items-center w-full">

            {/* Payment Ticket Card */}
            <div className="bg-white rounded-3xl shadow-xl border border-gray-200 w-full max-w-md overflow-hidden relative">

              {/* Top Section: QR Code */}
              <div className="p-6 md:p-8 flex flex-col items-center bg-white">
                {/* QRIS Logo */}
                <div className="mb-4">
                  <img
                    src="/payment/qris.png"
                    alt="QRIS"
                    className="h-10 object-contain"
                    onError={(e) => e.currentTarget.style.display = 'none'}
                  />
                </div>

                {/* QR Code */}
                <div className="p-2 border-2 border-gray-100 rounded-xl mb-2">
                  {qrCodeUrl ? (
                    <img
                      src={qrCodeUrl}
                      alt="QRIS Payment"
                      className="w-80 h-80 object-contain"
                      onError={(e) => {
                        console.error('Failed to load QR image');
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  ) : qrCodeString ? (
                    <QRCodeSVG
                      value={qrCodeString}
                      size={320}
                      level="H"
                      includeMargin={true}
                    />
                  ) : (
                    <div className="w-80 h-80 flex flex-col items-center justify-center bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
                      <QrCode className="w-16 h-16 text-gray-300 mb-2" />
                      <p className="text-sm text-center text-gray-400">QR Code tidak tersedia</p>
                    </div>
                  )}
                </div>

                {/* NMID */}
                <div className="text-center w-full mt-2">
                  <p className="text-xs font-bold text-gray-900">SMART ACADEMIA</p>
                  <p className="text-[10px] text-gray-500 font-mono">NMID: ID2021064013547</p>
                </div>
              </div>

              {/* TICKET CUTOUT EFFECT */}
              <div className="relative flex items-center w-full">
                <div className="h-6 w-6 bg-indigo-50 rounded-full absolute -left-3 shadow-inner border-r border-gray-200"></div>
                <div className="h-px w-full border-t-2 border-dashed border-gray-200"></div>
                <div className="h-6 w-6 bg-indigo-50 rounded-full absolute -right-3 shadow-inner border-l border-gray-200"></div>
              </div>

              {/* Bottom Section: Details */}
              <div className="p-6 md:p-8 bg-gray-50/50">
                {/* Amount */}
                <div className="text-center mb-6">
                  <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">Total Pembayaran</p>
                  <h2 className="text-3xl font-black text-gray-900 tracking-tight">
                    {formatRupiah(totalAmount)}
                  </h2>
                </div>

                {/* Order ID Box */}
                <div className="flex items-center justify-between bg-white px-4 py-3 rounded-xl border border-gray-200 shadow-sm gap-3 mb-4">
                  <div className="flex flex-col overflow-hidden">
                    <span className="text-[10px] text-gray-400 font-bold uppercase">Nomor Pesanan</span>
                    <code className="font-mono font-bold text-gray-800 text-sm truncate">
                      {orderNumber}
                    </code>
                  </div>
                  <button
                    onClick={handleCopy}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-500 hover:text-blue-600"
                    title="Salin Nomor Pesanan"
                  >
                    {copied ? (
                      <CheckCircle2 className="w-5 h-5 text-green-600" />
                    ) : (
                      <Copy className="w-5 h-5" />
                    )}
                  </button>
                </div>

                {/* Buyer Info - Compact Mode */}
                {buyerName && (
                  <div className="text-xs text-gray-500 text-center border-t border-gray-200 pt-3 mt-2">
                    <p>Pembeli: <span className="font-medium text-gray-800">{buyerName}</span></p>
                    {buyerEmail && <p className="truncate opacity-75">{buyerEmail}</p>}
                  </div>
                )}
              </div>
            </div>

            {/* Instructions */}
            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6 mb-6 mt-6 w-full max-w-md">
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
              onClick={checkPaymentStatusAPI}
              disabled={isChecking || paymentStatus === 'success'}
              className={`w-full max-w-md py-4 rounded-xl font-bold text-lg transition-all transform hover:scale-[1.02] flex items-center justify-center gap-2 mb-4 ${isChecking
                ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                : paymentStatus === 'success'
                  ? 'bg-green-500 text-white'
                  : 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-xl hover:shadow-2xl'
                }`}
            >
              {isChecking ? (
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

            {/* Manual check info */}
            {paymentStatus === 'pending' && !isChecking && (
              <div className="mb-6 p-4 bg-amber-50 rounded-xl border border-amber-100 w-full max-w-md">
                <p className="flex items-center justify-center gap-2 text-sm text-amber-700">
                  <AlertCircle className="w-4 h-4" />
                  Klik tombol di atas setelah Anda menyelesaikan pembayaran via QRIS.
                </p>
              </div>
            )}

            {/* Cancel Payment Button */}
            <button
              onClick={() => setShowCancelModal(true)}
              disabled={paymentStatus === 'checking' || paymentStatus === 'success'}
              className="w-full max-w-md py-4 rounded-2xl font-semibold text-gray-600 bg-white border-2 border-gray-200 hover:border-red-300 hover:bg-red-50 hover:text-red-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Batalkan Pembayaran
            </button>

            {/* Success Message */}
            {paymentStatus === 'success' && (
              <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-xl text-center w-full max-w-md">
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