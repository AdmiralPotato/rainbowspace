import Vue from 'vue'
import App from './app'

window.app = new Vue({
	el: '#app',
	components: {
		App
	},
	render (createElement) { return createElement(App) }
})
