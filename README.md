# Micropolis Task

Repository description: Micropolis Task — a demo Angular app by Mellad Morshed.

## Overview

A focused frontend technical assessment that validates UI fidelity, interaction design, and map-centric workflows. The deliverable is evaluated via two reference screen-recordings; all non-specified details are expected to be implemented by the developer.

## Tech Stack

- Framework: Angular 20 (standalone APIs, signals)
- Maps: @angular/google-maps + Google Maps JS SDK
- Rx: RxJS 7
- TypeScript: 5.9
- Tooling: Angular CLI 20

## Quick start

1. Install dependencies:

```sh
npm install
```

2. Configure Google Maps:

   - Get your Google Maps API key from [Google Cloud Console](https://console.cloud.google.com/)
   - Create a Map ID in the Google Cloud Console
   - Update the environment files with your credentials:
     ```typescript
     export const environment = {
       production: true,
       apiUrl:"YOUR_API_URL"
       googleMapsApiKey: 'YOUR_API_KEY',
       googleMapsId: 'YOUR_MAP_ID',
     };
     ```

3. Run in development:

```sh
ng serve --open
```

or

```sh
npm run start
```

4. Build for production:

```sh
npm run build
```

## Authentication & Features

The application is built with security at its core, implementing a comprehensive authentication workflow. After successful authentication, users gain access to the following key features:

### Area & Spot Management

- Complete hierarchical area tree display
- Dynamic spot visualization on the map interface
- Real-time spot location updates

### Spot Creation Workflow

- Intuitive spot creation interface
- Category and sub-category selection
- Tag and sub-tag management
- Business and technical configuration options
- Streamlined submission process

### Map Interaction & Visualization

- Interactive map exploration
- Real-time spot visualization
- Simulated camera stream integration
- Sample video playback for live stream emulation

### Camera Pinning System

- Direct camera pinning from map view
- Instant pinned camera list updates
- Left panel quick access interface

### Google Map Search Integration

- Built-in Places API integration
- Smooth transition animations
- Accurate location centering

## Security

All features operate under authenticated sessions with:

- Secure route guards
- HTTP request interception
- Token-based authentication
- Protected API endpoints

## Project Structure

```
src/
├── app/
│   ├── components/         # Reusable UI components
│   │   ├── add-spot-pin/  # Spot pinning functionality
│   │   ├── context-menu/  # Right-click menu
│   │   ├── form/         # Form components
│   │   ├── pinned-cameras/# Camera management
│   │   └── ...
│   ├── core/
│   │   ├── guards/       # Route guards
│   │   ├── interceptors/ # HTTP interceptors
│   │   ├── models/       # Data models/interfaces
│   │   ├── services/     # Application services
│   │   └── utils/        # Utility functions
│   └── features/         # Feature modules
│       ├── auth/         # Authentication
│       └── dashboard/    # Main dashboard
├── environments/         # Environment configurations
└── styles/              # Global styles
```

## Environment Setup

The application requires Google Maps API configuration. Update the following in your environment files:

```typescript
export const environment = {
  production: false,
  apiUrl:"YOUR_API_URL"
  googleMapsApiKey: 'YOUR_API_KEY',
  googleMapsId: 'YOUR_MAP_ID',
};
```

## Important files

- App entry: [src/main.ts](src/main.ts)
- App component: [src/app/app.ts](src/app/app.ts)
- Environments:
  - Production: [environment.ts](src/environments/environment.ts)
  - Development: [environment.development.ts](src/environments/environment.development.ts)

## Author

Mellad Morshed — [Portfolio](https://melladmorshed.netlify.app)

