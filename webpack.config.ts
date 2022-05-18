/// <reference types="webpack-dev-server" />

import ReactRefreshPlugin from '@pmmmwh/react-refresh-webpack-plugin';
import CssMinimizerPlugin from 'css-minimizer-webpack-plugin';
import ForkTsCheckerPlugin from 'fork-ts-checker-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import { escapeRegExp } from 'lodash';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
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

  const assets: webpack.RuleSetRule[] = [
    { resourceQuery: /\?inline$/, type: 'asset/inline' },
    { resourceQuery: /\?resource$/, type: 'asset/resource' },
    { resourceQuery: /\?source$/, type: 'asset/source' },
    { test: /\.(html?|txt)$/i, type: 'asset/source' },
    {
      parser: { dataUrlCondition: { maxSize: 2000 } },
      test: /\.(bmp|gif|ico|jpe?g|png|webp)$/i,
      type: 'asset',
    },
  ];

  const babel: webpack.RuleSetRule = {
    include: path.resolve('src'),
    test: RegExp(`(${ScriptExtensions.map(escapeRegExp).join('|')})$`, 'i'),
    type: 'javascript/auto',
    use: {
      loader: 'babel-loader',
      options: {
        plugins: [
          ['@babel/plugin-transform-runtime', { helpers: true, regenerator: true }],
          __DEV__ && ['react-refresh/babel'],
        ].filter(isTruthy),
        presets: [
          ['@babel/preset-env'],
          ['@babel/preset-react', { runtime: 'automatic' }],
          ['@babel/preset-typescript'],
        ],
      },
    },
  };

  const cssModuleLoader: webpack.RuleSetUseItem = {
    loader: 'css-loader',
    options: {
      importLoaders: 1,
      modules: {
        localIdentName: __DEV__ ? '[path][name]__[local]' : '[hash:base64:9]',
        mode: (p: string) => /\.(global|pure)\.\w+$/i.exec(p)?.[1] || 'local',
      },
    },
  };

  const depStyle: webpack.RuleSetRule = {
    exclude: path.resolve('src'),
    use: ['css-loader'],
  };

  const srcStyle: webpack.RuleSetRule = {
    include: path.resolve('src'),
    use: [cssModuleLoader, 'postcss-loader'],
  };

  const style: webpack.RuleSetRule = {
    sideEffects: true,
    test: /\.css$/i,
    use: [MiniCssExtractPlugin.loader],
    rules: [{ oneOf: [depStyle, srcStyle] }],
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
      rules: [{ oneOf: [...assets, babel, style] }],
    },
    name: 'client',
    optimization: {
      minimize: !__DEV__,
      minimizer: [new CssMinimizerPlugin(), new TerserPlugin()],
      splitChunks: { chunks: 'all' },
    },
    output: {
      assetModuleFilename: 'static/media/[name].[hash:8][ext]',
      chunkFilename: `static/js/[id]${__DEV__ ? '' : '.[contenthash:8]'}.js`,
      clean: true,
      environment: { bigIntLiteral: true, dynamicImport: true, module: true },
      filename: `static/js/[name]${__DEV__ ? '' : '.[contenthash:8]'}.js`,
      iife: true,
      path: path.resolve('dist'),
    },
    plugins: [
      new HtmlWebpackPlugin(),
      new MiniCssExtractPlugin({
        chunkFilename: `static/css/[name]${__DEV__ ? '' : '.[contenthash:8]'}.css`,
        filename: `static/css/[name]${__DEV__ ? '' : '.[contenthash:8]'}.css`,
        runtime: true,
      }),
      new WebpackBar(),
      __DEV__ && new ReactRefreshPlugin(),
      !__DEV__ &&
        new ForkTsCheckerPlugin({
          issue: { include: [{ file: '**/src/**/*' }] },
          typescript: { memoryLimit: 8192 },
        }),
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
