import Common from "../common/common.js";

var TOOLS = engine.tools;
var client = new TOOLS.HTTPClient(TOOLS.Network.detectHost(),0,0,0);

export function main()
{
	var img = new Image();
	img.src = "/res/logo.png";
	img.width = 250;
	engine.document.body.appendChild(img); 
	engine.document.body.innerHTML += "<br><h1>ABUKSIGUN</h1><br>";
	engine.document.body.innerHTML += "<a href='/hello'>HELLO</a>";
	console.log(TOOLS.MathTools.MD5("Hello, World!"));
	var common = new Common(5);
	console.log(common.calc(100));
	client.sendRequest("hello",{},"GET",
		function(data){
			console.log(data)
			},
		function(error){
			console.log(error)
			});
}
