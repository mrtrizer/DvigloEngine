import threeModule from "./three.js"
import * as toolsModule from "./tools.js";

console.log("Engine loaded!");

export var three = threeModule;
export var tools = toolsModule;

export function test()
{
	console.log("Test");
}
