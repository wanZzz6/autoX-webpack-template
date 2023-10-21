const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const JavascriptObfuscator = require('webpack-obfuscator');
const AutoProWebpackPlugin = require('@auto.pro/webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const ProgressPlugin = require('progress-bar-webpack-plugin');

const WatchDeployPlugin = require('./plugin/WatchDeployPlugin');

const dictionary = [];
for (let i = 4096; i < 4096 + 2048; i++) {
  dictionary.push(i.toString(2).replace(/1/g, 'ν').replace(/0/g, 'v'));
}

const compilePlugin = new AutoProWebpackPlugin({
  ui: ['app'] // 非ui界面程序不要填，否则运行显示空白页面
  // encode: {
  //     key: ''
  // }
});

const config = {
  // entry 的第一个配置项是自动上传运行的入口文件，默认 app.js
  entry: {
    app: './src/index.js'
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist'),
    libraryTarget: 'var'
    // libraryTarget: "commonjs2"
  },
  target: 'web',
  module: {
    rules: [
      {
        test: /\.ts$/,
        // exclude: /node_modules/,
        use: ['ts-loader', '@auto.pro/webpack-loader']
      },
      {
        test: /\.js$/,
        // exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env']
            }
          },
          '@auto.pro/webpack-loader'
        ]
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: {
          loader: 'url-loader'
        }
      }
    ]
  },
  resolve: {
    extensions: ['.js', '.ts', '.json'],
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  },
  plugins: [
    null,
    compilePlugin,
    new CleanWebpackPlugin(),
    new CopyPlugin({
      patterns: [
        {
          from: './src',
          globOptions: {
            ignore: ['**/*.js', '**/*.ts']
          }
        }
      ]
    }),
    new ProgressPlugin()
  ]
};

module.exports = (env, argv) => {
  if (argv.mode === 'development') {
    config.plugins[0] = new WatchDeployPlugin({
      type: 'deploy' //watch模式的时候，是自动 deploy（部署）、rerun（重新运行）还是 none（不操作），
    });
  } else {
    config.plugins[0] = new JavascriptObfuscator({
      compact: true,
      identifierNamesGenerator: 'dictionary',
      identifiersDictionary: dictionary,
      target: 'node',
      transformObjectKeys: false,
      stringArray: true,
      stringArrayEncoding: ['rc4']
    });
  }

  return config;
};
