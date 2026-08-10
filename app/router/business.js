module.exports = (app, router) => {
  const { business: businessController } = app.controller;
  router.post('/api/proj/product', businessController.createProduct.bind(businessController));
  router.delete('/api/proj/product', businessController.deleteProduct.bind(businessController));
  router.get('/api/proj/product/list', businessController.getProductList.bind(businessController));
  router.get('/api/proj/product_enum/list', businessController.getProductEnumList.bind(businessController));
};
