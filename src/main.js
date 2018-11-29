// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
// 下面两行代码是引入element-ui和样式文件
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import '@/assets/css/base.css'

import MyServerHttp from '@/plugins/http.js'
import router from './router'

import moment from 'moment'
// 引入面包屑全局组件
import MyBread from '@/components/breadcrumb/myBread.vue'
//全局自定义组件
Vue.component(MyBread.name, MyBread)


Vue.config.productionTip = false
// 使用Vue插件
Vue.use(ElementUI)
// axios自定义Vue插件使用
Vue.use(MyServerHttp)
// 全局过滤器 -- 处理日期格式
Vue.filter('fmtdata',(v)=>{
    return moment(v).format('YYYY-MM-DD')
  })
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
