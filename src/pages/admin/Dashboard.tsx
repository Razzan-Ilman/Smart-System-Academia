import { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { EyeOutlined, EyeInvisibleOutlined, UserOutlined } from "@ant-design/icons";

// Data per tahun
const salesByYear: Record<number, { name: string; value: number }[]> = {
  2025: [
    { name: 'Januari', value: 8 },
    { name: 'Februari', value: 15 },
    { name: 'Maret', value: 22 },
    { name: 'April', value: 30 },
    { name: 'Mei', value: 35 },
    { name: 'Juni', value: 40 },
    { name: 'Juli', value: 45 },
    { name: 'Agustus', value: 25 },
    { name: 'September', value: 15 },
    { name: 'Oktober', value: 5 },
    { name: 'November', value: 20 },
  ],
  2026: [
    { name: 'Januari', value: 12 },
    { name: 'Februari', value: 18 },
    { name: 'Maret', value: 26 },
    { name: 'April', value: 33 },
    { name: 'Mei', value: 42 },
    { name: 'Juni', value: 48 },
    { name: 'Juli', value: 55 },
    { name: 'Agustus', value: 28 },
    { name: 'September', value: 16 },
    { name: 'Oktober', value: 7 },
    { name: 'November', value: 24 },
  ],
  2027: [
    { name: 'Januari', value: 10 },
    { name: 'Februari', value: 20 },
    { name: 'Maret', value: 28 },
    { name: 'April', value: 35 },
    { name: 'Mei', value: 45 },
    { name: 'Juni', value: 53 },
    { name: 'Juli', value: 62 },
    { name: 'Agustus', value: 31 },
    { name: 'September', value: 17 },
    { name: 'Oktober', value: 8 },
    { name: 'November', value: 26 },
  ],
};

// Profit dalam persen (%)
const profitByYear: Record<number, { name: string; value: number }[]> = {
  2025: [
    { name: 'Januari', value: 3 },
    { name: 'Februari', value: 5 },
    { name: 'Maret', value: 7 },
    { name: 'April', value: 9 },
    { name: 'Mei', value: 11 },
    { name: 'Juni', value: 13 },
    { name: 'Juli', value: 15 },
    { name: 'Agustus', value: 10 },
    { name: 'September', value: 6 },
    { name: 'Oktober', value: 2 },
    { name: 'November', value: 8 },
  ],
  2026: [
    { name: 'Januari', value: 4 },
    { name: 'Februari', value: 6 },
    { name: 'Maret', value: 9 },
    { name: 'April', value: 12 },
    { name: 'Mei', value: 14 },
    { name: 'Juni', value: 17 },
    { name: 'Juli', value: 19 },
    { name: 'Agustus', value: 12 },
    { name: 'September', value: 7 },
    { name: 'Oktober', value: 3 },
    { name: 'November', value: 10 },
  ],
  2027: [
    { name: 'Januari', value: 4 },
    { name: 'Februari', value: 7 },
    { name: 'Maret', value: 10 },
    { name: 'April', value: 12 },
    { name: 'Mei', value: 18 },
    { name: 'Juni', value: 22 },
    { name: 'Juli', value: 25 },
    { name: 'Agustus', value: 14 },
    { name: 'September', value: 9 },
    { name: 'Oktober', value: 3 },
    { name: 'November', value: 11 },
  ],
};

// Data Tahunan
const salesYearlyMode = [
  { name: '2025', value: 250 },
  { name: '2026', value: 310 },
  { name: '2027', value: 345 },
];

const profitYearlyMode = [
  { name: '2025', value: 12 },
  { name: '2026', value: 15 },
  { name: '2027', value: 18 },
];

export default function Dashboard() {
  // State navbar
  const [showIncome, setShowIncome] = useState(true);

  // State chart
  const [chartType, setChartType] = useState<'penjualan' | 'profit'>('penjualan');
  const [selectedYear, setSelectedYear] = useState<number>(2027);
  const [isYearlyView, setIsYearlyView] = useState(false);

  // Data user dan income untuk navbar
  const user = {
    name: "Abare no Ken",
  };

  const income = 12500000;

  const formatRupiah = (num: number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(num);

  const activeData = isYearlyView
    ? (chartType === 'penjualan' ? salesYearlyMode : profitYearlyMode)
    : (chartType === 'penjualan' ? salesByYear[selectedYear] : profitByYear[selectedYear]);

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
              Nama: {user.name}
            </div>
          </div>
        </div>

        {/* Pendapatan */}
        <div className="bg-gradient-to-r from-[#e6cfe4] to-[#f4e7f2] rounded-2xl p-4 shadow-lg flex items-center justify-between gap-2">
          <div className="bg-white rounded-full px-3 md:px-4 py-2 font-semibold text-sm md:text-base flex-shrink-0">
            IDR
          </div>

          <div className="flex-1 mx-2 md:mx-4 bg-white rounded-lg h-10 flex items-center px-3 md:px-4 font-semibold text-gray-700 text-sm md:text-base overflow-hidden">
            <span className="truncate">{showIncome ? formatRupiah(income) : "••••••••••"}</span>
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

            {!isYearlyView && (
              <div className="flex gap-2 w-full sm:w-auto">
                {[2025, 2026, 2027].map(year => (
                  <button
                    key={year}
                    onClick={() => setSelectedYear(year)}
                    className={`flex-1 sm:flex-none px-3 md:px-4 py-2 rounded-xl text-xs md:text-sm font-semibold transition ${selectedYear === year
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
              onClick={() => setChartType('profit')}
              className={`flex-1 sm:flex-none px-4 md:px-8 py-2 rounded-xl font-semibold transition shadow-[0_4px_15px_rgba(0,0,0,0.1)] border border-gray-50 text-sm md:text-base ${chartType === 'profit'
                  ? 'bg-white text-blue-600'
                  : 'bg-white text-gray-500 hover:bg-gray-50'
                }`}
            >
              Profit
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
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={activeData} margin={{ top: 20, right: 10, left: -20, bottom: 0 }}>
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
                tickFormatter={(value) =>
                  chartType === 'profit' ? `${value}` : value
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
                formatter={(value: number | undefined) =>
                  value !== undefined && chartType === 'profit' ? `${value}%` : value
                }
              />
              <Bar
                dataKey="value"
                radius={[5, 5, 0, 0]}
                barSize={30}
                fill="#818CF8"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}