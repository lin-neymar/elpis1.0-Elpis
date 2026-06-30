import { createApp } from 'vue';

// 引入 elementUI
import ElementUI from 'element-plus';
import 'element-plus/theme-chalk/index.css';

// 引入pinia
import pinia from '$store';

// 引入 vue-router
import { createRouter, createWebHashHistory } from 'vue-router';

/*
 * vue 页面主入口，用于启动vue
 * @params pageComponent vue 入口组件
 */

export default (pageComponent, { routes }) => {
  const app = createApp(pageComponent);
  // 应用 ElementUI
  app.use(ElementUI);

  // 应用 pinia
  app.use(pinia);

  // 页面路由
  if (routes && routes.length) {
    const router = createRouter({
      history: createWebHashHistory(), // 采用 hash 模式
      routes,
    });
    app.use(router);
    router.isReady().then(() => {
      app.mount('#root');
    });
  } else {
    app.mount('#root');
  }
};
