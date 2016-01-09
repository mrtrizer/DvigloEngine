export default class Leaf {
	
	constructor(object,tree,leafSrc) {
		if (typeof(leafSrc.lclass) !== "string")
			throw new Error("Leaf without lclass field.");
		this.object = object;
		this.tree = tree;
		this.id = leafSrc.id || null;
		this.lclass = leafSrc.lclass;
		Object.assign(this, leafSrc.data);
	}
	
	init() {
		console.log("Leaf initialized");
	}
	
	genEvent(listeners,event) {
		
	}
	
}
