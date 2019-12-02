import 'phaser';
import WalkingMob from './WalkingMob';

export default class Player extends WalkingMob {
  constructor(scene, x, y) {
    super(scene, x, y, 'player');
    this.name = 'Player';

    // movement constants
    this.walkVel = 160;
    this.iceAccel = 120;
  }

  init() {
    super.init();

    // basic properties
    this.setSize(20, 45);
    this.setOffset(6, 3);
    this.setDepth(100);
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
      this.scene.time.delayedCall(500, function() {
        this.scene.scene.restart();
      }, [], this);
    }, [], this);

    // // reset position and movement
    // this.setVelocity(0, 0);
    // this.setPosition(this.spawnX, this.spawnY);
    // this.onIce = false;
    //
    // // sound effect
    // this.scene.game.playSfx('sfx_death', { volume: 0.7 });
    //
    // // flashing animation
    // this.setAlpha(0);
    // let tw = this.scene.tweens.add({
    //   targets: this,
    //   alpha: 1,
    //   duration: 100,
    //   ease: 'Linear',
    //   repeat: 5,
    // });
    //
    // // camera shake
    // this.scene.cameras.main.shake(250, 0.005);
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
