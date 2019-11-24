import 'phaser';
import Mob from './Mob';

export default class DinoDog extends Mob {
  constructor(scene, x, y) {
    super(scene, x, y);

    // override Mob defaults
    this.spriteFlipped = true;
    this.killPlayer = true;

    // AI behavior
    this.goLeft = true;
  }

  init() {
    super.init();

    // basic properties
    this.setSize(30, 32);
    this.setOffset(0, 0);

    // data defaults
    this.setData('range', 100);
  }

  update(time, delta) {
    super.update(time, delta);
  }

  getMovementDesires() {
    const range = this.getData('range');
    if (this.x < this.spawnX - range) { this.goLeft = false; }
    if (this.x > this.spawnX + range) { this.goLeft = true; }
    return {
      left: this.goLeft,
      right: !this.goLeft,
      jump: false
    };
  }

  damage(attacker) {
    super.damage(attacker);
  }
}
