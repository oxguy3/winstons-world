import 'phaser';
import Mob from './Mob';

export default class WalkingMob extends Mob {
  constructor(scene, x, y, texture, frame) {
    super(scene, x, y, texture, frame);

    // movement constants
    this.walkVel = 120;
    this.jumpVel = 350;
    this.iceAccel = 90;
  }

  init() {
    super.init();

    // physics properties
    // this.setBounce(0.15);
    this.setDamping(true);
    this.setMaxVelocity(this.walkVel * 2, this.scene.physics.world.gravity.y * 2);
    this.walkAccel = this.walkVel * 5;
  }

  /**
   * Called every time the Scene updates (in other words, every game tick).
   * See Phaser.Scene.update() for parameter details.
   */
  update(time, delta) {
    if (this.alive) {
      this.desires = this.getMovementDesires();
    } else {
      // dead mobs cannot exercise free will
      this.desires = {
        left: false,
        right: false,
        jump: false
      };
    }

    this.updateMovement(this.desires);
    super.update(time, delta);
  }

  damage(damager) {
    super.damage(damager);

    // make downward motion based on physics properties
    this.setMaxVelocity(this.walkVel, this.scene.physics.world.gravity.y * 2);
    this.setVelocityY(this.jumpVel * -0.5);
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
    if (desires.jump && this.onFloor()) {
      this.setVelocityY(-1 * this.jumpVel);
    }

    // ice physics!
    if (this.onIce) {
      this.setDragX(0.98);
    } else {
      this.setDragX(1);
    }
  }

  updateAnimation() {

    if (this.desires.left || this.desires.right) {
      this.playAnim('walk');
      this.setFlipX(this.spriteFlipped ? this.desires.right : this.desires.left);

    } else {
      this.playAnim('stand');
    }

    // jump animation
    if (!this.onFloor()) {
      if (this.body.velocity.y > 0) {
        this.playAnim('jump');
      } else {
        this.playAnim('fall');
      }
    }

  }
}
