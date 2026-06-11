// glob用于查找符合特定规则的文件路径名。提供了一种简单而强大的方法
// 来匹配文件和目录的路径名，支持使用通配符如 *、? 和 [] 进行匹配
const glob = require('glob');
const path = require('path');
const { sep } = path;
/*
middleware loader
@param {object} app Koa 实例
*加载所有 middleware,可通过 'app.middlewares.${目录}.${文件}'访问
例子：文件存放形式：
    app/middleware
        |
        | -- custom-module
                |   
                | -- custom-middleware.js

==> app.middlewares.customModule.customMiddleware 访问


涉及的api:
【path.resolve】：拼接 / 解析绝对路径，把多个路径片段拼成一个完整的绝对路径，会从右往左依次拼接，最终返回绝对路径。
【glob.sync】：glob 是 Node.js 常用文件匹配库，glob.sync 是同步版本，作用：根据通配符规则，批量查找匹配的文件 / 目录路径。
【substring（startIndex, endIndex）】：用于截取字符串片段，纯 JS 内置方法，无依赖。startIndex：起始下标(必填)，endIndex：结束下标（可选）返回：截取后的新字符串，原字符串不变。
*/

module.exports = (app) => {
  // 读取 app/middleware/**/**.js下所有的文件
  const middlewarePath = path.resolve(app.businessPath, `.${sep}middleware`);
  const fileList = glob.sync(path.resolve(middlewarePath, `.${sep}**${sep}**.js`));

  // 遍历所有文件目录，把内容加载到 app.middlewares 下
  const middlewares = {};
  fileList.forEach((file) => {
    // 提取文件名称
    let name = path.resolve(file);

    // 截取路径 app/middlewares/custom-module/custom-middleware.js ==>custom-module/custom-middleware
    name = name.substring(name.lastIndexOf(`middlewares${sep}`) + `middlewares${sep}`.length, name.lastIndexOf('.'));

    // 把‘-’统一改为驼峰式，custom-module/custom-middleware.js ==> customModule.customMiddleware
    name = name.replace(/[_-][a-z]/gi, (s) => s.substring(1).toUpperCase());

    // 挂载 middleware 到内存 app 对象中
    let tempMiddleware = middlewares;

    const names = name.split(sep);
    for (let i = 0, len = names.length; i < len; ++i) {
      if (i === len - 1) {
        // 最后一位，则为文件
        tempMiddleware[names[i]] = require(path.resolve(file))(app);
      } else {
        // 则为目录
        if (!tempMiddleware[names[i]]) {
          tempMiddleware[names[i]] = {};
        }
        tempMiddleware = tempMiddleware[names[i]];
      }
    }
  });

  app.middlewares = middlewares;
};
