const path = require('path');
const webpack = require('webpack');
const { VueLoaderPlugin } = require('vue-loader');
const HtmlWebpackPlugin = require('html-webpack-plugin');

/*
 * webpack 基础配置
 */

module.exports = {
  // 1.入口配置(从哪些JS文件开始打包)
  entry: {
    'entry.page1': './app/pages/page1/entry.page1.js',
    'entry.page2': './app/pages/page2/entry.page2.js',
  },
  // 2.模块解析配置（决定了要加载解析哪些模块，以及用什么方式去解析）
  module: {
    // 模块解析规则
    rules: [
      {
        test: /\.vue$/,
        use: {
          loader: 'vue-loader',
        },
      },
      {
        test: /\.js$/,
        include: [
          // 只对业务代码进行 babel, 加快 webpack 打包速度
          path.resolve(process.cwd(), './app/pages'),
        ],
        use: {
          loader: 'babel-loader',
        },
      },
      {
        test: /\.(png|jpe?g|gif)(\?.+)?$/,
        use: {
          loader: 'url-loader',
          options: {
            limit: 300,
            esModule: false, // 关闭 esModule 转换
          },
        },
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.less$/,
        // loader 从右到左执行
        use: ['style-loader', 'css-loader', 'less-loader'],
      },
      {
        test: /\.(eot|svg|ttf|woff|woff2)(\?\S*)?$/,
        use: 'file-loader',
      },
    ],
  },
  // 3.产物输出路径（打包后的文件输出到哪里）
  output: {
    filename: 'js/[name]_[chunkhash:8].bundle.js', // 输出文件名
    path: path.join(process.cwd(), './app/public/dist/prod'), // 输出路径
    publicPath: '/dist/prod', // 公共路径
    crossOriginLoading: 'anonymous', // 跨域加载
  },
  // 4.配置模块解析的具体行为（定义 webpack 在打包时，如何找到并解析具体模块的路径）
  resolve: {
    extensions: ['.js', '.vue', '.less', '.css'], // 扩展名
    alias: {
      $pages: path.resolve(process.cwd(), './app/pages'), // 页面路径别名
    },
  },
  // 5.配置 webpack 插件（整包级别的增强能力）
  plugins: [
    // 处理 .vue 文件，这个插件是必须的
    // 它的只能是将你定义过的其他规则复制并应用到 .vue文件里，
    // 例如，如果有一条匹配规则 /\.js$/ 的规则，那么它会应用到 .vue 文件中的 <script> 板块中
    new VueLoaderPlugin(),
    // 把第三方库暴露到 window.context 下
    new webpack.ProvidePlugin({
      Vue: 'vue',
    }),
    // 定义全局常量
    new webpack.DefinePlugin({
      _VUE_OPTIONS_API_: 'true', // 支持 vue 解析 optionApi
      _VUE_PROD_DEVTOOLS_: 'false', // 禁用 Vue 调试工具
      _VUE_PROD_HYDRATION_MISMATCH_DETAILS_: 'false', // 禁用生产环境显示 “水合” 信息
    }),
    // 构造最终渲染的页面模板 page1
    new HtmlWebpackPlugin({
      // 产物（最终模板）输出路径
      filename: path.resolve(process.cwd(), './app/public/dist/', 'entry.page1.tpl'),
      // 指定要使用的模板文件
      template: path.resolve(process.cwd(), './app/view/entry.tpl'),
      // 要注入的代码块
      chunks: ['entry.page1'],
    }),
    // 构造最终渲染的页面模板 page2
    new HtmlWebpackPlugin({
      // 产物（最终模板）输出路径
      filename: path.resolve(process.cwd(), './app/public/dist/', 'entry.page2.tpl'),
      // 指定要使用的模板文件
      template: path.resolve(process.cwd(), './app/view/entry.tpl'),
      // 要注入的代码块
      chunks: ['entry.page2'],
    }),
  ],
  // 6.配置打包输出优化（代码分隔，模块合并，缓存，TreeShaing，压缩等优化策略）
  optimization: {},
};
