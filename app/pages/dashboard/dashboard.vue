<template>
  <!-- el-config-provider 是 Element Plus 的全局配置容器，用来给内部所有 Element Plus 子组件提供统一配置 -->
  <!-- 其中配置了一项：中文语言包 :locale="zhCn" -->
  <!-- 这里为什么要包一层：headerView 及其子组件里只要用了 Element Plus，都会继承这份中文配置，不用每个组件单独设 locale -->
  <el-config-provider :locale="zhCn">
    <headerView :projectName="projectName"></headerView>
  </el-config-provider>
</template>
<script setup>
import { ref, onMounted } from 'vue';
import zhCn from 'element-plus/es/locale/lang/zh-cn';
import headerView from './complex-view/header-view/header-view.vue';
import $curl from '$common/curl.js';
import { useMenuStore } from '$store/menu.js';
import { useProjectStore } from '$store/project.js';

const menuStore = useMenuStore();
const projectStore = useProjectStore();

const projectName = ref('');

onMounted(() => {
  getProjectList();
  getProjectConfig();
});

// 请求 /api/project/list 接口，并缓存到 project-store 中
const getProjectList = async () => {
  const res = await $curl({
    method: 'get',
    url: '/api/project/list',
    query: {
      // TODO: 动态获取当前项目key，暂时写死pdd
      proj_key: 'pdd',
    },
  });

  if (!res || !res.success || !res.data) return;

  projectStore.setProjectList(res.data);
};

// 请求 /api/project 接口，并缓存到 menu-store 中
const getProjectConfig = async () => {
  const res = await $curl({
    method: 'get',
    url: '/api/project',
    query: {
      // TODO: 动态获取当前项目key，暂时写死pdd
      proj_key: 'pdd',
    },
  });

  if (!res || !res.success || !res.data) return;
  const { name, menu } = res.data;
  projectName.value = name;
  menuStore.setMenuList(menu);
};
</script>
<style lang="less" scoped></style>
