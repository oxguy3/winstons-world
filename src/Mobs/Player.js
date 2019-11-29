import 'phaser';
import WalkingMob from './WalkingMob';

export default class Player extends WalkingMob {
  constructor(scene, x, y) {
    super(scene, x, y, 'player');
    this.name = 'Player';

    // movement constants
    this.walkVel = 160;
    this.iceAccel = 120;
  }

  init() {
    super.init();

    // basic properties
    this.setSize(20, 45);
    this.setOffset(6, 3);
    this.setDepth(100);
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
    this.setVelocity(0, 0);
    this.setPosition(this.spawnX, this.spawnY);
    this.onIce = false;

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

  onMobCollide(obj) {
    super.onMobCollide(obj);

    if (obj.vulnerableHead && obj.body.touching.up && this.body.touching.down) {
      obj.damage(this);
      this.setVelocityY(-0.7 * this.jumpVel);
    } else if (obj.killPlayer && obj.alive) {
      this.damage(obj);
    }
  }
}
