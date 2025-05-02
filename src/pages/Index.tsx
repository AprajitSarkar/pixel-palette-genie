
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useUser } from '@/contexts/UserContext';

const Index = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  const [showAnimation, setShowAnimation] = useState(true);

  useEffect(() => {
    // Add animation delay
    const timer = setTimeout(() => {
      setShowAnimation(false);
    }, 800);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={`space-y-8 ${showAnimation ? "animate-fade-in" : ""}`}>
      <div className="relative overflow-hidden rounded-xl p-8 mb-8">
        {/* Background effect */}
        <div className="absolute -top-24 -left-24 w-64 h-64 bg-primary/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-accent/20 rounded-full blur-3xl"></div>
        
        <div className="relative z-10">
          <h1 className="text-4xl font-bold mb-4">Welcome to Pixel Palette</h1>
          <p className="text-lg text-muted-foreground mb-6">
            Create beautiful AI-generated images with our cute and powerful image generation tool
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <Button size="lg" onClick={() => navigate('/generate')} className="glow-effect">
              Start Creating
            </Button>
            {!user && (
              <Button size="lg" variant="outline" onClick={() => navigate('/login')}>
                Login to Save Images
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Features section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-secondary/50 p-6 rounded-lg">
          <div className="mb-4 rounded-full w-12 h-12 flex items-center justify-center bg-primary/20 text-primary">
            ✨
          </div>
          <h3 className="text-xl font-medium mb-2">Easy to Use</h3>
          <p className="text-muted-foreground">
            Simple interface that makes creating AI art a breeze
          </p>
        </div>
        
        <div className="bg-secondary/50 p-6 rounded-lg">
          <div className="mb-4 rounded-full w-12 h-12 flex items-center justify-center bg-primary/20 text-primary">
            🎨
          </div>
          <h3 className="text-xl font-medium mb-2">Various Styles</h3>
          <p className="text-muted-foreground">
            Create art in different styles with customizable parameters
          </p>
        </div>
        
        <div className="bg-secondary/50 p-6 rounded-lg">
          <div className="mb-4 rounded-full w-12 h-12 flex items-center justify-center bg-primary/20 text-primary">
            💾
          </div>
          <h3 className="text-xl font-medium mb-2">Save Your Creations</h3>
          <p className="text-muted-foreground">
            Login to save and access your creations anytime
          </p>
        </div>
      </div>

      {/* Getting started section */}
      <div className="mt-12">
        <h2 className="text-2xl font-semibold mb-4">Getting Started</h2>
        <div className="bg-secondary/30 rounded-lg p-6">
          <ol className="space-y-4 list-decimal list-inside">
            <li className="text-muted-foreground">
              <span className="text-foreground font-medium">Create your first image</span> - Try it without logging in
            </li>
            <li className="text-muted-foreground">
              <span className="text-foreground font-medium">Create an account</span> - Get 30 free credits
            </li>
            <li className="text-muted-foreground">
              <span className="text-foreground font-medium">Generate more images</span> - Each generation costs 10 credits
            </li>
            <li className="text-muted-foreground">
              <span className="text-foreground font-medium">Earn more credits</span> - Watch ads to earn free credits
            </li>
          </ol>
          
          <Button className="mt-6" onClick={() => navigate('/generate')}>
            Start Now
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;
