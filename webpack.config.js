module.exports = {
  entry: './src',
  output: {
    path: './web',
    filename: 'xyfocus.js',
    library: 'XYFocus',
    libraryTarget: 'var'
  },
  resolve: {
    extensions: ['', '.webpack.js', '.web.js', '.ts', '.tsx', '.js', '.jsx']
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'ts-loader'
      }
    ]
  }
}
