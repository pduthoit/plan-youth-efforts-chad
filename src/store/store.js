import Vue from 'vue';
import Vuex from 'vuex';
import * as Axios from 'axios'

Vue.use(Vuex);

var defaultMinYear = 2019;
var defaultMaxYear = 2021;

export default new Vuex.Store({
  state: {
    submissions: null,
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
    updateSubmissions (state, submissions) {
      state.submissions = submissions
    },
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

    async getData(){
      try {
        // GET KOBO DATA
        const PROXY_FOR_CORS = "https://cors-anywhere.herokuapp.com/"
        const URL = "https://kobo.humanitarianresponse.info/api/v2/assets/auuqbU6tqVsjCbaNVq26wo/data.json"
        const koboReqOptions = {
          method: 'get',
          url: PROXY_FOR_CORS + URL,
          params: { format: 'json' },
          headers: { Authorization: `Token 85e323199cf8f7c19cd7d9b5e22e69f5235f3c2b` }
        }
        const koboRes = await Axios(koboReqOptions)
        let data = []

        let defaultRow = {
          coords: [],
          year: 1111,
          icon: 'no category',
          label: 'No label',
          description: 'No desc',
          image: 'no_image.png',
        };

        for (let d of koboRes.data.results) {
          let row = Object.assign({}, defaultRow)
          row.year = +d.today.substring(0,4)
          row.coords = d._geolocation

          if (d.serviceType === "health") {
            row.icon = d.serviceType
            row.label = d['groupHealth/groupConsentHlt/nameHealth']
            row.image = d['groupHealth/groupConsentHlt/pictureHealth']
          } else if (d.serviceType === "youthParticipation") {
            row.icon = 'youth-organizations'
            row.label = d['groupParticipation/groupConsentParticipation/nameyouthOrga']
            row.image = d['groupParticipation/groupConsentParticipation/pictureYouthOrga']
          } else if (d.serviceType === "education") {
            row.icon = d.serviceType
            row.label = d['groupEducation/groupConsentEduc/nameEduc']
            row.image = d['groupEducation/groupConsentEduc/pictureEduc']
          }
          data.push(row)
        }
        console.log(data)
        this.commit('updateSubmissions', data);
      }catch (e) {
        console.log(e)
        // context.commit("setDataLoadingError", e)
      }
    }
  }
});



