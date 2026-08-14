module.exports = (app) => {
  const sleep = async (time) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, time);
    });
  };

  // 引入 base controller
  const BaseController = require('./base')(app); // 因为require过来的是一个函数，所以传入app去执行base中的构造函数
  // 这里返回的是一个类，所以需要用 extends 继承
  return class BusinessController extends BaseController {
    async getProductList(ctx) {
      await sleep(500);
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

    async getProductEnumList(ctx) {
      await sleep(500);
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

    async deleteProduct(ctx) {
      await sleep(500);
      const { product_id: productId } = ctx.request.body;
      this.success(ctx, {
        product_id: productId,
      });
    }

    async createProduct(ctx) {
      await sleep(500);
      const { product_name: productName, price, inventory } = ctx.request.body;
      this.success(ctx, {
        product_id: Date.now(),
        product_name: productName,
        price,
        inventory,
      });
    }

    async updateProduct(ctx) {
      await sleep(500);
      const { product_id: productId, product_name: productName, price, inventory } = ctx.request.body;
      this.success(ctx, {
        product_id: productId,
        product_name: productName,
        price,
        inventory,
      });
    }
    async getProduct(ctx) {
      const { product_id: productId } = ctx.request.query;
      await sleep(500);
      const productList = [
        {
          product_id: '1',
          product_name: `${ctx.projKey}测试1`,
          price: 39.9,
          inventory: 100,
          create_time: '2026-07-21 11:35:44',
        },
        {
          product_id: '2',
          product_name: `${ctx.projKey}测试2`,
          price: 199,
          inventory: 200,
          create_time: '2026-07-20 11:38:44',
        },
        {
          product_id: '3',
          product_name: `${ctx.projKey}测试3`,
          price: 398,
          inventory: 300,
          create_time: '2026-07-20 12:35:44',
        },
      ];
      const productItem = productList.find((item) => item.product_id === productId);
      this.success(ctx, productItem);
    }
  };
};
