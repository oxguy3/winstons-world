import 'phaser';
import levels from '../../assets/levels.json';
import BackgroundMusicManager from '../Utils/BackgroundMusicManager';
import TextUtils from '../Utils/TextUtils';

export default class TitleScene extends Phaser.Scene {
  constructor () {
    super('title');
  }

  preload () {}

  create () {
    this.nextYPos = 200;

    this.buttonPrompts = {};
    this.wasButton = {};

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
    const levelKey = this.game.settings.lastLevel;
    if (levelKey != null) {
      this.makeButton('Continue', function (pointer) {
        this.game.setScene(levelKey);
      }.bind(this), 'A');
    }
    this.makeButton('Play', function (pointer) {
      Promise.all([
        this.game.settings.remove('lastLevel'),
        this.game.settings.remove('alwaysIce'),
        this.game.settings.remove('flippedControls')
      ]).then(function() {
        this.game.setScene(levels.start);
      }.bind(this));
    }.bind(this), 'X');

    this.diffButton = this.makeButton('Difficulty: ???', function (pointer) {
      this.game.settings.isHard = !this.game.settings.isHard;
      this.updateDifficultyText();
    }.bind(this), 'Y');
    this.updateDifficultyText();

    // hover logic
    const hoverHeightDiff = 4;
    this.input.on('pointerover', function (event, gameObjects) {
      // update button texture
      const button = gameObjects[0];

      // reposition based on hover texture
      const buttonText = button.getData('text');
      button.setY(button.y + hoverHeightDiff);
      button.setSize(button.width, button.height + hoverHeightDiff);
      buttonText.setY(buttonText.y + hoverHeightDiff);

      button.setTexture('ui_button_hover');


      // sound effect
      this.game.playSfx('sfx_mouse');
    }, this);

    this.input.on('pointerout', function (event, gameObjects) {
      const button = gameObjects[0];

      // reposition based on non-hover texture
      const buttonText = button.getData('text');
      button.setY(button.y - hoverHeightDiff);
      button.setSize(button.width, button.height - hoverHeightDiff);
      buttonText.setY(buttonText.y - hoverHeightDiff);

      // update button texture
      button.setTexture('ui_button');
    }, this);

    // add background music
    this.music = new BackgroundMusicManager(this, 'music_title');
    this.music.play();
  }

  update(time, delta) {
    const gamepad = this.input.gamepad.pad1;
    if (gamepad) {
      for (const key of Object.keys(this.buttonPrompts)) {
        if (this.input.gamepad.pad1[key] && this.wasButton[key] == false) {
          this.buttonPrompts[key].emit('pointerdown', gamepad);
        }
        this.wasButton[key] = this.input.gamepad.pad1[key];
      }
    }
  }

  updateDifficultyText() {
    if (this.diffButton) {
      const isHard = this.game.settings.isHard;
      const text = `Mode: ${isHard ? 'Hard' : 'Easy'}`
      this.setButtonText(this.diffButton, text);
    }
  }

  makeButton(label, onpointerdown, binding) {
    let button = this.add.sprite(this.cameras.main.width/2, 0, 'ui_button');
    button.setInteractive();
    button.setOrigin(0, 1);
    this.positionY(button);

    let buttonText = this.add.bitmapText(10, 10, 'fool', label, 32);
    Phaser.Display.Align.In.Center(buttonText, button);
    buttonText.setTint(0x550000);
    button.setData('text', buttonText)

    let buttonPrompt = this.add.bitmapText(
      button.getRightCenter().x + 10,
      buttonText.y,
      'fool',
      TextUtils.convertSymbols(`<button_${binding.toLowerCase()}>`),
      32
    );
    button.setData('prompt', buttonPrompt);
    this.buttonPrompts[binding] = button;

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
