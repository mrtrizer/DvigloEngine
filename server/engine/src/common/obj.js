export default class Obj {
	constructor (tree,objSrc) {
		this.tree = tree;
		this.parrent = null;
		this.objects = [];
		this.leafs = [];
		this.id = objSrc.id || null;
	}
	
	///[Experimental] Searches children
	findChildren(leafClass, id) {
		return this.tree.findChildren(leafClass, id, this);
	}

	///[Experimental] Searches a parrent
	findParent(leafClass, id, obj) {
		return this.tree.findParent(leafClass, id, this);
	}
	
	///[Experimental] Seaches an object in a tree
	findObj(leafClass, id) {
		return this.tree.findObj(leafClass, id);
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
	
	///Returns a leaf of current object by class
	getLeafByClass(leafClass) {
		return this.tree.findLeafInObj(this, leaf => leaf.lclass == leafClass);
	}
	
	///Returns a leaf of current object by id
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

