export default class Obj {
	constructor (tree,objSrc) {
		this.tree = tree;
		this.parent = undefined;
		this.objects = [];
		this.leafs = [];
		this.id = objSrc.id || null;
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
}

