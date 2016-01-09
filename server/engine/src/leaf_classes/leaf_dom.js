import LeafDOMObject from "leaf_dom_object.js";

export default class LeafDOM extends LeafDOMObject
{
	static getPropList() {
		return {
		}
	}
	
	init() {
		if (typeof(document) !== "object")
			throw new Error("Can't find DOM object");
		if (typeof(window) !== "object")
			throw new Error("Can't find window object");
		console.log("LeafDOM initialized");
		this.document = document;
		this.onNewFrame();
	}
	
	onNewFrame() {
		console.log("onNewFrame");
		this.emitChildren("LeafDOMObject", "*", "render", {document: this.document});
		setTimeout(()=>this.onNewFrame(), this.update_period || 1000);
	}
	
	getDocument() {
		return this.document;
	}
	
	render() {
		console.log("render dom");
	}

}
