import { Boid } from "./boids";

export interface Point {
  x: number;
  y: number;
}

export interface Circle {
  center: Point;
  radius: number;
}

export function isPointInCircle(circle: Circle, point: Point): boolean {
  const distance = Math.sqrt(
    (point.x - circle.center.x) ** 2 + (point.y - circle.center.y) ** 2
  );
  return distance <= circle.radius;
}

export function getRespawnPoint(maxHeight: number, maxWidth: number): Point {
  const randomHeight: number = Phaser.Math.Between(0, maxHeight)
  const randomWidth: number = Phaser.Math.Between(0, maxWidth)

  const res = { x: randomWidth, y: randomHeight }

  if (Math.random() >= 0.5) {
    res.x = 0
  } else {
    res.y = 0
  }

  return res
}



// Helper function to generate random numbers with a normal distribution
export function brownianMotionRandomNormal(): number {
  let u = 0, v = 0;
  while (u === 0) u = Math.random(); // Converting [0,1) to (0,1)
  while (v === 0) v = Math.random();
  return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
}



export const checkIfPointIsOutOfBounds = (screep: Boid, bounds: { width: number, height: number }): boolean => {

  if (screep.x >= bounds.width || screep.y >= bounds.height || screep.x <= 0 || screep.y <= 0) {
    return true
  }
  return false
}

export function vectorMinusVector(v1: number[], v2: number[], v3: number[]): number[] {
  return [v1[0] - v2[0] - v3[0], v1[1] - v2[1] - v3[1], v1[2] - v2[2] - v3[2]];
}

export function scaleToLength(vec: number[], length: number): number[] {
  const vecLength = Math.sqrt(vec[0] ** 2 + vec[1] ** 2); // Berechne die Länge des Vektors
  if (vecLength !== 0) { // Prüfe, ob der Vektor nicht der Nullvektor ist
    vec[0] *= length / vecLength; // Skaliere den Vektor in x-Richtung
    vec[1] *= length / vecLength; // Skaliere den Vektor in y-Richtung
  }
  return vec
}

export const clampForce = (force: Phaser.Math.Vector2, maxForce: number): Phaser.Math.Vector2 => {
  if (force.length() > 0 && force.length() < maxForce) {
    // force.scale_to_length(self.max_force)
    force.scale(maxForce)
  }
  return force
}

export function uniform(a: number, b: number): number {
  return Math.random() * (b - a) + a;
}

export function generateRandomPointOnRectangleEdge(width: number, height: number): Point {
  // Zufällig eine der vier Kanten auswählen
  const edge = Math.floor(Math.random() * 4);

  // Zufällige Position auf der ausgewählten Kante generieren
  let x: number, y: number;
  switch (edge) {
    case 0: // Obere Kante
      x = Math.random() * width;
      y = 5;
      break;
    case 1: // Rechte Kante
      x = width - 5;
      y = Math.random() * height;
      break;
    case 2: // Untere Kante
      x = Math.random() * width;
      y = height - 5;
      break;
    case 3: // Linke Kante
      x = 5;
      y = Math.random() * height;
      break;
    default:
      throw new Error('Ungültige Kante');
  }

  return {
    x: x,
    y: y
  }
}