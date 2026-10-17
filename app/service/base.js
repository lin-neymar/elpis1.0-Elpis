/*
 * 调用外部服务能力，譬如前端用的是axios
 * superagent 是Node.js/ 浏览器 通用的轻量级 HTTP 请求库，用来发送 GET/POST/PUT/DELETE 等网络请求，替代原生 http 模块、浏览器 XMLHttpRequest。
 */
const superagent = require('superagent');

module.exports = (app) =>
  class BaseService {
    /*
     * service 基类
     * 统一收拢 service 层的公共方法
     */
    constructor() {
      this.app = app;
      this.config = app.config;
      this.curl = superagent;
    }
  };
