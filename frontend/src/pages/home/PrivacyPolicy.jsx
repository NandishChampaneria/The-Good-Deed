import React from 'react';

const PrivacyPolicy = () => {
  return (
    <div className="container mx-auto px-6 py-12 text-black">
      <h1 className="text-3xl text-white font-semibold mb-8">Privacy Policy</h1>
      
      <p className="mb-6"><strong>Last Updated: 27 Feb 2025</strong></p>

      <h2 className="text-xl font-semibold mb-4">1. Introduction</h2>
      <p className="mb-6">
        Welcome to <span className='font-semibold bg-gradient-to-r from-blue-700 to-purple-600 text-transparent bg-clip-text'>The Good Deed</span> ("we", "our", or "us"). We respect your privacy and are committed to protecting your personal data. This Privacy Policy explains how we collect, use, and disclose information when you use our services.
      </p>

      <h2 className="text-xl font-semibold mb-4">2. Information We Collect</h2>
      <p className="mb-6">
        We collect the following types of information:
      </p>
      <ul className="list-disc pl-6 mb-6">
        <li><strong>Personal Information:</strong> When you sign up, we collect details such as your name, email address, phone number, and other necessary contact information.</li>
        <li><strong>Usage Data:</strong> We collect data on how you interact with our services, including IP addresses, device information, browsing data, and location information.</li>
        <li><strong>Cookies:</strong> We use cookies to track and improve user experience. You can control the use of cookies through your browser settings.</li>
      </ul>

      <h2 className="text-xl font-semibold mb-4">3. How We Use Your Information</h2>
      <p className="mb-6">
        We use the information we collect for the following purposes:
      </p>
      <ul className="list-disc pl-6 mb-6">
        <li>To provide, maintain, and improve our services.</li>
        <li>To personalize user experience and recommend relevant events or organizations.</li>
        <li>To communicate with you, including sending updates or notifications related to your use of our services.</li>
        <li>To monitor usage and analyze data to improve our platform.</li>
        <li>To comply with legal obligations.</li>
      </ul>

      <h2 className="text-xl font-semibold mb-4">4. How We Share Your Information</h2>
      <p className="mb-6">
        We do not sell your personal information to third parties. However, we may share your data in the following situations:
      </p>
      <ul className="list-disc pl-6 mb-6">
        <li><strong>Service Providers:</strong> We may share your information with trusted third-party service providers who assist with operating our platform.</li>
        <li><strong>Legal Compliance:</strong> We may disclose your information to comply with legal obligations or respond to lawful requests by public authorities.</li>
        <li><strong>Business Transfers:</strong> If our company undergoes a merger, acquisition, or sale of assets, your personal data may be transferred.</li>
      </ul>

      <h2 className="text-xl font-semibold mb-4">5. Security</h2>
      <p className="mb-6">
        We use industry-standard security measures to protect your data. However, no method of transmission over the internet is completely secure, and we cannot guarantee absolute security.
      </p>

      <h2 className="text-xl font-semibold mb-4">6. Your Rights</h2>
      <p className="mb-6">
        You have the right to:
      </p>
      <ul className="list-disc pl-6 mb-6">
        <li>Access and correct your personal information.</li>
        <li>Request the deletion of your data.</li>
        <li>Opt-out of marketing communications.</li>
        <li>Withdraw consent for data collection at any time.</li>
      </ul>

      <h2 className="text-xl font-semibold mb-4">7. Data Retention</h2>
      <p className="mb-6">
        We retain your information for as long as necessary to provide our services, comply with legal obligations, and resolve disputes.
      </p>

      <h2 className="text-xl font-semibold mb-4">8. Changes to This Privacy Policy</h2>
      <p className="mb-6">
        We may update this Privacy Policy from time to time. We will notify you of any significant changes by posting the new policy on our website.
      </p>

      <h2 className="text-xl font-semibold mb-4">9. Contact Us</h2>
      <p>
        If you have any questions or concerns about our Privacy Policy, please contact us at [Your Email Address].
      </p>
    </div>
  );
};

export default PrivacyPolicy;