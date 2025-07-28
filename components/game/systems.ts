import Matter from 'matter-js';
import { GameEntity, GameWorld } from './setupWorld';

// Physics system - updates the physics engine
export const physicsSystem = (entities: GameWorld, { time }: { time: { delta: number } }) => {
  const { engine } = entities.physics;
  Matter.Engine.update(engine, time.delta);
  return entities;
};

// Input system - handles touch input for jumping
export const inputSystem = (entities: GameWorld, { touches }: { touches: any[] }) => {
  const { dino } = entities;
  
  touches.filter(t => t.type === 'press').forEach(() => {
    if (!entities.gameOver) {
      // Jump only if dino is on ground
      if (dino.body.position.y >= 350) {
        Matter.Body.setVelocity(dino.body, { x: 0, y: -15 });
      }
    }
  });
  
  return entities;
};

// Obstacle spawning system
export const obstacleSystem = (entities: GameWorld, { time }: { time: { delta: number } }) => {
  if (entities.gameOver) return entities;
  
  // Spawn obstacle every 2 seconds
  if (Math.random() < 0.02) {
    const obstacle = Matter.Bodies.rectangle(400, 350, 30, 50, {
      label: 'obstacle',
      isStatic: false,
    });
    
    Matter.World.add(entities.physics.world, obstacle);
    
    const newObstacle: GameEntity = {
      body: obstacle,
      size: [30, 50],
      color: '#795548',
      renderer: require('./Box').default,
    };
    
    entities.obstacles.push(newObstacle);
  }
  
  return entities;
};

// Movement system - moves obstacles left
export const movementSystem = (entities: GameWorld) => {
  if (entities.gameOver) return entities;
  
  entities.obstacles.forEach((obstacle, index) => {
    Matter.Body.setPosition(obstacle.body, {
      x: obstacle.body.position.x - 3,
      y: obstacle.body.position.y,
    });
    
    // Remove obstacles that are off screen
    if (obstacle.body.position.x < -50) {
      Matter.World.remove(entities.physics.world, obstacle.body);
      entities.obstacles.splice(index, 1);
    }
  });
  
  return entities;
};

// Collision detection system
export const collisionSystem = (entities: GameWorld) => {
  if (entities.gameOver) return entities;
  
  const { dino } = entities;
  
  entities.obstacles.forEach((obstacle) => {
    const dinoBounds = {
      left: dino.body.position.x - dino.size[0] / 2,
      right: dino.body.position.x + dino.size[0] / 2,
      top: dino.body.position.y - dino.size[1] / 2,
      bottom: dino.body.position.y + dino.size[1] / 2,
    };
    
    const obstacleBounds = {
      left: obstacle.body.position.x - obstacle.size[0] / 2,
      right: obstacle.body.position.x + obstacle.size[0] / 2,
      top: obstacle.body.position.y - obstacle.size[1] / 2,
      bottom: obstacle.body.position.y + obstacle.size[1] / 2,
    };
    
    // Check collision
    if (
      dinoBounds.left < obstacleBounds.right &&
      dinoBounds.right > obstacleBounds.left &&
      dinoBounds.top < obstacleBounds.bottom &&
      dinoBounds.bottom > obstacleBounds.top
    ) {
      entities.gameOver = true;
    }
  });
  
  return entities;
};

// Scoring system
export const scoringSystem = (entities: GameWorld, { time }: { time: { delta: number } }) => {
  if (!entities.gameOver) {
    entities.score += Math.floor(time.delta / 16); // Increment score based on time
  }
  
  return entities;
};

// Reset system for restarting the game
export const resetSystem = (entities: GameWorld, { touches }: { touches: any[] }) => {
  if (entities.gameOver) {
    touches.filter(t => t.type === 'press').forEach(() => {
      // Reset game state
      entities.gameOver = false;
      entities.score = 0;
      
      // Reset dino position
      Matter.Body.setPosition(entities.dino.body, { x: 50, y: 300 });
      Matter.Body.setVelocity(entities.dino.body, { x: 0, y: 0 });
      
      // Remove all obstacles
      entities.obstacles.forEach(obstacle => {
        Matter.World.remove(entities.physics.world, obstacle.body);
      });
      entities.obstacles = [];
    });
  }
  
  return entities;
}; 