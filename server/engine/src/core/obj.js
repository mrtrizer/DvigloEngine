import Template from "template.js";
import Leaf from "leaf.js"

///@addtogroup Core
///@{

export default class Obj {
	
	constructor (tree,objSrc,parent) {
		this.tree = tree;
		this.parent_ = parent;
		this.objects_ = [];
		this.parseObject(objSrc);
	}
	
	///Serialize object
	toJSON() {
		var jsonData = { leafs:[], objects:[]};
		if (typeof(this.id) === "string")
			jsonData.id = this.id;
		for (let leaf of this.leafs_)
			jsonData.leafs.push(leaf.toJSON());
		for (let object of this.objects_)
			jsonData.objects.push(object.toJSON());
		return jsonData;
	}
	
	///Search objects among all children
	///@see Obj.isFitTo()
	children(leafClass = "*", id = "*") {
		return this.findObjects([this], obj => obj.isFitTo(leafClass, id));
	}
	
	///Check if class fit to condition
	///@param leafClass target class of leaf
	///@param id target object id
	isFitTo(leafClass = "*", id = "*") {
		var fit = true;
		if (typeof(leafClass) !== "string")
			throw new Error("leafClass has to be a string");
		if (typeof(id) !== "string")
			throw new Error("id has to be a string");
		if (leafClass != "*")
			fit = fit && this.leafs(leafClass).length > 0;
		if (id != "*")
			fit = this.id === id && fit;
		return fit;
	}
	
	///Return parent which fit to request
	///@see Obj.isFitTo()
	parent(leafClass = "*", id = "*") {
		return this.tree.findParent(this,leafClass,id);
	}
	
	///Return only direct appropriate children of the object
	///@see Obj.isFitTo()
	objects(leafClass = "*", id = "*") {
		throw new Error("Not implementd");
	}
	
	///Return first appropriate leaf
	///@see Obj.leafs()
	leaf(leafClass = "*") {
		var leafs = this.leafs(leafClass);
		return leafs.length > 0? leafs[0] : undefined;
	}
	
	///Search leafs with passed leafClass
	///@param leafClass target leaf class
	leafs(leafClass = "*") {
		if (typeof(this.tree.classList[leafClass]) !== "function") {
			console.log("WARNING: Leaf class", leafClass, "is not defined");
			return [];
		}
		return this.findLeafs(leaf => {
			return leaf instanceof this.tree.classList[leafClass]
		})
	}
	
	///Search leafs in the object using func for verification
	///@param func verification function
	findLeafs(func) {
		var list = [];
		for (let leaf of this.leafs_)
			if (func(leaf))
				list.push(leaf);
		return list;
	}
	
	///@see ObjTree.emit()
	emit(listeners,event) {
		return this.tree.emit(listeners,event);
	}
	
	///Add a new leaf to the object
	///@param leaf instance of Leaf or it's inheritor
	addLeaf(leaf) {
		leaf.object = this;
		this.leafs_.push(leaf);
	}
	
	///Add a child object
	///@param obj instance of Obj
	addChild(obj) {
		obj.parent_ = this;
		this.objects_.push(obj);
	}
	
	///Method creates Obj elements and adds leafs
	///@param src JSON source of object tree
	parseObject(src) {
		this.leafs_ = [];
		this.id = src.id || null;
		for (let leafSrc of src.leafs) {
			try {
				if (typeof(this.tree.classList[leafSrc.lclass]) !== "function")
					throw new Error("Invalid leaf class: " + leafSrc.lclass + ".");
				this.addLeaf(Leaf.createLeaf(this,leafSrc));
			} catch (e) {
				console.log("Leaf parsing error: ", e);
			}
		}
		if (typeof(src.objects) === "object")
			for (let curObjectSrc of src.objects)
				this.addChild(new Obj(this.tree, curObjectSrc, this));
	}
	
	///Search objects among passed objects and their children using verification function 
	///@param objects an array of objects, or an object
	///@param func a verification function returning boolean
	findObjects(objects, func) {
		var list = [];
		if (!Array.isArray(objects))
			objects = [objects];
		for (let object of objects) {
			if (func(object))
				list.push(object);
			if (typeof(object.objects_) === "object") {
				var result = this.findObjects(object.objects_, func);
				if (result != null)
					list = list.concat(result);
			}
		}
		return list;
	}
}

///@} Core
