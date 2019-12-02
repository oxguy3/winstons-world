import 'phaser';
import BackgroundMusicManager from '../Utils/BackgroundMusicManager';
import TextUtils from '../Utils/TextUtils';

export default class CreditsScene extends Phaser.Scene {
  constructor () {
    super('credits');
  }

  preload () {
  }

  create () {

    this.buttonPrompts = {};
    this.wasButton = {};

    let background = this.add.image(0, 0, 'bg_title');
    background.setOrigin(0, 0).setScale(2);

    let titleText = this.add.bitmapText(10, 200, 'fool', this.game.config.gameTitle, 64);
    titleText.setTint(0xbb3333, 0xbb3333, 0x550000, 0x550000);

    const credits = "Hayden Schiff - Programming\nNick Klawitter - Level Design, Character Art\nCharles Harte - Script, Sound Design\nPatsy Schomaeker - Tile and Background Art\n\nAdditional assets by Kenney.nl, Void, egordorichev"
    let creditsText = this.add.bitmapText(10, 274, 'fool', credits, 32);
    creditsText.setTint(0x000000);

    const buttonSpacing = 100;
    const buttonY = 500;
    const titleButton = this.makeButton(buttonSpacing, buttonY, 'Back to Title', function (pointer) {
      this.game.setScene('title');
    }.bind(this), 'X');
    titleButton.setX

    const infoButton = this.makeButton(800-190-buttonSpacing*2, buttonY, 'More Info', function (pointer) {
      window.location = 'https://github.com/oxguy3/ktbgame'
    }.bind(this), 'Y');

    // hover logic
    const hoverHeightDiff = 4;
    this.input.on('pointerover', function (event, gameObjects) {
      // update button texture
      const button = gameObjects[0];
      button.setTexture('ui_button_hover');

      // sound effect
      this.game.playSfx('sfx_mouse');
    }, this);

    this.input.on('pointerout', function (event, gameObjects) {
      // update button texture
      const button = gameObjects[0];
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

  makeButton(x, y, label, onpointerdown, binding) {
    let button = this.add.sprite(x, y, 'ui_button');
    button.setOrigin(0,0);
    button.setInteractive();

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
};
