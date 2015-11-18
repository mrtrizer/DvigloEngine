export function main()
{
	var img = new Image();
	img.src = "/res/logo.png";
	img.width = 250;
	engine.document.body.appendChild(img); 
	engine.document.body.innerHTML += "<br><h1>ABUKSIGUN</h1>";
}
