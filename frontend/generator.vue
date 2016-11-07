<template lang="pug">
section.section.generator: .columns: .column.is-10.is-offset-1
  .notification
    p.control(:class='{"is-loading": isLoading}')
      input.input.is-large(type='text', placeholder='E=mc^2', v-model='tex', :class='{"is-danger": isInvalid}', spellcheck='false')
    .buttons.has-text-centered
      span.example.button.is-small Examples:
      each btn in ['Algebra','Calculus','Stats','Sets','Trig','Geometry','Chemistry','Physics']
        a.button.is-small(@click=`setSampleText('${btn}')`)= btn

  .image-wrapper.has-text-centered(v-if='tex.length > 0', v-show='!isInvalid')
    img.formula(:src='originalURL("svg")', @error='onError', @load='onLoad')

  .columns: .column.is-10.is-offset-1(v-if='tex.length > 0', v-show='!isInvalid')
    label.label SVG file URL
    .control.is-grouped
      p.control.is-expanded.image-url
        input.input(type='text', v-model='imageURL', @click='select', readonly)
      p.control
        a.button.is-info(@click='shortenURL', :class='{"is-loading": shortening}') Shorten URL
      p.control
        a.button.is-info(:href='originalURL("png")') Download PNG
</template>

<script>
import base64url from 'base64-url';
import sampleFormulas from './sampleFomulas';

export default {
  data: () => ({
    tex: '',
    imageURL: '',
    shortening: false,
    isInvalid: false,
    isLoading: false,
  }),
  methods: {
    originalURL(type) {
      return `${window.location.href}${base64url.encode(this.tex)}.${type}`;
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
      this.imageURL = this.originalURL('svg');
    },
    select(e) {
      e.srcElement.select();
    },
    shortenURL() {
      this.shortening = true;
      gapi.client.setApiKey('AIzaSyDGK22NGcQJXUcYZxmKjKF9v6pFAaIWSDA');
      gapi.client.load('urlshortener', 'v1',() => {
    		gapi.client.urlshortener.url.insert({resource: {longUrl: this.originalURL('svg')}}).execute(resp => {
          this.imageURL = resp.id;
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
  margin: 2px 4px 0 0
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
  height: 120px
  margin: 40px auto 80px
</style>
