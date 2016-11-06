<template lang="pug">
section.section.generator: .columns: .column.is-10.is-offset-1
  .notification
    p.control(:class='{"is-loading": isLoading}')
      input.input.is-large(type='text', placeholder='E=mc^2', v-model='tex', :class='{"is-danger": isInvalid}', spellcheck='false')
    .columns
      .column.is-three-quarters.buttons
        span.example.button.is-small Examples:
        each btn in ['Algebra','Calculus','Stats','Sets','Trig','Geometry','Chemistry','Physics']
          a.button.is-small(@click=`setSampleText('${btn}')`)= btn
      .column.type-selector.has-text-right
        label.radio
          input(type='radio', name='type', value='svg', v-model='type', @change='isLoading = true')
          | SVG
        label.radio
          input(type='radio', name='type', value='png', v-model='type', @change='isLoading = true')
          | PNG

  .image-wrapper.has-text-centered(v-if='tex.length > 0', v-show='!isInvalid')
    img.formula(:src='originalUrl', @error='onError', @load='onLoad')
    .columns: .column.is-8.is-offset-2
      label.label SVG file URL
      p.control.has-addons.image-url
        input.input.is-expanded(type='text', v-model='imageUrl', @click='select', readonly)
        a.button.is-info(@click='shorten', :class='{"is-loading": shortening}') Shorten
</template>

<script>
import base64url from 'base64-url';
import sampleFormulas from './sampleFomulas';

export default {
  data: () => ({
    tex: '',
    type: 'svg',
    imageUrl: '',
    shortening: false,
    isInvalid: false,
    isLoading: false,
  }),
  computed: {
    originalUrl() {
      return `${window.location.href}${base64url.encode(this.tex)}.${this.type}`;
    },
  },
  methods: {
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
      this.imageUrl = this.originalUrl;
    },
    select(e) {
      e.srcElement.select();
    },
    shorten() {
      this.shortening = true;
      gapi.client.setApiKey('AIzaSyDGK22NGcQJXUcYZxmKjKF9v6pFAaIWSDA');
      gapi.client.load('urlshortener', 'v1',() => {
    		gapi.client.urlshortener.url.insert({resource: {longUrl: this.originalUrl}}).execute(resp => {
          this.imageUrl = resp.id;
          this.shortening = false;
    		});
    	});
    }
  }
}
</script>

<style lang="sass">
.section.generator
  flex: 1

.buttons .button
  margin: 2px 2px 0 0
  &.example
    border: none
    background: transparent

.type-selector
  .radio
    padding: 5px 7px 0 0
  .radio input
    margin: 0 5px 0 0

.formula
  max-width: 360px
  margin: 40px auto 80px
</style>
