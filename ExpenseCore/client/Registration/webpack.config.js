const path = require('path');
const webpack = require('webpack');
const fs = require('fs');
const config = {};

// const WebPackIgnorePlugin =
// {
//   checkResource: function(resource)
//   {
//     const lazyImports =
//     [
//         '@opentelemetry/'
//     ];
  
//     if (!lazyImports.includes(resource))
//       return false;

//     try
//     {
//       require.resolve(resource);
//     }
//     catch (err)
//     {
//       return true;
//     }
  
//     return false;
//   }
// };

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