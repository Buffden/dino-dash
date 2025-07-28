import Matter from 'matter-js';
import Box from './Box';

export interface GameEntity {
  body: Matter.Body;
  size: [number, number];
  color: string;
  renderer: React.ComponentType<any>;
}

export interface GameWorld {
  physics: {
    engine: Matter.Engine;
    world: Matter.World;
  };
  dino: GameEntity;
  ground: GameEntity;
  obstacles: GameEntity[];
  score: number;
  gameOver: boolean;
}

export default function setupWorld(): GameWorld {
  const engine = Matter.Engine.create({ enableSleeping: false });
  const world = engine.world;

  // Create dino (player character)
  const dino = Matter.Bodies.rectangle(50, 300, 50, 50, {
    label: 'dino',
    restitution: 0.2,
  });

  // Create ground
  const ground = Matter.Bodies.rectangle(200, 400, 400, 50, {
    isStatic: true,
    label: 'ground',
  });

  // Add bodies to world
  Matter.World.add(world, [dino, ground]);

  return {
    physics: { engine, world },
    dino: {
      body: dino,
      size: [50, 50],
      color: '#4CAF50',
      renderer: Box,
    },
    ground: {
      body: ground,
      size: [400, 50],
      color: '#8D6E63',
      renderer: Box,
    },
    obstacles: [],
    score: 0,
    gameOver: false,
  };
} 