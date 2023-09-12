import dartSass from "sass";
import gulpSass from "gulp-sass";
import rename from "gulp-rename";
import autoprefixer from "gulp-autoprefixer"; // автопрефиксер
import gcmq from "gulp-group-css-media-queries"; // группировка медиа запросов

const sass = gulpSass(dartSass);

export const scss = () => {
	return app.gulp
		.src(app.path.src.scss, { sourcemaps: true })
		.pipe(
			app.plugins.plumber(
				app.plugins.notify.onError({
					title: "SCSS",
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
		.pipe(
			sass({
				outputStyle: "expanded",
			})
		)
		.pipe(gcmq())
		.pipe(
			rename({
				extname: ".min.css",
			})
		)
		.pipe(app.gulp.dest(app.path.build.css))
		.pipe(app.plugins.browsersync.stream());
};
