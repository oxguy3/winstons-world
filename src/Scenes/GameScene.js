import 'phaser';
import ButtonHandler from '../Utils/ButtonHandler';
import LayerFactory from '../Layers/LayerFactory';
import BackgroundMusicManager from '../Utils/BackgroundMusicManager';
import TilemapError from '../Errors/TilemapError';
import levels from '../../assets/levels.json';

export default class GameScene extends Phaser.Scene {

  constructor (key, config={}) {
    super({
      key: key,
      physics: {
        arcade: {
          gravity: { y: 600 }
        }
      }
    });
    this.key = key;
    this.config = config;
  }

  init(data) {}

  preload() {}

  create(data) {
    // initialize some variables
    this.reset();

    // input handling
    this.buttons = new ButtonHandler(this.input);

    // retrieve data from levels.json
    for (const key of Object.keys(levels.list)) {
      if (key == this.key) {
        const config = levels.list[key];
        for (const prop of Object.keys(config)) {
          this.data.set(prop, config[prop]);
        }
        break;
      }
    }

    // initialize UI
    this.ui = this.scene.get('ui');
    this.scene.launch('ui', { gs: this });
    this.scene.bringToTop('ui');

    // retrieve map from file
    this.map = this.make.tilemap({ key: 'tilemap_'+this.key });
    const tileset = this.map.addTilesetImage('default', 'tiles');

    // save map properties in a simple array
    if (this.map.properties && this.map.properties.length && this.map.properties.length > 0) {
      for (const prop of this.map.properties) {
        this.properties[prop.name] = prop.value;
      }
    }

    const bounds = this.physics.world.bounds;
    const camera = this.cameras.main;

    // make layers
    const addLayer = new LayerFactory(this, this.map, tileset);
    this.layers.background = addLayer.background();
    this.platforms = addLayer.platforms();
    this.layers.messages = addLayer.messages();
    this.layers.mobs = addLayer.mobs();
    for (const key of Object.keys(this.layers)) {
      if (this.layers[key] == null) {
        delete this.layers[key];
      }
    }

    if (typeof this.platforms === 'undefined') {
      throw new TilemapError('Platforms layer is missing', null, null, this.map);
    }

    // camera follow the player
    camera.setRoundPixels(true);
    camera.setBounds(bounds.x, bounds.y, bounds.width, bounds.height);
    camera.setDeadzone(200, 200);
    camera.startFollow(this.player);

    camera.on('camerafadeoutcomplete', function(camera, effect) {
      this.game.scene.sendToBack(this.key);
    }, this);

    // crossfade when transitioning between levels
    this.events.on('transitionstart', function(fromScene, duration) {

      // needs to be invisible while the other scene is fading out
      this.sys.setVisible(false);

      // if we're switching from another GameScene, we need to wait for it to
      // fade out before we fade in
      if (fromScene instanceof GameScene) {
        duration = duration/2;
        this.time.delayedCall(duration, this.onCreate, [duration], this);
      } else {
        this.onCreate(duration);
      }
    }, this);
    this.events.on('transitionout', function(targetScene, duration){
      this.cameras.main.fadeOut(duration/2);
      this.time.delayedCall(duration/2, function() {
        this.music.stop();
      }, [], this);
    }, this);

    // listener to run onCreate() in rare cases where we don't use transitions
    this.events.on('create', function(){
      if (!this.sys.isTransitionIn()) {
        this.onCreate(500);
      }
    }.bind(this));

    // free up all custom variables when stopping this scene
    this.events.on('shutdown', this.shutdown);

    // update the user's save progress
    this.game.settings.set('lastLevel', this.key).then(function(key) {
      console.log(`Saved the user's progress to level '${key}'`)
    });

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

  onCreate() {
    // make it visible so we can fade in
    this.sys.setVisible(true);

    // initialize background scene
    this.background = this.scene.get('background');
    this.scene.launch('background', { gs: this });
    this.scene.moveAbove('background', this.key);

    // initalize background music
    if (this.data.get('music')) {
      this.music = new BackgroundMusicManager(this, this.data.get('music'));
      this.music.play();
    }

    // fade in the camera
    this.cameras.main.fadeIn(this.transitionDuration);
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
    return !!(this.physics && this.physics.world && this.physics.world.drawDebug);
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
