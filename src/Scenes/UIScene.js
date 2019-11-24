export default class UIScene extends Phaser.Scene {

  constructor () {
    super({ key: 'ui' });
  }

  create (data) {
    this.gs = data.gs;

    this.fpsCounter = this.add.text(10, 10, '', {
      font: '14px Arial',
      fill: '#00ff00',
      stroke: '#000000',
      strokeThickness: 4
    });


    this.messageText = this.make.text({
      x: 100,
      y: 550,
      text: '',
      style: {
        font: '18px sans-serif',
        fill: '#ffffff',
        backgroundColor: '#000000',
        wordWrap: { width: 600 }
      }
    });
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
  }
}
