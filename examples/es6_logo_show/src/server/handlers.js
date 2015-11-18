import * as common from "../common/common.js";

export var handlers = {
	"init":init
};


function init(request, response)
{
	response.writeHead(200, {'Content-Type': 'text/plain'});
	response.write("Hello, WORLD!!!");
	response.end();
}

