<template>
  <nav id="Legend" class="Legend">
    <div
      class="Legend__item"
      v-for="category in $store.state.categories" :key="category.icon"
      :style="'border-color:' + category.color + (selected(category.icon) ? (';background:'+ category.color) : '') + (($store.state.selectedCategory !== null && !selected(category.icon)) ? ';filter: grayscale(1)' : '')"
      :data-selected="selected(category.icon)">
      <input @click="updateFilter(category.icon)" checked name="category" type="radio" :id="'poi-' + category.icon" :style="'background-color:'+category.color">
      <label :for="'poi-' + category.icon">
        <div class="Legend__image">
          <img :src="require('@/assets/img/icons/' + category.icon + (selected(category.icon) ? '' : '-c') + '.svg')" alt=""/>
        </div>
        <div class="Label" :style="'color:'+category.color">{{ words[$store.state.lang].category[category.icon] }}</div>
      </label>
    </div>
  </nav>
</template>

<script>
import { words } from '@/constants/lang'

export default {
  name: 'CategoryPicker',
  data: () => ({
    words
  }),
  methods: {
    selected(category) {
      return this.$store.state.selectedCategory === category;
    },
    updateFilter(category) {
      this.$store.commit("updateSelectedCategory", category)
    }
  }
}
</script>

<style lang="less">
@import "../assets/less/var";

.Legend {
  display: flex;
  flex-flow: row nowrap;
  margin-bottom: 1rem;
  color: #fff;

  .Legend__item {
    background: #fafafa;
    flex: 1 0 auto;
    min-height: 30px;
    border: solid 1.5px #000;
    box-sizing: border-box;
    justify-content: center;
    align-items: center;
    display: flex;
    cursor: pointer;
    flex-flow: row nowrap;
    @border-w: 0.75px;

    label {
      padding: .25rem .5rem;
    }

    &:nth-child(1) { border-radius: @rad-box 0 0 @rad-box; border-right-width: @border-w; }
    &:nth-child(2) { border-radius: 0 0 0 0; border-left-width: @border-w; border-right-width: @border-w; }
    &:nth-child(3) { border-radius: 0 @rad-box @rad-box 0; border-left-width: @border-w; }

    &[data-selected] {
      background: attr(data-selected);

      .Label {
        color: white !important;
      }
    }

    input[type='radio']:first-child + label {
      border-radius: 3px 3px 0 0;
    }

    label:last-child {
      border-radius: 0 0 3px 3px;
      border: none;
    }

    input[type='radio'] {
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
          font-size: 1em;
          font-family: @font-primary;
          font-weight: 100;
          flex: 1 0 auto;
          display: inline-block;
        }

        .Legend__image {
          img {
            width: 23px;
            max-height: 23px;
            margin-right: 6px;
          }
        }
      }
    }
    * {
      transition: all .12s ease-in;
    }
    input[type='checkbox']:not(:checked) + label > .Legend__image {
      background: #bbb !important;
    }
    input[type='checkbox']:checked + label {
      .Label {
        color: #333;
      }
    }
  }
}
</style>
