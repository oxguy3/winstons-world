import BackgroundLayer from './BackgroundLayer';
import MessagesLayer from './MessagesLayer';
import MobsLayer from './MobsLayer';
import PlatformsLayer from './PlatformsLayer';

export default class LayerFactory {
  constructor(scene, map, tileset) {
    this.scene = scene;
    this.map = map;
    this.tileset = tileset;
  }

  background() {
    return this.dynamicLayer('Background', BackgroundLayer);
  }

  messages() {
    return this.objectLayer('Messages', MessagesLayer);
  }

  mobs() {
    return this.objectLayer('Mobs', MobsLayer);
  }

  platforms() {
    return this.dynamicLayer('Platforms', PlatformsLayer);
  }

  dynamicLayer(name, clazz) {
    let layer = null;
    const dynamicLayer = this.map.createDynamicLayer(name, this.tileset, 0, 0);
    if (dynamicLayer != null) {
      layer = new clazz(this.scene, dynamicLayer);
    }
    return layer;
  }

  objectLayer(name, clazz) {
    let layer = null;
    const objectLayer = this.map.getObjectLayer(name);
    if (objectLayer != null) {
      layer = new clazz(this.scene, objectLayer);
    }
    return layer;
  }
}
