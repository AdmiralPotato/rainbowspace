<template>
  <v-app
    dark
    :style="{'backgroundColor': 'hsl(0, 0%, ' + backgroundColor + '%)'}"
  >
    <v-navigation-drawer
      :value="showSettings"
      absolute
      :permanent="showSettings"
      app
    >
      <Settings />
    </v-navigation-drawer>

    <v-toolbar
      app
      absolute
    >
      <v-toolbar-side-icon
        @click.stop.prevent="showSettings = !showSettings"
      ></v-toolbar-side-icon>
      <v-toolbar-title>RainbowSpace: Spatial Color Gamut Visualizer</v-toolbar-title>
    </v-toolbar>
    <v-content>
      <MultiViewport />
    </v-content>
  </v-app>
</template>

<style lang="scss">
html {
  overflow: hidden !important;
}

.disableElasticScrolling body{
  overflow: hidden;
}

::-webkit-scrollbar {
  width: 12px;
}

::-webkit-scrollbar-track {
  -webkit-box-shadow: inset 0 0 4px rgba(0,0,0,0.3);
  border-radius: 8px;
}

::-webkit-scrollbar-thumb {
  border-radius: 10px;
  background-color: rgba(0,0,0,0.3);
}
</style>

<script>
import { mapState } from 'vuex'
import mapModels from '@/mapModels'
import Settings from '@/components/Settings'
import MultiViewport from '@/views/MultiViewport'

export default {
  components: {
    MultiViewport,
    Settings
  },
  computed: {
    ...mapState([
      'backgroundColor'
    ]),
    ...mapModels([
      'showSettings'
    ])
  },
  mounted () {
    document.addEventListener('keydown', this.keyHandler)
    if ((/Mac OS X 10/).test(navigator.userAgent)) {
      document.body.parentNode.className += ' disableElasticScrolling'
    }
  },
  beforeDestroy: function () {
    document.removeEventListener('keydown', this.keyHandler)
  }
}
</script>
