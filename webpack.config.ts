/// <reference types="webpack-dev-server" />

import ReactRefreshPlugin from '@pmmmwh/react-refresh-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import { escapeRegExp } from 'lodash';
import path from 'path/posix';
import TerserPlugin from 'terser-webpack-plugin';
import TSConfigPathsPlugin from 'tsconfig-paths-webpack-plugin';
import type * as webpack from 'webpack';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment, @typescript-eslint/prefer-ts-expect-error
// @ts-ignore
import WebpackBar from 'webpackbar';

const JSExtensions: readonly string[] = ['.mjs', '.mjsx', '.cjs', '.cjsx', '.js', '.jsx'];
const TSExtensions: readonly string[] = JSExtensions.map(ext => ext.replace('js', 'ts'));
const ScriptExtensions: readonly string[] = [...JSExtensions, ...TSExtensions];

export default createConfig();

function createConfig(): webpack.Configuration {
  const __DEV__ = process.env.NODE_ENV === 'development';

  const babel: webpack.RuleSetRule = {
    include: path.resolve('src'),
    loader: 'babel-loader',
    options: {
      plugins: [__DEV__ && 'react-refresh/babel'].filter(isTruthy),
      presets: [
        ['@babel/preset-env'],
        ['@babel/preset-react', { runtime: 'automatic' }],
        ['@babel/preset-typescript'],
      ],
    },
    test: RegExp(`(${ScriptExtensions.map(escapeRegExp).join('|')})$`),
  };

  return {
    cache: {
      buildDependencies: {
        config: [__filename],
        tsconfig: [path.resolve('tsconfig.json')],
      },
      cacheDirectory: path.resolve('node_modules/.cache/webpack'),
      type: 'filesystem',
    },
    context: process.cwd(),
    devServer: {
      hot: true,
    },
    devtool: __DEV__ ? 'cheap-module-source-map' : 'source-map',
    entry: './src',
    mode: __DEV__ ? 'development' : 'production',
    module: {
      rules: [{ oneOf: [babel] }],
    },
    name: 'client',
    optimization: {
      minimize: !__DEV__,
      minimizer: [new TerserPlugin()],
      splitChunks: { chunks: 'all' },
    },
    output: {
      path: path.resolve('dist'),
    },
    plugins: [
      new HtmlWebpackPlugin(),
      new WebpackBar(),
      __DEV__ && new ReactRefreshPlugin(),
    ].filter(isTruthy),
    resolve: {
      extensions: [...ScriptExtensions, '.json'],
      plugins: [new TSConfigPathsPlugin()],
    },
    stats: 'none',
  };
}

function isTruthy<T>(value: T): value is Exclude<T, 0 | '' | false | null | undefined> {
  return !!value;
}
