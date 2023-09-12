import gulp from "gulp";
import { path } from "./gulp/config/path.js";
import { plugins } from "./gulp/config/plugins.js";

//глобальная переменная
global.app = {
	path: path,
	gulp: gulp,
	plugins: plugins,
};

//импорт задач
import { copy } from "./gulp/tasks/copy.js";
import { reset } from "./gulp/tasks/reset.js";
import { html } from "./gulp/tasks/html.js";
import { server } from "./gulp/tasks/server.js";
import { scss } from "./gulp/tasks/scss.js";
import { js } from "./gulp/tasks/js.js";
import { images } from "./gulp/tasks/images.js";
import { audio } from "./gulp/tasks/audio.js";

// watcher
function watcher() {
	gulp.watch(path.watch.files, copy);
	gulp.watch(path.watch.html, html);
	gulp.watch(path.watch.scss, scss);
	gulp.watch(path.watch.js, js);
	gulp.watch(path.watch.images, images);
	gulp.watch(path.watch.audio, audio);
}

//основные задачи
const mainTasks = gulp.series(gulp.parallel(copy, html, scss, js, images, audio));

//построение сценариев выполнения задач
const dev = gulp.series(reset, mainTasks, gulp.parallel(watcher, server));

//выполнение сценария по умолчанию
gulp.task("default", dev);
