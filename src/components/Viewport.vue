<template>
  <div class="viewport">
    <canvas
      ref="canvas"
    ></canvas>
    <div class="image-index pa-4">{{imageIndex}}</div>
  </div>
</template>

<style lang="scss" scoped>
.viewport {
  position: relative;
  height: 100%;
  canvas {
    position: absolute;
    display: block;
    width: 100%;
    height: 100%;
  }
  .image-index {
    position: absolute;
    top: 0;
    left: 0;
    font-size: 16px;
    line-height: 16px;
  }
}
</style>

<script>
import TWEEN from '@tweenjs/tween.js'
import ThreePort from '../viewport/ThreePort.js'

export default {
  props: {
    imageIndex: {
      type: Number,
      required: true
    }
  },
  mounted () {
    this.threeport = new ThreePort({
      canvas: this.$refs.canvas,
      updateFunc (time) {
        TWEEN.update(time)
      }
    })
  },
  methods: {
  }
}
</script>
