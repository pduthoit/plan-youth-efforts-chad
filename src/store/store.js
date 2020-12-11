import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

var defaultMinYear = 2018;
var defaultMaxYear = 2020;

export default new Vuex.Store({
  state: {
    map: null,
    lang: 'en',
    yearsCount: 6,
    defaultMinYearFilter: defaultMinYear,
    defaultMaxYearFilter: defaultMaxYear,
    minYearShown: null,
    minYearFilter: defaultMinYear,
    maxYearFilter: defaultMaxYear,
    categories: {
      'child-protection': { icon: 'child-protection', label: 'child-protection', shown: true, color: "#0072ce"},
      'community-building': { icon: 'community-building', label: 'community-building', shown: true, color: "#00843d"},
      'data': { icon: 'data', label: 'data', shown: true, color: "#e17800"},
      'school': { icon: 'school', label: 'school', shown: true, color: "#d22630"},
      'sexual-violence': { icon: 'sexual-violence', label: 'sexual-violence', shown: true, color: "#ef008c"},
      'training': { icon: 'training', label: 'training', shown: true, color: "#f1c400"},
    }
  },
  mutations: {
    updateMap (state, map) {
      state.map = map
    },
    updateLang (state, lang) {
      state.lang = lang
    },
    updateMinYearShown (state, minYearShown) {
      state.minYearShown = minYearShown
    },
    updateMinYearFilter (state, year) {
      state.minYearFilter = year
    },
    updateMaxYearFilter (state, year) {
      state.maxYearFilter = year
    },
    toggleMapLayerState(state, category) {
      state.categories[category].shown = !state.categories[category].shown;

      if (typeof state.map.getLayer('poi-' + category) !== 'undefined') {
        state.map.setLayoutProperty(
          'poi-' + category,
          'visibility',
          state.categories[category].shown ? 'visible' : 'none'
        );
      }
    }
  }
});
