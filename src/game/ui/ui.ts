import { Application, Sprite, Text, TextStyle, Texture } from "pixi.js";
import { Menu } from "./uiTypes";
import { Checkbox } from "./checkbox";

export class UI {
  private title: Text;
  private mainSong: HTMLAudioElement;
  private panel: Sprite;
  private defaultStyle = new TextStyle({
    fontFamily: "Arial",
    fontSize: 48,
    fill: 0x000000,
    align: "center",
  });
  private hoverStyle = new TextStyle({
    fontFamily: "Arial",
    fontSize: 48,
    fill: 0xffcc00,
    align: "center",
  });
  private playLabel: Text;
  private musicSwitch: Checkbox;
  private musicLabel: Text;
  private soundSwitch: Checkbox;
  private soundLabel: Text;

  public startGame: boolean = false;
  public score: Text;
  public bestScore: Text;
  public bombsAvailable: Text;

  constructor(
    sprite: Sprite,
    app: Application,
    switchOff: Texture,
    switchOn: Texture
  ) {
    this.playLabel = new Text({ text: "Play Game", style: this.defaultStyle });
    this.musicLabel = new Text({ text: "Music", style: this.defaultStyle });
    this.soundLabel = new Text({ text: "Sound", style: this.defaultStyle });

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

    this.score = new Text({ text: "0", style: this.defaultStyle });
    this.score.visible = false;
    this.bestScore = new Text({ text: "0", style: this.defaultStyle });
    this.bestScore.visible = false;
    this.bombsAvailable = new Text({ text: "0", style: this.defaultStyle });
    this.bombsAvailable.visible = false;

    this.musicSwitch = new Checkbox(switchOn, switchOff, 0, 0);
    this.soundSwitch = new Checkbox(switchOn, switchOff, 0, 0);

    app.stage.addChild(
      this.panel,
      this.title,
      this.score,
      this.bestScore,
      this.bombsAvailable,
      this.musicSwitch.switch,
      this.musicLabel,
      this.playLabel,
      this.soundLabel,
      this.soundSwitch.switch
    );

    this.mainSong = new Audio("../../assets/sounds/mainThemeSong.mp3");
    this.mainSong.loop = true;
  }

  removeMenu() {
    this.panel.visible = false;
    this.title.visible = false;
    this.playLabel.visible = false;
    this.musicLabel.visible = false;
    this.musicSwitch.switch.visible = false;
    this.soundLabel.visible = false;
    this.soundSwitch.switch.visible = false;
  }

  stopMusic() {
    if (this.musicSwitch.getIsChecked()) {
      this.mainSong.play();
    } else {
      this.mainSong.pause();
    }
  }

  stopSound() {
    if (this.soundSwitch.getIsChecked()) {
      return true;
    } else {
      return false;
    }
  }

  renderMainMenu(width: number, height: number) {
    this.panel.visible = true;
    this.title.visible = true;
    this.playLabel.visible = true;
    this.musicLabel.visible = true;
    this.musicSwitch.switch.visible = true;
    this.soundLabel.visible = true;
    this.soundSwitch.switch.visible = true;

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

    this.musicSwitch.switch.x = this.playLabel.x;
    this.musicSwitch.switch.y = this.playLabel.y + 60;
    this.musicLabel.x =
      this.musicSwitch.switch.x + this.musicSwitch.switch.width + 20;
    this.musicLabel.y = this.musicSwitch.switch.y;

    this.soundSwitch.switch.x = this.playLabel.x;
    this.soundSwitch.switch.y = this.playLabel.y + 120;
    this.soundLabel.x =
      this.soundSwitch.switch.x + this.soundSwitch.switch.width + 20;
    this.soundLabel.y = this.soundSwitch.switch.y;

    this.mainSong.play();
  }

  renderDeathMenu(finalScore: number, bestScore: number) {
    this.bombsAvailable.visible = false;
    this.panel.visible = true;
    this.score.visible = true;
    this.score.text = `Your current score is: ${finalScore}`;
    this.score.x = this.panel.x + (this.panel.width - this.score.width) / 2;
    this.score.y = this.panel.y + (this.panel.height - this.score.height) / 1.5;

    this.bestScore.visible = true;
    this.bestScore.text = `Best score: ${bestScore}`;
    this.bestScore.x =
      this.panel.x + (this.panel.width - this.bestScore.width) / 2;
    this.bestScore.y =
      this.panel.y + (this.panel.height - this.bestScore.height) / 3;
  }

  renderInGameUI(score: number, bombs: number) {
    this.score.visible = true;
    this.score.text = `Score: ${score}`;
    this.score.x = 20;
    this.score.y = 20;

    this.bombsAvailable.visible = true;
    this.bombsAvailable.text = `Bombs: ${bombs}`;
    this.bombsAvailable.x = 20;
    this.bombsAvailable.y = 60;
  }
}
