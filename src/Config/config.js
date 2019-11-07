import 'phaser';

export default {
  // TODO: disabling WebGL fixes tile texture bleed, but WebGL would be nice to have
  type: Phaser.AUTO,
  render: {
    pixelArt: true
  },
  scale: {
    mode: Phaser.Scale.FIT,
    parent: 'main',
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: 800,
    height: 600
  },
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 600 },
      debug: true
    }
  }/*,
  scene: {
    preload: preload,
    create: create,
    update: update
  }*/
};
