import LeafDOMObject from "leaf_dom_object.js";

export default class LeafDOMElement extends LeafDOMObject
{
	static getPropList() {
		return {
			style : {type: "str", def: ""},
			type : {type: "sw", list:["div", "button"], def: "div"},
			params : {type: "json", def: {}}
		}
	}
	
	///Creates an element and places it to a DOM
	init() {
		if (typeof(this.type) !== "string")
			throw new Error("Invalid element type");
		this.element = this.getDocument().createElement(this.type);
		this.element.style.cssText = this.style;
		this.parentElement.getElement().appendChild(this.element);
	}
	
	///Returns DOM element
	getElement() {
		return this.element;
	}
	
	///Used to update DOM element
	render () {
	}

}
