import 'phaser';
import WalkingMob from './WalkingMob';

const DEPTH = 100;

export default class Player extends WalkingMob {
  constructor(scene, x, y) {
    super(scene, x, y, 'player');
    this.name = 'Player';

    // movement constants
    this.walkVel = 160;
    this.iceAccel = 120;
  }

  init(properties) {
    super.init(properties);

    // basic properties
    this.setSize(20, 45);
    this.setOffset(6, 3);
    this.setDepth(DEPTH);
  }

  getMovementDesires() {
    // this is a REALLY HACKY way to force onIce to always be true when update()
    // is called
    if (this.scene.game.settings.alwaysIce) {
      this.onIce = true;
    }
    const isLeftDown = this.scene.buttons.isDown('left');
    const isRightDown = this.scene.buttons.isDown('right');
    return {
      left: this.scene.game.settings.flippedControls ? isRightDown : isLeftDown,
      right: this.scene.game.settings.flippedControls ? isLeftDown : isRightDown,
      jump: this.scene.buttons.isDown('jump')
    };
  }

  damage(attacker) {
    super.damage(attacker);
    // sound effect
    this.scene.game.playSfx('sfx_death', { volume: 0.7 });

    // clear UI so death animation is fully visible
    this.scene.ui.unsetMessage();

    this.scene.time.delayedCall(1000, function() {
      const duration = 500;
      this.scene.cameras.main.fadeOut(duration);
      this.scene.cameras.main.once('camerafadeoutcomplete', function(camera, fade) {
        if (this.scene.game.settings.isHard) {
          // hard mode: reset the entire level
          this.scene.scene.restart();
        } else {
          // easy mode: respawn player at start of level
          this.scene.cameras.main.fadeIn(duration);

          // remake player object
          this.scene.player = this.scene.layers.mobs.quickMake(this.name, this.spawnX, this.spawnY, this.properties);
          this.scene.cameras.main.startFollow(this.scene.player);
          this.destroy();
        }
      }, this);
    }, [], this);
  }

  onMobCollide(obj) {
    super.onMobCollide(obj);

    if (obj.vulnerableHead && obj.body.touching.up && this.body.touching.down) {
      obj.damage(this);
      this.setVelocityY(-0.7 * this.jumpVel);

      this.scene.game.playSfx('sfx_enemy_stomp', { volume: 0.7 });
    } else if (obj.killPlayer && obj.alive) {
      this.damage(obj);
    }
  }
}
