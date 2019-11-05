import Phaser from "phaser";
import imgBackground from "./assets/images/background.png";
import imgPlatform from "./assets/images/platform.png";
import imgSpike from "./assets/images/spike.png";
// import imgStar from "./assets/images/star.png";
import imgDude from "./assets/images/dude.png";
import tsTiles from "./assets/tilesets/platformPack_tilesheet.png";
import tmLevel1 from "./assets/tilemaps/level1.json";
import './style.css';

const config = {
  type: Phaser.AUTO,
  parent: "phaser-example",
  width: 800,
  height: 600,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 600 },
      debug: true
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

const game = new Phaser.Game(config);

function preload() {
  this.load.image('background', imgBackground);
  this.load.image('spike', imgSpike);
  this.load.image('tiles', tsTiles);
  this.load.tilemapTiledJSON('map', tmLevel1);

  this.load.image('ground', imgPlatform);
  // this.load.image('star', imgStar);
  this.load.spritesheet('dude', imgDude, { frameWidth: 32, frameHeight: 48 });
}

function create () {
  const backgroundImage = this.add.image(0, 0,'background').setOrigin(0, 0);
  backgroundImage.setScale(2, 0.8);

  // create tile map
  const map = this.make.tilemap({ key: 'map' });
  const tileset = map.addTilesetImage('kenney_simple_platformer', 'tiles');
  const platforms = map.createStaticLayer('Platforms', tileset, 0, 0);
  platforms.setCollisionByExclusion(-1, true);
  this.physics.world.setBounds(platforms.x, platforms.y, platforms.width, platforms.height);

  // handle player spawns and messages
  let playerX = 100;
  let playerY = 100;
  const eventObjects = map.getObjectLayer('Events')['objects'];
  eventObjects.forEach(evt => {
    if (evt.type == "PlayerSpawn") {
      playerX = evt.x;
      playerY = evt.y;
    } else if (evt.type == "Message") {
      //TODO: handle messages
    } else {
      throw "Invalid event object with type: "+evt.type;
    }
  });

  // create player with physics props
  this.player = this.physics.add.sprite(50, 300, 'dude');
  this.player.setBounce(0.1);
  this.player.setCollideWorldBounds(true);
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
  console.log(platforms.x, platforms.y, platforms.width, platforms.height);
  camera.setBounds(platforms.x, platforms.y, platforms.width, platforms.height);
  camera.setDeadzone(200, 400);
  camera.startFollow(this.player);


  // Create a sprite group for all spikes, set common properties to ensure that
  // sprites in the group don't move via gravity or by player collisions
  this.spikes = this.physics.add.group({
    allowGravity: false,
    immovable: true
  });

  // Let's get the spike objects, these are NOT sprites
  const spikeObjects = map.getObjectLayer('Spikes')['objects'];

  // Now we create spikes in our sprite group for each object in our map
  spikeObjects.forEach(spikeObject => {
    const spike = this.spikes.create(spikeObject.x, spikeObject.y - spikeObject.height, 'spike').setOrigin(0, 0);
    spike.body.setSize(spike.width, spike.height - 20).setOffset(0, 20);
  });

  this.physics.add.collider(this.player, this.spikes, playerHit, null, this);

  // //  Some stars to collect, 12 in total, evenly spaced 70 pixels apart along the x axis
  // stars = this.physics.add.group({
  //   key: 'star',
  //   repeat: 11,
  //   setXY: { x: 12, y: 0, stepX: 70 }
  // });
  //
  // stars.children.iterate(function (child) {
  //
  //   //  Give each star a slightly different bounce
  //   child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
  //
  // });
  //
  // //  The score
  // scoreText = this.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#000' });
  //
  // //  Collide the player and the stars with the platforms
  // this.physics.add.collider(stars, platforms);
  //
  // //  Checks to see if the player overlaps with any of the stars, if he does call the collectStar function
  // this.physics.add.overlap(player, stars, collectStar, null, this);
}

function update () {
  if (gameOver) {
    return;
  }

  if (cursors.left.isDown) {
    this.player.setVelocityX(-160);
    this.player.anims.play('left', true);

  } else if (cursors.right.isDown)  {
    this.player.setVelocityX(160);
    this.player.anims.play('right', true);

  } else {
    this.player.setVelocityX(0);
    this.player.anims.play('turn');
  }

  if (cursors.up.isDown && this.player.body.onFloor()) {
    this.player.setVelocityY(-350);
  }
}

function playerHit(player, spike) {
  player.setVelocity(0, 0);
  player.setX(50);
  player.setY(300);
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

// function collectStar (player, star)
// {
//   star.disableBody(true, true);
//
//   //  Add and update the score
//   score += 10;
//   scoreText.setText('Score: ' + score);
//
//   if (stars.countActive(true) === 0)
//   {
//     //  A new batch of stars to collect
//     stars.children.iterate(function (child) {
//
//         child.enableBody(true, child.x, 0, true, true);
//
//     });
//
//   }
// }
