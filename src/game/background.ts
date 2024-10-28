import { Application, Assets, Sprite } from "pixi.js";

export class Background {
  public sprite: Sprite = new Sprite();
  private spriteCopy: Sprite = new Sprite();

  private path: string;

  constructor(path: string) {
    this.path = path;
  }

  async loadSprite(app: Application, width: number, height: number) {
    const texture = await Assets.load(this.path);
    this.sprite = new Sprite(texture);

    this.spriteCopy = new Sprite(texture);
    this.spriteCopy.x = width;

    this.setSpriteProps(width, height);
    this.stageSprite(app);
  }

  setSpriteProps(width: number, height: number) {
    this.sprite.width = this.spriteCopy.width = width;
    this.sprite.height = this.spriteCopy.height = height;
  }

  stageSprite(app: Application) {
    app.stage.addChild(this.sprite);
    app.stage.addChild(this.spriteCopy);
  }

  update(speed: number) {
    this.spriteCopy.x += speed;
    this.sprite.x += speed;

    if (this.sprite.x <= -this.sprite.width) {
      this.sprite.x = this.spriteCopy.x + this.spriteCopy.width;
    }
    if (this.spriteCopy.x <= -this.spriteCopy.width) {
      this.spriteCopy.x = this.sprite.x + this.sprite.width;
    }
  }
}
