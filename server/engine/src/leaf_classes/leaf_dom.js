import Leaf from "leaf.js";

export default class LeafDOM extends Leaf
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
		this.render();
		window.requestAnimationFrame(() => this.onNewFrame());
	}
	
	render () {
		console.log("render dom");
		this.genEvent("LeafDOMElement", "render");
	}

}
