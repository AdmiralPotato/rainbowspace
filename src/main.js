import Vue from 'vue'
import vuetify from 'vuetify'
import App from './App.vue'
import store from './store'
import 'vuetify/dist/vuetify.min.css'
import 'material-design-icons-iconfont/dist/material-design-icons.css'

Vue.config.productionTip = false

Vue.use(vuetify)

new Vue({
  store,
  render: h => h(App)
}).$mount('#app')
