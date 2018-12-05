var HTMLWebpackPlugin = require('html-webpack-plugin')
var HTMLWebpackPluginConfig = new HTMLWebpackPlugin({
  // config object here
  template: __dirname + '/app/index.html',
  filename: 'index.html',
  inject: 'body'
})
const CircularDependencyPlugin = require('circular-dependency-plugin')
// var ExtractTextPlugin = require('extract-text-webpack-plugin')
// var extractCSS = new ExtractTextPlugin({ filename: 'css.bundle.css'})

module.exports = {
  mode: 'development',
  entry: __dirname + '/app/index.js',
  devServer: {
    contentBase: './build'
  },
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
    filename: 'transformed.js',
    path: __dirname + '/build'
  },
  plugins: [
    HTMLWebpackPluginConfig,
    new CircularDependencyPlugin({
      // exclude detection of files based on a RegExp
      exclude: /a\.js|node_modules/,
      // add errors to webpack instead of warnings
      failOnError: true,
      // allow import cycles that include an asyncronous import,
      // e.g. via import(/* webpackMode: "weak" */ './file.js')
      allowAsyncCycles: false,
      // set the current working directory for displaying module paths
      cwd: process.cwd(),
    })
  ]
}
