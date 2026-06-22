module.exports = {
  '/api/project/list': {
    // get方法的参数
    get: {
      // 参数类型为对象，对象中包含的属性为proj_key，类型为string
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
};
