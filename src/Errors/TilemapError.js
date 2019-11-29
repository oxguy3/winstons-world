import 'phaser';
/**
 * Error indicating that the tilemap data is invalid. Can optionally include
 * the layer and object which were invalid
 */
export default class TilemapError extends Error {
  /**
   * @param {Phaser.Tilemaps.Tilemap} tilemap
   * @param {(Phaser.Tilemaps.ObjectLayer|Phaser.Tilemaps.DynamicTilemapLayer|Phaser.Tilemaps.StaticDynamicLayer} [layer]
   * @param {Phaser.Types.Tilemap.TiledObject} [obj]
   */
  constructor(tilemap, layer=null, obj=null, ...params) {
    super(...params);
    this.tilemap = tilemap;
    this.layer = layer;
    this.obj = obj;

    let item = '';
    let suffix = '';
    if (obj != null) {
      item = `${obj.type} object #${this.obj.id}`;
      suffix = ` (${this.layer.name} layer on ${this.tilemap.scene.key} map)`
    } else if (layer != null) {
      item = `layer '${this.layer.name}'`;
      suffix = ` (map ${this.tilemap.scene.key})`
    } else {
      item = `map '${this.tilemap.scene.key}'`
    }
    this.message = `${this.message} on ${item}${suffix}`;

    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, TilemapError);
    }

    this.name = 'TilemapError';
  }
}
