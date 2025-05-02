
import React from 'react';
import { Button } from '@/components/ui/button';
import { useUser } from '@/contexts/UserContext';
import { useAd } from '@/contexts/AdContext';
import { useNavigate } from 'react-router-dom';

const Credits = () => {
  const { user, userData } = useUser();
  const { showRewardedAd, showInterstitialAd } = useAd();
  const navigate = useNavigate();

  const handleWatchRewardedAd = async () => {
    await showRewardedAd();
  };

  const handleWatchInterstitialAd = async () => {
    await showInterstitialAd();
  };

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] animate-fade-in">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-4">Login Required</h2>
          <p className="text-muted-foreground mb-6">
            You need to log in to access the credits page and earn credits.
          </p>
          <Button onClick={() => navigate('/login')} className="glow-effect">
            Login Now
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-bold">Credits</h1>
        <p className="text-muted-foreground">
          Earn credits to generate more images
        </p>
      </div>

      <div className="bg-secondary/20 p-6 rounded-lg glass-effect">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <p className="text-muted-foreground">Current Balance</p>
            <h2 className="text-4xl font-bold text-primary">{userData?.credits} credits</h2>
          </div>
          <div className="flex flex-col gap-2">
            <Button 
              onClick={() => navigate('/generate')} 
              variant="outline"
              className="w-full"
            >
              Generate Images
            </Button>
            <p className="text-xs text-muted-foreground text-center">
              Cost: 10 credits per image
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Earn More Credits</h2>
        
        <div className="bg-secondary/20 p-6 rounded-lg glass-effect">
          <h3 className="text-xl font-medium mb-4 text-accent">Rewarded Videos</h3>
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
            <div>
              <p className="mb-2">Watch a complete video ad to earn credits</p>
              <ul className="list-disc list-inside text-sm text-muted-foreground">
                <li>Earn 20 credits per video</li>
                <li>Limit: 3 videos per day</li>
                <li>
                  Videos watched today: {userData?.adsWatched?.rewarded || 0}/3
                </li>
              </ul>
            </div>
            <Button
              disabled={!(userData?.adsWatched?.rewarded < 3)}
              onClick={handleWatchRewardedAd}
              className="min-w-[120px]"
            >
              Watch Video
            </Button>
          </div>
        </div>
        
        <div className="bg-secondary/20 p-6 rounded-lg glass-effect">
          <h3 className="text-xl font-medium mb-4 text-accent">Interstitial Ads</h3>
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
            <div>
              <p className="mb-2">View a quick interstitial ad</p>
              <ul className="list-disc list-inside text-sm text-muted-foreground">
                <li>Earn 10 credits per ad</li>
                <li>Limit: 5 ads per day</li>
                <li>
                  Ads viewed today: {userData?.adsWatched?.interstitial || 0}/5
                </li>
              </ul>
            </div>
            <Button 
              disabled={!(userData?.adsWatched?.interstitial < 5)}
              onClick={handleWatchInterstitialAd}
              variant="outline"
              className="min-w-[120px]"
            >
              View Ad
            </Button>
          </div>
        </div>
        
        <div className="bg-secondary/20 p-6 rounded-lg glass-effect">
          <h3 className="text-xl font-medium mb-4 text-accent">Daily Login</h3>
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
            <div>
              <p className="mb-2">Login daily to earn bonus credits</p>
              <ul className="list-disc list-inside text-sm text-muted-foreground">
                <li>Earn 5 credits per daily login</li>
                <li>Login streaks give bonus credits</li>
              </ul>
            </div>
            <Button variant="secondary" disabled className="min-w-[120px]">
              Claimed Today
            </Button>
          </div>
        </div>
      </div>
      
      <div className="bg-secondary/10 p-4 rounded-lg text-center">
        <p className="text-sm text-muted-foreground">
          Credits reset at midnight. Make sure to use your daily ad views!
        </p>
      </div>
    </div>
  );
};

export default Credits;
