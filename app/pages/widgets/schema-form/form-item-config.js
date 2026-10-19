import input from './complex-view/input/input.vue';
import inputNumber from './complex-view/input-number/input-number.vue';
import select from './complex-view/select/select.vue';
import textarea from './complex-view/textarea/textarea.vue';

// 业务扩展 form-item 配置
import businessFormItemConfig from '$businessFormItemConfig';

const FormItemConfig = {
  input: {
    component: input,
  },
  inputNumber: {
    component: inputNumber,
  },
  select: {
    component: select,
  },
  textarea: {
    component: textarea,
  },
};

export default {
  ...FormItemConfig,
  ...businessFormItemConfig,
};
