module.exports = {
  name: 'B站课堂',
  desc: 'B站课程管理系统',
  homePage: '',
  menu: [
    {
      key: 'video',
      name: '视频管理（B站）',
    },
    {
      key: 'user',
      name: '用户管理（B站）',
    },
    {
      key: 'kecheng',
      name: '课程管理',
      menuType: 'module',
      moduleType: 'sider',
      siderConfig: {
        menu: [
          {
            key: 'pdf',
            name: 'PDF',
            menuType: 'module',
            moduleType: 'custom',
            customConfig: {
              path: '/todo',
            },
          },
          {
            key: 'excel',
            name: 'Excel',
            menuType: 'module',
            moduleType: 'custom',
            customConfig: {
              path: '/todo',
            },
          },
          {
            key: 'ppt',
            name: 'PPT',
            menuType: 'module',
            moduleType: 'custom',
            customConfig: {
              path: '/todo',
            },
          },
        ],
      },
    },
  ],
};
