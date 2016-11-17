let Vertifier = function (args) {
	let t = this;
	t.imageUrl = args.imageUrl || console.break('MISSING IMAGE URL');
	t.callback = args.callback || console.break('MISSING CALLBACK');
	t.dataCanvas = args.dataCanvas || document.createElement('canvas');
	t.sampleMultiplier = args.sampleMultiplier || 1;
	t.mapMethodName = args.mapMethodName || 'xyz';

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
	loadImage: function(imageUrl){
		let t = this;
		t.imageUrl = imageUrl || t.imageUrl;
		t.loader.load(
			t.imageUrl,
			function (texture) {
				console.log(texture);
				t.loadSuccess(texture);
			},
			t.loadProgress,
			t.loadFailure
		);
	},
	loadSuccess: function (texture) {
		let t = this;
		t.dataCanvasContext = t.dataCanvas.getContext('2d');
		t.width = texture.image.width * t.sampleMultiplier;
		t.height = texture.image.height * t.sampleMultiplier;
		t.dataCanvas.width = t.width;
		t.dataCanvas.height = t.height;
		t.dataCanvasContext.clearRect(0, 0, t.width, t.height); //clearing the canvas, in case anything is left from an image with the same size loading in.
		t.dataCanvasContext.drawImage(texture.image, 0, 0, t.width, t.height);
		t.data = t.dataCanvasContext.getImageData(0, 0, t.width, t.height).data;

		let duplicateMap = {};
		let colors = [];
		let color;
		let rgbString;
		let offset;
		let r, g, b, a;
		let numPixels = t.width * t.height;
		for (var i = 0; i < numPixels; i++) {
			offset = i * 4;
			r = this.data[offset];
			g = this.data[offset + 1];
			b = this.data[offset + 2];
			a = this.data[offset + 3];
			rgbString = 'rgba(' + r + ',' + g + ',' + b + ')';
			if (!duplicateMap[rgbString] && a > 192) {
				color = new THREE.Color(rgbString);
				colors.push(color);
			}
			duplicateMap[rgbString] = true;
		}
		t.vertexGeom.colors = colors;
		t.vertexGeom.colorsNeedUpdate = true;
		t.mapColorsToVerts();
		t.callback(t);
	},
	loadProgress: function (xhr) {
		console.log((xhr.loaded / xhr.total * 100) + '% loaded');
	},
	loadFailure: function (xhr) {
		console.log('An error happened');
	},
	mapColorsToVerts: function (mapMethodName) {
		let t = this;
		t.mapMethodName = mapMethodName || t.mapMethodName;
		t.vertexGeom.vertices = t.vertexGeom.colors.map(t.mapNormalizedRGBTo[t.mapMethodName]);
		t.vertexGeom.verticesNeedUpdate = true;
	},
	mapNormalizedRGBTo: {
		xyz: function (color) {
			return new THREE.Vector3(
				color.r - 0.5,
				color.g - 0.5,
				color.b - 0.5
			);
		},
		hsl: function (color) {
			let hsl = color.getHSL();
			let angle = hsl.h * Math.PI * 2;
			let x = Math.cos(angle) * hsl.s * 0.5;
			let y = hsl.l - 0.5;
			let z = Math.sin(angle) * hsl.s * 0.5;
			return new THREE.Vector3(x, y, z);
		}
	},
};
