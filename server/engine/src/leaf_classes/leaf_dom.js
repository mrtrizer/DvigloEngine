import LeafDOMObject from "leaf_dom_object.js";

export default class LeafDOM extends LeafDOMObject
{
	static getPropList() {
		return {
		}
	}
	
	///Checks if document and window object exist
	init() {
		if (typeof(document) !== "object")
			throw new Error("Can't find DOM object");
		if (typeof(window) !== "object")
			throw new Error("Can't find window object");
		this.document = document;
		this.document.body.style.margin = "0px";
		this.document.body.style.padding = "0px";
		this.onNewFrame();
	}
	
	onNewFrame() {
		this.emitChildren("DOMObject", "*", "render", {document: this.document});
		setTimeout(()=>this.onNewFrame(), this.update_period || 1000);
	}
	
	getElement() {
		return this.document.body;
	}
}
