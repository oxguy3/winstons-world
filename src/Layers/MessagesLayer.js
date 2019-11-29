import 'phaser';
import Layer from './Layer';
import AreaMessage from '../Messages/AreaMessage';
import TimedMessage from '../Messages/TimedMessage';

export default class MessagesLayer extends Layer {
  constructor(scene, layer) {
    super(scene, layer);

    const messageObjects = this.layer['objects'];
    this.messages = [];
    messageObjects.forEach(obj => {
      if (obj.type == "AreaMessage") {
        this.messages.push(this.makeAreaMessage(obj));

      } else if (obj.type == "TimedMessage") {
        this.messages.push(this.makeTimedMessage(obj));

      } else {
        if (obj.type == null || obj.type == '') {
          throw "This map has a message without a 'type' set (all messages must have a type)."
        } else {
          throw "This map has a message with an unknown type: "+obj.type;
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
    /*
    // update on-screen message if in a trigger zone
    let newText = '';
    this.group.children.iterate(function(msg) {
      if (this.scene.physics.overlap(this.scene.player, msg)) {
        newText = msg.getData('text');
      }
    }, this);
    this.scene.ui.setMessage(newText);
    // if (newText != oldText && oldText != '') {
    //   let tw = this.tweens.add({
    //     targets: player,
    //     alpha: 1,
    //     duration: 100,
    //     ease: 'Linear',
    //     repeat: 5,
    //   });
    // }
    */
  }

  /**
   * Creates an AreaMessage from a TiledObject
   *
   * @param {Phaser.Types.Tilemaps.TiledObject} obj - message object
   */
  makeAreaMessage(obj) {
    if (obj.rectangle !== true) {
      throw 'AreaMessages must be rectangles; other shapes are not supported.';
    }
    let props = [];
    obj.properties.forEach(prop => {
      props[prop.name] = prop.value;
    });
    const text = props['text'];
    if (text == null) {
      throw "This map has an AreaMessage without a 'text' property set."
    }

    const message = new AreaMessage(this.scene, text, obj.x, obj.y, obj.width, obj.height, props['repeat']);

    return message;
  }

  /**
   * Creates an TimedMessage from a TiledObject
   *
   * @param {Phaser.Types.Tilemaps.TiledObject} obj - message object
   */
  makeTimedMessage(obj) {
    if (obj.rectangle !== true) {
      throw 'TimedMessages must be rectangles; other shapes are not supported.';
    }
    let props = [];
    obj.properties.forEach(prop => {
      props[prop.name] = prop.value;
    });
    const text = props['text'];
    if (text == null) {
      throw "This map has a TimedMessage without a 'text' property set."
    }
    const duration = props['duration'];
    if (duration == null) {
      throw "This map has a TimedMessage without a 'duration' property set."
    }

    const message = new TimedMessage(this.scene, text, duration, obj.x, obj.y, obj.width, obj.height, props['repeat']);

    return message;
  }
}
