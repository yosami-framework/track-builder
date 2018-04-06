/**
 * Eanble View HMR.
 * @param {string} source Source.
 * @param {object} map    SourceMap.
 */
module.exports = function(source, map) {
  let newSource = source;

  if (this.resourcePath.startsWith(`${this.rootContext}/views/`)) {
    newSource += [
      '\n',
      'if (module.hot) {',
      '  module.hot.accept();',
      '}',
    ].join('\n');
  }

  this.callback(null, newSource, map);
};
