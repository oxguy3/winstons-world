import buttonchars from '../Utils/buttonchars';

export default class UIScene extends Phaser.Scene {

  constructor () {
    super({ key: 'ui' });
  }

  create (data) {
    this.gs = data.gs;

    this.fpsCounter = this.add.text(10, 10, '', {
      font: '14px sans-serif',
      fill: '#00ff00',
      stroke: '#000000',
      strokeThickness: 4
    });

    this.message = '';

    this.messageBox = this.add.image(this.cameras.main.width/2, this.cameras.main.height, 'dialogBox');
    this.messageBox.setOrigin(0.5, 1).setScale(2).setVisible(false);

    const margin = 32;
    const textY = this.cameras.main.height - this.messageBox.displayHeight + margin;
    this.messageText = this.add.bitmapText(margin, textY, 'fool', '', 32);
    this.messageText.setOrigin(0, 0).setVisible(false);
    this.messageText.setMaxWidth(this.cameras.main.width - margin*2);
  }

  update(time, delta) {
    if (this.gs) {
      // update FPS counter
      if (this.gs.debug) {
        const fps = Math.round(this.game.loop.actualFps * 100) / 100
        this.fpsCounter.setText('FPS: ' + fps);
      }
      this.fpsCounter.visible = this.gs.debug;
    }
    if (this.messageText.text.length < this.message.length) {
      const nextChar = [...this.message][this.messageText.text.length];
      this.messageText.setText(this.messageText.text + nextChar);
      // workaround for https://github.com/photonstorm/phaser/issues/4881
      this.messageText._bounds.maxWidth--;
    }
  }

  convertSymbols(text) {
    text = text.replace(/<(.*?)>/g, function(match, p1, offset, str) {
      const index = buttonchars.indexOf(p1);
      if (index != -1) {
        return String.fromCodePoint(57344+index);
      } else {
        return match;
      }
    });
    return text;
  }

  setMessage(text) {
    text = this.convertSymbols(text);
    const oldText = this.message;
    if (text != oldText) {
      this.message = text;
      this.messageText.setText('');
      // this.time.addEvent({
      //   delay: 20,
      //   repeat: this.message.length,
      //   callback: function() {
      //     const nextChar = this.message.charAt(this.messageText.text.length);
      //     this.messageText.setText(this.messageText.text + nextChar);
      //   },
      //   callbackScope: this
      // });

      const visible = (text != null && text.length != 0);
      this.messageText.setVisible(visible);
      this.messageBox.setVisible(visible);
    }
  }
}
