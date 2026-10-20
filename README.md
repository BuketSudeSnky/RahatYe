# Rahat Ye – Meal & Symptom Tracker

Rahat Ye is a React Native mobile application designed to help users track their meals, potential food triggers, and digestive symptoms.
The application follows an **offline-first approach**, allowing users to save and manage their meal records locally.

## Features

- Add meals with name and category
- Select potential food trigger tags
- Record digestive symptoms
- Rate symptom severity from 1 to 5
- View meal history
- Edit and delete existing records
- Store data locally using AsyncStorage
- Simulate API synchronization
- Track synchronization status: pending, synced, failed
- Retry failed synchronization requests

## Tech Stack

- React Native
- Expo
- TypeScript
- Zustand
- AsyncStorage
- Jest
- jest-expo

## Project Structure

```text
src/
├── components/
│   └── SelectionChips.tsx
├── constants/
│   └── mealOptions.ts
├── screens/
│   ├── MealFormScreen.tsx
│   └── MealHistoryScreen.tsx
├── services/
│   ├── mockApi.ts
│   └── mockApi.test.ts
├── store/
│   ├── useMealStore.ts
│   └── useMealStore.test.ts
├── theme/
│   ├── colors.ts
│   └── typography.ts
└── types/
    └── meal.ts
```

## Installation

Clone the repository and install dependencies:

```bash
npm install
```

Start the Expo development server:

```bash
npx expo start
```

Press `a` to launch the application in an available Android emulator.

## Offline-First Architecture

Meal records are saved locally using AsyncStorage and managed through Zustand.

When a user creates a meal, it is initially saved with a `pending` synchronization status.

The application then attempts to synchronize the record using a simulated API request.

## Mock API

The mock API simulates:

- `POST /api/logs`
- 1500 ms network delay
- 10% probability of request failure
- Manual retry for failed synchronization

No real backend server is required.

Editing a record marks it as pending. The mock API currently simulates POST requests rather than a real update endpoint.

## Testing

Run the automated tests:

```bash
npm test -- --watch=false
```

The Jest test suite covers:

- Successful API requests
- Failed API requests
- Simulated network delay
- Adding meal records
- Updating meal records
- Deleting meal records
- Local data persistence

## Notes

This project was developed as a React Native case study. It demonstrates local state management, offline persistence, mock API integration, error handling, and automated testing.
