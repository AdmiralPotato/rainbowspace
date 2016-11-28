Vue.component(
	'viewport',
	{
		data: function(){
			return {
				width: 0,
				height: 0,
				clickable: false
			};
		},
		mounted: function(){
			this.viewport = new Viewport(this.$el, this);
			let handleAsFile = function(data){
				this.readFile(data.getAsFile());
			};
			let searchForImage = function(data){
				data.getAsString(function(value){
					let imageTagRegexExec = /(<img.*?>)/i.exec(value);
					let img = imageTagRegexExec && imageTagRegexExec[1] ? imageTagRegexExec[1] : null;
					let srcExec = img ? /src="(.*?)"/i.exec(img) : null;
					let altExec = img ? /alt="(.*?)"/i.exec(img) : null;
					let src = srcExec ? srcExec[1] : null;
					let alt = altExec ? altExec[1] : null;
					if(src){
						settings.imageList.push({
							text: (alt || src.split('/').pop()),
							value: src
						});
						settings.image = src;
					}
				});
			};
			let supportedTypeMap = {
				"image/png": handleAsFile,
				"image/jpeg": handleAsFile,
				"image/gif": handleAsFile,
				"image/bmp": handleAsFile,
				"image/svg+xml": handleAsFile,
				"text/html": searchForImage,
			};
			this.handleDrag = function(event){
				event.preventDefault();
				console.log(event.type);
				if(event.type === 'drop'){
					let itemList = Array.prototype.slice.call(event.dataTransfer.items);
					let handleType = function(item){
						if(supportedTypeMap.hasOwnProperty(item.type)){
							let handler = supportedTypeMap[item.type];
							handler(item);
						}
					};
					itemList.forEach(handleType);
				}
			};
			this.$el.addEventListener('wheel', this.handleWheel);
			this.$el.addEventListener('dragover', this.handleDrag);
			this.$el.addEventListener('dragenter', this.handleDrag);
			this.$el.addEventListener('drop', this.handleDrag);
		},
		beforeMount: function () {
			document.addEventListener('resize', resizeWindowEventHandler);
			window.addEventListener('resize', resizeWindowEventHandler);
		},
		beforeDestroy: function () {
			document.removeEventListener('resize', resizeWindowEventHandler);
			window.removeEventListener('resize', resizeWindowEventHandler);
			this.$el.removeEventListener('wheel', this.handleWheel);
			this.$el.removeEventListener('dragover', this.handleDrag);
			this.$el.removeEventListener('dragenter', this.handleDrag);
			this.$el.removeEventListener('drop', this.handleDrag);
		},
		methods: {
			handleWheel: function(event){
				this.viewport.scroll(event.deltaX * 0.001 + event.deltaY * 0.01);
			},
			readFile: function(file){
				let name = file.name;
				let nameUnique = ['draggedUp', file.name, file.type, file.size, file.lastModified].join(':');
				let imageAlreadyLoaded = loadedImageMap[nameUnique];
				if(imageAlreadyLoaded){
					console.log('file.alreadyLoaded', name);
					settings.image = nameUnique;
				} else {
					let reader = new FileReader();
					reader.onloadend = function(upload) {
						console.log('file.loaded', name);
						let image = new Image();
						image.onload = function(){
							console.log('img.loaded', name);
							loadedImageMap[nameUnique] = image;
							settings.imageList.push({
								text: name,
								value: nameUnique
							});
							settings.image = nameUnique;
						};
						image.src = upload.target.result;
					};
					reader.readAsDataURL(file);
				}
			},
			start: function (event) {
				let x = event.clientX;
				let y = event.clientY;
				event.preventDefault();
				if(!this.viewport.dragging){
					if(event.targetTouches){
						x = event.targetTouches[0].clientX;
						y = event.targetTouches[0].clientY;
					}
					this.viewport.dragStart(x, y);
				}
				settings.autoRotateY = false;
				settings.autoRotateX = false;
			},
			stop: function (event) {
				event.preventDefault();
				this.viewport.dragStop();
			},
			move: function (event) {
				if(this.viewport.dragging) {
					let x = event.clientX;
					let y = event.clientY;
					event.preventDefault();
					if (event.targetTouches) {
						x = event.targetTouches[0].clientX;
						y = event.targetTouches[0].clientY;
					}
					this.viewport.dragMove(x, y);
				}
			},
		},
		template: `
			<canvas
				class="viewport"
				:width="width"
				:height="height"
				:class="{clickable: clickable}"
				v-on:mousedown="start"
				v-on:mousemove="move"
				v-on:mouseup="stop"
				v-on:mouseout="stop"
				v-on:touchstart="start"
				v-on:touchmove="move"
				v-on:touchend="stop"
				/>
		`
	}
);

let viewportList = [];
let viewport;
let Viewport = function(canvas, vueComponentInstance){
	let p = this;
	p.width = 0;
	p.height = 0;
	p.dragging = false;
	p.dragPosLast = new THREE.Vector2();
	p.dragDiff = new THREE.Vector2();
	p.scene = new THREE.Scene();
	p.cameraMap = {
		perspective: new THREE.PerspectiveCamera(45, 1, 0.1, 1000),
		orthographic: new THREE.OrthographicCamera(0, 0, 0, 0, 0, 1000),
	};
	p.cameraMap.perspective.position.z = p.cameraMap.orthographic.position.z = 25;
	p.orthographicMultiplier = 7;
	p.camera = null;
	p.cameraPosition = settings.cameraPosition;
	p.renderer = new THREE.WebGLRenderer({
		canvas: canvas,
		antialias: true,
		alpha: true
	});
	p.canvas = canvas;
	p.vue = vueComponentInstance;

	p.ambientLight = new THREE.AmbientLight(0xffffff);
	p.scene.add(p.ambientLight);

	p.cubeGeom = new THREE.BoxGeometry(1, 1, 1);
	p.cubeMaterial = new THREE.MeshNormalMaterial();
	p.cubeMaterial.transparent = true;
	p.cubeMaterial.opacity = 0;
	p.cube = new THREE.Mesh(p.cubeGeom, p.cubeMaterial);
	p.cube.scale.setScalar(10);
	p.cube.material.wireframe = true;
	p.scene.add(p.cube);

	p.vertifier = new Vertifier({
		imageUrl: settings.image,
		callback: function(){
			//not quite sure why this doesn't work unless I add it after the image load
			p.cube.remove(p.vertifier.particleSystem);
			p.cube.add(p.vertifier.particleSystem);
		},
		dataCanvas: dataCanvas
	});

	p.grid = new THREE.GridHelper( 200, 20 );
	p.grid.position.y = -50;
	p.grid.material.opacity = 0.5;
	p.grid.material.transparent = true;
	p.grid.material.wireframeLinewidth = 20;
	p.scene.add( p.grid );

	p.sizeWindow();
	viewportList.push(p);
	viewport = p;
};

Viewport.prototype = {
	cameraPositionMap: {
		top:     [       Math.PI / 2,                0, 0 ],
		front:   [                 0,                0, 0 ],
		right:   [                 0,     -Math.PI / 2, 0 ],
		wcorner: [  Math.PI / 5.1043,     -Math.PI / 4, 0 ],
		bottom:  [      -Math.PI / 2,                0, 0 ],
		back:    [                 0,         -Math.PI, 0 ],
		left:    [                 0,      Math.PI / 2, 0 ],
		bcorner: [ -Math.PI / 5.1043,  3 * Math.PI / 4, 0 ]
	},
	sizeWindow: function () {
		let p = this;
		let ratio = window.devicePixelRatio || 1;
		p.width = p.canvas.clientWidth * ratio;
		p.height = p.canvas.clientHeight * ratio;
		p.vue.width = p.width;
		p.vue.height = p.height;

		p.cameraMap.perspective.aspect = p.width / p.height;
		p.cameraMap.perspective.updateProjectionMatrix();
		p.updateOrthographicCameraScale();
		//p.renderer.setPixelRatio(ratio);
		p.renderer.setViewport(0, 0, p.width, p.height);
	},
	updateOrthographicCameraScale: function(){
		let p = this;
		let orthographicScale = p.orthographicMultiplier / Math.min(p.width, p.height);
		let oWidth = p.width * orthographicScale;
		let oHeight = p.height * orthographicScale;
		p.cameraMap.orthographic.right  =  oWidth;
		p.cameraMap.orthographic.left   = -oWidth;
		p.cameraMap.orthographic.top    =  oHeight;
		p.cameraMap.orthographic.bottom = -oHeight;
		p.cameraMap.orthographic.updateProjectionMatrix();
	},
	render: function (time) {
		let p = this;
		if(settings.autoRotateY) {p.cube.rotation.y += 0.005;}
		if(settings.autoRotateX) {p.cube.rotation.x += 0.005;}
		if(settings.cameraPosition !== 'free' && settings.cameraPosition !== p.cameraPosition){
			settings.autoRotateY = false;
			settings.autoRotateX = false;
			p.cameraPosition = settings.cameraPosition;
			p.cube.rotation.fromArray(p.cameraPositionMap[p.cameraPosition]);
		}
		if(p.dragging){
			p.cube.rotation.x += p.dragDiff.y * -0.01;
			p.cube.rotation.y += p.dragDiff.x * -0.01;
			p.dragDiff.set(0, 0);
		}

		p.camera = p.cameraMap[settings.cameraMode];
		if(p.vertifier.imageUrl !== settings.image){
			p.vertifier.loadImage(settings.image);
		}
		if(p.vertifier.mapMethodName !== settings.displayMethod){
			p.vertifier.mapColorsToVerts(settings.displayMethod);
		}
		p.renderer.render(p.scene, p.camera);
	},
	dragStart: function(x, y){
		let p = this;
		p.dragging = true;
		p.dragPosLast.set(x, y);
		p.cameraPosition = settings.cameraPosition = 'free';
	},
	dragMove: function(x, y){
		let p = this;
		let current = new THREE.Vector2(x, y);
		p.dragDiff = p.dragPosLast.clone().sub(current);
		p.dragPosLast.set(x, y);
	},
	dragStop: function(){
		let p = this;
		p.dragging = false;
		p.dragDiff.set(0, 0);
	},
	scroll: function(num){
		this.cameraMap.perspective.position.z = Math.max(
			this.cameraMap.perspective.position.z + num,
			-1.5
		);
		this.orthographicMultiplier = Math.max(
			this.orthographicMultiplier + num * 0.25,
			0.025
		);
		this.updateOrthographicCameraScale();
	}
};

let resizeWindowEventHandler = function () {
		viewportList.forEach(function (item) {
			item.sizeWindow();
		});
	},
	renderAllViews = function (time) {
		viewportList.forEach(function (item) {
			item.render(time);
		});
	};

let go = true,
	start = function(){
		go = true;
		requestAnimationFrame(render);
	},
	stop = function(){
		go = false;
	};

let render = function (time){
	if(go){
		requestAnimationFrame(render);
	}
	renderAllViews(time);
};

start();
