import Obj from "./obj.js"

///ObjTree implements a tree of game objects, 
///has functions for object managment.
export default class ObjTree {
	
	constructor(objTreeSrc, classList) {
		this.classList = classList;
		this.root = this.parseObject(objTreeSrc);
		this.initObject(this.root);
	}
	
	initObject(object) {
		for (var leaf of object.leafs) {
			try {
				leaf.init();
			} catch (e) {
				console.log("Init error: ", e);
			}
		}
		for (var curObject of object.objects) {
			this.initObject(curObject)
		}
	}
	
	parseObject(src) {
		var object = new Obj(this,src);
		for (var leafSrc of src.leafs) {
			try {
				let leaf = new this.classList[leafSrc.lclass](object,this,leafSrc);
				object.addLeaf(leaf);
			} catch (e) {
				console.log("Init error: ", e);
			}
		}
		if (typeof(src.objects) === "object") {
			for (var curObjectSrc of src.objects) {
				object.addChild(this.parseObject(curObjectSrc, object));
			}
		}
		return object;
	}

	getInheritChain(obj) {
		var parrentList = [];
		var proto = Object.getPrototypeOf(leaf);
		do {
			parrentList.push(proto.constructor.name);
			proto = Object.getPrototypeOf(proto);
		} while (Object.getPrototypeOf(proto) !== null)
		return parrentList
	}

	isFitToCondition_(leafClass, id, obj) {
		var fit = true;
		if (leafClass != "*")
		{
			if (typeof(this.classList[leafClass]) !== "function")
			{
				console.log("WARNING: Leaf class", leafClass, "is not defined");
				return false; //no corresponding leaf class in a list
			}
			fit = fit && this.findLeafInObj(obj, leaf => {
				return leaf instanceof this.classList[leafClass]
			}).length > 0;
		}
		if (id != "*")
			fit = obj.id == id && fit;
		return fit;
	}

	///[Experimental] Searches children
	findChildren(leafClass, id, obj) {
		return this.findObjBy_([obj], obj => this.isFitToCondition_(leafClass, id, obj));
	}

	///[Experimental] Searches a parrent
	findParent(leafClass, id, obj) {
		var list = this.findObjBy_([obj], obj => this.isFitToCondition_(leafClass, id, obj));
		return list.length == 0 ? null: list[0];
	}
	
	///[Experimental] Seaches an object in a tree
	findObj(leafClass, id) {
		return this.findChildren(leafClass, id, this.root);
	}
	
	///[Experimental] Emits an event to all listeners
	emit(listeners,event) {
		if (!Array.isArray(listeners))
			throw new Error("Param listeners has to be an array of object.");
		if (!event instanceof Event)
			throw new Error("Param event has to be an Event");
		for (var listener of listeners) {
			if (!event instanceof Leaf)
				throw new Error("All elements of listeners array have to be Leaf");
			for (var leaf of listener.leafs)
				leaf.procEvent(event);
		}
	}

	///Searches an object among the whole tree by id
	findObjById(id, root) {
		var list = this.findObjBy_([root], object => object.id == id);
		return list.length == 0? null : list[0];
	}
	
	///Searches leaf in object using func for checking
	findLeafInObj(object,func) {
		var list = [];
		for (var leaf of object.leafs)
			if (func(leaf))
				list.push(leaf);
		return list;
	}

	///Searches an object among the whole tree by leaf class
	findObjByLeafClass(leafClass, root) {
		var list = this.findObjBy_([root], object => {
			return this.findLeafInObj(object, leaf => leaf.lclass == leafClass).length > 0;
		});
		return list.length == 0? null : list[0];
	}
	
	findObjBy_(objects, func) {
		var list = [];
		for (var object of objects) {
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
