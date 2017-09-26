<template>
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
	></canvas>
</template>
<script>
	import state from './state';
	import Viewport from './viewport';
	import Vertifier from './vertifier';
	import { resizeWindowEventHandler } from './viewport.js'

	export default {
		props: {
			dataCanvas: HTMLCanvasElement
		},
		data: function(){
			return {
				width: 0,
				height: 0,
				clickable: false
			};
		},
		mounted: function(){
			let t = this;
			this.viewport = new Viewport(this.$el, this, this.dataCanvas);
			let handleAsFile = function(data){
				t.readFile(data.getAsFile());
			};
			let searchForImage = function(data){
				data.getAsString(function(raw){
					let value = ' ' + raw.replace(/\n/g, ' ') + ' ';
					let imageTagRegexExec = /.*(\<img.*?\>)/i.exec(value);
					let img = imageTagRegexExec && imageTagRegexExec[1] ? imageTagRegexExec[1] : null;
					let srcExec = img ? /src="(.*?)"/i.exec(img) : null;
					let altExec = img ? /alt="(.*?)"/i.exec(img) : null;
					let src = srcExec ? srcExec[1] : null;
					let alt = altExec ? altExec[1] : null;
					if(src){
						state.imageList.push({
							text: (alt || src.split('/').pop()),
							value: src
						});
						state.image = src;
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
					let anySuitableHandler = false;
					let handleType = function(item){
						if(supportedTypeMap.hasOwnProperty(item.type)){
							let handler = supportedTypeMap[item.type];
							handler(item);
							anySuitableHandler = true;
						}
					};
					itemList.forEach(handleType);
					if(!anySuitableHandler){
						alert('Sorry, was not able to load that image - still working out all the bugs. Try an image from another source?');
					}
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
				let imageAlreadyLoaded = Vertifier.loadedImageMap[nameUnique];
				if(imageAlreadyLoaded){
					console.log('file.alreadyLoaded', name);
					state.image = nameUnique;
				} else {
					let reader = new FileReader();
					reader.onloadend = function(upload) {
						console.log('file.loaded', name);
						let image = new Image();
						image.onload = function(){
							console.log('img.loaded', name);
							Vertifier.loadedImageMap[nameUnique] = image;
							state.imageList.push({
								text: name,
								value: nameUnique
							});
							state.image = nameUnique;
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
				state.autoRotateY = false;
				state.autoRotateX = false;
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
		}
	};
</script>
