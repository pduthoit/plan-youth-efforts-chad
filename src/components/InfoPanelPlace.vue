<template>
  <div class="InfoPanelPlace" v-if="place != null">
    <div class="IPP__header">
      <div class="IPP__headerActionsCtn">
        <button @click="goBack()"><img :src="require('@/assets/img/icons/arrow.svg')"/></button>
      </div>
      <div class="IPP__headerLabel">
        <img :src="require('@/assets/img/icons/' + place.icon +'-c.svg')"/>
        <h2 :style="'color: '+ $store.state.categories[place.icon].color">{{ place.label }}</h2>
      </div>
    </div>
    <div class="IPP__content">
      <h3>Informations</h3>
      <div class="IPP__answers">
        <div
          v-for="answer in categoryAnswers"
          :key="answer.id"
          :class="'IPP__answer IPP__answer--' + answer.type">
          <div class="IPP__answerLabel">{{ answer.label }}</div>
          <div class="IPP__answerResult" :data-switch="answer.type === 'switch' ? place.data[answer.id] : false">
            {{ answer.id !== 'id' ? place.data[answer.id] : "NaN" }}
            </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

import * as Axios from 'axios'
import '@mapbox/mapbox-gl-geocoder/lib/mapbox-gl-geocoder.css';
import Map from './Map.vue'

export default {
  name: 'InfoPanelPlace',
  data: () => ({
    answers: {
      'health': [
        { id: 'groupConsent/groupHealth/groupHltFunctinonning/admission', label: "Availability of hospitalization/admissions services", type: "switch" },
        { id: 'groupConsent/groupHealth/groupHltFunctinonning/hltDisability', label: "Mobility disability accessible", type: "switch" },
        { id: 'groupConsent/groupHealth/groupHltFunctinonning/staff', label: "Total number of healthcare staff", type: "kpi" },
        { id: 'groupConsent/groupHealth/groupHltFunctinonning/staffFemale', label: "Total number of female healthcare staff", type: "kpi" },
        { id: 'groupConsent/groupHealth/groupHltFunctinonning/referralReceive', label: "Facility receives referrals", type: "switch" },
        { id: 'groupConsent/groupHealth/groupHltFunctinonning/referralSend', label: "Facility makes referrals", type: "switch" },
        { id: 'groupConsent/groupHealth/groupHltService/ambulance', label: "Availability of a working ambulance", type: "switch" },
        { id: 'groupConsent/groupHealth/groupHltService/service', label: "Most used services", type: "text" },
        { id: 'groupConsent/groupHealth/groupHltService/service247', label: "Availability of some services 24/7", type: "switch" },
        { id: 'groupConsent/groupHealth/groupHltService/youthService', label: "Availability of youth-friendly health services", type: "switch" },
        { id: 'groupConsent/groupHealth/groupHltService/youthServiceTYpe', label: "Available youth-friendly health services", type: "text" },
        { id: 'groupConsent/groupHealth/groupHltService/serviceWomen', label: "Availability of women and girl focused health services", type: "switch" },
        { id: 'groupConsent/groupHealth/groupHltService/serviceWomenType', label: "Available women and girl focused health services", type: "text" },
        { id: 'groupConsent/groupHealth/groupHltService/providerTraining', label: "Availability of current staff trained to provide youth-friendly services", type: "switch" },
        { id: 'groupConsent/groupHealth/groupHltSrh/monitoringSystem', label: "Availability of SRH quality assurance monitoring system", type: "switch" },
        { id: 'groupConsent/groupHealth/groupHltSrh/monitoringSystemYouth', label: "Involvement of adolescents and youth in SRH quality assurance monitoring", type: "switch" },
        { id: 'groupConsent/groupHealth/groupHltSrh/sexualViolenceResponse', label: "Availability of SGBV services", type: "switch" },
      ],
      'education': [
        { id: 'groupConsent/groupEducation/groupEducStatus/educOwnership', label: "Facility ownership", type: "text" },
        { id: 'groupConsent/groupEducation/groupEducStatus/operational', label: "Is the facility operational ?", type: "switch" },
        { id: 'groupConsent/groupEducation/groupEducStatus/educDisability', label: "Mobility disability accessible", type: "switch" },
        { id: 'groupConsent/groupEducation/groupEducStatus/feedingProgram', label: "Existence of feeding program", type: "switch" },
        { id: 'groupConsent/groupEducation/groupEducFunctionning/teacherFacility', label: "Total number of teachers ", type: "kpi" },
        { id: 'groupConsent/groupEducation/groupEducFunctionning/teacherFemale', label: "Total number of female teachers", type: "kpi" },
        { id: 'groupConsent/groupEducation/groupEducFunctionning/price', label: "Free", type: "switch" },
        { id: 'groupConsent/groupEducation/groupEducCurriculum/peacebuilding', label: "Peacebuilding content included in curriculum ", type: "switch" },
        { id: 'groupConsent/groupEducation/groupEducReporting/reportingSystem', label: "Existence of SEA reporting system", type: "switch" },
        { id: 'groupConsent/groupEducation/groupEducReporting/schoolCommitee', label: "Existence of school-based management committee", type: "switch" },
        { id: 'groupConsent/groupEducation/groupEducSecurity/shelter', label: "History of use as a shelter, military operations base or storage center", type: "switch" },
      ],
      'youth-organizations': [
        { id: 'groupConsent/groupParticipation/groupParticipationRegistration/registration', label: "Availability of legal registration", type: "switch" },
        { id: 'groupConsent/groupParticipation/groupParticipationActivity/organizationActivitiy', label: "Administrative level of operations", type: "text" },
        { id: 'groupConsent/groupParticipation/groupParticipationActivity/activities', label: "Main activities / areas of operations", type: "text" },
        { id: 'groupConsent/groupParticipation/groupParticipationActivity/orgaSize', label: "Total number of youth active in the organization", type: "kpi" },
        { id: 'groupConsent/groupParticipation/groupParticipationActivity/orgaSizeWomen', label: "Total number of female youth active in the organization", type: "kpi" },
      ]
    }
  }),
  computed: {
    categoryAnswers: function() {
      return this.answers[this.$store.state.selectedPlaceData.icon]
    },
    lang: function () {
      return this.$store.state.lang
    },
    place: function () {
      return this.$store.state.selectedPlaceData
    },
  },
  watch: {
    '$store.state.selectedPlaceData': function() {
      this.showImage()
    },
  },
  methods: {
    goBack: function () {
      this.$store.commit("updateSelectedPlaceData", null)
    },
    showImage: function() {
      if (this.place.image !== undefined) {
        Map.getBase64(this.place.image).then(function(results) {
          let base64 = "data:image/jpg;base64," + Buffer.from(results.data, 'binary').toString('base64').replace(/(\r\n|\n|\r)/gm, "");
          let imageHtml = document.getElementsByClassName('IPP__header')[0];
          imageHtml.style.backgroundImage = "url('" + base64 + "')";
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

    .IPP__headerActionsCtn {
      padding: 1rem;
      margin-bottom: 1rem;
      button {
        @btn-size: 42px;
        border-radius: 50%;
        height: @btn-size;
        display: flex;
        justify-content: center;
        align-items: center;
        width: @btn-size;
        background: white;
        box-shadow: 0 5px 10px -2px rgba(0,0,0,0.1);
        border: none;
        outline: none;
        cursor: pointer;
        img {
          width: 70%;
          transform: rotate(180deg);
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
        margin: 0;
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

        &--text {
          flex-flow: column nowrap;
          align-items: flex-start;

          .IPP__answerResult {
            margin-top: 7px;

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
