
import React, { useState, useEffect } from 'react';

interface SplashScreenProps {
  onComplete: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 3000);

    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 5;
      });
    }, 150);

    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, [onComplete]);

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-background z-50">
      <div className="w-32 h-32 mb-8 relative animate-float">
        <div className="absolute inset-0 rounded-full bg-primary/20 animate-pulse"></div>
        <div className="absolute inset-1 rounded-full bg-primary/30 animate-pulse animation-delay-100"></div>
        <div className="absolute inset-2 rounded-full bg-primary/40 animate-pulse animation-delay-200"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-6xl">🎨</span>
        </div>
      </div>
      
      <h1 className="text-4xl font-bold mb-2 text-gradient">Pixel Palette</h1>
      <p className="text-muted-foreground mb-8">AI Image Generator</p>
      
      <div className="w-64 h-2 bg-secondary rounded-full overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-300" 
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      <p className="mt-2 text-muted-foreground text-sm">Loading... {progress}%</p>
    </div>
  );
};

export default SplashScreen;
