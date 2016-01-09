import * as toolsModule from "./tools.js";

console.log("DVIGLO ENGINE");

export var tools = toolsModule;

class ObjectTree {
	
	constructor(tree, classList) {
		this.root = Object.assign({},tree);
		this.classList = classList;
		this.parseObject(this.root);
	}
	
	parseObjects(objects) {
		for (var i in objects) {
			var object = objects[i];
			this.parseObject(object);
		}
	}
	
	parseObject(object) {
		for (var i in object.leafs) {
			var leaf = object.leafs[i];
			leaf.instance = new this.classList[leaf.class];
			Object.assign(leaf.instance, leaf.data);
			leaf.instance.init();
			this.parseObjects(object.objects);
		}
	}
}

export function loadTree(objectTreeSource, classList) {
	return new ObjectTree(objectTreeSource, classList);
}
