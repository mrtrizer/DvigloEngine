import LeafEvent from "../core/leaf_event.js";
import {SystemTools} from "tools.js";
import createProp from "../core/leaf_prop.js";

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
		this.mode = leafSrc.mode || "*";
		let propList = {};
		for (let proto of SystemTools.getInheritChain(this))
			Object.assign(propList, proto.constructor.getPropList());
		this.properties = {};
		for (let propName in propList) {
			let propSrc = propList[propName];
			let prop = createProp(propSrc.type, propName, propSrc);
			prop.extract(leafSrc.data);
			this.properties[propName] = prop;
			Object.defineProperty(this, propName, { get: function () { return this.properties[propName].getValue(); }, configurable: true });
			Object.defineProperty(this, propName, { set: function (value) { return this.properties[propName].setValue(value); }, configurable: true  });
		}
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
	
	findNeighbor(leafClass, id = "*") {
		var leafList = this.object.getLeafsByClass(leafClass);
		if (id != "*") {
			var result = [];
			for (let leaf in leafList)
				if (leaf.id == id)
					result.push(leaf);
		} else {
			var result = leafList;
		}
		return result;
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
