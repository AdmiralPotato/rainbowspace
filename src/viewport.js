import state from './state';
import Vertifier from './vertifier';
import * as THREE from 'three';

let viewportList = [];
let viewport;
let Viewport = function(renderCanvas, vueComponentInstance, dataCanvas){
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
	p.cameraPosition = state.cameraPosition;
	p.renderer = new THREE.WebGLRenderer({
		canvas: renderCanvas,
		antialias: true,
		alpha: true
	});
	p.canvas = renderCanvas;
	p.vue = vueComponentInstance;

	p.ambientLight = new THREE.AmbientLight(0xffffff);
	p.scene.add(p.ambientLight);

	let radialSegments = 24;
	let openEnds = false;
	p.boundingGeometry = {
		Cone: new THREE.ConeGeometry(0.5, -1, radialSegments, 0, openEnds),
		Cones: new THREE.SphereGeometry(0.5, radialSegments, 2),
		Cube: new THREE.BoxGeometry(1, 1, 1),
		Cylinder: new THREE.CylinderGeometry(0.5, 0.5, 1, radialSegments, 1, openEnds),
		Sphere: new THREE.SphereGeometry(0.5, radialSegments, radialSegments / 2)
	};
	p.boundsMaterial = new THREE.MeshBasicMaterial();
	p.boundsMaterial.wireframe = true;
	p.boundsMaterial.opacity = 0.2;
	p.boundsMaterial.color.setHSL(0,0,0.5);
	p.boundsMaterial.transparent = true;
	p.bounds = new THREE.Mesh(undefined, p.boundsMaterial);
	p.bounds.scale.setScalar(1.05);
	p.origin = new THREE.Object3D();
	p.origin.scale.setScalar(10);
	p.origin.rotation.x = Math.PI / 6;
	p.origin.add(p.bounds);
	p.scene.add(p.origin);

	p.vertifier = new Vertifier({
		imageUrl: state.image,
		callback: function(){
			//not quite sure why this doesn't work unless I add it after the image load
			p.origin.remove(p.vertifier.particleSystem);
			p.origin.add(p.vertifier.particleSystem);
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
		if(state.autoRotateY) {p.origin.rotation.y += 0.005;}
		if(state.autoRotateX) {p.origin.rotation.x += 0.005;}
		if(state.cameraPosition !== 'free' && state.cameraPosition !== p.cameraPosition){
			state.autoRotateY = false;
			state.autoRotateX = false;
			p.cameraPosition = state.cameraPosition;
			p.origin.rotation.fromArray(p.cameraPositionMap[p.cameraPosition]);
		}
		if(p.dragging){
			p.origin.rotation.x += p.dragDiff.y * -0.01;
			p.origin.rotation.y += p.dragDiff.x * -0.01;
			p.dragDiff.set(0, 0);
		}

		p.camera = p.cameraMap[state.cameraMode];
		if(p.vertifier.imageUrl !== state.image){
			p.vertifier.loadImage(state.image);
		}
		if(p.vertifier.mapMethodName !== state.displayMethod){
			let geomName = state.displayMethod.slice(3);
			let boundingGeom = p.boundingGeometry[geomName];
			if(boundingGeom){
				p.bounds.geometry = boundingGeom;
			}
			p.vertifier.mapColorsToVerts(state.displayMethod);
		}
		p.bounds.visible = state.showBounds;
		p.renderer.render(p.scene, p.camera);
	},
	dragStart: function(x, y){
		let p = this;
		p.dragging = true;
		p.dragPosLast.set(x, y);
		p.cameraPosition = state.cameraPosition = 'free';
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

export let resizeWindowEventHandler = function () {
	viewportList.forEach(function (item) {
		item.sizeWindow();
	});
};
let renderAllViews = function (time) {
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

export default Viewport;
