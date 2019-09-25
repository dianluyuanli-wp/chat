const webpack = require('webpack')
const library = '[name]_dll'
const path = require('path');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = {
  entry: {
    vendors: ['react', 'mobx', 'mobx-react', 'socket.io-client']
  },

  output: {
    filename: '[name]_dll.js',
    path: path.resolve(__dirname, 'dist'),
    //publicPath: path.resolve(__dirname, 'dist'),
    publicPath: './',
    library
  },

  plugins: [
    new webpack.DllPlugin({
      path: path.join(__dirname, 'dist/[name]-manifest.json'),
      // This must match the output.library option above
      name: library
    }),
    new BundleAnalyzerPlugin({
        analyzerPort: 8899
    })
  ],
}