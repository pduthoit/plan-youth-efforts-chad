import Vue from 'vue';
import Vuex from 'vuex';
import * as Axios from 'axios'

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
      'education': { icon: 'education', shown: true, color: "#67cfe3"},
      'health': { icon: 'health', shown: true, color: "#e5007d"},
      'youth-organizations': { icon: 'youth-organizations', shown: true, color: "#0055b8"}
      // 'child-protection': { icon: 'child-protection', label: 'child-protection', shown: true, color: "#0072ce"},
      // 'community-building': { icon: 'community-building', label: 'community-building', shown: true, color: "#00843d"},
      // 'data': { icon: 'data', label: 'data', shown: true, color: "#e17800"},
      // 'school': { icon: 'school', label: 'school', shown: true, color: "#d22630"},
      // 'sexual-violence': { icon: 'sexual-violence', label: 'sexual-violence', shown: true, color: "#ef008c"},
      // 'training': { icon: 'training', label: 'training', shown: true, color: "#f1c400"},
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
  },

  actions: {
    async getData(context){
      try {
        // GET KOBO DATA
        const URL = "https://kobo.humanitarianresponse.info/api/v2/assets/auuqbU6tqVsjCbaNVq26wo/data.json"
        const koboReqOptions = {
          method: 'get',
          url: URL,
          params: { format: 'json' },
          headers: { Authorization: `Token 85e323199cf8f7c19cd7d9b5e22e69f5235f3c2b` }
        }
        const koboRes = await Axios(koboReqOptions)
        // let data = {}

        // let dataRow = {
        //   coords: [coord_x, coord_y],
        //   year: year,
        //   icon: category,
        //   label: 'This is a label',
        //   description: 'Phasellus ac eros ligula. In congue diam'
        // };

        for (let d of koboRes.data.results) {
          console.log(d)
          // if (data[d['group_general_info/site']] ) {
          //   if (new Date(data[d['group_general_info/site']]._submission_time) < new Date(d._submission_time)) {
          //     data[d['group_general_info/site']] = d
          //   }
          // } else {
          //   data[d['group_general_info/site']] = d
          // }
        }
        // this.state.submissions = data;
        
      } catch (e) {
        context.commit("setDataLoadingError", e)
      }
    }
  }
});



