import { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

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
  // State chart
  const [chartType, setChartType] = useState<'penjualan' | 'profit'>('penjualan');
  const [selectedYear, setSelectedYear] = useState<number>(2027);
  const [isYearlyView, setIsYearlyView] = useState(false);

  const activeData = isYearlyView
    ? (chartType === 'penjualan' ? salesYearlyMode : profitYearlyMode)
    : (chartType === 'penjualan' ? salesByYear[selectedYear] : profitByYear[selectedYear]);

  return (
    <div className="space-y-6">
      {/* Chart Section */}
      <div className="bg-white rounded-[2rem] shadow-xl p-8 border border-gray-100">
        <div className="flex justify-between items-center mb-10">
          {/* Year Selector */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsYearlyView(!isYearlyView)}
              className={`shadow-[0_4px_15px_rgba(0,0,0,0.1)] rounded-xl px-6 py-2 border border-gray-50 flex items-center justify-center font-bold transition min-w-[120px] ${isYearlyView
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
            >
              {isYearlyView ? 'Grafik Tahun' : selectedYear}
            </button>

            {!isYearlyView && (
              <div className="flex gap-2">
                {[2025, 2026, 2027].map(year => (
                  <button
                    key={year}
                    onClick={() => setSelectedYear(year)}
                    className={`px-4 py-2 rounded-xl text-sm font-semibold transition ${selectedYear === year
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
          <div className="flex gap-4">
            <button
              onClick={() => setChartType('profit')}
              className={`px-8 py-2 rounded-xl font-semibold transition shadow-[0_4px_15px_rgba(0,0,0,0.1)] border border-gray-50 ${chartType === 'profit'
                ? 'bg-white text-blue-600'
                : 'bg-white text-gray-500 hover:bg-gray-50'
                }`}
            >
              Profit
            </button>
            <button
              onClick={() => setChartType('penjualan')}
              className={`px-8 py-2 rounded-xl font-semibold transition shadow-[0_4px_15px_rgba(0,0,0,0.1)] border border-gray-50 ${chartType === 'penjualan'
                ? 'bg-white text-blue-600'
                : 'bg-white text-gray-500 hover:bg-gray-50'
                }`}
            >
              Penjualan
            </button>
          </div>
        </div>

        {/* Chart */}
        <div className="w-full h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={activeData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid vertical={false} stroke="#E5E7EB" strokeDasharray="3 3" />
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#6B7280', fontSize: 13 }}
                dy={10}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#6B7280', fontSize: 13 }}
                tickFormatter={(value) =>
                  chartType === 'profit' ? `${value}` : value
                }
              />
              <Tooltip
                cursor={{ fill: 'transparent' }}
                contentStyle={{
                  borderRadius: '12px',
                  border: 'none',
                  boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
                }}
                formatter={(value: number | undefined) =>
                  value !== undefined && chartType === 'profit' ? `${value}%` : value
                }
              />
              <Bar
                dataKey="value"
                radius={[5, 5, 0, 0]}
                barSize={40}
                fill="#818CF8"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}