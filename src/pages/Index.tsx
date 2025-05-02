
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useUser } from '@/contexts/UserContext';
import { Helmet } from 'react-helmet-async';
import { Volume2, Image, CreditCard } from 'lucide-react';

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
      <Helmet>
        <title>Pixel Palette - Free AI Image & Voice Generator</title>
        <meta name="description" content="Create beautiful AI-generated images and audio with our free AI tools. No limits, no restrictions." />
        <meta name="keywords" content="ai image generator, free text to speech, ai art, free tts, unlimited ai generation" />
      </Helmet>
      
      <div className="relative overflow-hidden rounded-xl p-8 mb-8">
        {/* Background effect */}
        <div className="absolute -top-24 -left-24 w-64 h-64 bg-primary/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-accent/20 rounded-full blur-3xl"></div>
        
        <div className="relative z-10">
          <h1 className="text-4xl font-bold mb-4">Welcome to Pixel Palette</h1>
          <p className="text-lg text-muted-foreground mb-6">
            Create beautiful AI-generated images and audio with our cute and powerful AI tools
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

      {/* TTS Feature Highlight */}
      <div className="bg-secondary/30 p-8 rounded-lg mb-8 relative overflow-hidden">
        <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-blue-500/10 rounded-full blur-2xl"></div>
        
        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="flex-1">
            <h2 className="text-3xl font-bold mb-4 flex items-center gap-2">
              <Volume2 className="text-primary" />
              Text to Speech
            </h2>
            <p className="text-muted-foreground mb-4">
              Convert any text to natural-sounding speech with our TTS tool. Multiple voices and languages available completely for free.
            </p>
            <Button onClick={() => navigate('/text-to-speech')} className="glow-effect">
              Try Text to Speech
            </Button>
          </div>
          <div className="flex-1 flex justify-center">
            <div className="p-4 bg-background/50 rounded-lg border border-border w-full max-w-xs">
              <div className="h-24 rounded-md bg-background flex items-center justify-center text-muted-foreground">
                <Volume2 size={48} className="text-primary" />
              </div>
              <div className="mt-4 h-4 w-3/4 bg-muted rounded-full"></div>
              <div className="mt-2 h-4 w-1/2 bg-muted rounded-full"></div>
            </div>
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
            🔊
          </div>
          <h3 className="text-xl font-medium mb-2">Text to Speech</h3>
          <p className="text-muted-foreground">
            Convert text to natural-sounding speech with our TTS tool
          </p>
          <Button 
            variant="link" 
            onClick={() => navigate('/text-to-speech')} 
            className="mt-2 px-0"
          >
            Try it now →
          </Button>
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
              <span className="text-foreground font-medium">Try our text-to-speech</span> - Convert text to natural speech
            </li>
            <li className="text-muted-foreground">
              <span className="text-foreground font-medium">Create an account</span> - Get 30 free credits
            </li>
            <li className="text-muted-foreground">
              <span className="text-foreground font-medium">Generate more content</span> - Each generation costs 10 credits
            </li>
            <li className="text-muted-foreground">
              <span className="text-foreground font-medium">Earn more credits</span> - Watch ads to earn free credits
            </li>
          </ol>
          
          <div className="flex flex-wrap gap-3 mt-6">
            <Button onClick={() => navigate('/generate')}>
              Generate Images
            </Button>
            <Button 
              variant="outline" 
              onClick={() => navigate('/text-to-speech')}
            >
              Try Text to Speech
            </Button>
          </div>
        </div>
      </div>

      {/* Ad disclosure section */}
      <div className="mt-6 text-center text-sm text-muted-foreground">
        <p>Pixel Palette shows ads to help keep our services free.</p>
        <p className="mt-1">
          <a href="/privacy-policy" className="text-primary hover:underline">
            View our Privacy Policy
          </a>
        </p>
      </div>
    </div>
  );
};

export default Index;
