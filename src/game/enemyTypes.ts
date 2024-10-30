import { Sprite } from "pixi.js";
import { Projectile } from "./player/projectile";

export type EnemyPlane = {
  speed: number;
  movePattern: number;
  plane: Sprite;
  projectile: Projectile;
};

export const verticalOscillation = (
  enemy: Sprite,
  speed: number,
  amplitude: number,
  deltaTime: number
) => {
  enemy.y += Math.sin(enemy.x * 0.05) * amplitude * deltaTime;
  enemy.x -= speed * deltaTime;
};

export const diagonalZigzag = (
  enemy: Sprite,
  speed: number,
  zigzagAmount: number,
  deltaTime: number
) => {
  enemy.y += Math.sin(enemy.x * 0.1) * zigzagAmount * deltaTime;
  enemy.x -= speed * deltaTime;
};

export const wavyPattern = (
  enemy: Sprite,
  speed: number,
  amplitude: number,
  frequency: number,
  deltaTime: number
) => {
  enemy.y += Math.sin(enemy.x * frequency) * amplitude * deltaTime;
  enemy.x -= speed * deltaTime;
};
