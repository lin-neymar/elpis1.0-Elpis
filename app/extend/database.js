module.exports = (app) => {
  const { db: dbConfig } = app.config;
  if (!dbConfig) {
    return;
  }
  // 框架默认兜底字符集 utf8mb4，避免中文乱码；业务可在 config.db.connection 显式覆盖
  return require('knex')({
    ...dbConfig,
    connection: {
      charset: 'utf8mb4',
      ...dbConfig.connection,
    },
  });
};
