import { useState, useEffect } from 'react';

const LusionLoader = ({ onComplete }: { onComplete: () => void }) => {
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Smooth progress animation
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsVisible(false);
            setTimeout(onComplete, 500);
          }, 300);
          return 100;
        }
        return prev + 2;
      });
    }, 30);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div className={`fixed inset-0 z-50 bg-black flex items-center justify-center transition-opacity duration-500 ${
      isVisible ? 'opacity-100' : 'opacity-0'
    }`}>
      {/* Animated grid background */}
      <div className="absolute inset-0 opacity-10">
        <div className="grid grid-cols-20 grid-rows-20 h-full w-full">
          {Array.from({ length: 400 }, (_, i) => (
            <div
              key={i}
              className="border border-white/5 animate-pulse"
              style={{
                animationDelay: `${(i % 20) * 0.1}s`,
                animationDuration: '2s'
              }}
            />
          ))}
        </div>
      </div>

      {/* Main content */}
      <div className="relative flex flex-col items-center space-y-12">
        {/* Logo/Brand name with elegant typography */}
        <div className="relative">
          <h1 className="text-6xl font-thin text-white tracking-[0.2em] animate-fade-in">
            BLOG
          </h1>
          <div className="absolute -bottom-2 left-0 w-full h-px bg-gradient-to-r from-transparent via-white to-transparent animate-fade-in" 
               style={{ animationDelay: '0.5s' }} />
        </div>

        {/* Progress bar */}
        <div className="w-64 h-px bg-white/20 relative overflow-hidden animate-fade-in" 
             style={{ animationDelay: '1s' }}>
          <div 
            className="absolute top-0 left-0 h-full bg-white transition-all duration-75 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Progress percentage */}
        <div className="text-white/60 text-sm font-mono tracking-wider animate-fade-in"
             style={{ animationDelay: '1.2s' }}>
          {progress.toString().padStart(3, '0')}
        </div>

        {/* Subtle loading text */}
        <div className="text-white/40 text-xs tracking-[0.3em] uppercase animate-fade-in"
             style={{ animationDelay: '1.5s' }}>
          Loading Experience
        </div>
      </div>

      {/* Ambient particles */}
      {Array.from({ length: 30 }, (_, i) => (
        <div
          key={i}
          className="absolute w-1 h-1 bg-white/20 rounded-full animate-pulse"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 3}s`,
            animationDuration: `${2 + Math.random() * 3}s`
          }}
        />
      ))}
    </div>
  );
};

export default LusionLoader;