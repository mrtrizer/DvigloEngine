import Obj from "obj.js";
import LeafEvent from "leaf_event.js";
import Leaf from "leaf.js";
import {SystemTools} from "tools.js";

///@addtogroup Core
///@{

///ObjTree implements a tree of game objects, 
///has functions for object managment.
export default class ObjTree {
	
	constructor(objTreeSrc, classList) {
		this.classList = classList;
		this.root = new Obj(this,objTreeSrc,undefined);
		this.initObject(this.root);
	}
	
	///The function calls all init methods for all leafs.
	///@details It is important to remeber that method calls init for 
	///all inherit chain.
	///E.g.: For LeafDOM leaf class it will call init() this order:
	///Leaf -> LeafDOMObject -> LeafDOM
	initObject(object) {
		for (let leaf of object.leafs_) {
			try {
				//call init methods from all parrents
				for (let proto of SystemTools.getInheritChain(leaf))
					proto.init.call(leaf);
				if (Object.getPrototypeOf(leaf).hasOwnProperty("initOwn"))
					leaf.initOwn();
			} catch (e) {
				console.log("Leaf initialization error: ", e);
			}
		}
		for (let curObject of object.objects_) {
			this.initObject(curObject)
		}
	}

	///Serialize tree to JSON. Returns JSON object.
	toJSON() {
		return this.root.toJSON();
	}

	isFitToCondition_(obj, leafClass = "*", id = "*") {
		var fit = true;
		if (typeof(leafClass) !== "string")
			throw new Error("leafClass has to be a string");
		if (typeof(id) !== "string")
			throw new Error("id has to be a string");
		if (leafClass != "*")
			fit = fit && obj.leafs(leafClass).length > 0;
		if (id != "*")
			fit = obj.id == id && fit;
		return fit;
	}

	///Searches children
	findChildren(obj, leafClass, id) {
		return this.findObjBy_([obj], obj => this.isFitToCondition_(obj, leafClass, id));
	}

	///Searches a parrent. Returns null if can't find.
	findParent(obj, leafClass, id) {
		if (typeof(obj) !== "object")
			throw Error("Invalid object link");
		var curObj = obj.parent_;
		while (typeof(curObj) === "object") {
			if (this.isFitToCondition_(curObj, leafClass, id))
				return curObj;
			curObj = obj.parent_;
		}
		return null;
	}

	///Emits an event to all listeners
	///@param listeners leafs that get event
	///@param event LeafEvent instance
	emit(listeners,event) {
		if (!Array.isArray(listeners))
			throw new Error("Param listeners has to be an array of object.");
		if (!event instanceof LeafEvent)
			throw new Error("Param event has to be an Event");
		for (let listener of listeners) {
			if (!listener instanceof Leaf)
				throw new Error("All elements of listeners array have to be Leaf");
			for (let leaf of listeners)
				leaf.procEvent(event);
		}
	}
	
	findObjBy_(objects, func) {
		var list = [];
		for (let object of objects) {
			if (func(object))
				list.push(object);
			if (typeof(object.objects_) === "object") {
				var result = this.findObjBy_(object.objects_, func);
				if (result != null)
					list = list.concat(result);
			}
		}
		return list;
	}
}

///@} Core
