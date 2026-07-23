<template>
  <!-- el-config-provider 是 Element Plus 的全局配置容器，用来给内部所有 Element Plus 子组件提供统一配置 -->
  <!-- 其中配置了一项：中文语言包 :locale="zhCn" -->
  <!-- 这里为什么要包一层：headerView 及其子组件里只要用了 Element Plus，都会继承这份中文配置，不用每个组件单独设 locale -->
  <el-config-provider :locale="zhCn">
    <header-view :projectName="projectName" @onMenuSelect="onMenuSelect">
      <template #main-content>
        <router-view></router-view>
      </template>
    </header-view>
  </el-config-provider>
</template>
<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import zhCn from 'element-plus/es/locale/lang/zh-cn';
import HeaderView from './complex-view/header-view/header-view.vue';
import $curl from '$common/curl.js';
import { useMenuStore } from '$store/menu.js';
import { useProjectStore } from '$store/project.js';

const route = useRoute();
const router = useRouter();
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
      proj_key: route.query.proj_key,
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
      proj_key: route.query.proj_key,
    },
  });

  if (!res || !res.success || !res.data) return;
  const { name, menu } = res.data;
  projectName.value = name;
  menuStore.setMenuList(menu);
};

// 点击菜单回调方法
const onMenuSelect = (menuItem) => {
  const { moduleType, key, customConfig } = menuItem;

  // 如果是当前页面，不处理
  if (key === route.query.key) return;

  const pathMap = {
    sider: '/sider',
    iframe: '/iframe',
    schema: '/schema',
    custom: customConfig?.path,
  };

  router.push({
    path: `/view/dashboard${pathMap[moduleType]}`,
    query: {
      key,
      proj_key: route.query.proj_key,
    },
  });
};
</script>
<style lang="less" scoped></style>
