<template>
  <nav id="Legend" class="Legend">
    <div class="Legend__item" v-for="category in $store.state.categories" :key="category.icon">
      <input checked @click="updateFilter(category.icon)" type="checkbox" :id="'poi-' + category.icon">
        <label :for="'poi-' + category.icon">
          <div class="Image" :style="'background-color:'+category.color">
            <img :src="require('@/assets/img/icons/' + category.icon +'.svg')" alt=""/>
          </div>
          <div class="Label">{{ words[$store.state.lang].category[category.icon] }}</div>
        </label>
    </div>
  </nav>
</template>

<script>
import { words } from '@/constants/lang'

export default {
  name: 'Legend',
  data: () => ({
    words
  }),
  props: {
    // msg: String
  },
  methods: {
    updateFilter(category) {
      this.$store.commit("toggleMapLayerState", category)
    }
  }
}
</script>

<style lang="less">
@import "../assets/less/var";

.Legend {
  z-index: 1;
  border-radius: 3px;
  overflow: hidden;
  margin-bottom: 25px;
  color: #fff;
  box-shadow: 0 6px 15px -5px rgb(178, 204, 226);

  .Legend__item {
    // border-left: solid 5px;
    background: #fff;
    min-height: 30px;

    input[type='checkbox']:first-child + label {
      border-radius: 3px 3px 0 0;
    }
   
    label:last-child {
      border-radius: 0 0 3px 3px;
      border: none;
    }
   
    input[type='checkbox'] {
      display: none;
  
      & + label {
        display: flex;
        flex-flow: row nowrap;
        cursor: pointer;
        align-items: center;
        justify-content: space-between;
        // border-bottom: 1px solid rgba(0, 0, 0, 0.25);

        > .Label {
          text-transform: capitalize;
          color: #999;
          font-size: 1.1em;
          font-family: @font-primary;
          font-weight: 100;
          flex: 1 0 auto;
          display: inline-block;
          padding: 0 12px;
        }

        .Image {
          padding: 11px 9px 7px 9px;
          img {
            width: 17px;
          }
        }
      }
    }
    * {
      transition: all .12s ease-in;
    }
    input[type='checkbox']:not(:checked) + label > .Image {
      background: #bbb !important;
    }
    input[type='checkbox']:checked + label {
      background-color: #fafafa;

      .Label {
        color: #333;  
      }
    }
   
    input[type='checkbox']:checked + label .Label::before {
      content: '✔';
      font-size: 0.8em;
      color: #333;
      margin-right: 7px;
    }
  }
}
</style>
