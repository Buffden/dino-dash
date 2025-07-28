declare module 'matter-js' {
  export interface Body {
    position: { x: number; y: number };
    velocity: { x: number; y: number };
    angle: number;
    angularVelocity: number;
    mass: number;
    inverseMass: number;
    inertia: number;
    inverseInertia: number;
    restitution: number;
    friction: number;
    frictionAir: number;
    frictionStatic: number;
    isStatic: boolean;
    isSleeping: boolean;
    isSensor: boolean;
    label: string;
    parts: Body[];
    parent: Body;
    bounds: any;
    chamfer: any;
    circleRadius: number;
    collisionFilter: any;
    density: number;
    events: any;
    force: Vector;
    id: number;
    motion: number;
    positionImpulse: Vector;
    render: any;
    sleepThreshold: number;
    slop: number;
    timeScale: number;
    torque: number;
    type: string;
    vertices: Vector[];
  }

  export interface Vector {
    x: number;
    y: number;
  }

  export interface Engine {
    world: World;
    positionIterations: number;
    velocityIterations: number;
    constraintIterations: number;
    enableSleeping: boolean;
    events: any;
    timing: any;
    render: any;
    clear(engine: Engine): Engine;
    update(engine: Engine, delta?: number, correction?: number): Engine;
  }

  export interface World {
    bodies: Body[];
    composites: any[];
    constraints: any[];
    engine: Engine;
    gravity: Vector;
    bounds: any;
    positionIterations: number;
    velocityIterations: number;
    constraintIterations: number;
    enableSleeping: boolean;
    events: any;
    timing: any;
    render: any;
    add(world: World, body: Body | Body[]): World;
    remove(world: World, body: Body | Body[]): World;
    clear(world: World, keepStatic?: boolean): World;
  }

  export const Bodies: {
    rectangle(x: number, y: number, width: number, height: number, options?: any): Body;
    circle(x: number, y: number, radius: number, options?: any): Body;
    polygon(x: number, y: number, sides: number, radius: number, options?: any): Body;
    trapezoid(x: number, y: number, width: number, height: number, slope: number, options?: any): Body;
  };

  export const Body: {
    setVelocity(body: Body, velocity: Vector): void;
    setPosition(body: Body, position: Vector): void;
    setAngle(body: Body, angle: number): void;
    setAngularVelocity(body: Body, velocity: number): void;
    setMass(body: Body, mass: number): void;
    setInertia(body: Body, inertia: number): void;
    setVertices(body: Body, vertices: Vector[]): void;
    setParts(body: Body, parts: Body[], autoHull?: boolean): void;
    setCentre(body: Body, centre: Vector, relative?: boolean): void;
  };

  export const World: {
    add(world: World, body: Body | Body[]): World;
    remove(world: World, body: Body | Body[]): World;
    clear(world: World, keepStatic?: boolean): World;
  };

  export const Engine: {
    create(options?: any): Engine;
    update(engine: Engine, delta?: number, correction?: number): Engine;
    clear(engine: Engine): Engine;
  };

  export const Events: {
    on(object: any, event: string, callback: Function): void;
    off(object: any, event: string, callback: Function): void;
    trigger(object: any, event: string, eventData?: any): void;
  };
} 