const log4js = require("log4js");

/*
 * 日志工具
 * 外部调用 app.logger.info  app.logger.error
 */

module.exports = (app) => {
  let logger;

  if (app.env.isLocal()) {
    //打印在控制台即可,不打印到文件
    logger = console;
  } else {
    //把日志输出并落地到磁盘（日志落盘）
    log4js.configure({
      // 日志输出
      appenders: {
        console: {
          type: "console",
        },
        // 日志文件切分，以不同的维度切分（时间or文件...）
        dateFile: {
          type: "dateFile",
          filename: "./logs/application.log", // 日志文件路径
          pattern: ".yyyy-MM-dd", // 日志文件切分，以不同的维度切分（时间or文件...）
        },
      },
      // 日志级别
      categories: {
        // 默认日志级别
        default: {
          // 日志输出
          appenders: ["console", "dateFile"], // 日志输出
          // 日志级别
          level: "trace",
        },
      },
    });
    logger = log4js.getLogger();
  }

  return logger;
};
