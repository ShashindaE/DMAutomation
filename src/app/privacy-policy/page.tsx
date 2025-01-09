import React from 'react';

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-background py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto prose prose-sm sm:prose lg:prose-lg prose-slate">
        <h1 className="text-4xl font-bold text-center mb-8">Privacy Policy</h1>
        <p className="text-muted-foreground">Last updated: January 7, 2025</p>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">1. Introduction</h2>
          <p>
            Welcome to Slide. We respect your privacy and are committed to protecting your personal data. This privacy policy explains how we collect, use, and safeguard your information when you use our service.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">2. Information We Collect</h2>
          <h3 className="text-xl font-medium mb-2">2.1 Personal Information</h3>
          <ul className="list-disc pl-6 mb-4">
            <li>Name and email address through Clerk authentication</li>
            <li>Instagram account information when you connect your account</li>
            <li>Payment information when you subscribe to our services</li>
          </ul>

          <h3 className="text-xl font-medium mb-2">2.2 Usage Data</h3>
          <ul className="list-disc pl-6">
            <li>Log data and device information</li>
            <li>Analytics data about how you use our service</li>
            <li>Instagram content and engagement metrics</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">3. How We Use Your Information</h2>
          <ul className="list-disc pl-6">
            <li>To provide and maintain our service</li>
            <li>To process your payments and subscriptions</li>
            <li>To communicate with you about service updates</li>
            <li>To improve our service based on your feedback</li>
            <li>To protect against fraud and abuse</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">4. Data Sharing and Third Parties</h2>
          <p>We share your data with:</p>
          <ul className="list-disc pl-6">
            <li>Clerk - for authentication services</li>
            <li>Instagram - when you connect your account</li>
            <li>Stripe - for payment processing</li>
            <li>Service providers who assist in operating our service</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">5. Data Security</h2>
          <p>
            We implement appropriate security measures to protect your personal information. However, no method of transmission over the internet is 100% secure, and we cannot guarantee absolute security.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">6. Your Rights</h2>
          <p>You have the right to:</p>
          <ul className="list-disc pl-6">
            <li>Access your personal data</li>
            <li>Correct inaccurate data</li>
            <li>Request deletion of your data</li>
            <li>Withdraw consent for data processing</li>
            <li>Export your data</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">7. Children's Privacy</h2>
          <p>
            Our service is not intended for children under 13. We do not knowingly collect personal information from children under 13.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">8. Changes to This Policy</h2>
          <p>
            We may update this privacy policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the "Last updated" date.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">9. Contact Us</h2>
          <p>
            If you have any questions about this privacy policy, please contact us at:
          </p>
          <ul className="list-none pl-6">
            <li>Email: privacy@slide.com</li>
            <li>Address: Your Company Address</li>
          </ul>
        </section>
      </div>
    </div>
  );
}
