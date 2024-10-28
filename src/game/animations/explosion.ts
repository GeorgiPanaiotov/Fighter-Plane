import { Application, Sprite, Assets } from "pixi.js";
import { explosionKeyframes } from "./commonExplosionTypes";

export class Explosion {
  public animation: Array<Sprite> = [];

  async loadTextures(app: Application) {
    for (let i = 0; i < explosionKeyframes.length; i++) {
      const path = explosionKeyframes[i];
      const texture = await Assets.load(path);

      const sprite = new Sprite(texture);
      sprite.visible = false;
      this.animation.push(sprite);
      app.stage.addChild(sprite);
    }
  }
}
