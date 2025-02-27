# Service Provider Platform

## Overview
This is a web-based platform designed to connect users with verified service providers such as mechanics, tailors, plumbers, and other professionals. The platform allows users to search for nearby providers, book their services, chat with them, and leave reviews. Providers can register, get verified, and opt for a premium subscription to increase their visibility.

## Features
### For Users
- **Search for Service Providers**: Users can select a service type and find nearby providers.
- **View Provider Details**: Access provider information, including ratings, availability, and verification status.
- **Booking System**: Users can book appointments with providers, stored in Firestore under the provider’s subcollection.
- **Chat Functionality**: Users can communicate with providers via real-time chat.
- **Review System**: Users can leave feedback about the service providers.
- **Premium Providers**: Prioritized search results for premium-verified providers.

### For Service Providers
- **Registration & Profile Management**: Providers can sign up and edit their profiles.
- **Verification Process**: Providers can submit documents for verification.
- **Booking Management**: View and manage customer bookings.
- **Chat System**: Communicate with potential clients in real time.
- **Subscription Plans**: Upgrade to premium for better visibility.

### Admin Dashboard
- **User & Provider Management**: Approve, reject, or remove users and providers.
- **Verification Approval**: Review and validate provider documents.
- **Subscription Management**: Handle premium provider payments and subscriptions.
- **Analytics & Reports**: Track platform usage and transactions.

## Tech Stack
- **Frontend**: Vue.js (Nuxt 3, Composition API)
- **State Management**: Pinia
- **Backend**: Firebase (Firestore, Firebase Auth, Firebase Storage)
- **Maps Integration**: Leaflet.js
- **Styling**: CSS
- **Hosting**: Vercel

## Folder Structure
```
/ - Root Directory
│── pages/          # Nuxt 3 pages
│── components/     # Reusable UI components
│── store/         # Pinia store (Firebase logic inside)
│── assets/        # Static files (images, styles, etc.)
│── plugins/       # Third-party plugins (Leaflet, Swiper, etc.)
│── middleware/    # Route guards and authentication
│── public/        # Public assets
│── utils/         # Utility functions
│── README.md      # Project documentation
```

## Setup & Installation
### Prerequisites
Ensure you have Node.js and Yarn/NPM installed.

### Installation
1. Clone the repository:
   ```sh
   git clone https://github.com/your-repo/service-provider-platform.git
   cd service-provider-platform
   ```
2. Install dependencies:
   ```sh
   npm install  # or yarn install
   ```
3. Configure Firebase:
   - Create a Firebase project and enable Firestore, Authentication, and Storage.
   - Add your Firebase config in `.env` file.

4. Run the development server:
   ```sh
   npm run dev  # or yarn dev
   ```

## Firestore Database Structure
```
REGISTERED-PROVIDERS (Collection)
  ├── {providerUID} (Document)
  │   ├── bookings (Subcollection)
  │   │   ├── {bookingID} (Document)
  │   ├── chats (Subcollection)
  │   │   ├── {userUID} (Document)
  │   │   │   ├── messages (Subcollection)
  │   │   │   │   ├── {messageID} (Document)
```

## API Endpoints (Nuxt Server Routes)
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/providers` | GET | Fetches all providers |
| `/api/providers/{id}` | GET | Fetches details of a specific provider |
| `/api/bookings` | POST | Creates a new booking |
| `/api/chat` | POST | Sends a chat message |

## Future Enhancements
- **Payment Integration**: Enable online payments for bookings.
- **Geolocation Improvements**: Optimize location-based searches.
- **Push Notifications**: Notify users about bookings and messages.

## License
This project is licensed under the MIT License.

---

For any issues or feature requests, please open a GitHub issue or contact the development team.

