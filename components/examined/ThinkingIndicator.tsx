"use client";

/**
 * ThinkingIndicator - A philosophically-inspired loading animation
 * Features a radial starburst pattern with fine lines emanating from center,
 * inspired by vintage sun illustrations and geometric engravings.
 * Conveys deep inquiry and contemplation.
 */
export function ThinkingIndicator() {
  // Generate rays at varying angles for organic starburst effect
  const rays = Array.from({ length: 24 }, (_, i) => {
    const angle = (i * 15) * (Math.PI / 180);
    const isLong = i % 3 === 0;
    const length = isLong ? 18 : 12;
    const innerRadius = 6;
    
    return {
      x1: Math.cos(angle) * innerRadius,
      y1: Math.sin(angle) * innerRadius,
      x2: Math.cos(angle) * (innerRadius + length),
      y2: Math.sin(angle) * (innerRadius + length),
      delay: i * 0.08,
      isLong,
    };
  });

  return (
    <div className="flex items-center gap-4 py-1">
      {/* Starburst Animation Container */}
      <div className="relative w-12 h-12 flex items-center justify-center">
        <svg 
          viewBox="-30 -30 60 60" 
          className="w-full h-full animate-[gentleSpin_20s_linear_infinite]"
        >
          {/* Outer circle - dashed for contemplative feel */}
          <circle 
            cx="0" 
            cy="0" 
            r="26" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="0.5"
            strokeDasharray="2 4"
            className="text-primary/20"
          />
          
          {/* Radiating rays */}
          {rays.map((ray, i) => (
            <line
              key={i}
              x1={ray.x1}
              y1={ray.y1}
              x2={ray.x2}
              y2={ray.y2}
              stroke="currentColor"
              strokeWidth={ray.isLong ? "0.75" : "0.5"}
              strokeLinecap="round"
              className="text-primary/50 animate-[rayPulse_3s_ease-in-out_infinite]"
              style={{ animationDelay: `${ray.delay}s` }}
            />
          ))}
          
          {/* Inner circle - solid center */}
          <circle 
            cx="0" 
            cy="0" 
            r="4" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="0.75"
            className="text-primary/60"
          />
          
          {/* Center dot */}
          <circle 
            cx="0" 
            cy="0" 
            r="1.5" 
            fill="currentColor" 
            className="text-primary/70 animate-[breathe_4s_ease-in-out_infinite]"
          />
        </svg>
      </div>
      
      {/* Contemplative text */}
      <span className="text-sm text-muted-foreground italic font-serif tracking-wide">
        Reflecting...
      </span>
    </div>
  );
}

/**
 * Alternative minimal thinking indicator with elegant dots
 * Use when a smaller, more subtle indicator is needed
 */
export function ThinkingDots() {
  return (
    <div className="flex items-center gap-2 py-2">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="w-1 h-1 rounded-full bg-primary/40 animate-[thoughtPulse_2s_ease-in-out_infinite]"
          style={{ animationDelay: `${i * 0.4}s` }}
        />
      ))}
    </div>
  );
}
