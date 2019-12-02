import 'phaser';
import TextUtils from '../Utils/TextUtils';
import ButtonHandler from '../Utils/ButtonHandler';
import Message from '../Messages/Message';

export default class UIScene extends Phaser.Scene {

  constructor () {
    super({ key: 'ui' });
    this.messages = [];
  }

  create (data) {
    this.gs = data.gs;

    // pause button handling
    this.buttons = new ButtonHandler(this.input);
    this.isPauseDown = false;

    this.fpsCounter = this.add.text(10, 10, '', {
      font: '14px sans-serif',
      fill: '#00ff00',
      stroke: '#000000',
      strokeThickness: 4
    });

    this.message = '';

    const camera = this.cameras.main;
    const fontSize = 32;
    const margin = 24;
    const boxStroke = 16;
    const avatarScale = 4;
    const avatarSize = 32 * avatarScale;

    // this.messageBox = this.add.image(this.cameras.main.width/2, this.cameras.main.height, 'dialogBox');
    // this.messageBox.setOrigin(0.5, 1).setScale(2).setVisible(false);
    this.messageBox = this.add.rectangle(
      boxStroke/2,
      camera.height - boxStroke/2,
      camera.width - avatarSize - margin*2 - boxStroke/2,
      (fontSize+1)*3 + margin*2 - boxStroke/2,
      0x3366ff
    ).setOrigin(0, 1).setVisible(false);
    this.messageBox.setStrokeStyle(boxStroke, 0x1a3380);

    this.avatar = this.add.sprite(
      camera.width - margin,
      camera.height - margin/2,
      'commander',
      0
    );
    this.avatar.setOrigin(1, 1).setScale(avatarScale).setVisible(false);
    this.avatar.play('commander_speak');

    const textY = this.messageBox.getBounds().y - boxStroke/2 + margin;
    this.messageText = this.add.bitmapText(margin, textY, 'fool', '', fontSize);
    this.messageText.setOrigin(0, 0).setVisible(false);
    this.messageText.setMaxWidth(camera.width - margin*3 - avatarSize);

    // pause screen
    this.pauseCover = this.add.rectangle(0, 0, camera.width, camera.height, 0x000000);
    this.pauseCover.setOrigin(0,0).setAlpha(0.7).setVisible(false);

    this.pauseText = this.add.bitmapText(camera.width/2, camera.height/2, 'fool', 'PAUSED', 64);
    this.pauseText.setOrigin(0.5, 0.5).setVisible(false);
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

    // animate message text appearing char by char
    if (this.messageText.text.length < this.message.length) {
      const nextChar = [...this.message][this.messageText.text.length];
      this.messageText.setText(this.messageText.text + nextChar);
      // workaround for https://github.com/photonstorm/phaser/issues/4881
      this.messageText._bounds.maxWidth--;
    }

    // if we are pressing pause, and we weren't last tick
    if (!this.isPauseDown && this.buttons.isDown('pause')) {
      const willBePaused = !this.gs.sys.isPaused();
      this.pauseCover.setVisible(willBePaused);
      this.pauseText.setVisible(willBePaused);
      if (willBePaused) {
        this.gs.sys.pause();
        this.anims.pauseAll();
      } else {
        this.gs.sys.resume();
        this.anims.resumeAll();
      }
    }
    this.isPauseDown = this.buttons.isDown('pause');
  }

  /**
   * @param {array.Message} messages
   */
  initMessages(messages) {
    // for (const msg of this.messages) {
    //   msg.events.off('show', null, this);
    //   msg.events.off('hide', null, this);
    //   msg.events.off('destroy', null, this);
    // }
    // this.messages = [];
    for (const msg of messages) {
      this.addMessage(msg);
    }
  }

  addMessage(message) {
    this.messages.push(message);
    message.events.on('show', function() {
      this.currentMessage = message;
      this.setMessage(message.text);
    }, this);
    const hideMessage = function() {
      if (this.currentMessage == message) {
        this.currentMessage = null;
        this.unsetMessage();
      }
    };
    message.events.on('hide', hideMessage, this);
    message.events.on('destroy', hideMessage, this);
  }

  setMessage(text) {
    text = TextUtils.convertSymbols(text);
    const oldText = this.message;
    if (text != oldText) {
      this.message = text;
      this.messageText.setText('');

      const visible = (text != null && text.length != 0);
      this.messageText.setVisible(visible);
      this.messageBox.setVisible(visible);
      this.avatar.setVisible(visible);
    }
  }

  unsetMessage() {
    this.setMessage('');
  }
}
