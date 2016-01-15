if (process.argv.length < 3) {
    console.log("Use:\n node server.js <operation> [params]");
    process.exit(1);
}

var gulp = require("gulp");
var browserify = require("browserify");
var babelify = require("babelify");
var source = require("vinyl-source-stream");
var buffer = require("vinyl-buffer");
var rigger = require("gulp-rigger");
var sourcemaps = require("gulp-sourcemaps");
var watchify = require("watchify");
var babel = require('gulp-babel');
var childProcess = require("child_process");
var http = require("http");
var url = require('url');
var path = require('path');
var fs = require('fs');
var reload = require('require-reload')(require);

var clientPath = null;
var projectPath = null;
var absoluteClientPath = null;
var projectConfig = null;
var handlers = null;
var config = null;

var command = process.argv[2];
if (command === "start")
    start();
else {
    console.log("Not implemented yet");
    process.exit(2);
}

///@addtogroup ServerCli
///Server is written on nodejs without es6. 
///It contains autobuild module and builds current project written with es6.
///@{

///Implements start operation
function start() {
    if (process.argv.length < 4) {
        console.log("Project path is empty");
        process.exit(10);
    }
    clientPath = process.argv[3];
    projectPath = path.resolve(clientPath, "project.json");
    absoluteClientPath = path.resolve(process.cwd, path.dirname(process.argv[1]));
    console.log(projectPath);

    if (!isExists(projectPath)) {
        console.log("Can't find project.json file in " + clientPath);
        process.exit(20);
    }

    projectConfig = JSON.parse(fs.readFileSync(projectPath));
    console.log(projectConfig);

    handlers = {};

    config = {
        "server_http_port": 80,
        "engine_path": path.resolve(absoluteClientPath, "engine")
    }

    console.log("Project dir: " + clientPath);
    console.log("Engine dir: " + config.engine_path);
}

///Starts HTTP server
///@param route Route callback. See route()
///@param config Config object
function startHTTP(route, config) {
    function onRequest(request, response) {
        var pathName = url.parse(request.url).pathname;
        console.log("HTTP Request for " + pathName + " received.");
        route(pathName, request, response);
    }
    http.createServer(onRequest).listen(config.server_http_port, function() {
        console.log("Server HTTP has been started on port: " + config.server_http_port);
    });
}

///Checks is a file exists
function isExists(name) {
    var access = false;
    try {
        fs.accessSync(name, fs.R_OK);
        access = true;
    } catch (e) {}
    return access;
}

///Writes an error with custom httpStatus
///@details If httpStatus is not defined, writes 404 error code.
///@param response Response object
///@param n Application error number
///@param msg Error message
///@param httpStatus HTTP status (404 default)
function writeError(response, n, msg, httpStatus) {
    console.log("ERROR #" + n + ": " + msg);
    response.writeHead(httpStatus || 404, {
        'Content-Type': 'text/plain'
    });
    response.write(JSON.stringify({
        error: n,
        msg: msg
    }));
    response.end();
}

///Just calls writeError() with 101 error code
function fileNotFound(response) {
    writeError(response, 101, "404 File not found");
}

///Writes a file to the response with MIME type
///@param response Response link
///@param fileName a file name
function writeFile(response, fileName) {
    const mimeTypes = {
        "html": "text/html",
        "jpeg": "image/jpeg",
        "jpg": "image/jpeg",
        "png": "image/png",
        "js": "text/javascript",
        "css": "text/css",
        "mp3": "audio/mpeg mp3"
    };
    var pathItems = path.extname(fileName).split(".");
    var mimeType = mimeTypes[pathItems[pathItems.length - 1]];
    response.writeHead(200, {
        'Content-Type': mimeType,
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
    });
    var fileStream = fs.createReadStream(fileName);
    fileStream.pipe(response);
}

///Searches a file or handler by URL
///@details If it can't find a file, it is trying to call a matching handler.
///@param pname URL string
///@param request Request object
///@param response Response object
function route(pname, request, response) {
    var pathName = "";
    if (pname.indexOf("/") != -1)
        pathName = pname.replace(/\/+/, "");
    var isAvaliable = new Boolean(handlers[pathName]);
    console.log("URL: " + pathName + " Direct handler:" + isAvaliable);
    if (isAvaliable == false) {
        for (var handlerName in handlers) {
            if (handlerName.indexOf("*") != -1) {
                var n = 0;
                while ((n < pathName.length) && (n < handlerName.length)) {
                    if (handlerName[n] == "*") {
                        var relativePath = pathName.slice(n, pathName.length);
                        var fullPath = "";
                        if (path.isAbsolute(handlers[handlerName]))
                            fullPath = path.resolve(handlers[handlerName], relativePath);
                        else
                            fullPath = path.resolve(absoluteClientPath, handlers[handlerName], relativePath);
                        console.log("File path: " + fullPath);
                        if (!isExists(fullPath)) {
                            fileNotFound(response);
                            return;
                        }
                        writeFile(response, fullPath);
                        return;
                    }
                    if (pathName[n] !== handlerName[n])
                        break;
                    n++;
                }
            }
        }
        fileNotFound(response);
        return;
    }
    if (typeof handlers[pathName] === 'function') {
        try {
            handlers[pathName](request, response);
        } catch (error) {
            console.log(error);
        }
        return;
    }
    if (typeof handlers[pathName] === 'string') {
        var fileName = "";
        if (path.isAbsolute(handlers[pathName]))
            fileName = handlers[pathName];
        else
            fileName = path.resolve(absoluteClientPath, handlers[pathName]);

        if (!isExists(fileName)) {
            fileNotFound(response);
            console.log("File path: " + fileName);
            return;
        }

        console.log("File path: " + fileName);
        writeFile(response, fileName);
    }
} //route

///Initializes a handler list
///@details It trying load handlers from the project. 
///And than it is adding default handler list.
///Among them:
///- index.html - main application page
///- engine.js - client part of the engine
///- app.js, app.js.map - client script of the application and a map for debugging
///- res/* - application resource path
function updateHandlers() {
    console.log("Handler updating");
    try {
        handlers = reload(path.resolve(clientPath, ".bin/server/", path.basename(projectConfig.server))).handlers;
    } catch (error) {
        console.log(error);
    }
    handlers["index.html"] = "./engine/frontend/index.html";
    handlers["app.js"] = path.resolve(clientPath, ".bin/client/app.js");
    handlers["app.js.map"] = path.resolve(clientPath, ".bin/client/app.js.map");
    handlers["res/*"] = path.resolve(clientPath, ".bin/res/");
    if (projectConfig.favicon)
        handlers["favicon.ico"] = path.resolve(clientPath, "./favicon.ico");
    else
        handlers["favicon.ico"] = "./favicon.ico";
}

///Starts all configured servers
function startServer() {
    startHTTP(route, config);
}

///@addtogroup ProjectAutoBuild
///@{

///Invokes full rebuild and than starts a servers
function buildAll(done) {
    initGulp(clientPath, projectConfig);
    gulp.start("watch");
    startServer();
}

///Gulp initialization.
///Adding build and watch tasks
function initGulp(projectPath, params) {
    var serverPath = path.resolve(projectPath, path.dirname(params.server), "*.js");
    var serverMainSource = path.resolve(projectPath, params.server);
    var resPath = path.resolve(projectPath, params.res);
    var clientMainSource = path.resolve(projectPath, params.client);
    var commonPath = path.resolve(projectPath, params.common, "*.js");
    var bundler = createAppBundler(clientMainSource, [watchify]);

    //Build all
    gulp.task("build", ["client:js:build", "server:babel:build", "common:babel:build", "res:build"]);

    //Build client
    gulp.task("client:js:build", ["common:babel:build"], function(done) {
        build(bundler, done, "app.js", path.resolve(projectPath, ".bin/client/"));
    });

    //Build res
    gulp.task("res:build", function(done) {
        gulp.src(resPath)
            .pipe(gulp.dest(path.resolve(projectPath, ".bin/res/")))
            .on("end", done)
            .on('error', log);
    });

    //Build server
    gulp.task("server:babel:build", function(done) {
        gulp.src(serverPath)
            .pipe(babel({
                presets: [require("babel-preset-es2015")],
            }))
            .pipe(gulp.dest(path.resolve(projectPath, ".bin/server/")))
            .on("end", done)
            .on('error', log);
    });

    //Build common
    gulp.task("common:babel:build", function(done) {
        gulp.src(commonPath)
            .pipe(babel({
                presets: [require("babel-preset-es2015")],
            }))
            .pipe(gulp.dest(path.resolve(projectPath, ".bin/common/")))
            .on("end", done)
            .on('error', log);

    });

    gulp.task("update_handlers", ["common:babel:build", "server:babel:build"], function() {
        updateHandlers();
    });

    //Watch all
    gulp.task("watch", function(done) {
        //Browserify + Watchify

        bundler.on("update", function() {
            gulp.start("client:js:build");
        });
        gulp.start("client:js:build");
        gulp.watch(path.resolve(projectPath, "./src/common/*.js"), ["update_handlers"]);
        gulp.watch(path.resolve(projectPath, "./src/server/*.js"), ["update_handlers"]);
        gulp.start("update_handlers");
        gulp.watch(path.resolve(projectPath, "./src/res/*"), ["res:build"]);
        gulp.start("res:build");
    });

    function log(error) {
        console.log("[" + error.name + " in " + error.plugin + "] " + error.message);
    }

    function build(bundler, done, name, dest) {
        function procError(error) {
            console.log("JS Build error");
            log(error);
            this.emit("end");
        }

        console.log(dest);
        console.log("JS Building start");
        bundler.bundle()
            .on('error', procError)
            .pipe(source(name))
            .on('error', procError)
            .pipe(buffer())
            .on('error', procError)
            .pipe(sourcemaps.init({
                loadMaps: true
            }))
            .on('error', procError)
            .pipe(sourcemaps.write("./", {
                sourceRoot: "./"
            }))
            .on('error', procError)
            .pipe(gulp.dest(dest))
            .on("end", function() {
                console.log("JS Building finish");
                if (typeof(done) === "function")
                    done()
            });
    }

    function createAppBundler(source, plugin) {
        return browserify(source, {
                debug: true,
                plugin: (plugin || []),
                paths: [
                    path.resolve(config.engine_path, "src/leaftypes"),
                    path.resolve(config.engine_path, "src/templates"),
                    path.resolve(config.engine_path, "src/core"),
                ]
            })
            .require(source, {
                expose: "app"
            })
            .transform(babelify, {
                presets: [require("babel-preset-es2015")]
            })
    }
} //initGulp

///@}

buildAll(startServer);
///@}
