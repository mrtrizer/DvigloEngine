var gulp = require("gulp");
var browserify = require("browserify");
var babelify = require("babelify");
var source = require("vinyl-source-stream");
var buffer = require("vinyl-buffer");
var rigger = require("gulp-rigger");
var sourcemaps = require("gulp-sourcemaps");
var watchify = require("watchify");
var batch = require("gulp-batch");

function log(error) {
	    console.log("[" + error.name + " in " + error.plugin + "] " + error.message);
	    this.emit("end");
}

function build(bundler)
{
	bundler.bundle()
	.pipe(source('app.js'))
	.pipe(buffer())
	.pipe(sourcemaps.init({ loadMaps: true }))
	.pipe(sourcemaps.write("./",{sourceRoot:"BabelTest/"}))
	.on('error',log)
	.pipe(gulp.dest("./bin"));
}

function createBundler()
{
	return browserify('./src/test.js', { debug: true })
		.transform(babelify,{presets:["es2015"]})
		.require("./src/test.js",{expose:"test"})
		.require("./src/three.js",{expose:"three.js"});
}

gulp.task("build", function() {
		build(createBundler());
});

gulp.task("watch", function() {
		var watch = watchify(createBundler());
		watch.on("update",function() {
			console.log("BUILDING");
			build(watch);
		});
		gulp.watch("./src/*.html", batch(function(events,cb){
			events
			.on("data",function(){ 
				console.log("HTML BUILDING"); 
				gulp.start("html:build") })
			.on("end",cb);	}));
		build(watch);
});

gulp.task("html:build", function() {
	gulp.src("./src/*.html")
	.pipe(gulp.dest("./bin/"));
});
