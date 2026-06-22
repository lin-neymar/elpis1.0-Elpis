// glob用于查找符合特定规则的文件路径名。提供了一种简单而强大的方法
// 来匹配文件和目录的路径名，支持使用通配符如 *、? 和 [] 进行匹配
const glob = require('glob');
const path = require('path');
const { sep } = path;
/*
service loader
@param {object} app Koa 实例
*加载所有 service,可通过 'app.services.${目录}.${文件}'访问
例子：文件存放形式：
    app/service
        |
        | -- custom-module
                |   
                | -- custom-service.js

==> app.service.customModule.customService 访问

*/
module.exports = (app) => {
  // 读取 app/service/**/**.js下所有的文件
  const servicePath = path.resolve(app.businessPath, `.${sep}service`);
  const fileList = glob.sync(path.resolve(servicePath, `.${sep}**${sep}**.js`));

  // 遍历所有文件目录，把内容加载到 app.service 下
  const service = {};
  fileList.forEach((file) => {
    // 提取文件名称
    let name = path.resolve(file);

    // 截取路径 app/service/custom-module/custom-service.js ==>custom-module/custom-service
    name = name.substring(name.lastIndexOf(`service${sep}`) + `service${sep}`.length, name.lastIndexOf('.'));

    // 把‘-’统一改为驼峰式，custom-module/custom-service.js ==> customModule.customService
    name = name.replace(/[_-][a-z]/gi, (s) => s.substring(1).toUpperCase());

    // 挂载 service 到内存 app 对象中
    let tempService = service;
    const names = name.split(sep);
    for (let i = 0, len = names.length; i < len; ++i) {
      if (i === len - 1) {
        // 最后一位，则为文件
        const ServiceModule = require(path.resolve(file))(app);
        tempService[names[i]] = new ServiceModule();
      } else {
        // 则为目录
        if (!tempService[names[i]]) {
          tempService[names[i]] = {};
        }
        tempService = tempService[names[i]];
      }
    }
  });

  app.service = service;
};
