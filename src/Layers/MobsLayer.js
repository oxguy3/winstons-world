import Layer from './Layer';
import Mob from '../Mobs/Mob';
import BigButton from '../Mobs/BigButton';
import DinoDog from '../Mobs/DinoDog';
import Player from '../Mobs/Player';
import Worm from '../Mobs/Worm';

const classes = { BigButton, DinoDog, Player, Worm };

export default class MobsLayer extends Layer {
  constructor(scene, layer) {
    super(scene, layer);

    const mobSpawns = layer['objects'];
    this.group = this.scene.physics.add.group();
    mobSpawns.forEach(spawn => {

      // create the mob, initialize it, add physics, etc
      let mob = this.makeFromSpawn(spawn);

      if (spawn.type == 'Player') {
        if (this.scene.player != null) {
          throw "This map has too many Player spawn points; there must only be one.";
        }
        this.scene.player = mob;
      }
    });
    if (this.scene.player == null) {
      throw "This map is missing a Player spawn point."
    }

    // add collision to mobs
    this.scene.physics.add.collider(this.group, this.scene.platforms.layer, function(objA, objB) {
      if (objA instanceof Mob) { objA.onTileCollide(objB); }
      if (objB instanceof Mob) { objB.onTileCollide(objA); }
    });
    this.scene.physics.add.collider(this.group, this.group, function(objA, objB){
      objA.onMobCollide(objB);
      objB.onMobCollide(objA);
    });
  }

  update(time, delta) {
    for (const mob of this.group.getChildren()) {
      mob.update(time, delta);
    }
  }

  onDamage(mob) {
    this.group.remove(mob);
  }

  /**
   * Adds a mob to the world
   *
   * @param {string} type - name of mob class
   * @param {number} x - x coordinate to spawn at
   * @param {number} y - y coordinate to spawn at
   * @param {object} properties - (optional) custom properties for this mob type
   */
  make(type, x, y, properties={}) {
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
    this.group.add(mob, false);
    mob.body.onCollide = true;

    // call the mob's setup function
    mob.init(properties);

    mob.on('damage', this.onDamage, this);

    return mob;
  }

  /**
   * Adds a mob to the world by retrieving data from a TiledObject
   *
   * @param {Phaser.Types.Tilemaps.TiledObject} spawn - mob spawn object
   */
  makeFromSpawn(spawn) {
    let mob = this.make(spawn.type, spawn.x, spawn.y, spawn.properties);
    return mob;
  }
}
