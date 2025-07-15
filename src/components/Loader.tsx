import React from 'react';

interface LoaderProps {
  text?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export default function Loader({ 
  text = "Carregando...", 
  size = 'md', 
  className = '' 
}: LoaderProps) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8'
  };

  const containerSizeClasses = {
    sm: 'h-32',
    md: 'h-48',
    lg: 'h-64'
  };

  return (
    <div className={`flex ${containerSizeClasses[size]} items-center justify-center ${className}`}>
      <div className="flex flex-col items-center gap-3">
        <div className={`${sizeClasses[size]} animate-spin rounded-full border-2 border-white/30 border-t-white/70`}></div>
        <div className="text-white/70 text-sm">{text}</div>
      </div>
    </div>
  );
}