import React from 'react';

const Terms = () => {
  return (
    <div className="container mx-auto px-6 py-12 text-black">
      <h1 className="text-3xl text-white font-semibold mb-8">Terms & Conditions</h1>
      
      <p className="mb-6"><strong>Last Updated: 27 Feb 2025</strong></p>

      <h2 className="text-xl font-semibold mb-4">1. Acceptance of Terms</h2>
      <p className="mb-6">
        By accessing or using <span className='font-semibold bg-gradient-to-r from-blue-700 to-purple-600 text-transparent bg-clip-text'>The Good Deed</span>, you agree to comply with and be bound by these Terms and Conditions. If you do not agree, you should not use our services.
      </p>

      <h2 className="text-xl font-semibold mb-4">2. Use of Our Services</h2>
      <ul className="mb-6 list-disc pl-6">
        <li><strong>Eligibility:</strong> You must be at least 13 to use our platform.</li>
        <li><strong>Account Registration</strong> To access certain features, you may need to create an account. You agree to provide accurate and complete information and keep your account details confidential.</li>
        <li><strong>Acceptable Use:</strong> You agree not to use our platform for illegal activities, spamming, or any activity that could harm the platform or other users.</li>
      </ul>

      <h2 className="text-xl font-semibold mb-4">3. User Content</h2>
      <ul className="mb-6 list-disc pl-6">
        <li><strong>Ownership:</strong> You retain ownership of the content you upload or share on our platform.</li>
        <li><strong>License:</strong> By submitting content, you grant us a non-exclusive, royalty-free license to use, display, and distribute the content in connection with our services.</li>
      </ul>

      {/* <h2 className="text-xl font-semibold mb-4">4. Payment and Fees</h2>
      <p className="mb-6 list-disc pl-6">
        <li><strong>Fees:</strong> Some features or services on our platform may require payment. You agree to pay all applicable fees in accordance with our pricing structure.</li>
        <li><strong>Refund Policy:</strong> [Specify your refund policy, if any].</li>
      </p> */}

      <h2 className="text-xl font-semibold mb-4">4. Limitation of Liability</h2>
      <p className="mb-6">
        We are not liable for any indirect, incidental, or consequential damages arising from your use of the platform. Our liability is limited to the amount you paid for the services, if applicable.
      </p>

      <h2 className="text-xl font-semibold mb-4">5. Termination</h2>
      <p className="mb-6">
        We reserve the right to suspend or terminate your account if you violate these Terms and Conditions. Upon termination, you must cease using our services and remove any content associated with your account.
      </p>

      <h2 className="text-xl font-semibold mb-4">6. Intellectual Property</h2>
      <p className="mb-6">
        All content, trademarks, logos, and intellectual property on the platform are owned by The Good Deed or its licensors. You may not use our intellectual property without prior written consent.
      </p>

      <h2 className="text-xl font-semibold mb-4">7. Governing Law</h2>
      <p className="mb-6">
        These Terms and Conditions are governed by and construed in accordance with the laws of India. Any disputes will be resolved in the courts.
      </p>

      <h2 className="text-xl font-semibold mb-4">8. Changes to Terms</h2>
      <p className="mb-6">
        We may modify these Terms and Conditions at any time. We will notify you of significant changes by updating the date at the top of this page.
      </p>

      <h2 className="text-xl font-semibold mb-4">9. Contact Us</h2>
      <p>
        If you have any questions about these Terms and Conditions, please contact us at [Your Email Address].
      </p>
    </div>
  );
};

export default Terms;