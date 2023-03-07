import { Point, checkIfPointIsOutOfBounds, generateRandomPointOnRectangleEdge } from "./utils";

export class Boid extends Phaser.GameObjects.Sprite {
  public boids: Boid[] = [];
  private maxVelocity: number;
  private maxForce: number;
  private perceptionRadius: number;
  private alignmentFactor: number;
  private cohesionFactor: number;
  private separationFactor: number;
  private spawnAngle: number;
  private velocity: Phaser.Math.Vector2
  private acceleration: Phaser.Math.Vector2

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 'boid_image');
    scene.add.existing(this);
    this.maxVelocity = 100;
    this.maxForce = 10;
    this.perceptionRadius = 50;
    this.alignmentFactor = 1;
    this.cohesionFactor = 1;
    this.separationFactor = 1.2;
    this.spawnAngle = Phaser.Math.Between(0, 360);
    this.setScale(0.15)
    // Set boid's initial velocity and acceleration
    this.velocity = new Phaser.Math.Vector2(0, 0);
    this.acceleration = new Phaser.Math.Vector2(0, 0);
    this.velocity.setToPolar(this.spawnAngle, this.maxVelocity);
  }

  public move() {
    // Apply boids rules to steer boid's movement
    const alignment = this.align();
    const cohesion = this.cohere();
    const separation = this.separate();
    this.acceleration.add(alignment);
    this.acceleration.add(cohesion);
    this.acceleration.add(separation);

    // Limit acceleration to maximum force
    this.acceleration.limit(this.maxForce);

    // Update velocity and limit to maximum velocity
    this.velocity.add(this.acceleration);
    this.velocity.limit(this.maxVelocity);

    this.rotation = Phaser.Math.Angle.BetweenPoints(
      (new Phaser.Math.Vector2(this.x, this.y)).clone().add(this.velocity.clone().normalize().scale(10)),
      (new Phaser.Math.Vector2(this.x, this.y))
    ) + Math.PI;

    // Apply velocity to position and reset acceleration
    this.x += this.velocity.x / this.scene.game.loop.actualFps; // assuming 60 FPS
    this.y += this.velocity.y / this.scene.game.loop.actualFps;
    this.acceleration.setTo(0, 0);

    if (checkIfPointIsOutOfBounds(this, { width: (this.scene.game.config.width as number), height: (this.scene.game.config.height as number) })) {

      const newPoint: Point = generateRandomPointOnRectangleEdge((this.scene.game.config.width as number), (this.scene.game.config.height as number))
      this.x = newPoint.x
      this.y = newPoint.y
    }
  }

  private align() {
    const steering = new Phaser.Math.Vector2(0, 0);
    let total = 0;
    for (const other of this.boids) {
      if (other !== this && Phaser.Math.Distance.Between(this.x, this.y, other.x, other.y) < this.perceptionRadius) {
        steering.add(other.velocity);
        total++;
      }
    }
    if (total > 0) {
      steering.x = steering.x / total;
      steering.y = steering.y / total;
      steering.normalize();
      steering.scale(this.maxVelocity);
      steering.subtract(this.velocity);
      steering.limit(this.maxForce);
      steering.scale(this.alignmentFactor);
    }
    return steering;
  }

  private cohere() {
    const steering = new Phaser.Math.Vector2(0, 0);
    let total = 0;
    for (const other of this.boids) {
      if (other !== this && Phaser.Math.Distance.Between(this.x, this.y, other.x, other.y) < this.perceptionRadius) {
        steering.add(new Phaser.Math.Vector2(other.x, other.y));
        total++;
      }
    }
    if (total > 0) {
      steering.x = steering.x / total;
      steering.y = steering.y / total;
      steering.subtract(new Phaser.Math.Vector2(this.x, this.y));
      steering.normalize();
      steering.scale(this.maxVelocity);
      steering.subtract(this.velocity);
      steering.limit(this.maxForce);
      steering.scale(this.cohesionFactor);
    }
    return steering;
  }

  private separate() {
    const steering = new Phaser.Math.Vector2(0, 0);
    let total = 0;
    for (const other of this.boids) {
      if (other !== this && Phaser.Math.Distance.Between(this.x, this.y, other.x, other.y) < this.perceptionRadius) {
        const difference = (new Phaser.Math.Vector2(this.x, this.y)).clone().subtract(new Phaser.Math.Vector2(other.x, other.y));
        difference.normalize();
        const distanceTo: number = Phaser.Math.Distance.Between(this.x, this.y, other.x, other.y)
        difference.x = difference.x / distanceTo
        difference.y = difference.y / distanceTo
        steering.add(difference);
        total++;
      }
    }
    if (total > 0) {
      steering.x = steering.x / total;
      steering.y = steering.y / total;
      steering.normalize();
      steering.scale(this.maxVelocity);
      steering.subtract(this.velocity);
      steering.limit(this.maxForce);
      steering.scale(this.separationFactor);
    }
    return steering;
  }
}