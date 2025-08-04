import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeftIcon } from '@heroicons/react/24/outline'

const TermsAndConditions: React.FC = () => {
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
            Terms and Conditions
          </h1>
          <p className="text-gray-600 text-lg">
            Last updated: August 4, 2025
          </p>
        </div>

        {/* Content */}
        <div className="bg-white rounded-xl shadow-lg p-8 space-y-8">
          
          {/* Acceptance */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Acceptance of Terms</h2>
            <p className="text-gray-600 mb-4">
              By accessing and using BringAlong ("the Platform"), you accept and agree 
              to be bound by the terms and provision of this agreement. If you do not agree to abide 
              by the above, please do not use this service.
            </p>
          </section>

          {/* Platform Description */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Platform Description</h2>
            <p className="text-gray-600 mb-4">
              BringAlong is a <strong>non-profit community platform</strong> that facilitates 
              connections between travelers and people who need items brought from other cities or countries. 
              We are not a commercial service provider but rather a community-driven platform designed to 
              help people help each other.
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-blue-800 text-sm font-medium">
                Important: We are a community platform, not a commercial service. All transactions and 
                arrangements are between individual users.
              </p>
            </div>
          </section>

          {/* User Responsibilities */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">3. User Responsibilities</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">3.1 For All Users</h3>
                <ul className="list-disc list-inside text-gray-600 space-y-1">
                  <li>Provide accurate and truthful information</li>
                  <li>Maintain the security of your account credentials</li>
                  <li>Respect other users and communicate professionally</li>
                  <li>Follow all applicable laws and regulations</li>
                  <li>Report suspicious or inappropriate behavior</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">3.2 For Travelers</h3>
                <ul className="list-disc list-inside text-gray-600 space-y-1">
                  <li>Maintain an active and verified LinkedIn profile</li>
                  <li>Provide accurate travel dates and destinations</li>
                  <li>Communicate clearly about items you can carry</li>
                  <li>Honor commitments made to requesters</li>
                  <li>Ensure legal compliance for items being transported</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">3.3 For Requesters</h3>
                <ul className="list-disc list-inside text-gray-600 space-y-1">
                  <li>Clearly describe items and requirements</li>
                  <li>Verify traveler credentials before making arrangements</li>
                  <li>Ensure requested items are legal to transport</li>
                  <li>Honor payment agreements</li>
                  <li>Provide accurate delivery information</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Prohibited Activities */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Prohibited Activities</h2>
            <p className="text-gray-600 mb-4">The following activities are strictly prohibited:</p>
            <ul className="list-disc list-inside text-gray-600 space-y-1">
              <li>Requesting or agreeing to transport illegal items</li>
              <li>Using the platform for commercial or business purposes without disclosure</li>
              <li>Creating fake profiles or providing false information</li>
              <li>Harassment, threatening, or inappropriate behavior</li>
              <li>Attempting to circumvent platform safety measures</li>
              <li>Spamming or sending unsolicited messages</li>
              <li>Violating any local, national, or international laws</li>
            </ul>
          </section>

          {/* Verification Requirements */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Verification Requirements</h2>
            <div className="space-y-4">
              <p className="text-gray-600">
                To maintain trust and safety in our community:
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-1">
                <li>All travelers must provide and maintain a valid LinkedIn profile URL</li>
                <li>We encourage users to verify each other's credentials before making arrangements</li>
                <li>Check professional backgrounds, current employment, and education</li>
                <li>Users are responsible for their own due diligence</li>
              </ul>
            </div>
          </section>

          {/* Limitation of Liability */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Limitation of Liability</h2>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-4">
              <div className="flex items-start space-x-3">
                <svg className="w-6 h-6 text-yellow-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd"></path>
                </svg>
                <div>
                  <h3 className="text-lg font-semibold text-yellow-800 mb-2">IMPORTANT DISCLAIMER</h3>
                  <p className="text-yellow-700 text-sm">
                    <strong>WE ARE JUST A COMMUNITY PLATFORM AND ARE NOT RESPONSIBLE FOR ANY LOSS, 
                    DAMAGE, OR DISPUTES.</strong> All arrangements, transactions, and interactions are 
                    between individual users. Use this platform at your own risk and exercise good judgment.
                  </p>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <p className="text-gray-600 font-medium">The Platform and its operators are NOT liable for:</p>
              <ul className="list-disc list-inside text-gray-600 space-y-1">
                <li>Lost, damaged, or stolen items</li>
                <li>Financial losses or payment disputes</li>
                <li>Missed connections or travel delays</li>
                <li>Fraudulent or deceptive behavior by users</li>
                <li>Legal issues arising from transported items</li>
                <li>Personal safety incidents</li>
                <li>Any direct, indirect, incidental, or consequential damages</li>
              </ul>
            </div>
          </section>

          {/* User Agreements */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">7. User-to-User Agreements</h2>
            <p className="text-gray-600 mb-4">
              All arrangements between travelers and requesters are private agreements. The Platform:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-1">
              <li>Does not facilitate or process payments</li>
              <li>Does not mediate disputes</li>
              <li>Does not verify item authenticity or quality</li>
              <li>Does not guarantee delivery or service quality</li>
              <li>Recommends users establish clear terms before proceeding</li>
            </ul>
          </section>

          {/* Safety Guidelines */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Safety Guidelines</h2>
            <p className="text-gray-600 mb-4">For your safety and protection:</p>
            <ul className="list-disc list-inside text-gray-600 space-y-1">
              <li>Always verify the other party's LinkedIn profile and credentials</li>
              <li>Check their current company, college, and professional background</li>
              <li>Use secure payment methods and avoid cash-only transactions</li>
              <li>Meet in public places for item exchanges</li>
              <li>Keep records of all communications and agreements</li>
              <li>Trust your instincts - if something feels wrong, don't proceed</li>
              <li>Report any suspicious or inappropriate behavior immediately</li>
            </ul>
          </section>

          {/* Platform Modifications */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Platform Modifications</h2>
            <p className="text-gray-600">
              We reserve the right to modify, suspend, or discontinue the Platform at any time. 
              As a non-profit community service, we may need to make changes based on community 
              needs, legal requirements, or resource availability.
            </p>
          </section>

          {/* Termination */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Account Termination</h2>
            <p className="text-gray-600 mb-4">
              We may terminate or suspend accounts that:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-1">
              <li>Violate these terms and conditions</li>
              <li>Engage in prohibited activities</li>
              <li>Provide false or misleading information</li>
              <li>Pose a risk to community safety</li>
              <li>Are inactive for extended periods</li>
            </ul>
          </section>

          {/* Governing Law */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Governing Law</h2>
            <p className="text-gray-600">
              These terms and conditions are governed by applicable laws. Users are responsible 
              for ensuring their activities comply with all relevant local, national, and 
              international regulations.
            </p>
          </section>

          {/* Changes to Terms */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">12. Changes to Terms</h2>
            <p className="text-gray-600">
              We may update these Terms and Conditions from time to time. Users will be notified 
              of significant changes via email or platform notifications. Continued use of the 
              Platform constitutes acceptance of updated terms.
            </p>
          </section>

          {/* Contact Information */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">13. Contact Information</h2>
            <p className="text-gray-600 mb-4">
              For questions about these Terms and Conditions, please contact us:
            </p>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-700 font-medium">BringAlong Community</p>
              <p className="text-gray-600">Email: legal@bringalong.net</p>
              <p className="text-gray-600">Platform: Use our contact form for support</p>
            </div>
          </section>

          {/* Community Commitment */}
          <section className="border-t pt-6">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-green-900 mb-2">Our Community Commitment</h3>
              <p className="text-green-800 text-sm">
                As a non-profit community platform, our mission is to help people help each other. 
                We're committed to maintaining a safe, respectful, and helpful environment for all users. 
                Together, we can create a trusted network of travelers and requesters who support 
                each other's needs while exploring the world.
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}

export default TermsAndConditions
