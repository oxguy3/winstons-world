import 'phaser';
import Mob from './Mob';

export default class Worm extends Mob {
  constructor(scene, x, y) {
    super(scene, x, y, 'worm');
    this.name = 'Worm';

    // override Mob defaults
    this.killPlayer = true;
    this.vulnerableHead = true;
  }

  init() {
    super.init();

    // basic properties
    this.setSize(30, 30);
    this.setOffset(1, 2);
  }

  update(time, delta) {
    super.update(time, delta);
  }
}
