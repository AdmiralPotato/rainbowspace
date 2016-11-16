let Vertifier = function(imageUrl, callback){
	let t = this;
	t.loader = new THREE.TextureLoader();
	t.canvas = document.createElement('canvas');
	t.c = t.canvas.getContext('2d');
	// create the particle variables
	let vertexGeom = new THREE.Geometry(),
		vertexMaterial = new THREE.PointsMaterial({
			color: 0xFFFFFF,
			size: 5,
			sizeAttenuation: false,
			vertexColors: THREE.VertexColors
		});
	let colors = [];
	let color;
	let sampleMultiplier = 0.125;
	t.loader.load(
		imageUrl,
		function(texture){
			//console.log(texture);

			t.width =   texture.image.width * sampleMultiplier;
			t.height = texture.image.height * sampleMultiplier;
			t.loaded = true;
			t.canvas.width =  t.width;
			t.canvas.height = t.height;
			t.c.clearRect(0,0,t.width,t.height); //clearing the canvas, in case anything is left from an image with the same size loading in.
			t.canvas.style.width = t.width + 'px';
			t.canvas.style.height = t.height + 'px';
			t.c.drawImage(texture.image,0,0,t.width,t.height);
			t.data = t.c.getImageData(0,0,t.width,t.height).data;


			for(let y = 0; y < t.height; y += 1){
				for(let x = 0; x < t.width; x += 1){
					let p4 = t.getPixel(x,y);
					//console.log(p4);
					if(p4[0] == 0 && p4[1] == 0 && p4[2] == 0 && p4[3] == 0){
						//console.log('I did nothing because it was transparent black!');
					}else if(p4[3] == 0){
						//console.log('I did nothing because it was completely transparent!');
					}else if(p4[3] == 255){
						color = new THREE.Color('rgb(' + p4[0] + ',' + p4[1] + ',' + p4[2] + ')');
						colors.push(color);
						let vert = t.scaleData(t.centerData(p4));
						vertexGeom.vertices.push(new THREE.Vector3(vert[0], vert[1], vert[2]));
					}
				}
			}
			vertexGeom.colors = colors;
			console.log(vertexGeom);


			t.particleSystem = new THREE.Points(
				vertexGeom,
				vertexMaterial
			);

			//let p4 = t.getPixel(0,0);
			//console.log('First point color:',p4);
			//t.lines.push([0, t.points.length -1, 'rgb(' + p4[0] + ',' + p4[1] + ',' + p4[2] + ')']);
			callback(t);
		},
		// Function called when download progresses
		function ( xhr ) {
			console.log( (xhr.loaded / xhr.total * 100) + '% loaded' );
		},
		// Function called when download errors
		function ( xhr ) {
			console.log( 'An error happened' );
		}
	);
};

Vertifier.prototype = {
	getOffset:function(x,y){return (x + (y * this.canvas.width)) * 4;},
	getPixel:function(x,y){
		let offset = this.getOffset(x,y);
		return [this.data[offset],this.data[offset + 1],this.data[offset + 2],this.data[offset + 3]];
	},
	centerData: function(p3){return [p3[0] -128,p3[1] -128,p3[2] -128];},
	scaleData: function(p3){return [p3[0]/256,p3[1]/256,p3[2]/256];}
};

let vertifier = new Vertifier(
	'img/rainbowspace_logo-512.png',
	function(t){
		viewport.cube.material.wireframe = true;
		viewport.cube.add(t.particleSystem);
	}
);
