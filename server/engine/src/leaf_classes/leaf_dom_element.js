import Leaf from "leaf.js";

export default class LeafDOMElement extends Leaf
{
	static getPropList() {
		return {
		}
	}
	
	init() {
		if (this.object.getLeafsByClass("LeafDOMElement").length > 1)
			throw new Error("You can add only one LeafDOMElement in object.");
		var domObj = this.object.findParent("LeafDOMElement");
		if (this.lclass != "LeafDOM") {
			if (domObj === null)
				throw new Error("LeafDOMElement has no parents. Add LeafDOM to the top of hierarchy.");
			this.prevElement = domObj.getLeafsByClass("LeafDOMElement")[0].document;
		} else
			this.prevElement = undefined;
		
		console.log("LeafDOM initialized");
	}
	
	render () {
		console.log("render dom element");
	}

}
