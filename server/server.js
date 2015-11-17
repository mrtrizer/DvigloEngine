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
var absoluteClientPath = path.resolve(process.cwd, path.dirname(process.argv[1]));

if (!isExists(projectPath))
{
	console.log("Can't find project.json file in " + clientPath);
	process.exit(2);
}

var projectConfig = JSON.parse(fs.readFileSync(projectPath));
console.log(projectConfig);

var handlers = {}; 

var config = {
	"server_http_port":80,
	"engine_path":path.resolve(absoluteClientPath,"engine")
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

function isExists(name)
{
	var access = false;
	try {
		fs.accessSync(name,fs.R_OK);
		access = true;
	} 
	catch (e) {}
	return access;
}

function writeError(response, n, msg, httpStatus)
{
	console.log("ERROR #" + n + ": " + msg);
	response.writeHead(httpStatus || 404, {'Content-Type': 'text/plain'});
	response.write(JSON.stringify({error: n, msg: msg}));
	response.end();
}

function writeFile(response, fileName)
{
	const mimeTypes = {
    "html": "text/html",
    "jpeg": "image/jpeg",
    "jpg": "image/jpeg",
    "png": "image/png",
    "js": "text/javascript",
    "css": "text/css",
    "mp3": "audio/mpeg mp3"};
	var pathItems = path.extname(fileName).split(".");
	var mimeType = mimeTypes[pathItems[pathItems.length - 1]];
	response.writeHead(200, {'Content-Type': mimeType});
	var fileStream = fs.createReadStream(fileName);
	fileStream.pipe(response);
}

function route(pname, request, response)
{
	var pathname = "";
	if(pname.indexOf("/") != -1)
		pathname = pname.replace(/\/+/,"");
	var isAvaliable = new Boolean(handlers[pathname]);
	console.log("URL: " + pathname + " Direct handler:" + isAvaliable);
	if (isAvaliable == false)
	{
		for (var handlerName in handlers)
		{
			console.log(handlerName);
			if (handlerName.indexOf("*") != -1)
			{
				console.log("****");
				var n = 0;
				while((n < pathname.length) && (n < handlerName.length)) {
					console.log(handlerName[n]);
					if (handlerName[n] == "*")
					{
						var relativePath = pathname.slice(n,pathname.length);
						var fullPath = "";
						if (path.isAbsolute(handlers[handlerName]))
							fullPath = path.resolve(handlers[handlerName],relativePath);
						else
							fullPath = path.resolve(absoluteClientPath,handlers[handlerName],relativePath);
						console.log("File path: " + fullPath);
						if (!isExists(fullPath))
						{
							writeError(response, 101, "File not found: " + fullPath); 
							return;
						}
						writeFile(response, fullPath);
						return;
					}
					if (pathname[n] !== handlerName[n])
						break;
					n++;
				} 			
			}
		}
		writeError(response, 101, "File not found"); 
		return;
	}
	if (typeof handlers[pathname] === 'function') 
	{
		handlers[pathname](request,response);
		return;
	}
	if (typeof handlers[pathname] === 'string')
	{
		if (!isExists(handlers[pathname])) {
			writeError(response, 101, "File not found: " + handlers[pathname]); 
			return;
		}

		var fileName = "";
		if (path.isAbsolute(handlers[pathname]))
			fileName = handlers[pathname]; 
		else
			fileName = path.resolve(absoluteClientPath, handlers[pathname]);

		console.log("File path: " + fileName);
		writeFile(response, fileName); 	
	}
}//route

function startServer()
{
	handlers = require(path.resolve(clientPath, projectConfig.server)).handlers;	
	handlers["index.html"] = "./engine/bin/index.html";
	handlers["engine.js"] = "./engine/bin/app.js" 
	handlers["app.js"] = path.resolve(clientPath,projectConfig.client);
	handlers["res/*"] = path.resolve(clientPath,projectConfig.res);
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

