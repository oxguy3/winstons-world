import Phaser from "phaser";
import config from './config';
import UserSettings from './Utils/UserSettings'
import GameScene from './Scenes/GameScene';
import BootScene from './Scenes/BootScene';
import TitleScene from './Scenes/TitleScene';
import OptionsScene from './Scenes/OptionsScene';
import UIScene from './Scenes/UIScene';
import ImpossibleStateError from './Errors/ImpossibleStateError';
import '../assets/css/style.css';
import levels from '../assets/levels.json';

class Game extends Phaser.Game {
  constructor () {
    super(config);

    this.settings = new UserSettings();

    this.scene.add('boot', BootScene);
    this.scene.add('title', TitleScene);
    this.scene.add('options', OptionsScene);
    this.scene.add('ui', UIScene);

    for (const key of Object.keys(levels.list)) {
      const config = levels.list[key];
      this.scene.add(key, new GameScene(key, config));
    }
    this.scene.start('boot');
  }

  /**
   * Retrieves the currently active level
   *
   * @returns {(GameScene|undefined)} the level's scene, if there is one
   */
  findGameScene() {
    let gameScenes = [];
    for (const scene of this.scene.getScenes(true)) {
      if (scene instanceof GameScene && !scene.sys.isTransitionOut()) {
        gameScenes.push(scene);
      }
    }
    if (gameScenes.length > 1) {
      throw new ImpossibleStateError("More than one active GameScene!");
    }
    return gameScenes[0];
  }

  get levels() {
    return levels.list;
  }

  /**
   * @returns {string|null} the key of the currently active level
   */
  get level() {
    let level = this.findGameScene();
    if (level != null) {
      return level.key;
    } else {
      return null;
    }
  }

  /**
   * Initiates a transition from the current scene to a new one
   *
   * This setter is convenient for use in the JS console, but otherwise, the
   * setScene(key) method is recommended over this.
   *
   * @param {string} key - key of the new GameScene
   * @returns {(string|undefined)} key of the new GameScene, if the transition
   * was successfully started; else, undefined
   */
  set level(key) {
    const success = this.setScene(key);
    if (!success) {
      console.warn("Failed to set level");
    }
    return success ? key : undefined;
  }

  /**
   * Initiates a transition from the current scene to another
   *
   * @param {string} key - key of the new GameScene
   * @param {number} [fadeDuration] - how long each fade effect should take (in
   * milliseconds). The total duration of the transition will depend on how
   * many fade effects occur (either 1 or 2).
   * @returns {boolean} whether or not the transition was successfully started
   */
  setScene(key, fadeDuration=500) {
    let level = this.findGameScene();
    let scene, duration, sceneName;
    if (level == null) {
      const activeScenes = this.scene.getScenes(true);

      if (activeScenes.length != 1) {
        throw new ImpossibleStateError("There are multiple scenes active, but none of them is a GameScene.");
      }
      scene = activeScenes[0];
      duration = fadeDuration; // no fade out if it's not a GameScene
      sceneName = typeof scene;
    } else {
      scene = level;
      duration = fadeDuration * 2;
      sceneName = `level '${level.key}'`;
    }

    // if this scene is already mid-transition, don't start a new transition
    if (scene.sys.isTransitioning()) {
      console.warn(`Ignoring request to switch out of ${sceneName}, as it was already in the middle of switching.`);
      return false;
    } else {
      scene.scene.transition({
          target: key,
          duration: fadeDuration * 2
      });
    }
    return true;
  }
}

window.game = new Game();
