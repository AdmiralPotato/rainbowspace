import Vue from 'vue';
import state from './state';

export default {
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
			Vue.set(state, this.destinationAddress, this.internalValue);
		}
	},
	watch: {
		value: function (newValue) {
			this.internalValue = newValue;
		}
	},
}

export let buttonMixin = {
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
				'btn-light': !active,
			}
		},
		displayLabel: function () {
			return this.label
		}
	},
	methods: {
		active: function () {
			return state[this.destinationAddress] === this.name;
		},
		click: function () {
			state[this.destinationAddress] = this.name;
		}
	}
};
