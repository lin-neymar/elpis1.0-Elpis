module.exports = (app) => {
  // 引入 base controller
  const BaseController = require('./base')(app); // 因为require过来的是一个函数，所以传入app去执行base中的构造函数
  // 这里返回的是一个类，所以需要用 extends 继承
  return class ProjectController extends BaseController {
    /*
     * 获取所有模型与项目的结构化数据
     */
    async getModelList(ctx) {
      const { project: projectService } = app.service;
      const modelList = await projectService.getModelList();

      // 构造返回结果，只返回关键数据，为了保证一定的安全性，只暴露应该看到的数据
      const dtoModelList = modelList.reduce((preList, item) => {
        const { model, project } = item;

        // 构造 model 关键数据
        const { key, name, desc } = model;
        const dtoModel = { key, name, desc };

        // 构造 project 关键数据
        const dtoProject = {};
        for (const projKey in project) {
          const { key, name, desc, homePage } = project[projKey];
          dtoProject[projKey] = { key, name, desc, homePage };
        }

        // 整合返回结构
        preList.push({
          model: dtoModel,
          project: dtoProject,
        });

        return preList;
      }, []);

      this.success(ctx, dtoModelList);
    }
  };
};
