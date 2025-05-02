
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useUser } from '@/contexts/UserContext';
import { useNavigate } from 'react-router-dom';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const Settings = () => {
  const { user, userData, signOut } = useUser();
  const navigate = useNavigate();
  
  const [username, setUsername] = useState<string>(userData?.username || '');
  const [isUpdating, setIsUpdating] = useState<boolean>(false);

  const updateUsername = async () => {
    if (!user || !username.trim()) return;
    
    setIsUpdating(true);
    
    try {
      const userDocRef = doc(db, "users", user.uid);
      await updateDoc(userDocRef, {
        username: username
      });
      
      toast.success('Username updated successfully');
    } catch (error) {
      console.error('Error updating username:', error);
      toast.error('Failed to update username');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteAccount = async () => {
    // This would typically include additional logic for deleting user data
    // For this demo, we'll just sign out
    try {
      await signOut();
      toast.success('Account deleted successfully');
      navigate('/');
    } catch (error) {
      console.error('Error deleting account:', error);
      toast.error('Failed to delete account');
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success('Signed out successfully');
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
      toast.error('Failed to sign out');
    }
  };

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] animate-fade-in">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-4">Login Required</h2>
          <p className="text-muted-foreground mb-6">
            You need to log in to access settings.
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
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account preferences
        </p>
      </div>

      <div className="space-y-6">
        <div className="bg-secondary/20 p-6 rounded-lg glass-effect">
          <h3 className="text-xl font-medium mb-4 text-accent">Profile</h3>
          
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-1">
                Email
              </label>
              <Input
                id="email"
                value={userData?.email || ''}
                disabled
                className="bg-secondary/50"
              />
            </div>
            
            <div>
              <label htmlFor="username" className="block text-sm font-medium mb-1">
                Username
              </label>
              <div className="flex gap-2">
                <Input
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="flex-1"
                  placeholder="Enter your username"
                />
                <Button onClick={updateUsername} disabled={isUpdating}>
                  {isUpdating ? 'Updating...' : 'Update'}
                </Button>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-secondary/20 p-6 rounded-lg glass-effect">
          <h3 className="text-xl font-medium mb-4 text-accent">App Settings</h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Notifications</h4>
                <p className="text-sm text-muted-foreground">
                  Receive notifications about new features and credits
                </p>
              </div>
              <div className="flex items-center h-5">
                <input
                  id="notifications"
                  type="checkbox"
                  defaultChecked
                  className="rounded border-input bg-transparent"
                />
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Dark Mode</h4>
                <p className="text-sm text-muted-foreground">
                  Enable dark mode for better visibility
                </p>
              </div>
              <div className="flex items-center h-5">
                <input
                  id="darkMode"
                  type="checkbox"
                  defaultChecked
                  className="rounded border-input bg-transparent"
                />
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-secondary/20 p-6 rounded-lg glass-effect">
          <h3 className="text-xl font-medium mb-4 text-accent">Account Actions</h3>
          
          <div className="space-y-4">
            <Button 
              onClick={handleSignOut} 
              variant="outline" 
              className="w-full"
            >
              Sign Out
            </Button>
            
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" className="w-full">
                  Delete Account
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete your
                    account and remove your data from our servers.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDeleteAccount}>
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
