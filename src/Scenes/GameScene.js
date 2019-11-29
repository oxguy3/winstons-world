import 'phaser';
import ButtonHandler from '../Utils/ButtonHandler';
import LayerFactory from '../Layers/LayerFactory';
import BackgroundMusicManager from '../Utils/BackgroundMusicManager';

export default class GameScene extends Phaser.Scene {

  constructor (key) {
    super({
      key: key,
      physics: {
        arcade: {
          gravity: { y: 600 }
        }
      }
    });
    this.key = key;
  }

  init(data) {}

  preload() {}

  create(data) {
    // initialize some variables
    this.reset();

    // input handling
    this.buttons = new ButtonHandler(this.input);

    // initialize UI
    this.ui = this.scene.get('ui');
    this.scene.launch('ui', { gs: this });
    this.scene.bringToTop('ui');

    // retrieve map from file
    const map = this.make.tilemap({ key: 'tilemap_'+this.key });
    const tileset = map.addTilesetImage('default', 'tiles');

    // save map properties in a simple array
    if (map.properties && map.properties.length && map.properties.length > 0) {
      for (const prop of map.properties) {
        this.properties[prop.name] = prop.value;
      }
    }

    // create background image
    const backgroundImage = this.add.image(0, 0, 'background').setOrigin(0, 0);
    backgroundImage.setScale(2, 0.8);

    // make layers
    const addLayer = new LayerFactory(this, map, tileset);
    this.layers.background = addLayer.background();
    this.platforms = addLayer.platforms();
    this.layers.messages = addLayer.messages();
    this.layers.mobs = addLayer.mobs();
    for (const key of Object.keys(this.layers)) {
      if (this.layers[key] == null) {
        delete this.layers[key];
      }
    }

    if (this.platforms == null) {
      throw 'No platforms layer found!';
    }

    // initalize background music
    if (this.properties.music) {
      this.music = new BackgroundMusicManager(this, this.properties.music);
      this.music.play();
    }

    // camera follow the player
    const camera = this.cameras.main;
    const bounds = this.physics.world.bounds;
    camera.setRoundPixels(true);
    camera.setBounds(bounds.x, bounds.y, bounds.width, bounds.height);
    camera.setDeadzone(200, 200);
    camera.startFollow(this.player);

    camera.on('camerafadeoutcomplete', function(camera, effect) {
      this.game.scene.sendToBack(this.key);
    }, this);

    // crossfade when transitioning between levels
    this.events.on('transitionstart', function(fromScene, duration){
      const initFadeIn = function() {
        const fadeIn = function() {
          this.cameras.main.fadeIn(duration);
        }.bind(this);

        // Set a listener to run the fadeIn once the scene is created, but if
        // the scene is already created, cancel the listener and run the fadeIn
        // immediately. We set the listener before checking if we need it to
        // avoid a race condition (it's fine to run 2 fadeIns but not to run 0).
        this.events.once('create', fadeIn, this);
        if (this.sys.isActive()) {
          this.events.removeListener('create', fadeIn, this);
          fadeIn();
        }
      }.bind(this);

      // if we're switching from another GameScene, we need to wait for it to
      // fade out before we fade in
      if (fromScene instanceof GameScene) {
        duration = duration/2;
        this.time.delayedCall(duration, initFadeIn, [], this);
      } else {
        initFadeIn();
      }
    }, this);
    this.events.on('transitionout', function(targetScene, duration){
      this.cameras.main.fadeOut(duration/2);
    }, this);

    // free up all custom variables when stopping this scene
    this.events.on('shutdown', this.shutdown);

    // debug key
    var debugKey = this.input.keyboard.addKey('BACKTICK');
    debugKey.on('down', function(event) {
      this.debug = !this.debug;
    }, this);

    // add scene to window for easy debugging
    if (window) {
      window.scene = this;
    }
  }

  update(time, delta) {
    if (this.sys.isActive()) {
      this.platforms.update(time, delta);
      for (const layer of Object.values(this.layers)) {
        layer.update(time, delta);
      }
    }
  }

  /**
   * Initialize custom variables
   */
  reset() {
    this.player = null;
    this.platforms = null;
    this.layers = {};
    this.ui = null;
    this.properties = [];
    this.music = null;
  }

  /**
   * Free up custom variables
   */
  shutdown() {
    delete this.player;
    delete this.buttons;
    delete this.platforms;
    delete this.layers;
    delete this.properties;
    delete this.music;
  }

  get debug() {
    return this.physics.world.drawDebug;
  }

  set debug(val) {
    if (this.physics.world.debugGraphic == null) {
      this.physics.world.createDebugGraphic();
    }
    this.physics.world.drawDebug = val;
    this.physics.world.debugGraphic.active = val;
    this.physics.world.debugGraphic.visible = val;
  }
};
