import 'phaser';
import Mob from './Mob';

export default class Player extends Mob {
  constructor(scene, x, y) {
    super(scene, x, y);

    // movement constants
    this.walkVel = 160;
    this.iceAccel = 120;
  }

  init() {
    super.init();

    // basic properties
    this.setSize(20, 48);
    this.setOffset(6, 0);
    this.setDepth(100);
  }

  update(time, delta) {
    super.update(time, delta);
  }

  getMovementDesires() {
    return {
      left: this.scene.buttons.isDown('left'),
      right: this.scene.buttons.isDown('right'),
      jump: this.scene.buttons.isDown('jump')
    };
  }

  damage(attacker) {
    // reset position and movement
    this.setPosition(this.spawnX, this.spawnY);
    this.onIce = false;
    this.setVelocity(0, 0);

    // flashing animation
    this.setAlpha(0);
    let tw = this.scene.tweens.add({
      targets: this,
      alpha: 1,
      duration: 100,
      ease: 'Linear',
      repeat: 5,
    });

    // camera shake
    this.scene.cameras.main.shake(250, 0.005);
  }

  onCollide(obj) {
    if (obj.killPlayer) {
      this.damage(obj);
    }
  }
}
