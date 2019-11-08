import 'phaser';
import ButtonHandler from '../ButtonHandler';

export default class GameScene extends Phaser.Scene {

  constructor () {
    super('game');
  }

  preload() {
  }

  create() {
    this.buttons = new ButtonHandler(this.input);

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
    this.physics.world.on('tilecollide', this.onTileCollide);

    // handle player spawns and messages
    const eventObjects = map.getObjectLayer('Events')['objects'];
    eventObjects.forEach(evt => {
      if (evt.type == "PlayerSpawn") {
        this.playerSpawn = new Phaser.Math.Vector2(evt.x, evt.y);
      } else if (evt.type == "Message") {
        //TODO: handle messages
      } else {
        throw "Invalid event object with type: "+evt.type;
      }
    });

    // create player with physics props
    this.player = this.physics.add.sprite(this.playerSpawn.x, this.playerSpawn.y, 'dude');
    this.player.setName("player");
    this.player.setSize(20, 40)
    this.player.setOffset(6, 8);
    this.player.setOrigin(1, 1);
    this.player.setBounce(0.15);
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

    // camera follow the player
    let camera = this.cameras.main;
    camera.setRoundPixels(true);
    camera.setBounds(platforms.x, platforms.y, platforms.width, platforms.height);
    camera.setDeadzone(200, 400);
    camera.startFollow(this.player);
  }

  update() {
    const walkVel = 160;
    const walkAccel = 800;
    const iceAccel = 120;

    const onIce = this.player.getData('onIce');

    // keyboard controls
    if (this.buttons.isDown('left')) {
      if (onIce) {
        this.player.setAccelerationX(0-iceAccel);
      } else {
        if (this.player.body.velocity.x > 0-walkVel) {
          this.player.setAccelerationX(0-walkAccel);
          if (this.player.body.velocity.x > 0) {
            this.player.setAccelerationX(0-walkAccel*3);
          }
        } else {
          this.player.setAccelerationX(0);
        }
      }
      this.player.anims.play('left', true);

    } else if (this.buttons.isDown('right'))  {
      if (onIce) {
        this.player.setAccelerationX(iceAccel);
      } else {
        if (this.player.body.velocity.x < walkVel) {
          this.player.setAccelerationX(walkAccel);
          if (this.player.body.velocity.x < 0) {
            this.player.setAccelerationX(walkAccel*3);
          }
        } else {
          this.player.setAccelerationX(0);
        }
      }
      this.player.anims.play('right', true);

    } else {
      if (!onIce) {
        this.player.setVelocityX(0);
      }
      this.player.setAccelerationX(0);
      this.player.anims.play('turn');
    }
    // ice physics!
    if (onIce) {
      this.player.setDragX(0.98);
    } else {
      this.player.setDragX(1);
    }

    if (this.buttons.isDown('jump') && this.player.body.onFloor()) {
        this.player.setVelocityY(-400);
    }

    // kill if out of bounds
    if (this.player.y - 64 > this.physics.world.bounds.bottom) {
      this.playerHit(this.player, null);
    }
  }

  onTileCollide(gameObject, tile, body) {
    if (gameObject.name == "player") {
      if (tile.properties.kill == true) {
        // TODO: why did I have to use `gameObject.scene` instead of just `this`?
        gameObject.scene.playerHit(gameObject, tile);
      }
      gameObject.setData('onIce', tile.properties.ice);
    }
  }

  playerHit(player, killedBy) {
    player.setVelocity(0, 0);
    player.setPosition(this.playerSpawn.x, this.playerSpawn.y);
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
};
