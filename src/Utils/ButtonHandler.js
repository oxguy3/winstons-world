import 'phaser';

export default class ButtonHandler { // extends Phaser.Events.EventEmitter
  constructor(input) {
    // super();
    this.input = input;
    this.mappings = {
      up: {
        keys: [ 'W', 'UP' ],
        pad: [ 'up', 12 ],
        // leftStick: 'up',
        char: 'button_up'
      },
      down: {
        keys: [ 'S', 'DOWN' ],
        pad: [ 'down', 13 ],
        // leftStick: 'down',
        char: 'button_down'
      },
      left: {
        keys: [ 'A', 'LEFT' ],
        pad: [ 'left', 14 ],
        // leftStick: 'left',
        char: 'button_left'
      },
      right: {
        keys: [ 'D', 'RIGHT' ],
        pad: [ 'right', 15 ],
        // leftStick: 'right',
        char: 'button_right'
      },
      action: {
        keys: [ 'SPACE', 'ENTER' ],
        pad: [ 'A' ],
        char: 'button_a'
      },
      jump: {
        keys: [ 'SPACE', 'W', 'UP' ],
        pad: [ 'A' ],
        char: 'button_a'
      },
      action2: {
        keys: [ 'E' ],
        pad: [ 'X' ],
        char: 'button_x'
      },
      action3: {
        keys: [ 'R' ],
        pad: [ 'Y' ],
        char: 'button_y'
      },
      pause: {
        keys: [ 'ESC', 'P' ],
        pad: [ 8, 9 ],
        char: 'dpad_left'
      }
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
      for (const b of mapping.pad) {
        if (typeof b === 'number') {
          if (pad1.isButtonDown(b)) {
            return true;
          }
        } else {
          if (this.input.gamepad.pad1[b]) {
            return true;
          }
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
