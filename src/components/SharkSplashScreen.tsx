import { useState, useEffect } from 'react';

const SharkSplashScreen = ({ onComplete }: { onComplete: () => void }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onComplete, 300); // Quick fade out
    }, 1800); // Only 1.8 seconds total

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className={`fixed inset-0 z-50 bg-gradient-to-b from-blue-900 via-blue-800 to-blue-900 flex items-center justify-center transition-opacity duration-300 ${
      isVisible ? 'opacity-100' : 'opacity-0'
    }`}>
      {/* Dark ocean background */}
      <div className="absolute inset-0 bg-black/20"></div>
      
      {/* Fast shark attack animation */}
      <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
        <div className="animate-[slide-in-right_1.2s_cubic-bezier(0.23,1,0.32,1)] transform scale-150">
          <svg
            width="400"
            height="200"
            viewBox="0 0 400 200"
            className="drop-shadow-2xl"
          >
            {/* Shark main body - streamlined and aggressive */}
            <path d="M 80 100 Q 180 70 300 100 Q 250 130 80 100" fill="#2d3748" className="animate-pulse"/>
            
            {/* Shark head - very pointed and aggressive */}
            <path d="M 30 100 Q 80 80 120 100 Q 80 120 30 100" fill="#1a202c"/>
            
            {/* Massive open mouth */}
            <path d="M 35 100 Q 70 135 130 100 Q 90 110 50 120 Q 70 75 35 100" fill="#000000" className="animate-pulse"/>
            
            {/* Multiple rows of razor sharp teeth */}
            <g className="animate-[scale-in_0.8s_ease-out_0.3s] fill-white">
              {/* Top row of teeth */}
              {[...Array(18)].map((_, i) => (
                <polygon
                  key={i}
                  points={`${45 + i * 4.5},100 ${47 + i * 4.5},85 ${49 + i * 4.5},100`}
                  fill="white"
                />
              ))}
              {/* Bottom row of teeth */}
              {[...Array(16)].map((_, i) => (
                <polygon
                  key={i + 18}
                  points={`${47 + i * 4.8},100 ${49 + i * 4.8},115 ${51 + i * 4.8},100`}
                  fill="white"
                />
              ))}
              {/* Inner teeth for depth */}
              {[...Array(10)].map((_, i) => (
                <polygon
                  key={i + 34}
                  points={`${60 + i * 6},100 ${62 + i * 6},92 ${64 + i * 6},100`}
                  fill="#f0f0f0"
                />
              ))}
            </g>
            
            {/* Menacing eye */}
            <circle cx="110" cy="85" r="8" fill="black"/>
            <circle cx="112" cy="83" r="3" fill="#ff0000" className="animate-pulse"/>
            <circle cx="114" cy="81" r="1" fill="white"/>
            
            {/* Large dorsal fin */}
            <path d="M 180 35 L 220 15 L 230 85 L 190 75 Z" fill="#1a202c"/>
            
            {/* Powerful tail fin */}
            <path d="M 300 100 L 340 60 L 350 100 L 340 140 Z" fill="#2d3748"/>
            
            {/* Aggressive side fins */}
            <path d="M 150 120 L 180 145 L 210 125 L 180 115 Z" fill="#1a202c"/>
            <path d="M 220 120 L 250 145 L 280 125 L 250 115 Z" fill="#1a202c"/>
            
            {/* Gills with movement */}
            <g stroke="#000" strokeWidth="3" fill="none" className="animate-pulse">
              <path d="M 130 80 Q 140 90 130 100"/>
              <path d="M 145 80 Q 155 90 145 100"/>
              <path d="M 160 80 Q 170 90 160 100"/>
              <path d="M 175 80 Q 185 90 175 100"/>
            </g>
            
            {/* Scars for realism */}
            <g stroke="#555" strokeWidth="1" fill="none" opacity="0.7">
              <path d="M 140 95 Q 160 98 180 95"/>
              <path d="M 200 110 Q 220 108 240 110"/>
            </g>
          </svg>
        </div>
        
        {/* Blood trail effect */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/2 left-1/4 w-96 h-8 bg-red-600/30 rounded-full animate-[slide-in-right_1.2s_ease-out] transform -translate-y-1/2 blur-sm"></div>
        </div>
      </div>
      
      {/* Fast moving bubbles */}
      {[...Array(20)].map((_, i) => (
        <div
          key={i}
          className={`absolute w-2 h-2 bg-white/40 rounded-full animate-[slide-in-right_${0.8 + Math.random() * 0.6}s_ease-out]`}
          style={{
            left: `${-10 + Math.random() * 30}%`,
            top: `${20 + Math.random() * 60}%`,
            animationDelay: `${Math.random() * 1}s`,
          }}
        />
      ))}
    </div>
  );
};

export default SharkSplashScreen;