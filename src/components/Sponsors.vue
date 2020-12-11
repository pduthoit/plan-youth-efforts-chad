<template>
  <div class="Sponsors">
    <div class="Sponsors_imgs">
      <img :src="require('@/assets/img/plan_logo.svg')" alt="">
      <img :src="require('@/assets/img/eu_flag.svg')" alt="">
    </div>
    <div class="Sponsors__disclaimer">This project is financed thanks to the support of the European Union.</div>
  </div>
</template>

<style lang="less">

  @import "../assets/less/var";

  .Sponsors {
    max-width: 170px;
    position: absolute;
    right: 0;
    margin: 0 15px 24px 0;

    .Sponsors_imgs {
      display: flex;
      flex-flow: row nowrap;
      justify-content: space-between;
      align-items: center;

      img {
        height: 38px;
        max-height: 38px;
        margin-bottom: 6px;
      }
    }

    &__disclaimer {
      font-size: 0.67em;
      color: #333;
      line-height: 1.4em;
      text-align: justify;
    }

  }
</style>