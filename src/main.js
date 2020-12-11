import Vue from 'vue'
import App from './App.vue'
import store from './store/store'

Vue.config.productionTip = false

Vue.prototype.$COLORS = {
  1: '#f04e54', // Retentionnist
  2: '#397476', // Moratorium
  3: '#509b9c', // Common rights Abolitionist
  4: '#80c7c8',  // Abolitionist
}
new Vue({
  render: h => h(App),
  store
}).$mount('#app')
