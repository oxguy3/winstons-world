import 'phaser';

export default class Mob extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, 'placeholder');
    this.name = this.constructor.name;
    this.spawnX = x;
    this.spawnY = y;
    this.onIce = false;
    this.alive = true;

    this.killPlayer = false;
  }

  /**
   * Called after physics have been added to this game object
   */
  init() {
    // basic properties
    this.setOrigin(0.5, 1); // center bottom
    this.setBounce(0.15);
    this.setDamping(true);
    this.setMaxVelocity(320);
    this.setCollideWorldBounds(true);

    // movement constants
    this.walkVel = 160;
    this.walkAccel = this.walkVel * 5;
    this.iceAccel = 120;
  }

  /**
   * Called every time the Scene updates (in other words, every game tick).
   * See Phaser.Scene.update() for parameter details.
   */
  update(time, delta) {
    let desires;

    if (this.alive) {
      desires = this.getMovementDesires();
    } else {
      // dead mobs cannot exercise free will
      desires = {
        left: false,
        right: false,
        jump: false
      };
    }

    this.updateMovement(desires);
    this.updateAnimation(desires);
  }

  /**
   * Returns an object that represents how the mob intends to move at this
   * instant. This is used to calculate movement on every game tick. This
   * method should be overriden by every class extending Mob.
   */
  getMovementDesires() {
    return {
      left: false,
      right: false,
      jump: false
    };
  }

  /**
   * Handles movement based on desires. This method should NOT be overriden;
   * instead, override the getMovementDesires() method.
   */
  updateMovement(desires) {

    if (desires.left) {
      if (this.onIce) {
        this.setAccelerationX(0-this.iceAccel);
      } else {
        if (this.body.velocity.x > 0-this.walkVel) {
          this.setAccelerationX(0-this.walkAccel);
          if (this.body.velocity.x > 0) {
            this.setAccelerationX(0-this.walkAccel*3);
          }
        } else {
          this.setAccelerationX(0);
        }
      }

    } else if (desires.right)  {
      if (this.onIce) {
        this.setAccelerationX(this.iceAccel);
      } else {
        if (this.body.velocity.x < this.walkVel) {
          this.setAccelerationX(this.walkAccel);
          if (this.body.velocity.x < 0) {
            this.setAccelerationX(this.walkAccel*3);
          }
        } else {
          this.setAccelerationX(0);
        }
      }

    } else {
      if (!this.onIce) {
        this.setVelocityX(0);
      }
      this.setAccelerationX(0);
    }
    if (desires.jump && this.body.onFloor()) {
      this.setVelocityY(-400);
    }

    // ice physics!
    if (this.onIce) {
      this.setDragX(0.98);
    } else {
      this.setDragX(1);
    }

    // kill if out of bounds
    if (this.y - 64 > this.scene.physics.world.bounds.bottom) {
      this.damage(this.scene.physics.world);
    }
  }

  updateAnimation(desires) {

    if (desires.left || desires.right) {
      this.playAnim('walk', true);
      this.setFlipX(desires.left);

    } else {
      this.playAnim('stand');
    }

    // jump animation
    if (!this.body.onFloor()) {
      if (this.body.velocity.y > 0) {
        this.playAnim('jump');
      } else {
        this.playAnim('fall');
      }
    }

  }

  playAnim(animName, ignoreIfPlaying = false, startFrame = 0) {
    const key = this.name + ':' + animName;
    return this.play(key, ignoreIfPlaying, startFrame);
  }

  damage(damager) {
    this.alive = false;
    this.setTint(0xff0000);
  }

  onCollide(obj) {}

  onTileCollide(tile) {
    if (tile.properties.kill == true) {
      gameObject.damage(tile);
    }
    this.onIce = tile.properties.ice;
  }
}
