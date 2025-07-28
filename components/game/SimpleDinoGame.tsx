import { useRouter } from 'expo-router';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { useScoreContext } from '@/contexts/ScoreContext';

const { width, height } = Dimensions.get('window');

interface GameState {
  dinoY: number;
  dinoVelocity: number;
  obstacles: { x: number; y: number; width: number; height: number }[];
  score: number;
  gameOver: boolean;
  isJumping: boolean;
  gameStartTime: number;
}

const GRAVITY = 0.8;
const JUMP_VELOCITY = -15;
const GROUND_Y = height - 200;
const DINO_SIZE = 50;
const DINO_WIDTH = 35; // Reduced width for collision detection
const DINO_HEIGHT = 50; // Keep height the same
const OBSTACLE_WIDTH = 30;
const OBSTACLE_HEIGHT = 50;
// Consistent speed for both platforms
const GAME_SPEED = 5;
const TARGET_FPS = 60;
const FRAME_TIME = 1000 / TARGET_FPS;

const SimpleDinoGame: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>({
    dinoY: GROUND_Y,
    dinoVelocity: 0,
    obstacles: [],
    score: 0,
    gameOver: false,
    isJumping: false,
    gameStartTime: Date.now(),
  });

  const animationFrameId = useRef<number | undefined>(undefined);
  const lastTime = useRef<number>(0);
  const router = useRouter();
  const { addScore, getNextTargetScore, topScores } = useScoreContext();

  const jump = useCallback(() => {
    if (!gameState.gameOver && !gameState.isJumping) {
      setGameState(prev => ({
        ...prev,
        dinoVelocity: JUMP_VELOCITY,
        isJumping: true,
      }));
    }
  }, [gameState.gameOver, gameState.isJumping]);

  const resetGame = useCallback(() => {
    setGameState({
      dinoY: GROUND_Y,
      dinoVelocity: 0,
      obstacles: [],
      score: 0,
      gameOver: false,
      isJumping: false,
      gameStartTime: Date.now(),
    });
  }, []);

  const checkCollision = (dinoY: number, obstacles: GameState['obstacles']) => {
    const dinoBounds = {
      left: 50,
      right: 50 + DINO_WIDTH,
      top: dinoY,
      bottom: dinoY + DINO_HEIGHT,
    };

    return obstacles.some(obstacle => {
      const obstacleBounds = {
        left: obstacle.x,
        right: obstacle.x + obstacle.width,
        top: obstacle.y,
        bottom: obstacle.y + obstacle.height,
      };

      return (
        dinoBounds.left < obstacleBounds.right &&
        dinoBounds.right > obstacleBounds.left &&
        dinoBounds.top < obstacleBounds.bottom &&
        dinoBounds.bottom > obstacleBounds.top
      );
    });
  };

  const gameLoop = (currentTime: number) => {
    if (!lastTime.current) lastTime.current = currentTime;
    const deltaTime = currentTime - lastTime.current;
    lastTime.current = currentTime;

    setGameState(prev => {
      if (prev.gameOver) return prev;

      // Normalize physics updates to 60fps
      const timeScale = Math.min(deltaTime / FRAME_TIME, MAX_TIME_SCALE); // Cap at 2x speed to prevent extreme variations

      // Update dino physics
      let newDinoY = prev.dinoY + (prev.dinoVelocity * timeScale);
      let newDinoVelocity = prev.dinoVelocity + (GRAVITY * timeScale);
      let isJumping = prev.isJumping;

      // Ground collision
      if (newDinoY >= GROUND_Y) {
        newDinoY = GROUND_Y;
        newDinoVelocity = 0;
        isJumping = false;
      }

      // Update obstacles
      const newObstacles = prev.obstacles
        .map(obstacle => ({ ...obstacle, x: obstacle.x - (GAME_SPEED * timeScale) }))
        .filter(obstacle => obstacle.x > -OBSTACLE_WIDTH);

      // Spawn new obstacles (normalized to 60fps)
      const spawnChance = 0.02;
      if (Math.random() < (spawnChance * timeScale) && newObstacles.length < 3) {
        newObstacles.push({
          x: width,
          y: GROUND_Y,
          width: OBSTACLE_WIDTH,
          height: OBSTACLE_HEIGHT,
        });
      }

      // Check collision
      const collision = checkCollision(newDinoY, newObstacles);

      // Calculate score based on elapsed time (more consistent across platforms)
      const elapsedTime = Date.now() - prev.gameStartTime;
      const newScore = Math.floor(elapsedTime / 100); // 10 points per second

      // Check if game just ended
      if (collision && !prev.gameOver) {
        // Save score when game ends
        addScore(newScore).catch(error => {
          console.error('Error saving score:', error);
        });
      }

      return {
        ...prev,
        dinoY: newDinoY,
        dinoVelocity: newDinoVelocity,
        obstacles: newObstacles,
        score: newScore,
        gameOver: collision,
        isJumping,
      };
    });

    animationFrameId.current = requestAnimationFrame(gameLoop);
  };

  useEffect(() => {
    animationFrameId.current = requestAnimationFrame(gameLoop);
    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, []);

  const renderDino = () => (
    <View
      style={[
        styles.dinoContainer,
        {
          top: gameState.dinoY,
        },
      ]}
    >
      {/* Tail */}
      <View style={styles.dinoTail} />
      <View style={styles.dinoTailEnd} />
      
      {/* Body */}
      <View style={styles.dinoBody} />
      
      {/* Neck */}
      <View style={styles.dinoNeck} />
      
      {/* Head */}
      <View style={styles.dinoHead} />
      <View style={styles.dinoSnout} />
      
      {/* Eye */}
      <View style={styles.dinoEye} />
      <View style={styles.dinoPupil} />
      
      {/* Legs */}
      <View style={styles.dinoLegFront} />
      <View style={styles.dinoLegBack} />
      
      {/* Arms */}
      <View style={styles.dinoArm} />
      
      {/* Spikes on back */}
      <View style={styles.dinoSpike1} />
      <View style={styles.dinoSpike2} />
      <View style={styles.dinoSpike3} />
    </View>
  );

  const renderObstacles = () =>
    gameState.obstacles.map((obstacle, index) => (
      <View
        key={index}
        style={[
          styles.obstacle,
          {
            left: obstacle.x,
            top: obstacle.y,
            width: obstacle.width,
            height: obstacle.height,
          },
        ]}
      />
    ));

  const renderGround = () => <View style={styles.ground} />;

  const renderBackButton = () => (
    <TouchableOpacity style={styles.topBackButton} onPress={() => router.push('/')}>
      <Text style={styles.topBackButtonText}>← Back</Text>
    </TouchableOpacity>
  );

  const renderScoreDisplay = () => {
    if (gameState.gameOver) return null;

    const targetScore = getNextTargetScore(gameState.score);
    const scoreDifference = targetScore - gameState.score;
    const isBeatingBestScore = gameState.score >= (topScores[0]?.value || 0);
    const isCloseToTarget = scoreDifference > 0 && scoreDifference <= 50;
    
    return (
      <View style={styles.scoreContainer}>
        <View style={styles.currentScoreContainer}>
          <Text style={styles.scoreLabel}>Score</Text>
          <Text style={styles.scoreText}>{gameState.score.toLocaleString()}</Text>
        </View>
        
        <View style={[
          styles.targetScoreContainer,
          isBeatingBestScore && styles.bestScoreContainer,
          isCloseToTarget && styles.closeToTargetContainer
        ]}>
          <Text style={styles.targetLabel}>
            {isBeatingBestScore ? '🎯 Target' : isCloseToTarget ? '🔥 Close!' : 'Next'}
          </Text>
          <Text style={styles.targetText}>{targetScore.toLocaleString()}</Text>
          {scoreDifference > 0 && (
            <Text style={styles.scoreDifference}>
              +{scoreDifference.toLocaleString()}
            </Text>
          )}
        </View>
      </View>
    );
  };

  const renderGameOver = () => (
    <View style={styles.gameOverContainer}>
      <Text style={styles.gameOverText}>Game Over!</Text>
      <Text style={styles.finalScoreText}>Final Score: {gameState.score.toLocaleString()}</Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.restartButton} onPress={resetGame}>
          <Text style={styles.restartButtonText}>🔄 Restart</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.backButton} onPress={() => router.push('/')}>
          <Text style={styles.backButtonText}>🏠 Menu</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.gameArea}>
        {renderBackButton()}
        {renderScoreDisplay()}
        {renderGround()}
        {renderDino()}
        {renderObstacles()}
        
        {gameState.gameOver && renderGameOver()}
      </View>
      
      {/* Separate touch area for jumping that doesn't interfere with UI elements */}
      {!gameState.gameOver && (
        <TouchableOpacity 
          style={styles.jumpArea} 
          onPress={jump} 
          activeOpacity={1}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#87CEEB',
  },
  gameArea: {
    flex: 1,
    position: 'relative',
  },
  dinoContainer: {
    position: 'absolute',
    left: 50,
    width: DINO_WIDTH,
    height: DINO_HEIGHT,
  },
  // Tail
  dinoTail: {
    position: 'absolute',
    bottom: 12,
    left: 2,
    width: 8,
    height: 6,
    backgroundColor: '#2E7D32',
    borderRadius: 3,
  },
  dinoTailEnd: {
    position: 'absolute',
    bottom: 10,
    left: 0,
    width: 4,
    height: 3,
    backgroundColor: '#2E7D32',
    borderRadius: 1.5,
  },
  // Body
  dinoBody: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    width: 20,
    height: 25,
    backgroundColor: '#4CAF50',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  // Neck
  dinoNeck: {
    position: 'absolute',
    bottom: 20,
    left: 22,
    width: 6,
    height: 12,
    backgroundColor: '#4CAF50',
    borderRadius: 3,
  },
  // Head
  dinoHead: {
    position: 'absolute',
    bottom: 28,
    left: 20,
    width: 12,
    height: 12,
    backgroundColor: '#4CAF50',
    borderRadius: 6,
  },
  dinoSnout: {
    position: 'absolute',
    bottom: 30,
    left: 30,
    width: 4,
    height: 4,
    backgroundColor: '#4CAF50',
    borderRadius: 2,
  },
  // Eye
  dinoEye: {
    position: 'absolute',
    bottom: 34,
    left: 26,
    width: 3,
    height: 3,
    backgroundColor: '#fff',
    borderRadius: 1.5,
  },
  dinoPupil: {
    position: 'absolute',
    bottom: 34.5,
    left: 26.5,
    width: 1.5,
    height: 1.5,
    backgroundColor: '#000',
    borderRadius: 0.75,
  },
  // Legs
  dinoLegFront: {
    position: 'absolute',
    bottom: 0,
    left: 12,
    width: 3,
    height: 12,
    backgroundColor: '#2E7D32',
    borderRadius: 1.5,
  },
  dinoLegBack: {
    position: 'absolute',
    bottom: 0,
    left: 18,
    width: 3,
    height: 12,
    backgroundColor: '#2E7D32',
    borderRadius: 1.5,
  },
  // Arm
  dinoArm: {
    position: 'absolute',
    bottom: 18,
    left: 25,
    width: 2,
    height: 5,
    backgroundColor: '#2E7D32',
    borderRadius: 1,
  },
  // Spikes on back
  dinoSpike1: {
    position: 'absolute',
    bottom: 24,
    left: 12,
    width: 1.5,
    height: 5,
    backgroundColor: '#2E7D32',
    borderRadius: 0.75,
  },
  dinoSpike2: {
    position: 'absolute',
    bottom: 26,
    left: 15,
    width: 1.5,
    height: 7,
    backgroundColor: '#2E7D32',
    borderRadius: 0.75,
  },
  dinoSpike3: {
    position: 'absolute',
    bottom: 24,
    left: 18,
    width: 1.5,
    height: 5,
    backgroundColor: '#2E7D32',
    borderRadius: 0.75,
  },
  obstacle: {
    position: 'absolute',
    backgroundColor: '#795548',
    borderRadius: 4,
  },
  ground: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 50,
    backgroundColor: '#8D6E63',
  },
  scoreContainer: {
    position: 'absolute',
    top: 50,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
    paddingHorizontal: 20,
  },
  currentScoreContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    alignItems: 'center',
    minWidth: 80,
  },
  scoreLabel: {
    color: '#fff',
    fontSize: 12,
    opacity: 0.8,
    marginBottom: 2,
  },
  scoreText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  targetScoreContainer: {
    backgroundColor: 'rgba(255, 193, 7, 0.8)',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    alignItems: 'center',
    minWidth: 80,
  },
  targetLabel: {
    color: '#000',
    fontSize: 12,
    opacity: 0.8,
    marginBottom: 2,
  },
  targetText: {
    color: '#000',
    fontSize: 18,
    fontWeight: 'bold',
  },
  bestScoreContainer: {
    backgroundColor: 'rgba(255, 215, 0, 0.9)',
    borderWidth: 2,
    borderColor: '#FFD700',
  },
  scoreDifference: {
    color: '#000',
    fontSize: 10,
    fontWeight: '600',
    marginTop: 2,
    opacity: 0.8,
  },
  closeToTargetContainer: {
    backgroundColor: 'rgba(255, 69, 0, 0.9)',
    borderWidth: 2,
    borderColor: '#FF4500',
  },
  gameOverContainer: {
    position: 'absolute',
    top: height / 2 - 140,
    left: width / 2 - 140,
    width: 280,
    height: 280,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
    padding: 20,
  },
  gameOverText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  finalScoreText: {
    fontSize: 20,
    color: '#fff',
    marginBottom: 20,
    fontWeight: '600',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 20,
    paddingHorizontal: 10,
  },
  restartButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 8,
    flex: 0.48,
    alignItems: 'center',
  },
  restartButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  backButton: {
    backgroundColor: '#FF9800',
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 8,
    flex: 0.48,
    alignItems: 'center',
  },
  backButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  topBackButton: {
    position: 'absolute',
    top: 50,
    left: 10,
    zIndex: 2,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  topBackButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  jumpArea: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 0,
  },
});

export default SimpleDinoGame; 