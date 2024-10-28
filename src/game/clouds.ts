import { Application, Assets, Sprite, Texture } from "pixi.js";

export class Cloud {
  private cloudTextures: Array<Texture> = [];
  private clouds: Array<Sprite> = [];

  async load() {
    const cloudTexture1 = await Assets.load("../assets/background/clouds/cloud1.png");
    const cloudTexture2 = await Assets.load("../assets/background/clouds/cloud2.png");
    const cloudTexture3 = await Assets.load("../assets/background/clouds/cloud3.png");
    const cloudTexture4 = await Assets.load("../assets/background/clouds/cloud4.png");
    const cloudTexture5 = await Assets.load("../assets/background/clouds/cloud5.png");
    const cloudTexture6 = await Assets.load("../assets/background/clouds/cloud6.png");
    const cloudTexture7 = await Assets.load("../assets/background/clouds/cloud7.png");
    const cloudTexture8 = await Assets.load("../assets/background/clouds/cloud8.png");

    this.cloudTextures.push(
      cloudTexture1,
      cloudTexture2,
      cloudTexture3,
      cloudTexture4,
      cloudTexture5,
      cloudTexture6,
      cloudTexture7,
      cloudTexture8
    );
  }

  randomizeAndStage(density: number, app: Application) {
    let item = 0;
    for (let i = 0; i < density; i++) {
      if (item >= 8) {
        item = 0;
      }
      const cloud = new Sprite(this.cloudTextures[item]);
      
      cloud.y = Math.random() * app.screen.height / 2;
      cloud.x = Math.random() * app.screen.width;
      app.stage.addChild(cloud);
      
      item++;
      this.clouds.push(cloud);
    }
  }

  update(app: Application) {
    for (let i = 0; i < this.clouds.length; i++) {
      const cloud = this.clouds[i];
      cloud.x -= 1.5;

      if (cloud.x + cloud.width <= 0) {
        cloud.x = app.screen.width;
        cloud.y = Math.random() * app.screen.height / 2;
      }
    }
  }
}
