// import { createApp } from 'vue';
// import page1 from './page1.vue';

// const app = createApp(page1);
// app.mount('#root');
// 更改写法
import boot from '$pages/boot.js';
import page1 from './page1.vue';
boot(page1);
