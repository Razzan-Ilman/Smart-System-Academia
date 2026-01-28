import { useState, useEffect } from 'react';
import {
  BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend
} from 'recharts';
import { EyeOutlined, EyeInvisibleOutlined, UserOutlined } from "@ant-design/icons";
import { authService } from "../../services/adminService";
import { transactionService } from "../../services/transactionService";

// Colors for Pie Chart
const COLORS = ['#10B981', '#F59E0B', '#EF4444', '#3B82F6', '#8B5CF6'];

interface DashboardStats {
  totalRevenue: number;
  totalSales: number;
  statsByStatus: { name: string; value: number }[];
  statsByPayment: { name: string; value: number }[];
  statsByProduct: { name: string; value: number }[];
}

export default function Dashboard() {
  // State navbar
  const [showIncome, setShowIncome] = useState(true);
  const [userName, setUserName] = useState("Admin");

  // State for Stats & Charts
  const [stats, setStats] = useState<DashboardStats>({
    totalRevenue: 0,
    totalSales: 0,
    statsByStatus: [],
    statsByPayment: [],
    statsByProduct: []
  });

  const [loading, setLoading] = useState(true);
  const [loadingTransactions, setLoadingTransactions] = useState(false);
  const [latestTransactions, setLatestTransactions] = useState<any[]>([]);

  // Load user data
  useEffect(() => {
    const cachedData = authService.getUserData();
    if (cachedData && cachedData.name) {
      setUserName(cachedData.name);
    }
  }, []);

  // Fetch Dashboard Stats & Transactions
  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      setLoadingTransactions(true);
      try {
        // 1. Fetch Aggregated Stats
        const dashboardStats = await transactionService.getDashboardStats();
        setStats(dashboardStats);

        // 2. Fetch Latest Transactions (for table)
        const trxResponse = await transactionService.getHistory(1, 5);
        setLatestTransactions(trxResponse.data.transactions || []);
      } catch (error) {
        console.error("Failed to load dashboard data", error);
      } finally {
        setLoading(false);
        setLoadingTransactions(false);
      }
    };

    fetchDashboardData();
  }, []);

  const formatRupiah = (num: number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(num);

  const normalizeStatus = (status?: string) => {
    if (!status) return "Pending";
    const s = status.toLowerCase();
    if (["success", "paid", "settlement"].includes(s)) return "Success";
    if (["pending"].includes(s)) return "Pending";
    if (["failed", "expire", "cancel", "cancelled"].includes(s)) return "Failed";
    return status;
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 border-blue-600 rounded-full" role="status"></div>
          <p className="mt-2 text-gray-600 font-semibold">Memuat Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-10">
      {/* 🟢 TOP SECTION: Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

        {/* Profile Card */}
        <div className="bg-gradient-to-r from-blue-100 to-indigo-100 rounded-2xl p-6 shadow-sm flex items-center gap-4 border border-blue-200">
          <div className="bg-white p-3 rounded-full shadow-sm text-blue-600">
            <UserOutlined style={{ fontSize: '24px' }} />
          </div>
          <div>
            <p className="text-gray-500 text-sm font-semibold">Selamat Datang,</p>
            <h3 className="text-xl font-bold text-gray-800">{userName}</h3>
          </div>
        </div>

        {/* Revenue Card */}
        <div className="bg-gradient-to-br from-purple-600 to-indigo-600 rounded-2xl p-6 shadow-lg border border-purple-500/20 relative overflow-hidden group">
          {/* Decorative Bubbles */}
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:scale-110 transition-transform duration-700"></div>
          <div className="absolute top-1/2 -left-10 w-24 h-24 bg-white/10 rounded-full blur-xl group-hover:scale-110 transition-transform duration-700 delay-100"></div>

          <div className="relative z-10 flex justify-between items-start">
            <div>
              <p className="text-purple-100 text-sm font-semibold mb-1">Total Pendapatan</p>
              <h3 className="text-3xl font-bold text-white tracking-tight">
                {showIncome ? formatRupiah(stats.totalRevenue) : "Rp ••••••••"}
              </h3>
            </div>
            <button
              onClick={() => setShowIncome(!showIncome)}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm transition-all shadow-sm"
            >
              {showIncome ? <EyeOutlined /> : <EyeInvisibleOutlined />}
            </button>
          </div>

          <div className="relative z-10 mt-4 flex items-center gap-2 text-purple-100/80 text-xs">
            <span className="bg-white/20 px-2 py-0.5 rounded text-white font-medium">Coming Soon</span>
            <span>Update otomatis realtime</span>
          </div>
        </div>

        {/* Sales Count Card */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div>
            <p className="text-gray-500 text-sm font-semibold mb-1">Total Transaksi Sukses</p>
            <h3 className="text-2xl font-bold text-gray-800">{stats.totalSales}</h3>
            <p className="text-xs text-green-500 font-medium mt-2">+ Lifetime Sales</p>
          </div>
        </div>
      </div>

      {/* 🟢 MIDDLE SECTION: Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* 1. Transaction Status Pie Chart */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-700 mb-4">Status Transaksi</h3>
          <div style={{ width: '100%', height: 300 }}>
            {stats.statsByStatus.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={stats.statsByStatus}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    fill="#8884d8"
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {stats.statsByStatus.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend verticalAlign="bottom" height={36} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center text-gray-400">Belum ada data</div>
            )}
          </div>
        </div>

        {/* 2. Payment Method Bar Chart */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-700 mb-4">Metode Pembayaran</h3>
          <div style={{ width: '100%', height: 300 }}>
            {stats.statsByPayment.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  layout="vertical"
                  data={stats.statsByPayment}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                  <XAxis type="number" hide />
                  <YAxis dataKey="name" type="category" width={100} tick={{ fontSize: 12 }} />
                  <Tooltip cursor={{ fill: 'transparent' }} />
                  <Bar dataKey="value" fill="#3B82F6" radius={[0, 4, 4, 0]} barSize={20} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center text-gray-400">Belum ada data</div>
            )}
          </div>
        </div>

        {/* 3. Top Products Bar Chart (Full Width) */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 lg:col-span-2">
          <h3 className="text-lg font-bold text-gray-700 mb-4">Produk Terlaris</h3>
          <div style={{ width: '100%', height: 300 }}>
            {stats.statsByProduct.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={stats.statsByProduct}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis allowDecimals={false} />
                  <Tooltip cursor={{ fill: '#f3f4f6' }} />
                  <Bar dataKey="value" fill="#10B981" radius={[4, 4, 0, 0]} barSize={40} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center text-gray-400">Belum ada data</div>
            )}
          </div>
        </div>
      </div>

      {/* 🟢 BOTTOM SECTION: Latest Transactions Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
        <h2 className="text-xl font-bold text-gray-700 mb-6">Transaksi Terbaru</h2>
        <div className="overflow-x-auto">
          {loadingTransactions ? (
            <div className="text-center py-10 text-gray-500">Memuat transaksi...</div>
          ) : latestTransactions.length === 0 ? (
            <div className="text-center py-10 text-gray-500">Belum ada data transaksi</div>
          ) : (
            <table className="w-full min-w-[600px]">
              <thead>
                <tr className="text-left text-gray-500 border-b border-gray-100">
                  <th className="pb-4 font-semibold">TRX ID</th>
                  <th className="pb-4 font-semibold">Nama</th>
                  <th className="pb-4 font-semibold">Tanggal</th>
                  <th className="pb-4 font-semibold text-right">Total</th>
                  <th className="pb-4 font-semibold text-center">Status</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {latestTransactions.map((trx) => {
                  const status = normalizeStatus(trx.status);
                  const statusColor = status === "Success"
                    ? "bg-green-100 text-green-700"
                    : status === "Pending"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-red-100 text-red-700";

                  return (
                    <tr key={trx.id} className="border-b border-gray-50 last:border-none hover:bg-gray-50/50 transition-colors">
                      <td className="py-4 font-mono text-gray-600">{trx.trx_id}</td>
                      <td className="py-4 font-medium text-gray-800">{trx.name}</td>
                      <td className="py-4 text-gray-500">
                        {trx.created_at ? new Date(trx.created_at).toLocaleDateString("id-ID", {
                          day: "numeric", month: "short", year: "numeric"
                        }) : "-"}
                      </td>
                      <td className="py-4 text-right font-medium text-gray-700">
                        {formatRupiah(Number(trx.gross_amount || trx.price || 0))}
                      </td>
                      <td className="py-4 text-center">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${statusColor}`}>
                          {status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}