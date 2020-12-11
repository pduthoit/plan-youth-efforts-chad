<template>
  <nav id="Legend" class="Legend">
    <div class="Legend__item" v-for="category in this.$store.state.categories" :key="category.icon" :style="'border-color:'+category.color">
      <input checked @click="updateFilter(category.icon)" type="checkbox" :id="'poi-' + category.icon"><label :for="'poi-' + category.icon">{{ category.label }}</label>
    </div>
  </nav>
</template>

<script>
export default {
  name: 'Legend',
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
  border-radius: 8px;
  overflow: hidden;
  width: 170px;
  color: #fff;
  box-shadow: 0 6px 15px -5px rgb(178 204 226);

  .Legend__item {
    border-left: solid 5px;
    background: #fff;

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
        display: block;
        cursor: pointer;
        padding: 10px;
        // border-bottom: 1px solid rgba(0, 0, 0, 0.25);
        text-transform: capitalize;
        color: #999;
        font-size: 1.1em;
        font-family: @font-primary;
        font-weight: 100;
  
      }
    }
   
    input[type='checkbox']:checked + label {
      background-color: #fafafa;
      color: #333;  
    }
   
    input[type='checkbox']:checked + label:before {
      content: '✔';
      font-size: 0.8em;
      color: #333;
      margin-right: 5px;
    }
  }
}
</style>
