import Obj from "./obj.js"
import LeafEvent from "./event.js"
import Leaf from "../leaf_classes/leaf.js"

///ObjTree implements a tree of game objects, 
///has functions for object managment.
export default class ObjTree {
	
	constructor(objTreeSrc, classList) {
		this.classList = classList;
		this.root = this.parseObject(objTreeSrc);
		this.initObject(this.root);
	}
	
	///The function calls all init methods for all leafs.
	///@details It is important to remeber that method calls init for 
	///all inherit chain.
	///E.g.: For LeafDOM leaf class it will call init() this order:
	///Leaf -> LeafDOMObject -> LeafDOM
	initObject(object) {
		for (let leaf of object.leafs) {
			try {
				//call init methods from all parrents
				let protoList = this.getInheritChain_(leaf);
				for (let i = protoList.length - 1; i >= 0; i--)
					protoList[i].init.call(leaf);
				//TODO: This condition doesn't work
				if (typeof(Object.getPrototypeOf(leaf).initOwn) === "function")
					leaf.initOwn();
			} catch (e) {
				console.log("Init error: ", e);
			}
		}
		for (let curObject of object.objects) {
			this.initObject(curObject)
		}
	}
	
	///Method creates Obj elements and add leafs there
	///@param src JSON source of object tree
	parseObject(src) {
		var object = new Obj(this,src);
		for (let leafSrc of src.leafs) {
			try {
				let leaf = new this.classList[leafSrc.lclass](object,this,leafSrc);
				object.addLeaf(leaf);
			} catch (e) {
				console.log("Init error: ", e);
			}
		}
		if (typeof(src.objects) === "object") {
			for (let curObjectSrc of src.objects) {
				object.addChild(this.parseObject(curObjectSrc, object));
			}
		}
		return object;
	}

	///Returns inherit chain of the object as list of prototypes
	///E.g.: For LeafDOM will retun [LeafDOM, LeafDOMObject, Leaf]
	getInheritChain_(obj) {
		var parrentList = [];
		var proto = Object.getPrototypeOf(obj);
		do {
			parrentList.push(proto);
			proto = Object.getPrototypeOf(proto);
		} while (Object.getPrototypeOf(proto) !== null)
		return parrentList
	}

	isFitToCondition_(obj, leafClass = "*", id = "*") {
		var fit = true;
		if (typeof(leafClass) !== "string")
			throw new Error("leafClass has to be a string");
		if (typeof(id) !== "string")
			throw new Error("id has to be a string");
		if (leafClass != "*")
		{
			if (typeof(this.classList[leafClass]) !== "function")
			{
				console.log("WARNING: Leaf class", leafClass, "is not defined");
				return false;
			}
			fit = fit && this.findLeafsInObj(obj, leaf => {
				return leaf instanceof this.classList[leafClass]
			}).length > 0;
		}
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
		var curObj = obj.parent;
		while (typeof(curObj) === "object") {
			if (this.isFitToCondition_(curObj, leafClass, id))
				return curObj;
			curObj = obj.parent;
		}
		return null;
	}

	///Emits an event to all listeners
	emit(listeners,event) {
		if (!Array.isArray(listeners))
			throw new Error("Param listeners has to be an array of object.");
		if (!event instanceof LeafEvent)
			throw new Error("Param event has to be an Event");
		for (let listener of listeners) {
			if (!event instanceof Leaf)
				throw new Error("All elements of listeners array have to be Leaf");
			for (let leaf of listener.leafs)
				leaf.procEvent(event);
		}
	}
	
	///Searches leaf in object using func for checking
	findLeafsInObj(object,func) {
		var list = [];
		for (let leaf of object.leafs)
			if (func(leaf))
				list.push(leaf);
		return list;
	}
	
	findObjBy_(objects, func) {
		var list = [];
		for (let object of objects) {
			if (func(object))
				list.push(object);
			if (typeof(object.objects) === "object") {
				var result = this.findObjBy_(object.objects, func);
				if (result != null)
					list = list.concat(result);
			}
		}
		return list;
	}
}
