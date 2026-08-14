<!-- 对el-table的二次封装，使其具备响应schema的能力 -->
<template>
  <div class="schema-table">
    <el-table class="table" v-if="schema && schema.properties" v-loading="loading" :data="tableData">
      <template v-for="(schemaItem, key) in schema.properties">
        <!-- prop 和 label 是必填的，其他配置可选 -->
        <el-table-column
          v-if="schemaItem.option.visible !== 'false'"
          :key="key"
          :prop="key"
          :label="schemaItem.label"
          v-bind="schemaItem.option"></el-table-column>
      </template>
      <!-- 右侧操作按钮 -->
      <el-table-column v-if="buttons?.length > 0" label="操作" fixed="right" :width="operationWidth">
        <template #default="scoped">
          <el-button
            v-for="item in buttons"
            link
            v-bind="item"
            @click="operationHandle({ btnConfig: item, rowData: scoped.row })"
            >{{ item.label }}</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <el-row justify="end" class="pagination">
      <el-pagination
        :current-page="currentPage"
        :page-size="pageSize"
        :page-sizes="[10, 20, 50, 100]"
        :total="total"
        layout="total,sizes,prev,pager,next,jumper"
        @size-change="onPageSizeChange"
        @current-change="onCurrentPageChange"></el-pagination>
    </el-row>
  </div>
</template>

<script setup>
import { ref, toRefs, computed, watch, nextTick, onMounted } from 'vue';
import $curl from '$common/curl.js';

const emit = defineEmits(['operate']);

const props = defineProps({
  // schema 配置，结构如下：
  //   {
  //      type: 'object',
  //      properties: {
  //         key: {
  //            ...schema, // 标准 schema 配置
  //            type: '', // 字段类型
  //            label: '', // 字段的中文名
  //            option: {
  //               ...elTableColumnConfig, // 标准 el-table-column 配置
  //               visible: true, // 默认为 true (false 或 不配置时，表示不在表单中显示)
  //            },
  //         },
  //     },
  //   },
  schema: Object,
  api: String, // 表格数据源api

  apiParams: Object, // api 请求参数，请求 api 时携带
  // buttons 操作按钮相关配置，结构如下：
  //   [{
  //     label: '', // 按钮中文名
  //     eventKey: '', // 按钮事件名
  //     eventOption: '', // 按钮事件具体配置
  //     ...elButtonConfig, // 标准的 el-button 配置
  //   }]
  buttons: Array,
});

// toRefs(props) = 安全地解构 props；需要单独拿 api/schema/buttons 去做 watch、请求时再用，避免直接解构把响应式弄丢
// 或者使用时采用props.api这种形式，也能保持响应式，但是写起来麻烦，后续需要多次使用到
const { api, schema, buttons, apiParams } = toRefs(props);

const operationWidth = computed(() => {
  return buttons?.value?.length > 0
    ? buttons.value.reduce((pre, cur) => {
        return pre + cur.label.length * 18;
      }, 50)
    : 50;
});

const loading = ref(false);
const tableData = ref([]);
const currentPage = ref(1);
const pageSize = ref(50);
const total = ref(0);

onMounted(() => {
  initData();
});

watch(
  // 这里的 schema、api 已经是 ref，可以直接交给 watch
  // Vue 的 watch 支持直接听 ref / reactive / getter / 数组
  [schema, api, apiParams],
  () => {
    initData();
  },
  { deep: true },
);

let timer = null;
// 防抖请求
const loadTableData = () => {
  if (timer) clearTimeout(timer);
  timer = setTimeout(async () => {
    await fetchTableData();
    timer = null; // 执行完后若不置 null，timer 仍是旧数字（真值），但其实已经没有待跑的定时器了，状态和真实情况不一致
  }, 100);
};
// 初始化数据
const initData = () => {
  currentPage.value = 1;
  pageSize.value = 50;
  nextTick(async () => {
    await loadTableData();
  });
};

// 获取table数据
const fetchTableData = async () => {
  if (!api.value) return;
  showLoading(); // 显示loading
  // 请求 table 数据
  const res = await $curl({
    method: 'get',
    url: `${api.value}/list`,
    query: {
      ...apiParams.value,
      page: currentPage.value,
      size: pageSize.value,
    },
  });
  hideLoading(); // 隐藏loading
  if (!res || !res.success || !Array.isArray(res.data)) {
    tableData.value = [];
    total.value = 0;
    return;
  }
  tableData.value = buildTableData(res.data);
  total.value = res.metadata.total;
};

/*
 * 对后端返回的数据进行渲染前的预处理
 * @param {object} listData 列表数据
 */
const buildTableData = (listData) => {
  if (!schema.value?.properties) return; // 没有schema配置，直接返回

  return listData.map((rowData) => {
    for (const dKey in rowData) {
      const schemaItem = schema.value.properties[dKey];
      // 处理 toFixed 格式化
      if (schemaItem?.option?.toFixed) {
        // 值本身也得是数字（有 toFixed 方法）才格式化
        rowData[dKey] = rowData[dKey].toFixed && rowData[dKey].toFixed(schemaItem.option.toFixed);
      }
    }
    return rowData;
  });
};

// 显示 loading
const showLoading = () => {
  loading.value = true;
};
// 隐藏 loading
const hideLoading = () => {
  loading.value = false;
};

// 操作按钮点击事件
const operationHandle = ({ btnConfig, rowData }) => {
  emit('operate', { btnConfig, rowData });
};

// 分页大小改变事件
const onPageSizeChange = async (value) => {
  pageSize.value = value;
  await loadTableData();
};

// 当前页改变事件
const onCurrentPageChange = async (value) => {
  currentPage.value = value;
  await loadTableData();
};

// 暴露方法出去
defineExpose({
  initData,
  loadTableData,
  showLoading,
  hideLoading,
});
</script>

<style lang="less" scoped>
.schema-table {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: auto;
  .table {
    flex: 1;
  }
  .pagination {
    margin: 10px 0;
    text-align: right;
  }
}
</style>
