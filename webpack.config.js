var HTMLWebpackPlugin = require('html-webpack-plugin')
var HTMLWebpackPluginConfig = new HTMLWebpackPlugin({
  // config object here
  template: __dirname + '/app/index.html',
  filename: 'index.html',
  inject: 'body'
})
// var ExtractTextPlugin = require('extract-text-webpack-plugin')
// var extractCSS = new ExtractTextPlugin({ filename: 'css.bundle.css'})

module.exports = {
  mode: 'development',
  entry: __dirname + '/app/index.js',
  devServer: {
    contentBase: './build',
    open: 'firefox'
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
    HTMLWebpackPluginConfig
  ]
}
