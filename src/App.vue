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
  data: () => ({
    words
  })
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
</style>
