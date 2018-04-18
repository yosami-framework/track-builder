const t        = require('track-spec');
const fs       = require('fs');
const path     = require('path');
const Manifest = require('../test_fixtures/example-app/public/manifest.json');

t.describe('webpack.config.js', () => {
  const loadFile = (() => fs.readFileSync(file));
  let file = null;

  t.describe('app.js', () => {
    t.beforeEach(() => {
      file = path.resolve(__dirname, '../', 'test_fixtures', 'example-app', 'public', Manifest['app.js'].replace('/my-app', '').slice(1));
    });

    t.it('Generated', () => {
      const content = loadFile();
      t.expect(content.indexOf('__esModule')).notEquals(-1);
      t.expect(content.indexOf('function(){return"HOOOO GEEEE !!!"}')).notEquals(-1);
      t.expect(content.indexOf('function(){return"I\'m watching FUGAGAGAGA"}')).notEquals(-1);
    });
  });

  t.describe('boot.js', () => {
    t.beforeEach(() => {
      file = path.resolve(__dirname, '../', 'test_fixtures', 'example-app', 'public', 'assets', 'boot.js');
    });

    t.it('Generated', () => {
      const content = loadFile();
      t.expect(content.indexOf('__esModule')).notEquals(-1);
    });
  });

  t.describe('app.css', () => {
    t.beforeEach(() => {
      file = path.resolve(__dirname, '../', 'test_fixtures', 'example-app', 'public', Manifest['assets/app.scss'].replace('/my-app', '').slice(1));
    });

    t.it('Generated', () => {
      const content = loadFile();
      t.expect(
        /background:url\(\/my-app\/assets\/[^\.]+\.png\)/.test(content)
      ).equals(true);
    });
  });

  t.describe('locale', () => {
    t.beforeEach(() => {
      file = path.resolve(__dirname, '../', 'test_fixtures', 'example-app', 'public', Manifest['assets/ja.yml'].replace('/my-app', '').slice(1));
    });

    t.it('Generated', () => {
      t.expect('{"en":{"hoge":{"fuga":"ふがああああああああ!"}}}').equals(loadFile().toString());
    });
  });
});
