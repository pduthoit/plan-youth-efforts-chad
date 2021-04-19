<template>
  <div class="ContentRefresh">
    <span>{{ words[$store.state.lang].pwa.ContentRefresh }}</span>
    <button v-on:click="refreshData">{{ words[$store.state.lang].pwa.ContentRefreshButton }}</button>
  </div>
</template>

<script>
import { words } from '@/constants/lang'

export default {
  name: 'ContentRefresh',
  data: () => ({
    words
  }),
  methods: {
    refreshData: function () {
      window.location.reload()
      this.$store.commit('updateNewContent', false);
    }
  }
}
</script>

<style scoped lang="less">
  @import "../assets/less/var";

  .ContentRefresh {
    box-shadow: 0 4px 10px -3px rgba(0,0,0,.1);
    padding: 15px;
    position: fixed;
    display: flex;
    flex-flow: column nowrap;
    bottom: 10px;
    right: 10px;
    border-radius: 4px;
    background: #fff;
    z-index: 10000;
    border: solid 3px @color-primary;

    span {
      font-size: 15px;
      width: 200px;
      max-width: 100%;
      text-align: center;
    }

    button {
      font-size: 15px;
      margin-top: 8px;
      padding: 8px 10px;
      border-radius: 6px;
      background: #fff;
      outline: none;
      border: solid 1px #ddd;
      cursor: pointer;
      transition: all .15s ease-in;

      &:hover {
        background: #ddd;
      }
    }
  }

</style>
