export default class Obj {
	constructor (tree,objSrc,parent) {
		this.tree = tree;
		this.parent = parent;
		this.objects = [];
		this.parseObject(objSrc);
	}
	
	toJSON() {
		var jsonData = {
			leafs:[],
			objects:[]
		};
		
		if (typeof(this.id) === "string")
			jsonData.id = this.id;
			
		for (let leaf of this.leafs)
			jsonData.leafs.push(leaf.toJSON());
		
		for (let object of this.objects)
			jsonData.objects.push(object.toJSON());
		
		return jsonData;
	}
	
	///Searches children
	findChildren(leafClass, id) {
		return this.tree.findChildren(this, leafClass, id);
	}

	///Searches a parrent
	findParent(leafClass, id, obj) {
		return this.tree.findParent(this, leafClass, id);
	}
	
	///Seaches an object in a tree
	findObj(leafClass, id) {
		return this.tree.findChildren(this.tree.root, leafClass, id);
	}
	
	emit(listeners,event) {
		return this.tree.emit(listeners,event);
	}
	
	///Adds new leaf
	addLeaf(leaf) {
		leaf.object = this;
		this.leafs.push(leaf);
	}
	
	///Adds an object as child
	addChild(obj) {
		obj.parent = this;
		this.objects.push(obj);
	}
	
	///Returns a leaf of current object by class
	getLeafsByClass(leafClass) {
		return this.tree.findLeafsInObjByClass(this, leafClass);
	}
	
	///Returns a leaf of current object by id
	getLeafById(id) {
		return this.tree.findLeafInObj(this, leaf => leaf.id == id);
	}
	
	///Method creates Obj elements and adds leafs
	///@param src JSON source of object tree
	parseObject(src) {
		this.leafs = [];
		this.id = src.id || null;
		for (let leafSrc of src.leafs) {
			try {
				if (typeof(this.tree.classList[leafSrc.lclass]) !== "function")
					throw new Error("Invalid leaf class: " + leafSrc.lclass + ".");
				let leaf = new this.tree.classList[leafSrc.lclass](this,this,leafSrc);
				this.addLeaf(leaf);
			} catch (e) {
				console.log("Leaf parsing error: ", e);
			}
		}
		if (typeof(src.objects) === "object")
			for (let curObjectSrc of src.objects)
				this.addChild(new Obj(this.tree, curObjectSrc, this));
	}
}

