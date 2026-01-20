import { useNavigate } from 'react-router-dom';
import { HomeOutlined } from '@ant-design/icons';
import Lottie from 'lottie-react';
import catAnimation from '../assets/animation/cat404.json';

export default function NotFound() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50/70 via-pink-50/50 to-orange-50/60 flex items-center justify-center p-4 relative overflow-hidden">
            {/* Decorative Background Elements - Softer */}
            <div className="absolute top-0 left-0 w-96 h-96 bg-purple-200/20 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-pink-200/20 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" style={{ animationDelay: '1.5s' }}></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-orange-200/15 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" style={{ animationDelay: '3s' }}></div>

            <div className="text-center max-w-2xl relative z-10">
                {/* Cat Animation - NOW THE HERO */}
                <div className="mb-6 flex justify-center">
                    <div className="relative">
                        {/* Main cat container with subtle shadow */}
                        <div className="relative bg-white/30 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-white/40">
                            <Lottie
                                animationData={catAnimation}
                                loop={true}
                                className="w-[280px] h-[200px] md:w-[350px] md:h-[250px]"
                            />

                            {/* Paw prints trail - subtle storytelling */}
                            <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 flex gap-3 opacity-30">
                                <span className="text-2xl animate-pulse" style={{ animationDelay: '0s' }}>🐾</span>
                                <span className="text-xl animate-pulse" style={{ animationDelay: '0.3s' }}>🐾</span>
                                <span className="text-lg animate-pulse" style={{ animationDelay: '0.6s' }}>🐾</span>
                            </div>
                        </div>

                        {/* Thought bubble - cat's perspective */}
                        <div className="absolute -top-6 -right-6 bg-white/90 backdrop-blur-sm text-gray-700 px-4 py-2 rounded-2xl text-sm font-medium shadow-lg border border-gray-200/50 animate-bounce" style={{ animationDuration: '3s' }}>
                            <span className="text-base">🤔</span>
                            <div className="absolute -bottom-2 right-6 w-3 h-3 bg-white/90 rotate-45 border-r border-b border-gray-200/50"></div>
                        </div>
                    </div>
                </div>

                {/* 404 Number - Smaller, supporting role */}
                <h1 className="text-[100px] md:text-[140px] font-black text-gray-300/60 leading-none mb-4">
                    404
                </h1>

                {/* Message - Personal & Empathetic */}
                <div className="space-y-3 mb-8">
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
                        Sepertinya aku tersesat...
                    </h2>
                    <p className="text-base md:text-lg text-gray-600 max-w-md mx-auto leading-relaxed">
                        Aku tidak menemukan halaman itu, tapi aku bisa mengantarmu pulang
                    </p>
                </div>

                {/* Buttons - With personality */}
                <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
                    <button
                        onClick={() => navigate(-1)}
                        className="group px-7 py-3 bg-white text-gray-600 rounded-xl font-medium border-2 border-gray-200 hover:border-purple-300 hover:bg-purple-50 hover:text-purple-700 transition-all duration-300 flex items-center gap-2 shadow-sm hover:shadow-md relative overflow-hidden"
                    >
                        <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Kembali
                        {/* Tooltip on hover */}
                        <span className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap pointer-events-none">
                            Ke halaman sebelumnya
                        </span>
                    </button>

                    <button
                        onClick={() => navigate('/')}
                        className="group px-7 py-3 bg-gradient-to-r from-purple-400 to-pink-400 text-white rounded-xl font-medium hover:from-purple-500 hover:to-pink-500 transition-all duration-300 flex items-center gap-2 shadow-md hover:shadow-lg relative overflow-hidden"
                    >
                        <HomeOutlined className="text-base group-hover:scale-110 transition-transform duration-300" />
                        Pulang Yuk
                        {/* Tooltip on hover */}
                        <span className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap pointer-events-none flex items-center gap-1">
                            Ke beranda 🐾
                        </span>
                    </button>
                </div>

                {/* Footer message - Comforting */}
                <p className="mt-8 text-sm text-gray-500 italic">
                    Jangan khawatir, aku akan menemanimu di sini
                </p>
            </div>
        </div>
    );
}
