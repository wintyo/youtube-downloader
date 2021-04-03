import * as path from 'path';
import * as webpack from 'webpack';
const nodeExternals = require('webpack-node-externals');

const config: webpack.Configuration = {
  mode: 'production',
  entry: {
    server: [path.resolve(__dirname, './server.ts')],
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, './'),
  },
  target: 'node',
  node: {
    __dirname: false,
    __filename: false,
  },
  externals: [nodeExternals()],
  resolve: {
    extensions: ['.ts', '.js'],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
        exclude: /node_modules/,
      }
    ]
  }
};

export default config;
