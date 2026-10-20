# Rahat Ye – Meal & Symptom Tracker

Rahat Ye is a React Native mobile application designed to help users track their meals, potential food triggers, and digestive symptoms.

The application follows an **offline-first approach**, allowing users to save and manage their meal records locally, even without an internet connection.

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
- Switch between Light Mode and Dark Mode
- Persist the selected theme using AsyncStorage
- Display custom, theme-aware success, error, warning, and confirmation dialogs
- Confirm before deleting meal records
- Show loading indicators during asynchronous operations

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
│   ├── CustomAlert.tsx
│   └── SelectionChips.tsx
├── constants/
│   └── mealOptions.ts
├── screen/
│   ├── MealFormScreen.tsx
│   └── MealHistoryScreen.tsx
├── services/
│   ├── mockApi.ts
│   └── mockApi.test.ts
├── store/
│   ├── useMealStore.ts
│   ├── useMealStore.test.ts
│   └── useThemeStore.ts
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

When a user creates a meal, the record is initially saved with a `pending` synchronization status.

The application then attempts to synchronize the record using a simulated API request.

If synchronization fails, the record remains stored locally and the user can manually retry synchronization from the meal history screen.

## Mock API

The mock API simulates:

- `POST /api/logs`
- 1500 ms network delay
- 10% probability of request failure
- Manual retry for failed synchronization

No real backend server is required.

Editing a record marks it as pending. The mock API currently simulates POST requests rather than a real update endpoint.

## Theme Management

The application supports both Light Mode and Dark Mode.

Theme state is managed using Zustand, while the user's selected theme is persisted using AsyncStorage.

The interface uses a centralized