const assert = require('assert'); //assert — 断言,作用是判断「实际结果」是否等于「预期」
const supertest = require('supertest'); //supertest — HTTP 接口测试
const md5 = require('md5');
const elpisCore = require('../../elpis-core');

const signKey = 'hsdfs73jsds629hsds8vwwgwg8qi9';
const st = Date.now();

// describe 把相关测试归为一组
describe('测试 project 相关接口', function () {
  this.timeout(60000);

  let request;

  // it 一个具体测试场景
  it('启动服务', async () => {
    const app = await elpisCore.start();
    request = supertest(app.listen());
  });

  it('GET /api/project/model_list', async () => {
    let tmpRequest = request.get('/api/project/model_list');
    tmpRequest = tmpRequest.set('s_t', st);
    tmpRequest = tmpRequest.set('s_sign', md5(`${signKey}_${st}`));
    const res = await tmpRequest;
    assert(res.body.success === true);

    console.log(JSON.stringify(res.body));

    const resData = res.body.data;
    assert(resData.length > 0);

    for (let i = 0; i < resData.length; ++i) {
      const item = resData[i];
      assert(item.model);
      assert(item.model.key);
      assert(item.model.name);
      assert(item.project);
      for (const projKey in item.project) {
        assert(item.project[projKey].key);
        assert(item.project[projKey].name);
      }
    }
  });
});
