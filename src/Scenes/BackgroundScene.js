import 'phaser';

export default class BackgroundScene extends Phaser.Scene {

  constructor () {
    super({ key: 'background' });
  }

  create (data) {
    this.gs = data.gs;

    const camera = this.cameras.main;
    camera.setRoundPixels(true);
    camera.setOrigin(0,0);

    const gameCamera = this.gs.cameras.main;
    const bounds = this.gs.physics.world.bounds;
    this.sprite = this.add.tileSprite(
      bounds.x,
      camera.y,
      bounds.width,
      camera.height,
      this.gs.data.get('background')
    );
    this.sprite.setOrigin(0,0);
  }

  update(time, delta) {
    if (this.gs) {
      const gameCamera = this.gs.cameras.main;
      this.sprite.tilePositionX = gameCamera.scrollX / 8;
    }
  }
}
