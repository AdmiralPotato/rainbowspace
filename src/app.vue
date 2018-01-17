<template>
	<div class="h-100 container-fluid">
		<div class="h-100 row">
			<div class="h-100 col-12 main"
				 :class="{'col-sm-8 col-xl-9': showSidebar}"
				 :style="{'backgroundColor': 'hsl(0, 0%, ' + settings.backgroundColor + '%)'}"
			>
				<viewport :dataCanvas="dataCanvas" />
			</div>
			<div
				:class="{'sidebar h-100 col-12 col-sm-4 col-xl-3': showSidebar}"
			>
				<div class="settingsToggle">
					<a @click="settingsToggle">
						<icon :name="showSidebar ? 'times' : 'sliders'" />
					</a>
				</div>
				<settings
					v-if="showSidebar"
					:settings="settings"
					:dataCanvas="dataCanvas"
				/>
			</div>
		</div>
	</div>
</template>
<script>
	import state from './state'
	import Viewport from './viewport.vue'
	import Settings from './settings'
	import Icon from 'vue-awesome/components/Icon'
	import 'vue-awesome/icons/times'
	import 'vue-awesome/icons/sliders'
	import { resizeWindowEventHandler } from './viewport.js'

	console.log('app:Icon', Icon)

	let dataCanvas = document.createElement('canvas');
	dataCanvas.className = 'dataCanvas';
	export default {
		components: {
			Viewport,
			Settings,
			Icon
		},
		data: function(){
			return {
				showSidebar: true,
				settings: state,
				dataCanvas: dataCanvas
			}
		},
		mounted: function(){
			document.addEventListener('keydown', this.keyHandler);
			if((/Mac OS X 10/).test(navigator.userAgent)){
				document.body.parentNode.className += ' disableElasticScrolling';
			}
		},
		beforeDestroy:  function(){
			document.removeEventListener('keydown', this.keyHandler);
		},
		methods: {
			keyHandler: function(keyboardEvent){
				let key = '' + keyboardEvent.code + '-' + (0 + keyboardEvent.ctrlKey);
				let cameraPosition = state.cameraPositionKeymap[key];
				if(cameraPosition){
					if(keyboardEvent.ctrlKey){
						keyboardEvent.preventDefault();
					}
					state.cameraPosition = cameraPosition.toLocaleLowerCase();
				}
				if(key === 'Numpad5-0'){
					let mode = state.cameraMode;
					let list = state.cameraModeList;
					state.cameraMode = mode === list[0] ? list[1] : list[0];
				}
			},
			settingsToggle: function(){
				this.showSidebar = !this.showSidebar;
				window.scrollTo(0,0);
				requestAnimationFrame(resizeWindowEventHandler);
			}
		}
	}
</script>
<style src="bootstrap/dist/css/bootstrap.css"></style>
<style src="./styles.css"></style>
