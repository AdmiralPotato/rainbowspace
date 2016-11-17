let settings = {
	image: 'img/rainbowspace_logo-512.png',
	imageList: [
		{text: 'RainbowSpace logo', value: 'img/rainbowspace_logo-512.png'},
		{text: 'Triangle - Cyan, Magenta, Yellow', value: 'img/triangle-cmy-512.png'},
		{text: 'Triangle - Red, Yellow, Blue', value: 'img/triangle-ryb-512.png'},
		{text: 'Ghost & Candy Corn', value: 'http://i.imgur.com/sdEo3fXl.jpg'},
		{text: 'Crusader Arts "Red Room" Tribute', value: 'http://i.imgur.com/IllmOBYl.jpg'},
		{text: 'Hexagonal Hard Candy Revisited - Cyan', value: 'http://i.imgur.com/ioYgktml.jpg'},
		{text: 'Hexagonal Hard Candy Revisited - Purple', value: 'http://i.imgur.com/bvlb8Jhl.jpg'},
		{text: 'Chocolate Hearts', value: 'http://i.imgur.com/PI9rY1Nl.jpg'},
		{text: 'Hella Hearts - 4 of 4', value: 'http://i.imgur.com/03Iaigtl.jpg'},
		{text: 'Aperture Eyes', value: 'http://i.imgur.com/un151Ttl.jpg'},
		{text: 'Warm Wooden Toy', value: 'http://i.imgur.com/4mUs55cl.jpg'},
		{text: 'Recursive Trefoil Knot', value: 'http://i.imgur.com/3kasZkCl.jpg'},
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
