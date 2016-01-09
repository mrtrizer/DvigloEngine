import LeafDOMObject from "leaf_dom_object.js";

export default class LeafDOMElement extends LeafDOMObject
{
	static getPropList() {
		return {
		}
	}
	
	init() {
		this.element = this.getDocument().createElement(this.type);
		this.element.style = this.style;
		console.log(this.element);
		this.parentElement.getElement().appendChild(this.element);
	}
	
	getElement() {
		return this.element;
	}
	
	render () {
		console.log("render dom element");
	}

}
