import boot from '$pages/boot.js';
import dashBoard from './dashboard.vue';

const routes = [];

// 头部菜单路由
routes.push({
  path: '/view/dashboard/iframe',
  component: () => import('./complex-view/iframe-view/iframe-view.vue'),
});
routes.push({
  path: '/view/dashboard/schema',
  component: () => import('./complex-view/schema-view/schema-view.vue'),
});
// custom 自定义路由
routes.push({
  path: '/view/dashboard/todo',
  component: () => import('./todo/todo.vue'),
});

// 侧边栏菜单路由
// children 必须用相对路径：'todo' → 实际 URL 为 /view/dashboard/sider/todo
// 若写成绝对路径 '/view/dashboard/todo'，只会匹配顶层 /view/dashboard/todo，
// 点侧栏跳到 /view/dashboard/sider/todo 时匹配不到子路由，会落到下面的兜底路由，内层 router-view 为空
routes.push({
  path: '/view/dashboard/sider',
  component: () => import('./complex-view/sider-view/sider-view.vue'),
  children: [
    {
      path: 'iframe',
      component: () => import('./complex-view/iframe-view/iframe-view.vue'),
    },
    {
      path: 'schema',
      component: () => import('./complex-view/schema-view/schema-view.vue'),
    },
    // custom 自定义路由
    {
      path: 'todo',
      component: () => import('./todo/todo.vue'),
    },
  ],
});

// 侧边栏菜单兜底策略
routes.push({
  path: '/view/dashboard/sider/:chapters+',
  component: () => import('./complex-view/sider-view/sider-view.vue'),
});

boot(dashBoard, { routes });
