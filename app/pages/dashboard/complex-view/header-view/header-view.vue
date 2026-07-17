<template>
  <header-container :title="projectName">
    <template #menu-content>
      <!-- 根据 menuStore.menuList 渲染 -->
      <el-menu
        class="dashboard-header-menu"
        :default-active="activeKey"
        :ellipsis="false"
        mode="horizontal"
        @select="onMenuSelect">
        <template v-for="item in menuStore.menuList">
          <SubMenu v-if="item.subMenu && item.subMenu.length > 0" :menu-item="item" :key="item.key"></SubMenu>
          <el-menu-item v-else :index="item.key">{{ item.name }}</el-menu-item>
        </template>
      </el-menu>
    </template>
    <template #setting-content>
      <!-- 根据 projectStore.projectList 渲染 -->
      <el-dropdown @command="handleProjectCommand">
        <span class="project-list">
          {{ projectName }}
          <el-icon v-if="projectStore.projectList.length > 1" class="el-icon--right">
            <ArrowDown></ArrowDown>
          </el-icon>
        </span>
        <template v-if="projectStore.projectList.length > 1" #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item
              v-for="item in projectStore.projectList"
              :key="item.key"
              :command="item.key"
              :disabled="item.name === projectName">
              {{ item.name }}</el-dropdown-item
            >
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </template>
    <template #main-content>
      <slot name="main-content"></slot>
    </template>
  </header-container>
</template>
<script setup>
import { ref, watch, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { ArrowDown } from '@element-plus/icons-vue';
import HeaderContainer from '$widgets/header-container/header-container.vue';
import SubMenu from './complex-view/sub-menu/sub-menu.vue';
import { useMenuStore } from '$store/menu.js';
import { useProjectStore } from '$store/project.js';

const route = useRoute();
const menuStore = useMenuStore();
const projectStore = useProjectStore();

defineProps({
  projectName: String,
});
const emit = defineEmits(['onMenuSelect']);

const activeKey = ref('');

watch(
  () => route.query.key,
  () => {
    setActiveKey();
  },
);

watch(
  () => menuStore.menuList,
  () => {
    setActiveKey();
  },
);

onMounted(() => {
  setActiveKey();
});

const setActiveKey = () => {
  const menuItem = menuStore.findMenuItem({
    key: 'key',
    value: route.query.key,
  });
  activeKey.value = menuItem?.key;
};

// 菜单选择
const onMenuSelect = (menuKey) => {
  const menuItem = menuStore.findMenuItem({
    key: 'key',
    value: menuKey,
  });
  emit('onMenuSelect', menuItem);
};

// 项目选择
const handleProjectCommand = (event) => {
  const projectItem = projectStore.projectList.find((item) => item.key === event);
  if (!projectItem || !projectItem.homePage) return; // 如果项目不存在或没有首页，则返回
  const { origin, pathname } = window.location; // 获取当前页面的 origin 和 pathname
  window.location.replace(`${origin}${pathname}#${projectItem.homePage}`);
  window.location.reload(); // 刷新页面
};
</script>
<!-- 不用 scoped：slot 穿透后 ::deep 选择器无法命中 el-menu，导致覆盖失效 -->
<style lang="less">
.project-list {
  margin-right: 20px;
  cursor: pointer;
  color: var(--el-color-primary);
  display: flex;
  align-items: center;
  outline: none;
}

.dashboard-header-menu.el-menu--horizontal.el-menu {
  border-bottom: 1px solid #e8e8e8;
}
</style>
