import LeafEvent from "leaf_event.js";
import {SystemTools} from "tools.js";
import createProp from "leaf_prop.js";

export default class Leaf {
	
	///Returns property list of current leaf. Reimplement it in child classes.
	static getPropList() {
		return {
		}
	}
	
	///Creates an instance of Leaf of appropriate class
	///@param obj container for leaf
	///@param leafSrc JSON source of leaf
	static createLeaf(obj, leafSrc) {
		if (typeof (leafSrc.lclass) != "string")
			throw new Error("Invalid leaf class id. It has to be string.");
		return new obj.tree.classList[leafSrc.lclass](obj,leafSrc);
	}
	
	constructor(object,leafSrc) {
		if (typeof(leafSrc.lclass) !== "string")
			throw new Error("Leaf without lclass field.");
		this.object = object;
		this.tree = object.tree;
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
	
	///Serializes leaf
	toJSON() {
		var jsonData = {lclass: this.lclass, data: {}};
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
	
	///Calls corresponding to event method
	///@param event an instance of LeafEvent
	procEvent(event) {
		if (typeof(this[event.method]) === "function")
			this[event.method](event,event.args);
	}
	
	///Searches leafs from children by leaf class and object id
	///@see Obj.children(), Obj.leafs()
	childrenLeafs(leafClass, id) {
		var objectList = this.object.children(leafClass, id);
		var leafList = [];
		for (let object of objectList)
			leafList = leafList.concat(object.leafs(leafClass));
		return leafList;
	}
	
	///Returns first appropriate neighbor of current leaf
	///@see Leaf.neighbors()
	neighbor(leafClass = "*") {
		var neighbors = this.neighbors(leafClass);
		return neighbors.length > 0? neighbors[0]: undefined;
	}
	
	///Search neighbors of current leaf
	///@see Obj.leafs()
	neighbors(leafClass = "*") {
		return this.object.leafs(leafClass);
	}
	
	///Simplified event sending to children
	///@param leafClass class of listener liafs
	///@param id id of listener object
	///@param method event name (liaf's method)
	///@param args event arguments
	emitChildren(leafClass, id, method, args = {}) {
		this.object.emit(this.childrenLeafs(leafClass, id), new LeafEvent(method, args));
	}
}
