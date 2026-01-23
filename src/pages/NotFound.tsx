import { useNavigate } from 'react-router-dom';
import { HomeOutlined } from '@ant-design/icons';
import Lottie from 'lottie-react';
import catAnimation from '../assets/animation/cat404.json';

export default function NotFound() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/20 flex items-center justify-center p-4 relative overflow-hidden">
            {/* Decorative Background Elements - Subtle colors */}
            <div className="absolute top-0 left-0 w-96 h-96 bg-blue-200/20 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-200/20 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" style={{ animationDelay: '1.5s' }}></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-slate-200/15 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" style={{ animationDelay: '3s' }}></div>

            {/* Minimal decorative shapes */}
            <div className="absolute top-20 left-20 w-2 h-2 bg-blue-300/40 rounded-full animate-pulse"></div>
            <div className="absolute top-40 right-32 w-3 h-3 bg-purple-300/40 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
            <div className="absolute bottom-32 left-32 w-2 h-2 bg-slate-300/40 rounded-full animate-pulse" style={{ animationDelay: '2s' }}></div>
            <div className="absolute bottom-20 right-20 w-3 h-3 bg-blue-300/40 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>

            <div className="text-center max-w-3xl relative z-10 w-full">
                {/* 404 Number - Subtle gradient */}
                <h1 className="text-[140px] md:text-[200px] font-black bg-gradient-to-r from-slate-300 via-blue-300/50 to-purple-300/50 bg-clip-text text-transparent leading-none mb-8 tracking-tighter">
                    404
                </h1>

                {/* Cat Animation - ONLY cat is bigger, box is smaller */}
                <div className="mb-8 flex justify-center">
                    <div className="relative">
                        {/* Smaller container with BIGGER cat inside */}
                        <div className="relative bg-white/80 backdrop-blur-md rounded-3xl p-4 shadow-2xl border-2 border-slate-200 hover:border-blue-300/50 transition-all duration-300 hover:shadow-blue-200/30 hover:shadow-3xl">
                            <Lottie
                                animationData={catAnimation}
                                loop={true}
                                className="w-[400px] h-[320px] md:w-[500px] md:h-[400px]"
                            />
                        </div>
                    </div>
                </div>

                {/* Message - Enhanced */}
                <div className="space-y-3 mb-8">
                    <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-slate-700 via-blue-600 to-purple-600 bg-clip-text text-transparent">
                        Sepertinya Kamu Tersesat...
                    </h2>
                    <p className="text-lg text-slate-600 max-w-md mx-auto font-medium">
                        Aku tidak menemukan halaman itu, tapi aku bisa mengantarmu pulang
                    </p>
                </div>

                {/* Buttons - Subtle color theme */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
                    <button
                        onClick={() => navigate(-1)}
                        className="group px-8 py-4 bg-white text-slate-700 rounded-2xl font-semibold border-2 border-slate-300 hover:border-blue-400 hover:bg-blue-50/50 hover:text-blue-700 transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-xl relative overflow-hidden transform hover:scale-105"
                    >
                        <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Kembali
                        {/* Tooltip */}
                        <span className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-slate-800 text-white text-sm px-4 py-2 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap pointer-events-none shadow-xl">
                            Ke halaman sebelumnya
                        </span>
                    </button>

                    <button
                        onClick={() => navigate('/')}
                        className="group px-8 py-4 bg-gradient-to-r from-slate-700 via-blue-600 to-purple-600 text-white rounded-2xl font-semibold hover:from-slate-800 hover:via-blue-700 hover:to-purple-700 transition-all duration-300 flex items-center gap-2 shadow-xl hover:shadow-2xl relative overflow-hidden transform hover:scale-105"
                    >
                        <HomeOutlined className="text-lg group-hover:scale-110 transition-transform duration-300" />
                        Pulang Yuk
                        {/* Tooltip */}
                        <span className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-slate-800 text-white text-sm px-4 py-2 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap pointer-events-none flex items-center gap-1 shadow-xl">
                            Ke beranda
                        </span>
                    </button>
                </div>

                {/* Footer message - enhanced */}
                <p className="text-base text-slate-600 italic font-medium">
                    Jangan khawatir, aku akan menemanimu di sini
                </p>
            </div>
        </div>
    );
}
