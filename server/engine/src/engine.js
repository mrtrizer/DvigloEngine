import * as toolsModule from "./tools/tools.js";

console.log("DVIGLO ENGINE v0.1.0");

export var tools = toolsModule;

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
			leaf.instance = new this.classList[leaf.lclass](object,this);
			Object.assign(leaf.instance, leaf.data);
			leaf.instance.init();
			if (typeof(object.objects) === "object")
				this.parseObjectsIn(object);
		}
	}

	///Searches an object among the whole tree by id
	findObjById(id, root) {
		return findObjById(id, root.objects);
	}
	
	///Searches an object among the whole tree by leaf class
	findObjByLeafClass(leafClass, root) {
		findObjByLeafClass_(leafClass, root.objects);
	}
	
	findObjById_(id, objects) {
		return findObjBy_(objects, object => object.id == id);
	}
	
	findObjByLeafClass_(leafClass, objects) {
		return findObjBy_(objects, function (object) {
			for (var leaf of object.leafs)
				if (leaf.lclass == leafClass)
					return true;
			return false;
		});
	}
	
	findObjBy_(id, func) {
		for (var object of objects)
			if (func(object))
				return object;
			else {
				if (typeof(object.objects) === "object") {
					result = findObjBy_(id, func);
					if (result != null)
						return result;
				}
			}
		return null;
	}
}

///(Experimental) Loads an object tree from json
///@param objTreeSrc JSON object
///@param classList List of using classes
export function loadTree(objTreeSrc, classList) {
	return new ObjTree(objTreeSrc, classList);
}
