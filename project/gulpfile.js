var gulp = require("gulp");
var browserify = require("browserify");
var babelify = require("babelify");
var source = require("vinyl-source-stream");
var buffer = require("vinyl-buffer");
var rigger = require("gulp-rigger");
var sourcemaps = require("gulp-sourcemaps");
var watchify = require("watchify");
var batch = require("gulp-batch");
var babel = require('gulp-babel');

function log(error) {
	    console.log("[" + error.name + " in " + error.plugin + "] " + error.message);
	    this.emit("end");
}

function build(bundler, done)
{
	console.log("JS Building start");
	bundler.bundle()
	.pipe(source('app.js'))
	.pipe(buffer())
	.pipe(sourcemaps.init({ loadMaps: true }))
	.pipe(sourcemaps.write("./",{sourceRoot:"./"}))
	.on('error',log)
	.pipe(gulp.dest("./bin/client"))
	.on("end",function(){
			console.log("JS Building finish");
			if (typeof(done) === "function") 
				done()
		} );
}

function createBundler(plugin)
{
	return browserify('./src/client/test.js', { debug: true,  plugin: (plugin || [])})
		.require("./src/client/test.js", {expose: "app"})
		.transform(babelify,{presets:["es2015"]})
}

//Build all
gulp.task("build",["js:build", "server:babel:build","common:babel:build"]);

//Build client
gulp.task("js:build", function(done) {
		build(createBundler(),done);
});

//Build server
gulp.task("server:babel:build", function(done) {
		gulp.src("./src/server/handlers.js")
		.pipe(babel({
            presets: ['es2015']
        }))
		.pipe(gulp.dest("./bin/server/"))
		.on("end",done);
});

//Build common
gulp.task("common:babel:build", function(done) {
		gulp.src("./src/common/*")
		.pipe(babel({
            presets: ['es2015']
        }))
		.pipe(gulp.dest("./bin/common/"))
		.on("end",done);
});

//Watch all
gulp.task("watch", function(done) {
		//Browserify + Watchify
		var bundler = createBundler([watchify]);
		bundler.on("update", function(){ build(bundler)});
		build(bundler,done);
});

