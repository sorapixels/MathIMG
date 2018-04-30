<template lang="pug">
.container
  global-header
  generator
  global-footer
</template>

<script>
import GlobalHeader from './global-header.vue';
import GlobalFooter from './global-footer.vue';
import Generator from './generator.vue';

export default {
  components: { GlobalHeader, GlobalFooter, Generator },
};
</script>

<style lang="sass">
html, body
  background: white
  font-family: 'Open Sans', sans-serif

body > .container
  display: flex
  min-height: 100vh
  flex-direction: column
</style>
