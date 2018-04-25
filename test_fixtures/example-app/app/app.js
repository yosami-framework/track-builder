require('../config/application');

module.exports = class Hoge {
  /**
   * Hello!
   * @return {string} HOGE
   */
  hello() {
    return process.env.HOGE;
  }

  /**
   * Watch
   * @return {string} FUGA
   */
  watch() {
    return `I'm watching ${process.env.FUGA}`;
  }

  view() {
    return require('./views/mock')();
  }

  device() {
    if (process.browser) {
      return `I'm browser`;
    } else {
      return `I'm not browser`;
    }
  }
};
