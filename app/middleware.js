const path = require('path');

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
};

/*
相关解释：

模板渲染，用服务器渲染一个页面

扩展名为 .tpl 的文件是由 HTTP 文件服务器 (HFS) 创建和使用的模板文件，
该文件是一个文件共享应用程序，用于通过 Web 技术 HTTP 而不是 FTP 协议发送和接收文件。 
它用于根据定义为具有类似布局、样式和脚本设置的模板信息动态构建 HTML 页面。 
可以为需要相同设置的应用程序分配相同的模板文件，HFS 将根据此模板文件在运行时动态返回请求的页面。
*/
