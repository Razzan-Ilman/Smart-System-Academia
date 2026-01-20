import { useNavigate } from 'react-router-dom';
import { HomeOutlined } from '@ant-design/icons';
import Lottie from 'lottie-react';
import catAnimation from '../assets/animation/cat404.json';

export default function NotFound() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-100 via-gray-50 to-white flex items-center justify-center p-4 relative overflow-hidden">
            {/* Decorative Background Elements - Monochrome */}
            <div className="absolute top-0 left-0 w-96 h-96 bg-gray-300/20 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-gray-300/20 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" style={{ animationDelay: '1.5s' }}></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gray-200/15 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" style={{ animationDelay: '3s' }}></div>

            <div className="text-center max-w-2xl relative z-10 w-full">
                {/* 404 Number - At the top */}
                <h1 className="text-[120px] md:text-[160px] font-black text-gray-300/40 leading-none mb-6 tracking-tighter">
                    404
                </h1>

                {/* Cat Animation - Compact */}
                <div className="mb-6 flex justify-center">
                    <div className="relative">
                        {/* Main cat container */}
                        <div className="relative bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-gray-200">
                            <Lottie
                                animationData={catAnimation}
                                loop={true}
                                className="w-[240px] h-[180px] md:w-[300px] md:h-[220px]"
                            />

                            {/* Paw prints trail */}
                            <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 flex gap-2 opacity-30">
                                <span className="text-xl animate-pulse text-gray-400" style={{ animationDelay: '0s' }}>🐾</span>
                                <span className="text-lg animate-pulse text-gray-400" style={{ animationDelay: '0.3s' }}>🐾</span>
                                <span className="text-base animate-pulse text-gray-400" style={{ animationDelay: '0.6s' }}>🐾</span>
                            </div>
                        </div>

                        {/* Thought bubble */}
                        <div className="absolute -top-4 -right-4 bg-white backdrop-blur-sm text-gray-800 px-3 py-1.5 rounded-xl text-sm font-medium shadow-lg border border-gray-200 animate-bounce" style={{ animationDuration: '3s' }}>
                            <span className="text-base">🤔</span>
                            <div className="absolute -bottom-1.5 right-4 w-2.5 h-2.5 bg-white rotate-45 border-r border-b border-gray-200"></div>
                        </div>
                    </div>
                </div>

                {/* Message - Compact */}
                <div className="space-y-2 mb-6">
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                        Sepertinya aku tersesat...
                    </h2>
                    <p className="text-base text-gray-600 max-w-md mx-auto">
                        Aku tidak menemukan halaman itu, tapi aku bisa mengantarmu pulang
                    </p>
                </div>

                {/* Buttons - Monochrome theme */}
                <div className="flex flex-col sm:flex-row gap-3 justify-center items-center mb-6">
                    <button
                        onClick={() => navigate(-1)}
                        className="group px-7 py-3 bg-white text-gray-700 rounded-xl font-medium border-2 border-gray-300 hover:border-gray-900 hover:bg-gray-50 hover:text-gray-900 transition-all duration-300 flex items-center gap-2 shadow-sm hover:shadow-md relative overflow-hidden"
                    >
                        <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Kembali
                        {/* Tooltip */}
                        <span className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap pointer-events-none">
                            Ke halaman sebelumnya
                        </span>
                    </button>

                    <button
                        onClick={() => navigate('/')}
                        className="group px-7 py-3 bg-gray-900 text-white rounded-xl font-medium hover:bg-black transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-xl relative overflow-hidden"
                    >
                        <HomeOutlined className="text-base group-hover:scale-110 transition-transform duration-300" />
                        Pulang Yuk
                        {/* Tooltip */}
                        <span className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap pointer-events-none flex items-center gap-1">
                            Ke beranda 🐾
                        </span>
                    </button>
                </div>

                {/* Footer message */}
                <p className="text-sm text-gray-500 italic">
                    Jangan khawatir, aku akan menemanimu di sini
                </p>
            </div>
        </div>
    );
}
