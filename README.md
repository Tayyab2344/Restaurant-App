# Restaurant Customer App 🍔

A premium, feature-rich mobile application for restaurant customers, built with **React Native** and **Expo**. This app provides a seamless flow from dish discovery to checkout, with a focus on high-quality UI/UX.

## 🚀 Key Features

- **Authentication**: Secure login and registration flow.
- **Dynamic Menu**: Categorized dishes with detailed descriptions and high-quality visuals.
- **Advanced Cart Management**: Real-time cart updates and item management.
- **Streamlined Checkout**: Integrated checkout process with order summary.
- **Order Tracking**: Detailed view of current and past orders.
- **User Profile**: Personal information management and security settings.
- **Support & Help**: Help center and problem reporting features.
- **Dark Mode Support**: Optimized for both light and dark themes.

## 🛠 Tech Stack

- **Framework**: [Expo SDK 54](https://expo.dev/) (React Native)
- **State Management**: [Zustand](https://github.com/pmndrs/zustand)
- **UI Components**: [React Native Paper](https://reactnativepaper.com/)
- **Navigation**: [React Navigation 7](https://reactnavigation.org/)
- **Styling**: Vanilla React Native StyleSheet + Expo Linear Gradient
- **Language**: TypeScript

## 📁 Project Structure

```text
src/
├── data/           # Mock data and constants
├── navigation/     # Stack and Tab navigation configuration
├── screens/        # All app screens (Auth, Menu, Cart, etc.)
├── store/          # Zustand store implementations
├── theme/          # Custom theme tokens and colors
└── types/          # TypeScript interface definitions
```

## 🚥 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (Latest LTS)
- [Expo Go](https://expo.dev/go) app on your mobile device (to test on physical device)

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd Restaurants
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the project:
   ```bash
   npm run start
   ```

Scan the QR code printed in the terminal with your **Expo Go** app (Android) or **Camera** app (iOS).

## 📱 Available Screens

Detailed implementations can be found in `src/screens/`:

- `AuthScreen`: Handles user login and signup.
- `MenuScreen`: Explores restaurant offerings.
- `DishDetailScreen`: Full view of a specific item.
- `CartScreen`: Review and modify items before ordering.
- `CheckoutScreen`: Finalize the order.
- `OrderDetailScreen`: Track order status and history.
- `ProfileScreen`: User settings and account management.

## 📄 License

This project is for demonstration and development purposes.

---
*Developed with ❤️ as part of a high-end restaurant service solution.*
