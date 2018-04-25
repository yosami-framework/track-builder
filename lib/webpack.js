const path           = require('path');
const DefinePlugin   = require('webpack').DefinePlugin;
const DotenvPlugin   = require('dotenv-webpack');
const ManifestPlugin = require('webpack-manifest-plugin');
const TrackConfig    = require('track-config');

/**
 * Return config.
 * @param {string}        rootDir  Application root directory.
 * @param {array<string>} browsers Browser setting. (@see babel-preset-env)
 * @return {object} config.
 */
module.exports = function(rootDir, browsers) {
  require(path.resolve(rootDir, 'config', 'application'));
  const isDevServer = /webpack-dev-server$/.test(process.argv[1]);
  const publicDir   = path.resolve(rootDir, 'public');
  const publicPath  = (TrackConfig.relativeUrlRoot || '') + '/';
  const fileName    = 'assets/[name]-[hash]';

  return [{
    context: path.resolve(rootDir, 'app'),
    entry:   {
      'app':     './app.js',
      'app.css': './assets/styles/app.scss',
    },
    output: {
      path:       publicDir,
      publicPath: publicPath,
      filename:   `${fileName}.js`,
    },
    module: {
      rules: [{
        test:    /\.jsx?$/,
        exclude: {
          include: /node_modules/,
          exclude: /node_modules\/track-/,
        },
        use: [{
          loader:  'string-replace-loader',
          options: {
            multiple: isDevServer ? [] : [{
              search:  'throw new TypeError("Cannot call a class as a function")',
              replace: 'null',
            }, {
              search:  'throw new TypeError("Super expression must either be null or a function, not "',
              replace: '(null',
            }, {
              search:  'throw new ReferenceError("this hasn\'t been initialised - super() hasn\'t been called")',
              replace: 'null',
            }],
          },
        }, {
          loader:  'babel-loader',
          options: {
            presets: [
              ['env', {modules: false, targets: {browsers: browsers}}],
            ],
          },
        }, {
          loader: path.join(__dirname, 'loaders', 'hmr-loader'),
        }],
      }, {
        test:    /\.scss$/,
        exclude: /node_modules/,
        use:     (isDevServer ? [
          {loader: 'style-loader'},
        ] : [
          {loader: 'file-loader', options: {name: `${fileName}.css`}},
          {loader: 'extract-loader', options: {publicPath: publicPath}},
        ]).concat([
          {loader: 'css-loader'},
          {loader: 'postcss-loader', options: {config: {path: './postcss.config.js'}}},
          {loader: 'sass-loader'},
        ]),
      }, {
        test: /\.(png|woff|woff2|eot|ttf|svg|jpg)$/,
        use:  [{
          loader:  'url-loader',
          options: {
            limit: 128,
            name:  `${fileName}.[ext]`,
          },
        }],
      }, {
        test: /\.yml$/,
        use:  [
          {loader: 'file-loader', options: {name: `${fileName}.json`}},
          {loader: path.join(__dirname, 'loaders', 'json-minify-loader')},
          {loader: 'yaml-loader'},
        ],
      }],
    },
    resolve: {
      extensions: ['.js', '.jsx'],
    },
    plugins: [
      new DefinePlugin({'process.browser': true}),
      new DotenvPlugin({path: path.resolve(rootDir, '.env'), safe: true}),
      new ManifestPlugin(),
    ],
    devServer: {
      contentBase:        publicDir,
      port:               3001,
      historyApiFallback: true,
      proxy:              {
        '/manifest.json': {
          target:      'http://localhost:3001',
          pathRewrite: {'/manifest.json': `${publicPath}manifest.json`},
        },
      },
      watchOptions: {
        poll: 2500,
      },
    },
  }];
};
