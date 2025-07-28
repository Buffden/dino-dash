import React, { useCallback, useState } from 'react';
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { GameEngine } from 'react-native-game-engine';
import setupWorld, { GameWorld } from './setupWorld';
import {
  collisionSystem,
  inputSystem,
  movementSystem,
  obstacleSystem,
  physicsSystem,
  resetSystem,
  scoringSystem,
} from './systems';

const { width, height } = Dimensions.get('window');

const DinoGame: React.FC = () => {
  const [gameEngine, setGameEngine] = useState<GameEngine | null>(null);
  const [running, setRunning] = useState(true);
  const [gameState, setGameState] = useState<GameWorld>(() => setupWorld());

  const onEvent = useCallback((e: any) => {
    if (e.type === 'game-over') {
      setRunning(false);
    }
  }, []);

  const reset = useCallback(() => {
    const newGameState = setupWorld();
    setGameState(newGameState);
    setRunning(true);
  }, []);

  const renderGameOver = () => (
    <View style={styles.gameOverContainer}>
      <Text style={styles.gameOverText}>Game Over!</Text>
      <TouchableOpacity style={styles.restartButton} onPress={reset}>
        <Text style={styles.restartButtonText}>Restart</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <GameEngine
        ref={(ref) => setGameEngine(ref)}
        style={styles.gameContainer}
        systems={[
          physicsSystem,
          inputSystem,
          obstacleSystem,
          movementSystem,
          collisionSystem,
          scoringSystem,
          resetSystem,
        ]}
        entities={gameState}
        onEvent={onEvent}
        running={running}
      >
        {/* Render all game entities */}
        <gameState.dino.renderer
          body={gameState.dino.body}
          size={gameState.dino.size}
          color={gameState.dino.color}
        />
        <gameState.ground.renderer
          body={gameState.ground.body}
          size={gameState.ground.size}
          color={gameState.ground.color}
        />
        {gameState.obstacles.map((obstacle, index) => (
          <obstacle.renderer
            key={index}
            body={obstacle.body}
            size={obstacle.size}
            color={obstacle.color}
          />
        ))}
      </GameEngine>
      
      {gameState.gameOver && renderGameOver()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#87CEEB', // Sky blue background
  },
  gameContainer: {
    flex: 1,
    position: 'relative',
  },
  scoreContainer: {
    position: 'absolute',
    top: 50,
    left: 20,
    zIndex: 1,
  },
  scoreText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  gameOverContainer: {
    position: 'absolute',
    top: height / 2 - 100,
    left: width / 2 - 100,
    width: 200,
    height: 200,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
  },
  gameOverText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
  },
  restartButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  restartButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default DinoGame; 