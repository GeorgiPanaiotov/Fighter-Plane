import { Application, Rectangle, Sprite, Assets } from "pixi.js";
import { Background } from "../background";
import { Explosion } from "../animations/explosion";
import { Cloud } from "../clouds";
import { Player } from "../player/player";
import { Plane } from "../player/playerTypes";
import { Enemy } from "../enemy";
import { UI } from "../ui/ui";
import { STORAGE_KEY } from "./engineTypes";

export class Engine {
  private width = window.innerWidth;
  private height = window.innerHeight;
  private app: Application;
  private explosion: Explosion;
  private background: { bgSprite2: Background; bgSprite3: Background } = {};
  private clouds: Cloud;
  private player: Player;
  private enemy: Enemy;
  private ui: UI;
  private currentFrame: number = 0;
  private animating: boolean = false;
  private finalScore: number = 0;
  private bestScore: number = 0;

  constructor() {
    this.app = new Application();
    this.explosion = new Explosion();
    this.clouds = new Cloud();
    this.player = new Player(this.getWidth());
    this.enemy = new Enemy(50, 500);
    this.bestScore = this.loadGame();
  }

  saveGame() {
    try {
      const jsonData = JSON.stringify({ score: this.finalScore });
      localStorage.setItem(STORAGE_KEY, jsonData);
      console.log("Game saved successfully.");
    } catch (error) {
      console.error("Failed to save game data:", error);
    }
  }

  loadGame() {
    try {
      const savedData = localStorage.getItem(STORAGE_KEY);
      if (savedData) {
        const data: { score: number } = JSON.parse(savedData);
        console.log("Game loaded successfully.");
        return data.score;
      } else {
        console.log("No saved data found.");
        return 0;
      }
    } catch (error) {
      console.error("Failed to load game data:", error);
      return 0;
    }
  }

  getApp() {
    return this.app;
  }

  getWidth() {
    return this.width;
  }

  getHeight() {
    return this.height;
  }

  async init() {
    await this.getApp().init({ width: this.width, height: this.height });
    this.getApp().canvas.style.position = "absolute";
    document.body.appendChild(this.getApp().canvas);
  }

  async initTextures() {
    const uiTexture = await Assets.load({
      alias: "menu",
      src: "./assets/ui/panel.png",
    });

    const bgSprite = new Background("./assets/background/background1.png");
    const bgSprite2 = new Background("./assets/background/background2.png");
    const bgSprite3 = new Background("./assets/background/background3.png");

    await bgSprite.loadSprite(this.getApp(), this.getWidth(), this.getHeight());
    await bgSprite2.loadSprite(
      this.getApp(),
      this.getWidth() * 2,
      this.getHeight()
    );
    await bgSprite3.loadSprite(
      this.getApp(),
      this.getWidth() * 2,
      this.getHeight()
    );

    await this.clouds.load();
    this.clouds.randomizeAndStage(20, this.getApp());

    this.background = { bgSprite2, bgSprite3 };

    await this.explosion.loadTextures(this.getApp());

    await this.player.initTextures(this.getApp(), Plane.RMig);

    await this.enemy.initTextures(this.getApp());
    this.enemy.loadSprites(this.getWidth(), this.getHeight());

    this.ui = new UI(new Sprite(uiTexture), this.getApp());
    this.ui.renderMainMenu(this.getWidth(), this.getHeight(), this.getApp());
  }

  startExplosion(position: Rectangle) {
    this.animating = true;
    this.explosion.animation.forEach((pos) => {
      pos.x = position.x;
      pos.y = position.y;
    });
    this.explosion.playSound();
  }

  drawExplosion() {
    if (this.animating) {
      const frame = this.explosion.animation[Math.floor(this.currentFrame)];
      this.currentFrame += 0.2;
      frame.visible = true;

      if (this.currentFrame >= this.explosion.animation.length) {
        this.currentFrame = 0;
        frame.visible = false;
        this.animating = false;
        this.explosion.animation.forEach((x) => (x.visible = false));
      }
    }
  }

  checkCollision(rect1: Rectangle, rect2: Rectangle) {
    return (
      rect1.x < rect2.x + rect2.width &&
      rect1.x + rect1.width > rect2.x &&
      rect1.y < rect2.y + rect2.height &&
      rect1.y + rect1.height > rect2.y
    );
  }

  update(deltaTime: number) {
    if (this.ui.startGame) {
      this.ui.removeMenu();
      if (!this.player.isDead) {
        this.player.spawnPlayer();
      }
      const { bgSprite2, bgSprite3 } = this.background;
      bgSprite2.update(-1.0);
      bgSprite3.update(-2.0);

      this.clouds.update(this.getApp());
      this.enemy.update(this.getApp(), deltaTime);

      this.player.update(this.getApp(), this.getWidth(), this.getHeight());
      this.enemy.planes.forEach((enemyPlane) => {
        if (enemyPlane.plane.visible) {
          // Player VS Enemy and Enemy Shot VS Player
          if (
            this.checkCollision(
              this.player.getPosition(),
              this.enemy.getPosition(enemyPlane.plane)
            ) ||
            this.checkCollision(
              enemyPlane.projectile.getPosition(),
              this.player.getPosition()
            )
          ) {
            this.startExplosion(this.player.getPosition());
            this.player.killPlayer();
            this.enemy.killEnemy(enemyPlane);
            this.ui.startGame = false;

            this.ui.renderDeathMenu(
              this.finalScore,
              this.finalScore >= this.bestScore
                ? this.finalScore
                : this.bestScore
            );
            if (this.finalScore >= this.bestScore) {
              this.saveGame();
            }
          }
          // Player shot VS Enemy
          this.player.projectiles.forEach((projectile) => {
            if (
              this.checkCollision(
                projectile.getPosition(),
                this.enemy.getPosition(enemyPlane.plane)
              )
            ) {
              this.finalScore++;
              this.enemy.killEnemy(enemyPlane);
              this.startExplosion(projectile.getPosition());
              projectile.removeProjectile();
            }
          });
        }
      });

      this.drawExplosion();
    }
  }
}
