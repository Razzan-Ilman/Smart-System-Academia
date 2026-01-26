import React, { useEffect, useState } from 'react';
import Lottie from 'lottie-react';

const PhoneAnimation: React.FC = () => {
    const [animationData, setAnimationData] = useState<any>(null);

    useEffect(() => {
        // Load the Lottie animation file from public folder
        fetch('/phone2.json')
            .then(response => response.json())
            .then(data => setAnimationData(data))
            .catch(error => console.error('Error loading animation:', error));
    }, []);

    if (!animationData) {
        return (
            <div className="relative w-full h-full flex items-center justify-center">
                <div className="animate-pulse text-purple-400">Loading animation...</div>
            </div>
        );
    }

    return (
        <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
            {/* Animated Background Circles */}
            <div className="absolute inset-0">
                <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-gradient-to-br from-purple-400/20 to-blue-400/20 rounded-full blur-3xl animate-pulse-slow"></div>
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-br from-blue-400/20 to-pink-400/20 rounded-full blur-3xl animate-pulse-slower"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gradient-to-br from-pink-400/15 to-purple-400/15 rounded-full blur-3xl animate-spin-very-slow"></div>
            </div>

            {/* Lottie Phone Animation */}
            <div className="relative z-10 w-full max-w-2xl px-8 animate-float">
                <Lottie
                    animationData={animationData}
                    loop={true}
                    autoplay={true}
                    style={{ width: '100%', height: 'auto' }}
                />
            </div>

            {/* Floating Particles */}
            <div className="absolute inset-0 pointer-events-none">
                {[...Array(12)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute rounded-full animate-float-particle"
                        style={{
                            width: `${4 + Math.random() * 8}px`,
                            height: `${4 + Math.random() * 8}px`,
                            background: `linear-gradient(135deg, rgba(168, 85, 247, ${0.3 + Math.random() * 0.3}), rgba(59, 130, 246, ${0.3 + Math.random() * 0.3}))`,
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            animationDelay: `${i * 0.4}s`,
                            animationDuration: `${3 + Math.random() * 3}s`,
                        }}
                    ></div>
                ))}
            </div>

            {/* Subtle Grid Pattern Overlay */}
            <div className="absolute inset-0 opacity-5 pointer-events-none"
                style={{
                    backgroundImage: `linear-gradient(rgba(139, 92, 246, 0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(139, 92, 246, 0.3) 1px, transparent 1px)`,
                    backgroundSize: '50px 50px'
                }}
            ></div>
        </div>
    );
};

export default PhoneAnimation;
