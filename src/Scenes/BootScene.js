import 'phaser';
import levels from '../../assets/levels.json';

export default class BootScene extends Phaser.Scene {
  constructor () {
    super('boot');
  }

  preload () {
    this.makeLoadingScreen();
    this.loadAssets();
  }

  makeLoadingScreen() {
    var width = this.cameras.main.width;
    var height = this.cameras.main.height;

    // display progress bar
    var progressBar = this.add.graphics();
    var progressBox = this.add.graphics();
    progressBox.fillStyle(0x550000, 0.8);
    progressBox.fillRect(240, 270, 320, 50);

    var loadingText = this.make.text({
      x: width / 2,
      y: height / 2 - 60,
      text: 'Loading...',
      style: {
        font: '32px sans-serif',
        fill: '#ffffff'
      }
    });
    loadingText.setOrigin(0.5, 0.5);

    var percentText = this.make.text({
      x: width / 2,
      y: height / 2 - 5,
      text: '0%',
      style: {
        font: '18px sans-serif',
        fill: '#ffffff'
      }
    });
    percentText.setOrigin(0.5, 0.5);

    var assetText = this.make.text({
      x: width / 2,
      y: height / 2 + 50,
      text: '',
      style: {
        font: '18px sans-serif',
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
    this.startScenePromise = this.game.settings.get('startScene');
    this.load.on('complete', function () {
      progressBar.destroy();
      progressBox.destroy();
      loadingText.destroy();
      percentText.destroy();
      assetText.destroy();
      this.startScenePromise.then(function(sceneKey) {
        this.scene.start(sceneKey);
      }.bind(this));
    }, this);
  }

  loadAssets() {
    // load UI elements
    this.load.image('blueButton1', 'assets/images/ui/blue_button02.png');
    this.load.image('blueButton2', 'assets/images/ui/blue_button03.png');
    this.load.image('box', 'assets/images/ui/grey_box.png');
    this.load.image('checkedBox', 'assets/images/ui/blue_boxCheckmark.png');
    this.load.image('dialogBox', 'assets/images/ui/dialogbox.png');
    this.load.bitmapFont({
      key: 'fool',
      textureURL: 'assets/fonts/foolplus.png',
      fontDataURL: 'assets/fonts/foolplus.fnt'
    });

    // load level data
    this.load.image('background', 'assets/images/background.png');
    this.load.image('tiles', 'assets/tilesets/default.png');
    for (const level of Object.keys(levels.list)) {
      this.load.tilemapTiledJSON('tilemap_'+level, 'assets/tilemaps/'+level+'.json');
    }

    // load sprites
    this.load.image('placeholder', 'assets/images/placeholder.png');
    this.load.pack('sprites', 'assets/spritesheets.json');
    this.load.animation('animations', 'assets/animations.json');

    // load audio
    this.load.pack('sound', 'assets/sound.json');
  }

  create () {}
};
