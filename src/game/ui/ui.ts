import { Application, Sprite, Text, TextStyle } from "pixi.js";
import { Menu } from "./uiTypes";

export class UI {
  private title: Text;
  private mainSong: HTMLAudioElement;
  private panel: Sprite;
  private defaultStyle = new TextStyle({
    fontFamily: "Arial",
    fontSize: 36,
    fill: 0x000000,
    align: "center",
  });
  private hoverStyle = new TextStyle({
    fontFamily: "Arial",
    fontSize: 36,
    fill: 0xffcc00,
    align: "center",
  });
  private playLabel: Text;

  public startGame: boolean = false;
  public finalScore: Text;
  public bestScore: Text;

  constructor(sprite: Sprite, app: Application) {
    this.playLabel = new Text({ text: "Play Game", style: this.defaultStyle });
    this.panel = sprite;
    this.title = new Text({
      text: "Fighter Jet ",
      style: {
        fontFamily: '"Courier New", Courier, monospace',
        fontSize: 64,
        fill: 0x000000,
        align: "center",
      },
    });

    this.finalScore = new Text({ text: "0", style: this.defaultStyle });
    this.finalScore.visible = false;
    this.bestScore = new Text({ text: "0", style: this.defaultStyle });
    this.bestScore.visible = false;
    app.stage.addChild(this.panel, this.title, this.finalScore, this.bestScore);

    this.mainSong = new Audio("../../assets/sounds/mainThemeSong.mp3");
    this.mainSong.loop = true;
  }

  removeMenu() {
    this.panel.visible = false;
    this.title.visible = false;
    this.playLabel.visible = false;
  }

  renderMainMenu(width: number, height: number, app: Application) {
    this.panel.visible = true;
    this.title.visible = true;
    this.playLabel.visible = true;
    this.panel.x = (width - this.panel.width) / 2;
    this.panel.y = height * 0.1;

    this.title.x = this.panel.x + (this.panel.width - this.title.width) / 2;
    this.title.y = this.panel.y + (this.panel.height - this.title.height) / 2;

    this.playLabel.interactive = true;
    this.playLabel.buttonMode = true;

    this.playLabel.x = (width - this.playLabel.width) / 2;
    this.playLabel.y = height / 2;

    this.playLabel.on("pointerover", () => {
      this.playLabel.style = this.hoverStyle;
    });

    this.playLabel.on("pointerout", () => {
      this.playLabel.style = this.defaultStyle;
    });

    this.playLabel.on("pointerdown", () => {
      this.startGame = true;
    });

    this.mainSong.play();
    app.stage.addChild(this.playLabel);
  }

  renderDeathMenu(finalScore: number, bestScore: number) {
    this.panel.visible = true;
    this.finalScore.visible = true;
    this.finalScore.text = `Your current score is: ${finalScore}`;
    this.finalScore.x = this.panel.x + (this.panel.width - this.finalScore.width) / 2;
    this.finalScore.y = this.panel.y + (this.panel.height - this.finalScore.height) / 1.5;

    this.bestScore.visible = true;
    this.bestScore.text = `Best score: ${bestScore}`;
    this.bestScore.x = this.panel.x + (this.panel.width - this.bestScore.width) / 2;
    this.bestScore.y = this.panel.y + (this.panel.height - this.bestScore.height) / 3;
  }
}
