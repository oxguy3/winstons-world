import buttonchars from './buttonchars';

export default class TextUtils {
  static convertSymbols(text) {
    text = text.replace(/<(.*?)>/g, function(match, p1, offset, str) {
      const index = buttonchars.indexOf(p1);
      if (index != -1) {
        return String.fromCodePoint(57344+index);
      } else {
        return match;
      }
    });
    return text;
  }
}
