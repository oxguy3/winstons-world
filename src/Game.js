import Phaser from "phaser";
import config from './config';
import UserSettings from './Utils/UserSettings'
import GameScene from './Scenes/GameScene';
import BootScene from './Scenes/BootScene';
import TitleScene from './Scenes/TitleScene';
import OptionsScene from './Scenes/OptionsScene';
import UIScene from './Scenes/UIScene';
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

    for (const level of levels.list) {
      this.scene.add(level, new GameScene(level));
    }
    this.scene.start('boot');
  }

  findGameScene() {
    let gameScene = null;
    for (const scene of this.scene.getScenes(true)) {
      if (scene instanceof GameScene) {
        gameScene = scene;
        break;
      }
    }
    return gameScene;
  }

  get levels() {
    return levels.list;
  }

  get level() {
    let level = this.findGameScene();
    if (level != null) {
      return level.key;
    } else {
      return null;
    }
  }

  set level(key) {
    let level = this.findGameScene();
    if (level == null) {
      console.error("Can't switch levels when no level is active");
    } else {
      this.scene.switch(level.key, key);
    }
  }
}

window.game = new Game();
