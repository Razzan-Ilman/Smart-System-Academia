import { useState, useEffect, useCallback } from "react";
import {
  MenuOutlined,
  DeleteOutlined,
  SearchOutlined,
  UnorderedListOutlined,
  LoadingOutlined,
  SyncOutlined,
} from "@ant-design/icons";
import { toast } from "sonner";
import {
  getTransactionHistory,
  checkPaymentStatus,
  cancelExpiredTransactions,
  deleteTransaction,
  type Transaction
} from "../../services/transactionService";
import { formatRupiah } from "../../utils/transactionUtils";
import Pagination from "../../components/admin/Pagination";

const ITEMS_PER_PAGE = 10;

// Helper to format Status from backend (display only)
const normalizeStatus = (status?: string) => {
  if (!status) return "Pending";
  const s = status.toLowerCase();

  // Map backend status to display format - NO MODIFICATION, JUST DISPLAY
  if (["success", "paid", "settlement"].includes(s)) return "Success";
  if (["failed", "expire", "expired", "cancel", "cancelled"].includes(s)) return "Failed";
  if (["pending", "waiting", "unpaid"].includes(s)) return "Pending";

  // Return original if unknown
  return status.charAt(0).toUpperCase() + status.slice(1);
};

export function ListTransaksi() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [checkingId, setCheckingId] = useState<string | null>(null);
  const [showFilter, setShowFilter] = useState(false); // Original state
  const [filterStatus, setFilterStatus] = useState<string>("All");
  const [filterMethod, setFilterMethod] = useState<string>("All");
  const [isCanceling, setIsCanceling] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [transactionToDelete, setTransactionToDelete] = useState<Transaction | null>(null);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const fetchTransactions = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await getTransactionHistory(
        currentPage,
        ITEMS_PER_PAGE,
        search,
        filterMethod === "All" ? "" : filterMethod,
        filterStatus === "All" ? "" : filterStatus
      );

      // Robust data extraction
      let txList: Transaction[] = [];
      if (response?.data?.transactions && Array.isArray(response.data.transactions)) {
        txList = response.data.transactions;
      } else if (response?.data && Array.isArray(response.data)) {
        txList = response.data;
      } else if (Array.isArray(response)) {
        txList = response as any;
      }

      setTransactions(txList);

      // Extract pagination properly
      const pagination = response?.data?.pagination || (response as any)?.pagination;
      setTotalPages(pagination?.totalPages || 1);
      setTotalItems(pagination?.total || txList.length);

    } catch (err: any) {
      console.error("❌ Error fetching transactions:", err);
      setError(err.response?.data?.message || "Gagal memuat data transaksi");
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  }, [currentPage, search, filterMethod, filterStatus]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [search, filterStatus, filterMethod]);



  const handleCheckStatus = async (trxId: string) => {
    if (!trxId) return;
    setCheckingId(trxId);
    try {
      // ✅ FIXED: Use checkPaymentStatus to READ status without modifying it
      const result = await checkPaymentStatus(trxId);
      const status = result?.data?.status || result?.status;

      console.log('💡 Check Status Result:', { trxId, status, result });

      // Display status feedback
      if (['paid', 'success', 'settlement'].includes((status || '').toLowerCase())) {
        toast.success(`Status: ${status} ✅`);
      } else if (['pending', 'waiting', 'unpaid'].includes((status || '').toLowerCase())) {
        toast.info(`Status: ${status} - Menunggu pembayaran`);
      } else if (['failed', 'expired', 'cancel', 'cancelled'].includes((status || '').toLowerCase())) {
        toast.warning(`Status: ${status} ❌`);
      } else {
        toast.info(`Status: ${status || 'Unknown'}`);
      }

      // ✅ Only refresh list after successful status check
      await fetchTransactions();
    } catch (error: any) {
      console.error("❌ Check status failed:", error);
      const errorData = error.response?.data;
      toast.error(errorData?.message || "Gagal mengecek status pembayaran");
      // ❌ Don't refresh on error
    } finally {
      setCheckingId(null);
    }
  };

  // ✅ Auto-cancel expired transactions (manual trigger)
  const handleCancelExpired = async () => {
    if (!confirm('Batalkan semua transaksi pending yang sudah lebih dari 24 jam?')) return;

    setIsCanceling(true);
    try {
      const result = await cancelExpiredTransactions(24); // 24 hours threshold
      const canceledCount = result?.data?.canceled_count || result?.canceled_count || 0;

      if (canceledCount > 0) {
        toast.success(`✅ ${canceledCount} transaksi expired berhasil dibatalkan`);
      } else {
        toast.info('Tidak ada transaksi expired yang perlu dibatalkan');
      }

      await fetchTransactions(); // Refresh list
    } catch (error: any) {
      console.error('❌ Failed to cancel expired transactions:', error);
      toast.error(error.response?.data?.message || 'Gagal membatalkan transaksi expired');
    } finally {
      setIsCanceling(false);
    }
  };

  // 🗑️ Delete transaction (for cleanup of incorrect data)
  const handleDeleteClick = (transaction: Transaction) => {
    setTransactionToDelete(transaction);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!transactionToDelete) return;

    const txId = transactionToDelete.id || transactionToDelete.trx_id;
    setDeletingId(String(txId));

    try {
      await deleteTransaction(txId);
      toast.success(`✅ Transaksi ${transactionToDelete.trx_id} berhasil dihapus`);
      await fetchTransactions(); // Refresh list
      setShowDeleteModal(false);
      setTransactionToDelete(null);
    } catch (error: any) {
      console.error('❌ Failed to delete transaction:', error);
      toast.error(error.response?.data?.message || 'Gagal menghapus transaksi');
    } finally {
      setDeletingId(null);
    }
  };

  // Client-side filter removed in favor of server-side
  const filteredTransactions = transactions;

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [search, filterStatus, filterMethod]);



  return (
    <div className="space-y-4 md:space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <UnorderedListOutlined className="text-xl md:text-2xl text-gray-700" />
        <h1 className="text-xl md:text-2xl font-bold text-gray-800">
          List Transaksi
        </h1>
      </div>

      <div className="bg-white rounded-2xl md:rounded-3xl shadow-sm border border-gray-100 p-4 md:p-6">
        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="flex gap-4 flex-1">
            <button
              onClick={() => setShowFilter(!showFilter)}
              className="px-6 py-2 bg-white border border-gray-200 rounded-xl flex items-center gap-2 font-semibold text-gray-700 hover:bg-gray-50 shadow-sm"
            >
              <MenuOutlined /> Filter
            </button>

            {/* Auto-Cancel Expired Button */}
            <button
              onClick={handleCancelExpired}
              disabled={isCanceling}
              className={`px-4 py-2 border rounded-xl flex items-center gap-2 font-semibold shadow-sm transition-all ${isCanceling
                ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                : 'bg-orange-50 text-orange-700 border-orange-200 hover:bg-orange-100'
                }`}
              title="Batalkan semua transaksi pending > 24 jam"
            >
              {isCanceling ? (
                <>
                  <LoadingOutlined className="animate-spin" />
                  Canceling...
                </>
              ) : (
                <>
                  <SyncOutlined />
                  Auto-Cancel
                </>
              )}
            </button>

            <div className="relative flex-1">
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Cari nama, email, atau ID..."
                className="pl-6 pr-12 py-2 bg-gray-50 rounded-full w-full focus:outline-none focus:ring-2 focus:ring-purple-300 transition shadow-sm"
              />
              <SearchOutlined className="absolute right-5 top-3 text-gray-400" />
            </div>
          </div>
        </div>

        {/* Filter Panel */}
        {showFilter && (
          <div className="bg-gray-50 p-4 rounded-xl mb-6 grid grid-cols-1 sm:grid-cols-2 gap-4 border border-gray-100">
            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-700">Status</label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-200"
              >
                <option value="All">Semua Status</option>
                <option value="Success">Success</option>
                <option value="Pending">Pending</option>
                <option value="Failed">Failed</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-700">Metode Pembayaran</label>
              <select
                value={filterMethod}
                onChange={(e) => setFilterMethod(e.target.value)}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-200"
              >
                <option value="All">Semua Metode</option>
                <option value="qris">QRIS</option>
                <option value="va">Virtual Account</option>
                <option value="ewallet">E-Wallet</option>
                <option value="indomaret">Indomaret</option>
                <option value="alfamart">Alfamart</option>
              </select>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
            ⚠️ {error}
          </div>
        )}

        {/* Table - Semantic HTML Table */}
        <div className="border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px]">
              <thead className="bg-[#f8fafc]">
                <tr className="text-left text-gray-600 font-bold border-b border-gray-200">
                  <th className="py-4 px-6 w-16 text-center">No</th>
                  <th className="py-4 px-4 w-32">TRX ID</th>
                  <th className="py-4 px-4">Nama Customer</th>
                  <th className="py-4 px-4 text-right">Total Transaksi</th>
                  <th className="py-4 px-4 text-center">Status</th>
                  <th className="py-4 px-4 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loading ? (
                  <tr>
                    <td colSpan={7} className="p-16 text-center">
                      <LoadingOutlined className="text-4xl animate-spin text-purple-500" />
                      <p className="mt-4 text-gray-500 font-medium">Memuat data transaksi...</p>
                    </td>
                  </tr>
                ) : filteredTransactions.length > 0 ? (
                  filteredTransactions.map((trx, index) => {
                    // ✅ Status from backend only, no client-side modification
                    const statusNormalized = normalizeStatus(trx.status);
                    const statusColor =
                      statusNormalized === "Success"
                        ? "bg-emerald-100 text-emerald-700 border border-emerald-200"
                        : statusNormalized === "Pending"
                          ? "bg-amber-100 text-amber-700 border border-amber-200"
                          : "bg-rose-100 text-rose-700 border border-rose-200";

                    return (
                      <tr key={trx.id} className="hover:bg-gray-50/80 transition-colors duration-200">
                        <td className="py-4 px-6 text-center font-medium text-gray-500">
                          {(currentPage - 1) * ITEMS_PER_PAGE + index + 1}
                        </td>
                        <td className="py-4 px-4">
                          <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded text-gray-700">
                            {(trx.trx_id || String(trx.id || "")).slice(-8).toUpperCase() || "-"}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <div className="font-medium text-gray-800">{trx.name}</div>
                          <div className="text-xs text-gray-500 truncate max-w-[150px]">{trx.email}</div>
                        </td>
                        <td className="py-4 px-4 text-right font-semibold text-gray-700">
                          {formatRupiah(Number(
                            trx.gross_amount ||
                            (trx as any).GrossAmount ||
                            (trx as any).total_price ||
                            (trx as any).TotalPrice ||
                            trx.price ||
                            (trx as any).amount ||
                            0
                          ))}
                        </td>
                        <td className="py-4 px-4 text-center">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-bold inline-block min-w-[80px] ${statusColor}`}
                          >
                            {statusNormalized === "Success" ? "Berhasil" :
                              statusNormalized === "Pending" ? "Menunggu" :
                                statusNormalized === "Failed" ? "Gagal" : statusNormalized}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-center">
                          <div className="flex justify-center gap-2">
                            {/* Sync Button (Only for Pending) */}
                            {statusNormalized === "Pending" && (
                              <button
                                onClick={() => handleCheckStatus(trx.trx_id || String(trx.id))}
                                disabled={checkingId === (trx.trx_id || String(trx.id))}
                                className={`p-2 rounded-full transition ${checkingId === (trx.trx_id || String(trx.id)) ? "bg-gray-100 text-gray-400" : "text-green-500 hover:bg-green-50 hover:text-green-600"}`}
                                title="Cek Status Pembayaran (Sync)"
                              >
                                {checkingId === (trx.trx_id || String(trx.id)) ? <LoadingOutlined /> : <SyncOutlined />}
                              </button>
                            )}

                            {/* Delete Button */}
                            <button
                              onClick={() => handleDeleteClick(trx)}
                              disabled={deletingId === String(trx.id || trx.trx_id)}
                              className={`p-2 rounded-full transition ${deletingId === String(trx.id || trx.trx_id)
                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                : 'text-red-500 hover:bg-red-50 hover:text-red-600'
                                }`}
                              title="Hapus Transaksi"
                            >
                              {deletingId === String(trx.id || trx.trx_id) ? (
                                <LoadingOutlined />
                              ) : (
                                <DeleteOutlined />
                              )}
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={7} className="p-16 text-center text-gray-400 font-medium">
                      {search || filterStatus !== "All" || filterMethod !== "All"
                        ? "Tidak ada transaksi yang sesuai dengan filter"
                        : "Belum ada data transaksi"}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination Details */}
        <div className="flex flex-col md:flex-row justify-between items-center mt-6 gap-4">
          <div className="text-sm text-gray-500">
            Menampilkan {filteredTransactions.length > 0 ? (currentPage - 1) * ITEMS_PER_PAGE + 1 : 0} - {Math.min(currentPage * ITEMS_PER_PAGE, totalItems)} dari {totalItems} Transaksi
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && transactionToDelete && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <DeleteOutlined className="text-3xl text-red-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Hapus Transaksi?</h3>
              <p className="text-gray-600 mb-2">
                Apakah Anda yakin ingin menghapus transaksi ini?
              </p>
              <div className="bg-gray-50 p-4 rounded-xl mb-6 text-left">
                <p className="text-sm text-gray-600">
                  <span className="font-semibold">TRX ID:</span> {transactionToDelete.trx_id}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-semibold">Nama:</span> {transactionToDelete.name}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-semibold">Email:</span> {transactionToDelete.email}
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowDeleteModal(false);
                    setTransactionToDelete(null);
                  }}
                  className="flex-1 py-3 rounded-xl font-semibold bg-gray-100 text-gray-700 hover:bg-gray-200 transition-all"
                >
                  Batal
                </button>
                <button
                  onClick={handleDeleteConfirm}
                  disabled={deletingId !== null}
                  className={`flex-1 py-3 rounded-xl font-semibold transition-all ${deletingId !== null
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-red-600 text-white hover:bg-red-700'
                    }`}
                >
                  {deletingId !== null ? 'Menghapus...' : 'Ya, Hapus'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}