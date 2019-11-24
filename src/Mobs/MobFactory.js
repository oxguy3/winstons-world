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
    this.scene.physics.add.existing(mob, false);
    mob.body.onCollide = true;

    // call the mob's setup function
    mob.init();

    // add to the scene's mobs list
    this.scene.mobs.push(mob);

    return mob;
  }
}
