import 'phaser';

export default class ButtonHandler { // extends Phaser.Events.EventEmitter
  constructor(input) {
    // super();
    this.input = input;
    console.log(this.input);
    this.mappings = {
      up: {
        keys: [ 'W', 'UP' ],
        pad: [ 'up' ]
      },
      down: {
        keys: [ 'S', 'DOWN' ],
        pad: [ 'down' ]
      },
      left: {
        keys: [ 'A', 'LEFT' ],
        pad: [ 'left' ]
      },
      right: {
        keys: [ 'D', 'RIGHT' ],
        pad: [ 'right' ]
      },
      action: {
        keys: [ 'SPACE', 'ENTER' ],
        pad: [ 'A' ]
      },
      jump: {
        keys: [ 'SPACE', 'W', 'UP' ],
        pad: [ 'up', 'A' ]
      },
      interact: {
        keys: [ 'E' ],
        pad: [ 'B' ]
      },
      sprint: {
        keys: [ 'SHIFT' ],
        pad: [ 'R1' ]
      },
    };
    let allKeys = [];
    for (const mapping of Object.values(this.mappings)) {
      allKeys = allKeys.concat(mapping.keys);
    }
    this.keys = this.input.keyboard.addKeys(allKeys.join());
  }

  isDown(button) {
    const mapping = this.mappings[button];
    if (typeof mapping === 'undefined') {
      throw 'Unknown button name';
    }

    // handle keyboard
    for (const k in mapping.keys) {
      if (this.keys[mapping.keys[k]].isDown) {
        return true;
      }
    }

    // handle gamepad #1 (we ignore all other gamepads)
    let pad1 = this.input.gamepad.pad1;
    if (typeof pad1 !== 'undefined') {
      for (const b in mapping.pad) {
        if (this.input.gamepad.pad1[mapping.pad[b]]) {
          return true;
        }
      }
    }

    return false;
  }

}
