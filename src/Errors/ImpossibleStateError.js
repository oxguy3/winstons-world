/**
 * Error indicating that the game is in a state that shouldn't be possible
 */
export default class ImpossibleStateError extends Error {
  constructor(...params) {
    super(...params);

    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ImpossibleStateError);
    }

    this.name = 'ImpossibleStateError';
  }
}
