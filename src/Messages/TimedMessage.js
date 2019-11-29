import 'phaser';
import ObjectMessage from './ObjectMessage';

/**
 * A timed message triggered by the player entered an in-game zone
 *
 * For a timed message with no physics trigger, see EventMessage.
 */
export default class TimedMessage extends ObjectMessage {
  constructor(scene, text, duration, x, y, width, height, repeat) {
    const zone = new Phaser.GameObjects.Zone(scene, x, y, width, height);
    zone.setOrigin(0, 0);

    super(scene, text, zone, repeat);

    this.duration = duration;
    this.timer = this.scene.time.addEvent({ paused: true });
  }

  update(time, delta) {
    let isOverlap = this.scene.physics.overlap(this.scene.player, this.obj);
    if (isOverlap && !this.isOverlap) {
      this.show();
    }
    this.isOverlap = isOverlap;
  }

  show() {
    super.show();
    this.timer.reset({
      delay: this.duration,
      callbackScope: this,
      callback: this.hide
    });
  }

}
