import { useNavigate } from 'react-router-dom';
import { HomeOutlined } from '@ant-design/icons';
import { useState, useEffect } from 'react';

export default function NotFound() {
    const navigate = useNavigate();
    const [catEyes, setCatEyes] = useState({ left: 0, right: 0 });
    const [isBlinking, setIsBlinking] = useState(false);
    const [tailWag, setTailWag] = useState(0);

    // Cat eyes follow mouse
    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            const eyeMovement = ((e.clientX / window.innerWidth) - 0.5) * 10;
            setCatEyes({ left: eyeMovement, right: eyeMovement });
        };
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    // Random blinking
    useEffect(() => {
        const blinkInterval = setInterval(() => {
            setIsBlinking(true);
            setTimeout(() => setIsBlinking(false), 200);
        }, 3000 + Math.random() * 2000);
        return () => clearInterval(blinkInterval);
    }, []);

    // Tail wagging
    useEffect(() => {
        const wagInterval = setInterval(() => {
            setTailWag(prev => (prev + 1) % 3);
        }, 500);
        return () => clearInterval(wagInterval);
    }, []);

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="text-center max-w-2xl">
                {/* 404 Number - Minimalist */}
                <h1 className="text-[120px] md:text-[160px] font-black text-gray-900 leading-none mb-4">
                    404
                </h1>

                {/* Cat Mascot */}
                <div className="mb-8 flex justify-center">
                    <div className="relative">
                        {/* Cat Body */}
                        <svg width="200" height="200" viewBox="0 0 200 200" className="drop-shadow-lg">
                            {/* Tail */}
                            <path
                                d="M 160 120 Q 180 100 185 80"
                                stroke="#1f2937"
                                strokeWidth="8"
                                fill="none"
                                strokeLinecap="round"
                                className="transition-all duration-300"
                                style={{
                                    transform: `rotate(${tailWag * 5}deg)`,
                                    transformOrigin: '160px 120px',
                                }}
                            />

                            {/* Body */}
                            <ellipse cx="100" cy="130" rx="50" ry="45" fill="#1f2937" />

                            {/* Head */}
                            <circle cx="100" cy="80" r="40" fill="#1f2937" />

                            {/* Ears */}
                            <path d="M 70 60 L 60 30 L 80 50 Z" fill="#1f2937" />
                            <path d="M 130 60 L 140 30 L 120 50 Z" fill="#1f2937" />

                            {/* Inner Ears */}
                            <path d="M 70 55 L 65 40 L 75 50 Z" fill="#f3f4f6" />
                            <path d="M 130 55 L 135 40 L 125 50 Z" fill="#f3f4f6" />

                            {/* Face white patch */}
                            <ellipse cx="100" cy="85" rx="25" ry="20" fill="#f3f4f6" />

                            {/* Eyes */}
                            <g className={isBlinking ? 'opacity-0' : 'opacity-100'} style={{ transition: 'opacity 0.1s' }}>
                                {/* Left Eye */}
                                <ellipse cx="88" cy="75" rx="8" ry="12" fill="#1f2937" />
                                <circle
                                    cx={88 + catEyes.left}
                                    cy="75"
                                    r="3"
                                    fill="white"
                                    className="transition-all duration-200"
                                />

                                {/* Right Eye */}
                                <ellipse cx="112" cy="75" rx="8" ry="12" fill="#1f2937" />
                                <circle
                                    cx={112 + catEyes.right}
                                    cy="75"
                                    r="3"
                                    fill="white"
                                    className="transition-all duration-200"
                                />
                            </g>

                            {/* Blinking eyes */}
                            {isBlinking && (
                                <g>
                                    <line x1="80" y1="75" x2="96" y2="75" stroke="#1f2937" strokeWidth="3" strokeLinecap="round" />
                                    <line x1="104" y1="75" x2="120" y2="75" stroke="#1f2937" strokeWidth="3" strokeLinecap="round" />
                                </g>
                            )}

                            {/* Nose */}
                            <path d="M 100 85 L 95 90 L 105 90 Z" fill="#ef4444" />

                            {/* Mouth */}
                            <path d="M 100 90 Q 95 95 90 93" stroke="#1f2937" strokeWidth="2" fill="none" strokeLinecap="round" />
                            <path d="M 100 90 Q 105 95 110 93" stroke="#1f2937" strokeWidth="2" fill="none" strokeLinecap="round" />

                            {/* Whiskers */}
                            <line x1="60" y1="80" x2="40" y2="75" stroke="#1f2937" strokeWidth="1.5" />
                            <line x1="60" y1="85" x2="40" y2="85" stroke="#1f2937" strokeWidth="1.5" />
                            <line x1="60" y1="90" x2="40" y2="95" stroke="#1f2937" strokeWidth="1.5" />
                            <line x1="140" y1="80" x2="160" y2="75" stroke="#1f2937" strokeWidth="1.5" />
                            <line x1="140" y1="85" x2="160" y2="85" stroke="#1f2937" strokeWidth="1.5" />
                            <line x1="140" y1="90" x2="160" y2="95" stroke="#1f2937" strokeWidth="1.5" />

                            {/* Paws */}
                            <ellipse cx="80" cy="170" rx="12" ry="8" fill="#1f2937" />
                            <ellipse cx="120" cy="170" rx="12" ry="8" fill="#1f2937" />
                        </svg>

                        {/* Floating "?" */}
                        <div className="absolute -right-8 top-8 text-4xl animate-bounce">
                            ?
                        </div>
                    </div>
                </div>

                {/* Message */}
                <div className="space-y-2 mb-8">
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                        Halaman Tidak Ditemukan
                    </h2>
                    <p className="text-base text-gray-600">
                        Sepertinya kucing kami tidak bisa menemukan halaman yang Anda cari
                    </p>
                </div>

                {/* Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
                    <button
                        onClick={() => navigate(-1)}
                        className="group px-6 py-2.5 bg-white text-gray-900 rounded-lg font-medium border-2 border-gray-900 hover:bg-gray-900 hover:text-white transition-all duration-300 flex items-center gap-2"
                    >
                        <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Kembali
                    </button>

                    <button
                        onClick={() => navigate('/')}
                        className="group px-6 py-2.5 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-all duration-300 flex items-center gap-2"
                    >
                        <HomeOutlined className="text-base" />
                        Ke Beranda
                    </button>
                </div>

                {/* Fun fact */}
                <p className="mt-8 text-sm text-gray-400 italic">
                    💡 Tip: Gerakkan mouse Anda dan lihat mata kucingnya!
                </p>
            </div>
        </div>
    );
}
