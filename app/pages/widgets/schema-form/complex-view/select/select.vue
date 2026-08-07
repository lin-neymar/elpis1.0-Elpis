<template>
  <el-row type="flex" align="middle" class="form-item">
    <!-- label -->
    <el-row class="item-label" justify="end">
      <!-- 是否展示必填星号 -->
      <el-row v-if="schema.option?.required" type="flex" class="required">*</el-row>
      {{ schema.label }}
    </el-row>
    <!-- value -->
    <el-row class="item-value">
      <el-select
        v-model="dtoValue"
        v-bind="schema.option"
        class="component"
        :class="validTips ? 'valid-border' : ''"
        @change="onChange">
        <el-option
          v-for="item in schema.option?.enumList"
          :key="item.value"
          :label="item.label"
          :value="item.value"></el-option>
      </el-select>
    </el-row>
    <!-- 校验时显示的错误信息 -->
    <el-row v-if="validTips" class="vaild-tips">{{ validTips }}</el-row>
  </el-row>
</template>
<script setup>
import { ref, toRefs, watch, inject, onMounted } from 'vue';
const ajv = inject('ajv');

const props = defineProps({
  schemaKey: String,
  schema: Object,
  model: Object,
});

const { schemaKey, schema } = props;
const { model } = toRefs(props);

const dtoValue = ref();
const validTips = ref(null);
const initData = () => {
  dtoValue.value = model.value ?? schema.option?.default;
  validTips.value = null;
};

onMounted(() => {
  initData();
});

watch(
  [schema, model],
  () => {
    initData();
  },
  { deep: true },
);

const validateFn = () => {
  validTips.value = '';

  // 校验是否必填
  if (schema.option?.required && !dtoValue.value) {
    validTips.value = '该值不能为空！';
    return false;
  }

  // ajv 校验schema
  if (dtoValue.value) {
    let dtoEnum = [];
    if (schema.option?.enumList) {
      dtoEnum = schema.option?.enumList.map((item) => item.value);
    }
    const validate = ajv.compile({
      ...schema,
      enum: dtoEnum,
    });
    const vaild = validate(dtoValue.value);
    if (!vaild && validate.errors && validate.errors[0]) {
      if (validate.errors[0].keyword === 'enum') {
        validTips.value = '取值超出枚举范围';
      } else {
        console.log(validate.errors[0]);
        validTips.value = '不符合要求';
      }
      return false;
    }
    return true;
  }

  return true;
};

const onChange = () => {
  validate();
};

const getValue = () => {
  return dtoValue.value !== undefined ? { [schemaKey]: dtoValue.value } : {};
};

defineExpose({
  validateFn,
  getValue,
});
</script>
<style lang="less" scoped></style>
