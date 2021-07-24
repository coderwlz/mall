import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import toast from 'components/common/toast' 
import FastClick from 'fastclick'
import VueLazyLoad from 'vue-lazyload'
Vue.config.productionTip = false

// 2.安装插件,就相当于调用了toast的install函数方法
Vue.use(toast) 
Vue.use(VueLazyLoad, {
  loading: require('./assets/img/common/placeholder.png')
})
// 解决移动端300ms延迟
FastClick.attach(document.body)
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
