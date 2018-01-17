<template>
	<button
		type="button"
		class="btn"
		:class="classObject"
		@click="click"
	>
		<span class="buttonIcon"v-if="iconName"><icon :name="iconName" /></span>
		<span class="label">{{displayLabel}}</span>
	</button>
</template>
<script>
	import Icon from 'vue-awesome/components/Icon'
	import {buttonMixin} from './mixin-input';
	export default {
		components: {
			Icon
		},
		mixins: [buttonMixin]
	};
</script>
