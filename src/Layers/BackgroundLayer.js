import 'phaser';
import Layer from './Layer';

export default class BackgroundLayer extends Layer {
  constructor(scene, layer, tilemap) {
    super(scene, layer, tilemap);
    this.name = "Background";

    this.layer.forEachTile(function(tile, index, array) {
      tile.tint = 0x888888;
    });
  }
}
