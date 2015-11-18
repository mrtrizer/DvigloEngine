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
	gulp.stdout.on("data",function(data) 
	{
		write(data)
		var str = new String(data);
		if ((str.indexOf("Finished") != -1) && (str.indexOf(task) != -1))
			done();
	});
	gulp.stderr.on("data",write);
	if (typeof(done) === "function")
		gulp.stdout.on("close",done);
}

function startHTTP(route,config)
{
	function onRequest(request, response) 
	{
		var pathName = url.parse(request.url).pathname;
		console.log("HTTP Request for " + pathName + " received.");
		route(pathName, request, response);
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

function fileNotFound(response)
{
	writeError(response, 101, "404 File not found"); 
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
	var pathName = "";
	if(pname.indexOf("/") != -1)
		pathName = pname.replace(/\/+/,"");
	var isAvaliable = new Boolean(handlers[pathName]);
	console.log("URL: " + pathName + " Direct handler:" + isAvaliable);
	if (isAvaliable == false)
	{
		for (var handlerName in handlers)
		{
			if (handlerName.indexOf("*") != -1)
			{
				var n = 0;
				while((n < pathName.length) && (n < handlerName.length)) {
					if (handlerName[n] == "*")
					{
						var relativePath = pathName.slice(n,pathName.length);
						var fullPath = "";
						if (path.isAbsolute(handlers[handlerName]))
							fullPath = path.resolve(handlers[handlerName],relativePath);
						else
							fullPath = path.resolve(absoluteClientPath,handlers[handlerName],relativePath);
						console.log("File path: " + fullPath);
						if (!isExists(fullPath))
						{
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
	if (typeof handlers[pathName] === 'function') 
	{
		handlers[pathName](request,response);
		return;
	}
	if (typeof handlers[pathName] === 'string')
	{
		if (!isExists(handlers[pathName])) {
			fileNotFound(response);
			return;
		}

		var fileName = "";
		if (path.isAbsolute(handlers[pathName]))
			fileName = handlers[pathName]; 
		else
			fileName = path.resolve(absoluteClientPath, handlers[pathName]);

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
		console.log("READY");
		if (--n == 0)
			done()
	}
	execGulp(config.engine_path,"watch","engine",ready);
	execGulp(clientPath,"watch","client",ready);
}

buildAll(startServer);

