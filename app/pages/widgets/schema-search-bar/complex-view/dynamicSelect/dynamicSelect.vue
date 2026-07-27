<template>
  <el-select v-model="dtoValue" v-bind="schema.option" class="dynamic-select">
    <el-option v-for="item in enumList" :key="item.value" :label="item.label" :value="item.value"></el-option>
  </el-select>
</template>
<script setup>
import { ref, onMounted } from 'vue';
import $curl from '$common/curl.js';

const { schemaKey, schema } = defineProps({
  schemaKey: String,
  schema: Object,
});

const emit = defineEmits(['loaded']);

const dtoValue = ref();
const getValue = () => {
  return dtoValue.value !== undefined ? { [schemaKey]: dtoValue.value } : {};
};

const reset = () => {
  dtoValue.value = schema?.option?.default ?? enumList.value[0]?.value;
};

const enumList = ref([]);
const fetchEnumList = async () => {
  const res = await $curl({
    method: 'get',
    url: schema.option?.api,
    data: {},
  });
  if (res?.data?.length > 0) {
    enumList.value.push(...res?.data);
  }
};

onMounted(async () => {
  await fetchEnumList(); // 默认值要等选项列表拉完才有东西可取；await 就是在等这件事做完
  reset();
  emit('loaded');
});

defineExpose({
  getValue,
  reset,
});
</script>
<style lang="less" scoped></style>
