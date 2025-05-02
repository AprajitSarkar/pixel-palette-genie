
import React from "react";
import { Helmet } from "react-helmet-async";

const PrivacyPolicy: React.FC = () => {
  return (
    <div className="container max-w-4xl mx-auto py-8 px-4">
      <Helmet>
        <title>Privacy Policy - Pixel Palette</title>
        <meta name="description" content="Our privacy policy explains how we collect, use, and protect your personal data." />
      </Helmet>

      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Privacy Policy</h1>
        <p className="text-muted-foreground">
          Last updated: May 2, 2025
        </p>
      </div>

      <div className="space-y-6 text-muted-foreground">
        <section>
          <h2 className="text-2xl font-semibold text-foreground mb-3">Introduction</h2>
          <p>
            Pixel Palette ("we", "our", or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our mobile application and website.
          </p>
          <p className="mt-2">
            Please read this Privacy Policy carefully. By using Pixel Palette, you agree to the collection and use of information in accordance with this policy.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-foreground mb-3">Information We Collect</h2>
          <p>We may collect several types of information from and about users of our app, including:</p>
          <ul className="list-disc pl-6 mt-2 space-y-1">
            <li>Personal information (such as email address, username)</li>
            <li>Usage data and analytics</li>
            <li>Device information</li>
            <li>Generated content and user preferences</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-foreground mb-3">How We Use Your Information</h2>
          <p>We may use the information we collect from you for various purposes, including to:</p>
          <ul className="list-disc pl-6 mt-2 space-y-1">
            <li>Provide and maintain our services</li>
            <li>Personalize your experience</li>
            <li>Improve our app</li>
            <li>Process transactions and manage your account</li>
            <li>Send periodic emails and notifications</li>
            <li>Respond to your inquiries and customer service requests</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-foreground mb-3">User Data Deletion</h2>
          <p>
            You have the right to request deletion of your personal data. You can delete your account 
            through the Settings page. When you delete your account, all personal data will be removed 
            from our systems within 30 days.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-foreground mb-3">Advertising</h2>
          <p>
            We use Google AdMob and AdSense to serve advertisements in our app and on our website. These services may use cookies, 
            web beacons, and other tracking technologies to collect information about your usage.
          </p>
          <p className="mt-2">
            Google's use of advertising cookies enables it and its partners to serve ads based on your visit to our app and/or other sites on the Internet. 
            You can opt out of personalized advertising by visiting <a href="https://www.google.com/settings/ads" className="text-primary underline" target="_blank" rel="noopener noreferrer">Google Ads Settings</a>.
          </p>
          <p className="mt-2">
            The app complies with the Google Play Developer Distribution Agreement and Apple App Store Review Guidelines.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-foreground mb-3">Third-Party Ad Services</h2>
          <p>
            We may use third-party Service Providers to show advertisements to you to help support and maintain our Service.
          </p>
          <p className="mt-2">
            <strong>AdMob by Google:</strong> Google, as a third-party vendor, uses cookies to serve ads on our Service. Google's use of the advertising cookie enables it and its partners to serve ads to our users based on previous visits to our Service or other websites.
          </p>
          <p className="mt-2">
            You may opt out of personalized advertising by visiting the Google Ads Settings page.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-foreground mb-3">Children's Privacy</h2>
          <p>
            Our Service does not address anyone under the age of 13. We do not knowingly collect personally identifiable information from children under 13.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-foreground mb-3">Contact Us</h2>
          <p>
            If you have any questions about this Privacy Policy, please contact us:
          </p>
          <p className="mt-2">
            Email: <a href="mailto:deepfreeai@gmail.com" className="text-primary underline">deepfreeai@gmail.com</a>
          </p>
          <p className="mt-1">
            Website: <a href="https://DeepSeekfree.fun" className="text-primary underline" target="_blank" rel="noopener noreferrer">DeepSeekfree.fun</a>
          </p>
        </section>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
