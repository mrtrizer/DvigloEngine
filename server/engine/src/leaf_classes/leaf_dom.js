import Leaf from "leaf.js";

export default class LeafCanvas extends Leaf
{
	static getPropList() {
		return {
		}
	}
	
	init(){
		console.log("LeafDOM initialized");
		this.document = document;
	}

}
