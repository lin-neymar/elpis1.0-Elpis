const Koa = require('koa');
const path = require('path');
const { sep } = path; //兼容不同操作系统上的斜杠

const env = require('./env');

const configLoader = require('./loader/config');
const extendLoader = require('./loader/extend');
const middlewareLoader = require('./loader/middleware');
const routerSchemaLoader = require('./loader/router-schema');
const routerLoader = require('./loader/router');
const controllerLoader = require('./loader/controller');
const serviceLoader = require('./loader/service');

module.exports = {
  /*
   * 启动项目
   * @params options 项目配置
   * options = {
   *  name // 项目名称
   *  homePath // 项目首页
   * }
   */
  start(options = {}) {
    // Koa实例
    const app = new Koa();

    /* 把options挂载到Koa对象上 (应用配置)*/
    app.options = options;

    // 基础路径，   process.cwd(): Node.js 内置方法，返回当前进程的工作目录（绝对路径）
    app.baseDir = process.cwd();

    // 业务文件路径                               相当于./app（为了兼容）
    app.businessPath = path.resolve(app.baseDir, `.${sep}app`);

    // 将识别环境的js挂载到app上
    app.env = env();

    // 加载 config
    configLoader(app);
    console.log('[config] loaded:', app.config);
    console.log(`-- [start] load config done --`);

    // 加载 extend
    extendLoader(app);
    console.log(`-- [start] load extend done --`);

    // 加载 middleware
    middlewareLoader(app);
    console.log(`-- [start] load middleware done --`);

    // 加载 routerSchema
    routerSchemaLoader(app);
    console.log(`-- [start] load routerSchema done --`);

    // 加载 service
    serviceLoader(app);
    console.log(`-- [start] load service done --`);

    // 加载 controller
    controllerLoader(app);
    console.log(`-- [start] load controller done --`);

    // 注册Elpis全局中间件
    const elpisMiddlewarePath = path.resolve(__dirname, `..${sep}app${sep}middleware.js`);
    const elpisMiddleware = require(elpisMiddlewarePath);
    elpisMiddleware(app);
    console.log(`-- [start] load elpisMiddleware done --`);

    // 注册业务全局中间件
    try {
      require(`${app.businessPath}${sep}middleware.js`)(app);
      console.log(`-- [start] load businessMiddleware done --`);
    } catch (e) {
      console.log('[exception] there is no global business middleware file');
    }

    // 注册路由 先经过中间件，最后才是路由分发
    routerLoader(app);
    console.log(`-- [start] load router done --`);

    // 启动服务,使用try catch，增强服务启动的健壮性
    try {
      // 取环境变量中的端口，不存在则设置为8080
      const port = process.env.PORT || 8080;

      // 取环境变量中的IP，不存在则设置为0.0.0.0
      const host = process.env.IP || '0.0.0.0';

      app.listen(port, host);
      console.log(`Server running on port:${port}`);
    } catch (e) {
      console.error(e);
    }

    return app;
  },
};
