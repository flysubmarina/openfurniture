import Vue from 'vue'
import './plugins/axios'
import './plugins/bootstrap-vue'
import App from './App.vue'
import router from './router'
import store from './store'
import VueI18n from 'vue-i18n'
Vue.use(VueI18n)
Vue.config.productionTip = false
const i18n = new VueI18n({
locale:'en'
})
new Vue({
  i18n,
  router,
  store,
  render: h => h(App)
}).$mount('#app')
