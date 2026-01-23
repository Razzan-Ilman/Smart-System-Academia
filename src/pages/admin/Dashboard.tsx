import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { EyeOutlined, EyeInvisibleOutlined, UserOutlined } from "@ant-design/icons";
import { authService, transactionService } from "../../services/adminService";

// Interface for chart data
interface ChartData {
  name: string;
  value: number;
}

export default function Dashboard() {
  // State navbar
  const [showIncome, setShowIncome] = useState(true);
  const [userName, setUserName] = useState("Admin");

  // State chart
  const [chartType, setChartType] = useState<'penjualan' | 'pendapatan'>('penjualan');
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const [isYearlyView, setIsYearlyView] = useState(false);

  // State for API data
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [availableYears, setAvailableYears] = useState<number[]>([]);

  // Load user data from API and localStorage
  useEffect(() => {
    const loadUserData = async () => {
      // First, try to get from localStorage for immediate display
      const cachedData = authService.getUserData();
      if (cachedData && cachedData.name) {
        setUserName(cachedData.name);
      }

      // Then fetch fresh data from API
      try {
        const userData = await authService.getUserProfile();
        if (userData && userData.name) {
          setUserName(userData.name);
        }
      } catch (error) {
        console.error('Failed to load user profile:', error);
        // Keep using cached data if API fails
      }
    };

    loadUserData();
  }, []);

  // Fetch available years on mount
  useEffect(() => {
    const fetchYears = async () => {
      try {
        const response = await transactionService.getYearlyStats();
        const yearsWithData = response.data?.map((item: any) => item.year) || [];
        const currentYear = new Date().getFullYear();

        // Combine years with data and current year, remove duplicates, and sort
        const allYears = [...new Set([...yearsWithData, currentYear])].sort((a, b) => a - b);

        setAvailableYears(allYears);

        // Set selected year to the most recent year (current year or latest data year)
        setSelectedYear(Math.max(...allYears));
      } catch (err) {
        console.error('Error fetching years:', err);
        // Default to current year on error
        const currentYear = new Date().getFullYear();
        setAvailableYears([currentYear]);
        setSelectedYear(currentYear);
      }
    };
    fetchYears();
  }, []);

  // Fetch chart data when view changes
  useEffect(() => {
    const fetchChartData = async () => {
      setLoading(true);
      setError(null);

      try {
        if (isYearlyView) {
          // Fetch yearly statistics
          const response = await transactionService.getYearlyStats();
          const yearlyData = response.data || [];

          const transformedData = yearlyData.map((item: any) => ({
            name: String(item.year),
            value: chartType === 'penjualan' ? item.transaction_count : item.total_revenue
          }));

          setChartData(transformedData);

          // Calculate total revenue for income display
          const total = yearlyData.reduce((sum: number, item: any) => sum + item.total_revenue, 0);
          setTotalRevenue(total);
        } else {
          // Fetch monthly statistics for selected year
          const response = await transactionService.getMonthlyStats(selectedYear);
          const monthlyData = response.data || [];

          const transformedData = monthlyData.map((item: any) => ({
            name: item.month_name,
            value: chartType === 'penjualan' ? item.transaction_count : item.total_revenue
          }));

          setChartData(transformedData);

          // Calculate total revenue for selected year
          const total = monthlyData.reduce((sum: number, item: any) => sum + item.total_revenue, 0);
          setTotalRevenue(total);
        }
      } catch (err: any) {
        console.error('Error fetching chart data:', err);
        setError(err.message || 'Gagal memuat data grafik');
        setChartData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchChartData();
  }, [chartType, selectedYear, isYearlyView]);

  const formatRupiah = (num: number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(num);

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Navbar - Responsive Grid */}
      <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        {/* Profil */}
        <div className="relative bg-gradient-to-r from-[#aab6e8] to-[#d8dcf5] rounded-2xl p-4 shadow-lg flex items-center gap-4">
          <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-white shadow flex items-center justify-center overflow-hidden flex-shrink-0">
            <UserOutlined className="text-xl md:text-2xl text-blue-500" />
          </div>

          <div className="flex-1 min-w-0">
            <div className="bg-white rounded-lg px-3 md:px-4 py-2 shadow font-semibold text-gray-700 text-sm md:text-base truncate">
              Nama: {userName}
            </div>
          </div>
        </div>

        {/* Pendapatan */}
        <div className="bg-gradient-to-r from-[#e6cfe4] to-[#f4e7f2] rounded-2xl p-4 shadow-lg flex items-center justify-between gap-2">
          <div className="bg-white rounded-full px-3 md:px-4 py-2 font-semibold text-sm md:text-base flex-shrink-0">
            IDR
          </div>

          <div className="flex-1 mx-2 md:mx-4 bg-white rounded-lg h-10 flex items-center px-3 md:px-4 font-semibold text-gray-700 text-sm md:text-base overflow-hidden">
            <span className="truncate">{showIncome ? formatRupiah(totalRevenue) : "••••••••••"}</span>
          </div>

          <button
            onClick={() => setShowIncome(!showIncome)}
            className="w-9 h-9 rounded-full border flex items-center justify-center bg-white hover:bg-gray-100 transition flex-shrink-0"
          >
            {showIncome ? <EyeOutlined /> : <EyeInvisibleOutlined />}
          </button>
        </div>
      </div>

      {/* Chart Section - Responsive */}
      <div className="bg-white rounded-2xl md:rounded-[2rem] shadow-xl p-4 md:p-8 border border-gray-100">
        {/* Controls - Responsive Layout */}
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4 mb-6 md:mb-10">
          {/* Year Selector */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 md:gap-4">
            <button
              onClick={() => setIsYearlyView(!isYearlyView)}
              className={`shadow-[0_4px_15px_rgba(0,0,0,0.1)] rounded-xl px-4 md:px-6 py-2 border border-gray-50 flex items-center justify-center font-bold transition w-full sm:w-auto min-w-[120px] text-sm md:text-base ${isYearlyView
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
            >
              {isYearlyView ? 'Grafik Tahun' : selectedYear}
            </button>

            {!isYearlyView && availableYears.length > 0 && (
              <div className="flex gap-2 w-full sm:w-auto overflow-x-auto">
                {availableYears.map(year => (
                  <button
                    key={year}
                    onClick={() => setSelectedYear(year)}
                    className={`flex-1 sm:flex-none px-3 md:px-4 py-2 rounded-xl text-xs md:text-sm font-semibold transition whitespace-nowrap ${selectedYear === year
                      ? 'bg-gray-800 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                  >
                    {year}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Chart Type Toggle */}
          <div className="flex gap-2 md:gap-4">
            <button
              onClick={() => setChartType('pendapatan')}
              className={`flex-1 sm:flex-none px-4 md:px-8 py-2 rounded-xl font-semibold transition shadow-[0_4px_15px_rgba(0,0,0,0.1)] border border-gray-50 text-sm md:text-base ${chartType === 'pendapatan'
                ? 'bg-white text-blue-600'
                : 'bg-white text-gray-500 hover:bg-gray-50'
                }`}
            >
              Pendapatan
            </button>
            <button
              onClick={() => setChartType('penjualan')}
              className={`flex-1 sm:flex-none px-4 md:px-8 py-2 rounded-xl font-semibold transition shadow-[0_4px_15px_rgba(0,0,0,0.1)] border border-gray-50 text-sm md:text-base ${chartType === 'penjualan'
                ? 'bg-white text-blue-600'
                : 'bg-white text-gray-500 hover:bg-gray-50'
                }`}
            >
              Penjualan
            </button>
          </div>
        </div>

        {/* Chart - Responsive Height */}
        <div className="w-full h-[300px] sm:h-[350px] md:h-[400px]">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-gray-500">Memuat data...</div>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-red-500">Error: {error}</div>
            </div>
          ) : chartData.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-gray-500">Tidak ada data transaksi</div>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 20, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid vertical={false} stroke="#E5E7EB" strokeDasharray="3 3" />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#6B7280', fontSize: 11 }}
                  dy={10}
                  angle={-45}
                  textAnchor="end"
                  height={60}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#6B7280', fontSize: 11 }}
                  domain={[0, (dataMax: number) => {
                    // Calculate a nice upper bound based on the max value
                    if (dataMax === 0) return 10; // Default range when no data
                    const magnitude = Math.pow(10, Math.floor(Math.log10(dataMax)));
                    const normalized = dataMax / magnitude;
                    let upperBound;
                    if (normalized <= 1) upperBound = magnitude;
                    else if (normalized <= 2) upperBound = 2 * magnitude;
                    else if (normalized <= 5) upperBound = 5 * magnitude;
                    else upperBound = 10 * magnitude;
                    return Math.ceil(dataMax / upperBound) * upperBound;
                  }]}
                  tickFormatter={(value) =>
                    chartType === 'pendapatan' ? `${(value / 1000000).toFixed(1)}M` : value
                  }
                />
                <Tooltip
                  cursor={{ fill: 'transparent' }}
                  contentStyle={{
                    borderRadius: '12px',
                    border: 'none',
                    boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                    fontSize: '12px'
                  }}
                  formatter={(value: number | undefined) => {
                    if (value === undefined) return value;
                    if (chartType === 'pendapatan') {
                      return new Intl.NumberFormat('id-ID', {
                        style: 'currency',
                        currency: 'IDR',
                        minimumFractionDigits: 0
                      }).format(value);
                    }
                    return value;
                  }}
                />
                <Bar
                  dataKey="value"
                  radius={[5, 5, 0, 0]}
                  barSize={30}
                  fill="#818CF8"
                />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
}