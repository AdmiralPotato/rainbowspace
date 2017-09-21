<template>
	<button
		type="button"
		class="btn"
		:class="classObject"
		v-on:click="click"
	>{{label}}</button>
</template>
<script>
	import {buttonMixin} from './mixin-input';
	export default {
		mixins: [buttonMixin]
	};
</script>
