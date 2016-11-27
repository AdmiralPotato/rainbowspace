let settings = {
	autoRotateY: true,
	autoRotateX: true,
	image: 'img/logo-hue-stepped-0001.png',
	imageList: [
		{text: 'RainbowSpace rendered logo', value: 'img/logo-hue-stepped-0001.png'},
		{text: 'RainbowSpace pained logo', value: 'img/rainbowspace_logo-512.png'},
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
		{text: 'Some Cool Color Chart', value: 'http://i.imgur.com/Mv7BbPWl.jpg'},
		{text: 'Another Cool Color Chart', value: 'https://c1.staticflickr.com/5/4149/5077374515_c740c2f199_b.jpg'},
		{text: 'Yet Another Cool Color Chart', value: 'https://c1.staticflickr.com/7/6080/6109196872_61ea600625_z.jpg'},
		{text: 'aCool Color Chart', value: 'https://c2.staticflickr.com/6/5059/5500526444_baf6909eef_z.jpg'},
		{text: 'bCool Color Chart', value: 'https://c2.staticflickr.com/2/1563/26702317155_e3c3a9dd71_z.jpg'},
		{text: 'cCool Color Chart', value: 'https://c2.staticflickr.com/4/3065/2924345262_24dc9d632a_z.jpg?zz=1'},
		{text: 'DemonPuppy', value: 'https://crossorigin.me/https://github.com/AdmiralPotato/npos3d/raw/master/tests/pn3_files/demonpuppy.png'},
		{text: 'InterSphere', value: 'https://crossorigin.me/http://nuclearpixel.com/js/npos3d/tests/img/intersphere.png'},
		{text: 'hsl?', value: 'https://crossorigin.me/http://codropspz.tympanus.netdna-cdn.com/codrops/wp-content/uploads/2015/01/hsl-color-wheel.png'},
	],
	displayMethod: 'hslSphere',
	displayMethodList: ['hslCylinder', 'hslCones', 'hslSphere', 'hslCube', 'xyz'],
	cameraMode: 'perspective',
	cameraModeList: ['perspective', 'orthographic'],
	cameraPosition: 'free',
	cameraPositionList: ['Top', 'Front', 'Right', 'WCorner', 'Bottom', 'Back', 'Left', 'BCorner'],
	cameraPositionKeymap: {
		'Numpad7-0': 'Top',
		'Numpad1-0': 'Front',
		'Numpad3-0': 'Right',
		'Numpad5-0': 'WCorner',
		'Numpad7-1': 'Bottom',
		'Numpad1-1': 'Back',
		'Numpad3-1': 'Left',
		'Numpad5-1': 'BCorner'
	},
	backgroundColor: '20',
	backgroundColorList: ['0', '20', '40', '60', '80', '100'],
};
let dataCanvas = document.createElement('canvas');
dataCanvas.className = 'dataCanvas';
let app = new Vue({
	el: '#appTarget',
	data: {
		showSidebar: true,
		settings: settings,
		dataCanvas: dataCanvas
	},
	mounted: function(){
		document.addEventListener('keydown', this.keyHandler);
	},
	beforeDestroy:  function(){
		document.removeEventListener('keydown', this.keyHandler);
	},
	methods: {
		keyHandler: function(keyboardEvent){
			let key = '' + keyboardEvent.code + '-' + (0 + keyboardEvent.ctrlKey);
			let cameraPosition = settings.cameraPositionKeymap[key];
			if(cameraPosition){
				if(keyboardEvent.ctrlKey){
					keyboardEvent.preventDefault();
				}
				settings.cameraPosition = cameraPosition.toLocaleLowerCase();
			}
		},
		settingsToggle: function(){
			this.showSidebar = !this.showSidebar;
			window.scrollTo(0,0);
			setTimeout(resizeWindowEventHandler,0);
		}
	},
	template: `
		<div class="h-100 container-fluid">
			<div class="h-100 row">
				<div class="settingsToggle"><a class="icon fa fa-bars" @click="settingsToggle"></a></div>
				<div class="h-100 col-xs-12 main"
					:class="{'col-sm-8 col-xl-9': showSidebar}"
					:style="{'backgroundColor': 'hsl(0, 0%, ' + settings.backgroundColor + '%)'}"
					>
					<viewport />
				</div>
				<div class="h-100 col-xs-12 noPad sidebar" :class="{'col-sm-4 col-xl-3': showSidebar}" v-if="showSidebar">
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

if((/Mac OS X 10/).test(navigator.userAgent)){
	document.body.parentNode.className += ' disableElasticScrolling';
}
