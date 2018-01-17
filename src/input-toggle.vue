<script>
	import state from './state';
	import InputButton from './input-button';
	import 'vue-awesome/icons/check-square-o'
	import 'vue-awesome/icons/square-o'
	export default {
		mixins: [InputButton],
		computed: {
			iconName: function () { return this.active() ? 'check-square-o' : 'square-o'; }
		},
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
