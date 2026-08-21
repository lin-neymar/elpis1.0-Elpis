import input from './complex-view/input/input.vue';
import select from './complex-view/select/select.vue';
import dynamicSelect from './complex-view/dynamicSelect/dynamicSelect.vue';
import dateRange from './complex-view/dateRange/dateRange.vue';

// 业务扩展 schema-item 配置
import businessSearchItemConfig from '$businessSearchItemConfig';

const SearchItemConfig = {
  input: {
    component: input,
  },
  select: {
    component: select,
  },
  dynamicSelect: {
    component: dynamicSelect,
  },
  dateRange: {
    component: dateRange,
  },
};

export default {
  ...SearchItemConfig,
  ...businessSearchItemConfig,
};
