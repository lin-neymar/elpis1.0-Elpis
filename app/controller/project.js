module.exports = (app) => {
  return class ProjectController {
    /*
     * 获取项目列表
     * @param {object} ctx 上下文
     */
    async getList(ctx) {
      const { project: projectService } = app.service;
      const res = await projectService.getList();
      ctx.status = 200;
      ctx.body = {
        success: true,
        data: res,
        // 在使用egg的框架时，像之前做的网盘项目，在controller这里就返回data出去了，不在调用service
        metadata: {},
      };
    }
  };
};
