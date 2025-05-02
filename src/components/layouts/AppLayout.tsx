
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, CreditCard, Settings, Image, User, Volume2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useUser } from '@/contexts/UserContext';
import { Skeleton } from '@/components/ui/skeleton';
import { useIsMobile } from '@/hooks/use-mobile';

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const location = useLocation();
  const { userData, loading } = useUser();
  const isMobile = useIsMobile();
  
  const navItems = [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/generate', icon: Image, label: 'Generate' },
    { path: '/text-to-speech', icon: Volume2, label: 'TTS' },
    { path: '/credits', icon: CreditCard, label: 'Credits' },
    { path: '/settings', icon: Settings, label: 'Settings' }
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="p-4 border-b border-border flex items-center justify-between sticky top-0 z-10 bg-background/80 backdrop-blur-lg">
        <div className="flex items-center">
          <h1 className="text-2xl font-bold text-gradient">Pixel Palette</h1>
        </div>
        <div className="flex items-center gap-2">
          {loading ? (
            <div className="flex items-center gap-2">
              <Skeleton className="w-8 h-8 rounded-full" />
              <Skeleton className="w-20 h-5" />
            </div>
          ) : userData ? (
            <div className="flex items-center gap-2">
              <div className={`flex flex-col items-end ${isMobile ? 'hidden sm:flex' : ''}`}>
                <span className="text-sm text-muted-foreground">{userData.username}</span>
                <span className="text-xs font-medium flex gap-1 items-center">
                  <span className="text-primary">✨</span>
                  {userData.credits} credits
                </span>
              </div>
              <Button variant="ghost" size="icon" className="rounded-full" asChild>
                <Link to="/settings">
                  <User size={20} />
                  <span className="sr-only">User settings</span>
                </Link>
              </Button>
            </div>
          ) : (
            <Button size="sm" variant="outline" asChild>
              <Link to="/login">Log In</Link>
            </Button>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container px-4 py-6 max-w-5xl">
        {children}
      </main>

      {/* Bottom Navigation */}
      <div className="border-t border-border sticky bottom-0 bg-background/80 backdrop-blur-lg z-10">
        <nav className="flex items-center justify-around p-2">
          {navItems.map((item) => (
            <Link 
              key={item.path} 
              to={item.path}
              className={`flex flex-col items-center py-2 px-4 rounded-md transition-all ${
                location.pathname === item.path 
                  ? "text-primary" 
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <item.icon size={24} className={location.pathname === item.path ? "animate-scale-in" : ""} />
              <span className="text-xs mt-1">{item.label}</span>
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default AppLayout;
