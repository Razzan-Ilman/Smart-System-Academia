import { useState, useEffect, useMemo } from "react";
import {
    MenuOutlined,
    EditOutlined,
    SearchOutlined,
    UnorderedListOutlined,
    LoadingOutlined
} from "@ant-design/icons";
import { transactionService } from "../../services/adminService";
import { toast } from "react-hot-toast";
import { useDebounce } from "../../hooks/useDebounce";

interface Transaction {
    id: string;
    name: string;
    email: string;
    phone_number: string;
    payment_type: string;
    product_id: string;
    add_ons_ids?: string[];
    status?: string;
    created_at?: string;
    updated_at?: string;
    product?: {
        id: string;
        name: string;
        price: number;
    };
    total_amount?: number;
}

const ITEMS_PER_PAGE = 15;

export default function AdminListTransaksi() {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [showFilter, setShowFilter] = useState(false);
    const [filterStatus, setFilterStatus] = useState<string>("All");
    const [filterMethod, setFilterMethod] = useState<string>("All");
    const [currentPage, setCurrentPage] = useState(1);

    // Debounce search to reduce filtering overhead
    const debouncedSearch = useDebounce(search, 500);

    // Fetch transactions from API
    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                setLoading(true);
                const response = await transactionService.getAll();

                // Handle different response structures
                const data = response.data || response;
                setTransactions(Array.isArray(data) ? data : []);
            } catch (error: any) {
                console.error('Error fetching transactions:', error);
                toast.error(error.response?.data?.message || 'Gagal memuat data transaksi');
                setTransactions([]);
            } finally {
                setLoading(false);
            }
        };

        fetchTransactions();
    }, []);

    // Format currency
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(amount);
    };

    // Format date
    const formatDate = (dateString?: string) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleDateString('id-ID', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    // Memoized filtered transactions
    const filteredTransactions = useMemo(() => {
        return transactions.filter((transaction) => {
            const matchSearch = (transaction.name || '').toLowerCase().includes(debouncedSearch.toLowerCase()) ||
                (transaction.email || '').toLowerCase().includes(debouncedSearch.toLowerCase()) ||
                (transaction.id || '').toLowerCase().includes(debouncedSearch.toLowerCase()) ||
                (transaction.product?.name || '').toLowerCase().includes(debouncedSearch.toLowerCase());
            const matchStatus = filterStatus === "All" || transaction.status === filterStatus;
            const matchMethod = filterMethod === "All" || transaction.payment_type === filterMethod;
            return matchSearch && matchStatus && matchMethod;
        });
    }, [transactions, debouncedSearch, filterStatus, filterMethod]);

    // Paginated transactions
    const totalPages = Math.ceil(filteredTransactions.length / ITEMS_PER_PAGE);
    const paginatedTransactions = useMemo(() => {
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        return filteredTransactions.slice(startIndex, startIndex + ITEMS_PER_PAGE);
    }, [filteredTransactions, currentPage]);

    // Reset page on search/filter changes
    useEffect(() => {
        setCurrentPage(1);
    }, [debouncedSearch, filterStatus, filterMethod]);

    return (
        <div className="space-y-4 md:space-y-6">
            {/* Header Title */}
            <div className="flex items-center gap-3">
                <UnorderedListOutlined className="text-xl md:text-2xl text-gray-700" />
                <h1 className="text-xl md:text-2xl font-bold text-gray-800">List Transaksi</h1>
            </div>

            <div className="bg-white rounded-2xl md:rounded-[1.5rem] shadow-sm border border-gray-100 p-4 md:p-6">
                {/* Toolbar - Responsive */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-6 md:mb-8">
                    <div className="flex items-center gap-2 sm:gap-4 flex-1">
                        <div className="relative">
                            <button
                                onClick={() => setShowFilter(!showFilter)}
                                className="px-4 md:px-8 py-2 md:py-2.5 bg-white border border-gray-200 rounded-xl flex items-center gap-2 font-semibold text-gray-700 hover:bg-gray-50 transition shadow-sm text-sm md:text-base whitespace-nowrap"
                            >
                                <MenuOutlined /> Filter
                            </button>

                            {showFilter && (
                                <div className="absolute top-full mt-2 left-0 w-64 bg-white border border-gray-100 shadow-xl rounded-xl py-3 z-10 animate-in fade-in slide-in-from-top-2 duration-200">
                                    {/* Status Filter */}
                                    <div className="px-4 py-2">
                                        <p className="text-xs font-bold text-gray-500 uppercase mb-2">Status</p>
                                        <div className="space-y-1">
                                            {["All", "Success", "Pending", "Failed"].map((status) => (
                                                <button
                                                    key={status}
                                                    onClick={() => setFilterStatus(status)}
                                                    className={`w-full text-left px-3 py-1.5 rounded-lg transition text-sm font-medium ${filterStatus === status
                                                        ? 'bg-blue-50 text-blue-700'
                                                        : 'text-gray-700 hover:bg-gray-50'
                                                        }`}
                                                >
                                                    {status}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="border-t border-gray-100 my-2"></div>

                                    {/* Method Filter */}
                                    <div className="px-4 py-2">
                                        <p className="text-xs font-bold text-gray-500 uppercase mb-2">Metode</p>
                                        <div className="space-y-1">
                                            {["All", "qris", "bank_transfer", "e-wallet"].map((method) => (
                                                <button
                                                    key={method}
                                                    onClick={() => setFilterMethod(method)}
                                                    className={`w-full text-left px-3 py-1.5 rounded-lg transition text-sm font-medium ${filterMethod === method
                                                        ? 'bg-blue-50 text-blue-700'
                                                        : 'text-gray-700 hover:bg-gray-50'
                                                        }`}
                                                >
                                                    {method === "All" ? "All" : method.toUpperCase()}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="relative group flex-1">
                            <input
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Hinted search text"
                                className="pl-4 md:pl-6 pr-10 md:pr-12 py-2 md:py-2.5 bg-[#f3f0f7] rounded-full w-full focus:outline-none focus:ring-1 focus:ring-purple-200 transition-all shadow-inner text-gray-600 text-sm md:text-base"
                            />
                            <SearchOutlined className="absolute right-4 md:right-5 top-2.5 md:top-3.5 text-gray-400 group-hover:text-purple-500 cursor-pointer transition-colors" />
                        </div>
                    </div>
                </div>

                {/* Desktop Table View - Hidden on Mobile */}
                <div className="hidden lg:block border border-gray-200 rounded-2xl overflow-hidden bg-white shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
                    {/* Table Header */}
                    <div className="grid grid-cols-12 bg-white font-bold p-5 text-gray-800 border-b border-gray-100">
                        <div className="col-span-1 pl-4 uppercase tracking-wider text-sm">NO</div>
                        <div className="col-span-1 uppercase tracking-wider text-sm">TRX ID</div>
                        <div className="col-span-2 uppercase tracking-wider text-sm">NAMA</div>
                        <div className="col-span-2 uppercase tracking-wider text-sm">PRODUK</div>
                        <div className="col-span-1 text-center uppercase tracking-wider text-sm">NOMINAL</div>
                        <div className="col-span-1 text-center uppercase tracking-wider text-sm">METODE</div>
                        <div className="col-span-1 text-center uppercase tracking-wider text-sm">STATUS</div>
                        <div className="col-span-2 text-center uppercase tracking-wider text-sm">TANGGAL</div>
                        <div className="col-span-1 text-center uppercase tracking-wider text-sm">AKSI</div>
                    </div>

                    {/* Table Rows */}
                    {loading ? (
                        <div className="p-16 text-center">
                            <LoadingOutlined className="text-4xl text-purple-500 animate-spin" />
                            <p className="mt-4 text-gray-500 font-medium">Memuat data transaksi...</p>
                        </div>
                    ) : paginatedTransactions.length > 0 ? (
                        paginatedTransactions.map((transaction, index) => {
                            const globalIndex = (currentPage - 1) * ITEMS_PER_PAGE + index + 1;
                            return (
                                <div
                                    key={transaction.id}
                                    className="grid grid-cols-12 items-center p-6 border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition"
                                >
                                    <div className="col-span-1 pl-4 font-bold text-gray-800">{globalIndex}</div>
                                    <div className="col-span-1 font-mono text-sm text-blue-600">{transaction.id.substring(0, 8)}</div>
                                    <div className="col-span-2 font-bold text-gray-800">{transaction.name}</div>
                                    <div className="col-span-2 text-gray-700">{transaction.product?.name || '-'}</div>
                                    <div className="col-span-1 text-center font-semibold text-green-600">
                                        {transaction.total_amount ? formatCurrency(transaction.total_amount) : '-'}
                                    </div>
                                    <div className="col-span-1 text-center text-gray-600">{transaction.payment_type?.toUpperCase() || '-'}</div>
                                    <div className="col-span-1 text-center">
                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${transaction.status === 'Success' || transaction.status === 'settlement' ? 'bg-green-100 text-green-700' :
                                            transaction.status === 'Pending' || transaction.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                                                'bg-red-100 text-red-700'
                                            }`}>
                                            {transaction.status || 'Pending'}
                                        </span>
                                    </div>
                                    <div className="col-span-2 text-center text-gray-600">{formatDate(transaction.created_at)}</div>
                                    <div className="col-span-1 flex justify-center">
                                        <button className="p-2 text-gray-700 hover:text-blue-600 transition hover:scale-110 active:scale-90 bg-white rounded-lg shadow-sm border border-gray-50">
                                            <EditOutlined className="text-2xl" />
                                        </button>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <div className="p-16 text-center text-gray-400 font-medium">
                            {debouncedSearch ? `Data transaksi "${debouncedSearch}" tidak ditemukan` : 'Belum ada data transaksi'}
                        </div>
                    )}

                    {/* Pagination for Desktop */}
                    {!loading && filteredTransactions.length > ITEMS_PER_PAGE && (
                        <div className="p-4 bg-gray-50/50 border-t border-gray-50 flex items-center justify-between">
                            <p className="text-sm text-gray-600 font-medium">
                                Menampilkan {(currentPage - 1) * ITEMS_PER_PAGE + 1} - {Math.min(currentPage * ITEMS_PER_PAGE, filteredTransactions.length)} dari {filteredTransactions.length} transaksi
                            </p>
                            <div className="flex items-center gap-1">
                                <button
                                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                    disabled={currentPage === 1}
                                    className="px-3 py-1.5 rounded-lg border border-gray-200 bg-white text-gray-600 disabled:opacity-50 hover:bg-gray-50 transition text-sm font-medium"
                                >
                                    Prev
                                </button>
                                {[...Array(totalPages)].map((_, i) => {
                                    const p = i + 1;
                                    // Optimization: only show current, first, last, and neighbours
                                    if (p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1) {
                                        return (
                                            <button
                                                key={p}
                                                onClick={() => setCurrentPage(p)}
                                                className={`w-9 h-9 rounded-lg font-bold transition text-sm ${currentPage === p ? 'bg-purple-600 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'}`}
                                            >
                                                {p}
                                            </button>
                                        );
                                    }
                                    if (p === 2 || p === totalPages - 1) return <span key={p} className="px-1 text-gray-400">...</span>;
                                    return null;
                                })}
                                <button
                                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                    disabled={currentPage === totalPages}
                                    className="px-3 py-1.5 rounded-lg border border-gray-200 bg-white text-gray-600 disabled:opacity-50 hover:bg-gray-50 transition text-sm font-medium"
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Mobile Card View - Shown on Mobile/Tablet */}
                <div className="lg:hidden space-y-3">
                    {/* Table Header - Mobile */}
                    <div className="bg-white rounded-xl p-3 grid grid-cols-12 gap-2 font-bold text-gray-800 text-xs border border-gray-200">
                        <div className="col-span-5">NAMA/PRODUK</div>
                        <div className="col-span-3 text-center">NOMINAL</div>
                        <div className="col-span-2 text-center">STATUS</div>
                        <div className="col-span-2 text-center">AKSI</div>
                    </div>

                    {/* Transaction Cards */}
                    {loading ? (
                        <div className="p-10 text-center bg-white rounded-xl border border-gray-200">
                            <LoadingOutlined className="text-3xl text-purple-500 animate-spin" />
                            <p className="mt-3 text-gray-500 font-medium text-sm">Memuat data...</p>
                        </div>
                    ) : paginatedTransactions.length > 0 ? (
                        <>
                            {paginatedTransactions.map((transaction, index) => {
                                const globalIndex = (currentPage - 1) * ITEMS_PER_PAGE + index + 1;
                                return (
                                    <div
                                        key={transaction.id}
                                        className="bg-white border border-gray-200 rounded-xl p-3 shadow-sm hover:shadow-md transition"
                                    >
                                        <div className="grid grid-cols-12 gap-2 items-center">
                                            {/* Name & Product Info */}
                                            <div className="col-span-5 min-w-0">
                                                <p className="text-xs font-bold text-gray-500 mb-0.5">{globalIndex}. {transaction.id.substring(0, 8)}</p>
                                                <p className="font-bold text-sm text-gray-800 truncate">{transaction.name}</p>
                                                <p className="text-xs text-gray-600 truncate">{transaction.product?.name || '-'}</p>
                                            </div>

                                            {/* Nominal */}
                                            <div className="col-span-3 text-center">
                                                <p className="font-bold text-xs text-green-600 leading-tight">
                                                    {transaction.total_amount ? formatCurrency(transaction.total_amount) : '-'}
                                                </p>
                                                <p className="text-xs text-gray-500 mt-0.5 truncate">{transaction.payment_type?.toUpperCase() || '-'}</p>
                                            </div>

                                            {/* Status */}
                                            <div className="col-span-2 flex justify-center">
                                                <span className={`px-1.5 py-0.5 rounded-full text-xs font-semibold whitespace-nowrap ${transaction.status === 'Success' || transaction.status === 'settlement' ? 'bg-green-100 text-green-700' :
                                                    transaction.status === 'Pending' || transaction.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                                                        'bg-red-100 text-red-700'
                                                    }`}>
                                                    {transaction.status || 'Pending'}
                                                </span>
                                            </div>

                                            {/* Action */}
                                            <div className="col-span-2 flex justify-center">
                                                <button className="p-1.5 text-gray-700 hover:text-blue-600 transition hover:scale-110 active:scale-90 bg-white rounded-lg shadow-sm border border-gray-100">
                                                    <EditOutlined className="text-base" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}

                            {/* Mobile Pagination Controls */}
                            {filteredTransactions.length > ITEMS_PER_PAGE && (
                                <div className="flex justify-center gap-2 pt-2">
                                    <button
                                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                        disabled={currentPage === 1}
                                        className="px-3 py-1 bg-white rounded border border-gray-200 text-xs font-bold disabled:opacity-50"
                                    >
                                        Prev
                                    </button>
                                    <span className="text-xs font-bold text-gray-500 flex items-center">
                                        Page {currentPage} of {totalPages}
                                    </span>
                                    <button
                                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                        disabled={currentPage === totalPages}
                                        className="px-3 py-1 bg-white rounded border border-gray-200 text-xs font-bold disabled:opacity-50"
                                    >
                                        Next
                                    </button>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="p-10 text-center text-gray-400 font-medium bg-white rounded-xl border border-gray-200">
                            {debouncedSearch ? `Data transaksi "${debouncedSearch}" tidak ditemukan` : 'Belum ada data transaksi'}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
