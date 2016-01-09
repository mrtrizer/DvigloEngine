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
			this.parentElement = domObj.getLeafsByClass("LeafDOMObject")[0];
		} else
			this.parentElement = undefined;
		console.log("LeafDOM initialized");
	}
	
	getDocument() {
		return this.parentElement.getDocument();
	}
	
	getParentElement() {
		return this.parentElement;
	}
	
	getElement() {
		throw new Error("You should use LeafDOMElement ot it's children instead LeafDOMObject to use this method.");
	}
	
	render () {
		console.log("render dom element");
	}

}
