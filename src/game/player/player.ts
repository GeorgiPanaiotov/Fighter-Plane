import { Application, Sprite, Assets, Texture } from "pixi.js";
import { Plane } from "./playerTypes";
import { Projectile } from "./projectile";

export class Player {
  private speed: number = 10;
  private bombs: number = 10;
  private player: Sprite = new Sprite();
  private keys: { [key: string]: boolean } = {};
  private engineSound: HTMLAudioElement;
  private speedUpSound: HTMLAudioElement;
  private projectileTexture: Texture;
  private shootSound: HTMLAudioElement;
  private lastShot: number = 0;
  private delay: number = 400;

  public isDead: boolean = false;
  public projectiles: Array<Projectile> = [];

  constructor(width: number) {
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
    this.player = new Sprite(playerTexture);
    this.player.scale.set(0.1, 0.1);

    this.projectileTexture = await Assets.load(
      "../../assets/planes/torpedo/fire_ball_1.png"
    );

    this.player.visible = false;
    app.stage.addChild(this.player);
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
      this.speedUpSound.play();
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
        this.shootSound.play();
      }
    }
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
    this.engineSound.play();

    for (let projectile of this.projectiles) {
      projectile.update(30.0);
    }

    this.projectiles = this.projectiles.filter((x) => x.isActive);
  }
}
