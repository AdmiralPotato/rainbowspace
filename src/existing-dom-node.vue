<template>
	<div></div>
</template>
<script>
	export default {
		props: {
			content: HTMLElement
		},
		mounted: function(){
			//what am I doing with my life
			this.$el.appendChild(this.content);
		}
	}
</script>
