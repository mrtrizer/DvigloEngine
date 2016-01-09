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
		return this.tree.findChildren(this, leafClass, id);
	}

	///[Experimental] Searches a parrent
	findParent(leafClass, id, obj) {
		return this.tree.findParent(this, leafClass, id);
	}
	
	///[Experimental] Seaches an object in a tree
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
		obj.parrent = this;
		this.objects.push(obj);
	}
	
	///Returns a leaf of current object by class
	getLeafsByClass(leafClass) {
		return this.tree.findLeafsInObj(this, leaf => leaf.lclass == leafClass);
	}
	
	///Returns a leaf of current object by id
	getLeafById(id) {
		return this.tree.findLeafInObj(this, leaf => leaf.id == id);
	}
}

