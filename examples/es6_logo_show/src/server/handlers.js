import * as common from "../common/common.js";

export var handlers = {
	"hello":hello,
	"test":test
};


function hello(request, response)
{
	response.writeHead(200, {'Content-Type': 'text/plain'});
	response.write("Hello, WORLD!!!");
	response.end();
}

function test(request, response)
{
	response.writeHead(200, {'Content-Type': 'text/html'});
	response.write("<img src='/res/logo.png'>");
	response.end();
}

