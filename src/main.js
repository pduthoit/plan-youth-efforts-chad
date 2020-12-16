import Vue from 'vue'
import App from './App.vue'
import store from './store/store'
import * as Axios from 'axios'

Vue.config.productionTip = false
Axios.defaults.headers.common['Authorization'] = `Token 85e323199cf8f7c19cd7d9b5e22e69f5235f3c2b`;

new Vue({
  render: h => h(App),
  store
}).$mount('#app')
