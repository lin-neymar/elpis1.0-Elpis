<template>
  <sider-container>
    <template #menu-content>
      <el-menu :default-active="activeKey" :ellipsis="false" @select="onMenuSelect">
        <template v-for="item in menuList">
          <!-- group 再封装一个嵌套菜单，相当于有多级别菜单时 -->
          <sub-menu v-if="item.subMenu && item.subMenu.length > 0" :menu-item="item"></sub-menu>
          <el-menu-item v-else :index="item.key">
            {{ item.name }}
          </el-menu-item>
          <!-- module -->
        </template>
      </el-menu>
    </template>
    <template #main-content>
      <router-view></router-view>
    </template>
  </sider-container>
</template>
<script setup>
import { ref, watch, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useMenuStore } from '$store/menu';
import SiderContainer from '$widgets/sider-container/sider-container.vue';
import subMenu from './complex-view/sub-menu/sub-menu.vue';

const router = useRouter();
const route = useRoute();
const menuStore = useMenuStore();

const menuList = ref([]); // 左侧菜单的菜单列表
const setMenuList = () => {
  const menuItem = menuStore.findMenuItem({
    key: 'key',
    value: route.query.key,
  });
  if (menuItem && menuItem.siderConfig && menuItem.siderConfig.menu) {
    menuList.value = menuItem.siderConfig.menu;
  }
};

const activeKey = ref(''); // 左侧菜单列表的选中值
const setActiveKey = () => {
  let siderMenuItem = menuStore.findMenuItem({
    key: 'key',
    value: route.query.sider_key,
  });

  // 如果首次加载 sider-view，用户未选中左侧菜单，需要默认选中第一个
  if (!siderMenuItem) {
    // activeKey.value = menuList[0].key; 减少代码耦合性，不直接用menuList，再通过findMenuItem找一次
    const menuItem = menuStore.findMenuItem({
      key: 'key',
      value: route.query.key,
    });
    if (menuItem && menuItem.siderConfig && menuItem.siderConfig.menu) {
      const siderMenuList = menuItem.siderConfig.menu;
      siderMenuItem = menuStore.findFirstMenuItem(siderMenuList); // 找出左侧菜单中的第一项
      if (siderMenuItem) {
        // TODO:处理选菜单逻辑
        handleMenuSelect(siderMenuItem.key);
      }
    }
  }
  activeKey.value = siderMenuItem?.key;
};

watch(
  () => route.query.key,
  () => {
    setActiveKey();
  },
);

watch(
  () => menuStore.menuList,
  () => {
    setMenuList();
  },
);

onMounted(() => {
  setMenuList();
  setActiveKey();
});

const onMenuSelect = (menuKey) => {
  /*
   * 这样拆分开的好处：
   * onMenuSelect 作为UI事件入口，只响应 el-menu 的 @select
   * handleMenuSelect 作为业务处理，真正做查找菜单、拼路由、跳转
   *
   */
  handleMenuSelect(menuKey);
};

const handleMenuSelect = (menuKey) => {
  // TODO:处理选中菜单逻辑
  const menuItem = menuStore.findMenuItem({
    key: 'key',
    value: menuKey,
  });
  const { moduleType, key, customConfig } = menuItem;

  // 如果是当前页面，不处理
  if (key === route.query.sider_key) return;

  const pathMap = {
    iframe: '/iframe',
    schema: '/schema',
    custom: customConfig?.path,
  };
  router.push({
    path: `/sider${pathMap[moduleType]}`,
    query: {
      key: route.query.key,
      sider_key: key,
      proj_key: route.query.proj_key,
    },
  });
};
</script>
<style lang="less" scoped></style>
