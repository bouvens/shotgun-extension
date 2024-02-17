const path = require('path')
const srcDir = path.join(__dirname, '../src')

module.exports = {
  entry: {
    start: path.join(srcDir, 'index.js'),
  },
  output: {
    path: path.join(__dirname, '../dist'),
    filename: '[name].js',
  },
}
