import * as nodePath from "path";
const rootFolder = nodePath.basename(nodePath.resolve());

const buildFolder = `./build`;
const srcFolder = `./src`;

export const path = {
	build: {
		js: `${buildFolder}/js/`,
		images: `${buildFolder}/assets/img/`,
		css: `${buildFolder}/assets/styles/`,
		html: `${buildFolder}/`,
		fonts: `${buildFolder}/assets/fonts/`,
		files: `${buildFolder}/files/`,
		audio: `${buildFolder}/audio/`,
	},
	src: {
		js: `${srcFolder}/js/**/*.js`,
		images: `${srcFolder}/assets/img/*.{jpg,png,svg,gif,ico,webp,webmanifest,xml,json}`,
		fonts: `${srcFolder}/assets/fonts/`,
		css: `${srcFolder}/assets/styles/**/*.css`,
		html: `${srcFolder}/**/*.html`,
		files: `${srcFolder}/files/**/*.*`,
		audio: `${srcFolder}/audio/**/*.{mp3,wav}`,
	},
	watch: {
		js: `${srcFolder}/js/**/*.js`,
		images: `${srcFolder}/assets/img/*.{jpg,png,svg,gif,ico,webp,webmanifest,xml,json}`,
		fonts: `${srcFolder}/assets/fonts/`,
		css: `${srcFolder}/assets/styles/**/*.css`,
		html: `${srcFolder}/**/*.html`,
		files: `${srcFolder}/files/**/*.*`,
		audio: `${srcFolder}/audio/**/*.{mp3,wav}`,
	},
	clean: buildFolder,
	buildFolder: buildFolder,
	srcFolder: srcFolder,
	rootFolder: rootFolder,
	ftp: ``,
};
