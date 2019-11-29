import 'phaser';
import Message from './Message';

/**
 * A timed message with no automatic triggers (i.e. show() must be called
 * manually)
 *
 * For a timed message trigger by the player's movements, see TimedMessage.
 */
export default class EventMessage extends Message {
  constructor(scene, text, duration, repeat) {
    super(scene, text, repeat);
    
    this.duration = duration;
    this.timer = this.scene.time.addEvent({ paused: true });
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
