import Vue from 'vue'
import App from './App.vue'

// 导入核心js包
import ElementUI from 'element-ui'
// 导入核心样式
import 'element-ui/lib/theme-chalk/index.css'
// 导入路由实例
import router from './router/index.js'

// 注册element组件库
Vue.use(ElementUI)

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
  // 挂载路由实例
  router
}).$mount('#app')