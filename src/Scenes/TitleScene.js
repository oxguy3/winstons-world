import 'phaser';
import levels from '../../assets/levels.json';
import BackgroundMusicManager from '../Utils/BackgroundMusicManager';

export default class TitleScene extends Phaser.Scene {
  constructor () {
    super('title');
  }

  preload () {}

  create () {
    this.nextYPos = 200;

    let background = this.add.image(0, 0, 'bg_title');
    background.setOrigin(0, 0).setScale(2);

    // make title text
    let titleText = this.add.bitmapText(this.cameras.main.width / 2, 0, 'fool', this.game.config.gameTitle, 112);
    titleText.setTint(0xbb3333, 0xbb3333, 0x550000, 0x550000);
    this.positionY(titleText);

    // warning if some files failed to load
    const totalFilesFailed = this.game.registry.get('totalFilesFailed');
    if (totalFilesFailed > 0) {
      let errorText = this.make.text({
        x: 10,
        y: 10,
        text: `WARNING: ${totalFilesFailed} asset${totalFilesFailed != 1 ? 's' : ''} failed to load. Game may not run correctly!`,
        style: {
          font: '20px sans-serif',
          fill: '#ff0000'
        }
      });
      errorText.setOrigin(0, 0);
    }

    // make buttons
    this.buttons = [];
    const levelKey = this.game.settings.lastLevel;
    if (levelKey != null) {
      this.makeButton('Continue', function (pointer) {
        this.game.setScene(levelKey);
      }.bind(this));
    }
    this.makeButton('Play', function (pointer) {
      Promise.all([
        this.game.settings.remove('lastLevel'),
        this.game.settings.remove('alwaysIce'),
        this.game.settings.remove('flippedControls')
      ]).then(function() {
        this.game.setScene(levels.start);
      }.bind(this));
    }.bind(this));

    this.diffButton = this.makeButton('Difficulty: ???', function (pointer) {
      this.game.settings.isHard = !this.game.settings.isHard;
      this.updateDifficultyText();
    }.bind(this));
    this.updateDifficultyText();

    // hover logic
    const hoverHeightDiff = 4;
    this.input.on('pointerover', function (event, gameObjects) {
      // update button texture
      const button = gameObjects[0];
      button.setTexture('ui_button_hover');

      // reposition based on hover texture
      const buttonText = button.getData('text');
      button.setY(button.y + hoverHeightDiff);
      buttonText.setY(buttonText.y + hoverHeightDiff);

      // sound effect
      this.game.playSfx('sfx_mouse');
    }, this);

    this.input.on('pointerout', function (event, gameObjects) {
      // update button texture
      const button = gameObjects[0];
      button.setTexture('ui_button');

      // reposition based on non-hover texture
      const buttonText = button.getData('text');
      button.setY(button.y - hoverHeightDiff);
      buttonText.setY(buttonText.y - hoverHeightDiff);
    }, this);

    // add background music
    this.music = new BackgroundMusicManager(this, 'music_title');
    this.music.play();
  }

  updateDifficultyText() {
    if (this.diffButton) {
      const isHard = this.game.settings.isHard;
      const text = `Mode: ${isHard ? 'Hard' : 'Easy'}`
      this.setButtonText(this.diffButton, text);
    }
  }

  makeButton(label, onpointerdown) {
    let button = this.add.sprite(this.cameras.main.width/2, 0, 'ui_button');
    button.setInteractive();
    this.positionY(button);

    let buttonText = this.add.bitmapText(10, 10, 'fool', label, 32);
    Phaser.Display.Align.In.Center(buttonText, button);
    buttonText.setTint(0x550000);
    button.setData('text', buttonText)

    button.on('pointerdown', function(pointer) {
      this.game.playSfx('sfx_mouse_2');
      onpointerdown(pointer);
    }, this);
    return button;
  }

  setButtonText(button, text) {
    const buttonText = button.getData('text');
    buttonText.setText(text);
    Phaser.Display.Align.In.Center(buttonText, button);
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
