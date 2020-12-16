<template>
  <div class="Sponsors">
    <div class="Sponsors_imgs">
      <img :src="require('@/assets/img/plan_logo.svg')" alt="">
      <img :src="require('@/assets/img/eu_flag.svg')" alt="">
    </div>
    <div class="Sponsors__disclaimer">{{ this.words[this.$store.state.lang].sponsors.Eu }}</div>
    <div class="Sponsors__disclaimer">{{ this.words[this.$store.state.lang].sponsors.Cooperation }}</div>
  </div>
</template>


<script>
import { words } from '@/constants/lang'

export default {
  data: () => ({
    words
  })
}
</script>

<style lang="less">

  @import "../assets/less/var";

  .Sponsors {
    max-width: 250px;
    position: absolute;
    right: 0;
    margin: 0 15px 24px 0;

    .Sponsors_imgs {
      display: flex;
      flex-flow: row nowrap;
      justify-content: flex-end;
      align-items: center;

      img {
        @logo-h: 26px;
        height: @logo-h;
        max-height: @logo-h;
        margin-bottom: 6px;

        &:first-child {
          margin-right: 15px;
        }
      }
    }

    &__disclaimer {
      font-size: 0.67em;
      color: #333;
      line-height: 1.4em;
      text-align: right;
    }

  }
</style>