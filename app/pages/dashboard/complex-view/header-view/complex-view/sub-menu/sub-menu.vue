<template>
  <el-sub-menu :index="menuItem.key">
    <template #title>{{ menuItem.name }}</template>
    <div :key="item.key" v-for="item in menuItem.subMenu">
      <sub-menu v-if="item.subMenu && item.subMenu.length > 0" :menuItem="item"></sub-menu>
      <el-menu-item v-else :index="item.key">{{ item.name }}</el-menu-item>
    </div>
  </el-sub-menu>
</template>
<script setup>
// 在 Vue 3 的 <script setup> 中，组件递归通常需要 显式 import 自身，否则 <SubMenu> 可能无法识别
import SubMenu from './sub-menu.vue';
const { menuItem } = defineProps(['menuItem']);
</script>
<style lang="less" scoped></style>
