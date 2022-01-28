<template>
  <div class="InfoPanelPlace" v-if="place != null">
    <div class="IPP__header">
      <div class="IPP__headerActionsCtn">
        <button class="IPP__headerActionsBtn IPP__headerActionsBtn--goBack" @click="goBack()"><img :src="require('@/assets/img/icons/arrow.svg')"/></button>
        <button class="IPP__headerActionsBtn IPP__headerActionsBtn--fullscreen" @click="imageFullScreen = !imageFullScreen"><img :src="require('@/assets/img/icons/fullscreen.svg')"/></button>
      </div>
      <div
        :class="'FullScreenImage' + (imageFullScreen ? ' FullScreenImage--show' : '')"
        v-if="imageBase64 != null"
        @click="imageFullScreen = !imageFullScreen"
        >
        <img :src="imageBase64" />
      </div>
      <div class="IPP__headerLabel">
        <img :src="require('@/assets/img/icons/' + place.icon +'-c.svg')"/>
        <h2 :style="'color: '+ $store.state.categories[place.icon].color">{{ place.label }}</h2>
      </div>
    </div>
    <div class="IPP__content">
      <h3>{{ words[lang].infoPanel.label.Informations }}</h3>
      <div class="IPP__answers">
        <div
          v-for="answer in categoryAnswers"
          :key="answer.id"
          :class="'IPP__answer IPP__answer--' + answer.type">
          <div class="IPP__answerLabel">{{ words[lang].infoPanel.answers[place.icon][answer.id] }}</div>
          <div class="IPP__answerResult" v-if="answer.type === 'switch'" :data-switch="place.data[answer.id]">
            {{ words[lang].infoPanel.results[place.data[answer.id]] }}
          </div>
          <div class="IPP__answerResult" v-else>
            {{ answer.type === 'list' ? list(place.data[answer.id], answer.mapping) : place.data[answer.id] }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

import * as Axios from 'axios'
import { words } from '@/constants/lang'

export default {
  name: 'InfoPanelPlace',
  data: () => ({
    imageFullScreen: false,
    imageBase64: null,
    words,
    answers: {
      'health': [
        { id: 'groupConsent/groupHealth/groupHltFunctinonning/admission', type: "switch" },
        { id: 'groupConsent/groupHealth/groupHltFunctinonning/hltDisability', type: "switch" },
        { id: 'groupConsent/groupHealth/groupHltFunctinonning/staff', type: "kpi" },
        { id: 'groupConsent/groupHealth/groupHltFunctinonning/staffFemale', type: "kpi" },
        { id: 'groupConsent/groupHealth/groupHltFunctinonning/referralReceive', type: "switch" },
        { id: 'groupConsent/groupHealth/groupHltFunctinonning/referralSend', type: "switch" },
        { id: 'groupConsent/groupHealth/groupHltService/ambulance', type: "switch" },
        { id: 'groupConsent/groupHealth/groupHltService/service', type: "text" },
        { id: 'groupConsent/groupHealth/groupHltService/service247', type: "switch" },
        { id: 'groupConsent/groupHealth/groupHltService/youthService', type: "switch" },
        { id: 'groupConsent/groupHealth/groupHltService/youthServiceTYpe', type: "text" },
        { id: 'groupConsent/groupHealth/groupHltService/serviceWomen', type: "switch" },
        { id: 'groupConsent/groupHealth/groupHltService/serviceWomenType', type: "text" },
        { id: 'groupConsent/groupHealth/groupHltService/providerTraining', type: "switch" },
        { id: 'groupConsent/groupHealth/groupHltSrh/monitoringSystem', type: "switch" },
        { id: 'groupConsent/groupHealth/groupHltSrh/monitoringSystemYouth', type: "switch" },
        { id: 'groupConsent/groupHealth/groupHltSrh/sexualViolenceResponse', type: "switch" },
      ],
      'education': [
        { id: 'groupConsent/groupEducation/groupEducStatus/educOwnership', type: "list", mapping: "ownership" },
        { id: 'groupConsent/groupEducation/groupEducStatus/operational', type: "switch" },
        { id: 'groupConsent/groupEducation/groupEducStatus/educDisability', type: "switch" },
        { id: 'groupConsent/groupEducation/groupEducStatus/feedingProgram', type: "switch" },
        { id: 'groupConsent/groupEducation/groupEducFunctionning/teacherFacility', type: "kpi" },
        { id: 'groupConsent/groupEducation/groupEducFunctionning/teacherFemale', type: "kpi" },
        { id: 'groupConsent/groupEducation/groupEducFunctionning/price', type: "switch" },
        { id: 'groupConsent/groupEducation/groupEducCurriculum/peacebuilding', type: "switch" },
        { id: 'groupConsent/groupEducation/groupEducReporting/reportingSystem', type: "switch" },
        { id: 'groupConsent/groupEducation/groupEducReporting/schoolCommitee',type: "switch" },
        { id: 'groupConsent/groupEducation/groupEducSecurity/shelter', type: "switch" },
      ],
      'youth-organizations': [
        { id: 'groupConsent/groupParticipation/groupParticipationRegistration/registration', type: "switch" },
        { id: 'groupConsent/groupParticipation/groupParticipationActivity/organizationActivitiy', type: "list", mapping: "adminLevels" },
        { id: 'groupConsent/groupParticipation/groupParticipationActivity/activities', type: "list", mapping: "activities" },
        { id: 'groupConsent/groupParticipation/groupParticipationActivity/orgaSize', type: "kpi" },
        { id: 'groupConsent/groupParticipation/groupParticipationActivity/orgaSizeWomen', type: "kpi" },
      ]
    }
  }),
  created () {
    this.$root.$refs.InfoPanelPlace = this;
  },
  computed: {
    categoryAnswers: function() {
      return this.answers[this.$store.state.selectedPlaceData.icon]
    },
    lang: function () {
      return this.$store.state.lang
    },
    place: function () {
      return this.$store.state.selectedPlaceData
    }
  },
  methods: {
    list: function (data, mapping) {
      let list = data.split(' ');
      let mappedResults = "";
      list.forEach(item => {
        mappedResults += this.words[this.lang].infoPanel.lists[mapping][item] + ", "
      });
      return mappedResults.substring(0, mappedResults.length - 2);
    },
    goBack: function () {
      this.$store.commit("updateSelectedPlaceData", null)
    },
    showImage: function () {
      if (this.place.image !== undefined) {
        let self = this
        this.getBase64(this.place.image).then(function(results) {
          let base64 = "data:image/jpg;base64," + Buffer.from(results.data, 'binary').toString('base64').replace(/(\r\n|\n|\r)/gm, "");
          let imageHtml = document.getElementsByClassName('IPP__header')[0];
          self.imageBase64 = base64;
          imageHtml.style.backgroundImage = "url('" + self.imageBase64 + "')" ;
        });
        // image = '<div class="Image"><div class="lds-ring"><div></div><div></div><div></div><div></div></div></div>';
      }
    },

    getBase64: async function (url) {
      // const PROXY_FOR_CORS = ""
      const PROXY_FOR_CORS = "https://cartong-cors-anywhere.herokuapp.com/"
      const koboImgUrl = "https://kc.humanitarianresponse.info/attachment/medium?media_file=" + this.$store.state.KOBO_USERNAME + "/attachments/";
      let fullUrl = PROXY_FOR_CORS + koboImgUrl + url;
      const koboReqOptions = {
        method: 'get',
        url: fullUrl,
        headers: {
          Authorization: this.$store.state.AUTH_TOKEN,
          'x-requested-with': 'XMLHttpRequest'
        },
        responseType: 'arraybuffer'
      }
      const koboRes = await Axios(koboReqOptions)
      return koboRes;
    }
  }
}
</script>

<style lang="less">
@import "../assets/less/var";
.InfoPanelPlace {
  background: white;
  flex: 1 0 auto;
  padding: 0 !important;

  .IPP__header {
    background: #ddd;
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center center;
    min-height: 15rem;
    display: flex;
    flex-flow: column nowrap;
    justify-content: space-between;

    .FullScreenImage {
      display: none;
      position: fixed;
      z-index: 1000;
      background: rgba(0,0,0,0.8);
      background-size: unset;
      cursor: pointer;
      background-repeat: no-repeat;
      background-position: center center;
      inset: 0;
      img {
        margin: 150px;
        border: solid;
        box-shadow: 0 4rem 9rem -2rem rgba(0,0,0,0.8);
        cursor: pointer;
      }
      &--show {
        display: flex;
        justify-content: center;
        align-items: center;
      }
    }
    .IPP__headerActionsCtn {
      padding: 0 0 1rem 1rem;
      margin-bottom: 1rem;
      display: flex;
      flex-flow: row nowrap;
      justify-content: space-between;

      button.IPP__headerActionsBtn {
        display: flex;
        flex-flow: column nowrap;
        justify-content: center;
        align-items: center;
        border: none;
        outline: none;
        cursor: pointer;

        &--fullscreen {
          background: rgba(0, 0, 0, 0.25);
          width: 2.2rem;
          height: 2rem;
          border-radius: 0 0 0 10px;
          img {
            width: 70%;
          }
        }

        &--goBack {
          margin-top: 1rem;
          @btn-size: 42px;
          border-radius: 50%;
          height: @btn-size;
          width: @btn-size;
          background: white;
          box-shadow: 0 5px 10px -2px rgba(0,0,0,0.1);
          img {
            width: 70%;
            transform: rotate(180deg);
          }
        }
      }
    }
    .IPP__headerLabel {
      box-shadow: 7px -12px 13px -4px rgba(0,0,0,0.1);
      display: inline-flex;
      justify-content: flex-start;
      align-items: center;
      background: white;
      position: relative;
      width: 100%;
      padding: 5px 0 10px 0;
      border-bottom: solid 1px #bbb;

      &::before {
        content: "";
        top: -@h;
        @h: 12px;
        position: absolute;
        display : inline-block;
        height : 0;
        width : 0;
        border-right : @dim-info-panel solid transparent;
        border-bottom : @h solid white;
      }
      img {
        width: 26px;
        margin: 0 1rem;
      }
      h2 {
        font-family: @font-primary;
        font-size: 1.6em;
        margin: 0 0.5rem 0 0;
        font-weight: 100;
      }
    }
  }

  .IPP__content {
    padding: 1rem;

    h3 {
      font-family: @font-primary;
      font-weight: 100;
      margin: 0 0 .5rem 0;
      font-size: 1.2em;
    }

    .IPP__answers {
      .IPP__answer {
        font-size: .85rem;
        display: flex;
        flex-flow: row nowrap;
        align-items: center;
        justify-content: space-between;
        margin-bottom: .75rem;

        .IPP__answerLabel {
          margin-right: 1rem;
        }

        &--switch {
          .IPP__answerResult {
            &[data-switch="yes"] { color: #17B760; }
            &[data-switch="no"] { color: red; }
          }
        }

        &--text, &--list {
          flex-flow: column nowrap;
          align-items: flex-start;

          .IPP__answerResult {
            margin-top: 7px;
            line-height: 1.4em;

            &::before {
              content: "";
              width: 5px;
              height: 12px;
              display: inline-block;
              border: solid black;
              border-width: 0 0 1px 1px;
              margin: 0 5px 0 5px;
              top: -3px;
              position: relative;
            }
          }
        }

        &--kpi {}

        .IPP__answerResult {
          font-weight: bold;
          &:first-letter {
            text-transform:capitalize;
          }
        }
      }
    }
  }
}
</style>
