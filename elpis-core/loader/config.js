const path = require('path');
const { sep } = path;
/*
 * config Loader
 * @params {object} app (koa实例)
 *
 * 配置区分 本地/测试/生产，通过 env 环境读取不同文件配置 env.config
 * 通过 env.config 覆盖 default.config 加载到 app.config中
 *
 * 目录下对应的 config 配置 (config目录是放在根目录下)
 * 默认配置 config/config.default.js
 * 本地配置 config/config.local.js
 * 测试配置 config/config.beta.js
 * 生产配置 config/config.production.js
 */
function loadConfigFile(filePath, options = {}) {
  const { required = false, label = 'config' } = options;

  try {
    return require(filePath);
  } catch (e) {
    if (e.code === 'MODULE_NOT_FOUND') {
      if (required) {
        console.error(`[config] 缺少必填配置: ${filePath}`);
        throw e;
      }
      console.warn(`[config] 未找到 ${label}，跳过: ${filePath}`);
      return {};
    }

    console.error(`[config] 加载失败 ${label}: ${filePath}`);
    console.error(e);
    throw e;
  }
}

module.exports = (app) => {
  const configPath = path.resolve(app.baseDir, `.${sep}config`);

  const defaultConfig = loadConfigFile(
    path.resolve(configPath, `.${sep}config.default.js`),
    { required: true, label: 'config.default.js' },
  );

  let envConfig = {};
  let envFile = '';

  if (app.env.isLocal()) {
    envFile = 'config.local.js';
  } else if (app.env.isBeta()) {
    envFile = 'config.beta.js';
  } else if (app.env.isProduction()) {
    envFile = 'config.production.js';
  }

  if (envFile) {
    envConfig = loadConfigFile(
      path.resolve(configPath, `.${sep}${envFile}`),
      { required: false, label: envFile },
    );
  }

  app.config = Object.assign({}, defaultConfig, envConfig);
};
