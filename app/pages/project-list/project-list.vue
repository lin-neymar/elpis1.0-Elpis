<template>
  <header-container title="项目列表">
    <template #main-content>
      <div v-loading="loading">
        <div v-for="item in modelList" :key="item.model?.key">
          <!-- 展示 model -->
          <div class="model-panel">
            <el-row type="flex" align="middle">
              <div class="title">{{ item.model?.name }}</div>
            </el-row>
            <div class="divider"></div>
          </div>
          <!-- 展示 project -->
          <el-row flex class="project-list">
            <el-card v-for="projItem in item.project" :key="projItem.key" class="project-card">
              <template #header>
                <span>{{ projItem.name }}</span>
              </template>
              <div class="content">
                {{ projItem.desc ?? '-----' }}
              </div>
              <template #footer>
                <el-row justify="end">
                  <el-button link type="primary" @click="onEnter(projItem)">进入</el-button>
                </el-row>
              </template>
            </el-card>
          </el-row>
        </div>
      </div>
    </template>
  </header-container>
</template>
<script setup>
import { ref, onMounted } from 'vue';
import $curl from '$common/curl.js';
// 在 js 中，用大写开头的驼峰
// 在template 中用 - 连接
import HeaderContainer from '$widgets/header-container/header-container.vue';

const loading = ref(false);

const modelList = ref([]);
async function getModelList() {
  loading.value = true;
  const res = await $curl({
    method: 'get',
    url: '/api/project/model_list',
    errorMessage: '获取项目列表失败',
  });
  loading.value = false;

  if (!res || !res.success || !res.data) {
    return;
  }
  modelList.value = res.data;
}

const onEnter = (projItem) => {
  const { origin } = window.location;
  window.open(`${origin}/view/dashboard#${projItem.homePage}`);
};

onMounted(() => {
  getModelList();
});
</script>
<style lang="less" scoped>
.model-panel {
  margin: 20px 50px;
  min-width: 500px;
  .title {
    font-size: 25px;
    font-weight: bold;
    color: #6d6c6c;
  }
  .divider {
    margin-top: 10px;
    border-bottom: 1px dashed #d7d7d7;
  }
}

.project-list {
  margin: 0 50px;
  .project-card {
    margin-right: 30px;
    margin-bottom: 20px;
    width: 300px;
    .title {
      font-weight: bold;
      font-size: 17px;
      color: #47a2ff;
    }
    .content {
      height: 70px;
      color: darkgray;
      font-size: 15px;
      overflow: scroll;
    }
  }
}
</style>
