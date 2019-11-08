import 'phaser';

export default class ButtonHandler { // extends Phaser.Events.EventEmitter
  constructor(input) {
    // super();
    this.input = input;
    console.log(this.input);
    this.mappings = {
      up: {
        keys: [ 'W', 'UP' ],
        pad: [ 'up' ],
        leftStick: 'up'
      },
      down: {
        keys: [ 'S', 'DOWN' ],
        pad: [ 'down' ],
        leftStick: 'down'
      },
      left: {
        keys: [ 'A', 'LEFT' ],
        pad: [ 'left' ],
        leftStick: 'left'
      },
      right: {
        keys: [ 'D', 'RIGHT' ],
        pad: [ 'right' ],
        leftStick: 'right'
      },
      action: {
        keys: [ 'SPACE', 'ENTER' ],
        pad: [ 'A' ]
      },
      jump: {
        keys: [ 'SPACE', 'W', 'UP' ],
        pad: [ 'A' ]
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

    // handle gamepad #1
    // TODO: handle disconnects; maybe make all gamepads work?
    let pad1 = this.input.gamepad.pad1;
    if (typeof pad1 !== 'undefined') {
      for (const b in mapping.pad) {
        if (this.input.gamepad.pad1[mapping.pad[b]]) {
          return true;
        }
      }
      if (typeof mapping.leftStick !== 'undefined') {
        const stickTolerance = 0.1;
        let axis, expectPositive;
        if (mapping.leftStick == 'up') {
          axis = pad1.leftStick.y;
          expectPositive = true;
        } else if (mapping.leftStick == 'down') {
          axis = pad1.leftStick.y;
          expectPositive = false;
        } else if (mapping.leftStick == 'right') {
          axis = pad1.leftStick.x;
          expectPositive = true;
        } else if (mapping.leftStick == 'left') {
          axis = pad1.leftStick.x;
          expectPositive = false;
        }
        let isCorrectSign = (Math.abs(axis) == axis) == expectPositive;
        let isAboveTolerance = Math.abs(axis) >= (1-stickTolerance);
        if (isCorrectSign && isAboveTolerance) {
          return true;
        }
      }
    }

    return false;
  }

}
