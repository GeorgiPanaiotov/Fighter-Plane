import { Sprite, Assets, Application, Texture } from "pixi.js";
import { Plane } from "./player/playerTypes";
import {
  diagonalZigzag,
  EnemyPlane,
  verticalOscillation,
  wavyPattern,
} from "./enemyTypes";
import { Projectile } from "./player/projectile";

export class Enemy {
  private maxEnemies: number = 20;
  private delay: number = 10;
  private lastSpawn: number = 0;
  private projectileTexture: Texture;

  public planes: Array<EnemyPlane>;

  constructor(maxEnemies: number, delay: number) {
    this.planes = [];
    this.maxEnemies = maxEnemies;
    this.delay = delay;
  }

  async initTextures(app: Application) {
    this.projectileTexture = await Assets.load(
      "../assets/planes/torpedo/fire_ball_pink.png"
    );

    for (const planeTexture in Plane) {
      const planeTexturePath = Plane[planeTexture as keyof typeof Plane];

      const texture = await Assets.load(planeTexturePath);
      const enemyPlane = new Sprite(texture);
      enemyPlane.scale.set(-0.1, 0.1);
      enemyPlane.visible = false;

      app.stage.addChild(enemyPlane);

      this.planes.push({
        plane: enemyPlane,
        speed: Math.random() * 4.5,
        movePattern: Math.floor(Math.random() * 3),
        projectile: new Projectile(app, this.projectileTexture),
      });
    }
  }

  loadSprites(width: number, height: number) {
    let item = 0;
    for (let i = 0; i < Math.floor(Math.random() * this.maxEnemies); i++) {
      if (item >= 12) {
        item = 0;
      }

      const enemy = this.planes[item].plane;

      enemy.y = (Math.random() * height) / 1.2;
      enemy.x = width;
      item++;
    }
  }

  spawnEnemies(width: number, height: number) {
    const availableEnemy = this.planes.find((enemy) => !enemy.plane.visible);
    if (availableEnemy) {
      availableEnemy.plane.x = width;
      availableEnemy.plane.y = Math.random() * (height / 1.2);
      availableEnemy.plane.visible = true;

      availableEnemy.projectile.reverseSprite();
      availableEnemy.projectile.shoot({
        x: availableEnemy.plane.x,
        y: availableEnemy.plane.y,
      });
    }
  }

  getPosition(enemy: Sprite) {
    return enemy.getBounds();
  }

  killEnemy(enemy: EnemyPlane) {
    enemy.plane.visible = false;
  }

  update(app: Application, deltaTime: number) {
    for (const enemy of this.planes) {
      const { plane, speed, movePattern, projectile } = enemy;
      if (plane.visible) {
        const patternType = movePattern;

        switch (patternType) {
          case 0:
            verticalOscillation(plane, speed, 4, deltaTime);
            break;
          case 1:
            diagonalZigzag(plane, speed, 4, deltaTime);
            break;
          case 2:
            wavyPattern(plane, speed, 6, 0.03, deltaTime);
            break;
        }

        if (plane.x + plane.width < 0) {
          plane.visible = false;
        }
      }
      projectile.update(-10);
      if (!projectile.isActive) {
        projectile.removeProjectile();
      }
    }

    const currentTime = performance.now();
    if (currentTime - this.lastSpawn >= this.delay) {
      this.spawnEnemies(app.screen.width, app.screen.height);
      this.lastSpawn = currentTime;
    }
  }
}
