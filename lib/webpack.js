const path           = require('path');
const ManifestPlugin = require('webpack-manifest-plugin');

/**
 * Return config.
 * @param {string}        rootDir  Application root directory.
 * @param {array<string>} browsers Browser setting. (@see babel-preset-env)
 * @return {object} config.
 */
module.exports = function(rootDir, browsers) {
  const isDevServer = /webpack-dev-server$/.test(process.argv[1]);

  return [{
    context: path.resolve(rootDir, 'app'),
    entry:   {
      'app':     './app.js',
      'app.css': './assets/styles/app.scss',
    },
    output: {
      path:       path.resolve(rootDir, 'public', 'assets'),
      publicPath: '/assets/',
      filename:   '[name]-[hash].js',
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
              ['env', {targets: {browsers: browsers}}],
            ],
          },
        }],
      }, {
        test:    /\.scss$/,
        exclude: /node_modules/,
        use:     (isDevServer ? [
          {loader: 'style-loader'},
        ] : [
          {loader: 'file-loader', options: {name: '[name]-[hash].css'}},
          {loader: 'extract-loader', options: {publicPath: null}},
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
            name:  'images/[hash].[ext]',
          },
        }],
      }],
    },
    resolve: {
      extensions: ['.js', '.jsx'],
    },
    plugins: [
      new ManifestPlugin(),
    ],
    devServer: {
      contentBase:        path.resolve(rootDir, 'public'),
      port:               3001,
      historyApiFallback: true,
      watchOptions:       {
        poll: 2500,
      },
    },
  }, {
    context: path.resolve(rootDir, 'config'),
    entry:   {
      'boot': './boot.js',
    },
    output: {
      path:       path.resolve(rootDir, 'public', 'assets'),
      publicPath: '/assets/',
      filename:   '[name].js',
    },
    module: {
      rules: [{
        test: /\.js$/,
        use:  [{
          loader:  'babel-loader',
          options: {
            presets: [
              ['env', {targets: {browsers: browsers}}],
            ],
          },
        }],
      }],
    },
  }];
};
