module.exports = (app) => {
  const BaseService = require('./base')(app);
  const modelList = require('../../model/index')(app);
  return class projectService extends BaseService {
    /*
     * 获取所有模型与项目的结构化数据
     */
    async getModelList() {
      return modelList;
    }

    /*
     * 获取统一模型下的项目列表（如果无 projKey ，全量获取）
     */
    async getProjectList({ projKey }) {
      return modelList.reduce((preList, modelItem) => {
        const { project } = modelItem;

        // 如果有传 projkey 则只取当前同模型下的项目，不传的情况下则取全量
        if (projKey && !project[projKey]) return preList;

        for (const pkey in project) {
          preList.push(project[pkey]);
        }
        return preList;
      }, []);
    }
  };
};
