<template>
	<div class="card settings">
		<div class="card-header">Settings</div>
		<div class="card-body">
			<existingDomNode :content="dataCanvas"></existingDomNode>
			<div class="container fluid">
				<form encType="multipart/form-data">
					<div class="row">
						<input-select
							label="Image"
							:list="settings.imageList"
							:value="settings.image"
							destinationAddress="image"
						></input-select>
						<button
							type="button"
							class="btn btn-primary col-12 no-gutter"
							v-on:click="clearAllImages"
						>Clear all</button>
						<label
							for="uploadImage"
							class="btn btn-primary col-12 no-gutter"
						>Upload Image</label>
						<input
							type="file"
							id="uploadImage"
							style="display: none;"
							v-on:change="uploadImage"
						/>
						<input-select
							class="col-12 no-gutter"
							label="Display Method"
							:list="settings.displayMethodList"
							:value="settings.displayMethod"
							destinationAddress="displayMethod"
						></input-select>
						<input-toggle
							class="col-12 no-gutter"
							label="Show Bounds"
							destinationAddress="showBounds"
						></input-toggle>
						<hr />
						<input-select
							class="col-12 no-gutter"
							label="Camera Mode"
							:list="settings.cameraModeList"
							:value="settings.cameraMode"
							destinationAddress="cameraMode"
						></input-select>
						<div class="form-group col-12 no-gutter">
							<label>Automatic Rotation</label>
							<div role="group">
								<input-toggle
									class="col-6"
									label="SpinY"
									destinationAddress="autoRotateY"
								></input-toggle><input-toggle
									class="col-6"
									label="SpinX"
									destinationAddress="autoRotateX"
								></input-toggle>
							</div>
						</div>
						<div class="form-group col-12 no-gutter">
							<label>Camera Positions</label>
							<div role="group">
								<input-button
									class="col-6 col-lg-3 no-gutter"
									:label="item"
									destinationAddress="cameraPosition"
									v-for="item in settings.cameraPositionList"
								></input-button>
							</div>
						</div>
						<input-select
							class="col-12 no-gutter"
							label="Background Color"
							:value="settings.backgroundColor"
							:list="settings.backgroundColorList"
							destinationAddress="backgroundColor"
						></input-select>
					</div>
				</form>
			</div>
			<div>
				<h5>RainbowSpace:<br />Color Gamut Visualizer</h5>
				<p>A project by <a href="http://nuclearpixel.com/about/">Admiral Potato</a>.<br /><a href="https://github.com/AdmiralPotato/rainbowspace">Check out the project on GitHub</a> if you have questions, comments, feedback or issues.</p>
			</div>
		</div>
	</div>
</template>
<script>
	import state from './state';
	import ExistingDomNode from './existing-dom-node';
	import InputButton from './input-button';
	import InputCheck from './input-check';
	import InputSelect from './input-select';
	import InputToggle from './input-toggle';

	export default {
		components: {
			ExistingDomNode,
			InputButton,
			InputCheck,
			InputSelect,
			InputToggle
		},
		props: {
			settings: Object,
			dataCanvas: HTMLCanvasElement
		},
		methods: {
			clearAllImages: function(){
				state.imageList = [];
			},
			uploadImage: function(changeEvent){
				let fileList = Array.prototype.slice.call(changeEvent.target.files);
				state.scaleImages = this.isMobile();
				fileList.forEach(function(file){
					viewport.vue.readFile(file);
				});
			},
			isMobile: function() {
				let result = navigator.userAgent.match(/(Android|webOS|iPhone|iPad|iPod|BlackBerry|Windows Phone)/i);
				return result !== null;
			}
		}
	}
</script>
