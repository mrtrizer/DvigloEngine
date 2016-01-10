import Common from "../common/common.js";

export var handlers = {
	"hello":hello,
	"test":test
};

var common = new Common(5);

function hello(request, response)
{
	response.writeHead(200, {'Content-Type': 'text/plain'});
	response.write("Hello, WORLD!!!" + common.calc(1000));
	response.end();
}

function test(request, response)
{
	response.writeHead(200, {'Content-Type': 'text/html'});
	response.write("<img src='/res/logo.png'>");
	response.end();
}

