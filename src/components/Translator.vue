<template>
  <div class="Translator">
    <ul class="Translator__list">
      <li :class="'Translator__item' + (state.lang === l.lang ? ' Translator__item--active' : '')"
        v-for="l in languages"
        v-on:click="updateLang(l.lang)"
        :key="l.lang"
        >{{ l.lang }}</li>
    </ul>
  </div>
</template>

<script>

export default {
  name: 'Translator',
  data: function() {
    return {
      languages: [
        { lang: 'en' },
        { lang: 'fr' },
        // Enable to add arabic translation item
        // { lang: 'ar', name: "اَلْعَرَبِيَّةُ" }
      ]
    }
  },
  methods: {
    updateLang(lang) {
      this.$store.commit('updateLang', lang)
    }
  },
  computed: {
    state: function () {
      return this.$store.state
    },
    selectedLanguage: function () {
      return this.$store.state.language.name
    }
  }
}
</script>

<style lang="less">

  @import "../assets/less/var";

  .Translator {
    .Translator__list {
      display: inline-flex;
      flex-flow: row nowrap;
      font-family: @font-secondary;
      text-transform: uppercase;
      list-style-type: none;
      margin: 10px;
      padding: 0;
      color: #444;

      .Translator__item {
        padding: 2px 8px 0 8px;
        line-height: 12px;
        font-size: 0.8em;
        cursor: pointer;
        opacity: 0.4;

        &--active {
          color: @color-primary;
          opacity: 1;
        }

        &:not(:last-child) {
          border-right: solid 1px #444;
        }
      }
    }
  }
</style>
