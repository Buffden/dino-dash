import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import {
  Animated,
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { useScoreContext } from '@/contexts/ScoreContext';

const { width, height } = Dimensions.get('window');

export default function TopScoresScreen() {
  const router = useRouter();
  const { 
    topScores, 
    highestScore, 
    scoreStats, 
    isLoading, 
    error, 
    refreshScores, 
    clearScores,
    forceRefreshData
  } = useScoreContext();

  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const slideAnim = React.useRef(new Animated.Value(30)).current;

  useEffect(() => {
    // Load fresh data when screen mounts
    refreshScores();
    
    // Animate in
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const formatDate = (timestamp: number): string => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getMedalIcon = (index: number): string => {
    switch (index) {
      case 0: return '🥇';
      case 1: return '🥈';
      case 2: return '🥉';
      default: return '🏆';
    }
  };

  const renderScoreItem = (score: any, index: number) => (
    <Animated.View
      key={score.id}
      style={[
        styles.scoreItem,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      <View style={styles.rankContainer}>
        <Text style={styles.medalIcon}>{getMedalIcon(index)}</Text>
        <Text style={styles.rankText}>#{index + 1}</Text>
      </View>
      
      <View style={styles.scoreDetails}>
        <Text style={styles.scoreValue}>{score.value.toLocaleString()}</Text>
        <Text style={styles.scoreDate}>{formatDate(score.timestamp)}</Text>
      </View>
      
      <View style={styles.scoreBadge}>
        <Text style={styles.scoreBadgeText}>
          {index === 0 ? 'BEST' : `${index + 1}${getOrdinalSuffix(index + 1)}`}
        </Text>
      </View>
    </Animated.View>
  );

  const getOrdinalSuffix = (num: number): string => {
    const j = num % 10;
    const k = num % 100;
    if (j === 1 && k !== 11) return 'ST';
    if (j === 2 && k !== 12) return 'ND';
    if (j === 3 && k !== 13) return 'RD';
    return 'TH';
  };

  const renderStats = () => (
    <View style={styles.statsContainer}>
      <View style={styles.statItem}>
        <Text style={styles.statIcon}>🏆</Text>
        <Text style={styles.statLabel}>Highest</Text>
        <Text style={styles.statValue}>{highestScore.toLocaleString()}</Text>
      </View>
      
      {scoreStats && (
        <>
          <View style={styles.statItem}>
            <Text style={styles.statIcon}>📊</Text>
            <Text style={styles.statLabel}>Average</Text>
            <Text style={styles.statValue}>{scoreStats.averageScore.toLocaleString()}</Text>
          </View>
          
          <View style={styles.statItem}>
            <Text style={styles.statIcon}>🎮</Text>
            <Text style={styles.statLabel}>Games</Text>
            <Text style={styles.statValue}>{scoreStats.totalGames}</Text>
          </View>
        </>
      )}
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyIcon}>🏆</Text>
      <ThemedText style={styles.emptyTitle}>No Scores Yet</ThemedText>
      <ThemedText style={styles.emptySubtitle}>
        Play your first game to see your scores here!
      </ThemedText>
      <TouchableOpacity 
        style={styles.playButton} 
        onPress={() => router.push('/(game)/game')}
      >
        <Text style={styles.playButtonText}>Start Playing</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <LinearGradient
      colors={['#667eea', '#764ba2']}
      style={styles.container}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => router.back()}
        >
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        
        <ThemedText type="title" style={styles.title}>
          Top Scores
        </ThemedText>
        
        <TouchableOpacity 
          style={styles.refreshButton} 
          onPress={refreshScores}
          disabled={isLoading}
        >
          <Text style={styles.refreshButtonText}>
            {isLoading ? '⏳' : '🔄'}
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>⚠️ {error}</Text>
          </View>
        )}

        {/* Stats Section */}
        {!isLoading && renderStats()}

        {/* Scores Section */}
        <View style={styles.scoresSection}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            Leaderboard
          </ThemedText>
          
          {isLoading ? (
            <View style={styles.loadingContainer}>
              <Text style={styles.loadingText}>Loading scores...</Text>
            </View>
          ) : topScores.length > 0 ? (
            <View style={styles.scoresList}>
              {topScores.map((score, index) => renderScoreItem(score, index))}
            </View>
          ) : (
            renderEmptyState()
          )}
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity 
            style={styles.debugButton} 
            onPress={forceRefreshData}
          >
            <Text style={styles.debugButtonText}>🔧 Debug Refresh</Text>
          </TouchableOpacity>
          
          {topScores.length > 0 && (
            <TouchableOpacity 
              style={styles.clearButton} 
              onPress={clearScores}
            >
              <Text style={styles.clearButtonText}>🗑️ Clear All</Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  backButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  refreshButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  refreshButtonText: {
    fontSize: 18,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  errorContainer: {
    backgroundColor: 'rgba(255, 0, 0, 0.1)',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 0, 0, 0.3)',
  },
  errorText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 15,
    padding: 20,
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  statItem: {
    alignItems: 'center',
  },
  statIcon: {
    fontSize: 24,
    marginBottom: 5,
  },
  statLabel: {
    color: '#fff',
    fontSize: 12,
    opacity: 0.8,
    marginBottom: 2,
  },
  statValue: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  scoresSection: {
    marginBottom: 30,
  },
  sectionTitle: {
    textAlign: 'center',
    marginBottom: 20,
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  loadingContainer: {
    alignItems: 'center',
    padding: 40,
  },
  loadingText: {
    color: '#fff',
    fontSize: 18,
    opacity: 0.8,
  },
  scoresList: {
    gap: 15,
  },
  scoreItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 15,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  rankContainer: {
    alignItems: 'center',
    marginRight: 20,
  },
  medalIcon: {
    fontSize: 32,
    marginBottom: 5,
  },
  rankText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    opacity: 0.8,
  },
  scoreDetails: {
    flex: 1,
  },
  scoreValue: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  scoreDate: {
    color: '#fff',
    fontSize: 14,
    opacity: 0.7,
  },
  scoreBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  scoreBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  emptyContainer: {
    alignItems: 'center',
    padding: 40,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#fff',
    opacity: 0.8,
    textAlign: 'center',
    marginBottom: 30,
  },
  playButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  playButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  actionButtons: {
    alignItems: 'center',
    gap: 10,
  },
  debugButton: {
    backgroundColor: 'rgba(255, 165, 0, 0.2)',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 165, 0, 0.3)',
  },
  debugButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  clearButton: {
    backgroundColor: 'rgba(255, 0, 0, 0.2)',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 0, 0, 0.3)',
  },
  clearButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
}); 