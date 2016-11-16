var app = new Vue({
	el: '#app',
	data: {
		showSidebar: false
	},
	methods: {
		settingsToggle: function(){
			this.showSidebar = !this.showSidebar;
			setTimeout(resizeWindowEventHandler,0);
		}
	},
	template: `
		<div class="h-100 container-fluid">
			<div class="h-100 row">
				<div class="settingsToggle"><a class="icon fa fa-bars" @click="settingsToggle"></a></div>
				<div class="h-100 col-xs-12 main" :class="{'col-md-9': showSidebar}">
					<viewport />
				</div>
				<div class="h-100 col-xs-12 noPad sidebar" :class="{'col-md-3': showSidebar}" v-if="showSidebar">
					<div class="h-100">
						<div class="card">
							<div class="card-header">Sidebar</div>
							<div class="card-block">

								<h4 class="card-title">Settings Title</h4>
								<p class="card-text">hell yeah this is where settings live</p>
								<hr />
								<h4 class="card-title">Even More Settings Title</h4>
								<p class="card-text">hell yeah this is where settings live</p>

							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	`
});
