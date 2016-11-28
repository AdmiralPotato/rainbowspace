let loadedImageMap = {};
let loadedGeomMap = {};

let Vertifier = function (args) {
	let t = this;
	t.imageUrl = args.imageUrl || console.break('MISSING IMAGE URL');
	t.callback = args.callback || console.break('MISSING CALLBACK');
	t.dataCanvas = args.dataCanvas || document.createElement('canvas');
	t.mapMethodName = args.mapMethodName || 'rgbCube';

	t.loader = new THREE.TextureLoader();
	t.vertexGeom = new THREE.Geometry();
	t.vertexMaterial = new THREE.PointsMaterial({
		size: 5 * window.devicePixelRatio,
		sizeAttenuation: false,
		vertexColors: THREE.VertexColors
	});
	t.particleSystem = new THREE.Points(
		t.vertexGeom,
		t.vertexMaterial
	);
	t.loadImage();
};

Vertifier.prototype = {
	crossOriginProxy: 'http://crossorigin.me/',
	loadImage: function(imageUrl, tryWithCrossOrigin){
		let t = this;
		let imageKey = t.imageUrl = imageUrl || t.imageUrl; //TODO: brain better later. force lexical capturing now.
		let origin = tryWithCrossOrigin ? t.crossOriginProxy : '';
		let image = loadedImageMap[imageKey];
		let geometry = loadedGeomMap[imageKey];
		if(image && geometry){
			console.log('Vertifier.loadImage: using already loaded ' + imageKey);
			t.swapGeometry(geometry);
		} else if (image && !geometry) {
			geometry = loadedGeomMap[imageKey] = t.makeGeometryFromImage(image);
			t.swapGeometry(geometry);
		} else {
			t.loader.load(
				origin + imageKey,
				function (texture) {
					console.log('Vertifier.loadImage: finished loading ' + imageKey);
					image = loadedImageMap[imageKey] = texture.image;
					geometry = loadedGeomMap[imageKey] = t.makeGeometryFromImage(image);
					t.swapGeometry(geometry);
				},
				t.loadProgress,
				function(xhr){
					if(!tryWithCrossOrigin){
						t.loadImage(imageUrl, true);
					} else {
						t.loadFailure(xhr);
					}
				}
			);
		}
	},
	imageSourceToCanvas: function (source, canvas, x, y){
		let width = x || source.width;
		let height = y || source.height;
		let canvasContext = canvas.getContext('2d');
		canvasContext.imageSmoothingEnabled = true;
		if(settings.scaleImages){
			let shrank = this.calculateAspectRatioFit(width, height, 256, 256);
			width = shrank.width;
			height = shrank.height;
			settings.scaleImages = false;
		}
		canvas.width = 0;
		canvas.height = 0;
		canvas.width = width;
		canvas.height = height;
		canvasContext.drawImage(source, 0, 0, width, height);
		return canvasContext;
	},
	calculateAspectRatioFit: function(srcWidth, srcHeight, maxWidth, maxHeight) {
		let ratio = Math.min(maxWidth / srcWidth, maxHeight / srcHeight);
		return { width: srcWidth*ratio, height: srcHeight*ratio };
	},
	makeGeometryFromImage: function (image) {
		let t = this;
		let width = image.width;
		let height = image.height;
		let duplicateColorMap = {};
		let colors = [];
		let color;
		let rgbString;
		let offset;
		let r, g, b, a;
		let numPixels = width * height;
		let dataCanvas = document.createElement('canvas');
		let context = t.imageSourceToCanvas(image, dataCanvas, width, height);
		let data = context.getImageData(0, 0, width, height).data;
		let vertexGeom = new THREE.Geometry();
		for (let i = 0; i < numPixels; i++) {
			offset = i * 4;
			r = data[offset];
			g = data[offset + 1];
			b = data[offset + 2];
			a = data[offset + 3];
			rgbString = 'rgba(' + r + ',' + g + ',' + b + ')';
			if (!duplicateColorMap[rgbString] && a > 192) {
				color = new THREE.Color(rgbString);
				colors.push(color);
			}
			duplicateColorMap[rgbString] = true;
		}
		vertexGeom.colors = colors;
		vertexGeom.colorsNeedUpdate = true;
		vertexGeom.dataCanvas = dataCanvas;
		return vertexGeom;
	},
	swapGeometry(vertexGeom){
		let t = this;
		t.vertexGeom = vertexGeom;
		t.imageSourceToCanvas(t.vertexGeom.dataCanvas, t.dataCanvas);
		if(t.vertexGeom.lastMapping !== t.mapMethodName){
			t.mapColorsToVerts();
		}
		t.particleSystem.geometry = t.vertexGeom = vertexGeom;
		t.callback(t);
	},
	loadProgress: function (xhr) {
		console.log((xhr.loaded / xhr.total * 100) + '% loaded');
	},
	loadFailure: function (xhr) {
		console.log('An error happened', xhr);
	},
	mapColorsToVerts: function (mapMethodName) {
		let t = this;
		t.mapMethodName = mapMethodName || t.mapMethodName;
		t.vertexGeom.vertices = t.vertexGeom.colors.map(t.mapNormalizedRGBTo[t.mapMethodName]);
		t.vertexGeom.verticesNeedUpdate = true;
		t.vertexGeom.lastMapping = mapMethodName;
	},
	mapNormalizedRGBTo: {
		rgbCube: function (color) {
			return new THREE.Vector3(
				color.r - 0.5,
				color.g - 0.5,
				color.b - 0.5
			);
		},
		hslCylinder: function (color) {
			let hsl = color.getHSL();
			let angle = -hsl.h * Math.PI * 2;
			let radius = hsl.s * 0.5;
			let x = Math.cos(angle) * radius;
			let y = hsl.l - 0.5;
			let z = Math.sin(angle) * radius;
			return new THREE.Vector3(x, y, z);
		},
		hsvCylinder: function (color) {
			let hsv = hslToHsv(color.getHSL());
			let angle = -hsv.h * Math.PI * 2;
			let radius = hsv.s * 0.5;
			let x = Math.cos(angle) * radius;
			let y = hsv.v - 0.5;
			let z = Math.sin(angle) * radius;
			return new THREE.Vector3(x, y, z);
		},
		hslCones: function (color) {
			let hsl = color.getHSL();
			let angle = -hsl.h * Math.PI * 2;
			let radius = (1 - (Math.abs(hsl.l - 0.5) * 2)) * hsl.s * 0.5;
			let x = Math.cos(angle) * radius;
			let y = hsl.l - 0.5;
			let z = Math.sin(angle) * radius;
			return new THREE.Vector3(x, y, z);
		},
		hsvCone: function (color) {
			let hsv = hslToHsv(color.getHSL());
			let angle = -hsv.h * Math.PI * 2;
			let radius = hsv.v * hsv.s * 0.5;
			let x = Math.cos(angle) * radius;
			let y = hsv.v - 0.5;
			let z = Math.sin(angle) * radius;
			return new THREE.Vector3(x, y, z);
		},
		hslSphere: function (color) {
			let hsl = color.getHSL();
			let angle = -hsl.h * Math.PI * 2;
			let lon = hsl.l * Math.PI;
			let radius = Math.sin(lon) * hsl.s * 0.5;
			let x = Math.cos(angle) * radius;
			let y = Math.cos(lon) * -0.5;
			let z = Math.sin(angle) * radius;
			return new THREE.Vector3(x, y, z);
		},
		hsvSphere: function (color) {
			let hsv = hslToHsv(color.getHSL());
			let angle = -hsv.h * Math.PI * 2;
			let lon = hsv.v * Math.PI;
			let radius = Math.sin(lon) * hsv.s * 0.5;
			let x = Math.cos(angle) * radius;
			let y = Math.cos(lon) * -0.5;
			let z = Math.sin(angle) * radius;
			return new THREE.Vector3(x, y, z);
		},
		hslCube: function (color) {
			let hsl = color.getHSL();
			return new THREE.Vector3(
				hsl.h - 0.5,
				hsl.s - 0.5,
				hsl.l - 0.5
			);
		},
		hsvCube: function (color) {
			let hsv = hslToHsv(color.getHSL());
			return new THREE.Vector3(
				hsv.h - 0.5,
				hsv.s - 0.5,
				hsv.v - 0.5
			);
		},
	},
};

let hslToHsv = function(hsl) {
	let h = hsl.h;
	let s = hsl.s;
	let l = hsl.l;
	s *= l < .5 ? l : 1 - l;
	return {
		h: h,
		s: 2 * s / (l + s),
		v: l + s
	}
};
