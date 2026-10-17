// 用来渲染的
module.exports = (app, router) => {
  // 这里这样能拿到就是因为在/elpis-core/loader/middleware执行后的效果
  const { view: viewController } = app.controller;

  // 当用户输入 http://ip:port/view/xxx 能渲染出对应的页面
  // bind() 是函数原型上的方法，创建一个新函数，永久绑定 this 指向、预设参数，原函数不变，不会立即执行。
  // 这里为什么要使用bind方法：把类实例的方法当作回调传给路由时，必须固定 this 指向该实例。
  router.get('/view/:page', viewController.renderPage.bind(viewController));

  // 当用户输入 http://ip:port/view/xxx/xxx/... 能渲染出对应的页面
  router.get('/view/:page/*', viewController.renderPage.bind(viewController));

  // /view开头的为页面请求，/api开头的为api请求
};
