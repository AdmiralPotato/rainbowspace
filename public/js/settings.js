Vue.component(
	'settings',
	{
		props: {
			settings: Object,
			dataCanvas: HTMLCanvasElement
		},
		template: `
			<div class="card">
				<div class="card-header">Settings</div>
				<div class="card-block"><existingDomNode :content="dataCanvas" /></div>
				<div class="card-block">
					<form>
						<strapSelect
							label="Image"
							:list="settings.imageList"
							:value="settings.image"
							destinationAddress="image"
							/>
						<strapSelect
							label="Display Method"
							:list="settings.displayMethodList"
							:value="settings.displayMethod"
							destinationAddress="displayMethod"
							/>
						<strapSelect
							label="Camera Mode"
							:list="settings.cameraModeList"
							:value="settings.cameraMode"
							destinationAddress="cameraMode"
							/>
					</form>
				</div>
			</div>
		`,
	}
);

Vue.component(
	'existingDomNode',
	{
		props: {
			content: HTMLElement
		},
		mounted: function(){
			//what am I doing with my life
			this.$el.appendChild(this.content);
		},
		template: `<div></div>`
	}
);

Vue.component(
	'strapSelect',
	{
		data: function(){
			return {
				id: 'strapSelect-' + this._uid,
				internalValue: this.value
			}
		},
		props: {
			list: Array,
			label: String,
			value: String,
			destinationAddress: String
		},
		methods: {
			change: function(){
				monoDirectional(this.destinationAddress, this.internalValue);
			}
		},
		watch: {
			value: function (newValue) {
				this.internalValue = newValue;
			}
		},
		template: `
			<div class="form-group">
				<label :for="id">{{ label }}</label>
				<select :id="id" v-model="internalValue" class="form-control" v-on:change="change">
					<option v-for="option in list" v-bind:value="option.value || option">{{ option.text || option }}</option>
				</select>
			</div>
		`
	}
);
