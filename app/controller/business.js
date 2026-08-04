module.exports = (app) => {
  // 引入 base controller
  const BaseController = require('./base')(app); // 因为require过来的是一个函数，所以传入app去执行base中的构造函数
  // 这里返回的是一个类，所以需要用 extends 继承
  return class BusinessController extends BaseController {
    getProductList(ctx) {
      this.success(
        ctx,
        [
          {
            product_id: '1',
            product_name: `${ctx.projKey}测试1`,
            price: 39.9,
            inventory: 999,
            create_time: '2026-07-21 11:35:44',
          },
          {
            product_id: '2',
            product_name: `${ctx.projKey}测试2`,
            price: 199,
            inventory: 899,
            create_time: '2026-07-20 11:38:44',
          },
          {
            product_id: '3',
            product_name: `${ctx.projKey}测试3`,
            price: 398,
            inventory: 609,
            create_time: '2026-07-20 12:35:44',
          },
        ],
        {
          total: 3,
        },
      );
    }

    getProductEnumList(ctx) {
      this.success(ctx, [
        {
          label: `${ctx.projKey}全部`,
          value: `${ctx.projKey}全部`,
        },
        {
          label: `${ctx.projKey}测试1`,
          value: `${ctx.projKey}测试1`,
        },
        {
          label: `${ctx.projKey}测试2`,
          value: `${ctx.projKey}测试2`,
        },
        {
          label: `${ctx.projKey}测试3`,
          value: `${ctx.projKey}测试3`,
        },
      ]);
    }

    deleteProduct(ctx) {
      const { product_id: productId } = ctx.request.body;
      this.success(ctx, {
        product_id: productId,
      });
    }
  };
};
