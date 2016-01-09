import Leaf from "leaf.js";

export default class LeafDOMElement extends Leaf
{
	static getPropList() {
		return {
		}
	}
	
	init() {
		var domObj = this.object.findParent("LeafDOMElement");
		var prevElement = null;
		if (typeof(domObj) !== "object")
		{
			domObj = this.object.findParent("LeafDOM");
			prevElement = domObj.getLeafsByClass("LeafDOMElement")[0].element;
		}
		else
			prevElement = domObj.getLeafsByClass("LeafDOM")[0].document;
		if (typeof(domObj) !== "object")
			throw new Error("LeafDOMElement has no parents. Add LeafDOM to the top of hierarchy.");
		console.log("LeafDOM initialized");
		this.prevElement = prevElement;
	}
	
	render () {
		console.log("render dom element");
	}

}
