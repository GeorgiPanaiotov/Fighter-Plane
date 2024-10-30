import { Application, Sprite, Assets, Texture } from "pixi.js";
import { Plane, PlayerPosition } from "./playerTypes";
import { Projectile } from "./projectile";

export class Player {
  private speed: number = 10;
  private bombTexture: Texture;
  private booster: Sprite = new Sprite();
  private player: Sprite = new Sprite();
  private keys: { [key: string]: boolean } = {};
  private engineSound: HTMLAudioElement;
  private speedUpSound: HTMLAudioElement;
  private projectileTexture: Texture;
  private shootSound: HTMLAudioElement;
  private lastShot: number = 0;
  private bombLastShot: number = 0;
  private bombDelay: number = 2000;
  private delay: number = 400;

  public bombs: number = 10;
  public isDead: boolean = false;
  public projectiles: Array<Projectile> = [];
  public bomb: Projectile;
  public playSound: boolean = true;

  constructor() {
    this.engineSound = new Audio("../../assets/sounds/airplane_fly.ogg");
    this.engineSound.loop = true;

    this.speedUpSound = new Audio("../../assets/sounds/airplane_speedup.wav");
    this.speedUpSound.loop = true;

    this.shootSound = new Audio("../../assets/sounds/shoot.mp3");
    this.shootSound.loop = true;

    window.addEventListener("keydown", (e) => {
      this.keys[e.code] = true;
    });

    window.addEventListener("keyup", (e) => {
      this.keys[e.code] = false;
      this.player.rotation = Math.PI / 360;

      this.booster.visible = false;
      this.speedUpSound.pause();
      this.shootSound.pause();
    });
  }

  killPlayer() {
    this.player.visible = false;
    this.isDead = true;
  }

  getPosition() {
    return this.player.getBounds();
  }

  async initTextures(app: Application, texture: Plane) {
    const playerTexture = await Assets.load(texture);
    const boosterTexture = await Assets.load(
      "../../assets/planes/torpedo/booster.png"
    );

    this.player.texture = playerTexture;
    this.player.scale.set(0.1, 0.1);
    this.player.visible = false;

    this.booster.texture = boosterTexture;
    this.booster.scale.set(0.3, 0.3);
    this.booster.visible = false;

    this.projectileTexture = await Assets.load(
      "../../assets/planes/torpedo/fire_ball_1.png"
    );
    this.bombTexture = await Assets.load(
      "../../assets/planes/torpedo/torpedo_black.png"
    );

    app.stage.addChild(this.player, this.booster);
  }

  spawnPlayer() {
    this.player.visible = true;
  }

  handleInput(app: Application) {
    if (this.keys["ArrowUp"]) {
      this.player.y -= this.speed;
      this.player.rotation = -15 * (Math.PI / 180);
    }
    if (this.keys["ArrowDown"]) {
      this.player.y += this.speed;
      this.player.rotation = 15 * (Math.PI / 180);
    }
    if (this.keys["ArrowLeft"]) {
      this.player.x -= this.speed;
    }
    if (this.keys["ArrowRight"]) {
      this.player.x += this.speed;
      this.addBoosterEffect({ x: this.player.x, y: this.player.y });
      if (this.playSound) {
        this.speedUpSound.play();
      }
    }
    if (this.keys["Space"]) {
      const currentTime = performance.now();
      if (currentTime - this.lastShot >= this.delay) {
        this.lastShot = currentTime;
        const projectile = new Projectile(app, this.projectileTexture);
        projectile.shoot({
          x: this.player.x + this.player.width,
          y: this.player.y + this.player.height / 2,
        });
        this.projectiles.push(projectile);
        if (this.playSound) {
          this.shootSound.play();
        }
      }
    }
    if (this.keys["KeyB"]) {
      if (this.bombs >= 1) {
        const currentTime = performance.now();
        if (currentTime - this.bombLastShot >= this.bombDelay) {
          this.bombLastShot = currentTime;
          const newBomb = new Projectile(app, this.bombTexture);
          newBomb.shoot({
            x: this.player.x + this.player.width,
            y: this.player.y + this.player.height / 2,
          });
          this.bomb = newBomb;
          if (this.playSound) {
            this.shootSound.play();
          }
          this.bombs--;
        }
      }
    }
  }

  addBoosterEffect({ x, y }: PlayerPosition) {
    this.booster.visible = true;
    this.booster.x = x - this.player.width;
    this.booster.y = y + this.player.height / 2;
  }

  handleBounds(maxWidth: number, maxHeight: number) {
    if (this.player.x <= 0) {
      this.player.x = 0;
    }
    if (this.player.x + this.player.width >= maxWidth) {
      this.player.x = maxWidth - this.player.width;
    }
    if (this.player.y <= 0) {
      this.player.y = 0;
    }
    if (this.player.y + this.player.height >= maxHeight) {
      this.player.y = maxHeight - this.player.height;
    }
  }

  update(app: Application, maxWidth: number, maxHeight: number) {
    this.handleInput(app);
    this.handleBounds(maxWidth, maxHeight);
    if (this.playSound) {
      this.engineSound.play();
    }
    if (this.bomb) {
      this.bomb.update(15.0);
    }

    for (let projectile of this.projectiles) {
      projectile.update(30.0);
    }

    this.projectiles = this.projectiles.filter((x) => x.isActive);
  }
}
