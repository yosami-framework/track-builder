const UglifyJS = require('uglify-es');

/**
 * Minify JS.
 * @param {string} source Source.
 * @param {object} map    SourceMap.
 */
module.exports = function(source, map) {
  this.callback(null, UglifyJS.minify(source, {toplevel: true}).code, map);
};
