<template>
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
</template>
<script>
	import inputMixin from './mixin-input';
	export default {
		props: {
			value: Boolean
		},
		mixins: [inputMixin]
	}
</script>
