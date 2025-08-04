# Traveler Connect & Request

A platform connecting travelers with people who need items brought from other cities/countries. Travelers can post their trips and earn service fees, while requesters can find trusted travelers to bring specific items.

## 🌟 Features

- **Trip Posting**: Travelers post their upcoming trips with service fees
- **Item Requests**: Users can request specific items from travelers
- **LinkedIn Verification**: Mandatory LinkedIn profiles for trust and credibility
- **Search & Discovery**: Advanced filtering for finding trips and travelers
- **In-App Messaging**: Direct communication between travelers and requesters
- **Rating System**: 5-star rating and review system for both parties
- **Trust & Safety**: LinkedIn verification, user reports, and community guidelines

## 🚀 Getting Started

### Prerequisites

- Node.js 18 or higher
- npm or yarn package manager

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd bringalong-app
```

2. Install dependencies
```bash
npm install
```

3. Start the development server
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:3000`

## 🛠️ Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Tech Stack

- **Frontend**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router DOM
- **Icons**: Heroicons
- **State Management**: React Context API
- **Forms**: React Hook Form (planned)

### Project Structure

```
src/
├── components/          # Reusable UI components
├── contexts/           # React Context providers
├── pages/              # Page components
│   ├── Home.tsx        # Search & browse trips
│   ├── PostTrip.tsx    # Create new trip
│   ├── Trips.tsx       # My trips dashboard
│   ├── Requests.tsx    # My requests dashboard
│   ├── Profile.tsx     # User profile & settings
│   ├── TripDetails.tsx # Trip details page
│   ├── UserProfile.tsx # Public user profile
│   ├── Messages.tsx    # Communication center
│   └── Auth/           # Login/Register pages
├── App.tsx             # Main application component
├── main.tsx            # Application entry point
└── index.css           # Global styles and Tailwind imports
```

## 🎨 Core Concept

**For Travelers:**
1. Post upcoming trips with origin, destination, dates, and service fee
2. Include LinkedIn profile for credibility
3. Receive item requests from other users
4. Accept/decline requests and coordinate details
5. Earn money by helping others get items

**For Requesters:**
1. Search for trips by route and date
2. View traveler profiles and ratings
3. Submit detailed item requests with budget
4. Communicate with travelers via messaging
5. Receive items and leave reviews

## � Trust & Safety

- **LinkedIn Verification**: All travelers must provide LinkedIn profiles
- **Rating System**: Mutual rating system for quality control
- **User Reviews**: Detailed feedback for transparency
- **Reporting System**: Report inappropriate behavior
- **Community Guidelines**: Clear terms of service

## 📱 Key Features

### Trip Management
- Create and edit trip details
- Set service fees in multiple currencies
- Track views and requests
- Manage baggage capacity

### Request System
- Detailed item descriptions
- Urgency levels and budgets
- Status tracking (pending, accepted, in-transit, completed)
- Delivery coordination

### Communication
- In-app messaging system (planned)
- File sharing for receipts and photos
- Notification system
- Real-time updates

### User Profiles
- LinkedIn integration
- Rating and review history
- Profile verification status
- Travel history

## 🌍 Global Reach

Designed for international and domestic travel with:
- Multi-currency support
- Location autocomplete
- Cross-border regulations awareness
- Cultural sensitivity features

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

**Connect with Trusted Travelers Worldwide! ✈️**
