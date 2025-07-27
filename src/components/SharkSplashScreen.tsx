import { useState, useEffect } from 'react';

const SharkSplashScreen = ({ onComplete }: { onComplete: () => void }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onComplete, 500); // Wait for fade out animation
    }, 3000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className={`fixed inset-0 z-50 bg-gradient-to-b from-blue-400 via-blue-500 to-blue-600 flex items-center justify-center transition-opacity duration-500 ${
      isVisible ? 'opacity-100' : 'opacity-0'
    }`}>
      {/* Ocean waves background */}
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-blue-700 to-transparent opacity-50">
        <div className="absolute bottom-0 left-0 w-full h-16 bg-wave-pattern animate-pulse"></div>
      </div>
      
      {/* Shark animation */}
      <div className="relative">
        <div className="animate-[slide-in-right_2s_ease-out] transform">
          {/* Shark body */}
          <div className="relative">
            <svg
              width="350"
              height="180"
              viewBox="0 0 350 180"
              className="drop-shadow-2xl"
            >
              {/* Shark main body */}
              <path d="M 50 90 Q 150 60 250 90 Q 200 120 50 90" fill="#4a5568" className="animate-pulse"/>
              
              {/* Shark head (pointed) */}
              <path d="M 20 90 Q 50 75 80 90 Q 50 105 20 90" fill="#2d3748"/>
              
              {/* Shark mouth (open) */}
              <path d="M 25 90 Q 45 105 75 90 Q 55 95 35 100 Q 45 85 25 90" fill="#1a202c" className="animate-pulse"/>
              
              {/* Sharp teeth */}
              <g className="animate-[scale-in_1s_ease-out_1.5s]">
                {[...Array(12)].map((_, i) => (
                  <polygon
                    key={i}
                    points={`${30 + i * 4},90 ${32 + i * 4},82 ${34 + i * 4},90`}
                    fill="white"
                  />
                ))}
                {[...Array(10)].map((_, i) => (
                  <polygon
                    key={i + 12}
                    points={`${32 + i * 4},90 ${34 + i * 4},98 ${36 + i * 4},90`}
                    fill="white"
                  />
                ))}
              </g>
              
              {/* Eye (menacing) */}
              <circle cx="70" cy="75" r="6" fill="black"/>
              <circle cx="72" cy="73" r="2" fill="red"/>
              
              {/* Dorsal fin (large and sharp) */}
              <path d="M 150 30 L 180 10 L 190 70 L 160 60 Z" fill="#2d3748"/>
              
              {/* Tail fin */}
              <path d="M 250 90 L 280 60 L 290 90 L 280 120 Z" fill="#4a5568"/>
              
              {/* Side fins */}
              <path d="M 120 110 L 140 130 L 160 115 L 140 105 Z" fill="#2d3748"/>
              <path d="M 180 110 L 200 130 L 220 115 L 200 105 Z" fill="#2d3748"/>
              
              {/* Gills */}
              <g stroke="#1a202c" strokeWidth="2" fill="none">
                <path d="M 90 70 Q 95 80 90 90"/>
                <path d="M 100 70 Q 105 80 100 90"/>
                <path d="M 110 70 Q 115 80 110 90"/>
              </g>
            </svg>
          </div>
        </div>
        
        {/* Blood/water effect */}
        <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2">
          <div className="w-80 h-20 bg-red-500/20 rounded-full animate-ping"></div>
        </div>
      </div>
      
      {/* Bubbles */}
      {[...Array(15)].map((_, i) => (
        <div
          key={i}
          className={`absolute w-3 h-3 bg-white/30 rounded-full animate-bounce`}
          style={{
            left: `${10 + Math.random() * 80}%`,
            top: `${20 + Math.random() * 60}%`,
            animationDelay: `${Math.random() * 2}s`,
            animationDuration: `${1.5 + Math.random() * 2}s`
          }}
        />
      ))}
    </div>
  );
};

export default SharkSplashScreen;