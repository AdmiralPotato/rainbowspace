<script>
	import state from './state';
	import InputButton from './input-button';
	export default {
		mixins: [InputButton],
		computed: {
			displayLabel: function () {
				let check = this.active() ? 'fa-check-square-o' : 'fa-square-o ';
				return `<i class="fa ${check}" aria-hidden="true"></i> ${this.label}`;
			}
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
