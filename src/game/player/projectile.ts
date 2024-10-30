import { Sprite, Application, Texture } from "pixi.js";
import { PlayerPosition } from "./playerTypes";

export class Projectile {
  private sprite: Sprite;
  public isActive: boolean = true;

  constructor(app: Application, texture: Texture) {
    this.sprite = new Sprite(texture);
    this.sprite.scale.set(0.15, 0.15);
    this.sprite.visible = false;
    app.stage.addChild(this.sprite);
  }

  shoot(pos: PlayerPosition) {
    this.sprite.x = pos.x;
    this.sprite.y = pos.y;
    this.sprite.visible = true;
  }

  getSprite() {
    return this.sprite;
  }

  reverseSprite() {
    this.sprite.scale.set(-0.15, 0.15);
  }

  removeProjectile() {
    this.sprite.visible = false;
  }

  getPosition() {
    return this.sprite.getBounds();
  }

  update(speed: number) {
    this.sprite.x += speed;
  }
}
