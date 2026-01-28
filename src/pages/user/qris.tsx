import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'sonner';
import Navbar from '../../components/user/Navbar';
import { QrCode, CheckCircle2, Clock, Copy, ArrowLeft, RefreshCw, AlertCircle } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { confirmTransaction } from '../../services/transactionService';

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
  const [isChecking, setIsChecking] = useState(false);
  const [referenceNo, setReferenceNo] = useState('');

  // Get payment data
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

  // Logic to determine if it's an image URL or a QRIS data string
  const isUrl = typeof rawQrValue === 'string' && (rawQrValue.startsWith('http') || rawQrValue.startsWith('data:image'));
  const qrCodeUrl = isUrl ? rawQrValue : null;
  const qrCodeString = !isUrl ? rawQrValue : null;

  // QR Code data extraction

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

  // Check payment status from API - Updated to confirmation flow
  const checkPaymentStatus = async () => {
    if (isChecking) return;

    setIsChecking(true);
    setPaymentStatus('checking');

    try {
      // Use the confirmation service function instead of polling
      // Backend expects PUT /transaksi/:id/confirm-payment with originalReferenceNo
      const result = await confirmTransaction(orderNumber, referenceNo || 'MANUAL-CHECK');

      // Backend response usually contains updated status
      const status = result?.data?.status || result?.status;

      if (status === 'PAID' || status === 'SUCCESS' || status === 'settlement') {
        setPaymentStatus('success');
        toast.success('Pembayaran terkonfirmasi!');
        setTimeout(() => {
          navigate('/payment-success', {
            state: {
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
      } else {
        // Handle failure or still pending cases from the confirm response
        const msg = status === 'PENDING' ? 'Pembayaran belum terdeteksi. Pastikan Anda sudah menekan tombol Bayar di aplikasi DANA.' : `Status saat ini: ${status || 'Pending'}`;
        toast.info(msg);
        setPaymentStatus('pending');
      }
    } catch (error: any) {
      const errorData = error.response?.data;

      if (errorData?.message === 'Trx already confirmed') {
        // ⬇️ ANGAP INI SUCCESS
        setPaymentStatus('success');
        toast.success('Pembayaran sudah terkonfirmasi sebelumnya');

        navigate('/payment-success', {
          state: {
            orderId: orderNumber,
            amount: totalAmount,
            email: buyerEmail,
            name: buyerName,
            phone: buyerPhone,
            items: stateData.items || [],
            transactionData
          }
        });

        return;
      }

      console.error('Error confirming payment:', errorData || error.message);
      toast.error(
        errorData?.message ||
        'Gagal mengonfirmasi pembayaran. Silakan tunggu beberapa saat.'
      );

      setPaymentStatus('pending');
    } finally {
      setIsChecking(false);
    }
  };

  const handleCancelPayment = () => {
    setShowCancelModal(false);
    navigate('/payment', { replace: true });
  };

  // Automatic polling disabled because backend uses confirmation flow
  // (Prevents 404 polling errors)
  useEffect(() => {
    // No automatic polling
  }, []);

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
                {/* QR Code - Real from API */}
                <div className="w-64 h-64 bg-white flex items-center justify-center border-4 border-gray-200 rounded-lg">
                  {qrCodeUrl ? (
                    // Display QR from image URL
                    <img
                      src={qrCodeUrl}
                      alt="QRIS Payment"
                      className="w-full h-full object-contain"
                      onError={(e) => {
                        console.error('Failed to load QR image');
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  ) : qrCodeString ? (
                    // Generate QR from string
                    <QRCodeSVG
                      value={qrCodeString}
                      size={256}
                      level="H"
                      includeMargin={false}
                    />
                  ) : (
                    // Fallback: No QR available
                    <div className="flex flex-col items-center justify-center text-center p-4">
                      <QrCode className="w-16 h-16 text-gray-300 mb-2" />
                      <p className="text-sm text-gray-500">QR Code tidak tersedia</p>
                      <p className="text-xs text-gray-400 mt-1">Silakan hubungi customer service</p>
                    </div>
                  )}
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

            {/* Reference Number Input (Required for Confirm Payment API) */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Nomor Referensi / Kode Bayar (Opsional):
              </label>
              <input
                type="text"
                value={referenceNo}
                onChange={(e) => setReferenceNo(e.target.value)}
                placeholder="Masukkan nomor referensi dari aplikasi DANA"
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 bg-gray-50 focus:border-purple-400 outline-none transition-all text-sm"
              />
              <p className="mt-2 text-[11px] text-gray-500 italic">
                *Beberapa sistem memerlukan nomor referensi pembayaran untuk verifikasi manual.
              </p>
            </div>

            {/* Check Payment Button */}
            <button
              onClick={checkPaymentStatus}
              disabled={isChecking || paymentStatus === 'success'}
              className={`w-full py-4 rounded-xl font-bold text-lg transition-all transform hover:scale-[1.02] flex items-center justify-center gap-2 mb-4 ${isChecking
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

            {/* Manual check encouraged because auto-check is disabled */}
            {paymentStatus === 'pending' && !isChecking && (
              <div className="mb-6 p-4 bg-amber-50 rounded-xl border border-amber-100">
                <p className="flex items-center justify-center gap-2 text-sm text-amber-700">
                  <AlertCircle className="w-4 h-4" />
                  Sistem menunggu konfirmasi dari DANA. Klik tombol di atas setelah transaksi selesai.
                </p>
              </div>
            )}

            {/* Support Link */}
            <div className="text-center mb-6">
              <p className="text-sm text-gray-500 mb-2">Punya kendala pembayaran?</p>
              <a
                href={`https://wa.me/6281234567890?text=Halo%2C%20saya%20punya%20kendala%20pembayaran%20dengan%20nomor%20pesanan%20${orderNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm font-semibold text-purple-600 hover:text-purple-700 underline underline-offset-4"
              >
                Hubungi Customer Service kami via WhatsApp
              </a>
            </div>

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