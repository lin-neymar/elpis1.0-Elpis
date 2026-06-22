module.exports = (app) => {
  // 引入 base controller
  const BaseController = require('./base')(app); // 因为require过来的是一个函数，所以传入app去执行base中的构造函数
  // 这里返回的是一个类，所以需要用 extends 继承
  return class ProjectController extends BaseController {
    /*
     * 获取项目列表
     * @param {object} ctx 上下文
     */
    async getList(ctx) {
      const { project: projectService } = app.service;
      const projectList = await projectService.getList();
      //   ctx.status = 200;
      //   ctx.body = {
      //     success: true,
      //     data: res,
      //     // 在使用egg的框架时，像之前做的网盘项目，在controller这里就返回data出去了，不在调用service
      //     metadata: {},
      //   };

      // 改造成
      this.success(ctx, projectList);
    }
  };
};
