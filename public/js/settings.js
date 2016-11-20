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
						<bSelect
							label="Image"
							:list="settings.imageList"
							:value="settings.image"
							destinationAddress="image"
							/>
						<bSelect
							label="Display Method"
							:list="settings.displayMethodList"
							:value="settings.displayMethod"
							destinationAddress="displayMethod"
							/>
						<bSelect
							label="Camera Mode"
							:list="settings.cameraModeList"
							:value="settings.cameraMode"
							destinationAddress="cameraMode"
							/>
						<div class="row">
							<bCheck
								class="col-xs-6"
								label="Auto Rotate Y"
								:value="settings.autoRotateY"
								destinationAddress="autoRotateY"
								/>
							<bCheck
								class="col-xs-6"
								label="Auto Rotate X"
								:value="settings.autoRotateX"
								destinationAddress="autoRotateX"
								/>
						</div>
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

let inputMixin = {
	data: function(){
		return {
			id: 'inputUnique-' + this._uid,
			internalValue: this.value
		}
	},
	props: {
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
};

Vue.component(
	'bSelect',
	{
		mixins: [inputMixin],
		props: {
			list: Array,
		},
		template: `
			<div class="form-group">
				<label :for="id">{{ label }}</label>
				<select
					class="form-control"
					:id="id"
					v-model="internalValue"
					v-on:change="change"
					>
					<option v-for="option in list" v-bind:value="option.value || option">{{ option.text || option }}</option>
				</select>
			</div>
		`
	}
);

Vue.component(
	'bCheck',
	{
		props: {
			value: Boolean
		},
		mixins: [inputMixin],
		template: `
			<div class="form-check">
				<label class="form-check-label">
				<input
					type="checkbox"
					class="form-check-input"
					:id="id"
					v-model="internalValue"
					v-on:change="change"
					/>
				{{ label }}
				</label>
			</div>
		`
	}
);
