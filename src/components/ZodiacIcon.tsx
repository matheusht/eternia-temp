import React from 'react';

interface ZodiacIconProps {
  sign: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const zodiacSymbols: Record<string, string> = {
  "Aries": "♈",
  "Taurus": "♉", 
  "Gemini": "♊",
  "Cancer": "♋",
  "Leo": "♌",
  "Virgo": "♍",
  "Libra": "♎",
  "Scorpio": "♏",
  "Sagittarius": "♐",
  "Capricorn": "♑",
  "Aquarius": "♒",
  "Pisces": "♓"
};

const zodiacColors: Record<string, string> = {
  "Aries": "text-red-400",
  "Taurus": "text-green-400",
  "Gemini": "text-yellow-400",
  "Cancer": "text-blue-300",
  "Leo": "text-orange-400",
  "Virgo": "text-emerald-400",
  "Libra": "text-pink-400",
  "Scorpio": "text-red-600",
  "Sagittarius": "text-purple-400",
  "Capricorn": "text-gray-400",
  "Aquarius": "text-cyan-400",
  "Pisces": "text-indigo-400"
};

const sizeClasses = {
  sm: "text-lg",
  md: "text-2xl",
  lg: "text-4xl",
  xl: "text-6xl"
};

export const ZodiacIcon = ({ sign, size = 'md', className = '' }: ZodiacIconProps) => {
  const symbol = zodiacSymbols[sign] || "⭐";
  const color = zodiacColors[sign] || "text-primary";
  const sizeClass = sizeClasses[size];

  return (
    <span 
      className={`${sizeClass} ${color} font-bold drop-shadow-lg transition-all duration-300 hover:scale-110 ${className}`}
      style={{ textShadow: '0 0 20px currentColor' }}
    >
      {symbol}
    </span>
  );
};