import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeftIcon } from '@heroicons/react/24/outline'

const PrivacyPolicy: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <div className="mb-6">
          <Link
            to="/"
            className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium"
          >
            <ArrowLeftIcon className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
        </div>

        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Privacy Policy
          </h1>
          <p className="text-gray-600 text-lg">
            Last updated: August 4, 2025
          </p>
        </div>

        {/* Content */}
        <div className="bg-white rounded-xl shadow-lg p-8 space-y-8">
          
          {/* Introduction */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Introduction</h2>
            <p className="text-gray-600 mb-4">
              Welcome to BringAlong ("we," "our," or "us"). We are a non-profit community 
              platform that connects travelers with people who need items brought from other cities or countries. 
              This Privacy Policy explains how we collect, use, and protect your personal information when you 
              use our platform.
            </p>
          </section>

          {/* Information We Collect */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Information We Collect</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">2.1 Personal Information</h3>
                <ul className="list-disc list-inside text-gray-600 space-y-1">
                  <li>Name and email address</li>
                  <li>Phone number (optional)</li>
                  <li>LinkedIn profile URL (required for travelers)</li>
                  <li>Instagram ID (optional)</li>
                  <li>Profile picture and bio</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">2.2 Trip Information</h3>
                <ul className="list-disc list-inside text-gray-600 space-y-1">
                  <li>Travel routes (departure and destination cities)</li>
                  <li>Travel dates</li>
                  <li>Service fees and currency preferences</li>
                  <li>Items you can carry</li>
                  <li>Trip notes and descriptions</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">2.3 Usage Data</h3>
                <ul className="list-disc list-inside text-gray-600 space-y-1">
                  <li>How you interact with our platform</li>
                  <li>Search queries and preferences</li>
                  <li>Device information and IP address</li>
                  <li>Browser type and version</li>
                </ul>
              </div>
            </div>
          </section>

          {/* How We Use Information */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">3. How We Use Your Information</h2>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li>To facilitate connections between travelers and requesters</li>
              <li>To display your public profile and trip information to other users</li>
              <li>To improve our platform and user experience</li>
              <li>To send important updates about your trips and requests</li>
              <li>To ensure safety and verify user authenticity through LinkedIn profiles</li>
              <li>To provide customer support when needed</li>
            </ul>
          </section>

          {/* Information Sharing */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Information Sharing</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">4.1 Public Information</h3>
                <p className="text-gray-600">
                  Your name, profile picture, verification status, trip details, and LinkedIn profile 
                  are visible to all users to facilitate trust and connections.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">4.2 We DO NOT Share</h3>
                <ul className="list-disc list-inside text-gray-600 space-y-1">
                  <li>Your email address with other users</li>
                  <li>Your phone number with other users</li>
                  <li>Your personal information with third-party companies for marketing</li>
                  <li>Any information for profit (we are a non-profit community)</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Data Security */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Data Security</h2>
            <p className="text-gray-600 mb-4">
              We implement appropriate security measures to protect your personal information against 
              unauthorized access, alteration, disclosure, or destruction. However, no method of 
              transmission over the internet is 100% secure.
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-1">
              <li>Encrypted data transmission</li>
              <li>Secure server infrastructure</li>
              <li>Regular security audits</li>
              <li>Limited access to personal data</li>
            </ul>
          </section>

          {/* Your Rights */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Your Rights</h2>
            <p className="text-gray-600 mb-4">You have the right to:</p>
            <ul className="list-disc list-inside text-gray-600 space-y-1">
              <li>Access and update your personal information</li>
              <li>Delete your account and associated data</li>
              <li>Opt out of non-essential communications</li>
              <li>Request a copy of your data</li>
              <li>Report any privacy concerns</li>
            </ul>
          </section>

          {/* Community Guidelines */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Community Guidelines & Safety</h2>
            <p className="text-gray-600 mb-4">
              As a community platform, we encourage responsible behavior:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-1">
              <li>Verify traveler credentials through LinkedIn before transactions</li>
              <li>Use secure payment methods</li>
              <li>Report suspicious or inappropriate behavior</li>
              <li>Respect privacy and personal boundaries</li>
            </ul>
          </section>

          {/* Cookies */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Cookies and Tracking</h2>
            <p className="text-gray-600">
              We use essential cookies to ensure proper platform functionality, such as keeping you 
              logged in and remembering your preferences. We do not use tracking cookies for 
              advertising purposes.
            </p>
          </section>

          {/* Changes to Policy */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Changes to This Policy</h2>
            <p className="text-gray-600">
              We may update this Privacy Policy from time to time. We will notify users of any 
              significant changes via email or platform notifications. Your continued use of the 
              platform constitutes acceptance of the updated policy.
            </p>
          </section>

          {/* Contact */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Contact Us</h2>
            <p className="text-gray-600 mb-4">
              If you have any questions about this Privacy Policy or our data practices, please contact us:
            </p>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-700 font-medium">BringAlong Community</p>
              <p className="text-gray-600">Email: privacy@bringalong.net</p>
              <p className="text-gray-600">Platform: Report through our contact form</p>
            </div>
          </section>

          {/* Non-Profit Notice */}
          <section className="border-t pt-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-blue-900 mb-2">Non-Profit Community Notice</h3>
              <p className="text-blue-800 text-sm">
                BringAlong is a non-profit community platform. We do not sell your data, 
                we do not profit from your information, and our primary goal is to help travelers and 
                requesters connect safely and efficiently. All platform operations are community-driven 
                and focused on mutual benefit rather than commercial gain.
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}

export default PrivacyPolicy
