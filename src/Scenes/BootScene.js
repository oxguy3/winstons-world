import 'phaser';

export default class BootScene extends Phaser.Scene {
  constructor () {
    super('boot');
  }

  preload () {
    var width = this.cameras.main.width;
    var height = this.cameras.main.height;

    var titleText = this.make.text({
      x: width / 2,
      y: 150,
      text: 'Kill the Baby?',
      style: {
        font: '40px sans-serif',
        fill: '#ffffff'
      }
    });
    titleText.setOrigin(0.5, 0.5);

    // display progress bar
    var progressBar = this.add.graphics();
    var progressBox = this.add.graphics();
    progressBox.fillStyle(0x222222, 0.8);
    progressBox.fillRect(240, 270, 320, 50);

    var loadingText = this.make.text({
      x: width / 2,
      y: height / 2 - 50,
      text: 'Loading...',
      style: {
        font: '20px monospace',
        fill: '#ffffff'
      }
    });
    loadingText.setOrigin(0.5, 0.5);

    var percentText = this.make.text({
      x: width / 2,
      y: height / 2 - 5,
      text: '0%',
      style: {
        font: '18px monospace',
        fill: '#ffffff'
      }
    });
    percentText.setOrigin(0.5, 0.5);

    var assetText = this.make.text({
      x: width / 2,
      y: height / 2 + 50,
      text: '',
      style: {
        font: '18px monospace',
        fill: '#ffffff'
      }
    });
    assetText.setOrigin(0.5, 0.5);

    // update progress bar
    this.load.on('progress', function (value) {
      percentText.setText(parseInt(value * 100) + '%');
      progressBar.clear();
      progressBar.fillStyle(0xffffff, 1);
      progressBar.fillRect(250, 280, 300 * value, 30);
    });

    // update file progress text
    this.load.on('fileprogress', function (file) {
      assetText.setText('Loading asset: ' + file.key);
    });

    // remove progress bar when complete
    this.load.on('complete', function () {
      progressBar.destroy();
      progressBox.destroy();
      loadingText.destroy();
      percentText.destroy();
      assetText.destroy();
      this.scene.start('title');
    }.bind(this));

    this.load.image('blueButton1', 'assets/images/ui/blue_button02.png');
    this.load.image('blueButton2', 'assets/images/ui/blue_button03.png');
    this.load.image('box', 'assets/images/ui/grey_box.png');
    this.load.image('checkedBox', 'assets/images/ui/blue_boxCheckmark.png');

    this.load.image('background', 'assets/images/background.png');
    this.load.image('spike', 'assets/tilesets/minecraft-faithful/spike_iron_side.png');
    this.load.image('tiles', 'assets/tilesets/minecraft-faithful.png');
    this.load.tilemapTiledJSON('map', 'assets/tilemaps/test2.json');
    this.load.spritesheet('dude', 'assets/images/dude.png', { frameWidth: 32, frameHeight: 48 });
  }

  create () {
  }
};
