import TilemapError from '../Errors/TilemapError';

export default class Layer {
  constructor(scene, layer, tilemap) {
    this.scene = scene;
    this.layer = layer;
    this.tilemap = tilemap;
  }

  update(time, delta) {}

  makeError(message, obj=null) {
    return new TilemapError(this.tilemap, this, obj, message);
  }
}
