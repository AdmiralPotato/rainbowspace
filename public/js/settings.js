Vue.component(
	'settings',
	{
		props: {
			settings: Object,
			dataCanvas: HTMLCanvasElement
		},
		methods: {
			clearAllImages: function(){
				settings.imageList = [];
			}
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
						<div class="row">
							<div class="col-xs-12">
								<button
									type="button"
									class="btn btn-secondary col-xs-12"
									v-on:click="clearAllImages"
									>Clear all</button>
							</div>
						</div>
						<bSelect
							label="Display Method"
							:list="settings.displayMethodList"
							:value="settings.displayMethod"
							destinationAddress="displayMethod"
							/>
						<hr />
						<bSelect
							label="Camera Mode"
							:list="settings.cameraModeList"
							:value="settings.cameraMode"
							destinationAddress="cameraMode"
							/>
						<div class="row" role="group">
							<div class="col-xs-12">
								<bToggle
									class="col-xs-6 no-gutter"
									label="Auto Rotate Y"
									destinationAddress="autoRotateY"
									/>
								<bToggle
									class="col-xs-6 no-gutter"
									label="Auto Rotate X"
									destinationAddress="autoRotateX"
									/>
							</div>
						</div>
						<div class="form-group">
							<label>Camera Positions</label>
							<div class="row" role="group">
								<div class="col-xs-12">
										<bButton
											class="col-xs-6 col-lg-3 no-gutter"
											:label="item"
											destinationAddress="cameraPosition"
											v-for="item in settings.cameraPositionList"
											/>
								</div>
							</div>
						</div>
						<div class="form-group">
							<label>Background Color</label>
							<div class="row" role="group">
								<div class="col-xs-12">
									<bButton
										class="col-xs-4"
										:label="item"
										destinationAddress="backgroundColor"
										v-for="item in settings.backgroundColorList"
										/>
								</div>
							</div>
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


let buttonMixIn = {
	data: function(){
		return {
			name: this.label.toLocaleLowerCase()
		}
	},
	props: {
		label: String,
		destinationAddress: String
	},
	computed: {
		classObject: function () {
			let active = this.active();
			return {
				'btn-primary': active,
				'btn-secondary': !active,
			}
		}
	},
	methods: {
		active: function () {
			return settings[this.destinationAddress] === this.name;
		},
		click: function () {
			settings[this.destinationAddress] = this.name;
		}
	},
	template: `
		<button
			type="button"
			class="btn"
			:class="classObject"
			v-on:click="click"
			>{{label}}</button>
	`
};

Vue.component(
	'bButton',
	{
		mixins: [buttonMixIn]
	}
);


Vue.component(
	'bToggle',
	{
		mixins: [buttonMixIn],
		methods: {
			active: function () {
				return settings[this.destinationAddress];
			},
			click: function () {
				settings[this.destinationAddress] = !settings[this.destinationAddress];
			}
		}
	}
);
