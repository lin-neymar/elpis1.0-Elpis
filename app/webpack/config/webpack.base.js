const glob = require('glob');
const path = require('path');
const webpack = require('webpack');
const { VueLoaderPlugin } = require('vue-loader');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const pageEntries = {};
const HtmlWebpackPluginList = [];
// 约定好：所有的入口文件都会放在pages文件夹
// 获取 app/pages 目录下所有入口文件 （entry.xx.js）
const entryList = path.resolve(__dirname, '../../pages/**/entry.*.js');
glob.sync(entryList).forEach((file) => {
  const entryName = path.basename(file, '.js');
  // 构造 entry
  pageEntries[entryName] = file;
  // 构造最终渲染的页面文件
  HtmlWebpackPluginList.push(
    new HtmlWebpackPlugin({
      // 产物（最终模板）输出路径 ===>需要输出到调用方的指定目录下
      filename: path.resolve(process.cwd(), './app/public/dist/', `${entryName}.tpl`),
      // 指定要使用的模板文件(使用自己elpis的模板)
      template: path.resolve(__dirname, '../../view/entry.tpl'),
      // 要注入的代码块
      chunks: [entryName],
    }),
  );
});

/*
 * webpack 基础配置
 */

module.exports = {
  // 1.入口配置(从哪些JS文件开始打包)
  // entry: {
  //   'entry.page1': './app/pages/page1/entry.page1.js',
  //   'entry.page2': './app/pages/page2/entry.page2.js',
  // },
  entry: pageEntries,
  // 2.模块解析配置（决定了要加载解析哪些模块，以及用什么方式去解析）
  module: {
    // 模块解析规则
    rules: [
      {
        test: /\.vue$/,
        use: {
          loader: require.resolve('vue-loader'),
        },
      },
      {
        test: /\.js$/,
        include: [
          // 只对业务代码进行 babel, 加快 webpack 打包速度
          path.resolve(__dirname, '../../pages'),
        ],
        use: {
          /*
          先用 Node 的模块解析规则找到 babel-loader 的真实安装路径
          再把这个“绝对路径”传给 webpack
          这样 webpack 不再依赖“当前命令执行目录”的 node_modules 解析结果
          */
          loader: require.resolve('babel-loader'),
        },
      },
      {
        test: /\.(png|jpe?g|gif)(\?.+)?$/,
        use: {
          loader: require.resolve('url-loader'),
          options: {
            limit: 300,
            esModule: false, // 关闭 esModule 转换
          },
        },
      },
      {
        test: /\.css$/,
        use: [require.resolve('style-loader'), require.resolve('css-loader')],
      },
      {
        test: /\.less$/,
        // loader 从右到左执行
        use: [require.resolve('style-loader'), require.resolve('css-loader'), require.resolve('less-loader')],
      },
      {
        test: /\.(eot|svg|ttf|woff|woff2)(\?\S*)?$/,
        use: require.resolve('file-loader'),
      },
    ],
  },
  // 3.产物输出路径（打包后的文件输出到哪里），因为开发和生产环境输出不一致，所以在各自环境中自行配置
  output: {},
  // 4.配置模块解析的具体行为（定义 webpack 在打包时，如何找到并解析具体模块的路径）
  resolve: {
    extensions: ['.js', '.vue', '.less', '.css'], // 扩展名
    alias: {
      $pages: path.resolve(__dirname, '../../pages'), // 页面路径别名
      $common: path.resolve(__dirname, '../../pages/common'),
      $widgets: path.resolve(__dirname, '../../pages/widgets'),
      $store: path.resolve(__dirname, '../../pages/store'),
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
      Vue: 'vue', // 使用 vue 的 Vue 符号
      axios: 'axios', // 使用 axios 的 axios 符号
      _: 'lodash', // 使用 lodash 的 _ 符号
    }),
    // 定义全局常量
    new webpack.DefinePlugin({
      __VUE_OPTIONS_API__: 'true', // 支持 vue 解析 optionApi
      __VUE_PROD_DEVTOOLS__: 'false', // 禁用 Vue 调试工具
      __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: 'false', // 禁用生产环境显示 “水合” 信息
    }),
    // 构造最终渲染的页面模板 page1
    // new HtmlWebpackPlugin({
    //   // 产物（最终模板）输出路径
    //   filename: path.resolve(process.cwd(), './app/public/dist/', 'entry.page1.tpl'),
    //   // 指定要使用的模板文件
    //   template: path.resolve(process.cwd(), './app/view/entry.tpl'),
    //   // 要注入的代码块
    //   chunks: ['entry.page1'],
    // }),
    ...HtmlWebpackPluginList,
  ],
  // 6.配置打包输出优化（代码分隔，模块合并，缓存，TreeShaing，压缩等优化策略）
  optimization: {
    /*
     * 把 js 文件打包成3种类型
     * 1.vendor: 第三方 lib 库，基本不会改动，除非依赖版本升级
     * 2.common: 业务组件代码的公共部分抽取出来，改动较少
     * 3.entry.{page}: 不同页面 entry 里的业务组件代码的差异部分，会经常改动
     * 目的：把改动和引用频率不一样的 js 区分出来，以达到更好利用浏览器缓存的效果
     */
    // 代码分割
    splitChunks: {
      chunks: 'all', // 对同步和异步模块都进行分割
      maxAsyncRequests: 10, // 每次异步加载的最大并行请求数
      maxInitialRequests: 10, // 入口点的最大并行请求数
      // 缓存组：根据条件把模块分配到不同的组中
      cacheGroups: {
        // 第三方依赖库
        vendor: {
          test: /[\\/]node_modules[\\/]/, // 打包 node_modules 中的文件
          name: 'vendor', // 模块名称
          priority: 20, // 优先级，数字越大，优先级越高
          enforce: true, // 强制执行
          reuseExistingChunk: true, // 复用已有的公共 chunk
        },
        // 公共模块
        common: {
          test: /[\\/]common|widgets[\\/]/,
          name: 'common', // 模块名称
          minChunks: 2, // 被两处引用即被归为公共模块
          minSize: 1, // 最小分割文件大小 （因课程需要设置为 1 byte）
          priority: 10, // 优先级
          reuseExistingChunk: true, //复用已有的公共 chunk
        },
      },
    },

    // 将 webpack 运行时生成的代码打包到 runtime.js文件中
    runtimeChunk: true,
  },
};
