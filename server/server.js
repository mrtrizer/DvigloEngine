if (process.argv.length < 3)
{
	console.log("Use:\n node server.js <project path>");
	process.exit(1);
}

var childProcess = require("child_process");
var http = require("http");
var url = require('url');
var path = require('path');
var fs = require('fs');
var clientPath = process.argv[2];
var projectPath = path.resolve(clientPath, "project.json");
var pathStat = fs.statSync(projectPath);

if (!pathStat.isFile())
{
	console.log("Can't find project.json file in " + clientPath);
	process.exit(2);
}

var projectConfig = JSON.parse(fs.readFileSync(projectPath));
console.log(projectConfig);

var handlers = {}; 

var config = {
	"server_http_port":80,
	"engine_path":path.resolve(process.cwd, path.dirname(process.argv[1]),"engine")
}

console.log("Client dir: " + clientPath);
console.log("Engine dir: " + config.engine_path);

function execGulp(dir,task,name,done)
{
	var gulp = childProcess.spawn("gulp", [task], {cwd:dir});
	function write (data){
		process.stdout.write("[" + name + "] " + data)
	};
	gulp.stdout.on("data",write);
	gulp.stderr.on("data",write);
	gulp.stdout.on("close",done);
}

function startHTTP(route,config)
{
	function onRequest(request, response) 
	{
		var pathname = url.parse(request.url).pathname;
		console.log("HTTP Request for " + pathname + " received.");
		route(pathname, request, response);
	}
	http.createServer(onRequest).listen(config.server_http_port);
	console.log("Server HTTP has been started on port: " + config.server_http_port);
}

var mimeTypes = {
    "html": "text/html",
    "jpeg": "image/jpeg",
    "jpg": "image/jpeg",
    "png": "image/png",
    "js": "text/javascript",
    "css": "text/css",
    "mp3": "audio/mpeg mp3"};

function  route(pname, request, response)
{
	var pathname = "";
	console.log("FuncName: "+pname);
	if(pathname.indexOf("/"))
			pathname = pname.replace(/\/+/,"");
	if (typeof handlers[pathname] === 'function') 
	{
		console.log("It is a function"); 
		handlers[pathname](request,response);
	}
	else 
	{
		console.log("It is not a function");
		var fileName = path.join(process.cwd(), pathname);

		fs.exists(fileName, function(exists) {
			if(!exists) {
				console.log("No request handler found: " + pathname);
				console.log("File not exists: " + fileName);
				response.writeHead(404, {'Content-Type': 'text/plain'});
				response.write('404 Not Found\n');
				response.end();
				return;
			}
			if (!fs.lstatSync(fileName).isFile())
			{
				response.writeHead(423, {'Content-Type': 'text/plain'});
				response.write('423 Locked\n');
				return;
			}
			var pathItems = path.extname(fileName).split(".");
			var mimeType = mimeTypes[pathItems[pathItems.length - 1]];
			response.writeHead(200, {'Content-Type': mimeType});
			var fileStream = fs.createReadStream(fileName);
			fileStream.pipe(response);
		}); //fs.exists
	}
}//route

function startServer()
{
	handlers = require(path.resolve(clientPath, projectConfig.server)).handlers;
	startHTTP(route,config);
}

function buildAll(done)
{
	var n = 2;
	function ready()
	{
		if (--n == 0)
			done()
	}
	execGulp(config.engine_path,"build","engine",ready);
	execGulp(clientPath,"build","client",ready);
}

buildAll(startServer);

