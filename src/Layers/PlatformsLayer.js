import 'phaser';
import Layer from './Layer';

export default class PlatformsLayer extends Layer {
  constructor(scene, layer, tilemap) {
    super(scene, layer, tilemap);
    this.name = "Platforms";

    this.layer.setCollisionByProperty({ collides: true });

    // set world bounds and configure collision
    const world = this.scene.physics.world;
    world.setBounds(this.layer.x, this.layer.y, this.layer.width, this.layer.height);
    world.setBoundsCollision(true, true, true, false);
  }
}
