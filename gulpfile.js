var gulp = require("gulp");
var browserify = require("browserify");
var babelify = require("babelify");
var source = require("vinyl-source-stream");
var buffer = require("vinyl-buffer");
var rigger = require("gulp-rigger");
var sourcemaps = require("gulp-sourcemaps");

function log(error) {
	    console.log("[" + error.name + " in " + error.plugin + "] " + error.message);
	    this.emit("end");
}

gulp.task("build", function() {
	browserify('./src/test.js', { debug: true })
		.transform(babelify,{presets:["es2015"]})
		.require("./src/test.js",{expose:"test"})
		.require("./src/three.js",{expose:"three.js"})
		.bundle()
	.on('error',log)
	.pipe(source('app.js'))
	.pipe(buffer())
	.pipe(sourcemaps.init({ loadMaps: true }))
	.pipe(sourcemaps.write("./",{sourceRoot:"BabelTest/"}))
	.pipe(gulp.dest("./bin"));
});
