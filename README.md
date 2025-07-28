# Dino Dash 🦖

A Chrome Dino Game (T-Rex Runner) clone built with React Native and Expo!

## About

Dino Dash is a mobile version of the classic Chrome offline dinosaur game. Features include:
- Tap to jump over obstacles
- Automatic dino running
- Score tracking with top 5 leaderboard
- Game over and restart functionality
- Beautiful UI with animations
- Cross-platform compatibility (iOS, Android, Web)
- Persistent score storage with performance optimizations

## Tech Stack

- **Frontend**: React Native + Expo
- **Game Engine**: Custom game loop with requestAnimationFrame
- **Physics**: Custom collision detection and gravity simulation
- **Storage**: AsyncStorage for persistent score data
- **UI**: Expo Linear Gradient, React Native Animated
- **State Management**: React Context with useReducer
- **Performance**: Caching, lazy loading, and optimization strategies

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Game Features

### 🎮 Core Gameplay
- **Dino Character**: Detailed animated character with physics
- **Obstacles**: Cactus obstacles that spawn randomly
- **Jump Mechanics**: Tap to jump over obstacles with gravity
- **Scoring**: Time-based scoring system (10 points per second)
- **Collision Detection**: Precise AABB collision system
- **Restart**: Easy restart functionality

### 📊 Score Management ✅ **COMPLETED**
- **Top 5 Leaderboard**: Persistent storage of best scores
- **Home Screen Display**: Shows highest score prominently
- **Game Screen Motivation**: Shows current score + next target to beat
- **Top Scores Page**: Dedicated leaderboard view with statistics
- **Cross-Session Persistence**: Scores saved between app sessions
- **Performance Optimized**: Caching, lazy loading, and efficient updates

## Project Structure

```
/dino-dash
  ├── /app                    # Expo Router pages
  │   ├── index.tsx          # Home screen with animations & high score
  │   ├── _layout.tsx        # Navigation setup with ScoreProvider
  │   ├── (game)/game.tsx    # Game route
  │   ├── (scores)/top-scores.tsx # Top scores leaderboard
  │   └── (tabs)/            # Legacy tab structure
  ├── /components            # Reusable components
  │   ├── /game             # Game-specific components
  │   │   ├── SimpleDinoGame.tsx    # Main game component with score integration
  │   │   ├── DinoGame.tsx          # Matter.js version (legacy)
  │   │   ├── Box.tsx              # Entity renderer
  │   │   ├── setupWorld.ts        # Game world setup
  │   │   └── systems.ts           # Game systems
  │   └── /ui                # UI components
  ├── /services             # Business logic services ✅ **IMPLEMENTED**
  │   ├── ScoreService.ts   # Score management service (Repository Pattern)
  │   ├── AsyncStorageService.ts # Data persistence service
  │   └── types.ts          # Score-related type definitions
  ├── /contexts             # State management ✅ **IMPLEMENTED**
  │   └── ScoreContext.tsx  # Score state management (Observer Pattern)
  ├── /hooks               # Custom React hooks
  ├── /types               # TypeScript type definitions
  │   └── matter-js.d.ts   # Matter.js type declarations
  ├── /constants           # App constants
  └── /assets              # Images, fonts, etc.
```

## Design Patterns & Architecture

### 🏗️ Software Design Patterns ✅ **IMPLEMENTED**
- **Repository Pattern**: Score data management and persistence
- **Service Layer Pattern**: Business logic separation
- **State Management Pattern**: Centralized score state with useReducer
- **Observer Pattern**: Real-time score updates across components
- **Strategy Pattern**: Extensible score calculation methods
- **Singleton Pattern**: Performance-optimized service instances

### 🧹 Clean Code Principles ✅ **IMPLEMENTED**
- **Single Responsibility**: Each component/function has one clear purpose
- **Dependency Injection**: Score service injected into components
- **Interface Segregation**: Clear interfaces for score operations
- **Open/Closed Principle**: Extensible for future score features
- **DRY (Don't Repeat Yourself)**: Reusable components and utilities

### 📊 Score Management Architecture ✅ **IMPLEMENTED**
```
ScoreService (Repository Pattern)
├── saveScore(score: number): Promise<void>
├── getTopScores(): Promise<Score[]>
├── getHighestScore(): Promise<number>
├── getNextTargetScore(currentScore: number): Promise<number>
├── isNewHighScore(score: number): Promise<boolean>
└── getScoreStats(): Promise<ScoreStats>

ScoreContext (State Management)
├── topScores: Score[]
├── highestScore: number
├── scoreStats: ScoreStats
├── updateScores(): void
└── addScore(score: number): void

Components (Observer Pattern)
├── HomeScreen: Displays highest score + Top Scores button
├── GameScreen: Shows current + target score
└── TopScoresScreen: Leaderboard view with statistics
```

## Performance Optimizations ✅ **IMPLEMENTED**

### 🚀 Caching Strategy
- **Memory Cache**: 5-minute cache validity for frequently accessed data
- **Lazy Loading**: Scores loaded only when needed
- **Batch Operations**: Parallel data loading for better performance
- **Cache Invalidation**: Automatic cache refresh on data changes

### ⚡ Storage Optimizations
- **Singleton Pattern**: Single service instances to reduce memory usage
- **Efficient Serialization**: Optimized JSON serialization/deserialization
- **Storage Size Monitoring**: Built-in storage size calculation
- **Error Handling**: Graceful fallbacks for storage failures

### 🎯 UI Performance
- **Frame-Rate Independence**: Consistent 60fps gameplay across devices
- **Optimized Re-renders**: useCallback and useMemo for expensive operations
- **Lazy Component Loading**: Components loaded only when needed
- **Animation Optimization**: Native driver for smooth animations

### 📊 Performance Metrics
- **Save Time**: Tracked for score saving operations
- **Load Time**: Tracked for data retrieval operations
- **Cache Hit Rate**: Monitor cache effectiveness
- **Storage Size**: Monitor data storage usage

## Development Roadmap

### ✅ Completed Features
- [x] Core game mechanics with custom physics
- [x] Beautiful home screen with animations
- [x] Cross-platform compatibility
- [x] Game over and restart functionality
- [x] Frame-rate independent timing
- [x] Professional UI/UX design
- [x] **Score management system implementation** ✅
- [x] **Top 5 leaderboard functionality** ✅
- [x] **Persistent score storage** ✅
- [x] **Score motivation features** ✅
- [x] **Performance optimizations** ✅
- [x] **Design patterns implementation** ✅

### 📋 Planned Features
- [ ] Sound effects and music
- [ ] Different obstacle types
- [ ] Power-ups and special abilities
- [ ] Achievement system
- [ ] Social sharing of scores
- [ ] Dark mode support
- [ ] Multiplayer leaderboards
- [ ] Cloud sync for scores

## Score Management Features

### 🏠 Home Screen
- **High Score Display**: Shows the highest score achieved
- **Top Scores Button**: Navigate to leaderboard
- **Real-time Updates**: Score updates automatically when new high scores are achieved

### 🎮 Game Screen
- **Current Score**: Real-time score display during gameplay
- **Target Score**: Shows the next score to beat for motivation
- **Automatic Saving**: Scores saved when game ends
- **Performance Optimized**: Minimal impact on game performance

### 📊 Top Scores Page
- **Leaderboard**: Top 5 scores with rankings and medals
- **Statistics**: Highest, average, and total games played
- **Date Tracking**: When each score was achieved
- **Empty State**: Encourages first-time players
- **Clear Functionality**: Option to reset all scores

### 🔧 Technical Implementation
- **AsyncStorage**: Persistent local storage
- **TypeScript**: Full type safety
- **Error Handling**: Graceful error management
- **Performance Monitoring**: Built-in metrics tracking
- **Cache Management**: Efficient data caching

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.
