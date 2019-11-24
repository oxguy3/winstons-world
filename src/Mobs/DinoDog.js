import 'phaser';
import Mob from './Mob';

export default class DinoDog extends Mob {
  constructor(scene, x, y) {
    super(scene, x, y);
    this.killPlayer = true;
  }

  init() {
    super.init();

    // basic properties
    this.setSize(32, 32);
    this.setOffset(0, 0);
  }

  update(time, delta) {
    super.update(time, delta);
  }

  getMovementDesires() {
    return {
      left: false,
      right: false,
      jump: true
    };
  }

  damage(attacker) {
    super.damage(attacker);
  }
}
