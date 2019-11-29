import 'phaser';
import ObjectMessage from './ObjectMessage';

export default class AreaMessage extends ObjectMessage {
  constructor(scene, text, x, y, width, height, repeat) {
    const zone = new Phaser.GameObjects.Zone(scene, x, y, width, height);
    zone.setOrigin(0, 0);

    super(scene, text, zone, repeat);

    this.isOverlap = false;
  }

  update(time, delta) {
    let isOverlap = this.scene.physics.overlap(this.scene.player, this.obj);
    if (isOverlap && !this.isOverlap) {
      this.show();
    }
    if (!isOverlap && this.isOverlap) {
      this.hide();
    }
    this.isOverlap = isOverlap;
  }

}
