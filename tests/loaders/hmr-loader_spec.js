const t      = require('track-spec');
const loader = require('../../lib/loaders/hmr-loader');

t.describe('hmr-loader', () => {
  const subject = (() => loader.bind(context)(source, map));
  let source  = null;
  let map     = null;
  let context = null;

  t.beforeEach(() => {
    source = 'console.log("PIYOPIYO")';
    map = {};
    context = {
      callback:     t.spy(),
      rootContext:  './hoge/app',
      resourcePath: './hoge/app/app.js',
    };
  });

  t.it('Call callback', () => {
    subject();
    t.expect(context.callback.callCount).equals(1);
    t.expect(context.callback.args[0]).equals(null);
    t.expect(context.callback.args[2]).equals(map);
  });

  t.context('When resource is controller', () => {
    t.beforeEach(() => {
      context.resourcePath = './hoge/app/controllers/hoge.js';
    });

    t.it('Not append hmr code', () => {
      subject();
      t.expect(context.callback.args[1]).equals(source);
    });
  });

  t.context('When resource is view', () => {
    t.beforeEach(() => {
      context.resourcePath = './hoge/app/views/hoge.js';
    });

    t.it('Append hmr code', () => {
      subject();
      t.expect(context.callback.args[1]).notEquals(source);
      t.expect(context.callback.args[1].indexOf('module.hot.accept()')).notEquals(-1);
    });
  });
});
