import 'phaser';
import Layer from './Layer';
import AreaMessage from '../Messages/AreaMessage';
import TimedMessage from '../Messages/TimedMessage';

export default class MessagesLayer extends Layer {
  constructor(scene, layer, tilemap) {
    super(scene, layer, tilemap);
    this.name = "Messages";

    const messageObjects = this.layer['objects'];
    this.messages = [];
    messageObjects.forEach(obj => {
      if (obj.type == "AreaMessage") {
        this.messages.push(this.makeAreaMessage(obj));

      } else if (obj.type == "TimedMessage") {
        this.messages.push(this.makeTimedMessage(obj));

      } else {
        if (obj.type == null || obj.type == '') {
          throw this.makeError("Missing 'type'", obj);
        } else {
          throw this.makeError("Unknown 'type'", obj);
        }
      }
    });

    // add collision for messages
    this.group = this.scene.physics.add.group({
      visible: true,
      allowDrag: false,
      allowGravity: false,
      allowRotation: false,
      immovable: true
    });
    this.group.addMultiple(this.messages.map(msg => msg.obj), true);

    this.scene.ui.initMessages(this.messages);
    this.scene.events.on('sleep', function() {
      for (const msg of this.messages) {
        if (msg.visible) {
          msg.hide();
        }
      }
    }, this);
  }

  update(time, delta) {
    for (const msg of this.messages) {
      msg.update(time, delta);
    }
  }

  /**
   * Parse all properties and validate the universal ones (text and repeat)
   *
   * @param {Phaser.Types.Tilemaps.TiledObject} obj - message object
   * @returns {object} properties
   */
  parseProperties(obj) {
    if (obj.rectangle !== true) {
      throw this.makeError("All messages must be rectangles", obj);
    }
    let props = {};
    obj.properties.forEach(prop => {
      props[prop.name] = prop.value;
    });
    if (props.text == null) {
      throw this.makeError("Missing 'text' property", obj);
    }
    if (props.repeat == null) {
      throw this.makeError("Missing 'repeat' property", obj);
    }
    return props;
  }

  /**
   * Creates an AreaMessage from a TiledObject
   *
   * @param {Phaser.Types.Tilemaps.TiledObject} obj - message object
   * @returns {AreaMessage}
   */
  makeAreaMessage(obj) {
    const props = this.parseProperties(obj);

    const message = new AreaMessage(this.scene, props.text, obj.x, obj.y, obj.width, obj.height, props.repeat);

    return message;
  }

  /**
   * Creates an TimedMessage from a TiledObject
   *
   * @param {Phaser.Types.Tilemaps.TiledObject} obj - message object
   * @returns {TimedMessage}
   */
  makeTimedMessage(obj) {
    const props = this.parseProperties(obj);
    if (props.duration == null) {
      throw this.makeError("Missing 'duration' property", obj);
    }

    const message = new TimedMessage(this.scene, props.text, props.duration, obj.x, obj.y, obj.width, obj.height, props.repeat);

    return message;
  }
}
