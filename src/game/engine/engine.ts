import { Application, Sprite } from "pixi.js";
import { Background } from "../background";
import { Explosion } from "../animations/explosion";
import { Cloud } from "../clouds";
import { Player } from "../player/player";
import { Plane } from "../player/playerTypes";
import { Enemy } from "../enemy";

export class Engine {
  private width = window.innerWidth;
  private height = window.innerHeight;
  private app: Application;
  private explosion: Explosion;
  private explosionSprite: Sprite;
  private background: { bgSprite2: Background; bgSprite3: Background } = {};
  private clouds: Cloud;
  private player: Player;
  private enemy: Enemy;

  public currentFrame: number = 0;
  public animating: boolean = false;

  constructor() {
    this.app = new Application();
    this.explosion = new Explosion();
    this.explosionSprite = new Sprite();
    this.clouds = new Cloud();
    this.player = new Player(this.getWidth());
    this.enemy = new Enemy(15, 2000);
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
  }

  startExplosion() {
    this.explosionSprite = this.explosion.animation[0];
    this.explosionSprite.visible = true;
    this.animating = true;
  }

  drawExplosion() {
    if (this.animating) {
      this.currentFrame += 0.2;

      if (this.currentFrame >= this.explosion.animation.length) {
        this.explosionSprite.visible = false;
        this.animating = false;
      } else {
        this.explosionSprite =
          this.explosion.animation[Math.floor(this.currentFrame)];
      }
    }
  }

  update(deltaTime: number) {
    const { bgSprite2, bgSprite3 } = this.background;
    bgSprite2.update(-1.0);
    bgSprite3.update(-2.0);

    this.drawExplosion();

    this.clouds.update(this.getApp());
    this.enemy.update(this.getApp(), deltaTime);

    this.player.update(this.getApp(), this.getWidth(), this.getHeight());
  }
}
