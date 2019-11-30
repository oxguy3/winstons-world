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
      throw "This button has a 'warpTo' property set to a non-existent level: "+warpTo;
    }

    // validate that if we have a message, we have all necessary properties,
    // and that they're all the right type
    const messageText = this.getData('messageText');
    const messageDuration = this.getData('messageDuration');
    if ((typeof messageText === 'undefined') != (typeof messageDuration === 'undefined')) {
      throw 'All buttons with messages must have both messageText and messageDuration set (this button only has one of them).';
    } else if (!['string', 'undefined'].includes(typeof messageText)) {
      throw 'This button has a messageText that is not a string.';
    } else if (!['number', 'undefined'].includes(typeof messageDuration)) {
      throw 'This button has a messageDuration that is not a number.';
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

    if (messageText != null) {
      const msg = new EventMessage(this.scene, messageText, messageDuration, 1);
      this.scene.ui.addMessage(msg);
      msg.events.on('hide', function() {
        this.scene.game.setScene(warpTo);
      }, this);
      msg.show();

    } else if (warpTo != null) {
      this.scene.game.setScene(warpTo);
    }
  }
}
