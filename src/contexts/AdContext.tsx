
import React, { createContext, useContext, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { useUser } from './UserContext';

// Check if running in Capacitor (mobile)
const isCapacitor = window.location.protocol === 'capacitor:';

// Mock AdMob for web development
// In a real app, you would use the appropriate AdMob library
interface AdMob {
  loadBanner: () => void;
  showBanner: () => void;
  hideBanner: () => void;
  loadInterstitial: () => Promise<boolean>;
  showInterstitial: () => Promise<boolean>;
  loadRewarded: () => Promise<boolean>;
  showRewarded: () => Promise<boolean>;
}

interface AdContextType {
  showInterstitialAd: () => Promise<boolean>;
  showRewardedAd: () => Promise<boolean>;
  isAdLoaded: boolean;
}

// Create a mock AdMob implementation
const mockAdMob: AdMob = {
  loadBanner: () => {
    console.log('Loading banner ad');
  },
  showBanner: () => {
    console.log('Showing banner ad');
  },
  hideBanner: () => {
    console.log('Hiding banner ad');
  },
  loadInterstitial: async () => {
    console.log('Loading interstitial ad');
    // Simulate loading time
    await new Promise(resolve => setTimeout(resolve, 1000));
    return true;
  },
  showInterstitial: async () => {
    console.log('Showing interstitial ad');
    // Simulate ad showing
    await new Promise(resolve => setTimeout(resolve, 2000));
    return true;
  },
  loadRewarded: async () => {
    console.log('Loading rewarded ad');
    // Simulate loading time
    await new Promise(resolve => setTimeout(resolve, 1000));
    return true;
  },
  showRewarded: async () => {
    console.log('Showing rewarded ad');
    // Simulate ad showing
    await new Promise(resolve => setTimeout(resolve, 3000));
    return true;
  }
};

const AdContext = createContext<AdContextType | undefined>(undefined);

export const AdProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { updateUserCredits, incrementAdCount, canWatchAd } = useUser();
  const [isAdLoaded, setIsAdLoaded] = useState(false);
  const [adsenseInitialized, setAdsenseInitialized] = useState(false);
  
  // AdMob configuration
  const adMobConfig = {
    banner: 'ca-app-pub-3279473081670891/1003101920',
    interstitial: 'ca-app-pub-3279473081670891/4073916578',
    rewarded: 'ca-app-pub-3279473081670891/2760834909',
    appId: 'ca-app-pub-3279473081670891~9908825517'
  };

  // Initialize AdSense for web
  useEffect(() => {
    if (!isCapacitor && !adsenseInitialized) {
      // Add Google AdSense script
      const script = document.createElement('script');
      script.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3279473081670891';
      script.async = true;
      script.crossOrigin = 'anonymous';
      document.head.appendChild(script);
      
      script.onload = () => {
        console.log('AdSense loaded successfully');
        setAdsenseInitialized(true);
      };
      
      script.onerror = () => {
        console.error('Failed to load AdSense');
      };
      
      return () => {
        // Clean up if component unmounts
        if (document.head.contains(script)) {
          document.head.removeChild(script);
        }
      };
    }
  }, [adsenseInitialized]);

  useEffect(() => {
    // Initialize AdMob for Capacitor apps
    if (isCapacitor) {
      console.log('Initializing AdMob with app ID:', adMobConfig.appId);
      
      const initAds = async () => {
        // Simulate loading interstitial and rewarded ads
        await mockAdMob.loadInterstitial();
        await mockAdMob.loadRewarded();
        setIsAdLoaded(true);
      };
      
      initAds();
      
      // Show banner ad
      mockAdMob.loadBanner();
      mockAdMob.showBanner();
      
      return () => {
        // Clean up
        mockAdMob.hideBanner();
      };
    }
  }, []);

  const showInterstitialAd = async (): Promise<boolean> => {
    if (!canWatchAd('interstitial')) {
      toast.error('You have reached the maximum number of interstitial ads for today');
      return false;
    }
    
    try {
      // Load interstitial ad if not loaded
      if (!isAdLoaded) {
        await mockAdMob.loadInterstitial();
      }
      
      // Show interstitial ad
      const result = await mockAdMob.showInterstitial();
      
      if (result) {
        // Increment ad count
        const success = await incrementAdCount('interstitial');
        
        if (success) {
          // Add credits to user
          await updateUserCredits(10);
          
          // Load new ad
          mockAdMob.loadInterstitial();
          return true;
        }
      }
      
      return false;
    } catch (error) {
      console.error('Failed to show interstitial ad:', error);
      toast.error('Failed to show ad');
      return false;
    }
  };

  const showRewardedAd = async (): Promise<boolean> => {
    if (!canWatchAd('rewarded')) {
      toast.error('You have reached the maximum number of rewarded ads for today');
      return false;
    }
    
    try {
      // Load rewarded ad if not loaded
      if (!isAdLoaded) {
        await mockAdMob.loadRewarded();
      }
      
      // Show rewarded ad
      const result = await mockAdMob.showRewarded();
      
      if (result) {
        // Increment ad count
        const success = await incrementAdCount('rewarded');
        
        if (success) {
          // Add credits to user
          await updateUserCredits(20);
          
          // Load new ad
          mockAdMob.loadRewarded();
          return true;
        }
      }
      
      return false;
    } catch (error) {
      console.error('Failed to show rewarded ad:', error);
      toast.error('Failed to show ad');
      return false;
    }
  };

  return (
    <AdContext.Provider value={{ showInterstitialAd, showRewardedAd, isAdLoaded }}>
      {children}
      
      {!isCapacitor && (
        <div className="adsense-container">
          <ins 
            className="adsbygoogle"
            style={{ display: 'block' }}
            data-ad-client="ca-pub-3279473081670891"
            data-ad-slot="1003101920"
            data-ad-format="auto"
            data-full-width-responsive="true"
          ></ins>
        </div>
      )}
    </AdContext.Provider>
  );
};

export const useAd = (): AdContextType => {
  const context = useContext(AdContext);
  if (context === undefined) {
    throw new Error('useAd must be used within an AdProvider');
  }
  return context;
};
