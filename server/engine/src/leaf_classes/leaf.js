import LeafEvent from "../core/leaf_event.js"

export default class Leaf {
	
	static getPropList() {
		return {
		}
	}
	
	constructor(object,tree,leafSrc) {
		if (typeof(leafSrc.lclass) !== "string")
			throw new Error("Leaf without lclass field.");
		this.object = object;
		this.tree = tree;
		this.id = leafSrc.id || null;
		this.lclass = leafSrc.lclass;
		Object.assign(this, leafSrc.data);
	}
	
	init() {
		console.log("Leaf initialized. Class:", this.lclass);
	}
	
	toJSON() {
		var jsonData = {
			lclass: this.lclass,
			data: {}
		};
		var propList = this.constructor.getPropList();
		for (let propName in propList)
			if (this[propName] != undefined)
				jsonData.data[propName] = this[propName];
			else
				jsonData.data[propName] = propList[propName].def || 0;
				
		return jsonData;
	}
	
	initOwn() {
		throw new Error("You can't create leaf of Leaf class directly. Inherit it first.");
	}
	
	procEvent(event) {
		if (typeof(this[event.method]) === "function")
			this[event.method](event);
	}
	
	findChildrenLieafs(leafClass, id) {
		var objectList = this.object.findChildren(leafClass, id);
		var leafList = [];
		for (let object of objectList)
			leafList = leafList.concat(object.getLeafsByClass(leafClass));
		return leafList;
	}
	
	emitChildren(leafClass, id, method, args = {}) {
		this.object.emit(this.findChildrenLieafs(leafClass, id), new LeafEvent(method, args));
	}
}
