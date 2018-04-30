<template lang="pug">
section.section.generator: .columns: .column.is-10.is-offset-1
  .notification
    p.control(:class='{"is-loading": isLoading}')
      input.input.is-large(
        type='text', placeholder='E=mc^2', v-model='tex',
        :class='{"is-danger": isInvalid}', spellcheck='false')

    .columns
      .column.is-10.buttons.has-text-left
        span.example.button.is-small.is-hidden-mobile.is-disabled Examples:
        each btn in ['Algebra','Calculus','Stats','Trig','Geometry','Chemistry','Physics']
          a.button.is-small(@click=`setSampleText('${btn}')`)= btn
      .column.invert-switch.has-text-right.is-hidden-mobile
        label.checkbox
          input(type='checkbox', v-model='invert', @click='toggleInvert')
          | Invert

  .image-wrapper.has-text-centered(v-if='tex.length > 0', v-show='!isInvalid')
    img.formula(:src='imageURL("svg")', @error='onError', @load='onLoad', :class='{inverted: invert}')

  .columns: .column(v-if='tex.length > 0', v-show='!isInvalid')
    label.label SVG file URL
    .control.is-grouped
      p.control.is-expanded.image-url
        input.input(type='text', v-model='URLBox', @click='select', readonly)
      p.control
        a.button.is-info(@click='shortenURL', :class='{"is-loading": shortening}') Shorten URL
      p.control
        a.button.is-info(:href='imageURL("png")') Download PNG
</template>

<script>
import axios from 'axios';
import base64url from 'base64-url';
import sampleFormulas from './sampleFomulas';

export default {
  data: () => ({
    tex: '',
    URLBox: '',
    shortening: false,
    isInvalid: false,
    isLoading: false,
    invert: false
  }),
  methods: {
    imageURL(type) {
      const math = base64url.encode(this.tex);
      const opts = this.invert ? 'invert.' : '';
      return `${window.location.href}${math}.${opts}${type}`;
    },
    toggleInvert() {
      document.documentElement.classList.toggle('inverted');
      this.onLoad();
    },
    setSampleText(name) {
      this.tex = sampleFormulas[name];
      this.isLoading = true;
    },
    onError(e) {
      this.isInvalid = true;
      this.isLoading = false;
    },
    onLoad(e) {
      this.isInvalid = false;
      this.isLoading = false;
      this.URLBox = this.imageURL('svg');
    },
    select(e) {
      e.srcElement.select();
    },
    async shortenURL () {
      this.shortening = true;
      const url = 'https://firebasedynamiclinks.googleapis.com/v1/shortLinks?key=';
      const api_key = 'AIzaSyA36RWnvD6DnDY-7ItVaVRdc_Jx_pGsEAM';
      const longDynamicLink = `https://j7a6v.app.goo.gl/?link=${this.imageURL('svg')}`;
      try {
        const res = await axios.post(url + api_key, {longDynamicLink, suffix: {option: 'SHORT'}})
        this.URLBox = `https://mathimg.com/r/${res.data.shortLink.split('/')[3]}`;
      } catch (error) {
        console.error(error);
      } finally {
        this.shortening = false;
      }
    }
  }
}
</script>

<style lang="sass">
html, img.formula
  transition: .3s
  filter: invert(0)
  &.inverted
    filter: invert(90%)

.section.generator
  flex: 1

.buttons .button
  margin: 2px 4px 0 0
  &.example
    border: none
    background: transparent
.invert-switch
  font-size: 90%
  margin-top: 6px
  input
    margin-right: 5px
.type-selector
  .radio
    padding: 5px 7px 0 0
  .radio input
    margin: 0 5px 0 0

.formula
  max-width: 360px
  height: 120px
  margin: 40px auto 80px
</style>
