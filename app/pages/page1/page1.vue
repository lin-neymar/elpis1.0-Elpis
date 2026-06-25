<template>
  <h1>page1</h1>
  <input v-model="content" />
  <div>{{ content }}</div>
</template>

<script setup>
import { ref } from 'vue';
// import utils from '../common/utils'
import utils from '$common/utils';
const content = ref('');
console.log('page1 init');
console.log(utils);
</script>

<style lang="less" scoped>
h1 {
  color: red;
}
</style>
