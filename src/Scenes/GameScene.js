import 'phaser';
import ButtonHandler from '../ButtonHandler';
import Mob from '../Mobs/Mob';
import MobFactory from '../Mobs/MobFactory';
import Player from '../Mobs/Player';

export default class GameScene extends Phaser.Scene {

  constructor (name) {
    super({
      key: name,
      physics: {
        arcade: {
          gravity: { y: 600 },
          debug: false
        }
      }
    });

    this.mobs = [];
    this.player = null;
    this.buttons = null;
    this.platforms = null;
    this.messages = null;
    this.debug = false;
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
    const map = this.make.tilemap({ key: 'map' });
    const tileset = map.addTilesetImage('default', 'tiles');
    this.platforms = map.createDynamicLayer('Platforms', tileset, 0, 0);
    this.platforms.setCollisionByProperty({ collides: true });

    // set world bounds and configure collision
    this.physics.world.setBounds(this.platforms.x, this.platforms.y, this.platforms.width, this.platforms.height);
    this.physics.world.setBoundsCollision(true, true, true, false);
    this.physics.world.on('tilecollide', this.onTileCollide);

    // spawn all mobs into the level
    const mobSpawns = map.getObjectLayer('Mob Spawns')['objects'];
    const mobFactory = new MobFactory(this);
    mobSpawns.forEach(spawn => {

      // create the mob, initialize it, add physics, etc
      let mob = mobFactory.make(spawn.type, spawn.x, spawn.y);

      if (spawn.type == 'Player') {
        if (this.player != null) {
          throw "This map has more than one Player spawn point.";
        }
        this.player = mob;
      }
    });
    if (this.player == null) {
      throw "This map doesn't have a Player spawn point."
    }

    // handle player spawns and messages
    const messageObjects = map.getObjectLayer('Messages')['objects'];
    let messageZones = [];
    messageObjects.forEach(msg => {
      if (msg.type == "Message") {
        if (msg.rectangle !== true) {
          throw 'Message triggers must be rectangular';
        }
        const zone = new Phaser.GameObjects.Zone(this, msg.x, msg.y, msg.width, msg.height);
        zone.setOrigin(0,0);
        msg.properties.forEach(prop => {
          zone.setData(prop.name, prop.value);
        });
        messageZones.push(zone);

      } else {
        throw "Invalid event object with type: "+msg.type;
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
      if (this.physics.world.debugGraphic == null) {
        this.physics.world.createDebugGraphic();
      }
      this.physics.world.drawDebug = this.debug;
      this.physics.world.debugGraphic.active = this.debug;
      this.physics.world.debugGraphic.visible = this.debug;
    }, this);

    // initialize UI
    this.ui = this.scene.get('ui');
    this.scene.launch('ui', { gs: this });
    this.scene.bringToTop('ui');
  }

  update(time, delta) {

    // update on-screen message if in a trigger zone
    let newText = '';
    this.messages.children.iterate(function(msg) {
      if (this.physics.overlap(this.player, msg)) {
        newText = msg.getData('message');
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

    for (const mob of this.mobs) {
      mob.update(time, delta);
    }
  }

  onTileCollide(gameObject, tile, body) {
    if (gameObject instanceof Mob) {
      if (tile.properties.kill == true) {
        gameObject.damage(tile);
      }
      gameObject.onIce = tile.properties.ice;
    }
  }
};
