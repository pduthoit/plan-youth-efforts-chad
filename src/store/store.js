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
    translations: null,
    map: null,
    mapLoaded: false,
    lang: 'en',
    minYearShown: null,
    yearsCount: 0,
    minYearFilter: 0,
    maxYearFilter: 1,
    categories: {
      'education': { icon: 'education', shown: true, color: "#00843d"},
      'health': { icon: 'health', shown: true, color: "#0072ce"},
      'youth-organizations': { icon: 'youth-organizations', shown: true, color: "#e17800"}
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
    updateTranslations (state, translations) {
      state.translations = translations
    },
    updateMap (state, map) {
      state.map = map
    },
    updateMapLoaded (state) {
      state.mapLoaded = true
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

        // const PROXY_FOR_CORS = ""
        const PROXY_FOR_CORS = "https://cors-anywhere.herokuapp.com/"
        const TRANSLATION_URL = "https://kobo.humanitarianresponse.info/api/v2/assets/" + this.state.FORMS_UID.cameroon + "/deployment/";
        const koboReqOptions = {
          method: 'get',
          url: PROXY_FOR_CORS + TRANSLATION_URL,
          params: { format: 'json' },
          headers: {
            Authorization: this.state.AUTH_TOKEN
          }
        }
        await Axios(koboReqOptions).then(async (response) => {
          let translations = {};
          response.data.asset.content.choices.forEach(choice => {
            let name = choice.name;
            translations[name] = choice;
          })
          this.commit('updateTranslations', translations);

          for (const [form_uid] of Object.entries(this.state.FORMS_UID)) {

            const URL = "https://kobo.humanitarianresponse.info/api/v2/assets/" + this.state.FORMS_UID[form_uid] + "/data.json"

            koboReqOptions.url = PROXY_FOR_CORS + URL
            await Axios(koboReqOptions).then(async (response) => {

              let defaultRow = {
                coords: [],
                year: 1111,
                icon: 'no category',
                label: 'No label',
                description: null,
                image: 'no_image.png',
                type: {
                  en: '',
                  fr: '',
                },
              };

              for (let d of response.data.results) {
                // Show only validated submissions
                if (d._validation_status.uid === 'validation_status_approved') {

                  let row = Object.assign({}, defaultRow)
                  let type = ""
                  row.year = +d.today.substring(0,4)
                  row.coords = d._geolocation.reverse()
                  row.label = d['groupConsent/groupMapDisplay/name']
                  row.image = d['groupConsent/groupMapDisplay/picture']
                  let serviceType = d['groupConsent/groupMapDisplay/serviceType']

                  if (serviceType === "health") {
                    row.icon = serviceType
                    type = d['groupConsent/groupMapDisplay/subTypeHlt']
                  } else if (serviceType === "youthParticipation") {
                    row.icon = 'youth-organizations'
                    type = d['groupConsent/groupMapDisplay/subTypeOrganization']
                  } else if (serviceType === "education") {
                    row.icon = serviceType
                    type = d['groupConsent/groupMapDisplay/subTypeEduc']
                  }

                  // Handles translations
                  if (translations[type] != undefined) {
                    row.type.en = translations[type].label[0];
                    row.type.fr = translations[type].label[1];
                  } else {
                    row.type.en = type;
                    row.type.fr = type;
                  }

                  data.push(JSON.parse(JSON.stringify(row)))
                }
              }
            })
          }
        });

        this.commit('updateSubmissions', JSON.parse(JSON.stringify(data)));

      } catch (e) {
        console.log(e)
        // context.commit("setDataLoadingError", e)
      }
    }
  }
});
