/// <reference types="webpack-dev-server" />

import path from 'path/posix';
import TerserPlugin from 'terser-webpack-plugin';
import TSConfigPathsPlugin from 'tsconfig-paths-webpack-plugin';
import type * as webpack from 'webpack';
import WebpackBar from 'webpackbar';

export default createConfig();

function createConfig(): webpack.Configuration {
  const __DEV__ = process.env.NODE_ENV === 'development';
  const JSExtensions = ['.mjs', '.mjsx', '.cjs', '.cjsx', '.js', '.jsx'];
  const TSExtensions = JSExtensions.map(ext => ext.replace('js', 'ts'));

  return {
    cache: {
      buildDependencies: {
        config: [__filename],
        tsconfig: [path.resolve('tsconfig.json')],
      },
      cacheDirectory: path.resolve('node_modules', '.cache/webpack'),
      type: 'filesystem',
    },
    context: process.cwd(),
    devServer: {},
    devtool: __DEV__ ? 'cheap-module-source-map' : 'source-map',
    entry: { main: './src' },
    experiments: {
      lazyCompilation: true,
      outputModule: true,
    },
    mode: __DEV__ ? 'development' : 'production',
    module: {
      rules: [
        {
          oneOf: [
            {
              include: path.resolve('src'),
              loader: 'babel-loader',
              options: {
                presets: [
                  '@babel/preset-env',
                  ['@babel/preset-react', { runtime: 'automatic' }],
                  '@babel/preset-typescript',
                ],
              },
              test: `(${[JSExtensions, TSExtensions].flat(1).join('|')})$`,
            },
          ],
        },
      ],
    },
    name: 'client',
    optimization: {
      minimize: !__DEV__,
      minimizer: [new TerserPlugin()],
      runtimeChunk: { name: (entry: any) => `runtime-${entry.name}` },
      splitChunks: { chunks: 'all' },
    },
    output: {
      module: true,
      path: path.resolve('dist'),
    },
    plugins: [new WebpackBar()],
    resolve: {
      extensions: [JSExtensions, TSExtensions, '.json'].flat(1),
      plugins: [new TSConfigPathsPlugin()],
    },
    stats: 'none',
  };
}
