import Vue from 'vue';
import Vuex from 'vuex';
import * as Axios from 'axios'

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    AUTH_TOKEN: `Token 62ae6a7111c71d1bf5bf6cd24c66570dff0996cc`,
    FORMS_UID: {
      nigeria:  'aJn6r5KosffwG4S4exSzrJ',
      niger:    'akY29uvotxjroqJPvwxd6J',
      cameroon: 'aubaACN3DGxZ7TGUThEfcp'
    },
    KOBO_USERNAME: 'youthprojectlcr',
    YEAR_DATA: null,
    MAX_COUNT: null,
    submissions: null,
    map: null,
    lang: 'en',
    minYearShown: null,
    yearsCount: 0,
    minYearFilter: 0,
    maxYearFilter: 1,
    categories: {
      'education': { icon: 'education', shown: true, color: "#67cfe3"},
      'health': { icon: 'health', shown: true, color: "#0055b8"},
      'youth-organizations': { icon: 'youth-organizations', shown: true, color: "#e5007d"}
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
    updateYearsData (state, YEAR_DATA) {
      state.YEAR_DATA = YEAR_DATA;
      state.yearsCount = Object.keys(state.YEAR_DATA).length;
      state.minYearShown = Object.keys(state.YEAR_DATA)[0]

      state.minYearFilter = 1
      state.maxYearFilter = Object.keys(state.YEAR_DATA).length + 1
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
        let data = []
        for (const [form_uid] of Object.entries(this.state.FORMS_UID)) {

          const PROXY_FOR_CORS = "https://cors-anywhere.herokuapp.com/"
          const URL = "https://kobo.humanitarianresponse.info/api/v2/assets/" + this.state.FORMS_UID[form_uid] + "/data.json"

          const koboReqOptions = {
            method: 'get',
            url: PROXY_FOR_CORS + URL,
            params: { format: 'json' },
            headers: { Authorization: this.state.AUTH_TOKEN }
          }
          const koboRes = await Axios(koboReqOptions)

          let defaultRow = {
            coords: [],
            year: 1111,
            icon: 'no category',
            label: 'No label',
            description: null,
            image: 'no_image.png',
          };

          for (let d of koboRes.data.results) {
            console.log(d)
            let row = Object.assign({}, defaultRow)
            row.year = +d.today.substring(0,4) + Math.floor(Math.random() * 2)
            row.coords = d._geolocation

            if (d.serviceType === "health") {
              row.icon = d.serviceType
              row.label = d['groupHealth/groupConsentHlt/nameHealth']
              row.image = d['groupHealth/groupConsentHlt/pictureHealth']
              row.description = d['groupHealth/groupConsentHlt/healthInstitution']
            } else if (d.serviceType === "youthParticipation") {
              row.icon = 'youth-organizations'
              row.label = d['groupParticipation/groupConsentParticipation_001/nameyouthOrga']
              row.image = d['groupParticipation/groupConsentParticipation_001/pictureYouthOrga']
              row.description = d['groupParticipation/groupConsentParticipation_001/groupParticipationActivity/activities']
            } else if (d.serviceType === "education") {
              row.icon = d.serviceType
              row.label = d['groupEducation/groupConsentEduc/nameEduc']
              row.image = d['groupEducation/groupConsentEduc/pictureEduc']
              row.description = d['groupEducation/groupConsentEduc/educationInstitution']
            }
            data.push(row)
          }
        }
        this.commit('updateSubmissions', data);
      }catch (e) {
        console.log(e)
        // context.commit("setDataLoadingError", e)
      }
    }
  }
});



