import React from 'react'
import { ShareIcon } from '@heroicons/react/24/outline'

interface SocialShareButtonsProps {
  url: string
  title: string
  description: string
}

const SocialShareButtons: React.FC<SocialShareButtonsProps> = ({ url, title, description }) => {
  const handleShare = async () => {
    if ('share' in navigator && navigator.share) {
      try {
        await navigator.share({
          title: title,
          text: description,
          url: url,
        })
      } catch (error) {
        console.log('Error sharing:', error)
      }
    } else {
      // Fallback: copy to clipboard
      try {
        await navigator.clipboard.writeText(`${title} - ${url}`)
        alert('Link copied to clipboard!')
      } catch (error) {
        console.log('Error copying to clipboard:', error)
      }
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-4 mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <ShareIcon className="w-4 h-4 text-gray-600 mr-2" />
          <span className="text-sm font-medium text-gray-700">Share this trip</span>
        </div>
        
        <button
          onClick={handleShare}
          className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded-lg transition-colors flex items-center"
        >
          <ShareIcon className="w-4 h-4 mr-1" />
          Share
        </button>
      </div>
    </div>
  )
}

export default SocialShareButtons
