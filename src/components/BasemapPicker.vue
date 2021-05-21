<template>
  <div class="BasemapPicker">
    <div class="BasemapPicker__toggle" v-on:click="toggleBasemapPicker()"><img class="BasemapPicker__img" :src="require('../assets/img/icons/layer.svg')" /></div>
    <ul class="BasemapPicker__list" v-show="shown">
      <li :class="'BasemapPicker__item' + (state.style === s.style ? ' BasemapPicker__item--active' : '')"
        v-for="s in styles"
        v-on:click="updateStyle(s.style)"
        :key="s.style"
        >
        <img class="BasemapPicker__img" :src="s.img" />
        <span class="BasemapPicker__name">{{ s.name }}</span>
      </li>
    </ul>
  </div>
</template>

<script>

export default {
  name: 'BasemapPicker',
  data: function() {
    return {
      shown: false,
      styles: [
        {
          style: 'plcartong/ckihfzfro6i8b19s2zwgr3jdx/draft',
          name: "Plan",
          img: require('../assets/img/basemap-plan.png')
        },
        {
          style: 'plcartong/ckoy2wdqy00px17nj4b0otfog/draft',
          name: "Satellite",
          img: require('../assets/img/basemap-satellite.png')
        },
      ]
    }
  },
  methods: {
    updateStyle(style) {
      this.$store.commit('updateStyle', style)
    },
    toggleBasemapPicker() {
      this.shown = !this.shown;
    }
  },
  computed: {
    state: function () {
      return this.$store.state
    }
  }
}
</script>

<style lang="less">

  @import "../assets/less/var";

  .BasemapPicker {
    z-index: 1;
    position: absolute;
    top: 108px;
    right: 10px;
    display: flex;
    flex-flow: column;
    align-items: flex-end;

    .BasemapPicker__toggle {
      display: flex;
      flex-flow: column nowrap;
      justify-content: center;
      align-items: center;
      background: white;
      width: 29px;
      height: 29px;
      cursor: pointer;
      box-shadow: 0 0 0 2px rgba(0,0,0, .1);
      border-radius: 4px;

      img {
        width: 50%;
      }
    }

    .BasemapPicker__list {
      display: flex;
      flex-flow: column nowrap;
      font-family: @font-secondary;
      text-transform: uppercase;
      list-style-type: none;
      margin-top: 10px;
      padding: 0;
      color: #444;

      .BasemapPicker__item {
        padding: 2px 0 0 8px;
        line-height: 12px;
        font-size: 0.8em;
        cursor: pointer;
        display: flex;
        flex-flow: column nowrap;
        align-items: flex-end;
        opacity: 1;

        &--active {
          color: @color-primary;

          .BasemapPicker__img {
            border-width: 4px;
          }
        }

        .BasemapPicker__img {
          width: 40px;
          height: 40px;
          margin-bottom: 5px;
          border: solid 2px #fff;
          border-radius: 5px;
        }

        .BasemapPicker__name {
          font-weight: 700;
          text-transform: uppercase;
          color: white;
          font-size: 0.65em;
          margin-bottom: 10px;
          background: rgba(0,0,0,0.5);
          padding: 2px 5px;
          border-radius: 4px;
        }
      }
    }
  }
</style>
