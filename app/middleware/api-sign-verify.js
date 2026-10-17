/*
 * API 签名合法性校验
 */

const md5 = require('md5');

module.exports = (app) => {
  return async (ctx, next) => {
    // 只对 API 请求做签名校验
    if (ctx.path.indexOf('/api') < 0) {
      return await next();
    }
    const { path, method } = ctx;
    const { headers } = ctx.request;
    const { s_sign: sSign, s_t: st } = headers;

    const signKey = 'hsdfs73jsds629hsds8vwwgwg8qi9'; //随意定义,前后端共有的
    const signature = md5(`${signKey}_${st}`);
    app.logger.info(`[${method} ${path}] signature: ${signature}`);

    // 签名不正确或者时间戳不正确或者时间戳过期
    // toLowerCase方法将字符串转换为小写
    if (!sSign || !st || signature !== sSign.toLowerCase() || Date.now() - st > 60000) {
      ctx.status = 200;
      ctx.body = {
        success: false,
        message: 'signature not correct or api timeout!',
        code: 445,
      };
      return;
    }
    await next();
  };
};
