import Phaser from "phaser";
import config from './config';
import GameScene from './Scenes/GameScene';
import BootScene from './Scenes/BootScene';
import TitleScene from './Scenes/TitleScene';
import OptionsScene from './Scenes/OptionsScene';
import './assets/css/style.css';

class Game extends Phaser.Game {
  constructor () {
    super(config);
    this.scene.add('boot', BootScene);
    this.scene.add('title', TitleScene);
    this.scene.add('options', OptionsScene);
    this.scene.add('game', GameScene);
    this.scene.start('boot');
  }
}

window.game = new Game();
