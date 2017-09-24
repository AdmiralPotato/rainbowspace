<template>
	<button
		type="button"
		class="btn"
		:class="classObject"
		@click="click"
		v-html="displayLabel"
	></button>
</template>
<script>
	import {buttonMixin} from './mixin-input';
	export default {
		mixins: [buttonMixin]
	};
</script>
