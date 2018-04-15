const t      = require('track-spec');
const loader = require('../../lib/loaders/json-minify-loader');

t.describe('json-minify-loader', () => {
  const subject = (() => loader.bind(context)(source, map));
  let source  = null;
  let map     = null;
  let context = null;

  t.beforeEach(() => {
    source = '{"hoge":                 "fuga"}';
    map = {};
    context = {
      callback:     t.spy(),
      rootContext:  './hoge/app',
      resourcePath: './hoge/app/app.js',
    };
  });

  t.it('Minify json', () => {
    subject();
    t.expect(context.callback.callCount).equals(1);
    t.expect(context.callback.args[0]).equals(null);
    t.expect(context.callback.args[1]).equals('{"hoge":"fuga"}');
    t.expect(context.callback.args[2]).equals(map);
  });
});
