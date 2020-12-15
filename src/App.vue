<template>
  <div id="geoapp">
    <div class="Title">
      <h1 v-html="this.words[this.$store.state.lang].general.Title"></h1>
      <Translator/>
    </div>
    <Map/>
    <Legend/>
    <YearRange/>
    <Sponsors/>
  </div>
</template>

<script>
import Vue from 'vue'
import { words } from '@/constants/lang'
import Map from './components/Map.vue'
import Translator from './components/Translator.vue'
import Legend from './components/Legend.vue'
import YearRange from './components/YearRange.vue'
import Sponsors from './components/Sponsors.vue'

export default {
  name: 'App',
  components: {
    Map,
    Legend,
    YearRange,
    Translator,
    Sponsors
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
      console.log(data)
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
    },
  },
  data: () => ({
    words
  }),
  mounted(){
    console.log("running")
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

  #geoapp {
    height: 100%;
    display: flex;
    flex-flow: column nowrap;
    align-items: center;
    justify-content: flex-end;
    overflow: hidden;

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
      z-index: 1;
      margin: 30px 50px;
      top: 0;
      position: absolute;

      h1 {
        font-size: 1.8em;
        text-transform: uppercase;
        color: @color-primary;
        font-weight: 300;

        &, * {
          font-family: @font-primary;
        }
      }
      .Translator {
        z-index: 1;
      }
    }

    .Sponsors {
      z-index: 2;
      transform: scale(0.7);
      transform-origin: bottom right;
    }
    .Legend {
      align-self: flex-start;
      margin-left: 15px;
    }
    .YR__ctn {
      margin: 20px 30px 85px 30px;
      z-index: 2;
    }
  }

  @media screen and (max-width: 640px) {
    #geoapp {
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

      .Legend .Legend__item input[type='checkbox'] + label > .Label {
        font-size: 0.85em;
        padding: 0 6px;
      }
      .Legend .Legend__item input[type='checkbox'] + label .Image {
        padding: 8px 8px 4px 8px;

        img {
          width: 14px;
        }
      }
    }
  }
</style>
