const t      = require('track-spec');
const loader = require('../../lib/loaders/js-minify-loader');

t.describe('js-minify-loader', () => {
  const subject = (() => loader.bind(context)(source, map));
  let source  = null;
  let map     = null;
  let context = null;

  t.beforeEach(() => {
    source = 'var minmi = 1+1;\nconsole.log(minmi)';
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
    t.expect(context.callback.args[1]).equals('console.log(2);');
    t.expect(context.callback.args[2]).equals(map);
  });
});
