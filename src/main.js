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

let categories = Object.keys(store.state.categories)
var data = [];

store.dispatch('getData')

for (let i = 0; i < 200; i++) {
  var coord_x = Math.random() + 14;
  var coord_y = Math.random() + 12;
  var year = Math.floor(Math.random() * 10) + 2015;
  var category = categories[Math.floor(Math.random() * 10) % categories.length]

  let dataRow = {
    coords: [coord_x, coord_y],
    year: year,
    icon: category,
    label: 'This is a label',
    description: 'Phasellus ac eros ligula. In congue diam'
  };

  data.push(dataRow);
}

var yearCount = {};
let catArr = {};
let yearsList = [...new Set(data.map(item => item.year))];
Array.prototype.forEach.call(categories , function(category) { catArr[category] = {'count': 0} })
for (let i = Math.min(...yearsList); i <= Math.max(...yearsList); i++) { yearCount[i] = JSON.parse(JSON.stringify(catArr)) }

Array.prototype.forEach.call(data , function(line) {
  yearCount[line.year][line.icon].count += 1
})

let maxCount = 0;

for (const [year] of Object.entries(yearCount)) {
  for (const [cat] of Object.entries(yearCount[year])) {
    if (yearCount[year][cat].count > maxCount) maxCount = yearCount[year][cat].count
  }
}

Vue.prototype.$MAX_COUNT = maxCount;
Vue.prototype.$YEAR_DATA = yearCount;
Vue.prototype.$DATA = data;

new Vue({
  render: h => h(App),
  store
}).$mount('#app')
