module.exports = (app) => {
  const BaseService = require('./base')(app);
  return class projectService extends BaseService {
    async getList() {
      // 这里则可以打印
      return [
        {
          name: 'project1',
          desc: 'project1 desc',
        },
        {
          name: 'project2',
          desc: 'project2 desc',
        },
        {
          name: 'project3',
          desc: 'project3 desc',
        },
      ];
    }
  };
};
