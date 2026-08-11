<template>
  <el-drawer v-model="isShow" direction="rtl" :destroy-on-close="true" :size="550">
    <template #header>
      <h3 class="title">{{ title }}</h3>
    </template>
    <template #default>
      <schema-form :schema="components[name]?.schema" ref="schemaFormRef" v-loading="loading"></schema-form>
    </template>
    <template #footer>
      <el-button type="primary" @click="save">{{ saveBtnText }}</el-button>
    </template>
  </el-drawer>
</template>
<script setup>
import { inject, ref } from 'vue';
import $curl from '$common/curl.js';
import { ElNotification } from 'element-plus';
import SchemaForm from '$widgets/schema-form/schema-form.vue';

const { api, components } = inject('schemaViewData');
const emit = defineEmits(['command']);

const name = ref('createForm');

const schemaFormRef = ref(null);
const isShow = ref(false);
const loading = ref(false);
const title = ref('');
const saveBtnText = ref('');
const show = () => {
  const { config } = components.value[name.value];
  title.value = config.title;
  saveBtnText.value = config.saveBtnText;
  isShow.value = true;
};

// 关闭弹窗的方法
const close = () => {
  isShow.value = false;
};

const save = async () => {
  if (loading.value) return; // 防止重复提交
  if (!schemaFormRef.value.validate()) return;
  loading.value = true;
  const res = await $curl({
    method: 'post',
    url: api.value,
    data: {
      ...schemaFormRef.value.getValue(),
    },
  });
  loading.value = false;

  if (!res || !res.success) return;

  ElNotification({
    title: '创建成功',
    message: '创建成功',
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
