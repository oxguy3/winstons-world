import 'phaser';
import Mob from './Mob';

export default class DinoDog extends Mob {
  constructor(scene, x, y) {
    super(scene, x, y);
    this.name = 'DinoDog';

    // override Mob defaults
    this.spriteFlipped = true;
    this.killPlayer = true;
  }

  init() {
    super.init();

    // basic properties
    this.setSize(30, 32);
    this.setOffset(0, 0);

    // AI behavior defaults
    this.setData('range', 100);
    this.setData('goLeft', true);
  }

  update(time, delta) {
    super.update(time, delta);
  }

  getMovementDesires() {
    const range = this.getData('range');
    if (this.x < this.spawnX - range) { this.data.values.goLeft = false; }
    if (this.x > this.spawnX + range) { this.data.values.goLeft = true; }
    return {
      left: this.data.values.goLeft,
      right: !this.data.values.goLeft,
      jump: false
    };
  }

  damage(attacker) {
    super.damage(attacker);
  }
}
