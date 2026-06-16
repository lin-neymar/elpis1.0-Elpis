const path = require('path');

/*
app/middleware.js 是 项目级「全局中间件注册入口」：在框架启动时，把静态资源、模板渲染、body 解析等 整站都要用的 Koa 中间件 挂到 app 上。
放在 app/ 根目录，是因为 elpis-core 约定并写死了这个路径，作为业务方配置全局中间件的固定入口
*/

module.exports = (app) => {
  // 配置静态根目录
  const koaStatic = require('koa-static');
  app.use(koaStatic(path.resolve(process.cwd(), './app/public')));

  // 模板渲染引擎(模板引擎就是基于模板配合数据构造出字符串输出的一个组件)
  const koaNunjucks = require('koa-nunjucks-2');
  // 使用
  app.use(
    koaNunjucks({
      ext: 'tpl',
      path: path.resolve(process.cwd(), './app/public'),
      nunjucksConfig: {
        noCache: true,
        trimBlocks: true,
      },
    }),
  );

  // 引入 ctx.body 解析中间件
  const bodyParser = require('koa-bodyparser');
  app.use(
    bodyParser({
      formList: '1000mb',
      enableTypes: ['form', 'json', 'text'],
    }),
  );

  // 除了官方的，在所有业务中间件中需要最早引用这个error-handle
  // 引入异常捕获中间件
  app.use(app.middlewares.errorHandler);

  // 签名合法性校验
  app.use(app.middlewares.apiSignVerify);
};

/*
相关解释：

模板渲染，用服务器渲染一个页面

扩展名为 .tpl 的文件是由 HTTP 文件服务器 (HFS) 创建和使用的模板文件，
该文件是一个文件共享应用程序，用于通过 Web 技术 HTTP 而不是 FTP 协议发送和接收文件。 
它用于根据定义为具有类似布局、样式和脚本设置的模板信息动态构建 HTML 页面。 
可以为需要相同设置的应用程序分配相同的模板文件，HFS 将根据此模板文件在运行时动态返回请求的页面。
*/
