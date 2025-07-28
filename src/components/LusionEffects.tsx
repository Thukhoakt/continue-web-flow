import { useEffect, useRef, useState } from 'react';

interface MousePosition {
  x: number;
  y: number;
}

// Particle system for background
export const ParticleBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const particlesRef = useRef<Array<{
    x: number;
    y: number;
    vx: number;
    vy: number;
    size: number;
    opacity: number;
  }>>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const createParticles = () => {
      const particles = [];
      for (let i = 0; i < 50; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          size: Math.random() * 2 + 1,
          opacity: Math.random() * 0.3 + 0.1
        });
      }
      particlesRef.current = particles;
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particlesRef.current.forEach(particle => {
        particle.x += particle.vx;
        particle.y += particle.vy;

        if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
        if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;

        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${particle.opacity})`;
        ctx.fill();
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    resizeCanvas();
    createParticles();
    animate();

    window.addEventListener('resize', resizeCanvas);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 opacity-20"
      style={{ mixBlendMode: 'screen' }}
    />
  );
};

// Animated geometric lines
export const AnimatedLines = () => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const updateDimensions = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);

    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  return (
    <svg
      ref={svgRef}
      className="fixed inset-0 pointer-events-none z-10 opacity-20"
      width={dimensions.width}
      height={dimensions.height}
    >
      {/* Animated diagonal lines */}
      <g className="animate-pulse">
        {Array.from({ length: 8 }, (_, i) => (
          <line
            key={i}
            x1={i * (dimensions.width / 8)}
            y1="0"
            x2={i * (dimensions.width / 8) + 200}
            y2={dimensions.height}
            stroke="hsl(var(--primary))"
            strokeWidth="1"
            opacity="0.1"
            className="animate-[slide-in-right_4s_ease-in-out_infinite]"
            style={{
              animationDelay: `${i * 0.5}s`
            }}
          />
        ))}
      </g>
      
      {/* Flowing curves */}
      <g>
        {Array.from({ length: 3 }, (_, i) => (
          <path
            key={i}
            d={`M0,${dimensions.height * (0.3 + i * 0.2)} Q${dimensions.width * 0.25},${dimensions.height * (0.1 + i * 0.2)} ${dimensions.width * 0.5},${dimensions.height * (0.3 + i * 0.2)} T${dimensions.width},${dimensions.height * (0.2 + i * 0.2)}`}
            stroke="hsl(var(--primary))"
            strokeWidth="2"
            fill="none"
            opacity="0.15"
            className="animate-[float_6s_ease-in-out_infinite]"
            style={{
              animationDelay: `${i * 2}s`
            }}
          />
        ))}
      </g>
      
      {/* Grid pattern */}
      <defs>
        <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
          <path d="M 50 0 L 0 0 0 50" fill="none" stroke="hsl(var(--primary))" strokeWidth="0.5" opacity="0.1"/>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#grid)" />
    </svg>
  );
};

// Floating geometric shapes
export const FloatingShapes = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-5 overflow-hidden">
      {Array.from({ length: 6 }, (_, i) => (
        <div
          key={i}
          className={`absolute rounded-full border border-primary/10 animate-float`}
          style={{
            width: `${100 + i * 50}px`,
            height: `${100 + i * 50}px`,
            left: `${Math.random() * 80}%`,
            top: `${Math.random() * 80}%`,
            animationDelay: `${i * 1.5}s`,
            animationDuration: `${8 + i * 2}s`
          }}
        />
      ))}
      
      {/* Triangular shapes */}
      {Array.from({ length: 4 }, (_, i) => (
        <div
          key={`triangle-${i}`}
          className="absolute opacity-5 animate-[float_10s_ease-in-out_infinite]"
          style={{
            left: `${20 + i * 20}%`,
            top: `${10 + i * 15}%`,
            animationDelay: `${i * 2.5}s`,
            transform: `rotate(${i * 45}deg)`
          }}
        >
          <svg width="60" height="60" viewBox="0 0 60 60">
            <polygon
              points="30,5 55,50 5,50"
              fill="none"
              stroke="hsl(var(--primary))"
              strokeWidth="1"
            />
          </svg>
        </div>
      ))}
    </div>
  );
};

// Animated border effect
export const AnimatedBorder = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => {
  return (
    <div className={`relative group ${className}`}>
      <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/20 to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-[slide-in-right_2s_ease-in-out_infinite]" />
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

// Smooth scroll reveal effect
export const ScrollReveal = ({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) => {
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setIsVisible(true), delay);
        }
      },
      { threshold: 0.1 }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => observer.disconnect();
  }, [delay]);

  return (
    <div
      ref={elementRef}
      className={`transition-all duration-1000 ease-out ${
        isVisible 
          ? 'opacity-100 translate-y-0' 
          : 'opacity-0 translate-y-8'
      }`}
    >
      {children}
    </div>
  );
};

// Enhanced magnetic button with geometric effects
export const MagneticButton = ({ 
  children, 
  className = "",
  onClick,
  ...props 
}: {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
} & React.HTMLAttributes<HTMLDivElement>) => {
  const buttonRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      ref={buttonRef}
      className={`relative cursor-pointer transition-all duration-300 ease-out group ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
      {...props}
    >
      {/* Animated corners */}
      <div className={`absolute inset-0 transition-all duration-300 ${
        isHovered ? 'scale-105' : 'scale-100'
      }`}>
        <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
      
      {/* Glow effect */}
      <div className={`absolute inset-0 bg-primary/5 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 ${
        isHovered ? 'scale-110' : 'scale-100'
      }`} />
      
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

// Text reveal animation
export const TextReveal = ({ text, delay = 0 }: { text: string; delay?: number }) => {
  const [visibleChars, setVisibleChars] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      const interval = setInterval(() => {
        setVisibleChars(prev => {
          if (prev >= text.length) {
            clearInterval(interval);
            return prev;
          }
          return prev + 1;
        });
      }, 50);

      return () => clearInterval(interval);
    }, delay);

    return () => clearTimeout(timer);
  }, [text, delay]);

  return (
    <span className="relative">
      {text.split('').map((char, index) => (
        <span
          key={index}
          className={`transition-all duration-300 ${
            index < visibleChars ? 'opacity-100' : 'opacity-0'
          }`}
          style={{
            transitionDelay: `${index * 50}ms`
          }}
        >
          {char}
        </span>
      ))}
    </span>
  );
};

// Parallax container
export const ParallaxContainer = ({ 
  children, 
  speed = 0.5,
  className = ""
}: { 
  children: React.ReactNode; 
  speed?: number;
  className?: string;
}) => {
  const [offsetY, setOffsetY] = useState(0);
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (elementRef.current) {
        const rect = elementRef.current.getBoundingClientRect();
        const scrolled = window.pageYOffset;
        const rate = scrolled * speed;
        setOffsetY(rate);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [speed]);

  return (
    <div
      ref={elementRef}
      className={className}
      style={{
        transform: `translate3d(0, ${offsetY}px, 0)`
      }}
    >
      {children}
    </div>
  );
};