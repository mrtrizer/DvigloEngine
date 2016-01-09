import LeafDOMObject from "leaf_dom_object.js";

export default class LeafDOMElement extends LeafDOMObject
{
	static getPropList() {
		return {
			style : {type: "string", def: ""},
			type : {type: "variant", list:["div", "button"], def: "div"},
			params : {type: "JSON", def: {}}
		}
	}
	
	init() {
		if (typeof(this.type) !== "string")
			throw new Error("Invalid element type");
		this.element = this.getDocument().createElement(this.type);
		this.element.style.cssText = this.style;
		this.parentElement.getElement().appendChild(this.element);
	}
	
	getElement() {
		return this.element;
	}
	
	render () {
	}

}
