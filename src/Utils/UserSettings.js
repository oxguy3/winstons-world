import localforage from "localforage";

const types = {
  // overrides the starting scene of the game, as a shortcut for level designers
  startScene: { default: 'title' },
  // the last level the user played
  lastLevel: { default: null },

  // game difficulty
  isHard: { default: false },

  // narrator's punishments
  alwaysIce: { default: false },
  flippedControls: { default: false },

  // audio settings
  volumeMaster: { default: 1.0 },
  volumeMusic: { default: 1.0 },
  volumeSfx: { default: 1.0 },
  muteMaster: { default: false },
  muteMusic: { default: false },
  muteSfx: { default: false }
};

export default class UserSettings {

  constructor() {
    localforage.config({
      name: 'ktbgame'
    });

    this.data = {};

    // create getters/setters for all known properties
    for (const type in types) {
      Object.defineProperty(this, type, {
        get: function() {
          return this.get(type);
        },
        set: function(value) {
          if (value == null) { return this.remove(type); }
          else { return this.set(type, value); }
        }
      });
    }
  }

  init() {
    let promises = [];
    for (const type in types) {
      const promise = localforage.getItem(type).then(function(value) {
        let cleanValue;
        if (value == null && types[type] != null) {
          cleanValue = types[type].default;
        } else {
          cleanValue = value;
        }
        this.data[type] = cleanValue;
      }.bind(this));
      promises.push(promise);
    }
    return Promise.all(promises);
  }

  get(key) {
    return this.data[key];
  }

  set(key, value, callback) {
    this.data[key] = value;
    return localforage.setItem(key, value, callback);
  }

  remove(key, callback) {
    delete this.data[key];
    return localforage.removeItem(key, callback);
  }

  get types() {
    return types;
  }
}
