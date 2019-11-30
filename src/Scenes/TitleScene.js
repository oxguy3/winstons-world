import 'phaser';
import levels from '../../assets/levels.json';
import BackgroundMusicManager from '../Utils/BackgroundMusicManager';

export default class TitleScene extends Phaser.Scene {
  constructor () {
    super('title');
  }

  preload () {}

  create () {
    this.nextYPos = 150;

    // make title text
    let titleText = this.add.bitmapText(this.cameras.main.width / 2, 0, 'fool', this.game.config.gameTitle, 80);
    titleText.setTint(0xffbbbb, 0xffbbbb, 0x550000, 0x550000);
    this.positionY(titleText);

    // make buttons
    this.game.settings.get('lastLevel').then(function(levelKey) {
      if (levelKey != null) {
        this.makeButton('Continue', function (pointer) {
          this.game.setScene(levelKey);
        });
      }
    }.bind(this)).finally(function() {
      this.makeButton('Play', function (pointer) {
        this.game.setScene(levels.start);
      });
      // this.makeButton('Options', function (pointer) {
      //   this.scene.start('options');
      // });
    }.bind(this));

    // hover logic
    this.input.on('pointerover', function (event, gameObjects) {
      gameObjects[0].setTexture('blueButton2');
    });

    this.input.on('pointerout', function (event, gameObjects) {
      gameObjects[0].setTexture('blueButton1');
    });

    // add background music
    this.music = new BackgroundMusicManager(this, 'title_screen_theme');
    this.music.play();
  }

  makeButton(label, onpointerdown) {
    let button = this.add.sprite(this.cameras.main.width/2, 0, 'blueButton1').setInteractive();
    this.positionY(button);

    let buttonText = this.add.bitmapText(10, 10, 'fool', label, 32);
    Phaser.Display.Align.In.Center(buttonText, button);

    button.on('pointerdown', onpointerdown.bind(this));
    return button;
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
