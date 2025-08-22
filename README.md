# 🧠 Pensieve

**Your Personal Memory Enhancement Tool**

Pensieve is a sophisticated mobile journaling app that combines the art of personal reflection with the science of spaced repetition learning. Inspired by the magical memory storage device from Harry Potter, Pensieve helps you preserve and strengthen important personal memories through scientifically-optimized review schedules.

## ✨ Features

### 🔄 Smart Memory Management
- **Spaced Repetition Algorithm**: Uses FSRS (Free Spaced Repetition Scheduler) to optimize when you should review entries
- **Intelligent Review Queue**: Automatically schedules reviews based on your memory performance
- **Memory Strength Tracking**: Visual indicators show how well memories are retained

### 📝 Enhanced Journaling
- **Daily Streaks**: Build consistent journaling habits with streak tracking
- **Prompt-Based Entries**: Guided prompts help capture meaningful reflections
- **Rich Media Support**: Add images and media to your journal entries
- **News Integration**: Create entries inspired by current events

### 📊 Personal Insights
- **Calendar View**: Explore your memory timeline with date-based filtering
- **Progress Analytics**: Track your journaling consistency and memory retention
- **Export & Backup**: Securely export your data or create backups
- **Cross-Platform Sync**: Access your memories across devices

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- Expo CLI
- Android Studio (for Android development)
- Xcode (for iOS development)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/pensieve.git
   cd pensieve
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npx expo start
   ```

4. **Run on device/emulator**
   - **Android**: Press `a` to open Android emulator
   - **iOS**: Press `i` to open iOS simulator
   - **Physical device**: Scan QR code with Expo Go app

## 🛠 Technology Stack

### Core Framework
- **React Native 0.79.2** - Cross-platform mobile development
- **Expo SDK 53** - Development platform and native modules
- **TypeScript** - Type-safe JavaScript

### Key Libraries
- **@tanstack/react-query** - Data fetching and state management
- **drizzle-orm** - Database ORM with SQLite
- **ts-fsrs** - Free Spaced Repetition Scheduler
- **react-native-calendars** - Calendar components
- **expo-sqlite** - Local database storage
- **expo-file-system** - File operations
- **expo-image-picker** - Media selection

### Development Tools
- **Expo Router** - File-based routing
- **NativeWind** - Tailwind CSS for React Native
- **Jest** - Testing framework
- **ESLint** - Code linting

## 📱 App Structure

```
pensieve/
├── app/                    # App screens and routing
│   ├── (tabs)/            # Main tab navigation
│   │   ├── index.tsx      # Home screen with stats
│   │   ├── create.tsx     # New entry creation
│   │   ├── review.tsx     # Spaced repetition reviews
│   │   ├── explore/       # Calendar and timeline
│   │   └── news/          # News integration
│   └── settings.tsx       # App settings
├── components/            # Reusable UI components
│   ├── ui/               # Base UI components
│   ├── form/             # Form components
│   └── QuestionSelector/ # Prompt selection
├── db/                   # Database layer
│   ├── schema/           # Database schema
│   ├── queries.ts        # Database queries
│   └── mutations.ts      # Database operations
├── hooks/                # Custom React hooks
├── lib/                  # Utility functions
└── constants/            # App constants
```

## 🔧 Development

### Available Scripts

- `npm start` - Start Expo development server
- `npm run android` - Run on Android emulator/device
- `npm run ios` - Run on iOS simulator
- `npm run web` - Run in web browser
- `npm test` - Run Jest tests
- `npm run lint` - Run ESLint

### Database Setup

The app uses SQLite for local data storage. The database schema includes:

- **Journal Entries**: Main memory entries with FSRS scheduling
- **Media Attachments**: Images and files linked to entries
- **Tags**: User-defined categorization system

### Spaced Repetition Implementation

Pensieve uses the **Free Spaced Repetition Scheduler (FSRS)** algorithm:

- **Learning Phase**: Initial reviews (typically 1-3 days apart)
- **Review Phase**: Long-term retention with exponential intervals
- **Difficulty Calculation**: Adaptive scheduling based on performance
- **Lapse Handling**: Reset intervals when memories are forgotten

## 📋 Contributing

We welcome contributions! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/your-feature`
3. **Make your changes** and add tests
4. **Run tests**: `npm test`
5. **Submit a pull request** with a clear description

### Code Style
- Use TypeScript for all new code
- Follow the existing code style and conventions
- Add JSDoc comments for complex functions
- Write tests for new features

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Issues**: [GitHub Issues](https://github.com/your-username/pensieve/issues)
- **Discussions**: [GitHub Discussions](https://github.com/your-username/pensieve/discussions)
- **Documentation**: [Expo Documentation](https://docs.expo.dev/)

## 🔮 Roadmap

### Planned Features
- [ ] Cloud sync and backup
- [ ] Advanced analytics and insights
- [ ] AI-powered memory suggestions
- [ ] Social sharing features
- [ ] Web version
- [ ] Advanced search and filtering

### Play Store Status
- [ ] Privacy Policy implementation
- [ ] App Store assets creation
- [ ] Production build configuration
- [ ] Google Play Store submission

## 👥 Acknowledgments

- Built with **FSRS** algorithm for optimal memory retention
- Powered by **Expo** and **React Native**
- Special thanks to the spaced repetition research community

---

**Transform your memories into lasting knowledge with Pensieve!** 🧠✨
