import 'phaser';
import TilemapError from '../Errors/TilemapError';

/**
 * A game object base class with a number of useful features. Mobs can be kill
 * or be killed; mobs know where they spawned into the world; and mobs'
 * animations can be easily defined in assets/animations.json.
 *
 * See also WalkingMob, a sub-class which adds a simple movement system.
 */
export default class Mob extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, texture = 'placeholder', frame=0) {
    super(scene, x, y, texture, frame);
    this.name = 'Mob';
    this.spawnX = x;
    this.spawnY = y;
    this.alive = true;
    this.onFloorMob = false;
    // Tracks whether the last tile this mob touched was slippery/ice.
    // This value is updated for all Mobs, but is currently only utilized by
    // the WalkingMob class.
    this.onIce = false;
    this.id = -1;

    // PROPERTIES MEANT TO BE OVERRIDDEN
    // Is the sprite facing left in the sprite file?
    this.spriteFlipped = false;
    // Does the player die if they collide with this mob?
    this.killPlayer = false;
    // Does this mob die if the player jumps on its head?
    this.vulnerableHead = false;
  }

  /**
   * Called after physics have been added to this game object
   */
  init(properties) {
    // basic properties
    this.setOrigin(0.5, 1); // center bottom
    this.setDepth(10);

    // physics properties
    this.setCollideWorldBounds(true);

    // import custom properties from Tiled
    this.preIngestData();
    this.ingestData(properties);
    this.postIngestData();
  }

  /**
   * Called before data is ingested from the TiledObject properties. This is
   * ideal for assigning default values before the real data is ingested.
   */
  preIngestData() {}

  /**
   * Ingests data from TiledObject properties. Before overriding this method,
   * see if your use case could be handled by the preIngestData() or
   * postIngestData() methods.
   *
   * @param {array} properties - properties from a TiledObject
   */
  ingestData(properties) {
    if (typeof properties !== 'undefined') {
      properties.forEach(prop => {
        this.setData(prop.name, prop.value);
      });
    }
  }

  /**
   * Called after data is ingested from the TiledObject properties. This is
   * ideal for validating the ingested data.
   */
  postIngestData() {}

  /**
   * Called every time the Scene updates (in other words, every game tick).
   * See Phaser.Scene.update() for parameter details.
   */
  update(time, delta) {

    // check if we're still on a floor mob
    if (this.onFloorMob && !this.body.touching.down) {
      this.onFloorMob = false;
    }

    // kill if out of bounds
    if (this.y - 64 > this.scene.physics.world.bounds.bottom) {
      this.damage(this.scene.physics.world);
    }

    this.updateAnimation();
  }

  playAnim(animName, ignoreIfPlaying = true, startFrame = 0) {
    let key = this.name + ':' + animName;
    if (!this.scene.anims.exists(key)) {
      key = this.name + ':default';
    }
    return this.play(key, ignoreIfPlaying, startFrame);
  }

  getAnimKey() {
    const key = this.anims.getCurrentKey();
    const anim = key.split(':')[1];
    return anim;
  }

  damage(damager) {
    // turns off interactions with other mobs
    this.alive = false;

    // stop animation, flip em belly up, and turn em red
    this.playAnim('die');
    this.setFlipY(true);
    this.setTint(0xff7777);

    // render behind all other mobs
    this.setDepth(1);

    // fall in a satisfying downward arc
    if (typeof this.body == Phaser.Physics.Arcade.Body) {
      this.body.allowGravity = true;
      this.setVelocityY(-200);
    }

    // announce that we are dead (this will make the MobsLayer remove us from collision)
    this.emit('damage', this);
  }

  updateAnimation() {
    this.playAnim('stand', true);
  }

  onMobCollide(obj) {
    // if we're on top of an immovable no-gravity mob, treat it like a floor
    if (this.body.touching.down && obj.body.touching.up) {
      this.onFloorMob = !obj.body.allowGravity && obj.body.immovable;
    }
  }

  onTileCollide(tile) {
    if (tile.properties.kill == true) {
      this.damage(tile);
    }
    this.onIce = tile.properties.ice;
  }

  /**
   * A replacement for Mob.body.onFloor() which also considers this Mob to be on
   * a floor if they are on top of an immovable no-gravity Mob
   */
  onFloor() {
    let onFloor = this.body.onFloor();
    onFloor = onFloor || (this.body.touching.down && this.onFloorMob);
    return onFloor;
  }

  get type() {
    return this.name;
  }

  makeError(message, obj=null) {
    return new TilemapError(this.scene.map, { name: 'Mobs' }, this, message);
  }
}
