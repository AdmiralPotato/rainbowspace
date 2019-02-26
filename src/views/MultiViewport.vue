<template>
  <div class="multi-viewport">
    <viewport
      class="viewport-image"
      v-for="(image, index) in images"
      :key="index"
      :imageIndex="index"
    />
    <div v-html="divisionStyles"></div>
  </div>
</template>

<style lang="scss" scoped>
.multi-viewport {
  position: relative;
  height: 100%;
  overflow: hidden;
  .viewport-image {
    float: left;
    background: linear-gradient(135deg, rgba(36,36,36,1) 0%, rgba(163,163,163,1) 100%);
  }
}
</style>

<script>
import Viewport from '@/components/Viewport'

const divisions = [
  [1, 1], // 1
  [2, 1], // 2
  [2, 2], // 3
  [2, 2], // 4
  [3, 2], // 5
  [3, 2], // 6
  [3, 3], // 7
  [3, 3], // 8
  [3, 3], // 9
  [4, 3], // 10
  [4, 3], // 11
  [4, 3], // 12
  [4, 4], // 13
  [4, 4], // 14
  [4, 4], // 15
  [4, 4], // 16
  null
]
export default {
  name: 'multi-viewport',
  components: { Viewport },
  computed: {
    images () {
      return this.$store.state.images.slice(0, 16)
    },
    divisionStyles () {
      const division = divisions[Math.max(0, this.images.length - 1)]
      return `
        <style>
          .multi-viewport .viewport-image {
            width: ${(1 / division[0]) * 100}%;
            height: ${(1 / division[1]) * 100}%;
          }
        </style>
      `
    }
  }
}
</script>
