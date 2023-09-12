export const audio = () => {
	return app.gulp
		.src(app.path.src.audio)
		.pipe(
			app.plugins.plumber(
				app.plugins.notify.onError({
					title: "AUDIO",
					message: "Error: <%= error.message %>",
				})
			)
		)
		.pipe(app.plugins.newer(app.path.build.audio))
		.pipe(app.gulp.dest(app.path.build.audio))
		.pipe(app.gulp.src(app.path.src.audio))
		.pipe(app.plugins.browsersync.stream());
};
