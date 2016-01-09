export default class Leaf {
	constructor(object,tree) {
		this.object = object;
		this.tree = tree;
	}
	
	init() {
		console.log("Leaf initialized");
	}
	
	///Searches a child object by id
	findChildById(id) {
		this.tree.findChildById(id,this.object);
	}
	
	///Searches a child object by leaf class
	findChildByLeafClass(leafClass) {
		this.tree.findChildByLeafClass(leafClass,this.object);
	}
	
	///Searches an object by id
	findObjById(id) {
		this.tree.findChildById(id,this.tree);
	}
	
	///Searches an object by leaf class
	findObjByLeafClass(leafClass) {
		this.tree.findChildByLeafClass(leafClass,this.tree);
	}
}
