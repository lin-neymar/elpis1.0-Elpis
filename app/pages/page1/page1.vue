<template>
  <h1>page1</h1>
  <el-input v-model="content" style="width: 150px"></el-input>
  <el-table :data="tableData" style="width: 100%">
    <el-table-column prop="name" label="name" width="180"></el-table-column>
    <el-table-column prop="desc" label="desc"></el-table-column>
  </el-table>
</template>

<script setup>
import { ref, onMounted } from 'vue';
// import utils from '../common/utils'
import utils from '$common/utils';
import $curl from '$common/curl';
console.log('page1 init');
console.log(utils);
const content = ref('test');

const tableData = ref([
  {
    name: 'aaa',
    desc: 'ddd',
  },
  {
    name: 'aaa',
    desc: 'ddd',
  },
  {
    name: 'aaa',
    desc: 'ddd',
  },
]);

onMounted(async () => {
  const res = await $curl({
    url: '/api/project/list',
    method: 'get',
    query: {
      proj_key: '111',
    },
  });

  tableData.value = res.data;
});
</script>

<style lang="less" scoped>
h1 {
  color: red;
}
</style>
