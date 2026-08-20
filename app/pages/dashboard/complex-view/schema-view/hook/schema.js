import { ref, watch, onMounted, nextTick } from 'vue';
import { useRoute } from 'vue-router';
import { useMenuStore } from '$elpisStore/menu.js';

export const useSchema = () => {
  const route = useRoute();
  const menuStore = useMenuStore();

  const api = ref('');
  const tableSchema = ref({});
  const tableConfig = ref();
  const searchSchema = ref({});
  const searchConfig = ref();
  const components = ref({});

  // 构建数据
  const buildData = () => {
    const { key, sider_key: siderKey } = route.query;

    const mItem = menuStore.findMenuItem({
      key: 'key',
      value: siderKey ?? key,
    });
    if (mItem && mItem.schemaConfig) {
      const { schemaConfig: sConfig } = mItem;

      const configSchema = JSON.parse(JSON.stringify(sConfig.schema)); // 深拷贝对象

      api.value = sConfig.api ?? '';
      tableSchema.value = {};
      tableConfig.value = undefined;
      searchSchema.value = {};
      searchConfig.value = undefined;
      components.value = {};
      nextTick(() => {
        // 构造 tableSchema 和 tableConfig
        tableSchema.value = buildDtoSchema(configSchema, 'table');
        tableConfig.value = sConfig.tableConfig;
        // 构造 searchSchema 和 searchConfig
        const dtoSearchSchema = buildDtoSchema(configSchema, 'search');
        for (const key in dtoSearchSchema.properties) {
          if (route.query[key] !== undefined) {
            dtoSearchSchema.properties[key].option.default = route.query[key];
          }
        }
        searchSchema.value = dtoSearchSchema;
        searchConfig.value = sConfig.searchConfig;
        // 构造 components = { comKey: { schema:{} , config:{} } }
        const { componentConfig } = sConfig;
        if (componentConfig && Object.keys(componentConfig).length > 0) {
          const dtoComponents = {};
          for (const comName in componentConfig) {
            dtoComponents[comName] = {
              schema: buildDtoSchema(configSchema, comName),
              config: componentConfig[comName],
            };
          }
          components.value = dtoComponents; // 赋值
        }
      });
      /*
       * 这里为什么要先清空再nextTick赋值?
       * 强制走一轮「空 → 有」的响应式更新。菜单切换时，若新旧对象结构相似，子组件可能感知不到变化；
       * 先置空再下一拍写入，后续 table-panel 更容易可靠刷新；
       */
    }
  };

  // 通用构建 schema 方法
  const buildDtoSchema = (_schema, comName) => {
    if (!_schema?.properties) return;

    const dtoSchema = {
      type: 'object',
      properties: {},
    };

    // 提取有效 schema 字段信息
    for (const key in _schema.properties) {
      const props = _schema.properties[key];
      //tableOption seachBarOption formOption
      if (props[`${comName}Option`]) {
        let dtoProps = {};
        // 提取 props 中 非option的部分，存放到 dtoProps 中
        for (const pKey in props) {
          if (pKey.indexOf(`Option`) < 0) {
            dtoProps[pKey] = props[pKey];
          }
        }
        // 处理 comName Option
        dtoProps = Object.assign({}, dtoProps, { option: props[`${comName}Option`] });

        // 处理 required 字段
        const { required } = _schema;
        if (required && required.find((pk) => pk === key)) {
          dtoProps.option.required = true;
        }

        dtoSchema.properties[key] = dtoProps;
      }
    }
    return dtoSchema;
  };

  watch(
    [() => route.query.key, () => route.query.sider_key, () => menuStore.menuList],
    () => {
      buildData();
    },
    { deep: true },
  );

  onMounted(() => {
    buildData();
  });

  return {
    api,
    tableSchema,
    tableConfig,
    searchSchema,
    searchConfig,
    components,
  };
};
