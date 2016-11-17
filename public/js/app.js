let settings = {
	image: 'img/rainbowspace_logo-512.png',
	imageList: [
		'img/rainbowspace_logo-512.png',
		'img/triangle-cmy-512.png',
		'img/triangle-ryb-512.png',
	],
	displayMethod: 'hsl',
	displayMethodList: ['hsl', 'xyz'],
	cameraMode: 'perspective',
	cameraModeList: ['perspective', 'orthographic']
};
let dataCanvas = document.createElement('canvas');
dataCanvas.className = 'dataCanvas';
let app = new Vue({
	el: '#app',
	data: {
		showSidebar: true,
		settings: settings,
		dataCanvas: dataCanvas
	},
	methods: {
		settingsToggle: function(){
			this.showSidebar = !this.showSidebar;
			setTimeout(resizeWindowEventHandler,0);
		}
	},
	template: `
		<div class="h-100 container-fluid">
			<div class="h-100 row">
				<div class="settingsToggle"><a class="icon fa fa-bars" @click="settingsToggle"></a></div>
				<div class="h-100 col-xs-12 main" :class="{'col-md-8': showSidebar}">
					<viewport />
				</div>
				<div class="h-100 col-xs-12 noPad sidebar" :class="{'col-md-4': showSidebar}" v-if="showSidebar">
					<div class="h-100">
						<settings :settings="settings" :dataCanvas="dataCanvas"></settings>
					</div>
				</div>
			</div>
		</div>
	`
});

let monoDirectional = function(dataAddress, newValue){
	Vue.set(app.settings, dataAddress, newValue);
};
