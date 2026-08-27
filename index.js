// const Koa = require("koa");

// // Koa实例
// const app = new Koa();

// // 启动服务
// // 使用try catch，增强服务启动的健壮性
// try {
//   // 取环境变量中的端口，不存在则设置为8080
//   const port = process.env.PORT || 8080;
//   // 取环境变量中的IP，不存在则设置为0.0.0.0
//   const host = process.env.IP || "0.0.0.0";

//   app.listen(port, host);
//   console.log(`Server running on port:${port}`);
// } catch (e) {
//   console.error(e);
// }

// 更换启动方式，引入elpis-core
const ElpisCore = require('./elpis-core');
// 引入前端工程化构建方法
const FEBuildDev = require('../Elpis/app/webpack/dev');
const FEBuildProd = require('../Elpis/app/webpack/prod');

module.exports = {
  /*
   * 服务端基础,让外部使用者能够使用到对应的base
   */
  Controller: {
    Base: require('./app/controller/base'),
  },
  Service: {
    Base: require('./app/service/base'),
  },

  /*
   * 编译构建前端工程
   * @param env 环境变量 local/production
   */
  frontendBuild(env) {
    if (env === 'local') {
      FEBuildDev();
    } else if (env === 'production') {
      FEBuildProd();
    }
  },

  /*
   * 启动elpis
   * @param {Object} options - 启动参数，项目配置，透传到elpis-core
   */
  serverStart(options = {}) {
    const app = ElpisCore.start(options);
    return app;
  },
};

// 启动项目
// ElpisCore.start({
//   name: 'Elpis',
//   homePage: '/view/dashboard',
// });
