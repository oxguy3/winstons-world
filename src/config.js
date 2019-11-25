import 'phaser';

export default {
  type: Phaser.AUTO,
  title: 'Kill the Baby?',
  render: {
    pixelArt: true
  },
  input: {
    keyboard: true,
    gamepad: true
  },
  scale: {
    mode: Phaser.Scale.FIT,
    parent: 'main',
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: 800,
    height: 600
  },
  physics: {
    default: 'arcade'
  }
};
