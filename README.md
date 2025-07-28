# Dino Dash 🦖

[![React Native](https://img.shields.io/badge/React%20Native-0.79.5-blue.svg)](https://reactnative.dev/)
[![Expo](https://img.shields.io/badge/Expo-50.0.0-black.svg)](https://expo.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-blue.svg)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

> A modern, feature-rich Chrome Dino Game (T-Rex Runner) clone built with React Native, Expo, and TypeScript. Experience the classic game with enhanced graphics, persistent scoring, and cross-platform compatibility.

## ✨ Features

### 🎮 **Core Gameplay**
- **Smooth Physics Engine**: Custom gravity simulation and collision detection
- **Responsive Controls**: Touch-based jumping with haptic feedback
- **Dynamic Obstacles**: Randomly spawning cactus obstacles
- **Frame-Rate Independent**: Consistent 60fps gameplay across all devices
- **Game Over & Restart**: Seamless game restart functionality

### 🏆 **Advanced Scoring System**
- **Top 5 Leaderboard**: Persistent score storage with AsyncStorage
- **Real-time Score Display**: Live score updates during gameplay
- **Target Score System**: Dynamic motivation with next score to beat
- **Score Statistics**: Highest, average, and total games played
- **Cross-Session Persistence**: Scores saved between app sessions

### 🎨 **Beautiful UI/UX**
- **Animated Home Screen**: Smooth fade-in animations and pulse effects
- **Professional Design**: Modern gradients, shadows, and visual feedback
- **Responsive Layout**: Optimized for all screen sizes
- **Interactive Elements**: Back button, score displays, and navigation
- **Visual Progress Indicators**: Score difference and achievement feedback

### ⚡ **Performance Optimizations**
- **Memory Management**: Efficient caching and lazy loading
- **Optimized Rendering**: useCallback and useMemo for expensive operations
- **Storage Optimization**: Singleton patterns and efficient serialization
- **Cross-Platform**: Native performance on iOS, Android, and Web

## 🛠️ Tech Stack

### **Frontend & Framework**
- **React Native 0.79.5**: Cross-platform mobile development
- **Expo 50.0.0**: Development platform and build tools
- **TypeScript 5.8.3**: Type-safe development
- **Expo Router**: File-based navigation system

### **Game Development**
- **Custom Game Engine**: requestAnimationFrame-based game loop
- **Physics Simulation**: Custom gravity and collision detection
- **Matter.js**: Advanced physics for complex interactions
- **React Native Game Engine**: Alternative game engine implementation

### **State Management & Data**
- **React Context**: Global state management with useReducer
- **AsyncStorage**: Persistent local data storage
- **Repository Pattern**: Clean data access layer
- **Service Layer**: Business logic separation

### **UI & Animation**
- **Expo Linear Gradient**: Beautiful gradient backgrounds
- **React Native Animated**: Smooth animations and transitions
- **Custom Components**: Reusable UI components
- **Responsive Design**: Adaptive layouts for all devices

### **Development Tools**
- **ESLint**: Code quality and consistency
- **TypeScript**: Static type checking
- **Expo DevTools**: Development and debugging
- **Performance Monitoring**: Built-in metrics tracking

## 🚀 Quick Start

### **Prerequisites**
- Node.js 18+ 
- npm or yarn
- Expo CLI
- iOS Simulator (macOS) or Android Emulator

### **Installation**

1. **Clone the repository**
   ```bash
   git clone https://github.com/Buffden/dino-dash.git
   cd dino-dash
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Start the development server**
   ```bash
   npx expo start
   ```

4. **Run on your preferred platform**
   - **iOS**: Press `i` or scan QR code with Camera app
   - **Android**: Press `a` or scan QR code with Expo Go
   - **Web**: Press `w` or visit `http://localhost:8081`

### **Development Commands**
```bash
# Start development server
npm start

# Run on specific platform
npm run ios
npm run android
npm run web

# Build for production
expo build:ios
expo build:android

# Clear cache
expo start --clear
```

## 🎮 Game Features Deep Dive

### **Dinosaur Character**
- **Detailed Design**: Multi-component character with body, head, tail, legs, and spikes
- **Responsive Physics**: Realistic jumping mechanics with gravity
- **Collision Optimization**: Precise hitbox detection for smooth gameplay
- **Visual Polish**: Shadows, gradients, and smooth animations

### **Obstacle System**
- **Dynamic Spawning**: Random obstacle generation with configurable parameters
- **Progressive Difficulty**: Obstacles spawn more frequently over time
- **Visual Variety**: Different obstacle types and sizes
- **Performance Optimized**: Efficient rendering and cleanup

### **Scoring & Motivation**
- **Time-Based Scoring**: 10 points per second for consistent progression
- **Target System**: Shows next score to beat for continuous motivation
- **Achievement Feedback**: Visual indicators when close to beating scores
- **Statistics Tracking**: Comprehensive game statistics and analytics

### **User Experience**
- **Intuitive Controls**: Simple tap-to-jump mechanics
- **Visual Feedback**: Score updates, animations, and progress indicators
- **Seamless Navigation**: Easy access to game, scores, and settings
- **Cross-Platform**: Consistent experience across all devices

## 🏗️ Architecture & Design Patterns

### **Software Design Patterns**
- **Repository Pattern**: Clean data access and persistence
- **Service Layer Pattern**: Business logic separation
- **Observer Pattern**: Real-time state updates across components
- **Strategy Pattern**: Extensible score calculation methods
- **Singleton Pattern**: Performance-optimized service instances

### **State Management**
```typescript
// Centralized score state with useReducer
const [state, dispatch] = useReducer(scoreReducer, initialState);

// Actions for state updates
dispatch({ type: 'ADD_SCORE', payload: newScore });
dispatch({ type: 'SET_TOP_SCORES', payload: scores });
```

### **Component Architecture**
```
ScoreProvider (Context)
├── ScoreService (Repository)
│   ├── AsyncStorageService (Persistence)
│   └── Performance Monitoring
├── Game Components
│   ├── SimpleDinoGame (Main Game)
│   ├── ScoreDisplay (UI)
│   └── GameOver (Modal)
└── Navigation Components
    ├── HomeScreen
    ├── TopScoresScreen
    └── GameScreen
```

### **Performance Optimizations**
- **Memory Management**: Efficient caching with 5-minute validity
- **Lazy Loading**: Components loaded only when needed
- **Batch Operations**: Parallel data loading for better performance
- **Frame Rate Independence**: Consistent gameplay across devices

## 📁 Project Structure

```
dino-dash/
├── app/                          # Expo Router pages
│   ├── index.tsx                # Home screen with animations
│   ├── _layout.tsx              # Navigation setup with ScoreProvider
│   ├── (game)/
│   │   └── game.tsx             # Game route
│   ├── (scores)/
│   │   └── top-scores.tsx       # Leaderboard page
│   └── (tabs)/                  # Legacy tab structure
├── components/                   # Reusable components
│   ├── game/                    # Game-specific components
│   │   ├── SimpleDinoGame.tsx   # Main game component
│   │   ├── DinoGame.tsx         # Matter.js version
│   │   ├── Box.tsx              # Entity renderer
│   │   ├── setupWorld.ts        # Game world setup
│   │   └── systems.ts           # Game systems
│   └── ui/                      # UI components
├── services/                     # Business logic services
│   ├── ScoreService.ts          # Score management (Repository Pattern)
│   ├── AsyncStorageService.ts   # Data persistence service
│   └── types.ts                 # Score-related type definitions
├── contexts/                     # State management
│   └── ScoreContext.tsx         # Score state management (Observer Pattern)
├── hooks/                       # Custom React hooks
├── types/                       # TypeScript type definitions
│   └── matter-js.d.ts           # Matter.js type declarations
├── constants/                   # App constants
└── assets/                      # Images, fonts, etc.
```

### **Key Files Explained**
- **`SimpleDinoGame.tsx`**: Main game component with custom physics
- **`ScoreContext.tsx`**: Global state management for scores
- **`ScoreService.ts`**: Business logic for score operations
- **`AsyncStorageService.ts`**: Data persistence layer
- **`app/index.tsx`**: Beautiful home screen with animations

## ⚡ Performance & Optimization

### **Game Performance**
- **60 FPS Target**: Frame-rate independent game loop
- **Optimized Rendering**: Efficient component updates
- **Memory Management**: Proper cleanup and garbage collection
- **Cross-Platform**: Native performance on all devices

### **Data Performance**
- **Caching Strategy**: 5-minute cache validity for frequently accessed data
- **Lazy Loading**: Scores loaded only when needed
- **Batch Operations**: Parallel data loading for better performance
- **Storage Optimization**: Efficient serialization and compression

### **UI Performance**
- **Native Animations**: Hardware-accelerated animations
- **Optimized Re-renders**: useCallback and useMemo for expensive operations
- **Lazy Component Loading**: Components loaded only when needed
- **Responsive Design**: Adaptive layouts for all screen sizes

### **Performance Metrics**
- **Save Time**: Tracked for score saving operations
- **Load Time**: Tracked for data retrieval operations
- **Cache Hit Rate**: Monitor cache effectiveness
- **Storage Size**: Monitor data storage usage

## 🎯 Development Roadmap

### ✅ **Completed Features**
- [x] Core game mechanics with custom physics
- [x] Beautiful home screen with animations
- [x] Cross-platform compatibility
- [x] Game over and restart functionality
- [x] Frame-rate independent timing
- [x] Professional UI/UX design
- [x] Score management system implementation
- [x] Top 5 leaderboard functionality
- [x] Persistent score storage
- [x] Score motivation features
- [x] Performance optimizations
- [x] Design patterns implementation

### 📋 **Planned Features**
- [ ] Sound effects and music
- [ ] Different obstacle types
- [ ] Power-ups and special abilities
- [ ] Achievement system
- [ ] Social sharing of scores
- [ ] Dark mode support
- [ ] Multiplayer leaderboards
- [ ] Cloud sync for scores

## 🤝 Contributing

We welcome contributions! Please read our contributing guidelines.

### **Development Setup**
1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes and test thoroughly
4. Commit your changes: `git commit -m 'feat: add amazing feature'`
5. Push to the branch: `git push origin feature/amazing-feature`
6. Open a Pull Request

### **Code Style**
- Follow TypeScript best practices
- Use ESLint for code quality
- Write meaningful commit messages
- Add tests for new features

### **Branch Strategy**
- `main`: Production-ready code
- `develop`: Integration branch for features
- `feature/*`: Individual feature development
- `hotfix/*`: Critical bug fixes

## 📱 Platform Support

- ✅ **iOS** (iPhone & iPad)
- ✅ **Android** (Phone & Tablet)
- ✅ **Web** (Desktop & Mobile browsers)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🦖 Acknowledgments

- Inspired by Chrome's offline dinosaur game
- Built with React Native and Expo
- Community contributions and feedback

## 📞 Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/Buffden/dino-dash/issues) page
2. Create a new issue with detailed information
3. Join our community discussions

---
