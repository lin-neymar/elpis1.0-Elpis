{
  mode: 'dashboard'; // 模版类型，不同模版类型对应不一样的模版数据结构
  name: ''; // 名称
  desc: ''; // 描述
  icon: ''; // icon
  homePage: ''; // 首页（项目配置）
  // 头部菜单
  menu: [
    {
      key: '', // 菜单唯一描述
      name: '', // 菜单名称
      menuType: '', // 枚举值，group / module

      // 当 menuType == group 时，可填
      subMenu: [
        {
          // 可递归 menuItem
        },
      ],

      // 当 menuType == module 时，可填
      moduleType: '', // 枚举值：sider/iframe/custom/schema

      // 当 moduleType == sider 时
      siderConfig: {
        menu: [
          {
            // 可递归 menuItem (除 moduleType == sider)
          },
        ],
      },

      // 当 moduleType == iframe 时
      iframeConfig: {
        path: '', // iframe 路径
      },

      // 当 moduleType == custom 时
      customConfig: {
        path: '', // 自定义路由路径
      },

      // 当 moduleType == schema 时
      schemaConfig: {
        api: '', // 数据源API （遵循 RESTFUL 规范）
        schema: {
          // 板块数据结构
          type: 'object',
          properties: {
            key: {
              ...schema, // 标准 schema 配置
              type: '', // 字段类型
              label: '', // 字段的中文名
            },
          },
        },
        tableConfig: {}, // table 相关配置
        searchConfig: {}, // search-bar 相关配置
        components: {}, // 模块组件
      },
    },
  ];
}
