import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useUser } from '@/contexts/UserContext';
import { useNavigate, Link } from 'react-router-dom';
import { doc, updateDoc } from 'firebase/firestore';
import { updatePassword, sendPasswordResetEmail, EmailAuthProvider, reauthenticateWithCredential, deleteUser } from 'firebase/auth';
import { db, auth } from '@/lib/firebase';
import { toast } from 'sonner';
import { useIsMobile } from '@/hooks/use-mobile';
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const Settings = () => {
  const { user, userData, signOut } = useUser();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  
  const [username, setUsername] = useState<string>(userData?.username || '');
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [currentPassword, setCurrentPassword] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [confirmNewPassword, setConfirmNewPassword] = useState<string>('');
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);

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

  const handleChangePassword = async () => {
    if (!user || !currentPassword || !newPassword || !confirmNewPassword) {
      toast.error('Please fill out all password fields');
      return;
    }

    if (newPassword !== confirmNewPassword) {
      toast.error('New passwords do not match');
      return;
    }

    if (newPassword.length < 6) {
      toast.error('Password should be at least 6 characters');
      return;
    }

    try {
      setIsUpdating(true);
      
      // Re-authenticate user
      const credential = EmailAuthProvider.credential(user.email!, currentPassword);
      await reauthenticateWithCredential(user, credential);
      
      // Change password
      await updatePassword(user, newPassword);
      
      toast.success('Password updated successfully');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
      setDialogOpen(false);
    } catch (error: any) {
      console.error('Error changing password:', error);
      if (error.code === 'auth/wrong-password') {
        toast.error('Current password is incorrect');
      } else {
        toast.error('Failed to update password');
      }
    } finally {
      setIsUpdating(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!user || !user.email) {
      toast.error('No email associated with this account');
      return;
    }

    try {
      await sendPasswordResetEmail(auth, user.email);
      toast.success('Password reset email sent. Check your inbox.');
    } catch (error) {
      console.error('Error sending reset email:', error);
      toast.error('Failed to send password reset email');
    }
  };

  const handleDeleteAccount = async () => {
    // This would typically include additional logic for deleting user data
    try {
      if (!user) return;
      
      // Delete user data from Firestore
      const userDocRef = doc(db, "users", user.uid);
      await updateDoc(userDocRef, { deleted: true });
      
      // Delete user authentication
      await deleteUser(user);
      
      toast.success('Account deleted successfully');
      navigate('/');
    } catch (error) {
      console.error('Error deleting account:', error);
      toast.error('Failed to delete account. Try signing in again before deleting.');
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
    <div className="space-y-8 animate-fade-in px-4 md:px-0">
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
              <div className="flex flex-col sm:flex-row gap-2">
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
          <h3 className="text-xl font-medium mb-4 text-accent">Account Security</h3>
          
          <div className="space-y-4">
            {/* Change Password Button */}
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="w-full sm:w-auto">
                  Change Password
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Change Password</DialogTitle>
                  <DialogDescription>
                    Enter your current password and a new password below.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <label htmlFor="current-password" className="text-sm font-medium">
                      Current Password
                    </label>
                    <Input
                      id="current-password"
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="new-password" className="text-sm font-medium">
                      New Password
                    </label>
                    <Input
                      id="new-password"
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="confirm-password" className="text-sm font-medium">
                      Confirm New Password
                    </label>
                    <Input
                      id="confirm-password"
                      type="password"
                      value={confirmNewPassword}
                      onChange={(e) => setConfirmNewPassword(e.target.value)}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
                  <Button onClick={handleChangePassword} disabled={isUpdating}>
                    {isUpdating ? 'Updating...' : 'Save Changes'}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            {/* Forgot Password Button */}
            <Button 
              variant="outline" 
              className="w-full sm:w-auto mt-4" 
              onClick={handleForgotPassword}
            >
              Reset Password via Email
            </Button>
            
            {/* Privacy Policy Link */}
            <div className="mt-4 pt-4 border-t border-border">
              <Link to="/privacy-policy" className="text-primary hover:underline">
                View Privacy Policy
              </Link>
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
