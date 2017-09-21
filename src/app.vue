<template>
	<div class="h-100 container-fluid">
		<div class="h-100 row">
			<div class="settingsToggle"><a class="icon fa fa-bars" @click="settingsToggle"></a></div>
			<div class="h-100 col-12 main"
				 :class="{'col-sm-8 col-xl-9': showSidebar}"
				 :style="{'backgroundColor': 'hsl(0, 0%, ' + settings.backgroundColor + '%)'}"
			>
				<viewport :dataCanvas="dataCanvas"></viewport>
			</div>
			<div
				class="h-100 col-12 sidebar"
				:class="{'col-sm-4 col-xl-3': showSidebar}"
				v-if="showSidebar"
			>
				<div class="h-100">
					<settings :settings="settings" :dataCanvas="dataCanvas"></settings>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
	import Vue from 'vue'
	import state from './state'
	import Viewport from './viewport.vue'
	import Settings from './settings'
	import { resizeWindowEventHandler } from './viewport.js'


	let dataCanvas = document.createElement('canvas');
	dataCanvas.className = 'dataCanvas';
	export default {
		components: {
			Viewport,
			Settings
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
				Vue.nextTick(resizeWindowEventHandler);
			}
		}
	}
</script>
<style src="font-awesome/css/font-awesome.css"></style>
<style src="bootstrap/dist/css/bootstrap.css"></style>
<style src="./styles.css"></style>
