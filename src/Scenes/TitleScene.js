import 'phaser';
import levels from '../../assets/levels.json';

export default class TitleScene extends Phaser.Scene {
  constructor () {
    super('title');
  }

  preload () {
    this.nextYPos = 150;
  }

  create () {
    let titleText = this.add.bitmapText(this.cameras.main.width / 2, 0, 'fool', this.game.config.gameTitle, 80);
    titleText.setTint(0xffbbbb, 0xffbbbb, 0x550000, 0x550000);
    this.positionY(titleText);

    this.makeButton('Play', function (pointer) {
      this.scene.start(levels.start);
    });
    this.makeButton('Options', function (pointer) {
      this.scene.start('options');
    });

    // hover logic
    this.input.on('pointerover', function (event, gameObjects) {
      gameObjects[0].setTexture('blueButton2');
    });

    this.input.on('pointerout', function (event, gameObjects) {
      gameObjects[0].setTexture('blueButton1');
    });
  }

  makeButton(label, onpointerdown) {
    let button = this.add.sprite(this.cameras.main.width/2, 0, 'blueButton1').setInteractive();
    this.positionY(button);

    let buttonText = this.add.bitmapText(10, 10, 'fool', label, 32);
    Phaser.Display.Align.In.Center(buttonText, button);

    button.on('pointerdown', onpointerdown.bind(this));

  }

  /**
   * gameObject must extend Components.Transform and Components.Origin
   */
  positionY(gameObject) {
    const padding = 20;
    gameObject.setOrigin(0.5, 0);
    gameObject.setY(this.nextYPos);
    this.nextYPos += gameObject.height + padding;
  }
};
