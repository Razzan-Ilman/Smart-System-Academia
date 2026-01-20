import { useNavigate } from 'react-router-dom';
import { HomeOutlined } from '@ant-design/icons';
import Lottie from 'lottie-react';
import catAnimation from '../assets/animation/cat404.json';

export default function NotFound() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 flex items-center justify-center p-4 relative overflow-hidden">
            {/* Decorative Background Elements */}
            <div className="absolute top-0 left-0 w-96 h-96 bg-purple-200/30 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-pink-200/30 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-orange-200/20 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>

            <div className="text-center max-w-3xl relative z-10">
                {/* 404 Number - Large and Bold */}
                <h1 className="text-[140px] md:text-[200px] font-black bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 bg-clip-text text-transparent leading-none mb-8 animate-pulse">
                    404
                </h1>

                {/* Cat Animation - Featured prominently */}
                <div className="mb-8 flex justify-center">
                    <div className="relative bg-white/40 backdrop-blur-md rounded-3xl p-8 shadow-2xl border border-white/50">
                        <Lottie
                            animationData={catAnimation}
                            loop={true}
                            className="w-[280px] h-[200px] md:w-[420px] md:h-[300px]"
                        />

                        {/* Floating text around animation */}
                        <div className="absolute -top-4 -left-4 bg-purple-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg animate-bounce">
                            Oops!
                        </div>
                        <div className="absolute -bottom-4 -right-4 bg-pink-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg animate-bounce" style={{ animationDelay: '0.2s' }}>
                            Lost?
                        </div>
                    </div>
                </div>

                {/* Message */}
                <div className="space-y-3 mb-10">
                    <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-700 to-pink-700 bg-clip-text text-transparent">
                        Halaman Tidak Ditemukan
                    </h2>
                    <p className="text-lg text-gray-700 max-w-md mx-auto">
                        Kucing kami sudah mencari ke seluruh internet, tapi tidak menemukan halaman yang Anda cari
                    </p>
                </div>

                {/* Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                    <button
                        onClick={() => navigate(-1)}
                        className="group px-8 py-3.5 bg-white text-purple-700 rounded-xl font-bold border-2 border-purple-600 hover:bg-purple-600 hover:text-white transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-xl hover:scale-105"
                    >
                        <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Kembali
                    </button>

                    <button
                        onClick={() => navigate('/')}
                        className="group px-8 py-3.5 bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 text-white rounded-xl font-bold hover:from-purple-700 hover:via-pink-700 hover:to-orange-700 transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-xl hover:scale-105"
                    >
                        <HomeOutlined className="text-lg" />
                        Ke Beranda
                    </button>
                </div>

                {/* Fun fact */}
                <p className="mt-10 text-sm text-gray-600/80 italic">
                    🐱 Kucing kami sedang beristirahat setelah pencarian yang panjang...
                </p>
            </div>
        </div>
    );
}
