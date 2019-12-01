/**
 * Class to manage a background music track for a Scene
 */
const DEFAULT_CONFIG = { volume: 0.4, loop: true };

export default class BackgroundMusicManager {

  /**
   * @param {Phaser.Scene} scene - reference to scene
   * @param {string} key - id of the sound asset to be played
   * @param {Phaser.Types.Sound.SoundConfig} config - optional
   */
  constructor(scene, key, config=DEFAULT_CONFIG) {
    this.scene = scene;
    this.key = key;
    this.music = this.scene.game.addMusic(this.key, config);

    // handle scene events
    for (const evt of ['pause', 'resume', 'shutdown', 'sleep', 'wake']) {
      scene.events.addListener(evt, function() {
        this.handleEvent(evt);
      }, this);
    }
  }

  /**
   * @param {string} key - id of the sound asset to be played
   * @param {Phaser.Types.Sound.SoundConfig} config - optional
   */
  switchMusic(key, config=DEFAULT_CONFIG) {
    return this.music.then(function(music) {
      const isPlaying = music.isPlaying;
      this.key = key;
      music.stop();
      music.destroy();

      music = this.scene.sound.add(key, config);

      // if the old track was playing, start the new track immediately
      if (isPlaying) {
        music.play();
      }
    });
  }

  handleEvent(type) {
    switch (type) {
      case 'pause':
        this.pause();
        break;
      case 'resume':
        this.resume();
        break;
      case 'shutdown':
      case 'sleep':
        this.stop();
        break;
      case 'wake':
        this.play();
        break;
      default:
        throw 'Unknown event type: ' +type;
        break;
    }
  }

  play() {
    return this.music.then(function(music) {
      return music.play({ volume: 0.4 });
    });
  }

  stop() {
    return this.music.then(function(music) {
      return music.stop();
    });
  }

  resume() {
    return this.music.then(function(music) {
      return music.resume();
    });
  }

  pause() {
    return this.music.then(function(music) {
      return music.pause();
    });
  }

  get isPlaying() {
    return this.music.then(function(music) {
      return music.isPlaying;
    });
  }

  get isPaused() {
    return this.music.then(function(music) {
      return music.isPaused;
    });
  }

  get duration() {
    return this.music.then(function(music) {
      return music.duration;
    });
  }

}
