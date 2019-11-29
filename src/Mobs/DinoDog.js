import 'phaser';
import WalkingMob from './WalkingMob';

export default class DinoDog extends WalkingMob {
  constructor(scene, x, y) {
    super(scene, x, y, 'dinodog');
    this.name = 'DinoDog';

    // override Mob defaults
    this.spriteFlipped = true;
    this.killPlayer = true;
    this.vulnerableHead = true;
  }

  init() {
    super.init();

    // basic properties
    this.setSize(24, 28);
    this.setOffset(4, 4);
  }

  preIngestData() {
    // AI behavior defaults
    this.setData('range', 100);
    this.setData('goLeft', true);
  }

  update(time, delta) {
    super.update(time, delta);
  }

  getMovementDesires() {

    // turn around if we've left the home zone
    const range = this.getData('range');
    if (range != -1) {
      if (this.x < this.spawnX - range) {
        this.data.values.goLeft = false;
      }
      if (this.x > this.spawnX + range) {
        this.data.values.goLeft = true;
      }
    }

    return {
      left: this.data.values.goLeft,
      right: !this.data.values.goLeft,
      jump: false
    };
  }

  damage(attacker) {
    super.damage(attacker);
  }

  onTileCollide(tile) {
    super.onTileCollide(tile);

    // turn around the AI if we're hitting a wall
    if (this.body.touching.left || this.body.blocked.left) {
      this.data.values.goLeft = false;
    }
    if (this.body.touching.right || this.body.blocked.right) {
      this.data.values.goLeft = true;
    }
  }
}
