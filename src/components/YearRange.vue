<template>
  <div class="YR__ctn">
    <div class="YR YR--barCharts">
      <div
        class="YR__barChart"
        v-for="(element, index) in this.years"
        :data-active="((index + 1) >= $store.state.minYearFilter) && ((index + 1) < $store.state.maxYearFilter)"
        :key="index">
        <div class="YR__col"></div>
        <div class="YR__col"></div>
        <div class="YR__col"></div>
        <div class="YR__col"></div>
        <div class="YR__col"></div>
        <div class="YR__col"></div>
      </div>
    </div>
    <div class="YR YR--draglist">
      <draggable class="YR__dragzone" :move="checkMove" :list="element" group="people" @change="log(minYearShown)" v-for="(element, index) in this.years" :key="index">
        <div
          class="YR__dragpoint"
          v-for="(el) in element"
          :key="el.index"
        >lll</div>
      </draggable>
      <rawDisplayer class="col-3" :value="years" title="List 1" />
    </div>
    <div class="YR YR--barCtn">
      <div
        class="YR__bar "
        :data-active="((index) >= $store.state.minYearFilter) && ((index) < $store.state.maxYearFilter)" v-for="index in yearsCount"
        :key="index"
        :data-year="minYearShown + index - 1"></div>
    </div>
  </div>
</template>

<script>
import draggable from 'vuedraggable'

export default {
  name: 'YearRange',
  components: {
    draggable
  },
  props: {
    msg: String
  },
  watch: {
  },
  data() {
    return {
      yearsCount: this.$store.state.yearsCount,
      years: null,
      maxYearFilter: this.$store.state.defaultMaxYearFilter,
      minYearFilter: this.$store.state.defaultMinYearFilter,
      data: null
    };
  },
  created: function() {
    this.years = this.initYearsData()
  },
  computed: {
    delta: function () {
      return this.maxYearFilter - this.minYearFilter
    },
    minYearShown: function () {
      let minYearShown = this.$store.state.defaultMinYearFilter - this.minYear;
      this.$store.commit('updateMinYearShown', minYearShown)
      return minYearShown
    },
    minYear: function () {
      return Math.floor(this.yearsCount / 2 - this.delta);
    },
    maxYear: function () {
      return this.yearsCount - Math.ceil(this.yearsCount / 2 - this.delta)
    }
  },
  methods: {
    checkMove: function(evt){
      return (evt.relatedContext.list.length < 1);
    },
    add: function() {
      this.years.push({ name: "Juan" });
    },
    replace: function() {
      this.years = [{ name: "Edgard" }];
    },
    clone: function(el) {
      return {
        name: el.name + " cloned"
      };
    },
    log: function() {
      let min = null, max = null;
      let index = this.minYear;
      this.years.forEach(year => {
        if (min == null) {
          if (year.length) {
            this.$store.commit('updateMinYearFilter', index);
            min = index;
          }
        } else if (max == null) {
          if (year.length) {
            this.$store.commit('updateMaxYearFilter', index)
            max = index;
          }
        }
        index++
      });
    },

    initYearsData: function() {
      let years = [];
      for (var step = 0, yearLoop = this.minYearShown; step < this.yearsCount; step++, yearLoop++) {
        if (step < this.minYear) years.push([])
        else if (step >= this.maxYear) years.push([])
        else {
          if (yearLoop === this.$store.state.minYearFilter) {
            years.push([{ type: "from", id: 1, year: yearLoop }])
            this.$store.commit('updateMinYearFilter', step + 1)
          }
          else if (yearLoop === this.$store.state.maxYearFilter) {
            years.push([{ type: "to", id: 2, year: yearLoop }])
            this.$store.commit('updateMaxYearFilter', step + 1)
          }
          else years.push([])
        }
      }
      return years;
    }
  }
}
</script>

<style lang="less">
  @import "../assets/less/var";

  @s: .YR;

  @{s}__ctn {
    @{s} {
      width: 100%;
      height: @year-bar-h;
      display: flex;
      flex-flow: row nowrap;
      justify-content: center;

      @year-bar-w: 100px;
      @year-bar-h: 10px;

      &@{s}--barCharts {
        height: 0;
        position: relative;
        top: @year-bar-h;

        @{s}__barChart {
          display: flex;
          flex-flow: row nowrap;
          align-items: flex-end;
          justify-content: center;
          width: @year-bar-w;
          @bar-max-h: 40px;
          height: @bar-max-h;
          top: -@bar-max-h;
          padding: 0 20px;
          box-sizing: border-box;
          position: relative;

          @{s}__col {
            background: #555;
            border: solid 1px white;
            height: 100%;
            flex: 1;
            transform: scaleY(0);
            transform-origin: bottom center;
            transition: transform .15s ease-in-out;
          }
          &[data-active] {

            @{s}__col {
              transform: scaleY(1);
            }
          }

        }
      }

      &@{s}--draglist {
        position: relative;
        top: 0;
        z-index: 1;

        @{s}__dragzone {
          width: @year-bar-h;
          height: @year-bar-h;
          border-radius: 50%;
          margin-right: calc(@year-bar-w - @year-bar-h);
          position: relative;
          top: @year-bar-h;

          @{s}__dragpoint {
            @bigger-wh: 8px;
            text-align: center;
            font-family: Arial;
            color: white;
            width: calc(@year-bar-h + @bigger-wh);
            height: calc(@year-bar-h + @bigger-wh);
            top: -@bigger-wh / 2;
            left: -@bigger-wh / 2;
            position: relative;
            background: #444;
            font-size: 10px;
            display: flex;
            justify-content: center;
            align-items: center;
            box-shadow: 0 2px 4px -1px rgba(0,0,0,0.3);
            border-radius: 50%;
            margin-right: calc(@year-bar-w - @year-bar-h);
          }
        }
      }

      @{s}__bar {

        position: relative;
        width: @year-bar-w;
        height: @year-bar-h;
        background-color: #fff;

        @year-tip: 18px;
        @year-tip-offset: 5px;

        &[data-active] {
          background: @color-lighten-primary;

          &:not(@{s}__bar--hidden) {
            &::before {
              font-weight: bold;
            }
          }
        }

        &:not(@{s}__bar--hidden) {

          &::before {
            content: attr(data-year);
            position: absolute;
            left: -8px;
            top: calc(@year-tip + 5px);
            color: #666;
            font-family: Arial;
            font-size: 0.8em;
          }

          &::after {
            content: "";
            position: absolute;
            left: @year-tip-offset;
            height: @year-tip;
            top: @year-bar-h;
            width: 2px;
            background: #fff;
          }
          &:first-child { border-radius: 5px 0 0 5px; }
          &:last-child { border-radius: 0 5px 5px 0; }
        }

      }
    }
  }
</style>
