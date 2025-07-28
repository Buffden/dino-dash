import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef } from 'react';
import { Animated, Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { useScoreContext } from '@/contexts/ScoreContext';

const { width, height } = Dimensions.get('window');

export default function HomeScreen() {
  const router = useRouter();
  const { highestScore, isLoading } = useScoreContext();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Fade in animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();

    // Pulse animation for the start button
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const startGame = () => {
    router.push('/(game)/game');
  };

  const viewTopScores = () => {
    router.push('/(scores)/top-scores');
  };

  const renderDinoIcon = () => (
    <View style={styles.dinoIconContainer}>
      <View style={styles.dinoIcon}>
        <View style={styles.dinoBody} />
        <View style={styles.dinoEye} />
        <View style={styles.dinoLeg} />
      </View>
    </View>
  );

  const renderHighScore = () => (
    <View style={styles.highScoreContainer}>
      <Text style={styles.highScoreIcon}>🏆</Text>
      <View style={styles.highScoreTextContainer}>
        <ThemedText style={styles.highScoreLabel}>High Score</ThemedText>
        <ThemedText style={styles.highScoreValue}>
          {isLoading ? '...' : highestScore.toLocaleString()}
        </ThemedText>
      </View>
    </View>
  );

  const renderInstructions = () => (
    <View style={styles.instructionsContainer}>
      <View style={styles.instructionItem}>
        <Text style={styles.instructionIcon}>👆</Text>
        <ThemedText style={styles.instructionText}>Tap to jump</ThemedText>
      </View>
      <View style={styles.instructionItem}>
        <Text style={styles.instructionIcon}>🌵</Text>
        <ThemedText style={styles.instructionText}>Avoid obstacles</ThemedText>
      </View>
      <View style={styles.instructionItem}>
        <Text style={styles.instructionIcon}>⏱️</Text>
        <ThemedText style={styles.instructionText}>Survive longer</ThemedText>
      </View>
      <View style={styles.instructionItem}>
        <Text style={styles.instructionIcon}>🏆</Text>
        <ThemedText style={styles.instructionText}>Beat your score!</ThemedText>
      </View>
    </View>
  );

  return (
    <LinearGradient
      colors={['#87CEEB', '#98D8E8', '#B0E0E6']}
      style={styles.container}
    >
      <Animated.View
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        {/* Header */}
        <View style={styles.header}>
          {renderDinoIcon()}
          <ThemedText type="title" style={styles.title}>
            Dino Dash
          </ThemedText>
          <ThemedText style={styles.subtitle}>
            Chrome Dino Game Clone
          </ThemedText>
          
          {/* High Score Display */}
          {renderHighScore()}
        </View>

        {/* Instructions */}
        <View style={styles.instructionsSection}>
          <ThemedText type="subtitle" style={styles.instructionsTitle}>
            How to Play
          </ThemedText>
          {renderInstructions()}
        </View>

        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
            <TouchableOpacity style={styles.startButton} onPress={startGame}>
              <LinearGradient
                colors={['#4CAF50', '#45A049']}
                style={styles.buttonGradient}
              >
                <Text style={styles.startButtonText}>Start Game</Text>
                <Text style={styles.startButtonSubtext}>Tap to begin!</Text>
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>

          <TouchableOpacity style={styles.topScoresButton} onPress={viewTopScores}>
            <LinearGradient
              colors={['#FF9800', '#F57C00']}
              style={styles.buttonGradient}
            >
              <Text style={styles.topScoresButtonText}>📊 Top Scores</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <View style={styles.techStack}>
            <View style={styles.techItem}>
              <Text style={styles.techIcon}>⚛️</Text>
              <ThemedText style={styles.techText}>React Native</ThemedText>
            </View>
            <View style={styles.techItem}>
              <Text style={styles.techIcon}>🚀</Text>
              <ThemedText style={styles.techText}>Expo</ThemedText>
            </View>
            <View style={styles.techItem}>
              <Text style={styles.techIcon}>🎮</Text>
              <ThemedText style={styles.techText}>Game Engine</ThemedText>
            </View>
          </View>
        </View>
      </Animated.View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'space-between',
  },
  header: {
    alignItems: 'center',
    marginTop: 60,
  },
  title: {
    fontSize: 42,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#2C3E50',
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  subtitle: {
    fontSize: 18,
    opacity: 0.8,
    color: '#34495E',
    fontWeight: '500',
    marginBottom: 20,
  },
  highScoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  highScoreIcon: {
    fontSize: 24,
    marginRight: 10,
  },
  highScoreTextContainer: {
    alignItems: 'center',
  },
  highScoreLabel: {
    fontSize: 12,
    color: '#2C3E50',
    fontWeight: '600',
    opacity: 0.8,
  },
  highScoreValue: {
    fontSize: 20,
    color: '#2C3E50',
    fontWeight: 'bold',
  },
  instructionsSection: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  instructionsTitle: {
    textAlign: 'center',
    marginBottom: 25,
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2C3E50',
  },
  instructionText: {
    fontSize: 16,
    color: '#34495E',
    fontWeight: '500',
  },
  buttonContainer: {
    gap: 15,
    marginBottom: 40,
  },
  startButton: {
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  topScoresButton: {
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  startButtonText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  topScoresButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  footer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  dinoIconContainer: {
    width: 120,
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 60,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  dinoIcon: {
    width: 80,
    height: 80,
    position: 'relative',
  },
  dinoBody: {
    position: 'absolute',
    bottom: 0,
    left: 20,
    width: 40,
    height: 40,
    backgroundColor: '#4CAF50',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  dinoEye: {
    position: 'absolute',
    top: 8,
    left: 8,
    width: 8,
    height: 8,
    backgroundColor: '#fff',
    borderRadius: 4,
  },
  dinoLeg: {
    position: 'absolute',
    bottom: 0,
    left: 8,
    width: 8,
    height: 16,
    backgroundColor: '#4CAF50',
    borderRadius: 4,
  },
  instructionsContainer: {
    marginTop: 20,
  },
  instructionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  instructionIcon: {
    fontSize: 28,
    marginRight: 15,
    textAlign: 'center',
  },
  buttonGradient: {
    paddingVertical: 18,
    paddingHorizontal: 40,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  startButtonSubtext: {
    color: '#fff',
    fontSize: 14,
    marginTop: 5,
    opacity: 0.9,
  },
  techStack: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    paddingHorizontal: 20,
  },
  techItem: {
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  techIcon: {
    fontSize: 28,
    marginBottom: 8,
  },
  techText: {
    fontSize: 12,
    opacity: 0.8,
    color: '#34495E',
    fontWeight: '500',
  },
}); 