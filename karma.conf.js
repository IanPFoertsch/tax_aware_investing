var HTMLWebpackPlugin = require('html-webpack-plugin')
var HTMLWebpackPluginConfig = new HTMLWebpackPlugin({
  // config object here
  template: __dirname + '/app/index.html',
  filename: 'index.html',
  inject: 'body'
})

module.exports = function(config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine'],

    reporters: ['dots'],
    port: 8080,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ['Chrome'],
    singleRun: false,
    autoWatchBatchDelay: 300,

    files: [
      'spec/*-spec.js',
      'spec/**/*-spec.js'
      // each file acts as entry point for the webpack configuration
    ],

    preprocessors: {
      './app/index.js': ['webpack'],
      './spec/**/*-spec.js': ['webpack'],
      // 'spec/*-spec.js': ['webpack']
    },

    webpack: module.exports = {
      mode: 'development',
      entry: __dirname + '/app/index.js',
      // devServer: {
      //   contentBase: './build'
      // },
      module: {
        rules: [
          {
            test: /\.css$/,
            use: ['style-loader','css-loader']
          },
          {
            test: /\.js$/,
            exclude: /node_modules/,
            loader: 'babel-loader'
          }
        ]
      },
      output: {
        filename: '[name].js',
        path: __dirname + '/build'
      },
      plugins: [
        HTMLWebpackPluginConfig
      ]
    },

    webpackMiddleware: {
      noInfo: true
    }
  })
}
