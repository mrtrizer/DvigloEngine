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
		var object = new Obj(this);
		for (var leafSrc of src.leafs) {
			try {
				let leaf = new this.classList[leafSrc.lclass](object,this,leafSrc);
				let parrentList = [];
				let proto = Object.getPrototypeOf(leaf);
				for (var i = 0; i < 10; i++)
				{
					parrentList.push(proto.constructor.name);
					proto = Object.getPrototypeOf(proto);
					if (Object.getPrototypeOf(proto) === null)
						break;
				}
				console.log(parrentList);
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

	///Searches an object among the whole tree by id
	findObjById(id, root) {
		return this.findObjBy_(root, object => object.id == id);
	}
	
	///Searches liaf in object using func for checking
	findLeafInObj(object,func) {
		for (var leaf of object.leafs)
			if (func(leaf))
				return leaf;
		return false;
	}

	///Searches an object among the whole tree by leaf class
	findObjByLeafClass(leafClass, root) {
		return this.findObjBy_(root, object => {
			return this.findLeafInObj(object, leaf => leaf.lclass == leafClass);
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
