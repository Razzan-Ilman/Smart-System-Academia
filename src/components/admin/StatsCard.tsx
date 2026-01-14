import React from 'react';
import { EyeInvisibleOutlined, EyeOutlined } from '@ant-design/icons';

interface StatsCardProps {
    type: 'profile' | 'balance';
    image?: string;
    name?: string;
    amount?: string;
}

const StatsCard: React.FC<StatsCardProps> = ({ type, image, name, amount }) => {
    const [showBalance, setShowBalance] = React.useState(false);

    if (type === 'profile') {
        return (
            <div className="relative w-full h-44 rounded-2xl overflow-hidden shadow-lg bg-gradient-to-br from-[#A7BEE6] to-[#CBD5E1] p-6 flex items-center gap-6">
                {/* Abstract Circles */}
                <div className="absolute top-0 right-0 w-40 h-40 bg-[#94A3B8] rounded-full -mr-16 -mt-16 opacity-30"></div>
                <div className="absolute bottom-0 right-1/4 w-32 h-32 bg-[#94A3B8] rounded-full -mb-16 opacity-20"></div>
                <div className="absolute top-1/4 left-1/2 w-20 h-20 bg-[#64748B] rounded-full opacity-20"></div>

                {/* Profile Info */}
                <div className="z-10 bg-white/50 rounded-full p-2 border-2 border-white">
                    <img src={image} alt="Profile" className="w-20 h-20 rounded-full object-cover shadow-md" />
                </div>

                <div className="z-10 flex-1 space-y-3">
                    <div className="bg-white/70 rounded-full px-5 py-2 flex items-center shadow-inner">
                        <span className="text-gray-900 font-bold mr-2 text-lg">Nama:</span>
                        <span className="text-gray-700 text-lg">{name}</span>
                    </div>
                    <div className="bg-white/70 h-3 w-3/4 rounded-full shadow-inner mx-4"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="relative w-full h-44 rounded-2xl overflow-hidden shadow-lg bg-gradient-to-br from-[#E2E8F0] to-[#E2CFF7] p-6 flex items-center justify-between">
            {/* Abstract Circles */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#A855F7] rounded-full -mr-12 -mt-12 opacity-10"></div>
            <div className="absolute bottom-0 left-0 w-44 h-44 bg-[#9333EA] rounded-full -ml-16 -mb-16 opacity-10"></div>
            <div className="absolute top-1/4 right-1/4 w-16 h-16 bg-[#D8B4FE] rounded-full opacity-20"></div>

            <div className="z-10 flex items-center gap-6 w-full">
                {/* IDR Label */}
                <div className="bg-white/40 backdrop-blur-sm rounded-3xl px-8 py-6 flex items-center justify-center shadow-md">
                    <span className="text-2xl font-bold text-gray-800 tracking-tight">IDR</span>
                </div>

                {/* Balance Display */}
                <div className="flex-1 bg-white/40 backdrop-blur-sm rounded-2xl p-6 flex items-center justify-between shadow-md">
                    <span className="text-2xl font-mono tracking-[0.2em] text-gray-700">
                        {showBalance ? amount : '---- . ----'}
                    </span>
                    <button
                        onClick={() => setShowBalance(!showBalance)}
                        className="text-2xl text-gray-600 hover:text-gray-900 transition-colors"
                    >
                        {showBalance ? <EyeOutlined /> : <EyeInvisibleOutlined />}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default StatsCard;
