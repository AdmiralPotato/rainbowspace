<script>
	import state from './state';
	import InputButton from './input-button';
	export default {
		mixins: [InputButton],
		methods: {
			active: function () {
				return state[this.destinationAddress];
			},
			click: function () {
				state[this.destinationAddress] = !state[this.destinationAddress];
			}
		}
	}
</script>
