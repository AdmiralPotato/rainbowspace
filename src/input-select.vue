<template>
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
</template>
<script>
	import inputMixin from './mixin-input';
	export default {
		mixins: [inputMixin],
		props: {
			list: Array,
		}
	}
</script>
