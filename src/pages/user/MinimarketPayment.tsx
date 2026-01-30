import { useState, useEffect, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Copy, Check, AlertCircle, RefreshCw, ChevronLeft, Info, ReceiptText, Clock, ShieldCheck, MapPin } from 'lucide-react';
import Barcode from 'react-barcode';
import { toast } from 'sonner';
import { checkPaymentStatus } from '../../services/transactionService';
import Navbar from '../../components/user/Navbar';

const MinimarketPayment = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [copied, setCopied] = useState(false);
    const [timeLeft, setTimeLeft] = useState(24 * 60 * 60); // 24 hours
    const [isChecking, setIsChecking] = useState(false);
    const [showCancelModal, setShowCancelModal] = useState(false);

    // Data from payment page
    const { amount, email, name, orderId, paymentMethod, transactionData } = location.state || {}; // Ensure transactionData is destructured

    // Stable Payment Code based on transaction data or orderId
    const paymentCode = useMemo(() => {
        // Try to get code from transaction data first (adjust keys based on actual API response)
        const codeFromApi =
            transactionData?.payment_code ||
            transactionData?.pay_code ||
            transactionData?.bill_key ||
            transactionData?.data?.payment_code ||
            transactionData?.data?.pay_code ||
            transactionData?.virtual_account_number; // Sometimes VA number is used for conveniences

        if (codeFromApi) return codeFromApi;

        // Fallback to Order ID based generation if no code is found
        if (!orderId) return `PAY${Math.floor(1000000000 + Math.random() * 9000000000)}`;
        const seed = orderId.split('-').pop() || '0';
        return `PAY${seed.slice(-8)}${seed.slice(0, 2)}`;
    }, [orderId, transactionData]);

    const storeInfo = {
        indomaret: {
            name: 'Indomaret',
            brandColor: '#005596', // Indomaret Blue
            accentColor: 'bg-blue-50 text-blue-600 border-blue-100',
            logo: '/payment/Indomaret.jpeg',
            instruction: 'Bayar ke produk INDOMARET / PLASAGATE',
            merchantName: 'SMART ACADEMIA'
        },
        alfamart: {
            name: 'Alfamart',
            brandColor: '#e1211e', // Alfamart Red
            accentColor: 'bg-red-50 text-red-600 border-red-100',
            logo: '/payment/Alfamart.jpeg',
            instruction: 'Bayar ke produk ALFAMART / DUITKU',
            merchantName: 'SMART ACADEMIA'
        },
        default: {
            name: 'Minimarket',
            brandColor: '#7c3aed',
            accentColor: 'bg-purple-50 text-purple-600 border-purple-100',
            logo: '',
            instruction: 'Bayar ke kasir minimarket',
            merchantName: 'SMART ACADEMIA'
        }
    };

    const currentStore = storeInfo[paymentMethod as keyof typeof storeInfo] || storeInfo.default;

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft((prev) => (prev <= 0 ? 0 : prev - 1));
        }, 1000);
        return () => clearInterval(timer);
    }, []);

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
        }).format(value || 0);

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    // ✅ AUTO-POLLING: Cek status otomatis dari backend (yang diupdate via webhook)
    const handleCheckStatus = async (isAutoCheck = false) => {
        if (!orderId) {
            if (!isAutoCheck) {
                toast.error("Order ID tidak ditemukan");
            }
            return;
        }

        setIsChecking(true);
        try {
            const statusResult = await checkPaymentStatus(orderId);
            const status = statusResult?.data?.status || statusResult?.status;

            console.log("Auto-check Status Result:", statusResult);

            if (status === 'settlement' || status === 'success' || status === 'paid' || status === 'completed') {
                toast.success("Pembayaran berhasil!");
                navigate('/payment-success', {
                    state: {
                        orderId,
                        amount,
                        paymentMethod: currentStore.name,
                        name,
                        email,
                        items: location.state?.items || [],
                        productLink: location.state?.productLink
                    }
                });
            } else if (status === 'expire' || status === 'cancel' || status === 'expired' || status === 'cancelled' || status === 'failed') {
                toast.error("Pembayaran kadaluarsa atau dibatalkan.");
                navigate('/payment-failed', {
                    replace: true,
                    state: {
                        ...location.state,
                        orderId,
                        amount,
                        email,
                        name,
                        reason: 'Pembayaran kadaluarsa atau dibatalkan'
                    }
                });
            }
            // Jika pending, tidak perlu toast - auto-polling akan terus jalan

        } catch (error) {
            console.error("Failed to check status:", error);
            // Jangan toast error saat auto-check
            if (!isAutoCheck) {
                toast.error("Gagal mengecek status pembayaran. Pastikan server berjalan/terhubung.");
            }
        } finally {
            setIsChecking(false);
        }
    };

    // ✅ AUTO-POLLING: Cek status setiap 5 detik
    useEffect(() => {
        // Initial check
        handleCheckStatus(true);

        // Setup interval untuk auto-polling
        const pollingInterval = setInterval(() => {
            handleCheckStatus(true);
        }, 5000); // 5 detik

        // Cleanup
        return () => {
            clearInterval(pollingInterval);
        };
    }, [orderId]);

    const handleCancelPayment = () => {
        setShowCancelModal(false);
        navigate('/payment', {
            replace: true,
            state: location.state
        });
    };

    return (
        <div className="min-h-screen bg-[#F5F7FA] font-sans antialiased text-gray-900">
            <Navbar />

            <div className="max-w-5xl mx-auto px-4 py-8 lg:py-12">
                {/* Navigation & Status */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors w-fit"
                    >
                        <ChevronLeft className="w-5 h-5" />
                        <span className="text-sm font-medium">Batal & Kembali</span>
                    </button>

                    <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm border border-gray-100">
                        <div className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></div>
                        <span className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Menunggu Pembayaran</span>
                    </div>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">

                    {/* Main Payment Section */}
                    <div className="lg:col-span-2 space-y-6">

                        {/* Payment Code Card - The Core Focus */}
                        <div className="bg-white rounded-3xl shadow-[0_4px_20px_rgba(0,0,0,0.05)] border border-gray-100 overflow-hidden">
                            <div className="p-6 md:p-8 flex flex-col items-center text-center">

                                <div className="w-20 h-20 bg-gray-50 rounded-2xl flex items-center justify-center p-3 mb-6 border border-gray-100 shadow-inner">
                                    <img src={currentStore.logo} alt={currentStore.name} className="w-full h-full object-contain" />
                                </div>

                                <h1 className="text-gray-500 text-sm font-medium mb-1">Kode Pembayaran {currentStore.name}</h1>
                                <div className="relative group mb-8">
                                    <div className="flex items-center justify-center gap-4">
                                        <span className="text-4xl md:text-5xl font-black text-gray-900 tracking-wider">
                                            {paymentCode}
                                        </span>
                                        <button
                                            onClick={() => copyToClipboard(paymentCode)}
                                            className="p-2.5 bg-gray-50 hover:bg-gray-100 rounded-xl transition-all border border-gray-200"
                                        >
                                            {copied ? <Check className="w-5 h-5 text-green-600" /> : <Copy className="w-5 h-5 text-gray-500" />}
                                        </button>
                                    </div>
                                    {copied && (
                                        <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-[10px] font-bold text-green-600 bg-green-50 px-3 py-1 rounded-full border border-green-100">
                                            Kode Berhasil Disalin
                                        </div>
                                    )}
                                </div>

                                <div className="w-full h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent my-2"></div>

                                <div className="py-6 w-full flex flex-col items-center">
                                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.3em] mb-4">Barcode Transaksi</p>
                                    <div className="max-w-xs w-full p-4 bg-white border border-gray-100 rounded-2xl shadow-inner flex flex-col items-center justify-center">
                                        <Barcode
                                            value={paymentCode}
                                            format="CODE128"
                                            width={2}
                                            height={70}
                                            displayValue={false}
                                            background="transparent"
                                            lineColor="#000000"
                                        />
                                        <p className="text-[10px] text-gray-400 mt-3 font-mono tracking-widest">{paymentCode}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Deadline Footer */}
                            <div className="bg-gray-50 p-6 flex flex-col sm:flex-row items-center justify-between border-t border-gray-100 gap-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-orange-100 text-orange-600 rounded-lg">
                                        <Clock className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-gray-400 font-bold uppercase">Batas Waktu Bayar</p>
                                        <p className="text-base font-bold text-gray-800">{formatTime(timeLeft)}</p>
                                    </div>
                                </div>
                                <div className="w-full sm:w-px h-px sm:h-8 bg-gray-200 hidden sm:block"></div>
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-green-100 text-green-600 rounded-lg">
                                        <ShieldCheck className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-gray-400 font-bold uppercase">Keamanan</p>
                                        <p className="text-xs font-bold text-gray-800 tracking-tight">Terverifikasi Otomatis</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Instruction Card */}
                        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
                            <div className="flex items-center gap-3 mb-8">
                                <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
                                    <ReceiptText className="w-6 h-6" />
                                </div>
                                <h2 className="text-lg font-bold">Cara Pembayaran</h2>
                            </div>

                            <div className="space-y-6">
                                {[
                                    { title: 'Tunjukkan Kode', desc: `Kunjungi gerai ${currentStore.name} & berikan kode pembayaran ke kasir.` },
                                    { title: 'Konfirmasi Merchant', desc: `Kasir akan menyebutkan "${currentStore.instruction}". Pastikan nama Merchant benar.` },
                                    { title: 'Bayar & Selesai', desc: `Lakukan pembayaran sesuai nominal. Simpan struk fisik dari kasir sebagai bukti.` }
                                ].map((step, idx) => (
                                    <div key={idx} className="flex gap-5">
                                        <div className="flex-shrink-0 w-8 h-8 bg-gray-50 border border-gray-100 rounded-full flex items-center justify-center text-sm font-black text-gray-400">
                                            {idx + 1}
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-gray-900 text-sm mb-1">{step.title}</h4>
                                            <p className="text-sm text-gray-500 leading-relaxed font-medium">{step.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-8 pt-8 border-t border-gray-50">
                                <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-2xl">
                                    <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                                    <p className="text-xs text-gray-500 font-medium leading-relaxed">
                                        Pembayaran dapat dilakukan di seluruh gerai <span className="font-bold text-gray-800">{currentStore.name}</span> secara nasional.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar Area */}
                    <div className="space-y-6">

                        {/* Total Payment Card */}
                        <div className="bg-white rounded-3xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-100 p-8">
                            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Ringkasan Tagihan</h3>

                            <div className="space-y-4">
                                <div>
                                    <p className="text-xs text-gray-400 mb-1">Total Tagihan</p>
                                    <p className="text-3xl font-black text-gray-900">{formatRupiah(amount)}</p>
                                </div>

                                <div className="pt-4 border-t border-gray-50 space-y-3">
                                    <div className="flex justify-between items-center text-xs">
                                        <span className="text-gray-400">Order ID</span>
                                        <span className="font-bold text-gray-700 font-mono tracking-tighter">{orderId}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-xs">
                                        <span className="text-gray-400">Nama Akun</span>
                                        <span className="font-bold text-gray-700">{name}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Auto-Polling Status Indicator */}
                        <div className="space-y-4">
                            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-6">
                                <div className="flex items-center justify-center gap-3 mb-3">
                                    <div className="relative">
                                        <RefreshCw className={`w-5 h-5 text-blue-600 ${isChecking ? 'animate-spin' : ''}`} />
                                        <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                    </div>
                                    <span className="font-bold text-gray-800 text-sm">Menunggu Konfirmasi</span>
                                </div>
                                <p className="text-center text-xs text-gray-600 leading-relaxed">
                                    Sistem otomatis mengecek pembayaran
                                    <span className="block mt-1 text-xs text-blue-600 font-medium">
                                        ⚡ Auto-detection setiap 5 detik
                                    </span>
                                </p>
                            </div>

                            {/* Cancel Payment Button */}
                            <button
                                onClick={() => setShowCancelModal(true)}
                                className="w-full py-4 rounded-2xl font-semibold text-gray-600 bg-white border-2 border-gray-200 hover:border-red-300 hover:bg-red-50 hover:text-red-600 transition-all"
                            >
                                Batalkan Pembayaran
                            </button>

                            <div className="p-5 bg-amber-50/50 rounded-2xl border border-amber-100/50">
                                <div className="flex gap-3 items-start">
                                    <AlertCircle className="w-4 h-4 text-amber-600 mt-0.5" />
                                    <div className="space-y-2">
                                        <p className="text-xs font-bold text-amber-900">Perhatian Kasir</p>
                                        <p className="text-[11px] text-amber-800/80 leading-relaxed font-medium">
                                            Apabila kasir kesulitan mencari merchant, sampaikan bahwa pembayaran ini melalui produk <span className="font-bold underline decoration-amber-400">PLASAGATE / DUITKU</span>.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Support */}
                        <div className="text-center p-6 border-2 border-dashed border-gray-200 rounded-3xl">
                            <div className="inline-flex items-center justify-center w-10 h-10 bg-white rounded-full shadow-sm mb-3 border border-gray-100">
                                <Info className="w-5 h-5 text-gray-400" />
                            </div>
                            <p className="text-[11px] text-gray-400 font-medium">
                                Butuh bantuan? Silakan hubungi CS kami dengan melampirkan Order ID Anda.
                            </p>
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
                                Apakah Anda yakin ingin membatalkan pembayaran ini? Kode pembayaran akan hangus dan Anda harus membuat pesanan baru.
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

export default MinimarketPayment;
