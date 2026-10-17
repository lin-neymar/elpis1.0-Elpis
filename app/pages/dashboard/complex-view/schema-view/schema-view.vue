<template>
  <el-row class="schema-view">
    <search-panel
      v-if="searchSchema?.properties && Object.keys(searchSchema.properties).length > 0"
      @search="onSearch"></search-panel>
    <table-panel @operate="onTableOperate" ref="tablePanelRef"></table-panel>

    <!-- 动态组件 -->
    <component
      v-for="(item, key) in components"
      :key="key"
      :is="componentConfig[key]?.component"
      ref="componentListRef"
      @command="onComponentCommand"></component>
  </el-row>
</template>
<script setup>
import { ref, provide } from 'vue';
import SearchPanel from './complex-view/search-panel/search-panel.vue';
import TablePanel from './complex-view/table-panel/table-panel.vue';
import componentConfig from './components/component-config.js';
import { useSchema } from './hook/schema.js';

const { api, tableSchema, tableConfig, searchSchema, searchConfig, components } = useSchema();

const apiParams = ref({});
provide('schemaViewData', {
  api,
  apiParams,
  tableSchema,
  tableConfig,
  searchSchema,
  searchConfig,
  components,
});

const tablePanelRef = ref(null);
const componentListRef = ref([]);

const onSearch = (searchValObj) => {
  apiParams.value = searchValObj;
};

// showComponent 展示动态组件
const showComponent = ({ btnConfig, rowData }) => {
  const { comName } = btnConfig.eventOption;
  if (!comName) return console.error('没配置组件名');

  const componentRef = componentListRef.value.find((item) => item.name === comName);
  if (!componentRef || typeof componentRef.show !== 'function') return console.error(`找不到组件：${comName}`);

  componentRef.show(rowData);
};

// table 事件映射（须在 showComponent 定义之后，否则会触发 TDZ）
const EvenHandleMap = {
  showComponent,
};

const onTableOperate = ({ btnConfig, rowData }) => {
  const { eventKey } = btnConfig;
  if (EvenHandleMap[eventKey]) {
    EvenHandleMap[eventKey]({ btnConfig, rowData });
  }
};

// 响应组件事件
const onComponentCommand = (data) => {
  const { event } = data;
  if (event === 'loadTableData') {
    tablePanelRef.value.loadTableData();
  }
};
</script>
<style lang="less" scoped>
.schema-view {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  :deep(.title) {
    color: #6d6c6c;
  }
}
</style>
