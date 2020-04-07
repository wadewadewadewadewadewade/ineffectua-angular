const path = require('path');

module.exports = {
  output: {
    // Puts the output at the root of the dist folder
    path: path.join(__dirname, 'dist'),
    library: 'app',
    libraryTarget: 'umd',
    filename: '[name].js'
  }
}
