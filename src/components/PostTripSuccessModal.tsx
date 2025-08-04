import { useState, useEffect } from 'react';
import { XMarkIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

interface PostTripSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  tripId?: string;
}

export function PostTripSuccessModal({ isOpen, onClose, tripId }: PostTripSuccessModalProps) {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      icon: "🤝",
      title: "Requester Will Connect via LinkedIn",
      description: "People interested in your services will reach out to you through LinkedIn. This ensures verified professional connections.",
      details: [
        "Check their LinkedIn profile thoroughly",
        "Look for current company and work history", 
        "Verify their educational background",
        "Ensure they have a complete professional profile"
      ]
    },
    {
      icon: "🔍", 
      title: "Verify Their Genuineness",
      description: "Take time to evaluate if the requester is trustworthy before proceeding.",
      details: [
        "Review their current company and position",
        "Check their college/university background",
        "Look at their connections and endorsements",
        "Trust your instincts about their authenticity"
      ]
    },
    {
      icon: "💰",
      title: "Agree on Payment Terms", 
      description: "Once you're comfortable, discuss and finalize the payment arrangement.",
      details: [
        "Negotiate your service fee clearly",
        "Discuss item cost and reimbursement",
        "Agree on payment timeline (before/after delivery)",
        "Consider using secure payment methods"
      ]
    },
    {
      icon: "🛒",
      title: "Purchase & Deliver the Item",
      description: "Buy the requested item and coordinate delivery with the requester.",
      details: [
        "Purchase the item as agreed",
        "Keep receipts for transparency", 
        "Coordinate delivery location and time",
        "Ensure safe and timely handover"
      ]
    },
    {
      icon: "⚠️",
      title: "Community Responsibility",
      description: "Remember: We're a community platform facilitating connections, not a commercial service.",
      details: [
        "Exercise personal judgment in all interactions",
        "We are not responsible for any financial loss",
        "All transactions are between individuals",
        "Report any suspicious or inappropriate behavior"
      ],
      isWarning: true
    }
  ];

  useEffect(() => {
    if (isOpen) {
      setCurrentStep(0);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <CheckCircleIcon className="w-8 h-8 text-green-500" />
            <div>
              <h2 className="text-xl font-bold text-gray-900">Trip Posted Successfully! 🎉</h2>
              <p className="text-sm text-gray-600">Here's how the process works</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        {/* Progress Indicator */}
        <div className="px-6 py-4 bg-gray-50">
          <div className="flex items-center justify-between mb-2">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`w-3 h-3 rounded-full transition-colors ${
                  index === currentStep 
                    ? 'bg-blue-500' 
                    : index < currentStep 
                    ? 'bg-green-500' 
                    : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
          <div className="text-xs text-gray-600 text-center">
            Step {currentStep + 1} of {steps.length}
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className={`text-center mb-6 ${steps[currentStep].isWarning ? 'bg-yellow-50 p-4 rounded-lg border border-yellow-200' : ''}`}>
            <div className="text-4xl mb-2">{steps[currentStep].icon}</div>
            <h3 className={`text-lg font-semibold mb-2 ${steps[currentStep].isWarning ? 'text-yellow-800' : 'text-gray-900'}`}>
              {steps[currentStep].title}
            </h3>
            <p className={`text-sm ${steps[currentStep].isWarning ? 'text-yellow-700' : 'text-gray-600'}`}>
              {steps[currentStep].description}
            </p>
          </div>

          <div className="space-y-3">
            {steps[currentStep].details.map((detail, index) => (
              <div 
                key={index} 
                className={`flex items-start space-x-3 p-3 rounded-lg ${
                  steps[currentStep].isWarning ? 'bg-yellow-50 border border-yellow-200' : 'bg-blue-50'
                }`}
              >
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                  steps[currentStep].isWarning ? 'bg-yellow-500 text-white' : 'bg-blue-500 text-white'
                }`}>
                  {index + 1}
                </div>
                <p className={`text-sm ${steps[currentStep].isWarning ? 'text-yellow-800' : 'text-gray-700'}`}>
                  {detail}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
            disabled={currentStep === 0}
            className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          
          <div className="text-xs text-gray-500">
            {tripId && `Trip ID: ${tripId}`}
          </div>

          {currentStep < steps.length - 1 ? (
            <button
              onClick={() => setCurrentStep(currentStep + 1)}
              className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors"
            >
              Next
            </button>
          ) : (
            <button
              onClick={onClose}
              className="px-6 py-2 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700 transition-colors"
            >
              Got it! 👍
            </button>
          )}
        </div>

        {/* Community Disclaimer */}
        <div className="px-6 pb-4">
          <div className="bg-gray-100 border border-gray-300 rounded-lg p-3">
            <p className="text-xs text-gray-600 text-center">
              <strong>Remember:</strong> BringAlong is a non-profit community platform. 
              All transactions and interactions are solely between individual users. 
              Please exercise caution and good judgment in all dealings.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PostTripSuccessModal;
