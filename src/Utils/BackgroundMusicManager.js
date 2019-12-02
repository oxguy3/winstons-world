/**
 * Class to manage a background music track for a Scene
 */
const DEFAULT_CONFIG = { volume: 0.5, loop: true };

export default class BackgroundMusicManager {

  /**
   * @param {Phaser.Scene} scene - reference to scene
   * @param {string} key - id of the sound asset to be played
   * @param {Phaser.Types.Sound.SoundConfig} config - optional
   */
  constructor(scene, key, config=DEFAULT_CONFIG) {
    this.scene = scene;
    this.key = key;

    let newConfig = {};
    Object.assign(newConfig, config);
    this.music = this.scene.game.addMusic(this.key, newConfig);

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
   * @returns {boolean} success?
   */
  switchMusic(key, config=DEFAULT_CONFIG) {
    const isPlaying = this.music.isPlaying;
    this.key = key;
    this.music.stop();
    this.music.destroy();

    this.music = this.scene.sound.add(key, config);

    // if the old track was playing, start the new track immediately
    if (isPlaying) {
      return this.music.play();
    } else {
      return true;
    }
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
    return this.music.play();
  }

  stop() {
    return this.music.stop();
  }

  resume() {
    return this.music.resume();
  }

  pause() {
    return this.music.pause();
  }

  destroy() {
    this.music.destroy();
  }

  get isPlaying() {
    return this.music.isPlaying;
  }

  get isPaused() {
    return this.music.isPaused;
  }

  get duration() {
    return this.music.duration;
  }

}
