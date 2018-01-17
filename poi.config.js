const { resolve } = require('path')

module.exports = (options, req) => ({
	entry: 'src/index.js',
	html: {
		title: 'RainbowSpace: Color Gamut Visualizer',
		template: 'src/template.html'
	},
	removeDist: true,
	filename: {
		js: '[name].js',
		css: 'style.css',
		images: 'assets/images/[name].[ext]',
		fonts: 'assets/fonts/[name].[ext]',
		chunk: '[id].chunk.js'
	}
})
