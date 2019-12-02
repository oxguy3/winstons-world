import 'phaser';
import Mob from './Mob';
import EventMessage from '../Messages/EventMessage';

export default class BigButton extends Mob {
  constructor(scene, x, y) {
    super(scene, x, y, 'bigbutton');
    this.name = 'BigButton';
  }

  init(properties) {
    super.init(properties);

    this.setSize(28, 8);
    this.setOffset(2, 24);
    this.setImmovable(true);
    this.body.allowGravity = false;
  }

  update(time, delta) {
    // check if we're still being pressed
    if (this.isPressed && !this.body.touching.up) {
      this.isPressed = false;
    }

    super.update(time, delta);
  }

  ingestData(properties) {
    properties.forEach(prop => {
      let hasValue = prop.value != null;
      switch(prop.type) {
        case "string":
          hasValue = hasValue && prop.value != "";
          break;
        case "int":
          hasValue = hasValue && prop.value != -1;
          break;
      }
      if (hasValue) {
        this.setData(prop.name, prop.value);
      }
    });
  }

  postIngestData() {
    // validate that warpTo level actually exists
    const warpTo = this.getData('warpTo');
    if (typeof warpTo !== 'undefined' && this.scene.scene.get(warpTo) == null) {
      throw this.makeError(`Invalid 'warpTo' value (non-existent level '${warpTo}')`);
    }

    // validate that if we have a message, we have all necessary properties,
    // and that they're all the right type
    const messageText = this.getData('messageText');
    const messageDuration = this.getData('messageDuration');
    if (typeof messageText === 'undefined' && typeof messageDuration !== 'undefined') {
      throw this.makeError(`messageDuration is set, but messageText is not`)
    } else if (typeof messageText !== 'undefined' && typeof messageDuration === 'undefined') {
      throw this.makeError(`messageText is set, but messageDuration is not`)
    } else if (!['string', 'undefined'].includes(typeof messageText)) {
      throw this.makeError('messageText is not a string');
    } else if (!['number', 'undefined'].includes(typeof messageDuration)) {
      throw this.makeError('messageDuration is not a number');
    }
  }

  updateAnimation() {
    this.playAnim(this.isPressed ? 'pressed' : 'unpressed');
  }

  onMobCollide(obj) {
    super.onMobCollide(obj);

    let isPressed = this.body.touching.up && obj.body.touching.down;
    if (this.getData('playerOnly')) {
      isPressed = isPressed && obj == this.scene.player;
    }
    if (isPressed) {
      // if we weren't pressed before now, then we've just been pressed, so
      // activate the button down logic
      if (!this.isPressed) {
        this.onDown();
      }
      this.isPressed = true;
    }
  }

  /**
   * Called when this button is pressed
   */
  onDown() {
    const warpTo = this.getData('warpTo');
    const messageText = this.getData('messageText');
    const messageDuration = this.getData('messageDuration');

    const warpFunc = function() {
      const sound = this.scene.game.addSfx('sfx_level_complete');
      this.scene.time.delayedCall(sound.duration*1000, function() {
        this.scene.game.setScene(warpTo);
      }, [], this);
      if (this.scene.music) {
        this.scene.music.stop();
      }
      sound.play();
    }

    if (messageText != null) {
      const msg = new EventMessage(this.scene, messageText, messageDuration, 1);
      this.scene.ui.addMessage(msg);
      msg.events.on('hide', warpFunc, this);
      msg.show();

    } else if (warpTo != null) {
      warpFunc();
    }

    if (this.getData('enableAlwaysIce')) {
      this.scene.game.settings.set('alwaysIce', true);
    }
    if (this.getData('enableFlippedControls')) {
      this.scene.game.settings.set('flippedControls', true);
    }
  }
}
