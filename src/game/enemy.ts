import { Sprite, Assets, Application } from "pixi.js";
import { Plane } from "./player/playerTypes";
import { EnemyPlane } from "./enemyTypes";

export class Enemy {
  private maxEnemies: number = 20;
  private delay: number = 10;
  private lastSpawn: number = 0;

  public isAlive: boolean;
  public planes: Array<EnemyPlane>;

  constructor(maxEnemies: number, delay: number) {
    this.planes = [];
    this.isAlive = true;
    this.maxEnemies = maxEnemies;
    this.delay = delay;
  }

  async initTextures(app: Application) {
    for (const planeTexture in Plane) {
      const planeTexturePath = Plane[planeTexture as keyof typeof Plane];

      const texture = await Assets.load(planeTexturePath);
      const enemyPlane = new Sprite(texture);
      enemyPlane.scale.set(-0.1, 0.1);
      enemyPlane.visible = false;

      app.stage.addChild(enemyPlane);

      this.planes.push({ plane: enemyPlane, speed: Math.random() * 2.5 });
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
    }
  }

  update(app: Application, deltaTime: number) {
    for (const enemy of this.planes) {
      const { plane, speed } = enemy;
      if (plane.visible) {
        plane.x -= speed * deltaTime;

        if (plane.x + plane.width < 0) {
          plane.visible = false;
        }
      }
    }

    const currentTime = performance.now();
    if (currentTime - this.lastSpawn >= this.delay) {
      this.spawnEnemies(app.screen.width, app.screen.height);
      this.lastSpawn = currentTime;
    }
  }
}
