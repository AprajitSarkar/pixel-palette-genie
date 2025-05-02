
import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const NotFound = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center animate-fade-in">
      <div className="text-center space-y-6">
        <div className="relative">
          <div className="text-9xl font-bold opacity-10">404</div>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-6xl">🧩</span>
          </div>
        </div>
        
        <h1 className="text-4xl font-bold">Page Not Found</h1>
        
        <p className="text-muted-foreground max-w-md mx-auto">
          Sorry, we couldn't find the page you're looking for. The page might have been moved or doesn't exist.
        </p>
        
        <Button onClick={() => navigate('/')} size="lg">
          Go Back Home
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
