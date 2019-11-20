import 'phaser';

export default class TitleScene extends Phaser.Scene {
  constructor () {
    super('title');
  }

  preload () {
    this.nextYPos = 150;
  }

  create () {

    let titleText = this.make.text({
      x: this.cameras.main.width / 2,
      y: 0,
      text: 'Kill the Baby?',
      style: {
        font: '40px sans-serif',
        fill: '#ffffff'
      }
    });
    this.positionY(titleText);

    this.makeButton('Play', function (pointer) {
      this.scene.start('test2');
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

    let buttonText = this.add.text(0, 0, label, { fontSize: '32px', fill: '#fff' });
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
