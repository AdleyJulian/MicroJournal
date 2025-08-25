# Pensieve - LLM Context Guide

## Project Overview
Pensieve is a React Native mobile journaling app that implements spaced repetition learning using the FSRS (Free Spaced Repetition Scheduler) algorithm. The app helps users preserve and strengthen personal memories through scientifically-optimized review schedules.

## Core Technology Stack
- **Framework**: React Native 0.79.2 with Expo SDK 53
- **Language**: TypeScript
- **Styling**: NativeWind (Tailwind CSS for React Native)
- **Database**: SQLite with Drizzle ORM
- **Spaced Repetition**: ts-fsrs library
- **State Management**: TanStack React Query
- **Navigation**: Expo Router (file-based routing)
- **Date Handling**: date-fns and date-fns-tz

### 🎨 Theming & Styling System
- **Theme-aware Colors**: Comprehensive CSS custom properties system with light/dark theme support
- **NativeWind Integration**: Full Tailwind CSS with theme variable access
- **Semantic Color Tokens**: background, foreground, primary, secondary, muted, accent, destructive, border, input, ring
- **Theme Detection**: Automatic system theme detection with manual override capability
- **CSS Custom Properties**: Light theme (`:root`) and dark theme (`.dark:root`) defined in global.css
- **Color Usage**: Always prefer theme-aware classes like `bg-background`, `text-foreground`, `border-border` over hardcoded colors

## Key Dependencies
- **UI Components**: Custom component library using Radix UI primitives
- **Media**: expo-image-picker, expo-file-system
- **RSS Integration**: react-native-rss-parser for news feeds
- **Navigation**: @react-navigation/native with React Navigation
- **Forms**: react-hook-form with @hookform/resolvers
- **Database**: drizzle-orm, expo-sqlite
- **Animations**: react-native-reanimated, @gorhom/bottom-sheet

## Architecture Overview

### File Structure
```
pensieve/
├── app/                 # File-based routing (Expo Router)
│   ├── (tabs)/         # Main tab navigation
│   │   ├── index.tsx   # Home screen with stats
│   │   ├── create.tsx  # New entry creation
│   │   ├── review.tsx  # Spaced repetition reviews
│   │   ├── explore/    # Calendar and timeline
│   │   └── news/       # RSS feed integration
├── components/         # Reusable UI components
│   ├── ui/            # Base UI components (buttons, cards, etc.)
│   ├── form/          # Form components
│   └── review/        # Review-specific components
├── db/                # Database layer
│   ├── schema/        # Database schema with Drizzle
│   ├── queries.ts     # Database read operations
│   └── mutations.ts   # Database write operations
├── hooks/             # Custom React hooks
├── lib/               # Utility functions and constants
└── constants/         # App constants
```

### Data Model

#### Core Tables
- **journalEntries**: Main memory entries with FSRS scheduling
  - FSRS parameters: due, stability, difficulty, elapsedDays, scheduledDays, reps, lapses, state
  - Journal content: promptQuestion, answer, articleJson, entryDate
  - Metadata: createdAt, updatedAt, cardType, lastReview

- **tags**: User-defined categorization system
- **entryTags**: Many-to-many relationship between entries and tags
- **mediaAttachments**: Images and files linked to journal entries

### FSRS Implementation
The app uses the Free Spaced Repetition Scheduler (ts-fsrs) with custom parameters:
- Request retention: 0.9 (90%)
- Maximum interval: 365 days
- Enable fuzz and short-term scheduling
- Custom weight parameters optimized for journaling use case

## Key Features

### Core Functionality
1. **Memory Creation**: Journal entries with prompt-based questions
2. **Spaced Review**: FSRS-optimized review scheduling with 4 difficulty grades (Again, Hard, Good, Easy)
3. **Daily Streaks**: Habit tracking based on entry creation dates
4. **Media Support**: Image attachments for journal entries
5. **RSS Integration**: Create entries inspired by news articles
6. **Calendar View**: Timeline exploration with date filtering
7. **Analytics**: Memory retention tracking and progress statistics
8. **Interactive Tutorial**: Multi-screen onboarding experience explaining the FSRS algorithm and app usage, accessible from settings

### Review System
- **Due Queue**: Entries scheduled for review based on FSRS algorithm
- **Ahead Cards**: Option to review future-due entries
- **Rating System**: 4-grade feedback system affecting scheduling
- **State Tracking**: New → Learning → Review → Relearning states
- **Progress Metrics**: Review count, lapses, stability scores

## Development Workflow

### Available Scripts
- `npm start` - Start Expo development server
- `npm run android` - Android emulator
- `npm run web` - Web development
- `npm test` - Run Jest tests
- `npm run lint` - Run ESLint

### Database Operations
- Uses Drizzle ORM with SQLite backend
- Automatic schema migrations
- Type-safe queries and mutations
- React Query for data fetching and caching

## Current Development Status
- **Active Development**: Contains TODO items and feature documentation
- **Production Ready**: Includes privacy policy, app store assets, and release documentation
- **Build System**: Expo Application Services (EAS) configured

## Important Notes for LLM Context
- This is a mobile-first application with React Native/Expo
- Heavy emphasis on spaced repetition algorithms and memory optimization
- SQLite database with complex schema including FSRS scheduling parameters
- Custom UI component library built on Radix UI primitives
- File-based routing with Expo Router
- Extensive use of TypeScript for type safety
- Media handling for images and potential future file types
- RSS parsing for external content integration
- Interactive multi-screen onboarding tutorial explaining FSRS algorithm and app usage
- Onboarding tutorial accessible from settings for returning users
- Update this README-LLM.md when relevant changes are made to the app. Example: Changes to the file structure. 

This guide should provide sufficient context for understanding the codebase structure, technology choices, and development patterns used in the Pensieve project.
