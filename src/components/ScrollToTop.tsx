import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

/**
 * ScrollToTop component that automatically scrolls to the top of the page
 * when the route changes. This ensures that when users navigate to a new page,
 * they start at the top instead of maintaining the previous scroll position.
 */
export default function ScrollToTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    // Scroll to top when pathname changes
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth' // Use smooth scrolling for better UX
    })
  }, [pathname])

  return null
}
