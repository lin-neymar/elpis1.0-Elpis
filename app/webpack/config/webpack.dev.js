const merge = require('webpack-merge');

// 基础类配置
const baseConfig = require('./webpack.base.js');

// 生产环境 webpack 配置
const webpackConfig = merge.smart(baseConfig, {
  // 指定生产环境
  mode: 'development',
  // 开发环境的 output 配置
  output: {},
});

module.exports = webpackConfig;
