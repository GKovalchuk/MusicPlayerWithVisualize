import autoprefixer from "gulp-autoprefixer"; // автопрефиксер

export const css = () => {
	return app.gulp
		.src(app.path.src.css, { sourcemaps: true })
		.pipe(
			app.plugins.plumber(
				app.plugins.notify.onError({
					title: "CSS",
					message: "Error: <%= error.message %>",
				})
			)
		)
		.pipe(
			autoprefixer({
				grid: true,
				overrideBrowserslist: ["last 3 versions"],
				cascade: true,
			})
		)
		.pipe(app.gulp.dest(app.path.build.css))
		.pipe(app.plugins.browsersync.stream());
};
