import 'phaser';

export default class Message {
  constructor(scene, text, repeat=-1) {
    this.scene = scene;
    this.text = text;
    this.repeat = repeat;

    this.visible = false;
    this.destroyed = false;
    this.repeated = 0;
    this.events = new Phaser.Events.EventEmitter();
  }

  update(time, delta) {}

  show() {
    // make sure we're not overdue for being destroyed
    if (this.repeat != -1 && this.repeated > this.repeat) {
      this.destroy();
    } else if (!this.destroyed) {
      this.events.emit('show');
      this.repeated++;
    }
    this.visible = true;
  }

  hide() {
    if (!this.destroyed) {
      this.events.emit('hide');
      if (this.repeat != -1 && this.repeated >= this.repeat) {
        this.destroy();
      }
    }
    this.visible = false;
  }

  destroy() {
    this.destroyed = true;
    this.events.emit('destroy');
    this.events.destroy();
  }
}
