<template>
  <div class="settings">
    <v-toolbar
      absolute
    >
      <v-btn
        @click.stop.prevent="showSettings = !showSettings"
        flat
        icon
      >
        <v-icon dark>close</v-icon>
      </v-btn>
      <v-toolbar-title>Settings</v-toolbar-title>
    </v-toolbar>
    <v-toolbar class="header-for-spacing" />
    <div class="scroll pa-3">
      <v-form>
        <v-layout row>
          <v-flex>
            <v-select
              label="Image"
              :items="imageList"
              v-model="images"
              multiple
              hint="Select images to view and compare"
              persistent-hint
            ></v-select>
          </v-flex>
        </v-layout>
        <v-layout row>
          <v-flex>
            <v-select
              label="Display Method"
              :items="displayMethodList"
              v-model="displayMethod"
            ></v-select>
          </v-flex>
        </v-layout>
        <v-layout row>
          <v-flex>
            <v-select
              label="Camera Mode"
              :items="cameraModeList"
              v-model="cameraMode"
            ></v-select>
          </v-flex>
        </v-layout>
        <v-layout row>
          <v-flex>
            <v-checkbox
              v-model="autoRotateY"
              label="Animate Y"
            />
          </v-flex>
          <v-flex>
            <v-checkbox
              v-model="autoRotateX"
              label="Animate X"
            />
          </v-flex>
        </v-layout>
        <v-layout row>
          <v-flex>
            <v-checkbox
              v-model="showBounds"
              label="Show Bounds"
            />
          </v-flex>
        </v-layout>
        <v-layout row>
          <v-flex>
            <v-select
              label="Background Color"
              :items="backgroundColorList"
              v-model="backgroundColor"
            ></v-select>
          </v-flex>
        </v-layout>
        <v-divider />
      </v-form>
      <v-layout>
        <v-flex>
          <h3>RainbowSpace:<br/>Color Gamut Visualizer</h3>
          <p>A project by <a href="http://nuclearpixel.com/about/">Admiral Potato</a>.<br/><a
            href="https://github.com/AdmiralPotato/rainbowspace">Check out the project on GitHub</a> if you have
            questions, comments, feedback or issues.</p>
        </v-flex>
      </v-layout>
    </div>
  </div>
</template>

<style scoped lang="scss">
.settings {
  position: relative;
  height: 100%;
  display: flex;
  flex-direction: column;
  .header-for-spacing {
    flex: 0;
    visibility: hidden;
  }
  .scroll {
    flex: 1;
    overflow-y: auto;
    overflow-x: hidden;
  }
}
</style>

<script>
import { mapState } from 'vuex'
import mapModels from '@/mapModels'

let supportedTypeMap = {
  'image/png': 'handleAsFile',
  'image/jpeg': 'handleAsFile',
  'image/gif': 'handleAsFile',
  'image/bmp': 'handleAsFile',
  'image/svg+xml': 'handleAsFile',
  'text/html': 'searchForImage'
}

export default {
  name: 'Settings',
  computed: {
    ...mapState([
      'imageList',
      'displayMethodList',
      'cameraModeList',
      'backgroundColorList',
      'backgroundColorList'
    ]),
    ...mapModels([
      'showSettings',
      'autoRotateY',
      'autoRotateX',
      'scaleImages',
      'showBounds',
      'images',
      'imageList',
      'displayMethod',
      'cameraMode',
      'cameraPosition',
      'backgroundColor'
    ])
  },
  mounted () {
    const dragEventTarget = document.body
    dragEventTarget.addEventListener('dragover', this.handleDrag)
    dragEventTarget.addEventListener('dragenter', this.handleDrag)
    dragEventTarget.addEventListener('drop', this.handleDrag)
  },
  destroyed () {
    const dragEventTarget = document.body
    dragEventTarget.removeEventListener('dragover', this.handleDrag)
    dragEventTarget.removeEventListener('dragenter', this.handleDrag)
    dragEventTarget.removeEventListener('drop', this.handleDrag)
  },
  methods: {
    handleDrag (event) {
      event.preventDefault()
      console.log(event.type)
      if (event.type === 'drop') {
        let itemList = Array.prototype.slice.call(event.dataTransfer.items)
        let anySuitableHandler = false
        let handleType = function (item) {
          if (supportedTypeMap.hasOwnProperty(item.type)) {
            let handler = supportedTypeMap[item.type]
            handler(item)
            anySuitableHandler = true
          }
        }
        itemList.forEach(handleType)
        if (!anySuitableHandler) {
          alert('Sorry, was not able to load that image - still working out all the bugs. Try an image from another source?')
        }
      }
    },
    handleAsFile: function (data) {
      this.readFile(data.getAsFile())
    },
    searchForImage: function (data) {
      data.getAsString(function (raw) {
        let value = ' ' + raw.replace(/\n/g, ' ') + ' '
        let imageTagRegexExec = /.*(\<img.*?\>)/i.exec(value)
        let img = imageTagRegexExec && imageTagRegexExec[1] ? imageTagRegexExec[1] : null
        let srcExec = img ? /src="(.*?)"/i.exec(img) : null
        let altExec = img ? /alt="(.*?)"/i.exec(img) : null
        let src = srcExec ? srcExec[1] : null
        let alt = altExec ? altExec[1] : null
        if (src) {
          state.imageList.push({
            text: (alt || src.split('/').pop()),
            value: src
          })
          state.image = src
        }
      })
    },
    clearAllImages: function () {
      this.images = []
      this.imageList = []
    },
    uploadImage: function (changeEvent) {
      let fileList = Array.prototype.slice.call(changeEvent.target.files)
      state.scaleImages = this.isMobile()
      fileList.forEach(function (file) {
        window.viewport.vue.readFile(file)
      })
    },
    readFile: function (file) {
      let name = file.name
      let nameUnique = ['draggedUp', file.name, file.type, file.size, file.lastModified].join(':')
      let imageAlreadyLoaded = Vertifier.loadedImageMap[nameUnique]
      if (imageAlreadyLoaded) {
        console.log('file.alreadyLoaded', name)
        state.image = nameUnique
      } else {
        let reader = new FileReader()
        reader.onloadend = function (upload) {
          console.log('file.loaded', name)
          let image = new Image()
          image.onload = function () {
            console.log('img.loaded', name)
            Vertifier.loadedImageMap[nameUnique] = image
            state.imageList.push({
              text: name,
              value: nameUnique
            })
            state.image = nameUnique
          }
          image.src = upload.target.result
        }
        reader.readAsDataURL(file)
      }
    },
    keyHandler (keyboardEvent) {
      let key = '' + keyboardEvent.code + '-' + (0 + keyboardEvent.ctrlKey)
      let cameraPosition = state.cameraPositionKeymap[key]
      if (cameraPosition) {
        if (keyboardEvent.ctrlKey) {
          keyboardEvent.preventDefault()
        }
        state.cameraPosition = cameraPosition.toLocaleLowerCase()
      }
      if (key === 'Numpad5-0') {
        let mode = state.cameraMode
        let list = state.cameraModeList
        state.cameraMode = mode === list[0] ? list[1] : list[0]
      }
    }
  }
}
</script>
