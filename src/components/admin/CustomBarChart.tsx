import React from 'react';

const CustomBarChart = () => {
    const data = [
        { month: 'Januari', value: 10 },
        { month: 'February', value: 20 },
        { month: 'Maret', value: 30 },
        { month: 'April', value: 38 },
        { month: 'Mei', value: 45 },
        { month: 'Juni', value: 55 },
        { month: 'Juli', value: 65 },
        { month: 'Agustus', value: 32 },
        { month: 'September', value: 18 },
        { month: 'Oktober', value: 8 },
        { month: 'November', value: 25 },
    ];

    const maxValue = 65;
    const chartHeight = 350;
    const chartWidth = 800;
    const barWidth = 40;
    const gap = 30;

    return (
        <div className="bg-white p-8 rounded-3xl shadow-xl w-full border border-gray-100">
            {/* Header Controls */}
            <div className="flex justify-between items-center mb-10">
                <div className="flex gap-4">
                    <div className="bg-white px-8 py-2 rounded-xl shadow-md border border-gray-100 flex items-center">
                        <span className="text-lg font-medium text-gray-600">2027</span>
                    </div>
                    <button className="bg-gray-200 px-8 py-2 rounded-xl shadow-sm text-lg font-medium text-gray-700 hover:bg-gray-300 transition-colors">
                        Tampilkan
                    </button>
                </div>
                <div className="flex gap-4">
                    <button className="bg-white px-10 py-3 rounded-xl shadow-md border border-gray-100 text-lg font-medium text-gray-600 hover:shadow-lg transition-all">
                        Profit
                    </button>
                    <button className="bg-white px-10 py-3 rounded-xl shadow-md border border-gray-100 text-lg font-medium text-gray-600 hover:shadow-lg transition-all">
                        Penjualan
                    </button>
                </div>
            </div>

            {/* SVG Chart Area */}
            <div className="relative flex justify-center mt-12">
                <svg width={chartWidth} height={chartHeight + 50} viewBox={`0 0 ${chartWidth} ${chartHeight + 50}`}>
                    {/* Y Axis Lines and Labels */}
                    {[0, 10, 20, 30, 40, 50, 60].map((val) => (
                        <React.Fragment key={val}>
                            <text x="20" y={chartHeight - (val / maxValue) * chartHeight} className="text-sm fill-gray-500 font-medium" textAnchor="end">
                                {val}
                            </text>
                            <line
                                x1="40"
                                y1={chartHeight - (val / maxValue) * chartHeight}
                                x2={chartWidth - 40}
                                y2={chartHeight - (val / maxValue) * chartHeight}
                                className="stroke-gray-100"
                            />
                        </React.Fragment>
                    ))}

                    {/* X Axis Line */}
                    <line x1="40" y1={chartHeight} x2={chartWidth - 40} y2={chartHeight} className="stroke-gray-400 stroke-2" />
                    {/* Y Axis Line */}
                    <line x1="40" y1="0" x2="40" y2={chartHeight} className="stroke-gray-400 stroke-1" />

                    {/* Bars */}
                    {data.map((item, index) => {
                        const barHeight = (item.value / maxValue) * chartHeight;
                        const x = 60 + index * (barWidth + gap);
                        return (
                            <g key={item.month}>
                                <rect
                                    x={x}
                                    y={chartHeight - barHeight}
                                    width={barWidth}
                                    height={barHeight}
                                    fill="#869ED9"
                                    rx="6"
                                    className="transition-all hover:fill-blue-500 cursor-pointer"
                                />
                                <text
                                    x={x + barWidth / 2}
                                    y={chartHeight + 25}
                                    textAnchor="middle"
                                    className="text-xs fill-gray-700 font-medium"
                                >
                                    {item.month}
                                </text>
                            </g>
                        );
                    })}
                </svg>
            </div>
        </div>
    );
};

export default CustomBarChart;
