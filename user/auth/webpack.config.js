const path = require('path');
const fs = require('fs');
const config = {};

module.exports = {
  target: 'node',
  mode: 'production',
  entry: './src/main.ts',
  module: {
    rules: [
      {
        test: /\.ts?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist'),
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  stats: {
    warnings: false,
  }
};

config.externals = fs.readdirSync("node_modules")
.reduce(
    function(acc, mod) {
        if (mod === ".bin") {
          return acc
        }
        acc[mod] = "commonjs " + mod
        return acc
    }
)