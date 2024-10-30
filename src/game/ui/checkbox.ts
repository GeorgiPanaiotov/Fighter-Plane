import { Sprite, Texture } from "pixi.js";

export class Checkbox {
  private isChecked: boolean = true;
  public switch: Sprite;

  constructor(onTexture: Texture, offTexture: Texture, x: number, y: number) {
    this.switch = new Sprite(onTexture);
    this.switch.x = x;
    this.switch.y = y;
    this.switch.interactive = true;
    this.switch.buttonMode = true;

    this.switch.on("pointerdown", () => {
      this.isChecked = !this.isChecked;
      this.switch.texture = this.isChecked ? onTexture : offTexture;
    });
  }

  getIsChecked() {
    return this.isChecked;
  }
}
