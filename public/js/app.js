var app = new Vue({
	el: '#app',
	data: {
		showSidebar: true
	},
	template: `
		<div class="h-100 container-fluid">
			<div class="h-100 row">
				<div class="h-100 col-xs-12 col-sm-9 noPad">
					<div class="h-100 main">
						<viewport />
					</div>
				</div>
				<div class="h-100 col-xs-12 col-sm-3 noPad">
					<div class="h-100 sidebar">
						<div class="card">
							<div class="card-header">Sidebar</div>
							<div class="card-block">

								<h4 class="card-title">Settings Title</h4>
								<p class="card-text">hell yeah this is where settings live</p>

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
