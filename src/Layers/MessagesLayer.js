import 'phaser';
import Layer from './Layer';

export default class MessagesLayer extends Layer {
  constructor(scene, layer) {
    super(scene, layer);

    const messageObjects = this.layer['objects'];
    let messageZones = [];
    messageObjects.forEach(msg => {
      if (msg.type == "AreaMessage") {
        if (msg.rectangle !== true) {
          throw 'AreaMessages must be rectangles; other shapes are not supported.';
        }
        const zone = new Phaser.GameObjects.Zone(this.scene, msg.x, msg.y, msg.width, msg.height);
        zone.setOrigin(0,0);
        msg.properties.forEach(prop => {
          zone.setData(prop.name, prop.value);
        });
        if (zone.getData('text') == null) {
          throw "This map has a message without a 'text' property set."
        }
        messageZones.push(zone);

      } else {
        if (msg.type == null || msg.type == '') {
          throw "This map has a message without a 'type' set (all messages must have a type)."
        } else {
          throw "This map has a message with an unknown type: "+msg.type;
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
    this.group.addMultiple(messageZones, true);
  }

  update(time, delta) {
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
  }
}
