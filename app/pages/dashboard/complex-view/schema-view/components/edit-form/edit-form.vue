<template>
  <el-drawer v-model="isShow" direction="rtl" :destroy-on-close="true" :size="550">
    <template #header>
      <h3 class="title">{{ title }}</h3>
    </template>
    <template #default>
      <schema-form
        :schema="components[name]?.schema"
        :model="dtoModel"
        ref="schemaFormRef"
        v-loading="loading"></schema-form>
    </template>
    <template #footer>
      <el-button type="primary" @click="save">{{ saveBtnText }}</el-button>
    </template>
  </el-drawer>
</template>
<script setup>
import { ref, inject } from 'vue';
import $curl from '$elpisCommon/curl.js';
import { ElNotification } from 'element-plus';
import SchemaForm from '$elpisWidgets/schema-form/schema-form.vue';

const { api, components } = inject('schemaViewData');
const emit = defineEmits(['command']);

const name = ref('editForm');

const schemaFormRef = ref(null);
const isShow = ref(false);
const loading = ref(false);
const title = ref('');
const saveBtnText = ref('');
const mainKey = ref('');
const mainValue = ref();
const dtoModel = ref({});

const show = (rowData) => {
  const { config } = components.value[name.value];
  title.value = config.title;
  saveBtnText.value = config.saveBtnText;
  mainKey.value = config.mainKey; // 表单主键
  mainValue.value = rowData[config.mainKey]; // 表单主键值
  dtoModel.value = {};
  isShow.value = true; // 打开弹窗

  fetchFormData();
};

// 关闭弹窗的方法
const close = () => {
  isShow.value = false;
};

const fetchFormData = async () => {
  if (loading.value) return; // 防止重复提交
  loading.value = true;
  const res = await $curl({
    method: 'get',
    url: api.value,
    query: {
      [mainKey.value]: mainValue.value,
    },
  });
  loading.value = false;
  if (!res || !res.success || !res.data) return;
  dtoModel.value = res.data;
};

const save = async () => {
  if (loading.value) return; // 防止重复提交
  if (!schemaFormRef.value.validate()) return;
  loading.value = true;
  const res = await $curl({
    method: 'put',
    url: api.value,
    data: {
      [mainKey.value]: mainValue.value,
      ...schemaFormRef.value.getValue(),
    },
  });
  loading.value = false;
  if (!res || !res.success) return;
  ElNotification({
    title: '修改成功',
    message: '修改成功',
    type: 'success',
  });
  close(); // 关闭弹窗
  emit('command', {
    event: 'loadTableData',
  });
};

defineExpose({
  name,
  show,
});
</script>
<style lang="less" scoped></style>
