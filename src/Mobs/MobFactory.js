import Player from './Player';
import DinoDog from './DinoDog';

const classes = { Player, DinoDog };

export default class MobFactory {
  /**
   * @param {GameScene} scene
   */
  constructor(scene) {
    this.scene = scene;
  }

  /**
   * Adds a mob to the world
   *
   * @param {string} type - name of mob class
   * @param {number} x - x coordinate to spawn at
   * @param {number} y - y coordinate to spawn at
   */
  make(type, x, y) {
    // get the JS class representing this mob
    const mobClass = classes[type];
    if (typeof mobClass !== 'function') {
      throw 'Unknown mob type: ' + type;
    }

    // instantiate the mob
    let mob = new mobClass(this.scene, x, y);

    // make Phaser handle this as a Sprite (e.g. animations, etc)
    this.scene.sys.displayList.add(mob);
    this.scene.sys.updateList.add(mob);

    // add a physics body and enable collision
    this.scene.mobs.add(mob, false);
    mob.body.onCollide = true;

    // call the mob's setup function
    mob.init();

    return mob;
  }

  makeFromSpawn(spawn) {
    let mob = this.make(spawn.type, spawn.x, spawn.y);

    // transfer properties from Tiled -- this MUST happen after mob.init()
    if (typeof spawn.properties !== 'undefined') {
      spawn.properties.forEach(prop => {
        mob.setData(prop.name, prop.value);
      });
    }
    return mob;
  }
}
