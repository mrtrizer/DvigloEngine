import * as toolsModule from "./tools/tools.js";

console.log("DVIGLO ENGINE v0.1.0");

export var tools = toolsModule;
export var document = null;

class Obj {
	constructor (tree,parent) {
		this.tree = tree | null;
		this.parrent = parent | null;
		this.objects = [];
		this.leafs = [];
	}
	
	///Adds new leaf
	addLeaf(leaf) {
		leaf.object = this;
		this.leafs.push(leaf);
	}
	
	///Adds an object as child
	addChild(obj) {
		obj.parrent = this;
		this.objects.push(obj);
	}
	
	///Returns a liaf of current object by class
	getLeafByClass(leafClass) {
		return this.tree.findLeafInObj(this, leaf => leaf.lclass == leafClass);
	}
	
	///Returns a liaf of current object by id
	getLeafById(id) {
		return this.tree.findLeafInObj(this, leaf => leaf.id == id);
	}
	
	///Searches a child object by id
	findChildById(id) {
		return this.tree.findObjById(id,this.object);
	}
	
	///Searches a child object by leaf class
	findChildByLeafClass(leafClass) {
		return this.tree.findObjByLeafClass(leafClass,this.object);
	}
	
	///Searches an object by id
	findObjById(id) {
		return this.tree.findObjById(id,this.tree.root);
	}
	
	///Searches an object by leaf class
	findObjByLeafClass(leafClass) {
		return this.tree.findObjByLeafClass(leafClass,this.tree.root);
	}
}

///ObjTree implements a tree of game objects, 
///has functions for object managment.
class ObjTree {
	
	constructor(objTreeSrc, classList) {
		this.root = Object.assign({},objTreeSrc);
		this.classList = classList;
		this.parseObject(this.root, null);
	}
	
	parseObjectsIn(object) {
		for (var curObject of object.objects) {
			this.parseObject(curObject, object);
		}
	}
	
	parseObject(object, parent) {
		object.parent = parent;
		for (var leaf of object.leafs) {
			try {
				leaf.instance = new this.classList[leaf.lclass](object,this);
				Object.assign(leaf.instance, leaf.data);
				leaf.instance.init();
			} catch (e) {
				console.log("Init error: ", e);
			}
			if (typeof(object.objects) === "object")
				this.parseObjectsIn(object);
		}
	}

	///Searches an object among the whole tree by id
	findObjById(id, root) {
		return this.findObjBy_(root, object => object.id == id);
	}
	
	///Searches liaf in object using func for checking
	findLeafInObj(object,func) {
		for (var leaf of object.leafs)
			if (func(leaf,leafClass))
				return leaf;
		return false;
	}

	///Searches an object among the whole tree by leaf class
	findObjByLeafClass(leafClass, root) {
		return this.findObjBy_(root, function (object) {
			return findLeafInObj(root, leaf => leaf.lclass == leafClass);
		});
	}
	
	findObjBy_(object, func) {
		for (var object of [object]) {
			if (func(object))
				return object;
			else {
				if (typeof(object.objects) === "object") {
					var result = findObjBy_(object.objects, func);
					if (result != null)
						return result;
				}
			}
		return null;
		}
	}
}

export function setDocument(document) {
	this.document = document;
}

///(Experimental) Loads an object tree from json
///@param objTreeSrc JSON object
///@param classList List of using classes
export function loadTree(objTreeSrc, classList) {
	if (typeof(document) !== "object")
		throw Error("DOM is not loaded. Call loadTree() in main().");
	return new ObjTree(objTreeSrc, classList);
}
