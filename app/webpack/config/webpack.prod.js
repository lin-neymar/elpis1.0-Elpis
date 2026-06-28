const path = require('path');
// webpack-merge 用于合并 webpack 配置
const merge = require('webpack-merge');
// os 用于获取操作系统信息
const os = require('os');
// 多线程跑 loader。把 babel-loader、css-loader 放到子线程并行执行，缩短 构建时间（老方案，Webpack 5 项目里更常见 thread-loader）
const HappyPack = require('happypack');

// 提取 css 的公共部分，有效利用缓存，（非公共部分使用 inline）
// 把 CSS 从 JS 里 抽成独立 .css 文件。生产环境不用 style-loader 往页面插 <style>，便于缓存和 CDN
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
// 每次 build 前，清空 public/dist 目录
const CleanWebpackPLugin = require('clean-webpack-plugin');
// 优化并压缩 css 资源
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
// 浏览器在请求资源时不发送用户的身份凭证
const HtmlWebpackInjectAttributesPlugin = require('html-webpack-inject-attributes-plugin');
// 使用 TerserWebpackPlugin 的并发和缓存，提升压缩阶段的性能
const TerserWebpackPlugin = require('terser-webpack-plugin');

// 多线程 build 设置
const happypackCommonConfig = {
  debug: false,
  threadPool: HappyPack.ThreadPool({ size: os.cpus().length }),
};

// 基础类配置
const baseConfig = require('./webpack.base.js');

// 生产环境 webpack 配置
const webpackConfig = merge.smart(baseConfig, {
  // 指定生产环境
  mode: 'production',
  // 生产环境的 output 配置
  output: {
    filename: 'js/[name]_[chunkhash:8].bundle.js', // 输出文件名
    path: path.join(process.cwd(), './app/public/dist/prod'), // 输出路径
    publicPath: '/dist/prod', // 公共路径
    crossOriginLoading: 'anonymous', // 跨域加载
  },
  module: {
    rules: [
      {
        // 在base中是将style-loader 注入 <style>，适合 dev，不适合生产缓存，所以这里使用 MiniCssExtractPlugin.loader 提取 css 文件
        // CSS 单独成文件，可 CDN 缓存，不塞 JS 里
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'happypack/loader?id=css'],
      },
      {
        test: /\.js$/,
        include: [
          // 只对业务代码进行 babel, 加快 webpack 打包速度
          path.resolve(process.cwd(), './app/pages'),
        ],
        use: ['happypack/loader?id=js'],
      },
    ],
  },

  // webpack 不会有大量的 hints 信息，默认为 warning
  performance: {
    hints: false,
  },

  plugins: [
    // 每次 build 前，清空 public/dist 目录
    new CleanWebpackPLugin(['public/dist'], {
      root: path.resolve(process.cwd(), './app/'),
      exclude: [],
      verbose: true,
      dry: false,
    }),
    // 提取 css 的公共部分，有效利用缓存，（非公共部分使用 inline）
    new MiniCssExtractPlugin({
      chunkFilename: 'css/[name]_[contenthash:8].bundle.css',
    }),
    // 优化并压缩 css 资源
    new CssMinimizerPlugin(),
    // 多线程打包 JS ，加快打包速度
    new HappyPack({
      ...happypackCommonConfig,
      id: 'js',
      loaders: [
        `babel-loader?${JSON.stringify({
          presets: ['@babel/preset-env'],
          plugins: ['@babel/plugin-transform-runtime'],
        })}`,
      ],
    }),
    // 多线程打包 css ，加快打包速度
    new HappyPack({
      ...happypackCommonConfig,
      id: 'css',
      loaders: [
        {
          path: 'css-loader',
          options: {
            importLoaders: 1,
          },
        },
      ],
    }),
    // 浏览器在请求资源时不发送用户的身份凭证
    new HtmlWebpackInjectAttributesPlugin({
      crossorigin: 'anonymous',
    }),
  ],
  optimization: {
    // 使用 TerserWebpackPlugin 的并发和缓存，提升压缩阶段的性能
    minimize: true,
    minimizer: [
      new TerserWebpackPlugin({
        cache: true, // 启用缓存来加速构建过程
        parallel: true, // 利用多核 cpu 的优势来加快压缩速度
        terserOptions: {
          compress: {
            // 清除 console.log(预防信息泄漏)
            drop_console: true,
          },
        },
      }),
    ],
  },
});

module.exports = webpackConfig;
