import Leaf from "leaf.js";

export default class LeafDOMObject extends Leaf
{
	static getPropList() {
		return {
		}
	}
	
	init() {
		if (this.object.getLeafsByClass("LeafDOMObject").length > 1)
			throw new Error("You can add only one LeafDOMObject in object.");
		var domObj = this.object.findParent("LeafDOMObject");
		if (this.lclass != "LeafDOM") {
			if (domObj === null)
				throw new Error("LeafDOMObject has no parents. Add LeafDOM to the top of hierarchy.");
			this.prevElement = domObj.getLeafsByClass("LeafDOMObject")[0];
		} else
			this.prevElement = undefined;
		
		console.log("LeafDOM initialized");
	}
	
	getDocument() {
		return this.prevElement.getDocument();
	}
	
	render () {
		console.log("render dom element");
	}

}
