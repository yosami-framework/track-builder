/**
 * Minify JSON.
 * @param {string} source Source.
 * @param {object} map    SourceMap.
 */
module.exports = function(source, map) {
  this.callback(null, JSON.stringify(JSON.parse(source)), map);
};
