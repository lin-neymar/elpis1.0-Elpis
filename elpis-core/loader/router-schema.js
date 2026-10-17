const glob = require('glob');
const path = require('path');
const { sep } = path;
/*
* router-schema loader
* @param {object} app（koa 实例）
*
* 通过 'json-schema & ajv' 对API规则进行约束，配合 api-params-verify 中间件使用
* 
* 文件存放形式：app/router-schema/**.js

    输出：
    app.routerSchema={
        `${api1}`:${jsonSchema},
        `${api2}`:${jsonSchema},
        `${api3}`:${jsonSchema},
        `${api4}`:${jsonSchema}
    }
*
*/

module.exports = (app) => {
  // 读取 Elpis/app/router-schema/**/**.js下所有的文件
  const elpisRouterSchemaPath = path.resolve(__dirname, `..${sep}..${sep}app${sep}router-schema`);
  const elpisFileList = glob.sync(path.resolve(elpisRouterSchemaPath, `.${sep}**${sep}**.js`));

  // 读取 业务根目录/app/router-schema/**/**.js下所有的文件
  const businessRouterSchemaPath = path.resolve(app.businessPath, `.${sep}router-schema`);
  const businessFileList = glob.sync(path.resolve(businessRouterSchemaPath, `.${sep}**${sep}**.js`));

  // 注册所有 routerSchema，使得可以 'app.routerSchema' 这样访问
  let routerSchema = {};

  // 下面这种方式也行，像middleware一样抽取一个方法出来并各自循环执行也行
  [...elpisFileList, ...businessFileList].forEach((file) => {
    routerSchema = {
      ...routerSchema,
      ...require(path.resolve(file)),
    };
  });
  app.routerSchema = routerSchema;
};
