var childProcess = require("child_process");

function execGulp(dir,name)
{
	var gulp = childProcess.spawn("gulp", ["watch"], {cwd:dir});
	gulp.stdout.on("data",function(data){process.stdout.write("[" + name + "] " + data)});
}

var engineGulpPath = "./server/engine/"
var clientGulpPath = process.argv[2];

console.log("Client dir: " + clientGulpPath);
console.log("Engine dir: " + engineGulpPath);

execGulp(engineGulpPath,"engine");
execGulp(clientGulpPath,"client");
