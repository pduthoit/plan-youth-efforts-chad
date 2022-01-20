<template>
  <div :class="$store.state.style === 'plcartong/ckoy2wdqy00px17nj4b0otfog/draft' ? 'App App--satellite' : 'App'">
    <div id="geoapp" :class="$store.state.submissions === null ? 'Blur' : ''">
      <div class="Title">
        <h1 v-html="this.words[this.$store.state.lang].general.Title"></h1>
        <Translator/>
      </div>
      <Map/>
      <BasemapPicker/>
      <InfoPanel/>
      <YearRange/>
      <Sponsors/>
    </div>
    <Loader/>
    <ContentRefresh v-show="$store.state.newContent"/>
  </div>
</template>

<script>
import { words } from '@/constants/lang'
import Map from './components/Map.vue'
import InfoPanel from './components/InfoPanel.vue'
import Translator from './components/Translator.vue'
import Loader from './components/Loader.vue'
import BasemapPicker from './components/BasemapPicker.vue'
import YearRange from './components/YearRange.vue'
import Sponsors from './components/Sponsors.vue'
import ContentRefresh from './components/ContentRefresh.vue'

export default {
  name: 'App',
  components: {
    Map,
    BasemapPicker,
    YearRange,
    Loader,
    Translator,
    Sponsors,
    ContentRefresh,
    InfoPanel
  },
  watch: {
    '$store.state.submissions': function() {

      let categories = Object.keys(this.$store.state.categories)

      // for (let i = 0; i < 200; i++) {
      //   var coord_x = Math.random() + 14;
      //   var coord_y = Math.random() + 12;
      //   var year = Math.floor(Math.random() * 10) + 2015;
      //   var category = categories[Math.floor(Math.random() * 10) % categories.length]

      //   let dataRow = {
      //     coords: [coord_x, coord_y],
      //     year: year,
      //     icon: category,
      //     label: 'This is a label',
      //     description: 'Phasellus ac eros ligula. In congue diam'
      //   };

      //   data.push(dataRow);
      // }
      let data = this.$store.state.submissions
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

      this.$store.commit('updateYearsData', yearCount)
      this.$store.state.MAX_COUNT = maxCount;
    },
  },
  data: () => ({
    words
  }),
  mounted(){
    this.$store.dispatch('getData')
  }
}
</script>


<style lang="less">
  @import "./assets/less/var";

  * {
    font-family: @font-secondary;
  }
  html, body {
    background-color: #ddd;
    margin: 0;
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
  }
  .App {
    height: 100%;
  }
  .BasemapPicker {
    align-self: flex-end;
  }
  #geoapp {
    height: 100%;
    display: flex;
    flex-flow: column nowrap;
    align-items: center;
    justify-content: flex-end;
    overflow: hidden;

    &.Blur {
      filter: blur(10px);
    }

    &::before {
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      pointer-events: none;
      width: 100%;
      height: 20vh;
      background: linear-gradient(180deg, rgba(255,255,255,.7), transparent);
      z-index: 1;
    }
    &::after {
      content: "";
      position: absolute;
      bottom: 0;
      left: 0;
      pointer-events: none;
      width: 100%;
      height: 20vh;
      background: linear-gradient(0deg, rgba(255,255,255,.7), transparent);
      z-index: 1;
    }

    .Title {
      display: flex;
      flex-flow: row nowrap;
      align-items: center;
      align-self: flex-start;
      z-index: 1;
      margin: 1rem 2rem;
      top: 0;
      position: absolute;
      pointer-events: none;
      user-select: none;

      h1 {
        font-size: 1.8em;
        margin: 0;
        line-height: 1.5em;

        text-transform: uppercase;
        color: @color-primary;
        font-weight: 300;

        &, * {
          pointer-events: none;
          user-select: none;
          font-family: @font-primary;
        }
      }
      .Translator {
        z-index: 1;
        pointer-events: initial;
        // user-select: none;
      }
    }

    .Sponsors {
      z-index: 2;
      transform-origin: bottom right;
    }
    .YR__ctn {
      align-self: flex-start;
      margin: 30px 30px 60px 30px;
      z-index: 2;
    }
  }

  @media screen and (max-width: 640px) {
    #geoapp {

      .BasemapPicker {
        top: 140px;
      }

      &::before {
        background: linear-gradient(180deg, rgba(255, 255, 255, 1), transparent);
        height: 25vh;
      }

      .Sponsors {
        display: none;
      }
      .Title {
        margin: 15px;
        align-items: flex-start;

        h1 {
          margin-top: 0;
          font-size: 1.5em;
        }

        .Translator .Translator__list {
          margin: 0;
          .Translator__item {
            font-size: 0.7em;
          }
        }
      }

      .mapboxgl-ctrl-top-right {
        top: 32px;
      }

      .Label::before {
        content: none !important;
      }
      .Legend {
        margin-bottom: 10px;

        .Legend__item input[type='checkbox'] + label > .Label {
          font-size: 0.85em;
          padding: 0 6px;
        }
        .Legend__item input[type='checkbox'] + label .Image {
          padding: 8px 8px 4px 8px;

          img {
            width: 14px;
          }
        }
      }
    }
  }

  // Edit app style if satellite imagery is used in the map
  .App.App--satellite #geoapp {

    &::before {
      background: linear-gradient(180deg, rgba(0,0,0,0.5),transparent);
    }
    &::after {
      background: linear-gradient(0deg,rgba(0,0,0,0.5),transparent);
    }
    .Title h1 {
      &, b {
        font-weight: 100 !important;
        color: white;
      }
    }
    .Translator .Translator__list .Translator__item {
        color: white !important;

        .Translator__item:not(:last-child) {
          border-right-color: white !important;
        }
    }
    .Sponsors__disclaimer {
        color: rgba(255,255,255,.78);
    }
    .mapboxgl-ctrl-attrib a {
      color: rgba(255,255,255,0.75);
    }
    .mapboxgl-ctrl.mapboxgl-ctrl-attrib {
      background-color: rgba(0,0,0,0.5);
    }

    .YR__ctn .YR .YR__bar[data-active] {
      background: #4e4e4e;
    }
    .YR__ctn .YR .YR__bar {
      background-color: #ccc;
    }
    .YR__ctn .YR.YR--barCtn {
      box-shadow: 0 6px 15px -2px rgba(0,0,0,.74);
    }
    .YR__ctn .YR .YR__bar:not(.YR__bar--hidden):before {
      color: #fff;
    }
    .YR__ctn .YR .YR__bar:not(.YR__bar--hidden):after {
      background: #ccc;
    }
    .YR__ctn .YR.YR--draglist .YR__dragzone .YR__dragpoint {
        color: #000;
        background: #fff;
        box-shadow: 0 2px 4px -1px rgba(0,0,0,0.3);
    }

    @media screen and (max-width: 640px) {
      #geoapp:before {
          background: linear-gradient(180deg ,rgba(0,0,0,.37),transparent);
      }
    }

    .mapboxgl-popup-content {
        box-shadow: 0 5px 21px -3px rgba(0,0,0,.5);
    }
  }
  .mapboxgl-ctrl-top-right,
  .mapboxgl-ctrl-bottom-right,
  .Sponsors {
    right: @dim-info-panel;
  }
</style>
