import Phaser from "phaser";
import imgBackground from "./assets/images/background.png";
import imgSpike from "./assets/tilesets/minecraft-faithful/spike_iron_side.png";
import imgDude from "./assets/images/dude.png";
import tileset from "./assets/tilesets/minecraft-faithful.png";
import tilemap from "./assets/tilemaps/test2.json";
import './style.css';

const config = {
  // TODO: disabling WebGL fixes tile texture bleed, but WebGL would be nice to have
  type: Phaser.CANVAS,
  render: {
    pixelArt: true
  },
  scale: {
    mode: Phaser.Scale.FIT,
    parent: 'main',
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: 800,
    height: 600
  },
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 600 },
      debug: false
    }
  },
  scene: {
    preload: preload,
    create: create,
    update: update
  }
};

// var stars;
var cursors;
var score = 0;
var gameOver = false;
var scoreText;
var playerSpawn;

const game = new Phaser.Game(config);

function preload() {
  this.load.image('background', imgBackground);
  this.load.image('spike', imgSpike);
  this.load.image('tiles', tileset);
  this.load.tilemapTiledJSON('map', tilemap);
  this.load.spritesheet('dude', imgDude, { frameWidth: 32, frameHeight: 48 });
}

function create () {
  const backgroundImage = this.add.image(0, 0,'background').setOrigin(0, 0);
  backgroundImage.setScale(2, 0.8);

  // create tile map
  const map = this.make.tilemap({ key: 'map' });
  const tileset = map.addTilesetImage('minecraft-faithful', 'tiles');
  const platforms = map.createDynamicLayer('Platforms', tileset, 0, 0);
  platforms.setCollisionByProperty({ collides: true });

  // set world bounds and configure collision
  this.physics.world.setBounds(platforms.x, platforms.y, platforms.width, platforms.height);
  this.physics.world.setBoundsCollision(true, true, true, false);
  this.physics.world.on('tilecollide', onTileCollide);

  // handle player spawns and messages
  const eventObjects = map.getObjectLayer('Events')['objects'];
  eventObjects.forEach(evt => {
    if (evt.type == "PlayerSpawn") {
      playerSpawn = new Phaser.Math.Vector2(evt.x, evt.y);
    } else if (evt.type == "Message") {
      //TODO: handle messages
    } else {
      throw "Invalid event object with type: "+evt.type;
    }
  });

  // create player with physics props
  this.player = this.physics.add.sprite(playerSpawn.x, playerSpawn.y, 'dude');
  this.player.setName("player");
  this.player.setSize(this.player.width-12, this.player.height);
  this.player.setOrigin(1, 1);
  this.player.setBounce(0.1);
  this.player.setDamping(true);
  this.player.setMaxVelocity(320);
  this.player.setData('onIce', false);

  // add collision to player
  this.player.setCollideWorldBounds(true);
  this.player.body.onCollide = true;
  this.physics.add.collider(this.player, platforms);

  //  Our player animations, turning, walking left and walking right.
  this.anims.create({
    key: 'left',
    frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
    frameRate: 10,
    repeat: -1
  });
  this.anims.create({
    key: 'turn',
    frames: [ { key: 'dude', frame: 4 } ],
    frameRate: 20
  });
  this.anims.create({
    key: 'right',
    frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
    frameRate: 10,
    repeat: -1
  });

  //  Input Events
  cursors = this.input.keyboard.createCursorKeys();

  // camera follow the player
  let camera = this.cameras.main;
  camera.setRoundPixels(true);
  camera.setBounds(platforms.x, platforms.y, platforms.width, platforms.height);
  camera.setDeadzone(200, 400);
  camera.startFollow(this.player);
}

function update () {
  if (gameOver) {
    return;
  }

  const walkVel = 160;
  const iceAccel = 120;

  const onIce = this.player.getData('onIce');

  // keyboard controls
  if (cursors.left.isDown) {
    if (onIce) {
      this.player.setAccelerationX(0-iceAccel);
    } else {
      this.player.setVelocityX(0-walkVel);
    }
    this.player.anims.play('left', true);

  } else if (cursors.right.isDown)  {
    if (onIce) {
      this.player.setAccelerationX(iceAccel);
    } else {
      this.player.setVelocityX(walkVel);
    }
    this.player.anims.play('right', true);

  } else {
    if (!onIce) {
      this.player.setVelocityX(0);
    }
    this.player.anims.play('turn');
  }
  // ice physics!
  if (onIce) {
    this.player.setDragX(0.98);
  } else {
    this.player.setDragX(1);
    this.player.setAcceleration(0);
  }

  if (cursors.up.isDown && this.player.body.onFloor()) {
      this.player.setVelocityY(-350);
  }

  // kill if out of bounds
  if (this.player.y - 64 > this.physics.world.bounds.bottom) {
    playerHit.call(this, this.player, null);
  }
}

function onTileCollide(gameObject, tile, body) {
  if (gameObject.name == "player") {
    if (tile.properties.kill == true) {
      playerHit.call(gameObject.scene, gameObject, tile);
    }

    gameObject.setData('onIce', tile.properties.ice);
  }
}

function playerHit(player, killedBy) {
  player.setVelocity(0, 0);
  player.setPosition(playerSpawn.x, playerSpawn.y);
  player.setAlpha(0);
  let tw = this.tweens.add({
    targets: player,
    alpha: 1,
    duration: 100,
    ease: 'Linear',
    repeat: 5,
  });
  this.cameras.main.shake(250, 0.005);
}
