module.exports = {
  // 获取项目系统列表
  '/api/project/model_list': {
    get: {},
  },

  // 获取系统中的项目列表
  '/api/project/list': {
    get: {
      query: {
        type: 'object',
        properties: {
          proj_key: {
            type: 'string',
          },
        },
      },
    },
  },
};
