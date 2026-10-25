import React from 'react';

interface FlameLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'hero';
  showText?: boolean;
  className?: string;
  glow?: boolean;
}

export const FlameLogo: React.FC<FlameLogoProps> = ({
  size = 'md',
  className = '',
  glow = true
}) => {
  const sizeMap = {
    sm: { width: 40, height: 40 },
    md: { width: 72, height: 72 },
    lg: { width: 144, height: 144 },
    hero: { width: 260, height: 260 }
  };

  const { width, height } = sizeMap[size];

  return (
    <div
      className={`relative inline-flex items-center justify-center select-none ${className}`}
      style={{
        width: size === 'hero' ? 'clamp(180px, 56vw, 260px)' : width,
        height: size === 'hero' ? 'clamp(180px, 56vw, 260px)' : height,
        maxWidth: '100%'
      }}
      data-flame-focal="true"
    >
      {glow && (
        <div
          className={`absolute inset-0 rounded-full pointer-events-none ${
            size === 'hero' ? 'animate-pulse-warm' : ''
          }`}
          style={{
            background:
              size === 'hero'
                ? 'radial-gradient(circle at 50% 50%, rgba(74, 14, 20, 0.7) 0%, rgba(200, 104, 104, 0.3) 45%, transparent 70%)'
                : 'radial-gradient(circle at 50% 50%, rgba(74, 14, 20, 0.5) 0%, rgba(200, 104, 104, 0.22) 45%, transparent 65%)',
            transform: size === 'hero' ? 'scale(1.4)' : 'scale(1.2)',
            filter: size === 'hero' ? 'blur(25px)' : 'blur(12px)',
            zIndex: 0
          }}
        />
      )}

      <img
        src="/images/fbmun-logo.png"
        alt="FBMUN Official Logo"
        width={width}
        height={height}
        className={`relative z-10 w-full h-full object-contain rounded-full transition-transform duration-500 ${
          size === 'hero' ? 'animate-flame' : 'group-hover:scale-105'
        }`}
        style={{
          filter: glow
            ? size === 'hero'
              ? 'drop-shadow(0 0 30px rgba(200, 104, 104, 0.55)) drop-shadow(0 0 60px rgba(74, 14, 20, 0.8))'
              : 'drop-shadow(0 0 14px rgba(200, 104, 104, 0.45))'
            : 'none'
        }}
      />
    </div>
  );
};
