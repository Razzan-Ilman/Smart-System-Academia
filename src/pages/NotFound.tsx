import { useNavigate } from 'react-router-dom';
import { HomeOutlined } from '@ant-design/icons';
import { useState, useEffect } from 'react';

export default function NotFound() {
    const navigate = useNavigate();
    const [pandaEyes, setPandaEyes] = useState({ left: 0, right: 0 });
    const [catEyes, setCatEyes] = useState({ left: 0, right: 0 });
    const [isBlinking, setIsBlinking] = useState(false);
    const [pandaTailWag, setPandaTailWag] = useState(0);
    const [earWiggle, setEarWiggle] = useState(0);
    const [catTailWag, setCatTailWag] = useState(0);

    // Panda and Cat eyes follow mouse
    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            const pandaEyeMovement = ((e.clientX / window.innerWidth) - 0.5) * 6;
            const catEyeMovement = ((e.clientX / window.innerWidth) - 0.5) * 10;
            setPandaEyes({ left: pandaEyeMovement, right: pandaEyeMovement });
            setCatEyes({ left: catEyeMovement, right: catEyeMovement });
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

    // Panda tail wagging
    useEffect(() => {
        const wagInterval = setInterval(() => {
            setPandaTailWag((prev: number) => (prev + 1) % 2);
        }, 800);
        return () => clearInterval(wagInterval);
    }, []);

    // Ear wiggling
    useEffect(() => {
        const wiggleInterval = setInterval(() => {
            setEarWiggle(prev => (prev + 1) % 2);
        }, 600);
        return () => clearInterval(wiggleInterval);
    }, []);

    // Cat tail wagging
    useEffect(() => {
        const catWagInterval = setInterval(() => {
            setCatTailWag(prev => (prev + 1) % 3);
        }, 500);
        return () => clearInterval(catWagInterval);
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 flex items-center justify-center p-4 relative overflow-hidden">
            {/* Decorative Background Elements */}
            <div className="absolute top-0 left-0 w-96 h-96 bg-orange-200/30 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-amber-200/30 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-yellow-200/20 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>

            <div className="text-center max-w-2xl relative z-10">
                {/* 404 Number - Minimalist with gradient */}
                <h1 className="text-[120px] md:text-[160px] font-black bg-gradient-to-r from-gray-700 via-gray-800 to-gray-900 bg-clip-text text-transparent leading-none mb-4">
                    404
                </h1>

                {/* Panda & Cat Mascots */}
                <div className="mb-8 flex justify-center items-end gap-8">
                    {/* Cat Mascot */}
                    <div className="relative">
                        <svg width="180" height="180" viewBox="0 0 200 200" className="drop-shadow-2xl">
                            {/* Cat Tail */}
                            <path
                                d="M 160 120 Q 180 100 185 80"
                                stroke="#6b7280"
                                strokeWidth="8"
                                fill="none"
                                strokeLinecap="round"
                                className="transition-all duration-300"
                                style={{
                                    transform: `rotate(${catTailWag * 5}deg)`,
                                    transformOrigin: '160px 120px',
                                }}
                            />

                            {/* Body */}
                            <ellipse cx="100" cy="130" rx="50" ry="45" fill="#6b7280" />

                            {/* Head */}
                            <circle cx="100" cy="80" r="40" fill="#6b7280" />

                            {/* Ears */}
                            <path d="M 70 60 L 60 30 L 80 50 Z" fill="#6b7280" />
                            <path d="M 130 60 L 140 30 L 120 50 Z" fill="#6b7280" />

                            {/* Inner Ears */}
                            <path d="M 70 55 L 65 40 L 75 50 Z" fill="#fbbf24" />
                            <path d="M 130 55 L 135 40 L 125 50 Z" fill="#fbbf24" />

                            {/* Face white patch */}
                            <ellipse cx="100" cy="85" rx="25" ry="20" fill="white" />

                            {/* Eyes */}
                            <g className={isBlinking ? 'opacity-0' : 'opacity-100'} style={{ transition: 'opacity 0.1s' }}>
                                {/* Left Eye */}
                                <ellipse cx="88" cy="75" rx="8" ry="12" fill="#1f2937" />
                                <circle
                                    cx={88 + catEyes.left}
                                    cy="75"
                                    r="3"
                                    fill="#fbbf24"
                                    className="transition-all duration-200"
                                />

                                {/* Right Eye */}
                                <ellipse cx="112" cy="75" rx="8" ry="12" fill="#1f2937" />
                                <circle
                                    cx={112 + catEyes.right}
                                    cy="75"
                                    r="3"
                                    fill="#fbbf24"
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
                            <ellipse cx="80" cy="170" rx="12" ry="8" fill="#6b7280" />
                            <ellipse cx="120" cy="170" rx="12" ry="8" fill="#6b7280" />
                        </svg>
                    </div>

                    {/* Panda Mascot */}
                    <div className="relative">
                        {/* Panda SVG */}
                        <svg width="220" height="220" viewBox="0 0 220 220" className="drop-shadow-2xl">
                            {/* Tail */}
                            <g
                                className="transition-all duration-300"
                                style={{
                                    transform: `rotate(${pandaTailWag * 3 - 6}deg)`,
                                    transformOrigin: '170px 130px',
                                }}
                            >
                                <path
                                    d="M 170 130 Q 190 110 200 85 Q 205 70 210 60"
                                    stroke="#ea580c"
                                    strokeWidth="18"
                                    fill="none"
                                    strokeLinecap="round"
                                />
                                <path
                                    d="M 170 130 Q 190 110 200 85 Q 205 70 210 60"
                                    stroke="#fb923c"
                                    strokeWidth="12"
                                    fill="none"
                                    strokeLinecap="round"
                                />
                                {/* Tail tip - white */}
                                <circle cx="210" cy="60" r="8" fill="white" />
                            </g>

                            {/* Body */}
                            <ellipse cx="110" cy="140" rx="45" ry="40" fill="#ea580c" />
                            <ellipse cx="110" cy="145" rx="35" ry="30" fill="#fb923c" />

                            {/* Head */}
                            <circle cx="110" cy="90" r="42" fill="#ea580c" />

                            {/* Ears */}
                            <g
                                className="transition-all duration-200"
                                style={{
                                    transform: `rotate(${earWiggle * -3}deg)`,
                                    transformOrigin: '80px 55px',
                                }}
                            >
                                <path d="M 80 65 L 70 30 L 90 55 Z" fill="#ea580c" />
                                <path d="M 80 60 L 75 40 L 85 55 Z" fill="#1f2937" />
                            </g>
                            <g
                                className="transition-all duration-200"
                                style={{
                                    transform: `rotate(${earWiggle * 3}deg)`,
                                    transformOrigin: '140px 55px',
                                }}
                            >
                                <path d="M 140 65 L 150 30 L 130 55 Z" fill="#ea580c" />
                                <path d="M 140 60 L 145 40 L 135 55 Z" fill="#1f2937" />
                            </g>

                            {/* Face white patch */}
                            <ellipse cx="110" cy="95" rx="28" ry="25" fill="white" />

                            {/* Snout */}
                            <ellipse cx="110" cy="105" rx="18" ry="15" fill="#fb923c" />

                            {/* Eyes */}
                            <g className={isBlinking ? 'opacity-0' : 'opacity-100'} style={{ transition: 'opacity 0.1s' }}>
                                {/* Left Eye */}
                                <ellipse cx="95" cy="85" rx="7" ry="10" fill="#1f2937" />
                                <circle
                                    cx={95 + pandaEyes.left}
                                    cy="85"
                                    r="2.5"
                                    fill="white"
                                    className="transition-all duration-200"
                                />

                                {/* Right Eye */}
                                <ellipse cx="125" cy="85" rx="7" ry="10" fill="#1f2937" />
                                <circle
                                    cx={125 + pandaEyes.right}
                                    cy="85"
                                    r="2.5"
                                    fill="white"
                                    className="transition-all duration-200"
                                />
                            </g>

                            {/* Blinking eyes */}
                            {isBlinking && (
                                <g>
                                    <line x1="88" y1="85" x2="102" y2="85" stroke="#1f2937" strokeWidth="3" strokeLinecap="round" />
                                    <line x1="118" y1="85" x2="132" y2="85" stroke="#1f2937" strokeWidth="3" strokeLinecap="round" />
                                </g>
                            )}

                            {/* Nose */}
                            <ellipse cx="110" cy="103" rx="4" ry="3" fill="#1f2937" />

                            {/* Mouth */}
                            <path d="M 110 103 Q 105 108 100 106" stroke="#1f2937" strokeWidth="2" fill="none" strokeLinecap="round" />
                            <path d="M 110 103 Q 115 108 120 106" stroke="#1f2937" strokeWidth="2" fill="none" strokeLinecap="round" />

                            {/* Whiskers */}
                            <line x1="75" y1="95" x2="55" y2="90" stroke="#1f2937" strokeWidth="1.5" strokeLinecap="round" />
                            <line x1="75" y1="100" x2="55" y2="100" stroke="#1f2937" strokeWidth="1.5" strokeLinecap="round" />
                            <line x1="75" y1="105" x2="55" y2="110" stroke="#1f2937" strokeWidth="1.5" strokeLinecap="round" />
                            <line x1="145" y1="95" x2="165" y2="90" stroke="#1f2937" strokeWidth="1.5" strokeLinecap="round" />
                            <line x1="145" y1="100" x2="165" y2="100" stroke="#1f2937" strokeWidth="1.5" strokeLinecap="round" />
                            <line x1="145" y1="105" x2="165" y2="110" stroke="#1f2937" strokeWidth="1.5" strokeLinecap="round" />

                            {/* Front Paws */}
                            <ellipse cx="90" cy="175" rx="10" ry="7" fill="#ea580c" />
                            <ellipse cx="130" cy="175" rx="10" ry="7" fill="#ea580c" />

                            {/* Paw pads */}
                            <ellipse cx="90" cy="176" rx="6" ry="4" fill="#1f2937" />
                            <ellipse cx="130" cy="176" rx="6" ry="4" fill="#1f2937" />
                        </svg>

                        {/* Floating "?" with gradient */}
                        <div className="absolute -right-8 top-8 text-5xl font-bold bg-gradient-to-r from-gray-600 to-gray-800 bg-clip-text text-transparent animate-bounce">
                            ?
                        </div>
                    </div>
                </div>

                {/* Message */}
                <div className="space-y-2 mb-8">
                    <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-gray-700 to-gray-900 bg-clip-text text-transparent">
                        Halaman Tidak Ditemukan
                    </h2>
                    <p className="text-base text-gray-700">
                        Panda dan kucing kami sudah mencari ke mana-mana, tapi tidak menemukan halaman yang Anda cari
                    </p>
                </div>

                {/* Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
                    <button
                        onClick={() => navigate(-1)}
                        className="group px-6 py-2.5 bg-white text-gray-700 rounded-lg font-medium border-2 border-gray-600 hover:bg-gray-600 hover:text-white transition-all duration-300 flex items-center gap-2 shadow-md hover:shadow-lg"
                    >
                        <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Kembali
                    </button>

                    <button
                        onClick={() => navigate('/')}
                        className="group px-6 py-2.5 bg-gradient-to-r from-gray-700 to-gray-900 text-white rounded-lg font-medium hover:from-gray-800 hover:to-black transition-all duration-300 flex items-center gap-2 shadow-md hover:shadow-lg"
                    >
                        <HomeOutlined className="text-base" />
                        Ke Beranda
                    </button>
                </div>

                {/* Fun fact */}
                <p className="mt-8 text-sm text-gray-600/70 italic">
                    🐼🐱 Tip: Gerakkan mouse Anda dan lihat mata mereka!
                </p>
            </div>
        </div>
    );
}
