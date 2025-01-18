var gulp = require("gulp");
var gulpif = require("gulp-if");
var gulpUtil = require("gulp-util");
var uglify = require("gulp-uglify");
var concat = require("gulp-concat-util");
var insert = require("gulp-insert");
var sourcemaps = require("gulp-sourcemaps");
var preprocess = require("gulp-preprocess");

gulp.task("js-client", function () {
	var list = [
		"./src/common/Base.js",
		"./src/common/*.js",

		"./src/game/js/ui/*.js",
		"./src/game/js/ui/components/*.js",
		"./src/game/js/helpers/*.js",
		"./src/game/js/shaders/*.js",
		"./src/game/js/enums/*.js",
		"./src/game/js/grid-objects/GridObject.js",
		"./src/game/js/grid-objects/*.js",
		"./src/game/js/loaders/*.js",
		"./src/game/js/factories/*.js",
		"./src/game/js/components/*.js",
		"./src/game/js/views/*.js"
	];

	if (global.target === "CHROME_APP") {
		list.push("./src/game/js/components/MapScript.js");
		list.push("./src/game/js/map-scripts/*.js");
	}

	list.push("./src/game/js/*.js");

	return gulp.src(list)
		.pipe(preprocess({ context: { TARGET: global.target, DEBUG: !global.production }}))
		.pipe(gulpif(!global.production, sourcemaps.init()))
		.pipe(concat("gorescript.min.js", { sep: ";" }))

		.pipe(insert.prepend([
				"/*! gorescript / http://gorescript.com */"
			].join("\n")))

		.pipe(gulpif(!global.production, sourcemaps.write()))
		.pipe(gulpif(global.production, uglify({
			mangle: false,
			preserveComments: "license"
		}).on("error", gulpUtil.log)))

		.pipe(gulp.dest(global.distFolder));
});