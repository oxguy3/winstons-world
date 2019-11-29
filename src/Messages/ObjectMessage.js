import 'phaser';
import Message from './Message';

export default class ObjectMessage extends Message {
  constructor(scene, text, obj, repeat=-1) {
    super(scene, text, repeat);
    this.obj = obj;
  }

  destroy() {
    super.destroy();
    this.obj.destroy();
  }
}
