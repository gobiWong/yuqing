import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
//引入图标样式
import "./assets/font/iconfont.css";
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import Axios from "axios";
import qs from "qs";
import Echarts from "echarts";

// 自适应引入
import 'lib-flexible/flexible';

//引入百度地图
import BaiduMap from 'vue-baidu-map';
Vue.use(BaiduMap, {
  // ak 是在百度地图开发者平台申请的密钥 详见 http://lbsyun.baidu.com/apiconsole/key */
  ak: 'I4aU7iF4urQjQaQCQHVqP4ZtV0NTPERm'
});

//路由守卫
import "./router/routerguard.js";

Vue.config.productionTip = false;

Vue.use(ElementUI);
// 请求拦截器
Axios.interceptors.request.use(
  config => {
    if (
      config.method === "post" &&
      Axios.defaults.headers.post["Content-Type"] === "multipart/form-data;"
    ) {
      return config;
    }
    if (
      config.method === "post" &&
      Axios.defaults.headers.post["Content-Type"] ===
      "application/x-www-form-urlencoded"
    ) {
      config.data = qs.stringify(config.data);
    }
    if (window.localStorage.getItem('token')) {
      config.headers.Authorization = window.localStorage.getItem('token');
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);
// 响应拦截器
Axios.interceptors.response.use(response => {
  return response.data;

},
  error => {
    if (error.response) {
      switch (error.response.status) {
        case 401:
          localStorage.clear();
          location.reload();
      }
    }
    return Promise.reject(error);
  }
);

Axios.defaults.baseURL = "http://47.110.160.217:7080";
// Axios.defaults.baseURL = "http://192.168.0.115:8080";

Vue.prototype.$Echarts = Echarts;
Vue.prototype.$http = Axios;
Vue.prototype.$qs = qs;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
