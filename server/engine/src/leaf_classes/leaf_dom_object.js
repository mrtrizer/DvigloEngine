import Leaf from "leaf.js";

///Root object in a DOM tree
export default class LeafDOMObject extends Leaf
{
	static getPropList() {
		return {
		}
	}
	
	///Checks is no any other LeafDOMObject in current object and searches parrent
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
	}
	
	initOwn() {
		throw new Error("You can't create leaf of LeafDOMObject class directly. Use LeafDOMElement or extend LeafDOMObject.");
	}
	
	getDocument() {
		return document;
	}
	
	getWindow() {
		return window;
	}
	
	getParentElement() {
		return this.parentElement;
	}
	
	getElement() {
		throw new Error("You should use LeafDOMElement ot it's children instead LeafDOMObject to use this method.");
	}
	
	render () {
	}

}
