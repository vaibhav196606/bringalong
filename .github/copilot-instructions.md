<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

# BringAlong - Copilot Instructions

This is a React TypeScript platform connecting travelers with people who need items brought from other cities/countries.

## Project Overview
**Core Concept**: Travelers post their trips with service fees. Other users can request specific items to be brought from the traveler's destination. All travelers must have LinkedIn profiles for credibility.

## Key Features
- **Trip Posting System**: Travelers create trips with routes, dates, and service fees
- **Item Request System**: Users request specific items with descriptions and budgets  
- **LinkedIn Integration**: Mandatory LinkedIn verification for trust and safety
- **Search & Discovery**: Advanced filtering for trips by route, date, and price
- **Communication**: In-app messaging between travelers and requesters
- **Rating System**: Mutual ratings and reviews for quality control
- **Trust & Safety**: User verification, reporting, and community guidelines

## Tech Stack
- Frontend: React 18 with TypeScript and Vite
- Styling: Tailwind CSS with custom design system
- Routing: React Router DOM
- State Management: React Context API
- Icons: Heroicons
- Forms: React Hook Form (planned)

## Page Structure
- `/` - Home page with trip search and discovery
- `/post-trip` - Create new trip form
- `/trips` - My trips dashboard
- `/requests` - My requests dashboard  
- `/trip/:id` - Trip details and request management
- `/user/:id` - Public user profiles
- `/messages` - Communication center
- `/profile` - User profile and settings
- `/auth/*` - Login/register pages

## Development Guidelines
- Use TypeScript interfaces for all data structures
- Implement proper form validation and error handling
- Follow responsive design patterns with Tailwind
- Include loading states for async operations
- Maintain focus on trust and safety features
- Prioritize LinkedIn integration and verification

## Core Data Models
```typescript
interface User {
  id: string
  name: string
  email: string
  linkedinUrl: string // Required for travelers
  phone?: string
  avatar?: string
  bio?: string
  rating: number
  verified: boolean
}

interface Trip {
  id: string
  userId: string
  fromCity: string
  fromCountry: string
  toCity: string
  toCountry: string
  travelDate: string
  returnDate?: string
  serviceFee: number
  currency: string
  notes?: string
  baggageCapacity?: string
  status: 'active' | 'completed' | 'cancelled'
}

interface Request {
  id: string
  tripId: string
  requesterId: string
  itemDescription: string
  estimatedSize?: string
  urgency: 'low' | 'medium' | 'high'
  maxBudget: number
  deliveryLocation?: string
  status: 'pending' | 'accepted' | 'in-transit' | 'completed' | 'cancelled'
}
```

## User Flows
**For Travelers:**
1. Register with LinkedIn profile
2. Post trip details with service fee
3. Receive and manage item requests
4. Coordinate with requesters via messaging
5. Complete deliveries and receive ratings

**For Requesters:**
1. Search trips by route and date
2. View traveler profiles and ratings
3. Submit detailed item requests
4. Communicate with travelers
5. Receive items and leave reviews

## Trust & Safety Priority
- Always validate LinkedIn URLs in forms
- Display verification status prominently
- Implement user reporting features
- Show ratings and reviews clearly
- Include safety disclaimers where appropriate

When generating code, prioritize:
1. LinkedIn profile integration and validation
2. Clear trip posting and request workflows
3. Trust indicators (ratings, verification badges)
4. Responsive design for mobile users
5. Proper error handling and loading states
6. Security best practices for user data
