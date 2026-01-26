import { useState, useEffect, useMemo } from "react";
import {
  MenuOutlined,
  EditOutlined,
  SearchOutlined,
  UnorderedListOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import { getTransactionHistory, type Transaction } from "../../services/transactionService";

const ITEMS_PER_PAGE = 15;

// Helper function to normalize status
const normalizeStatus = (status?: string) => {
  if (!status) return "Pending";

  const s = status.toLowerCase();
  if (["success", "paid", "settlement"].includes(s)) return "Success";
  if (["pending"].includes(s)) return "Pending";
  if (["failed", "expire", "cancel", "cancelled"].includes(s)) return "Failed";

  return status;
};

export function ListTransaksi() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showFilter, setShowFilter] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>("All");
  const [filterMethod, setFilterMethod] = useState<string>("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [error, setError] = useState<string | null>(null);

  // ✅ FETCH DATA FROM BACKEND
  useEffect(() => {
    const fetchTransactions = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await getTransactionHistory(
          currentPage,
          ITEMS_PER_PAGE,
          search,
          filterMethod === "All" ? "" : filterMethod
        );

        setTransactions(response.data.transactions || []);
        setTotalPages(response.data.pagination?.totalPages || 1);
      } catch (err: any) {
        console.error("❌ Error fetching transactions:", err);
        setError(err.response?.data?.message || "Gagal memuat data transaksi");
        setTransactions([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [currentPage, search, filterMethod]);

  // Format date
  const formatDate = (dateString?: string) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Client-side filter by status (jika backend tidak support filter status)
  const filteredTransactions = useMemo(() => {
    return transactions.filter((transaction) => {
      const normalizedStatus = normalizeStatus(transaction.status);
      return filterStatus === "All" || normalizedStatus === filterStatus;
    });
  }, [transactions, filterStatus]);

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

            <div className="relative flex-1">
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Cari nama, email, atau ID..."
                className="pl-6 pr-12 py-2 bg-gray-50 rounded-full w-full focus:outline-none focus:ring-2 focus:ring-purple-300"
              />
              <SearchOutlined className="absolute right-5 top-3 text-gray-400" />
            </div>
          </div>
        </div>

        {/* Filter Panel */}
        {showFilter && (
          <div className="bg-gray-50 p-4 rounded-xl mb-4 grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-2">Status</label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg"
              >
                <option value="All">Semua Status</option>
                <option value="Success">Success</option>
                <option value="Pending">Pending</option>
                <option value="Failed">Failed</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Metode Pembayaran</label>
              <select
                value={filterMethod}
                onChange={(e) => setFilterMethod(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg"
              >
                <option value="All">Semua Metode</option>
                <option value="qris">QRIS</option>
                <option value="va">Virtual Account</option>
                <option value="ewallet">E-Wallet</option>
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

        {/* Table */}
        <div className="border border-gray-200 rounded-2xl overflow-hidden">
          <div className="grid grid-cols-12 bg-gray-50 font-bold p-5 border-b">
            <div className="col-span-1">NO</div>
            <div className="col-span-2">TRX ID</div>
            <div className="col-span-3">NAMA</div>
            <div className="col-span-3">EMAIL</div>
            <div className="col-span-2 text-center">STATUS</div>
            <div className="col-span-1 text-center">AKSI</div>
          </div>

          {loading ? (
            <div className="p-16 text-center">
              <LoadingOutlined className="text-4xl animate-spin text-purple-500" />
              <p className="mt-4 text-gray-500">Memuat data transaksi...</p>
            </div>
          ) : filteredTransactions.length > 0 ? (
            filteredTransactions.map((trx, index) => {
              const statusNormalized = normalizeStatus(trx.status);
              const statusColor =
                statusNormalized === "Success"
                  ? "bg-green-100 text-green-700"
                  : statusNormalized === "Pending"
                  ? "bg-yellow-100 text-yellow-700"
                  : "bg-red-100 text-red-700";

              return (
                <div
                  key={trx.id}
                  className="grid grid-cols-12 p-5 border-b hover:bg-gray-50"
                >
                  <div className="col-span-1 font-bold">
                    {(currentPage - 1) * ITEMS_PER_PAGE + index + 1}
                  </div>
                  <div className="col-span-2 font-mono text-blue-600">
                    {trx.trx_id || String(trx.id).slice(0, 8)}
                  </div>
                  <div className="col-span-3">{trx.name}</div>
                  <div className="col-span-3 text-sm text-gray-600">{trx.email}</div>
                  <div className="col-span-2 text-center">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColor}`}
                    >
                      {statusNormalized}
                    </span>
                  </div>
                  <div className="col-span-1 text-center">
                    <button className="text-blue-500 hover:text-blue-700">
                      <EditOutlined />
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="p-16 text-center text-gray-400">
              {search || filterStatus !== "All" || filterMethod !== "All"
                ? "Tidak ada transaksi yang sesuai dengan filter"
                : "Belum ada data transaksi"}
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-6">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              ‹ Prev
            </button>

            <span className="px-4 py-2">
              Halaman {currentPage} dari {totalPages}
            </span>

            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Next ›
            </button>
          </div>
        )}
      </div>
    </div>
  );
}