import 'phaser';
import ButtonHandler from '../ButtonHandler';
import Mob from '../Mobs/Mob';
import MobFactory from '../Mobs/MobFactory';
import Player from '../Mobs/Player';

export default class GameScene extends Phaser.Scene {

  constructor (key) {
    super({
      key: key,
      physics: {
        arcade: {
          gravity: { y: 600 },
          debug: false
        }
      }
    });
    this.key = key;

    this.mobs = null;
    this.player = null;
    this.buttons = null;
    this.platforms = null;
    this.messages = null;
    this.ui = null;
  }

  init(data) {
  }

  preload() {
  }

  create(data) {

    this.buttons = new ButtonHandler(this.input);

    const backgroundImage = this.add.image(0, 0, 'background').setOrigin(0, 0);
    backgroundImage.setScale(2, 0.8);

    // create tile map
    const map = this.make.tilemap({ key: 'tilemap_'+this.key });
    const tileset = map.addTilesetImage('default', 'tiles');
    this.platforms = map.createDynamicLayer('Platforms', tileset, 0, 0);
    this.platforms.setCollisionByProperty({ collides: true });

    // set world bounds and configure collision
    this.physics.world.setBounds(this.platforms.x, this.platforms.y, this.platforms.width, this.platforms.height);
    this.physics.world.setBoundsCollision(true, true, true, false);

    // spawn all mobs into the level
    const mobSpawns = map.getObjectLayer('Mobs')['objects'];
    this.mobs = this.physics.add.group();
    this.mobFactory = new MobFactory(this);
    mobSpawns.forEach(spawn => {

      // create the mob, initialize it, add physics, etc
      let mob = this.mobFactory.makeFromSpawn(spawn);

      if (spawn.type == 'Player') {
        if (this.player != null) {
          throw "This map has too many Player spawn points; there must only be one.";
        }
        this.player = mob;
      }
    });
    if (this.player == null) {
      throw "This map is missing a Player spawn point."
    }

    // add collision to mobs
    this.physics.add.collider(this.mobs, this.platforms, function(objA, objB) {
      if (objA instanceof Mob) { objA.onTileCollide(objB); }
      if (objB instanceof Mob) { objB.onTileCollide(objA); }
    });
    this.physics.add.collider(this.mobs, this.mobs, function(objA, objB){
      objA.onCollide(objB);
      objB.onCollide(objA);
    });

    // spawn all message triggers
    const messageObjects = map.getObjectLayer('Messages')['objects'];
    let messageZones = [];
    messageObjects.forEach(msg => {
      if (msg.type == "AreaMessage") {
        if (msg.rectangle !== true) {
          throw 'AreaMessages must be rectangles; other shapes are not supported.';
        }
        const zone = new Phaser.GameObjects.Zone(this, msg.x, msg.y, msg.width, msg.height);
        zone.setOrigin(0,0);
        msg.properties.forEach(prop => {
          zone.setData(prop.name, prop.value);
        });
        if (zone.getData('text') == null) {
          throw "This map has a message without a 'text' property set."
        }
        messageZones.push(zone);

      } else {
        if (msg.type == null || msg.type == '') {
          throw "This map has a message without a 'type' set (all messages must have a type)."
        } else {
          throw "This map has a message with an unknown type: "+msg.type;
        }
      }
    });

    // add collision for messages
    this.messages = this.physics.add.group({
      visible: true,
      allowDrag: false,
      allowGravity: false,
      allowRotation: false,
      immovable: true
    });
    this.messages.addMultiple(messageZones, true);
    // this.physics.add.overlap(this.player, this.messages, this.showMessage, null, this);

    // camera follow the player
    let camera = this.cameras.main;
    camera.setRoundPixels(true);
    camera.setBounds(this.platforms.x, this.platforms.y, this.platforms.width, this.platforms.height);
    camera.setDeadzone(200, 400);
    camera.startFollow(this.player);

    // debug key
    var debugKey = this.input.keyboard.addKey('BACKTICK');
    debugKey.on('down', function(event) {
      this.debug = !this.debug;
    }, this);

    // initialize UI
    this.ui = this.scene.get('ui');
    this.scene.launch('ui', { gs: this });
    this.scene.bringToTop('ui');

    // add scene to window for easy debugging
    if (window) {
      window.scene = this;
    }
  }

  update(time, delta) {

    // update on-screen message if in a trigger zone
    let newText = '';
    this.messages.children.iterate(function(msg) {
      if (this.physics.overlap(this.player, msg)) {
        newText = msg.getData('text');
      }
    }, this);
    this.ui.messageText.setText(newText);
    // if (newText != oldText && oldText != '') {
    //   let tw = this.tweens.add({
    //     targets: player,
    //     alpha: 1,
    //     duration: 100,
    //     ease: 'Linear',
    //     repeat: 5,
    //   });
    // }

    for (const mob of this.mobs.getChildren()) {
      mob.update(time, delta);
    }
  }

  get debug() {
    return this.physics.world.drawDebug;
  }

  set debug(val) {
    if (val && this.physics.world.debugGraphic == null) {
      this.physics.world.createDebugGraphic();
    }
    this.physics.world.drawDebug = val;
    this.physics.world.debugGraphic.active = val;
    this.physics.world.debugGraphic.visible = val;
  }
};
