<template>
  <div class="Loader" v-if="!$store.state.mapLoaded">
    <div class="lds-ring"><div></div><div></div><div></div><div></div></div>
    <div class="Loader__text Loader__text--title">Please wait... map should appear in few seconds</div>
    <div class="Loader__text">Loading translations : <span v-html="$store.state.translations === null ? `<b class='dots'></b>` : 'OK'"></span></div>
    <div class="Loader__text">Loading submissions : <span v-html="$store.state.submissions === null ? `<b class='dots'></b>` : 'OK'"></span></div>
    <div class="Loader__text">Loading map : <span v-html="!$store.state.mapLoaded ? `<b class='dots'></b>` : 'OK'"></span></div>
    <div class="Loader__bg"></div>
  </div>
</template>

<style lang="less">

  @import "../assets/less/var";

  .Loader {
    position: fixed;
    height: 100%;
    width: 100%;
    top: 0;
    left: 0;
    z-index: 9999;
    display: flex;
    flex-flow: column;
    justify-content: center;
    align-items: center;

    &__bg {
      position: fixed;
      height: 200%;
      width: 200%;
      top: -50%;
      left: -50%;
      z-index: 0;
      background: rgba(255,255,255,0.8);
    }

    & > *:not(&__bg) {
      margin-bottom: 10px;
      z-index: 2;
    }

    &__text {
      font-size: 1em;
      line-height: 1.2em;
      font-family: 'Consolas', 'Courrier new';
      text-align: right;

      &&--title {
        font-family: @font-primary;
        font-size: 1.4em;
        margin-bottom: 15px;
      }

      span {
        font-weight: bold;
        color: @color-success;
      }
    }

    .lds-ring {
      display: inline-block;
      position: relative;
      width: 80px;
      height: 80px;
      transform-origin: center center;
    }
    .lds-ring div {
      box-sizing: border-box;
      display: block;
      position: absolute;
      width: 64px;
      height: 64px;
      margin: 8px;
      border: 8px solid #444;
      border-radius: 50%;
      animation: lds-ring 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
      border-color: #444 transparent transparent transparent;
    }
    .lds-ring div:nth-child(1) {
      animation-delay: -0.45s;
    }
    .lds-ring div:nth-child(2) {
      animation-delay: -0.3s;
    }
    .lds-ring div:nth-child(3) {
      animation-delay: -0.15s;
    }
    @keyframes lds-ring {
      0% {
        transform: rotate(0deg);
      }
      100% {
        transform: rotate(360deg);
      }
    }

    .dots::after {
      color: #333;
      display: inline-block;
      min-width: 20px;
      text-align: left;
      content: '.';
      animation: dots 2s steps(1, end) infinite;
    }
    @space-w-1: 5px;
    @space-w-2: @space-w-1 * 2;
    @space-w-3: @space-w-1 * 3;
    @keyframes dots {
        0% {
          content: '.';
        }
        33% {
          content: '..';
        }
        66%, 100% {
          content: '...';
        }
    }

  }
</style>
