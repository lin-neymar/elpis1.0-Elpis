module.exports = {
  // 获取项目配置详情
  '/api/project': {
    get: {
      query: {
        type: 'object',
        properties: {
          proj_key: {
            type: 'string',
          },
        },
        required: ['proj_key'],
      },
    },
  },

  // 获取项目系统列表
  '/api/project/model_list': {
    get: {},
  },

  // 获取系统中的项目列表，proj_key 可传可不传
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
