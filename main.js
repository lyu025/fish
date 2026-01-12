import App from './App'

// #ifndef VUE3
import Vue from 'vue'
Vue.config.productionTip = false
App.mpType = 'app'

// main.js
import uView from "uview-ui";
Vue.use(uView);

// 引入并使用 vue-i18n
import VueI18n from 'vue-i18n';
Vue.use(VueI18n);

// 引入语言包，注意路径
import messages from '@/common/locales/index.js';
const i18n = new VueI18n({
	locale: 'en',
	messages: messages,
})
Vue.prototype._i18n = i18n;

// 环境
if (process.env.NODE_ENV === 'development') {
	Vue.prototype.$is_dev = true;
	Vue.prototype.$request_url = 'https://api.203510.com'; // 开发
} else {
	Vue.prototype.$is_dev = false;
	Vue.prototype.$request_url = 'https://api.203510.com'; // 生产
}

// 全局注册 uni_global 方法 使用 this.$xxx 或 uni.$xxx
import uni_global from '@/common/utils/uni_global.js'
Vue.use(uni_global);
// 全局注册 regular 方法 使用 this.$xxx 或 uni.$xxx
import uni_regular from '@/common/utils/uni_regular.js'
Vue.use(uni_regular);

const app = new Vue({
    ...App
})
// 引入请求封装，将app参数传递到配置中
require('@/common/http_request/interceptor.js')(app)
// http接口API集中管理引入部分
require('@/common/http_request/api.js')(app)
app.$mount()
// #endif

// #ifdef VUE3
import { createSSRApp } from 'vue'
export function createApp() {
  const app = createSSRApp(App)
  return {
    app
  }
}
// #endif