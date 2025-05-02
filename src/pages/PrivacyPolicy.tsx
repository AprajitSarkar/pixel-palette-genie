
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const PrivacyPolicy = () => {
  return (
    <div className="container mx-auto py-8 animate-fade-in">
      <div className="bg-secondary/20 p-6 rounded-lg glass-effect">
        <h1 className="text-3xl font-bold mb-6 text-gradient">Privacy Policy</h1>
        
        <div className="space-y-6 text-muted-foreground">
          <section>
            <h2 className="text-xl font-semibold mb-3 text-foreground">Introduction</h2>
            <p>Welcome to Pixel Palette. We respect your privacy and are committed to protecting your personal data.</p>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold mb-3 text-foreground">Information We Collect</h2>
            <p>We collect information you provide directly to us when you:</p>
            <ul className="list-disc pl-6 mt-2">
              <li>Create an account</li>
              <li>Use our image generation services</li>
              <li>Contact our support team</li>
            </ul>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold mb-3 text-foreground">How We Use Your Information</h2>
            <p>We use your information to:</p>
            <ul className="list-disc pl-6 mt-2">
              <li>Provide and maintain our services</li>
              <li>Process and fulfill your image generation requests</li>
              <li>Send you service-related notifications</li>
              <li>Improve and personalize your experience</li>
            </ul>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold mb-3 text-foreground">Data Security</h2>
            <p>We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.</p>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold mb-3 text-foreground">Third-Party Services</h2>
            <p>We use Firebase for authentication and data storage. We also integrate AdMob for advertising services. These services have their own privacy policies.</p>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold mb-3 text-foreground">Your Rights</h2>
            <p>You have the right to access, update, or delete your personal information. You can do this through your account settings or by contacting us directly.</p>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold mb-3 text-foreground">Contact Us</h2>
            <p>If you have any questions about this Privacy Policy, please contact us at:</p>
            <p className="mt-2">
              <a href="mailto:deepfreeai@gmail.com" className="text-primary hover:underline">deepfreeai@gmail.com</a><br />
              Website: <a href="https://DeepSeekfree.fun" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">DeepSeekfree.fun</a>
            </p>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold mb-3 text-foreground">Changes to This Policy</h2>
            <p>We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page.</p>
            <p className="mt-2">Last updated: {new Date().toLocaleDateString()}</p>
          </section>
        </div>
        
        <div className="mt-8">
          <Button asChild>
            <Link to="/">Back to Home</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
