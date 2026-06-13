// const Koa = require("koa");

// // Koa实例
// const app = new Koa();

// // 启动服务
// // 使用try catch，增强服务启动的健壮性
// try {
//   // 取环境变量中的端口，不存在则设置为8080
//   const port = process.env.PORT || 8080;
//   // 取环境变量中的IP，不存在则设置为0.0.0.0
//   const host = process.env.IP || "0.0.0.0";

//   app.listen(port, host);
//   console.log(`Server running on port:${port}`);
// } catch (e) {
//   console.error(e);
// }

// 更换启动方式，引入elpis-core
const ElpisCore = require("./elpis-core");

// 启动项目
ElpisCore.start({
  name: "Elpis",
  homePage: "/view/page1",
});
